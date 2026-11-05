import { useEffect, useMemo, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { catalogo } from './modelo/catalogo.js'
import { montoSimple, montoCompuesto, construirTablaSimple, construirTablaCompuesta } from './modelo/interes.js'
import { crearRonda, crearInversion, validarInversion, avanzarPeriodo, calcularResumenRonda } from './modelo/inversiones.js'
import { compararGemelos, primerPeriodoConDiferencia } from './modelo/comparacion.js'
import { etapas } from './datos/etapas.js'
import { pedagogia } from './datos/pedagogia.js'
import { pistas } from './datos/pistas.js'
import { entorno } from './utilidades/entorno.js'
import { formatoMonedas } from './utilidades/formato.js'
import { crearSala, obtenerSala, actualizarMeta, reiniciarSala, unirse, observarSala, guardarProgreso, modoDemostracion } from './servicios/sesionService.js'
import './App.css'
import './demo.css'

const STORAGE = 'qri:demo:v1'
const readStore = () => { try { return JSON.parse(localStorage.getItem(STORAGE) || '{}') } catch { return {} } }
const routeTo = (path) => { history.pushState({}, '', path); window.dispatchEvent(new PopStateEvent('popstate')) }
const money = (n) => formatoMonedas(n)
const syncErrorMessage = (error) => {
  const code = String(error?.code || '')
  if (code.includes('operation-not-allowed')) return 'Activa el acceso anónimo en Firebase Authentication y vuelve a desplegar.'
  if (code.includes('permission_denied') || code.includes('PERMISSION_DENIED')) return 'Firebase rechazó el acceso. Revisa que publicaste database.rules.json.'
  if (code.includes('network-request-failed')) return 'No hay conexión con Firebase. Revisa la URL de Realtime Database y vuelve a intentar.'
  if (error?.message?.includes('caducada')) return 'Esta sala finalizó o caducó. Pide a tu profe crear otra.'
  return 'No pudimos conectar con Firebase. Revisa la configuración del proyecto y de Vercel.'
}

function App() {
  const [path, setPath] = useState(location.pathname)
  const [store, setStore] = useState(readStore)
  useEffect(() => { const change = () => setPath(location.pathname); addEventListener('popstate', change); return () => removeEventListener('popstate', change) }, [])
  useEffect(() => { try { localStorage.setItem(STORAGE, JSON.stringify(store)) } catch { /* memoria sigue disponible */ } }, [store])
  const roomMatch = path.match(/^\/(?:unirse|estudiante)\/([A-Z0-9]{5})$/)
  if (path.startsWith('/docente')) return <Teacher store={store} setStore={setStore} />
  if (path.startsWith('/unirse')) return <Join code={roomMatch?.[1]} store={store} setStore={setStore} />
  if (path.startsWith('/estudiante')) return <Student code={roomMatch?.[1] || store.codigo || 'DEMO1'} store={store} setStore={setStore} />
  if (path === '/') return <Home />
  return <main className="qri-page"><h1>No encontramos esa página</h1><button className="qri-button" onClick={() => routeTo('/')}>Volver al inicio</button></main>
}

function Home() {
  return <main className="qri-home">
    <nav className="qri-nav"><a className="qri-brand" href="/">🪙 QR <strong>Inversores</strong></a><span>Aprende haciendo</span></nav>
    <section className="qri-hero"><div><span className="qri-eyebrow">UN JUEGO PARA DESCUBRIR LAS MATEMÁTICAS</span><h1>¿Y si tu dinero<br /><em>pudiera crecer?</em></h1><p>Explora, predice y descubre cómo funcionan el interés simple y compuesto. Aquí las monedas son ficticias; las ideas, tuyas.</p><div className="qri-home-actions"><button className="qri-button" onClick={() => routeTo('/docente')}>Soy docente <span>→</span></button><button className="qri-button qri-button-light" onClick={() => routeTo('/unirse')}>Soy estudiante <span>→</span></button></div><small>Sin cuentas · Sin dinero real · A tu ritmo</small></div><div className="qri-hero-art"><div className="qri-sun" /><div className="qri-coin coin-one">🪙</div><div className="qri-coin coin-two">✨</div><div className="qri-plant">🌱</div><div className="qri-art-note">Una decisión<br />a la vez</div></div></section>
    <section className="qri-home-bottom"><span>01 — ELIGE</span><span>02 — PREDICE</span><span>03 — DESCUBRE</span><span>Sin apuros, sin rankings. Solo curiosidad.</span></section>
  </main>
}

function Teacher({ store, setStore }) {
  const [copied, setCopied] = useState(false)
  const [message, setMessage] = useState('')
  const codigo = store.codigo
  const url = `${entorno.urlPublica}/unirse/${codigo || 'XXXXX'}`
  const participants = store.participantes || []
  const participantesConectados = participants.filter((person) => person.conectado !== false).length
  useEffect(() => {
    if (!codigo) return undefined
    return observarSala(codigo, (room) => { if (room) setStore((s) => ({ ...s, sala: room.meta || s.sala, participantes: Object.values(room.participantes || {}) })) })
  }, [codigo, setStore])
  const startRoom = async () => { try { const { codigo: code } = await crearSala(); const room = await obtenerSala(code); setStore((s) => ({ ...s, codigo: code, sala: room?.meta || { estado: 'esperando', etapaMaxima: 7, creada: Date.now() }, participantes: [] })); routeTo(`/docente/${code}`) } catch (error) { setMessage(syncErrorMessage(error)) } }
  const changeRoom = async (changes) => {
    try {
      if (codigo) await actualizarMeta(codigo, changes)
      setStore((s) => ({ ...s, sala: { ...(s.sala || {}), ...changes } }))
      setMessage('')
    } catch (error) { setMessage(syncErrorMessage(error)) }
  }
  const resetRoom = async () => {
    if (!confirm('¿Reiniciar el progreso de esta sala?')) return
    try {
      await reiniciarSala(codigo)
      setStore((s) => ({ ...s, sala: { ...s.sala, estado: 'esperando', epoca: (s.sala?.epoca || 0) + 1 } }))
      setMessage('La sala se reinició; cada estudiante conserva su apodo y avatar.')
    } catch (error) { setMessage(syncErrorMessage(error)) }
  }
  return <main className="qri-page qri-teacher"><header className="qri-page-head"><a href="/" className="qri-brand">🪙 QR <strong>Inversores</strong></a><span>Panel docente</span></header>{Boolean(codigo && participants.length) && <TeacherResults participants={participants} />}
    {!codigo ? <section className="qri-welcome-card"><span className="qri-eyebrow">TU AULA, LISTA PARA EXPLORAR</span><h1>Una sala para<br />aprender en equipo.</h1><p>Crea una sala, proyecta el código y acompaña el recorrido a tu ritmo.</p><button className="qri-button" onClick={startRoom}>Crear sala <span>→</span></button><div className="qri-divider"><span>o retoma una sala</span></div><button className="qri-text-button" onClick={() => routeTo('/unirse')}>Ingresar como estudiante →</button></section> : <>
      {modoDemostracion && <div className="qri-demo-banner"><strong>Modo local activo.</strong> El QR abre las actividades, pero el panel no recibirá avances de otros teléfonos hasta conectar Firebase en Vercel y volver a desplegar.</div>}
      <div className="qri-title-row"><div><span className="qri-eyebrow">SALA DE APRENDIZAJE</span><h1>La clase está <em>{store.sala?.estado === 'activa' ? 'en marcha' : store.sala?.estado === 'pausada' ? 'en pausa' : store.sala?.estado === 'finalizada' ? 'finalizada' : 'por comenzar'}</em></h1></div><button className="qri-button qri-button-light" onClick={startRoom}>Nueva sala</button></div>
      <div className="qri-teacher-grid"><section className="qri-panel qri-room-card"><div className="qri-qr-wrap"><QRCodeSVG value={url} size={260} level="H" includeMargin /></div><span className="qri-eyebrow">CÓDIGO DE LA SALA</span><div className="qri-room-code">{codigo}</div><p>Escanea para entrar o escribe el código en tu celular.</p><button className="qri-button qri-button-small" onClick={() => { navigator.clipboard?.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1800) }}>{copied ? 'Enlace copiado ✓' : 'Copiar enlace'}</button><a className="qri-link" href={url}>{url}</a></section>
        <section className="qri-panel qri-room-controls"><div className="qri-section-head"><div><span className="qri-eyebrow">RITMO DE LA CLASE</span><h2>Tu sala</h2></div><span className={`qri-status ${store.sala?.estado}`}>{store.sala?.estado || 'esperando'}</span></div><div className="qri-control-row"><button disabled={store.sala?.estado === 'finalizada'} className="qri-button" onClick={() => changeRoom({ estado: store.sala?.estado === 'activa' ? 'pausada' : 'activa' })}>{store.sala?.estado === 'activa' ? 'Pausar' : store.sala?.estado === 'pausada' ? 'Reanudar' : 'Iniciar'}</button><button className="qri-button qri-button-light" onClick={resetRoom}>Reiniciar</button><button className="qri-button qri-button-light" onClick={() => changeRoom({ estado: 'finalizada' })}>Finalizar</button></div><label className="qri-label">Etapa máxima para la clase<select value={store.sala?.etapaMaxima ?? 7} onChange={(e) => changeRoom({ etapaMaxima: Number(e.target.value) })}>{etapas.slice(1).map((e) => <option key={e.id} value={e.id}>E{e.id} · {e.titulo}</option>)}</select></label><div className="qri-participant-title"><h3>Participantes</h3><span>{participantesConectados} conectados · {participants.length} total</span></div><div className="qri-participant-list">{participants.length ? participants.map((p) => <span key={p.alias}>{p.avatar} {p.alias} <small>E{p.etapa || 0} {p.conectado === false ? '· desconectado' : ''}</small></span>) : <p className="qri-empty">Cuando tus estudiantes entren, aparecerán aquí.</p>}</div>{message && <p className="qri-note">{message}</p>}</section></div>
      <section className="qri-panel qri-teacher-bottom"><div><span className="qri-eyebrow">UNA PREGUNTA PARA CONVERSAR</span><h2>¿Qué observas en el crecimiento?</h2><p>Una buena comparación comienza con las mismas condiciones.</p></div><div className="qri-discussion"><button className="qri-button qri-button-small" onClick={() => { changeRoom({ preguntaActiva: { id: `${Date.now()}`, texto: '¿La ganancia de cada periodo se mantiene igual?', ts: Date.now() } }); setMessage('Pregunta detonante compartida con la sala.') }}>Compartir pregunta</button><span>¿La ganancia de cada periodo se mantiene igual?</span></div></section>
    </>}
  </main>
}

