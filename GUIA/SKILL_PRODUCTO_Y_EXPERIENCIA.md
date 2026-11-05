# SKILL 1 — PRODUCTO Y EXPERIENCIA: QR INVERSORES

> **Para quién es este archivo:** el agente programador que construirá QR Inversores.
> **Qué responde:** *qué producto hay que construir* (qué ve y hace el estudiante, qué ve y hace el docente, qué reglas tiene el juego y qué queda fuera).
> **Skills hermanos (leer los tres antes de escribir código):**
> - `SKILL_MODELO_MATEMATICO_Y_DIDACTICO.md` → fórmulas, catálogo de productos, secuencia didáctica, guías, panel pedagógico, evidencias.
> - `SKILL_ARQUITECTURA_Y_PLAN_IMPLEMENTACION.md` → stack, carpetas, datos, sesiones, QR, fases de trabajo, pruebas, despliegue en Vercel.
>
> **Regla de precedencia:** el modelo matemático y los valores numéricos del Skill 2 son la fuente única de verdad. Las decisiones técnicas están en el Skill 3. Este Skill 1 manda en comportamiento del producto y alcance. Si detectas una contradicción, **no improvises**: aplica esta precedencia y deja una nota en `docs/DECISIONES.md`.

---

## 0. Condición obligatoria: se edita el proyecto React existente

El entorno local **ya está configurado y funcionando**. Está prohibido crear un proyecto nuevo, regenerar el scaffold o cambiar de herramienta de construcción.

**Antes de escribir cualquier funcionalidad, el agente programador debe:**

1. Inspeccionar la estructura actual del proyecto (carpetas, `src/`, `public/`, archivos de configuración).
2. Leer `package.json`: scripts, dependencias, y si el bundler es Vite o Create React App (u otro).
3. Identificar componentes, páginas, estilos y funcionalidades ya implementados.
4. Decidir y registrar qué se **reutiliza**, qué se **modifica** y qué se **amplía**.
5. Mantener la configuración local actual (puerto, scripts, variables de entorno existentes).
6. No eliminar funcionalidades existentes sin justificación escrita en `docs/DECISIONES.md`.
7. Trabajar de forma **incremental**: cada cambio deja la aplicación ejecutable con `npm run dev` (o el script actual).

**Tecnologías permitidas:** React + JavaScript + CSS convencional.
**Tecnologías prohibidas:** TypeScript, Next.js, Angular, Vue, Tailwind, Bootstrap, otros frameworks de estilos, y cualquier migración del proyecto a otra tecnología.

**Principio rector: modificar y mejorar lo que ya existe, no reconstruir.**

---

## 1. Visión general

**QR Inversores** es una aplicación web educativa para que estudiantes construyan, mediante decisiones de inversión con **dinero ficticio**, su propio modelo matemático de **interés simple** e **interés compuesto**.

- El docente proyecta su pantalla en un televisor, que muestra un **código QR** y el panel de la sesión.
- Cada estudiante escanea el QR con su celular y entra a una experiencia **individual**: recibe un capital ficticio, explora productos simulados, decide cuánto, cuánto tiempo y bajo qué tipo de interés invertir, observa consecuencias y, guiado por la aplicación, **redescubre** las fórmulas en lugar de recibirlas hechas.
- La interfaz parece una plataforma de trading sencilla, con estética infantil, pastel y amigable.
- Un **panel pedagógico lateral** muestra qué principio de aprendizaje se está trabajando y qué está haciendo el estudiante matemáticamente.

**Lo que NO es:** una calculadora financiera, un simulador bursátil real ni un juego donde gana quien más dinero acumula.

---

## 2. Problema educativo

- El interés simple y el compuesto suelen enseñarse como fórmulas para memorizar y aplicar, sin comprender *por qué* el compuesto crece distinto.
- Los estudiantes confunden "interés por periodo" con "interés total", y no perciben que en el compuesto el interés se calcula sobre un saldo que cambia.
- Falta de situaciones donde decidir, equivocarse, comparar y justificar.

