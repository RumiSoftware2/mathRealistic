const requisitos = {
  0: ({ perfil }) => Boolean(perfil?.alias?.trim() && perfil?.avatar),
  1: ({ ronda, reflexionE1 }) => Boolean(
    ronda?.inversiones?.some((inversion) => inversion.tipo === 'simple' && inversion.estado === 'vencida' && Number.isFinite(inversion.prediccion)) && reflexionE1,
  ),
  2: ({ experimentos }) => Boolean(
    experimentos?.length >= 3 && new Set(experimentos.map((experimento) => experimento.variable)).size >= 3 && experimentos.every((experimento) => Boolean(experimento.conclusion)),
  ),
  3: ({ reglaSimple }) => Boolean(reglaSimple),
  4: ({ reglaCompuestaPeriodo, reglaCompuestaGeneral }) => Boolean(reglaCompuestaPeriodo && reglaCompuestaGeneral),
  5: ({ puntoVentaja, conclusionComparacion }) => Boolean(puntoVentaja && conclusionComparacion),
  6: ({ planEjecutado, justificacionPlan, reflexionPlan }) => Boolean(planEjecutado && justificacionPlan && reflexionPlan),
  7: ({ verificaciones, mapaModelo }) => Boolean(verificaciones >= 2 && mapaModelo),
}

const mensajes = {
  0: 'Confirma tu apodo y tu avatar para comenzar.',
  1: 'Completa y vence una inversión simple, registra tu predicción y escribe una reflexión breve.',
  2: 'Guarda tres experimentos distintos, uno por cada variable, y registra una conclusión en cada uno.',
  3: 'Prueba y verifica tu regla del interés simple.',
  4: 'Verifica la regla por periodo y la regla general del interés compuesto.',
  5: 'Encuentra el punto de ventaja y registra qué diferencia observaste.',
  6: 'Ejecuta tu plan, justifica la estrategia y registra una reflexión.',
  7: 'Verifica dos escenarios y completa el mapa del modelo.',
}

export function puedeAvanzarEtapa(etapa, evidencia = {}) {
  const cumple = requisitos[etapa]
  if (!cumple) return { ok: false, motivo: 'ETAPA_INVALIDA', mensaje: 'No encontramos esta etapa.' }
  return cumple(evidencia)
    ? { ok: true, motivo: null, mensaje: null }
    : { ok: false, motivo: `ETAPA_${etapa}_INCOMPLETA`, mensaje: mensajes[etapa] }
}