function Join({ code, store, setStore }) {
  const [alias, setAlias] = useState('')
  const [avatar, setAvatar] = useState('🦊')
  const [error, setError] = useState('')
  const avatars = ['🦊', '🐼', '🐸', '🦉', '🐻', '🐢', '🐝', '🦋']
  const enter = async (e) => { e.preventDefault(); const name = alias.trim(); if (name.length < 2 || name.length > 14) return setError('El apodo debe tener entre 2 y 14 caracteres.'); const codigo = (code || store.codigo || '').toUpperCase(); if (codigo.length !== 5) return setError('Revisa el código de sala: debe tener 5 caracteres.'); try { const person = await unirse(codigo, { alias: name, avatar, etapa: 0 }); setStore((s) => ({ ...s, codigo, perfil: person, participantes: [...(s.participantes || []).filter((p) => p.uid !== person.uid), person], ...(s.codigo === codigo ? {} : { ronda: crearRonda(), etapa: 0, hecho: {} }) })); routeTo(`/estudiante/${codigo}`) } catch (error) { setError(syncErrorMessage(error)) } }
  return <main className="qri-page qri-join-page"><header className="qri-page-head"><a href="/" className="qri-brand">🪙 QR <strong>Inversores</strong></a><a href="/" className="qri-back">← Inicio</a></header>{modoDemostracion && <div className="qri-demo-banner">Puedes iniciar la actividad en este teléfono. Sin Firebase, tu progreso no se compartirá con el panel docente.</div>}<form className="qri-join-card" onSubmit={enter}><span className="qri-eyebrow">{code ? `SALA ${code}` : 'INGRESAR A UNA SALA'}</span><h1>¡Qué bueno<br />que estés aquí!</h1><p>Elige un apodo y un avatar. No uses tu nombre completo.</p>{!code && <label className="qri-label">Código de sala<input value={store.codigo || ''} onChange={(e) => setStore((s) => ({ ...s, codigo: e.target.value.toUpperCase() }))} maxLength={5} placeholder="Ej. K7M2P" /></label>}<label className="qri-label">Tu apodo<input value={alias} onChange={(e) => setAlias(e.target.value)} minLength={2} maxLength={14} placeholder="Entre 2 y 14 letras" autoFocus /></label><span className="qri-label qri-avatar-label">Elige tu avatar</span><div className="qri-avatar-grid">{avatars.map((a) => <button type="button" key={a} className={avatar === a ? 'selected' : ''} aria-label={`Elegir ${a}`} onClick={() => setAvatar(a)}>{a}</button>)}</div>{error && <p className="qri-error" role="alert">{error}</p>}<button className="qri-button qri-join-submit" type="submit">Entrar a la sala <span>→</span></button></form></main>
}

