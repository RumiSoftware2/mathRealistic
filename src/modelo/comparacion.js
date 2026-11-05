import { montoSimple, montoCompuesto } from './interes.js'

export const compararGemelos = (C, i, n) => ({
  simple: montoSimple(C, i, n), compuesto: montoCompuesto(C, i, n),
  diferencia: montoCompuesto(C, i, n) - montoSimple(C, i, n),
})

export function primerPeriodoConDiferencia(C, i, umbral, maxN = 24) {
  for (let n = 1; n <= maxN; n += 1) {
    if (compararGemelos(C, i, n).diferencia >= umbral) return n
  }
  return null
}
