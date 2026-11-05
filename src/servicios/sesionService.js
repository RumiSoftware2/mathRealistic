import { entorno, firebaseDisponible } from '../utilidades/entorno.js'

const alfabeto = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
const nuevoCodigo = () => Array.from(crypto.getRandomValues(new Uint8Array(5)), (n) => alfabeto[n % alfabeto.length]).join('')
const roomKey = (code) => `qri:room:v1:${code}`
const bc = typeof BroadcastChannel === 'undefined' ? null : new BroadcastChannel('qri:salas:v1')
let firebasePromise
let database
let authUid
const presenciaActiva = new Set()

async function firebase() {
  if (!firebaseDisponible) throw new Error('Firebase no está configurado')
  if (!firebasePromise) firebasePromise = (async () => {
    const [appSdk, authSdk, dbSdk] = await Promise.all([import('firebase/app'), import('firebase/auth'), import('firebase/database')])
    const app = appSdk.getApps().length ? appSdk.getApp() : appSdk.initializeApp(entorno.firebase)
    const auth = authSdk.getAuth(app)
    const credential = auth.currentUser ? { user: auth.currentUser } : await authSdk.signInAnonymously(auth)
    authUid = credential.user.uid
    database = dbSdk.getDatabase(app)
    return { dbSdk, db: database }
  })()
  return firebasePromise
}

const localRead = (code) => { try { return JSON.parse(localStorage.getItem(roomKey(code)) || 'null') } catch { return null } }
const localWrite = (code, value) => { localStorage.setItem(roomKey(code), JSON.stringify(value)); bc?.postMessage({ code, value }) }

export const modoDemostracion = !firebaseDisponible || entorno.modoSync === 'local'

export async function iniciar() {
  if (modoDemostracion) return sessionStorage.getItem('qri:uid') || (() => { const id = crypto.randomUUID(); sessionStorage.setItem('qri:uid', id); return id })()
  await firebase()
  return authUid
}

export async function crearSala() {
  if (modoDemostracion) {
    let code = nuevoCodigo()
    while (localRead(code)) code = nuevoCodigo()
    const value = { meta: { estado: 'esperando', etapaMaxima: 7, epoca: 0, creadaEn: Date.now(), version: 1 }, participantes: {}, compartidas: {} }
    localWrite(code, value)
    return { codigo: code }
  }
  const { dbSdk, db } = await firebase()
  let codigo = nuevoCodigo()
  while ((await dbSdk.get(dbSdk.ref(db, `sesiones/${codigo}/meta`))).exists()) codigo = nuevoCodigo()
  await dbSdk.set(dbSdk.ref(db, `sesiones/${codigo}/meta`), { docenteUid: authUid, estado: 'esperando', etapaMaxima: 7, epoca: 0, creadaEn: Date.now(), expiraEn: Date.now() + 86400000, version: 1 })
  return { codigo }
}

export async function obtenerSala(codigo) {
  if (modoDemostracion) return localRead(codigo)
  const { dbSdk, db } = await firebase()
  const snap = await dbSdk.get(dbSdk.ref(db, `sesiones/${codigo}`))
  return snap.exists() ? snap.val() : null
}

export async function actualizarMeta(codigo, parcial) {
  if (modoDemostracion) { const value = localRead(codigo); if (!value) throw new Error('Sala no encontrada'); localWrite(codigo, { ...value, meta: { ...value.meta, ...parcial } }); return }
  const { dbSdk, db } = await firebase()
  await dbSdk.update(dbSdk.ref(db, `sesiones/${codigo}/meta`), parcial)
}

export async function reiniciarSala(codigo) {
  if (modoDemostracion) {
    const value = localRead(codigo)
    if (!value) return
    localWrite(codigo, { ...value, meta: { ...value.meta, estado: 'esperando', epoca: (value.meta.epoca || 0) + 1 }, participantes: Object.fromEntries(Object.entries(value.participantes || {}).map(([uid, p]) => [uid, { alias: p.alias, avatar: p.avatar, uid, conectado: p.conectado, etapa: 0, epoca: (value.meta.epoca || 0) + 1 }])) })
    return
  }
  const { dbSdk, db } = await firebase()
  const ref = dbSdk.ref(db, `sesiones/${codigo}`)
  const snap = await dbSdk.get(ref)
  if (!snap.exists()) return
  const room = snap.val()
  const epoca = (room.meta?.epoca || 0) + 1
  const participantes = Object.fromEntries(Object.entries(room.participantes || {}).map(([uid, p]) => [uid, { alias: p.alias, avatar: p.avatar, conectado: false, etapa: 0, epoca }]))
  await dbSdk.update(ref, { meta: { ...room.meta, estado: 'esperando', epoca }, participantes })
}