function Student({ code, store, setStore }) {
  const [round, setRound] = useState(store.ronda || crearRonda())
  const [stage, setStage] = useState(store.etapa || 0)
  const [selected, setSelected] = useState('S1')
  const [amount, setAmount] = useState(500)
  const [term, setTerm] = useState(6)
  const [prediction, setPrediction] = useState('')
  const [notice, setNotice] = useState('')
  const [done, setDone] = useState(store.hecho || {})
  const [room, setRoom] = useState(store.sala || null)
  const [lab, setLab] = useState({ capital: 1000, tasa: 0.03, periodos: 6, variable: 'capital' })
  const [conclusion, setConclusion] = useState('')
  const profile = useMemo(() => store.perfil || { alias: 'Explorador', avatar: '🦊' }, [store.perfil])
  const data = pedagogia[stage]
  const summary = useMemo(() => calcularResumenRonda(round), [round])
  useEffect(() => { let previousEpoch; return observarSala(code, (value) => { if (!value?.meta) return; const epoch = value.meta.epoca || 0; setRoom(value.meta); if (previousEpoch !== undefined && epoch !== previousEpoch) { const reset = crearRonda(); setRound(reset); setStage(0); setDone({}); setStore((s) => ({ ...s, sala: value.meta, ronda: reset, etapa: 0, hecho: {} })) } previousEpoch = epoch; setStore((s) => ({ ...s, sala: value.meta })) }) }, [code, setStore])
  useEffect(() => { setStore((s) => ({ ...s, codigo: code, perfil: profile, ronda: round, etapa: stage, hecho: done })) }, [code, profile, round, stage, done, setStore])
  useEffect(() => { if (!profile.uid) return undefined; const timer = setTimeout(() => guardarProgreso(code, profile.uid, summary, stage).catch(() => {}), 600); return () => clearTimeout(timer) }, [code, profile.uid, summary, stage])
  const commitRound = (next) => { setRound(next); setStore((s) => ({ ...s, ronda: next })) }
  const tryInvest = () => {
    if (room?.estado === 'esperando') return setNotice('Tu profe todavía no ha iniciado la sala.')
    if (room?.estado === 'finalizada') return setNotice('La sala terminó. Puedes revisar tu resumen.')
    const validation = validarInversion({ productoId: selected, monto: Number(amount), plazo: Number(term), periodoActual: round.periodoActual, disponible: round.disponible, activas: round.inversiones.filter((i) => i.estado === 'activa').length, etapa: stage, salaPausada: store.sala?.estado === 'pausada' })
    if (!validation.ok) { const labels = { PRODUCTO_BLOQUEADO: 'Ese producto se desbloquea más adelante 🔒', MONTO_NO_MULTIPLO: 'Elige montos de 50 en 50.', MONTO_BAJO_MINIMO: 'Este producto pide un monto mínimo mayor.', SIN_FONDOS: 'No te alcanza el dinero disponible.', PLAZO_FUERA_RANGO: 'El plazo no está disponible para ese producto.', EXCEDE_HORIZONTE: 'La inversión terminaría después del periodo 12.', MAX_ACTIVAS: 'Ya tienes 4 inversiones activas.', SALA_PAUSADA: 'Tu profe pausó la sala.' }; setNotice(labels[validation.codigo]); return }
    if (stage === 1 && !prediction) { setNotice('Antes de invertir, escribe una predicción del monto final.'); return }
    const investment = crearInversion({ productoId: selected, monto: Number(amount), plazo: Number(term), periodoActual: round.periodoActual, prediccion: Number(prediction) || null })
    commitRound({ ...round, disponible: round.disponible - investment.monto, inversiones: [...round.inversiones, investment] })
    setDone((d) => ({ ...d, firstInvest: true })); setNotice('¡Decisión registrada! Ahora observa cómo crece tu inversión.')
  }
  const investCompound = ({ productoId, monto, plazo, prediccion }) => {
    if (room?.estado === 'pausada' || room?.estado === 'esperando' || room?.estado === 'finalizada') return setNotice(room.estado === 'pausada' ? 'Tu profe pausó la sala.' : 'Tu profe todavía no ha iniciado la sala.')
    const result = validarInversion({ productoId, monto, plazo, periodoActual: round.periodoActual, disponible: round.disponible, activas: round.inversiones.filter((i) => i.estado === 'activa').length, etapa: 4 })
    if (!result.ok) return setNotice('Revisa el monto, el plazo y el dinero disponible para esta inversión.')
    const inversion = crearInversion({ productoId, monto, plazo, periodoActual: round.periodoActual, prediccion })
    commitRound({ ...round, disponible: round.disponible - monto, inversiones: [...round.inversiones, inversion] })
    setNotice('Inversión compuesta registrada. Avanza el tiempo para observar el saldo.')
  }
  const advance = (until = false) => {
    if (room?.estado === 'esperando') return setNotice('Tu profe todavía no ha iniciado la sala.')
    if (room?.estado === 'finalizada') return setNotice('La sala terminó. Puedes revisar tu resumen.')
    if (room?.estado === 'pausada') return setNotice('Tu profe pausó la sala. ¡Un momento!')
    let next = round
    const vencimiento = until ? Math.min(...round.inversiones.filter((i) => i.estado === 'activa').map((i) => i.inicio + i.plazo), 12) : round.periodoActual + 1
    do { next = avanzarPeriodo(next) } while (until && next.periodoActual < vencimiento)
    if (next.periodoActual === round.periodoActual) return setNotice('Ya llegaste al periodo 12.')
    commitRound(next)
    if (next.inversiones.some((i) => i.estado === 'vencida' && i.inicio + i.plazo === next.periodoActual)) { setDone((d) => ({ ...d, matured: true })); setNotice('¡Tu inversión venció! Mira la ganancia y compárala con tu predicción.') }
  }
  const completeStage = (next, label) => { if (room?.etapaMaxima && next > room.etapaMaxima) return setNotice('¡Espera a tu profe! Puedes volver al Laboratorio mientras tanto.'); setDone((d) => ({ ...d, [label]: true })); setStage(next); setNotice(`Etapa ${next} desbloqueada. ¡Sigue explorando!`) }
  const restart = () => { if (confirm('¿Empezar una nueva práctica? Tu historial del recorrido se conserva.')) { commitRound(crearRonda()); setNotice('Tu ronda de práctica comenzó de nuevo.') } }
  const product = catalogo.find((p) => p.id === selected) || catalogo[0]
  const setLabValue = (key, value) => setLab((current) => ({ ...current, [key]: Number(value) }))
  const currentProducts = catalogo.filter((p) => stage >= p.etapa)
  if (stage === 6) return <PlanStage profile={profile} code={code} onComplete={() => completeStage(7, 'stage6')} notice={setNotice} />
  if (stage === 7) return <ModelVerification profile={profile} code={code} done={done} setDone={setDone} notice={setNotice} />
  return <main className="qri-student">
    <header className="qri-student-top"><a className="qri-brand" href="/">🪙 QR <strong>Inversores</strong></a><div className="qri-student-person"><span>{profile.avatar} {profile.alias}</span><span className="qri-room-pill">Sala {code}</span></div></header>{modoDemostracion && <div className="qri-demo-banner qri-student-demo">Actividad local en este teléfono. Para que tu profe vea tu avance, necesita habilitar Firebase en Vercel.</div>}{room?.preguntaActiva?.texto && <div className="qri-class-question"><span>💬 PREGUNTA DE TU PROFE</span><strong>{room.preguntaActiva.texto}</strong></div>}
    <div className="qri-student-shell"><aside className="qri-sidebar"><div className="qri-mini-profile"><span>{profile.avatar}</span><div><strong>{profile.alias}</strong><small>Tu recorrido</small></div></div><div className="qri-stage-list">{etapas.map((item) => <button key={item.id} className={`${stage === item.id ? 'current' : ''} ${stage > item.id ? 'past' : ''}`} onClick={() => item.id <= stage && setStage(item.id)}><span>{stage > item.id ? '✓' : `0${item.id}`}</span><span>{item.titulo}</span>{item.id > stage && <small>🔒</small>}</button>)}</div><div className="qri-sidebar-note">Sin prisa.<br />Cada idea cuenta.</div></aside>
      <section className="qri-learning-area"><div className="qri-student-heading"><div><span className="qri-eyebrow">TU RECORRIDO · ETAPA 0{stage}</span><h1>{etapas[stage].titulo}<span className="qri-title-dot">.</span></h1><p>{etapas[stage].accion}</p></div><span className="qri-step-count">{stage + 1} / 8</span></div>
        <div className="qri-balance-grid">{[['Disponible', money(summary.disponible), '💰'], ['Invertido', money(summary.invertido), '🌱'], ['Ganancias', money(summary.ganancias), '✨'], ['Patrimonio', money(summary.patrimonio), '🏦'], ['Periodo', `${summary.periodo} / 12`, '◷']].map(([label, value, icon]) => <div className="qri-balance" key={label}><span>{icon} {label}</span><strong>{value}</strong></div>)}</div>
        {stage === 4 && <CompoundBuilder onComplete={() => completeStage(5, 'stage4')} />}
        {stage === 4 && <CompoundInvestment round={round} summary={summary} onInvest={investCompound} onAdvance={advance} />}
        <div className="qri-workspace-grid"><div className="qri-workspace-main">
          {stage === 0 && <section className="qri-card qri-welcome-student"><span className="qri-big-emoji">{profile.avatar}</span><div><span className="qri-eyebrow">HOLA, {profile.alias.toUpperCase()}</span><h2>Tu aventura comienza aquí.</h2><p>Vas a tomar decisiones, probar ideas y descubrir reglas. Nadie te va a calificar por cuánto dinero ganes.</p><div className="qri-mini-steps"><span>🪙 Tienes dinero</span><span>🌱 Puedes hacerlo crecer</span><span>✨ Tú decides</span></div><button className="qri-button" onClick={() => completeStage(1, 'welcome')}>Comenzar recorrido →</button></div></section>}
          {stage === 1 && <><section className="qri-card qri-investment"><div className="qri-card-heading"><div><span className="qri-eyebrow">ELIGE TU INVERSIÓN</span><h2>¿Qué quieres probar?</h2></div><span className="qri-type-chip simple">Interés simple</span></div><div className="qri-product-grid">{currentProducts.map((p) => <button key={p.id} className={`qri-product ${selected === p.id ? 'selected' : ''} ${p.tipo}`} onClick={() => { setSelected(p.id); setTerm(Math.max(term, p.plazoMin)) }}><span className="qri-product-icon">{p.icono}</span><strong>{p.nombre}</strong><small>{Math.round(p.tasa * 100)} % por periodo</small><span className={`qri-type-chip ${p.tipo}`}>{p.tipo === 'simple' ? 'Simple' : 'Compuesto'}</span><small>Mínimo {money(p.minimo)} · {p.plazoMin}–12 periodos</small></button>)}</div>
            <div className="qri-form-grid"><label className="qri-label">¿Cuánto inviertes? <strong>{money(amount)}</strong><input type="range" min={product.minimo} max={Math.max(product.minimo, Math.min(summary.disponible, 1000))} step="50" value={Math.min(amount, Math.max(product.minimo, summary.disponible))} onChange={(e) => setAmount(Number(e.target.value))} /><small>De 50 en 50 monedas</small></label><label className="qri-label">¿Cuánto tiempo? <strong>{term} periodos</strong><input type="range" min={product.plazoMin} max={Math.max(product.plazoMin, Math.min(product.plazoMax, 12 - round.periodoActual))} step="1" value={Math.min(term, Math.max(product.plazoMin, 12 - round.periodoActual))} onChange={(e) => setTerm(Number(e.target.value))} /><small>Tu dinero queda guardado hasta el vencimiento</small></label></div>
            <div className="qri-prediction"><label className="qri-label">Antes de invertir, ¿cuál crees que será el monto final?<input type="number" min="0" step="0.01" value={prediction} onChange={(e) => setPrediction(e.target.value)} placeholder="Escribe tu predicción" /></label><span>Tu predicción no tiene que ser exacta. Sirve para comparar después.</span></div>
            <div className="qri-preview"><span>Tu elección: {money(amount)} durante {term} periodos</span><span>El resultado aparecerá después de invertir.</span></div><button className="qri-button" onClick={tryInvest}>Hacer mi inversión <span>→</span></button></section>
            <section className="qri-card"><div className="qri-card-heading"><div><span className="qri-eyebrow">MIS INVERSIONES</span><h2>Decisiones en marcha</h2></div><button className="qri-text-button" onClick={restart}>Nueva práctica ↻</button></div>{round.inversiones.length ? <div className="qri-investment-list">{round.inversiones.map((i) => { const p = catalogo.find((x) => x.id === i.productoId); return <div className="qri-investment-row" key={i.id}><span>{p.icono}</span><div><strong>{p.nombre} · {money(i.monto)}</strong><small>Vence en periodo {i.inicio + i.plazo} · predicción {i.prediccion ? money(i.prediccion) : '—'}</small></div><span className={`qri-status ${i.estado}`}>{i.estado}</span></div> })}</div> : <p className="qri-empty">Todavía no hay inversiones. Haz una predicción para empezar.</p>}<div className="qri-control-row"><button className="qri-button qri-button-small" onClick={() => advance(false)}>Avanzar 1 periodo →</button><button className="qri-button qri-button-light qri-button-small" onClick={() => advance(true)}>Hasta el siguiente vencimiento</button></div>{round.inversiones.some((i) => i.estado === 'vencida') && <div className="qri-reflect"><span>Una pausa para pensar</span><h3>¿Qué pasó con tu predicción?</h3><p>¿Qué observaste cuando el dinero llegó al vencimiento? ¿Qué cambiarías la próxima vez?</p><textarea placeholder="Escribe una idea que descubriste" onChange={(e) => setConclusion(e.target.value)} /><button className="qri-text-button" onClick={() => { if (conclusion.trim()) { setDone((d) => ({ ...d, reflection: true })); setNotice('Reflexión guardada. Tu observación completa la etapa.') } }}>Guardar reflexión</button>{done.reflection && <button className="qri-button qri-button-small" onClick={() => completeStage(2, 'stage1')}>Continuar al Laboratorio →</button>}</div>}</section></>}
          {stage === 2 && <section className="qri-card"><span className="qri-eyebrow">LABORATORIO · SIMULACIÓN SIN COSTO</span><h2>¿Qué cambia si mueves una sola cosa?</h2><p>Elige una variable, modifica su valor y observa la tabla.</p><label className="qri-label">Variable para explorar<select value={lab.variable} onChange={(e) => setLab((v) => ({ ...v, variable: e.target.value }))}><option value="capital">Capital</option><option value="tasa">Tasa</option><option value="periodos">Periodos</option></select></label><div className="qri-form-grid">{[['capital', 'Capital', 100, 1000, 50], ['tasa', 'Tasa (%)', 2, 5, 1], ['periodos', 'Periodos', 1, 12, 1]].map(([key, label, min, max, step]) => <label className="qri-label" key={key}>{label}<input type="range" min={min} max={max} step={step} value={key === 'tasa' ? lab[key] * 100 : lab[key]} onChange={(e) => setLabValue(key, key === 'tasa' ? Number(e.target.value) / 100 : e.target.value)} /><strong>{key === 'capital' ? money(lab[key]) : key === 'tasa' ? `${lab[key] * 100} %` : lab[key]}</strong></label>)}</div><div className="qri-table-wrap"><table><thead><tr><th>Periodo</th><th>Saldo inicial</th><th>Ganancia</th><th>Saldo final</th></tr></thead><tbody>{construirTablaSimple(lab.capital, lab.tasa, lab.periodos).slice(1).map((r) => <tr key={r.periodo}><td>{r.periodo}</td><td>{money(r.saldoInicial)}</td><td>{money(r.interes)}</td><td>{money(r.saldoFinal)}</td></tr>)}</tbody></table></div><p className="qri-muted">Los números se muestran con 2 decimales; el cálculo interno es exacto.</p><div className="qri-reflect"><h3>¿Qué observas?</h3><div className="qri-choice-row">{['La ganancia se mantiene igual', 'La ganancia cambia cada periodo'].map((a) => <button key={a} className={conclusion === a ? 'selected' : ''} onClick={() => setConclusion(a)}>{a}</button>)}</div><button className="qri-button qri-button-small" disabled={!conclusion || (done.lab || []).some((x) => x.variable === lab.variable)} onClick={() => { setDone((d) => ({ ...d, lab: [...(d.lab || []), { variable: lab.variable, conclusion }] })); setNotice('Experimento registrado. Prueba otra variable.') }}>Guardar este experimento ({(done.lab || []).length}/3)</button><button className="qri-button" disabled={(done.lab || []).length < 3} onClick={() => completeStage(3, 'stage2')}>Continuar →</button></div></section>}
          {stage === 3 && <RuleBuilder onComplete={() => completeStage(4, 'stage3')} notice={setNotice} />}
          {stage === 5 && <section className="qri-card"><span className="qri-eyebrow">COMPARADOR · MISMOS DATOS</span><h2>¿Cuándo se nota la diferencia?</h2><p>Capital inicial 1 000 monedas · tasa 2 % por periodo.</p><div className="qri-comparison">{[2, 4, 6, 8, 10, 12].map((n) => { const result = compararGemelos(1000, 0.02, n); return <div key={n}><span>Periodo {n}</span><div className="qri-bars"><i style={{ width: `${result.simple / 1400 * 100}%` }} /><i style={{ width: `${result.compuesto / 1400 * 100}%` }} /></div><small>Simple {money(result.simple)} · Compuesto {money(result.compuesto)}</small></div> })}</div><label className="qri-label">¿Desde qué periodo la diferencia llega a 10 monedas?<input id="advantage" type="number" placeholder="Tu predicción" /></label><button className="qri-button" onClick={() => { const n = Number(document.getElementById('advantage').value); const answer = primerPeriodoConDiferencia(1000, 0.02, 10, 24); if (n === answer) { setNotice(`¡Encontraste el punto de ventaja: periodo ${answer}!`); completeStage(6, 'stage5') } else setNotice('Observa las columnas de la tabla y vuelve a intentarlo.') }}>Comprobar punto de ventaja</button><p className="qri-muted">Simple = azul · Compuesto = verde</p></section>}
          {stage === 6 && <section className="qri-card"><span className="qri-eyebrow">TU PLAN · 12 PERIODOS</span><h2>Una meta que sea tuya.</h2><label className="qri-label">Mi meta de ahorro<input type="number" placeholder="¿Cuántas monedas te gustaría tener?" /></label><label className="qri-label">¿Por qué elegiste este plan?<textarea placeholder="Elige una estrategia y explica qué evidencia de la tabla la apoya." /></label><button className="qri-button" onClick={() => completeStage(7, 'stage6')}>Guardar y reflexionar →</button></section>}
          {stage === 7 && <section className="qri-card"><span className="qri-eyebrow">TU MAPA DEL MODELO</span><h2>Conecta lo que descubriste.</h2><div className="qri-model-map"><span>Capital C</span><b>→</b><span>Tasa i</span><b>→</b><span>Periodos n</span><b>→</b><span>Ganancia I</span><b>→</b><span>Monto final M</span></div><div className="qri-form-grid"><div><h3>Interés simple</h3><p>I = C · i · n</p><p>M = C + I</p></div><div><h3>Interés compuesto</h3><p>M = C(1 + i)<sup>n</sup></p><p>Cada periodo usa el saldo anterior.</p></div></div><button className="qri-button" onClick={() => { setDone((d) => ({ ...d, model: true })); setNotice('¡Completaste el recorrido! Ya puedes seguir explorando a tu ritmo.') }}>Completar mi mapa ✓</button></section>}
        </div><aside className="qri-learning-side"><section className="qri-pedagogy"><div className="qri-pedagogy-top"><span>🌿</span><span className="qri-eyebrow">TU APRENDIZAJE</span></div><h3>Lo que haces<br />matemáticamente</h3><p>{data.queHaces}</p><div className="qri-side-divider" /><span className="qri-eyebrow">TU REPRESENTACIÓN</span><p className="qri-representation">{data.tuRepresentacion}</p><span className="qri-eyebrow">TU MODELO</span><p>{data.tuModelo}</p><div className="qri-chip-group"><span className="qri-chip-label">EMR · principios</span>{data.emr.map((v) => <span className="qri-chip emr" key={v}>{v}</span>)}</div><div className="qri-chip-group"><span className="qri-chip-label">Aprendizaje realista</span>{data.ar.map((v) => <span className="qri-chip ar" key={v}>{v}</span>)}</div><button className="qri-text-button" onClick={() => setNotice('EMR vinculada a Freudenthal. Aprendizaje realista: adaptación pedagógica de Alsina (2009); reflexión basada en el ciclo de Korthagen.')}>¿De dónde viene esto?</button></section>
          <section className="qri-guide"><span>💡 Una pista para ti</span>{(pistas[stage === 1 ? 'inversion' : stage === 2 ? 'laboratorio' : stage === 4 ? 'compuesto' : 'simple'] || pistas.simple).slice(0, 2).map((tip) => <p key={tip}>{tip}</p>)}</section>
          <section className="qri-route-progress"><span className="qri-eyebrow">TU AVANCE</span><div className="qri-progress-track"><i style={{ width: `${stage / 7 * 100}%` }} /></div><span>{stage} de 7 etapas completadas</span></section>
        </aside></div>
        {notice && <div className="qri-toast" role="status"><span>{notice}</span><button onClick={() => setNotice('')} aria-label="Cerrar">×</button></div>}
      </section></div>
  </main>
}