**Respuesta de la aplicación:** una situación de inversión comprensible donde las decisiones tienen consecuencias matemáticas visibles, y donde la fórmula aparece como *síntesis de lo que el estudiante ya construyó* (Educación Matemática Realista y aprendizaje realista; detalle en Skill 2).

---

## 3. Objetivos

### 3.1 General
Que cada estudiante construya, represente, verifique y justifique un modelo propio de interés simple y de interés compuesto, y lo use para tomar y comparar decisiones de inversión.

### 3.2 Específicos (cada uno debe poder evidenciarse en la app)
| ID | El estudiante será capaz de… | Evidencia en la app |
|---|---|---|
| OE1 | Identificar capital, tasa, tiempo, interés y monto en una situación de inversión. | Etiquetado de variables en etapas 1–2 |
| OE2 | Explicar cómo varían el interés y el monto al cambiar capital, tasa o periodos. | Experimentos controlados del Laboratorio |
| OE3 | Construir la regla del interés simple (`I = C·i·n`; `M = C + I`). | Constructor de reglas, etapa 3 |
| OE4 | Explicar por qué en el compuesto el interés cambia cada periodo y construir `M = C(1+i)^n`. | Tabla de saldos y constructor, etapa 4 |
| OE5 | Comparar simple vs. compuesto con las mismas condiciones y concluir. | Comparador, etapa 5 |
| OE6 | Diseñar una estrategia propia con meta, justificarla y revisarla. | Plan + reflexión, etapa 6 |
| OE7 | Predecir y verificar resultados con su propio modelo en casos nuevos. | Verificación, etapa 7 |

---

## 4. Perfil de usuarios

### 4.1 Estudiante
- Edad aproximada de secundaria; maneja celular, atención corta, lee poco texto largo.
- Usa el celular en vertical (360–430 px de ancho). Puede tener conexión inestable.
- No tiene cuenta ni correo. Se identifica con un **alias** y un **avatar**.
- No ha visto (o ha visto poco) la fórmula formal.

### 4.2 Docente
- Proyecta en un televisor o videobeam (mínimo 1280×720) y puede usar su computador o tablet para controlar.
- Necesita iniciar rápido (menos de 1 minuto), ver quién está conectado, controlar el ritmo y obtener evidencia para la discusión.
- No debe necesitar crear cuentas ni configurar nada complejo.

---

## 5. Convenciones de lenguaje y valores fijos

Usar **siempre** estos términos en la interfaz:

| Concepto | Término en la app |
|---|---|
| Dinero ficticio | **monedas** (símbolo 🪙) |
| Capital inicial de la sesión | **Capital inicial: 1 000 monedas** |
| Unidad de tiempo | **periodo** (1 periodo = 1 mes ficticio). Mostrar "mes" como apoyo: "Periodo 3 (mes 3)" |
| Horizonte del juego | **12 periodos** |
| Tasa | **tasa por periodo**, en % (ej. 3 % por periodo) |
| Interés generado | **ganancia** (y en etapas de formalización: *interés*) |
| Monto final | **monto final** (o *saldo final*) |
| Investigación libre sin gastar dinero | **Laboratorio** |
| Sesión | **sala** (código de 5 caracteres) |

Todas las tasas, plazos y montos son **ficticios**. Prohibido nombrar bancos, empresas o activos reales.

---

## 6. Experiencia completa del estudiante

El estudiante avanza por **8 etapas** (E0–E7). Cada etapa tiene una situación, acciones, guía y una condición de avance basada en *lo que hace*, no solo en responder preguntas. El detalle didáctico (guías, pistas, retroalimentación) está en el Skill 2; aquí se define lo que debe existir en el producto.

