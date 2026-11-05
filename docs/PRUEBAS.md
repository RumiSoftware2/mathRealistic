# Verificación

## Verificaciones locales

- Línea base antes de los cambios: `npm run build` aprobado; `npm run dev -- --host 127.0.0.1` listo en `http://127.0.0.1:5173/`.
- Tras los cambios: `npm run build` aprobado. Vite generó `dist/` sin advertencias.
- `npm run lint` aprobado, sin errores ni advertencias.
- `npm run verificar:modelo` aprobado: casos M-01…M-20, ejemplos, validaciones, propiedades e invariante contable.
- `npm run dev -- --host 127.0.0.1` volvió a quedar listo en el puerto 5173.

## Pendiente de prueba manual o externa

- FT-01…FT-22 no se han recorrido completamente en navegador.
- La revisión visual con Microsoft Edge fue bloqueada por el permiso de Computer Use; no se automatizó otra interfaz.
- Firebase no tiene proyecto ni credenciales configuradas. La sincronización entre dispositivos, autenticación anónima y reglas publicadas siguen sin verificarse.
- No hay dominio de Vercel desplegado ni celulares disponibles aquí; la lectura real del QR y las recargas en producción siguen pendientes.
- Por esa razón, estos resultados validan el build y el motor matemático, no el criterio de aceptación de producción del MVP.

## Alcance aún incompleto frente a la guía

- Las rondas, el historial de eventos detallado, las insignias visibles, el diagnóstico completo de predicciones, el ciclo reflexivo de cinco pasos, el Constructor de reglas por fichas y la Mesa de discusión anónima requieren más implementación.
- El plan E6 ejecuta una comparación simple/compuesto de una estrategia distribuida, pero aún no una ronda oficial editable con inversiones múltiples y archivo de rondas.
- E7 verifica dos predicciones y muestra el mapa; faltan conexiones editables en el mapa y la comparación de segunda estrategia.
- El panel docente muestra código/QR, participantes, estado, etapa, resumen y distribución; falta la vista completa de evidencias, insignias y estrategias compartidas.
- Faltan los escenarios completos de reconexión, presencia/desconexión, caducidad y resincronización de eventos pendientes.
