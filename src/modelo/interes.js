export const interesSimple = (C, i, n) => C * i * n
export const montoSimple = (C, i, n) => C + interesSimple(C, i, n)
export const montoCompuesto = (C, i, n) => C * (1 + i) ** n
export const interesCompuesto = (C, i, n) => montoCompuesto(C, i, n) - C
export const saldoSimple = (C, i, k) => C + C * i * k
export const saldoCompuesto = (C, i, k) => C * (1 + i) ** k

export function construirTablaSimple(C, i, n) {
  return Array.from({ length: n + 1 }, (_, periodo) => ({
    periodo, saldoInicial: saldoSimple(C, i, Math.max(0, periodo - 1)),
    interes: periodo === 0 ? 0 : C * i, saldoFinal: saldoSimple(C, i, periodo),
  }))
}

export function construirTablaCompuesta(C, i, n) {
  return Array.from({ length: n + 1 }, (_, periodo) => ({
    periodo, saldoInicial: periodo === 0 ? C : saldoCompuesto(C, i, periodo - 1),
    interes: periodo === 0 ? 0 : saldoCompuesto(C, i, periodo - 1) * i,
    saldoFinal: saldoCompuesto(C, i, periodo),
  }))
}