| Etapa | Nombre en la app | Qué vive el estudiante | Condición de avance |
|---|---|---|---|
| **E0** | Bienvenida | Escanea QR, elige alias y avatar, recibe 1 000 🪙. Ve un mini-recorrido de 3 tarjetas ("Tienes dinero · Puedes hacerlo crecer · Tú decides"). | Alias y avatar confirmados |
| **E1** | Mi primera inversión | Ve **solo productos de interés simple**. Elige producto, monto y plazo, **escribe una predicción**, invierte, avanza el tiempo periodo a periodo y ve cómo crece. | 1 inversión simple vencida + predicción registrada + mini-reflexión |
| **E2** | Laboratorio de pruebas | Simula sin gastar dinero. Cambia **una variable a la vez** (capital, tasa o periodos) y observa tabla y gráfica. | 3 experimentos controlados + 3 conclusiones elegidas |
| **E3** | Descubre la regla del simple | Con el **Constructor de reglas** arma "cómo se calcula la ganancia" con fichas y la prueba contra sus propios casos. Al lograrlo se revela la notación formal. | Regla verificada en ≥ 3 casos propios |
| **E4** | El interés que crece (compuesto) | Se desbloquean los productos compuestos. Invierte, ve la tabla de saldos, predice el siguiente saldo, construye la regla por periodo y luego la general. | Regla `saldo × (1+i)` verificada + regla general verificada |
| **E5** | Simple vs. compuesto | Comparador de dos productos "gemelos" (misma tasa) sobre el mismo capital y plazo, con gráfica de dos líneas. Busca desde qué periodo la diferencia es notable. | Conclusión registrada + punto de ventaja encontrado |
| **E6** | Mi estrategia | Define una **meta propia**, diseña un plan con varias inversiones (ronda oficial de 12 periodos), lo ejecuta, **justifica** y reflexiona. | Plan ejecutado + justificación + reflexión completa |
| **E7** | Mi modelo | Predice con **sus fórmulas** dos escenarios nuevos, verifica con la app y arma su **Mapa del modelo**. Puede probar una segunda estrategia. | 2 verificaciones + mapa completo |

**Ritmo:** el estudiante no puede saltar etapas, pero el docente puede fijar un **tope de etapa para toda la sala** (ver 7.4). El estudiante puede volver a etapas anteriores para consultar o repetir.

**Rondas:** en E1–E5 el estudiante usa una **ronda de práctica** que puede reiniciar cuando quiera ("Empezar nueva práctica") sin perder su historial de decisiones. En E6 se abre la **ronda de plan** (oficial), y en E7 puede abrir otra ronda de plan para probar una estrategia distinta.

---

## 7. Experiencia del docente

### 7.1 Crear sala
- Desde `/docente`, un botón **"Crear sala"** genera código de 5 caracteres, QR y enlace corto. Sin registro ni contraseña.
- La sala nace en estado **Esperando**.

### 7.2 Panel proyectable (TV)
Pantalla única, sin scroll horizontal, tipografía grande (legible a 5 m), alto contraste, estética pastel coherente con la del estudiante. Debe mostrar:

1. **QR grande** (≥ 280 px, con margen blanco) + código de sala en texto + URL legible.
2. **Participantes conectados** con avatar y alias; indicador de conexión (verde/gris).
3. **Estado de la sala** y controles: **Iniciar**, **Pausar/Reanudar**, **Reiniciar**, **Finalizar**.
4. **Tope de etapa** para la clase (selector E1…E7).
5. **Resultados** (se activan al iniciar): tabla de participantes con etapa actual, patrimonio, número de inversiones, tipos usados (simple/compuesto), insignias de aprendizaje.
6. **Gráfica colectiva:** distribución de estudiantes por etapa y uso de simple vs. compuesto.
7. **Mesa de discusión:** el docente elige estrategias compartidas (anónimas por defecto) y las proyecta lado a lado, con sus tablas y justificaciones.
8. **Pregunta detonante:** el docente envía una pregunta (de una lista por etapa o escrita) que aparece en los celulares y en el TV.

### 7.3 Estados de la sala
`esperando → activa ⇄ pausada → finalizada`. Reglas en la sección 10.