function RuleBuilder({ onComplete, notice }) {
  const [choice, setChoice] = useState('suma')
  const [, setAttempts] = useState(0)
  const [verified, setVerified] = useState(false)
  const correct = choice === 'suma'
  return <section className="qri-card"><span className="qri-eyebrow">CONSTRUCTOR DE REGLAS · INTERÉS SIMPLE</span><h2>¿Cómo se calcula la ganancia?</h2><p>Usa las pistas y observa tres casos de interés simple antes de elegir una regla.</p><div className="qri-case-cards"><span>100 × 2 % × 3 periodos → 6</span><span>200 × 3 % × 4 periodos → 24</span><span>500 × 2 % × 10 periodos → 100</span></div><div className="qri-choice-row">{[['suma', 'Capital × tasa × periodos'], ['multiplica', 'Capital × (1 + tasa)'], ['otro', 'Capital + tasa + periodos']].map(([v, text]) => <button key={v} className={choice === v ? 'selected' : ''} onClick={() => setChoice(v)}>{text}</button>)}</div>{!verified && <button className="qri-button" onClick={() => { setAttempts((n) => n + 1); if (correct) { setVerified(true); notice('La regla coincide con tus casos. Has pasado de ejemplos a una relación general.') } else notice('Revisa cuánto gana el capital en cada periodo y prueba de nuevo.') }}>Probar mi regla</button>}{verified && <><p className="qri-success">Regla verificada: I = C · i · n y M = C + I</p><button className="qri-button" onClick={onComplete}>Continuar al interés compuesto →</button></>}</section>
}

