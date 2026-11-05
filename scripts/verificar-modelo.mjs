import assert from 'node:assert/strict'
import { montoSimple, interesSimple, montoCompuesto, interesCompuesto, saldoSimple, saldoCompuesto, construirTablaCompuesta } from '../src/modelo/interes.js'
import { compararGemelos, primerPeriodoConDiferencia } from '../src/modelo/comparacion.js'
import { crearRonda, crearInversion, validarInversion, avanzarPeriodo, calcularResumenRonda } from '../src/modelo/inversiones.js'
import { evaluarExpresion } from '../src/modelo/evaluadorExpresiones.js'

const cerca = (actual, esperado, tolerancia = 0.005) => assert.ok(Math.abs(actual - esperado) <= tolerancia, `${actual} no está a ${tolerancia} de ${esperado}`)

// M-01…M-09, M-11…M-13
const casos = [
  [1000, .03, 6, 1180, 1194.0523], [1000, .05, 12, 1600, 1795.8563],
  [500, .02, 10, 600, 609.4972], [200, .03, 4, 224, 225.1018],
]
for (const [C, i, n, simple, compuesto] of casos) { cerca(montoSimple(C, i, n), simple); cerca(montoCompuesto(C, i, n), compuesto) }
cerca(interesSimple(1000, .03, 6), 180)
cerca(interesCompuesto(1000, .03, 6), 194.0523)
cerca(montoSimple(1000, .05, 1), montoCompuesto(1000, .05, 1))
cerca(montoSimple(100, .02, 2), 104); cerca(montoCompuesto(100, .02, 2), 104.04)
assert.equal(primerPeriodoConDiferencia(1000, .02, 10, 24), 8)
cerca(saldoSimple(1000, .03, 4) - 1000, 120)
cerca(saldoCompuesto(1000, .03, 4) - 1000, 125.50881)

// M-10: suma de intereses y último saldo
const tabla = construirTablaCompuesta(1000, .05, 3)
cerca(tabla.at(-1).saldoFinal, montoCompuesto(1000, .05, 3))
cerca(tabla.slice(1).reduce((s, row) => s + row.interes, 0), interesCompuesto(1000, .05, 3))

// M-14: contabilidad de las inversiones del caso de referencia
let ronda = crearRonda()
const invest = (id, monto, plazo) => { const inversion = crearInversion({ productoId: id, monto, plazo }); ronda = { ...ronda, disponible: ronda.disponible - monto, inversiones: [...ronda.inversiones, inversion] } }
invest('S2', 400, 4); invest('C2', 300, 6)
for (let i = 0; i < 4; i += 1) ronda = avanzarPeriodo(ronda)
cerca(ronda.disponible, 748); cerca(calcularResumenRonda(ronda).patrimonio, 1085.6526)
for (let i = 0; i < 2; i += 1) ronda = avanzarPeriodo(ronda)
cerca(ronda.disponible, 1106.2157); cerca(calcularResumenRonda(ronda).patrimonio, 1106.2157)

// M-15: códigos de validación
const invalid = (payload) => validarInversion({ productoId: 'S1', monto: 50, plazo: 1, ...payload }).codigo
assert.equal(invalid({ productoId: 'C1', etapa: 1 }), 'PRODUCTO_BLOQUEADO')
assert.equal(invalid({ monto: 51 }), 'MONTO_NO_MULTIPLO')
assert.equal(invalid({ monto: 0 }), 'MONTO_BAJO_MINIMO')
assert.equal(invalid({ monto: 1050 }), 'SIN_FONDOS')
assert.equal(invalid({ plazo: 0 }), 'PLAZO_FUERA_RANGO')
assert.equal(invalid({ periodoActual: 12 }), 'EXCEDE_HORIZONTE')
assert.equal(invalid({ activas: 4 }), 'MAX_ACTIVAS')
assert.equal(invalid({ salaPausada: true }), 'SALA_PAUSADA')

// M-16…M-20: propiedades, invariantes, parser controlado
for (const C of [50, 100, 500, 1000]) for (const i of [.02, .03, .05]) for (let n = 1; n <= 12; n += 1) {
  assert.ok(montoCompuesto(C, i, n) >= montoSimple(C, i, n) - 1e-9)
  if (n > 1) assert.ok(montoCompuesto(C, i, n) > montoSimple(C, i, n))
  for (let k = 0; k <= n; k += 1) assert.ok(Math.abs(saldoCompuesto(C, i, k) - C * (1 + i) ** k) < 1e-9)
  cerca(interesSimple(C * 2, i, n), interesSimple(C, i, n) * 2, 1e-6)
  cerca(interesCompuesto(C * 2, i, n), interesCompuesto(C, i, n) * 2, 1e-6)
}
let seed = 81479
const random = (max) => { seed = (seed * 48271) % 2147483647; return seed % max }
let seq = crearRonda()
for (let action = 0; action < 200; action += 1) {
  const active = seq.inversiones.filter((i) => i.estado === 'activa')
  if (seq.periodoActual < 12 && random(3) === 0 && active.length < 4 && seq.disponible >= 50) {
    const options = [
      { id: 'S1', minimo: 50, plazoMin: 1 },
      { id: 'S2', minimo: 100, plazoMin: 2 },
      { id: 'S3', minimo: 200, plazoMin: 4 },
    ].filter((p) => p.minimo <= seq.disponible && p.plazoMin <= 12 - seq.periodoActual)
    if (options.length) {
      const product = options[random(options.length)]
      const plazo = product.plazoMin + random(13 - seq.periodoActual - product.plazoMin)
      const maxUnits = Math.floor(seq.disponible / 50)
      const minUnits = product.minimo / 50
      const monto = 50 * (minUnits + random(maxUnits - minUnits + 1))
      const valid = validarInversion({ productoId: product.id, monto, plazo, periodoActual: seq.periodoActual, disponible: seq.disponible, activas: active.length, etapa: 1 })
      assert.equal(valid.ok, true)
      const inv = crearInversion({ productoId: product.id, monto, plazo, periodoActual: seq.periodoActual })
      seq = { ...seq, disponible: seq.disponible - monto, inversiones: [...seq.inversiones, inv] }
    } else seq = avanzarPeriodo(seq)
  } else seq = avanzarPeriodo(seq)
  const sum = calcularResumenRonda(seq)
  assert.ok(sum.disponible >= 0)
  cerca(sum.patrimonio, 1000 + sum.ganancias, 1e-6)
  if (seq.periodoActual === 12) assert.equal(seq.inversiones.some((i) => i.estado === 'activa'), false)
}
const parsed = evaluarExpresion('C*(1+i)^n', { C: 500, i: .02, n: 10 })
assert.equal(parsed.ok, true); cerca(parsed.valor, 609.4972)
assert.equal(evaluarExpresion('1/0').error, 'DIVISION_CERO')
assert.equal(evaluarExpresion('2+(').ok, false)
console.log('Verificación del modelo: M-01…M-20 aprobadas (20 grupos de comprobación).')