### 7.4 Ritmo de clase
El docente fija `etapaMaxima`. Los estudiantes que lleguen al tope ven "¡Espera a tu profe!" con una actividad opcional (volver al Laboratorio).

### 7.5 Reiniciar
Pide confirmación. Borra inversiones, historial y progreso de todos, **conserva** a los participantes (alias y avatar) y vuelve a E1. No cierra la sala.

---

## 8. Flujo de ingreso mediante QR

```
Docente: /docente → [Crear sala] → muestra QR + código (ej. K7M2P)
QR codifica: {URL_PÚBLICA}/unirse/K7M2P
Estudiante: escanea → abre /unirse/K7M2P en el navegador del celular
  → valida sala (existe, no finalizada)
  → pide alias + avatar → crea participante
  → /estudiante/K7M2P  (experiencia)
Reconexión: al recargar o volver a escanear desde el mismo celular, recupera su progreso.
Ingreso manual (respaldo): /unirse → campo "Código de sala".
```

**Reglas:**
- La URL del QR se construye con `window.location.origin`; en pruebas locales con celular debe poder sobrescribirse con una variable de entorno (ver Skill 3, §8) porque `localhost` no sirve en un celular.
- Si el código no existe: mensaje amable "No encontramos esa sala. Revisa el código con tu profe." + campo para reintentar.
- Si la sala está **Esperando**: el estudiante entra y ve la pantalla "Espera a que tu profe inicie" (puede elegir avatar y ver el mini-recorrido).
- Si está **Finalizada**: mensaje y botón "Ver mi resumen" (solo lectura, si tiene datos locales).
- Alias: 2–14 caracteres, sin apellidos (aviso visible: "Usa un apodo, no tu nombre completo"). Duplicados se resuelven agregando " 2", " 3".

---

## 9. Mecánicas de inversión

### 9.1 Catálogo de productos (fijo, ficticio)
Productos "gemelos": misma tasa, mismas restricciones, distinto tipo de interés. Esto permite comparar justamente (solo cambia el tipo de interés).

| ID | Nombre | Ícono | Tipo | Tasa por periodo | Plazo (periodos) | Monto mínimo | Se desbloquea |
|---|---|---|---|---|---|---|---|
| S1 | Alcancía Mágica | 🐷 | Simple | 2 % | 1–12 | 50 | E1 |
| S2 | Granja Feliz | 🐄 | Simple | 3 % | 2–12 | 100 | E1 |
| S3 | Cohete Ahorrador | 🚀 | Simple | 5 % | 4–12 | 200 | E1 |
| C1 | Brote Mágico | 🌱 | Compuesto | 2 % | 1–12 | 50 | E4 |
| C2 | Árbol Frutal | 🌳 | Compuesto | 3 % | 2–12 | 100 | E4 |
| C3 | Bosque Encantado | 🌲 | Compuesto | 5 % | 4–12 | 200 | E4 |

Gemelos: S1↔C1, S2↔C2, S3↔C3.

**Intención de diseño (el dilema):** a mayor tasa, más plazo mínimo y más dinero mínimo, así que invertir todo en el producto "mejor" no siempre es posible ni conveniente (liquidez: el dinero queda bloqueado hasta el vencimiento).

### 9.2 Decisiones del estudiante en cada inversión
1. **Producto** (tipo y tasa quedan definidos por el producto).
2. **Monto** (múltiplos de 50, entre el mínimo del producto y el dinero disponible).
3. **Plazo** en periodos (dentro del rango del producto y sin superar el horizonte de 12 desde el periodo actual).
4. **Predicción** del monto final (campo numérico; en E1 es obligatorio, después es opcional pero la app lo invita).