function TeacherResults({ participants }) {
  const stages = Array.from({ length: 8 }, (_, stage) => participants.filter((p) => Number(p.etapa || 0) === stage).length)
  const simple = participants.reduce((total, p) => total + (p.resumen?.usoSimple || 0), 0)
  const compuesto = participants.reduce((total, p) => total + (p.resumen?.usoCompuesto || 0), 0)
  return <section className="qri-panel qri-results"><div className="qri-section-head"><div><span className="qri-eyebrow">LECTURA DEL GRUPO</span><h2>Así va el recorrido</h2></div><span className="qri-status">{participants.length} participantes</span></div><div className="qri-group-charts"><div><span>Participantes por etapa</span><div className="qri-group-bars">{stages.slice(1).map((count, index) => <div key={index} title={`E${index + 1}: ${count}`}><i style={{ height: `${Math.max(5, count / Math.max(1, participants.length) * 54)}px` }} /><small>E{index + 1}</small></div>)}</div></div><div><span>Inversiones registradas</span><div className="qri-type-summary"><span><i className="simple-dot" /> Simple {simple}</span><span><i className="compound-dot" /> Compuesto {compuesto}</span></div></div></div><div className="qri-table-wrap"><table><thead><tr><th>Participante</th><th>Etapa</th><th>Patrimonio (informativo)</th><th>Inversiones</th></tr></thead><tbody>{participants.map((p) => <tr key={p.uid || p.alias}><td>{p.avatar} {p.alias}</td><td>E{p.etapa || 0}</td><td>{p.resumen ? money(p.resumen.patrimonio ?? 1000) : '1 000,00 🪙'}</td><td>{p.resumen?.nInversiones ?? 0}</td></tr>)}</tbody></table></div></section>
}

