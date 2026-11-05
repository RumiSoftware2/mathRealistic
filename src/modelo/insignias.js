const reglasInsignias = [
  ['explorador', (eventos) => new Set(eventos.filter((e) => ['simulacion_ejecutada', 'inversion_creada'].includes(e.tipo)).map((e) => e.datos?.productoId)).size >= 3],
  ['pronosticador', (eventos) => eventos.filter((e) => e.tipo === 'prediccion_registrada').length >= 3],
  ['detective-simple', (eventos) => eventos.some((e) => e.tipo === 'regla_verificada' && ['R1', 'R2', 'R3'].includes(e.datos?.reglaId))],
  ['constructor-modelos', (eventos) => eventos.some((e) => e.tipo === 'regla_verificada' && ['R4', 'R5'].includes(e.datos?.reglaId))],
  ['comparador', (eventos) => eventos.some((e) => e.tipo === 'conclusion_comparacion')],
  ['argumentador', (eventos) => eventos.some((e) => e.tipo === 'justificacion_registrada')],
  ['revisor', (eventos) => eventos.some((e) => e.tipo === 'reflexion_comprobada')],
  ['verificador', (eventos) => eventos.some((e) => e.tipo === 'verificacion_modelo' && e.datos?.ok)],
]

export const calcularInsignias = (eventos = []) => reglasInsignias.filter(([, cumple]) => cumple(eventos)).map(([id]) => id)