### 9.3 Qué ve el estudiante en la pantalla de inversión (estilo trading simple)
- **Barra superior:** 💰 Disponible · 📈 Invertido · ✨ Ganancias · 🏦 Patrimonio · ⏱ Periodo actual (n/12).
- **Tarjetas de producto** (scroll horizontal en móvil): ícono, nombre, tasa, tipo (con etiqueta de color), plazo, mínimo.
- **Tarjeta de inversión nueva:** controles deslizantes con paso y entradas numéricas, **vista previa** del plan (qué eliges) *sin mostrar el resultado final* hasta que invierte (ver decisión didáctica en Skill 2, §6.1).
- **Mis inversiones:** tarjetas activas con barra de progreso (periodo k de n) y ganancia devengada.
- **Gráfica de evolución del patrimonio** por periodo.
- **Historial de decisiones** (línea de tiempo filtrable).
- Botones de tiempo: **"Avanzar 1 periodo"** y **"Avanzar hasta el siguiente vencimiento"**.

### 9.4 Cómo se mueve el dinero (resumen; fórmulas exactas en Skill 2)
- Al invertir: `disponible` baja en el monto invertido.
- Mientras la inversión está activa: el interés **se devenga** (se ve crecer) pero el dinero sigue bloqueado.
- Al vencimiento: se acredita `monto final = capital + interés` en `disponible`.
- **Patrimonio = capital inicial + ganancias acumuladas** (invariante verificable).

---

## 10. Reglas del juego

1. Cada estudiante empieza cada ronda con **1 000 🪙** y **periodo 0**.
2. Horizonte: **12 periodos**. Una inversión no puede vencer después del periodo 12.
3. Máximo **4 inversiones activas** a la vez.
4. Montos en múltiplos de **50 🪙**, nunca por encima del dinero disponible.
5. No se puede retirar una inversión antes de su vencimiento (decisión de liquidez).
6. Todos los productos tienen **retorno determinista** (no hay azar ni pérdidas): el aprendizaje está en el modelo, no en la suerte.
7. El tiempo avanza solo cuando el estudiante lo decide (ritmo propio).
8. Si la sala está **pausada**, el estudiante ve un aviso y no puede invertir, avanzar tiempo ni enviar respuestas (puede ver sus datos).
9. La ronda de práctica puede reiniciarse sin límite. La ronda de plan (E6/E7) se archiva al terminar.
10. **Nada premia el dinero ganado por sí solo.** Las insignias premian explorar, predecir, construir, verificar, justificar y revisar (sección 11).
11. Reiniciar la sala por el docente reinicia el progreso de todos.

---

## 11. Gamificación (centrada en aprendizaje)

**Insignias** (otorgadas por acciones registradas, nunca por saldo):

| Insignia | Se obtiene al… |
|---|---|
| 🧭 Explorador | Probar ≥ 3 productos distintos (Laboratorio o inversión real) |
| 🔮 Pronosticador | Registrar predicción en ≥ 3 inversiones (sin importar el acierto) |
| 🔍 Detective de patrones | Verificar su regla del interés simple |
| 🧩 Constructor de modelos | Verificar sus reglas del compuesto (por periodo y general) |
| ⚖️ Comparador | Registrar una conclusión en el Comparador |
| 💬 Argumentador | Justificar su estrategia con la estructura guiada |
| 🔄 Revisor | Corregir una predicción o ajustar su estrategia tras reflexionar |
| ✅ Verificador | Verificar su modelo en un escenario nuevo |

**Otros elementos:** mapa de etapas con avance, avatares desbloqueables por etapa completada, animaciones ligeras de monedas/plantas que crecen (respetando `prefers-reduced-motion`).

**Prohibido:** rankings por dinero, tablas de posiciones públicas por patrimonio, castigos por equivocarse, temporizadores que presionen.

El panel del docente muestra el **patrimonio como dato informativo**, no como clasificación (sin posiciones 1.º, 2.º, 3.º).

---

## 12. Funcionalidades principales