function CompoundBuilder({ onComplete }) {
  const [periodChoice, setPeriodChoice] = useState('suma')
  const [generalChoice, setGeneralChoice] = useState('repite')
  const [periodVerified, setPeriodVerified] = useState(false)
  const [generalVerified, setGeneralVerified] = useState(false)
  const table = construirTablaCompuesta(1000, 0.05, 6)
  return <section className="qri-card qri-compound-builder"><span className="qri-eyebrow">INTERÉS COMPUESTO · CONSTRUYE TU REGLA</span><h2>El saldo también puede crecer.</h2><p>Observa cómo el saldo y la ganancia de cada periodo cambian en esta tabla.</p><div className="qri-table-wrap"><table><thead><tr><th>Periodo</th><th>Saldo inicial</th><th>Ganancia</th><th>Saldo final</th></tr></thead><tbody>{table.slice(1).map((row) => <tr key={row.periodo}><td>{row.periodo}</td><td>{money(row.saldoInicial)}</td><td>{money(row.interes)}</td><td>{money(row.saldoFinal)}</td></tr>)}</tbody></table></div><div className="qri-reflect"><h3>Regla por periodo</h3><p>¿Qué operación lleva el saldo de un periodo al siguiente?</p><div className="qri-choice-row">{[['suma', 'Sumar siempre la misma ganancia'], ['saldo', 'Multiplicar el saldo anterior por uno más la tasa']].map(([id, label]) => <button key={id} className={periodChoice === id ? 'selected' : ''} onClick={() => setPeriodChoice(id)}>{label}</button>)}</div><button className="qri-button qri-button-small" disabled={periodVerified} onClick={() => setPeriodVerified(periodChoice === 'saldo')}>Probar regla del periodo</button>{periodVerified && <><p className="qri-success">La regla coincide con los saldos observados.</p><h3>Ahora generaliza para cualquier periodo.</h3><div className="qri-choice-row">{[['repite', 'Capital inicial por uno más la tasa, repetido n periodos'], ['suma', 'Capital inicial más una ganancia igual cada periodo']].map(([id, label]) => <button key={id} className={generalChoice === id ? 'selected' : ''} onClick={() => setGeneralChoice(id)}>{label}</button>)}</div><button className="qri-button qri-button-small" disabled={generalVerified} onClick={() => setGeneralVerified(generalChoice === 'repite')}>Probar regla general</button></>}{generalVerified && <><p className="qri-success">Regla general verificada: M = C(1+i)<sup>n</sup></p><button className="qri-button" onClick={onComplete}>Continuar al comparador →</button></>}</div></section>
}

