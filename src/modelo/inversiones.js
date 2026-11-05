import { catalogo, productoPorId } from './catalogo.js'
import { montoSimple, montoCompuesto, saldoSimple, saldoCompuesto } from './interes.js'

export function validarInversion({ productoId, monto, plazo, periodoActual = 0, disponible = 1000, activas = 0, etapa = 1, salaPausada = false }) {
  const producto = productoPorId(productoId)
  if (salaPausada) return { ok: false, codigo: 'SALA_PAUSADA' }
  if (!producto || (producto.etapa > etapa)) return { ok: false, codigo: 'PRODUCTO_BLOQUEADO' }
  if (monto % 50 !== 0) return { ok: false, codigo: 'MONTO_NO_MULTIPLO' }
  if (monto < producto.minimo) return { ok: false, codigo: 'MONTO_BAJO_MINIMO' }
  if (monto > disponible) return { ok: false, codigo: 'SIN_FONDOS' }
  if (!Number.isInteger(plazo) || plazo < producto.plazoMin || plazo > producto.plazoMax) return { ok: false, codigo: 'PLAZO_FUERA_RANGO' }
  if (periodoActual + plazo > 12) return { ok: false, codigo: 'EXCEDE_HORIZONTE' }
  if (activas >= 4) return { ok: false, codigo: 'MAX_ACTIVAS' }
  return { ok: true }
}

export function crearInversion({ productoId, monto, plazo, periodoActual = 0, prediccion = null }) {
  const producto = productoPorId(productoId)
  return { id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`, productoId, tipo: producto.tipo, tasa: producto.tasa, monto, plazo, inicio: periodoActual, prediccion, estado: 'activa', montoFinal: null }
}

export function avanzarPeriodo(ronda) {
  if (ronda.periodoActual >= 12) return ronda
  const periodoActual = ronda.periodoActual + 1
  let disponible = ronda.disponible
  const inversiones = ronda.inversiones.map((inversion) => {
    if (inversion.estado !== 'activa' || periodoActual - inversion.inicio < inversion.plazo) return inversion
    const montoFinal = inversion.tipo === 'simple'
      ? montoSimple(inversion.monto, inversion.tasa, inversion.plazo)
      : montoCompuesto(inversion.monto, inversion.tasa, inversion.plazo)
    disponible += montoFinal
    return { ...inversion, estado: 'vencida', montoFinal }
  })
  return { ...ronda, periodoActual, disponible, inversiones }
}

export function calcularResumenRonda(ronda) {
  const activas = ronda.inversiones.filter((i) => i.estado === 'activa')
  const invertido = activas.reduce((suma, i) => suma + i.monto, 0)
  const devengado = activas.reduce((suma, i) => {
    const k = Math.max(0, ronda.periodoActual - i.inicio)
    return suma + (i.tipo === 'simple' ? saldoSimple(i.monto, i.tasa, k) : saldoCompuesto(i.monto, i.tasa, k)) - i.monto
  }, 0)
  const gananciasRealizadas = ronda.inversiones.filter((i) => i.estado === 'vencida').reduce((s, i) => s + i.montoFinal - i.monto, 0)
  const ganancias = gananciasRealizadas + devengado
  return { disponible: ronda.disponible, invertido, ganancias, patrimonio: ronda.disponible + invertido + devengado, periodo: ronda.periodoActual, nInversiones: ronda.inversiones.length, usoSimple: ronda.inversiones.filter((i) => i.tipo === 'simple').length, usoCompuesto: ronda.inversiones.filter((i) => i.tipo === 'compuesto').length }
}

export const crearRonda = (tipo = 'practica') => ({ id: `${Date.now()}`, tipo, periodoActual: 0, capitalInicial: 1000, disponible: 1000, inversiones: [] })
export const productos = catalogo