| ID | Funcionalidad | Prioridad |
|---|---|---|
| F-01 | Crear sala, código de 5 caracteres, QR y enlace | MVP |
| F-02 | Unirse por QR/código con alias y avatar; reconexión | MVP |
| F-03 | Panel proyectable: participantes, estado, controles, resultados | MVP |
| F-04 | Iniciar / pausar / reanudar / reiniciar / finalizar sala | MVP |
| F-05 | Motor matemático (simple y compuesto) con tablas y series | MVP |
| F-06 | Catálogo de productos con desbloqueo por etapa | MVP |
| F-07 | Inversión: producto, monto, plazo, predicción, validaciones | MVP |
| F-08 | Avance del tiempo, devengo, vencimiento y acreditación | MVP |
| F-09 | Barra de saldos y gráfica de evolución del patrimonio | MVP |
| F-10 | Historial de decisiones (línea de tiempo) | MVP |
| F-11 | Laboratorio de simulación sin costo (con experimentos controlados) | MVP |
| F-12 | Constructor de reglas por fichas con verificación contra casos propios | MVP |
| F-13 | Comparador simple vs. compuesto (gráfica de dos líneas) | MVP |
| F-14 | Sistema de guías con pistas graduales y retroalimentación matemática | MVP |
| F-15 | Reflexión guiada (ciclo de 5 pasos) tras inversiones y rondas | MVP |
| F-16 | Panel pedagógico lateral contextual | MVP |
| F-17 | Insignias de aprendizaje | MVP |
| F-18 | Ronda de plan con meta propia y justificación | MVP |
| F-19 | Mapa del modelo (cierre) | MVP |
| F-20 | Mesa de discusión y pregunta detonante del docente | MVP |
| F-21 | Tope de etapa para la clase | MVP |
| F-22 | Exportar evidencias de la sala a CSV | Deseable |
| F-23 | Segunda ronda de plan archivada y comparable con la primera | Deseable |
| F-24 | Tema alto contraste / tamaño de letra ajustable | Deseable |

---

## 13. Historias de usuario

**Estudiante**
- **HU-E1** Como estudiante, quiero entrar escaneando un QR y elegir un apodo, para participar sin crear cuenta.
- **HU-E2** Como estudiante, quiero escribir cuánto creo que tendré antes de invertir, para después comparar con lo que pasó.
- **HU-E3** Como estudiante, quiero ver mi dinero crecer periodo a periodo, para entender de dónde sale la ganancia.
- **HU-E4** Como estudiante, quiero cambiar solo una cosa en el Laboratorio, para saber qué efecto tiene.
- **HU-E5** Como estudiante, quiero armar con fichas mi propia regla de cálculo y probarla, para descubrir la fórmula yo mismo.
- **HU-E6** Como estudiante, quiero comparar dos inversiones iguales pero de distinto tipo, para entender por qué el compuesto gana más.
- **HU-E7** Como estudiante, quiero diseñar mi propio plan con una meta mía y explicar por qué lo elegí.
- **HU-E8** Como estudiante, quiero pistas que me orienten sin darme la respuesta, para sentir que lo descubrí yo.
- **HU-E9** Como estudiante, quiero ver en un panel qué estoy aprendiendo en este momento, para darle sentido a lo que hago.
- **HU-E10** Como estudiante, quiero recuperar mi progreso si se me cierra el navegador.

**Docente**
- **HU-D1** Como docente, quiero crear una sala y proyectar el QR en menos de un minuto.
- **HU-D2** Como docente, quiero ver quién está conectado y en qué etapa va cada estudiante.
- **HU-D3** Como docente, quiero pausar toda la sala para pedir atención o abrir una discusión.
- **HU-D4** Como docente, quiero limitar la etapa máxima para que el grupo avance junto.
- **HU-D5** Como docente, quiero proyectar dos estrategias de estudiantes (anónimas) y sus justificaciones, para conversar sobre ellas.
- **HU-D6** Como docente, quiero reiniciar la sala para usarla con otro grupo.
- **HU-D7** Como docente, quiero ver las evidencias de aprendizaje de cada estudiante (predicciones, reglas, justificaciones).

---

## 14. Requisitos funcionales