function CompoundInvestment({ round, summary, onInvest, onAdvance }) {
  const productosCompuestos = catalogo.filter((producto) => producto.tipo === 'compuesto')
  const [productId, setProductId] = useState('C1')
  const [amount, setAmount] = useState(500)
  const [term, setTerm] = useState(6)
  const [prediction, setPrediction] = useState('')
  const product = catalogo.find((item) => item.id === productId)
  const maxTerm = Math.max(product.plazoMin, Math.min(product.plazoMax, 12 - round.periodoActual))
  return <section className="qri-card qri-compound-investment"><span className="qri-eyebrow">PRUÉBALO CON UNA INVERSIÓN</span><h2>Elige un producto compuesto</h2><p>Primero predice; el monto final aparece cuando la inversión vence.</p><div className="qri-product-grid">{productosCompuestos.map((item) => <button key={item.id} className={`qri-product compuesto ${productId === item.id ? 'selected' : ''}`} onClick={() => { setProductId(item.id); setTerm(Math.max(term, item.plazoMin)); setAmount(Math.max(amount, item.minimo)) }}><span className="qri-product-icon">{item.icono}</span><strong>{item.nombre}</strong><small>{item.tasa * 100} % por periodo</small><small>Mínimo {money(item.minimo)} · {item.plazoMin}–12 periodos</small></button>)}</div><div className="qri-form-grid"><label className="qri-label">Monto · {money(amount)}<input type="range" min={product.minimo} max={Math.max(product.minimo, Math.min(summary.disponible, 1000))} step="50" value={Math.min(amount, Math.max(product.minimo, summary.disponible))} onChange={(e) => setAmount(Number(e.target.value))} /></label><label className="qri-label">Plazo · {term} periodos<input type="range" min={product.plazoMin} max={maxTerm} step="1" value={Math.min(term, maxTerm)} onChange={(e) => setTerm(Number(e.target.value))} /></label></div><label className="qri-label">¿Cuál es tu predicción del monto final?<input type="number" step="0.01" value={prediction} onChange={(e) => setPrediction(e.target.value)} placeholder="Tu predicción" /></label><button className="qri-button" onClick={() => onInvest({ productoId: productId, monto: amount, plazo: term, prediccion: Number(prediction) || null })}>Invertir y observar →</button>{round.inversiones.filter((i) => i.tipo === 'compuesto').length > 0 && <><h3 className="qri-active-title">Mis inversiones compuestas</h3>{round.inversiones.filter((i) => i.tipo === 'compuesto').map((i) => <div className="qri-investment-row" key={i.id}><span>🌱</span><div><strong>{catalogo.find((p) => p.id === i.productoId)?.nombre} · {money(i.monto)}</strong><small>{i.estado === 'vencida' ? `Monto final ${money(i.montoFinal)}` : `Vence en periodo ${i.inicio + i.plazo}`}</small></div><span className={`qri-status ${i.estado}`}>{i.estado}</span></div>)}<div className="qri-control-row"><button className="qri-button qri-button-small" onClick={() => onAdvance(false)}>Avanzar 1 periodo →</button><button className="qri-button qri-button-light qri-button-small" onClick={() => onAdvance(true)}>Hasta el vencimiento</button></div></>}</section>
}

