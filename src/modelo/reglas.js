import { evaluarExpresion } from './evaluadorExpresiones.js'
import { interesSimple, montoCompuesto } from './interes.js'

export const definicionesReglas = {
  R1: { nombre: 'Ganancia simple', expresionCorrecta: 'C*i*n', evaluar: ({ C, i, n }) => interesSimple(C, i, n) },
  R2: { nombre: 'Saldo simple', expresionCorrecta: 'C+C*i*n', evaluar: ({ C, i, n }) => C + interesSimple(C, i, n) },
  R3: { nombre: 'Regla general simple', expresionCorrecta: 'C*(1+i*n)', evaluar: ({ C, i, n }) => C * (1 + i * n) },
  R4: { nombre: 'Saldo del siguiente periodo', expresionCorrecta: 'S*(1+i)', evaluar: ({ S, i }) => S * (1 + i) },
  R5: { nombre: 'Regla general compuesta', expresionCorrecta: 'C*(1+i)^n', evaluar: ({ C, i, n }) => montoCompuesto(C, i, n) },
}

export function evaluarRegla(reglaId, expresion, casos) {
  const regla = definicionesReglas[reglaId]
  if (!regla) return { ok: false, error: 'REGLA_DESCONOCIDA', casosOk: 0, casosTotal: 0, contraejemplos: [] }
  const resultados = (casos || []).map((caso) => {
    const prediccion = evaluarExpresion(expresion, caso.entradas)
    const real = regla.evaluar(caso.entradas)
    return { entradas: caso.entradas, prediccion: prediccion.ok ? prediccion.valor : null, real, ok: prediccion.ok && Math.abs(prediccion.valor - real) <= 1e-6 }
  })
  const casosOk = resultados.filter((r) => r.ok).length
  return { ok: resultados.length > 0 && casosOk === resultados.length, casosOk, casosTotal: resultados.length, contraejemplos: resultados.filter((r) => !r.ok) }
}

export function diagnosticarPrediccion(prediccion, real) {
  if (!Number.isFinite(Number(prediccion))) return { codigo: 'SIN_PREDICCION', mensaje: 'Tu predicción te ayuda a comparar lo que pensabas con lo que observaste.' }
  const diferencia = Number(real) - Number(prediccion)
  const relativo = Math.abs(diferencia) / Math.max(1, Math.abs(real))
  if (relativo < 0.01) return { codigo: 'MUY_CERCANA', mensaje: 'Tu predicción quedó muy cerca. ¿Qué estrategia te ayudó?' }
  return { codigo: diferencia > 0 ? 'PREDICCION_MENOR' : 'PREDICCION_MAYOR', mensaje: diferencia > 0 ? 'El monto final fue mayor. Observa cómo se sumó la ganancia en cada periodo.' : 'El monto final fue menor. Revisa cuánto tiempo estuvo invertido el dinero.' }
}