| ID | Requisito |
|---|---|
| RF-01 | El sistema genera códigos de sala de 5 caracteres usando solo `ABCDEFGHJKMNPQRSTUVWXYZ23456789` (sin caracteres ambiguos). |
| RF-02 | El QR codifica `{URL_PÚBLICA}/unirse/{CÓDIGO}` y es escaneable desde un televisor a 5 m. |
| RF-03 | Un estudiante se une con alias (2–14 caracteres) y avatar; el sistema lo identifica con un id persistente en el dispositivo. |
| RF-04 | El docente ve los participantes en tiempo casi real (≤ 3 s de latencia en condiciones normales). |
| RF-05 | El docente puede iniciar, pausar, reanudar, reiniciar y finalizar; los celulares reaccionan en ≤ 3 s. |
| RF-06 | Todos los cálculos de interés usan únicamente las funciones del módulo de modelo del Skill 3; **ningún componente calcula interés por su cuenta**. |
| RF-07 | Las validaciones de inversión (monto, plazo, disponible, máximo de activas, horizonte) se aplican en el motor y la interfaz solo las refleja. |
| RF-08 | Cada decisión y cada acción de aprendizaje genera un **evento** en el historial (catálogo de eventos en Skill 2, §12). |
| RF-09 | El panel pedagógico cambia su contenido según etapa y según el último evento relevante. |
| RF-10 | El Constructor de reglas evalúa las fichas del estudiante con un evaluador propio (sin `eval`) y compara contra los casos reales del estudiante. |
| RF-11 | Las insignias se calculan a partir del historial de eventos. |
| RF-12 | La pausa bloquea acciones de juego en el celular. |
| RF-13 | El progreso del estudiante se guarda en el dispositivo y se sincroniza a la sala. |
| RF-14 | Los productos compuestos permanecen bloqueados hasta que el estudiante llega a E4. |
| RF-15 | La app muestra montos con 2 decimales, separador de miles con espacio y símbolo 🪙. |
| RF-16 | La app cumple el invariante `patrimonio = capitalInicial + gananciasAcumuladas` en todo momento. |

---

## 15. Requisitos no funcionales

| ID | Requisito |
|---|---|
| RNF-01 | **Tecnología:** solo React + JavaScript + CSS convencional, sobre el proyecto existente. |
| RNF-02 | **Responsive:** funciona sin romperse desde 360 px hasta pantallas de TV (≥ 1280 px). Mobile-first. |
| RNF-03 | **Rendimiento:** carga inicial razonable en 4G; el estudiante interactúa en < 3 s; sin librerías pesadas innecesarias. |
| RNF-04 | **Accesibilidad:** contraste de texto ≥ 4.5:1, objetivos táctiles ≥ 44 px, etiquetas para lectores de pantalla en controles, soporte de `prefers-reduced-motion`. |
| RNF-05 | **Resiliencia:** si se pierde la conexión, el estudiante puede seguir (estado local) y se resincroniza al volver. |
| RNF-06 | **Privacidad:** no se recogen nombres reales ni datos personales; solo alias y avatar. |
| RNF-07 | **Mantenibilidad:** código organizado, funciones puras para el modelo, CSS modular reutilizable, sin duplicación de lógica. |
| RNF-08 | **Despliegue:** compatible con Vercel (SPA sin errores 404 al recargar rutas internas). |
| RNF-09 | **Estética:** colores pastel, tarjetas, íconos amigables, animaciones ligeras; no debe parecer una app bancaria ni técnica. |
| RNF-10 | **Idioma:** toda la interfaz en español. |

---

## 16. Criterios de aceptación del producto (MVP)

El MVP está aceptado cuando se cumplen **todos**:

1. Un docente crea una sala y proyecta el QR; ≥ 5 celulares reales se unen escaneando.
2. Cada estudiante completa E0→E7 en un flujo sin errores de consola, con la regla de desbloqueo de productos respetada.
3. El docente ve a todos los participantes, sus etapas y resultados, y puede pausar, reanudar y reiniciar con efecto verificado en los celulares.
4. Los resultados mostrados en cada inversión coinciden con los **casos de verificación** del Skill 2 §5 (todos pasan).
5. El invariante `patrimonio = capitalInicial + gananciasAcumuladas` se cumple tras cualquier secuencia de acciones.
6. El panel pedagógico cambia de contenido en cada etapa y muestra: principio EMR, principio de aprendizaje realista, qué hace el estudiante, qué representación construye y su relación con el modelo.
7. El Constructor de reglas valida una regla correcta y rechaza una incorrecta mostrando contraejemplos de los propios casos del estudiante.
8. La app no entrega la fórmula formal antes de que se cumpla la condición de E3 (simple) y E4 (compuesto).
9. Funciona en localhost y en el dominio de Vercel; recargar `/docente`, `/unirse/XXXXX` y `/estudiante/XXXXX` no produce 404.
10. El QR se probó **en producción desde un celular real**.
11. No hay ranking por dinero en ninguna pantalla.
12. Las funcionalidades previas del proyecto siguen operativas (o su retiro está justificado en `docs/DECISIONES.md`).

---

## 17. Alcance

### 17.1 Dentro del MVP
F-01 a F-21 (secciones anteriores).

### 17.2 Deseable (solo si el MVP está completo y verificado)
F-22, F-23, F-24.

### 17.3 Fuera de alcance — NO desarrollar
- Acciones, criptomonedas, bolsa real, indicadores bursátiles, derivados, análisis técnico.
- Inflación, impuestos, préstamos, deudas, comisiones, tasas nominales/efectivas, capitalización fraccionada, interés continuo, anualidades.
- Azar, pérdidas, volatilidad o eventos de mercado aleatorios.
- Cuentas de usuario, correo, contraseñas, perfiles permanentes, pagos o dinero real.
- Ranking competitivo por dinero.
- Chat libre entre estudiantes (la interacción ocurre en el aula, apoyada por la Mesa de discusión).
- Un backend propio, bases de datos externas adicionales o servicios de autenticación más allá de lo justificado en el Skill 3.
- Migración de tecnología, TypeScript, Tailwind, Bootstrap, Next.js, Vue, Angular.
- Una "calculadora libre" que dé el resultado final con solo escribir C, i y n **antes** de las etapas de construcción (ver Skill 2, §6.1 y §13).

---

## 18. Brief visual

- **Paleta pastel** (definir como variables CSS en `tokens.css`; valores de referencia):
  - Rosa `#FFD6E8` / acento `#F59CC0`
  - Morado `#E2D4F8` / acento `#A98BE0`
  - Azul `#D3E9FB` / acento `#7DB9EC`
  - Verde `#D5F3DE` / acento `#7ACB95`
  - Amarillo `#FFF3C4` / acento `#F2C94C`
  - Texto principal `#3B3355` (morado oscuro; garantiza contraste sobre pasteles)
  - Fondo de página `#FFFBFE`
- **Color por tipo de interés:** simple = azul; compuesto = verde (constante en toda la app: etiquetas, líneas de gráfica, tarjetas).
- Tarjetas con esquinas muy redondeadas (≥ 16 px), sombras suaves, íconos emoji o SVG propios.
- Animaciones ligeras (monedas que suben, plantas que crecen), desactivables.
- Sensación de "trading sencillo": tarjetas de producto, barra de saldos, gráfica de líneas, lista de movimientos.
- Panel docente: mismo lenguaje visual, tipografía ≥ 1.5× más grande, fondo claro.
- Detalles de layout, componentes y breakpoints: Skill 3 §10–11.

---

## 19. Checklist rápido para el agente programador

- [ ] Inspeccioné el proyecto existente y documenté qué reutilizo (Skill 3, Fase 1).
- [ ] No usé tecnologías prohibidas.
- [ ] Ningún componente calcula interés por su cuenta.
- [ ] La fórmula formal solo aparece al cumplir la condición didáctica.
- [ ] No hay ranking por dinero.
- [ ] El panel pedagógico y las guías están conectados a las etapas reales.
- [ ] Probé en celular real, en localhost y en Vercel.