function PlanStage({ profile, code, onComplete, notice }) {
  const [goal, setGoal] = useState('')
  const [simpleCapital, setSimpleCapital] = useState(500)
  const [compoundCapital, setCompoundCapital] = useState(500)
  const [justification, setJustification] = useState('')
  const [reflection, setReflection] = useState('')
  const [result, setResult] = useState(null)
  const execute = () => {
    if (!goal || !justification.trim() || simpleCapital + compoundCapital > 1000) return notice('Define una meta, distribuye hasta 1 000 monedas y explica tu elección antes de ejecutar.')
    const simple = montoSimple(simpleCapital, .02, 12)
    const compuesto = montoCompuesto(compoundCapital, .02, 12)
    setResult({ simple, compuesto, patrimonio: simple + compuesto, goal: Number(goal) })
  }
  return <main className="qri-student qri-special-stage"><header className="qri-student-top"><a className="qri-brand" href="/">🪙 QR <strong>Inversores</strong></a><span>{profile.avatar} {profile.alias} · Sala {code}</span></header>{modoDemostracion && <div className="qri-demo-banner qri-student-demo">Actividad local en este teléfono. Para sincronizar con el panel, conecta Firebase.</div>}<section className="qri-special-card"><span className="qri-eyebrow">ETAPA 06 · TU PLAN OFICIAL</span><h1>Una meta que sea tuya.</h1><p>Planea una estrategia para los próximos 12 periodos. El resultado aparecerá después de ejecutarla.</p><label className="qri-label">¿Cuántas monedas quieres reunir?<input type="number" min="1" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="Escribe tu meta" /></label><div className="qri-plan-split"><label className="qri-label">Estrategia simple · 2 % por periodo<strong>{money(simpleCapital)}</strong><input type="range" min="0" max="1000" step="50" value={simpleCapital} onChange={(e) => { const value = Number(e.target.value); setSimpleCapital(value); setCompoundCapital(Math.min(compoundCapital, 1000 - value)) }} /></label><label className="qri-label">Estrategia compuesta · 2 % por periodo<strong>{money(compoundCapital)}</strong><input type="range" min="0" max="1000" step="50" value={compoundCapital} onChange={(e) => { const value = Number(e.target.value); setCompoundCapital(value); setSimpleCapital(Math.min(simpleCapital, 1000 - value)) }} /></label></div><label className="qri-label">¿Por qué elegiste esta distribución?<textarea value={justification} onChange={(e) => setJustification(e.target.value)} placeholder="Apóyate en lo que observaste en tus tablas." /></label>{!result ? <button className="qri-button" onClick={execute}>Guardar estrategia y ejecutarla →</button> : <><div className="qri-plan-results"><h2>Tu plan después de 12 periodos</h2><p>Simple · {money(result.simple)}</p><p>Compuesto · {money(result.compuesto)}</p><strong>Patrimonio final · {money(result.patrimonio)}</strong><p>{result.patrimonio >= result.goal ? 'Tu plan alcanzó la meta.' : 'Tu plan quedó por debajo de la meta. La meta sigue siendo tuya; observa qué aprendiste.'}</p></div><label className="qri-label">¿Qué cambiarías o conservarías al revisar tu estrategia?<textarea value={reflection} onChange={(e) => setReflection(e.target.value)} placeholder="Registra una alternativa para probar." /></label><button className="qri-button" disabled={!reflection.trim()} onClick={() => { notice('Plan, justificación y reflexión guardados.'); onComplete() }}>Guardar reflexión y continuar →</button></>}</section></main>
}

function ModelVerification({ profile, code, done, setDone, notice }) {
  const scenarios = [{ id: 'simple', title: 'Escenario simple', type: 'simple', C: 500, i: .02, n: 8 }, { id: 'compuesto', title: 'Escenario compuesto', type: 'compuesto', C: 1000, i: .03, n: 4 }]
  const [predictions, setPredictions] = useState({})
  const [verified, setVerified] = useState(done.scenarios || {})
  const [mapComplete, setMapComplete] = useState(Boolean(done.model))
  useEffect(() => { if (Object.keys(verified).length) setDone((current) => ({ ...current, scenarios: verified })) }, [verified, setDone])
  const expected = (scenario) => scenario.type === 'simple' ? montoSimple(scenario.C, scenario.i, scenario.n) : montoCompuesto(scenario.C, scenario.i, scenario.n)
  return <main className="qri-student qri-special-stage"><header className="qri-student-top"><a className="qri-brand" href="/">🪙 QR <strong>Inversores</strong></a><span>{profile.avatar} {profile.alias} · Sala {code}</span></header>{modoDemostracion && <div className="qri-demo-banner qri-student-demo">Actividad local en este teléfono. Para sincronizar con el panel, conecta Firebase.</div>}<section className="qri-special-card"><span className="qri-eyebrow">ETAPA 07 · VERIFICA TU MODELO</span><h1>Prueba tu idea en casos nuevos.</h1><p>Escribe una predicción para cada escenario antes de comprobarla.</p><div className="qri-model-scenarios">{scenarios.map((s) => <article key={s.id}><h2>{s.title}</h2><p>Capital {money(s.C)} · tasa {s.i * 100} % · {s.n} periodos</p><label className="qri-label">Mi predicción del monto final<input type="number" step="0.01" value={predictions[s.id] || ''} onChange={(e) => setPredictions((p) => ({ ...p, [s.id]: e.target.value }))} placeholder="Predice antes de comprobar" /></label>{!verified[s.id] ? <button className="qri-button qri-button-small" disabled={!predictions[s.id]} onClick={() => setVerified((v) => ({ ...v, [s.id]: true }))}>Comprobar escenario</button> : <p className="qri-success">El modelo calcula {money(expected(s))}. {Math.abs(Number(predictions[s.id]) - expected(s)) < .005 ? 'Tu predicción coincide.' : 'Compara tu predicción con el resultado y observa la diferencia.'}</p>}</article>)}</div><div className="qri-model-map"><span>Capital C</span><b>→</b><span>Tasa i</span><b>→</b><span>Periodos n</span><b>→</b><span>Ganancia I</span><b>→</b><span>Monto final M</span></div>{Object.keys(verified).length === 2 && <><div className="qri-plan-results"><h2>Dos modelos, una misma situación de inversión</h2><p>Simple: I = C·i·n y M = C + I</p><p>Compuesto: M = C(1+i)<sup>n</sup></p></div><button className="qri-button" disabled={mapComplete} onClick={() => { setMapComplete(true); setDone((d) => ({ ...d, model: true })); notice('Completaste las dos verificaciones y el mapa del modelo.') }}>{done.model ? 'Recorrido completado ✓' : 'Completar mi mapa ✓'}</button></>}</section></main>
}

export default App