export async function unirse(codigo, perfil) {
  const uid = await iniciar()
  if (modoDemostracion) {
    const value = localRead(codigo)
    if (!value) return { ...perfil, uid, modoLocal: true, conectado: false, etapa: 0 }
    if (value.meta?.estado === 'finalizada' || Date.now() > (value.meta?.expiraEn || value.meta?.creadaEn + 86400000)) throw new Error('Sala finalizada o caducada')
    const names = Object.values(value.participantes || {}).map((p) => p.alias.toLocaleLowerCase())
    let alias = perfil.alias; let index = 2
    while (names.includes(alias.toLocaleLowerCase())) { alias = `${perfil.alias.slice(0, 11)} ${index}`; index += 1 }
    const participante = { ...perfil, alias, uid, unidoEn: Date.now(), conectado: true, epoca: value.meta.epoca || 0 }
    localWrite(codigo, { ...value, participantes: { ...value.participantes, [uid]: participante } })
    return { ...participante, modoLocal: false }
  }
  const { dbSdk, db } = await firebase()
  const room = await dbSdk.get(dbSdk.ref(db, `sesiones/${codigo}/meta`))
  if (!room.exists() || room.val().estado === 'finalizada' || Date.now() > room.val().expiraEn) throw new Error('Sala no encontrada')
  const ref = dbSdk.ref(db, `sesiones/${codigo}/participantes/${uid}`)
  const previous = await dbSdk.get(ref)
  const perfilFinal = { uid, alias: perfil.alias, avatar: perfil.avatar, epoca: room.val().epoca || 0, unidoEn: Date.now(), conectado: true, etapa: 0, etapasCompletadas: [], resumen: { periodo: 0, disponible: 1000, invertido: 0, ganancias: 0, patrimonio: 1000, nInversiones: 0 } }
  if (!previous.exists()) await dbSdk.set(ref, perfilFinal)
  activarPresencia(dbSdk, db, codigo, uid)
  return previous.exists() ? { ...previous.val(), uid } : perfilFinal
}

function activarPresencia(dbSdk, db, codigo, uid) {
  const key = `${codigo}:${uid}`
  if (presenciaActiva.has(key)) return
  presenciaActiva.add(key)
  dbSdk.onValue(dbSdk.ref(db, '.info/connected'), async (snapshot) => {
    if (!snapshot.val()) return
    const ref = dbSdk.ref(db, `sesiones/${codigo}/participantes/${uid}`)
    try {
      await dbSdk.onDisconnect(ref).update({ conectado: false, ultimaVez: Date.now() })
      await dbSdk.update(ref, { conectado: true, ultimaVez: Date.now() })
    } catch { /* la presencia no debe bloquear el juego */ }
  })
}

export async function guardarParticipantes(codigo, participantes) {
  if (modoDemostracion) { const value = localRead(codigo); if (value) localWrite(codigo, { ...value, participantes: Object.fromEntries(participantes.map((p) => [p.uid || p.alias, p])) }); return }
}

export async function guardarProgreso(codigo, uid, resumen, etapa) {
  if (modoDemostracion) {
    const value = localRead(codigo)
    if (!value?.participantes?.[uid]) return
    const participante = value.participantes[uid]
    localWrite(codigo, { ...value, participantes: { ...value.participantes, [uid]: { ...participante, etapa, resumen } } })
    return
  }
  const { dbSdk, db } = await firebase()
  await dbSdk.update(dbSdk.ref(db, `sesiones/${codigo}/participantes/${uid}`), { etapa, resumen, ultimaVez: Date.now() })
}

export function observarSala(codigo, callback) {
  let stopped = false
  if (modoDemostracion) {
    const emit = () => { if (!stopped) callback(localRead(codigo)) }
    const storage = (event) => { if (!event.key || event.key === roomKey(codigo)) emit() }
    const channel = (event) => { if (event.data?.code === codigo) emit() }
    addEventListener('storage', storage); bc?.addEventListener('message', channel); emit()
    return () => { stopped = true; removeEventListener('storage', storage); bc?.removeEventListener('message', channel) }
  }
  firebase().then(({ dbSdk, db }) => {
    if (stopped) return
    const stop = dbSdk.onValue(dbSdk.ref(db, `sesiones/${codigo}`), (snap) => callback(snap.exists() ? snap.val() : null))
    if (stopped) stop()
    else cleanupFirebase = stop
  }).catch(() => callback(null))
  let cleanupFirebase = () => {}
  return () => { stopped = true; cleanupFirebase() }
}
