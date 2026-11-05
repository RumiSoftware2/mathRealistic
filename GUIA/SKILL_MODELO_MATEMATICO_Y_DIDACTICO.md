# SKILL 2 — MODELO MATEMÁTICO Y DIDÁCTICO: QR INVERSORES

> **Para quién es este archivo:** el agente programador.
> **Qué responde:** *cómo funcionan las matemáticas de la app* y *cómo la app convierte decisiones de inversión en aprendizaje* (secuencia, guías, retroalimentación, panel pedagógico, evidencias).
> **Skills hermanos:** `SKILL_PRODUCTO_Y_EXPERIENCIA.md` (qué producto) y `SKILL_ARQUITECTURA_Y_PLAN_IMPLEMENTACION.md` (cómo construirlo).
> **Este archivo es la fuente única de verdad** para fórmulas, valores numéricos, catálogo, casos de verificación, textos de guías y contenido del panel pedagógico.

**Recordatorio de entorno:** se edita el **proyecto React existente** con **React + JavaScript + CSS**. Inspeccionar el proyecto antes de implementar (Skill 3, Fase 1). Sin TypeScript, Tailwind, Bootstrap, Next.js, Vue ni Angular.

---

## 1. Fundamentos pedagógicos (base documental)

Esta sección resume **únicamente** lo que está respaldado por los documentos pedagógicos aportados por el usuario. **No agregar principios ni atribuciones adicionales.**

### 1.1 Educación Matemática Realista (EMR)
Vinculada a **Hans Freudenthal**: las matemáticas son una **actividad humana**, que se construye explorando, interpretando y organizando situaciones reales o imaginables mediante **matematización**.

- **Matematización horizontal:** interpretar la situación, identificar elementos relevantes, elegir variables y transformar el problema en representaciones matemáticas.
- **Matematización vertical:** trabajar dentro de las estructuras matemáticas: procedimientos, patrones, reorganización de relaciones, generalización y formalización.

**Los seis principios de la EMR**

| # | Principio | Idea central | Cómo aparece en la app |
|---|---|---|---|
| 1 | **Actividad** | El estudiante hace y construye la matemática. | Decide, modifica, observa y construye reglas. |
| 2 | **Realidad** | Se parte de situaciones reales o imaginables con sentido. | Inversión con monedas ficticias. |
| 3 | **Reinvención guiada** | El estudiante reconstruye el conocimiento con orientación, sin recibir la fórmula terminada. | Pistas graduales, comparaciones y retroalimentación; la fórmula se revela al final de la construcción. |
| 4 | **Niveles** | El razonamiento progresa: situacional → referencial → general → formal. | Observar dinero → tablas/gráficas → patrones → fórmulas. |
| 5 | **Interacción** | Comparar, discutir, argumentar y reflexionar fortalece el aprendizaje. | Comparaciones, Mesa de discusión, justificaciones. |
| 6 | **Interconexión** | Los conceptos se relacionan en una misma situación. | C, i, n, I y M en un único modelo. |

Los principios **no funcionan aislados**: actividad y realidad son la base; reinvención guiada, interacción e interconexión se articulan para llegar al razonamiento formal mediante la progresión de niveles. La app no debe presentarlos como lista independiente.

**Niveles EMR** (describen *formas de razonamiento y producciones*, **no categorías permanentes de estudiantes**; la app nunca etiqueta a un estudiante con un nivel):
- **Situacional:** razonamiento ligado al contexto y a las acciones realizadas.
- **Referencial:** uso de modelos, esquemas o representaciones que organizan la situación.
- **General:** reconocimiento de patrones, relaciones y generalizaciones.
- **Formal:** procedimientos convencionales, simbolización y notación.

### 1.2 Modelización y proyectos realistas
Un buen problema situacional: parte de una situación significativa, conecta varias actividades en una misma situación, tiene complejidad progresiva, admite varias estrategias, hace visibles patrones y relaciones de cambio, promueve comprobar la validez de los resultados y ofrece distintos niveles de desafío.

**Ciclo de modelización (orientación, no secuencia rígida):**
1. Seleccionar una problemática del contexto.
2. Identificar los elementos significativos y expresarlos matemáticamente.
3. Aplicar análisis matemático para obtener resultados.
4. Evaluar los resultados y determinar cómo explican o afectan la situación inicial.

### 1.3 Aprendizaje realista
Cinco principios asociados a la **formación docente**, atribuidos en la síntesis documental a **Alsina (2009)**. Su uso en QR Inversores es una **adaptación pedagógica** para una experiencia estudiantil (conservar esta aclaración en la ventana "¿De dónde viene esto?" del panel).

| # | Principio de aprendizaje realista | Cómo aparece en la app |
|---|---|---|
| AR1 | Partir de cuestiones emergentes de la práctica real | Se empieza con una decisión concreta de inversión, no con teoría. |
| AR2 | Promover la reflexión sistemática | Reflexión guiada tras inversiones y rondas (ciclo de Korthagen, §6.3). |
| AR3 | Comprender el aprendizaje como proceso social e interactivo | Comparar modelos, explicar estrategias, Mesa de discusión. |
| AR4 | Trabajar mediante **Representación, Esquema y Teoría** | Visualizar el dinero → organizar en tablas/gráficas → relacionar con fórmulas. |
| AR5 | Promover identidad, autonomía y autorregulación | Estrategia propia, meta propia, decidir qué explorar. |

**Ciclo reflexivo de Korthagen** (según el documento): (1) acción o experiencia, (2) mirar hacia atrás, (3) tomar conciencia y formular aspectos importantes, (4) buscar y preparar alternativas, (5) comprobar su eficacia en una nueva situación.

### 1.4 Distinción obligatoria (no confundir)
- **Niveles EMR** (situacional, referencial, general, formal) ≠ **niveles de aprendizaje realista** (Representación, Esquema, Teoría). Son marcos distintos. En la interfaz se muestran con **chips de forma y color diferentes** y rótulos explícitos ("Nivel de razonamiento" vs. "Nivel de representación").
- La EMR aporta los principios para construir conocimiento matemático por matematización. El aprendizaje realista aporta la perspectiva de experiencia, reflexión, interacción, representación y autonomía. Se complementan; **no atribuir funcionalidades que los documentos no respalden.**

---

## 2. Fundamentos matemáticos del modelo

### 2.1 Variables

| Símbolo | Nombre en la app | Descripción | Tipo / unidad | Rango en el juego |
|---|---|---|---|---|
| `C` | Capital | Dinero invertido al inicio | número, 🪙 | 50–1 000, múltiplos de 50 |
| `i` | Tasa por periodo | Fracción del capital (o del saldo) que se gana cada periodo | decimal (`0.03` = 3 %) | 0.02, 0.03, 0.05 |
| `n` | Periodos | Cantidad de periodos de la inversión | entero | 1–12 (real), 1–24 (Laboratorio) |
| `I` | Interés / ganancia | Dinero generado | 🪙 | calculado |
| `M` | Monto final | Capital + interés | 🪙 | calculado |
| `k` | Periodo transcurrido | Periodos ya vividos de una inversión activa (0 ≤ k ≤ n) | entero | calculado |
| `S_k` | Saldo al periodo k | Valor de la inversión tras k periodos (`S_0 = C`) | 🪙 | calculado |

**Convención:** `i` siempre es **decimal** en las fórmulas y en las fichas del Constructor (3 % ⇒ 0.03). En la interfaz se muestra como porcentaje y, en el Constructor, `i` aparece como "i (3 % → 0,03)".

### 2.2 Interés simple
El interés de cada periodo se calcula siempre sobre el **capital inicial**. Es constante.

```
I = C · i · n
M = C + I
S_k = C + C · i · k
Interés del periodo k = C · i        (constante)
```

### 2.3 Interés compuesto
El interés de cada periodo se calcula sobre el **saldo acumulado** del periodo anterior. Es creciente.

```
M = C · (1 + i)^n
I = M − C
S_k = C · (1 + i)^k
S_k = S_(k−1) · (1 + i)
Interés del periodo k = S_(k−1) · i
```

### 2.4 Relaciones que el modelo debe cumplir (se prueban en el Skill 3)
- Con `n = 1`, simple y compuesto dan el mismo monto.
- Para `n ≥ 2` e `i > 0`: `M_compuesto > M_simple`.
- Diferencia compuesto − simple = `C · [(1+i)^n − 1 − i·n]`, que crece con `n` y con `i`.
- Simple: duplicar `C` duplica `I`; duplicar `n` duplica `I`; duplicar `i` duplica `I`.
- Compuesto: duplicar `C` duplica `I`; duplicar `n` **no** duplica `I`.
- `Σ interés por periodo (tabla) = I`.
- `S_n = M`.

### 2.5 Convención de redondeo
- **Cálculo interno sin redondeo.** El saldo compuesto se calcula con `S_k = S_(k−1)·(1+i)` o con la fórmula cerrada; ambas deben coincidir con tolerancia `1e-9` relativa.
- **Redondeo solo para mostrar:** 2 decimales, método "mitad hacia arriba" con corrección de coma flotante: `Math.round((x + Number.EPSILON) * 100) / 100`.
- Las pruebas comparan contra valores esperados con tolerancia `0.005` (mitad de un centavo) para los valores mostrados y `1e-6` para valores internos.
- En tablas se muestra la nota: *"Los números se muestran con 2 decimales; el cálculo interno es exacto."*

---

## 3. Catálogo, reglas de inversión y contabilidad

### 3.1 Catálogo (idéntico al Skill 1 §9.1)

| ID | Nombre | Tipo | `i` | Plazo `n` | Mínimo `C` | Desbloqueo |
|---|---|---|---|---|---|---|
| S1 | Alcancía Mágica 🐷 | Simple | 0.02 | 1–12 | 50 | E1 |
| S2 | Granja Feliz 🐄 | Simple | 0.03 | 2–12 | 100 | E1 |
| S3 | Cohete Ahorrador 🚀 | Simple | 0.05 | 4–12 | 200 | E1 |
| C1 | Brote Mágico 🌱 | Compuesto | 0.02 | 1–12 | 50 | E4 |
| C2 | Árbol Frutal 🌳 | Compuesto | 0.03 | 2–12 | 100 | E4 |
| C3 | Bosque Encantado 🌲 | Compuesto | 0.05 | 4–12 | 200 | E4 |

Pares gemelos: S1↔C1, S2↔C2, S3↔C3 (misma `i`, mismos límites; solo cambia el tipo de interés).

**Cómo se seleccionan las tasas:** no se escriben; cada producto fija su tasa. Esto elimina ruido (el estudiante compara *tipo de interés*, no tasas arbitrarias) y evita tasas irreales. **Cómo se seleccionan los periodos:** con control deslizante entero dentro del rango del producto, limitado por el horizonte restante `12 − periodoActual`.

### 3.2 Reglas de inversión (validaciones; códigos de error fijos)

| Código | Condición de error | Mensaje amable (ejemplo) |
|---|---|---|
| `PRODUCTO_BLOQUEADO` | Producto compuesto antes de E4 | "Este producto se desbloquea más adelante 🔒" |
| `MONTO_NO_MULTIPLO` | `monto % 50 ≠ 0` | "Elige montos de 50 en 50." |
| `MONTO_BAJO_MINIMO` | `monto < mínimo(producto)` | "Este producto pide al menos {mínimo} 🪙." |
| `SIN_FONDOS` | `monto > disponible` | "No te alcanza el dinero disponible." |
| `PLAZO_FUERA_RANGO` | `n` fuera del rango del producto | "Este producto va de {a} a {b} periodos." |
| `EXCEDE_HORIZONTE` | `periodoActual + n > 12` | "Esta inversión terminaría después del periodo 12." |
| `MAX_ACTIVAS` | ya hay 4 activas | "Ya tienes 4 inversiones activas." |
| `SALA_PAUSADA` | estado de sala = pausada | "Tu profe pausó la sala. ¡Un momento!" |

El motor devuelve `{ ok: false, codigo }` o `{ ok: true }`. **La interfaz nunca valida por su cuenta**: solo muestra el resultado del motor.

### 3.3 Contabilidad de la ronda
Estado de ronda: `capitalInicial` (1 000), `periodoActual` (0–12), `disponible`, lista de inversiones (`activa` o `vencida`).

- **Invertir `C`:** `disponible ← disponible − C`; la inversión queda `activa` con `inicio = periodoActual`.
- **Avanzar un periodo:** `periodoActual ← periodoActual + 1`; para cada inversión activa, `k = periodoActual − inicio`; si `k = n`, se **vence**: `disponible ← disponible + M`.
- **Invertido** = Σ `C` de inversiones activas.
- **Devengado de una activa** = `S_k − C` (interés ganado hasta ahora, aún bloqueado).
- **Ganancias acumuladas** = Σ `I` de vencidas + Σ devengado de activas.
- **Patrimonio** = `disponible + invertido + Σ devengado de activas`.
- **Invariante I-1:** `patrimonio = capitalInicial + gananciasAcumuladas` **siempre**.
- **Invariante I-2:** `disponible ≥ 0`.
- **Invariante I-3:** a `periodoActual = 12` no hay inversiones activas.
- La ronda termina cuando `periodoActual = 12`.

---

## 4. Ejemplos numéricos (verificados)

**Ej. 1 — Simple.** `C = 1 000`, `i = 0.03`, `n = 6`: ganancia por periodo = 30; `I = 1 000·0.03·6 = 180`; `M = 1 180`.

**Ej. 2 — Compuesto, mismos datos.** `M = 1 000·1.03^6 = 1 194.0523…` → **1 194.05**; `I = 194.05`. Ventaja sobre el simple: **14.05 🪙**.

**Ej. 3 — Tabla compuesta** (`C = 1 000`, `i = 0.05`, `n = 3`):

| Periodo | Saldo inicial | Interés del periodo | Saldo final |
|---|---|---|---|
| 1 | 1 000.00 | 50.00 | 1 050.00 |
| 2 | 1 050.00 | 52.50 | 1 102.50 |
| 3 | 1 102.50 | 55.125 → 55.13 | 1 157.625 → 1 157.63 |

Misma inversión en simple: interés 50.00 en cada periodo, `M = 1 150.00`.

**Ej. 4 — Efecto del tiempo** (`C = 1 000`, `i = 0.05`, `n = 12`): simple `M = 1 600`; compuesto `M = 1 795.86` (`1.05^12 = 1.79585…`). Diferencia **195.86**.

**Ej. 5 — Punto de ventaja** (`C = 1 000`, `i = 0.02`, umbral de diferencia 10 🪙): diferencia en `n = 7` = 8.69; en `n = 8` = 11.66. **Primer `n` con diferencia ≥ 10: 8.**

**Ej. 6 — Ronda con dos inversiones** (para pruebas de contabilidad):
1. Inicio: disponible 1 000.
2. Invierte 400 en S2 (3 %, `n = 4`) y 300 en C2 (3 %, `n = 6`): disponible = 300.
3. Avanza 4 periodos: S2 vence (`I = 48`, `M = 448`) → disponible = **748.00**; invertido = 300; devengado C2 = `300·(1.03^4 − 1)` = 37.6526; ganancias = 85.6526; patrimonio = **1 085.65** = 1 000 + 85.65 ✔.
4. Avanza 2 periodos más: C2 vence (`M = 358.2157`, `I = 58.2157`) → disponible = **1 106.22**; ganancias = **106.22**; patrimonio = 1 106.22 ✔.

---

## 5. Casos de verificación matemática (obligatorios en las pruebas)

Los valores "mostrado" se comparan con tolerancia `0.005`; el valor interno con `1e-6`.

| ID | Entrada | Esperado |
|---|---|---|
| M-01 | Simple `C=1000, i=0.03, n=6` | `I=180`, `M=1180` |
| M-02 | Compuesto `C=1000, i=0.03, n=6` | `M≈1194.0523` (1194.05), `I=194.05` |
| M-03 | Simple `C=1000, i=0.05, n=12` | `I=600`, `M=1600` |
| M-04 | Compuesto `C=1000, i=0.05, n=12` | `M≈1795.8563` (1795.86), `I=795.86` |
| M-05 | Simple `C=500, i=0.02, n=10` | `I=100`, `M=600` |
| M-06 | Compuesto `C=500, i=0.02, n=10` | `M≈609.4972` (609.50), `I=109.50` |
| M-07 | `n=1`, `C=1000, i=0.05`, ambos tipos | `M=1050` en ambos |
| M-08 | Simple `C=200, i=0.03, n=4` | `I=24`, `M=224` |
| M-09 | Compuesto `C=200, i=0.03, n=4` | `M≈225.1018` (225.10), `I=25.10` |
| M-10 | Tabla compuesta `C=1000, i=0.05, n=3` | Filas del Ej. 3; `Σ intereses = I`; `S_3 = M` |
| M-11 | `C=100, i=0.02, n=2` | simple 104.00; compuesto 104.04 |
| M-12 | `primerPeriodoConDiferencia(C=1000, i=0.02, umbral=10, maxN=24)` | `8` (diferencias: n=7 → 8.69; n=8 → 11.66) |
| M-13 | Devengado `C=1000, i=0.03, k=4` | simple 120.00; compuesto 125.51 |
| M-14 | Escenario del Ej. 6 | disponible 748.00 tras 4 periodos; 1 106.22 tras 6; patrimonio = 1000 + ganancias en ambos |
| M-15 | Cada código de error de §3.2 | El motor devuelve el código correcto |
| M-16 | Propiedad: para todas las combinaciones válidas del catálogo | `M_comp ≥ M_simple`, estricto si `n ≥ 2`; `S_k` recursivo = `S_k` cerrado |
| M-17 | Propiedad: duplicar `C` en simple y compuesto | duplica `I` |
| M-18 | Propiedad: secuencia aleatoria de 200 acciones válidas | I-1, I-2, I-3 se cumplen en cada paso |
| M-19 | Evaluador de fichas: `C*(1+i)^n` con `C=500, i=0.02, n=10` | `609.4972…` |
| M-20 | Evaluador: expresión mal formada / división por cero | devuelve error controlado, nunca lanza excepción no capturada |

**Verificación de tablas de la interfaz:** cada tabla mostrada debe provenir de `construirTabla…` del motor y se valida que `última fila = M`.

---

## 6. Construcción progresiva del modelo y secuencia de aprendizaje

### 6.1 Decisiones didácticas transversales (obligatorias para el agente programador)

1. **La app no es una calculadora.** En una inversión real, antes de invertir se muestra el **plan** (producto, monto, plazo) pero **no el monto final**. El estudiante escribe una **predicción** y el resultado aparece al ir avanzando el tiempo.
2. **La fórmula formal se revela al final de su construcción.** `I = C·i·n` y `M = C + I` aparecen solo al verificar la regla en E3; `M = C(1+i)^n` solo al verificar la regla en E4. Antes se usan **palabras y fichas** ("ganancia de cada periodo", "saldo anterior").
3. **Las pistas guían, no resuelven.** Nunca muestran el resultado del caso del propio estudiante (ver §7).
4. **Las equivocaciones son información.** La retroalimentación describe qué pasó y qué pregunta ayudaría; no hay puntuación negativa.
5. **El Laboratorio** (E2) sí muestra resultados completos (tabla y gráfica) tras pulsar "Simular", porque son los datos para detectar patrones; pero no ofrece una calculadora abierta con teclado de fórmulas: se manipulan controles deslizantes con paso fijo y se compara contra el experimento anterior.
6. **Progresión de representaciones:** cada etapa añade una representación nueva: dinero que se mueve → tabla → gráfica → regla con fichas → notación formal (ver §10 y §11).
7. **Reflexión incorporada**, no solo al final (§6.3).
8. **Interacción:** al menos dos momentos de discusión del grupo: tras E5 y tras E6 (Mesa de discusión).

### 6.2 Etapas: actividades, guías, evidencias y criterios de avance

La tabla maestra de principios por etapa está en §10. A continuación, el diseño operativo de cada etapa.

#### E0 — Bienvenida
- **Situación:** "Tienes 1 000 monedas. ¿Cómo las harías crecer?"
- **Actividad:** alias, avatar, 3 tarjetas de contexto.
- **Evidencia:** `participante_unido`.
- **Avance:** alias y avatar confirmados.

#### E1 — Mi primera inversión (solo productos simples)
- **Situación (AR1, Realidad):** decidir dónde poner el dinero.
- **Matematización horizontal:** el estudiante elige producto, monto y plazo; la app etiqueta visualmente las variables con colores constantes (🟣 capital, 🟡 tasa, 🔵 periodos, 🟢 ganancia, 🏦 monto final) en la tarjeta de plan y en el resultado.
- **Actividades:**
  1. Elegir producto/monto/plazo.
  2. **Predicción** obligatoria ("¿Cuánto crees que tendrás al final?") + pregunta de estrategia: *Fui sumando periodo a periodo / Multipliqué / Lo adiviné / Otra*.
  3. Invertir y pulsar "Avanzar 1 periodo" viendo la ganancia de cada periodo (la tarjeta muestra "+X 🪙 este periodo").
  4. Al vencer: comparar predicción y resultado (retroalimentación §8).
  5. **Mini-reflexión** (pasos 2–4 de Korthagen, §6.3).
- **Guía:** pregunta orientadora "¿La ganancia fue igual o distinta en cada periodo?".
- **Evidencias:** `prediccion_registrada`, `inversion_creada`, `tiempo_avanzado`, `inversion_vencida`, `reflexion_registrada`.
- **Avance:** 1 inversión simple vencida + predicción + mini-reflexión.

#### E2 — Laboratorio de pruebas
- **Objetivo:** pasar de una situación a **relaciones entre variables** (nivel referencial, Esquema).
- **Actividades:** el Laboratorio ofrece producto (simple), `C` (50–1 000), `n` (1–24). Botón "Simular" produce tabla + gráfica y registra el experimento. La app detecta **experimento controlado** cuando dos simulaciones consecutivas difieren en **exactamente una** variable.
- **Retos guiados (tarjetas):** "Cambia solo el capital", "Cambia solo los periodos", "Cambia solo el producto (la tasa)".
- **Conclusiones por variable:** tras cada reto, el estudiante completa: *"Cuando [duplico] el [capital], la ganancia total [se duplica / queda igual / aumenta menos que el doble]"*. La app corrige después de que responde, mostrando los dos experimentos como evidencia.
- **Evidencias:** `simulacion_ejecutada`, `experimento_controlado_completado`, `conclusion_experimento`.
- **Avance:** 3 experimentos controlados (uno por variable) + 3 conclusiones elegidas (correctas o corregidas tras ver la evidencia).

#### E3 — Descubre la regla del interés simple
- **Objetivo:** matematización vertical: pasar de los datos a una **regla general** y luego al **símbolo**.
- **Constructor de reglas por fichas** (§6.4). Dos pasos:
  - **R1:** "Ganancia de **un** periodo" → meta: `C × i`.
  - **R2:** "Ganancia **total**" → meta: `C × i × n` (o `(C × i) × n`).
  - **R3:** "Monto final" → meta: `C + (C × i × n)` o `C × (1 + i × n)`.
- **Prueba de la regla:** botón "Probar mi regla" evalúa las fichas contra **casos del estudiante** (sus inversiones simples vencidas y experimentos del Laboratorio, mínimo 3; si no hay suficientes, la app completa con casos de práctica propuestos). Muestra ✔ / ✘ por caso con la diferencia.
- **Revelación formal:** al verificar R1, R2 y R3 aparece la tarjeta "Tu regla tiene un nombre matemático: `I = C · i · n`, `M = C + I`", mostrando la equivalencia con las fichas del estudiante (interconexión de lenguajes).
- **Evidencias:** `regla_probada`, `regla_verificada`, `pista_usada`.
- **Avance:** R1, R2, R3 verificadas.

#### E4 — El interés que crece (compuesto)
- **Desbloqueo:** aparecen C1, C2, C3 con la etiqueta verde "Compuesto".
- **Actividades:**
  1. **Predecir y observar:** invertir en el gemelo de un producto simple ya usado (la app sugiere "¿Y si fuera el gemelo?") y predecir antes.
  2. **Tabla de saldos** (columnas: saldo inicial, ganancia del periodo, saldo final). En los primeros periodos la app pide **predecir el siguiente saldo** antes de mostrarlo.
  3. **Pregunta de contraste:** "¿Por qué la ganancia del periodo 2 es distinta de la del periodo 1 si la tasa es la misma?" (selección de observaciones + texto corto opcional).
  4. **Constructor de reglas:**
     - **R4** "saldo del periodo siguiente" → meta: `saldoAnterior × (1 + i)`.
     - **R5** "monto después de n periodos" → meta: `C × (1 + i) ^ n`. Se habilita la ficha de exponente solo después de completar R4 (el estudiante ya "multiplicó varias veces").
  5. **Revelación formal:** tras verificar R5 aparece `M = C · (1 + i)^n` con el mapeo a las fichas del estudiante.
- **Interconexión:** la ganancia del periodo en el compuesto reutiliza R1 (`saldo × i`).
- **Evidencias:** `prediccion_registrada` (saldo siguiente), `conclusion_observacion`, `regla_probada`, `regla_verificada`.
- **Avance:** R4 y R5 verificadas.

#### E5 — Simple vs. compuesto
- **Comparador:** elegir un par gemelo, `C` y `n`. Muestra dos líneas (azul simple, verde compuesto), dos tablas y una tarjeta de diferencia.
- **Reto "Punto de ventaja":** el estudiante fija un **umbral** (ej. "que la diferencia sea al menos 10 🪙") y busca el primer `n` donde ocurre (puede mover `n`); la app valida con `primerPeriodoConDiferencia`.
- **Conclusión estructurada:** "Con la misma [tasa] y el mismo [capital], el [compuesto] gana más que el [simple] a partir del periodo [__] porque [la ganancia se calcula sobre un saldo que crece]" (opciones + texto corto).
- **Interacción:** pregunta detonante del docente y discusión de 2 minutos (el docente puede proyectar comparadores de estudiantes).
- **Evidencias:** `comparacion_ejecutada`, `punto_ventaja_encontrado`, `conclusion_comparacion`.
- **Avance:** conclusión registrada + punto de ventaja encontrado.

#### E6 — Mi estrategia
- **Situación (autonomía, AR5):** nueva **ronda de plan** con 1 000 🪙, 12 periodos.
- **Pasos:**
  1. **Meta propia:** el estudiante escribe su meta de patrimonio al periodo 12 (campo numérico, rango 1 000–2 500) y puede añadir una **fecha de liquidez** opcional ("necesito 200 🪙 disponibles en el periodo 6").
  2. **Plan:** diseñar ≥ 2 inversiones. La app muestra un **borrador del plan** (tabla de decisiones) y permite ajustarlo antes de ejecutar; hay una predicción del patrimonio final.
  3. **Ejecutar:** avanzar el tiempo hasta el periodo 12.
  4. **Resumen de ronda:** meta vs. resultado, gráfica de patrimonio, aporte de cada inversión.
  5. **Justificación estructurada:** "Mi meta fue [__]. Elegí [producto] porque [__]. Si cambiara [monto/plazo/producto], el resultado sería [mayor/menor/igual] porque [__]." Debe incluir al menos una referencia a un dato de su tabla (selector "citar evidencia").
  6. **Reflexión completa** (5 pasos Korthagen, §6.3).
  7. **Compartir estrategia** (opcional): alias visible, anónimo o no compartir.
- **Evidencias:** `meta_definida`, `plan_borrador`, `plan_ejecutado`, `justificacion_registrada`, `reflexion_registrada`, `estrategia_compartida`.
- **Avance:** plan ejecutado + justificación + reflexión completa. **No se exige alcanzar la meta ni ganar más dinero.**

#### E7 — Mi modelo
- **Verificación con escenarios nuevos:** la app propone 2 escenarios (uno simple y uno compuesto, con valores nuevos dentro del catálogo). El estudiante calcula con **sus fichas/fórmulas** y escribe su predicción; la app verifica con el motor (≥ 2 verificaciones).
- **Mapa del modelo (interconexión):** el estudiante arrastra/conecta tarjetas `C`, `i`, `n`, `I`, `M`, "ganancia por periodo", "saldo" con flechas etiquetadas y dos fichas de fórmula (simple/compuesta). La app valida conexiones esenciales (p. ej. `C·i → ganancia por periodo`; `(1+i)` actúa en cada periodo).
- **Segunda ronda de plan** (opcional): probar una estrategia distinta y compararla con la primera (paso 5 de Korthagen).
- **Evidencias:** `verificacion_modelo`, `mapa_modelo_completado`, `etapa_completada`.
- **Avance:** 2 verificaciones + mapa completo.

### 6.3 Reflexión guiada (ciclo de Korthagen en la interfaz)
Componente reutilizable `ReflexionGuiada` con 5 pasos (en E1 se usan solo los pasos 2–4):

| Paso | Qué ve y hace el estudiante |
|---|---|
| 1. Acción | Resumen automático de lo que hizo (inversión/plan). |
| 2. Mirar hacia atrás | "Esperabas [predicción] y obtuviste [resultado]. ¿Qué te sorprendió?" (opciones + texto opcional). |
| 3. Tomar conciencia | "¿Qué notaste sobre la ganancia de cada periodo?" (tarjetas de observación; puede elegir varias). |
| 4. Alternativas | "¿Qué cambiarías?" (monto / plazo / producto / ninguno) + "¿qué esperarías que pase?". |
| 5. Comprobar | Botón "Probarlo": abre Laboratorio o nueva práctica con los cambios precargados; al terminar, compara con lo que esperaba (guarda evento `reflexion_comprobada`; desbloquea insignia 🔄 si ajustó algo). |

### 6.4 Constructor de reglas por fichas (especificación funcional)

- **Fichas disponibles:** variables `C`, `i`, `n`, `saldo anterior` (solo E4+), número `1`; operadores `+`, `−`, `×`, `÷`, `^` (solo R5), paréntesis `(` `)`.
- **Ranuras:** una fila donde se ordenan las fichas (arrastrar o tocar para agregar; botón borrar).
- **Evaluación:** el motor convierte la secuencia en una expresión y la evalúa con un **evaluador propio** (analizador por descenso recursivo con precedencia estándar; **sin `eval`, sin `Function`**) sustituyendo `C, i, n, saldo anterior` con los valores de cada caso.
- **Aprobación:** la regla se aprueba si coincide con el valor esperado de **todos** los casos (tolerancia `0.005`). Se aceptan expresiones **numéricamente equivalentes** (p. ej. `C×(1+i×n)` y `C+C×i×n`).
- **Contraejemplos:** si falla, se muestran los casos que no coinciden con: tu regla da X, la inversión real fue Y, diferencia Z.
- **Casos usados:** al menos 3 casos con valores distintos de `C`, `i`, `n` (propios; si no alcanzan, se completan con casos propuestos).
- **Objetivos de cada regla** (variable esperada): R1 = ganancia de un periodo simple (`C·i`); R2 = ganancia total simple; R3 = monto final simple; R4 = saldo siguiente (compuesto, usando `saldo anterior`); R5 = monto compuesto tras `n` periodos.

---

## 7. Sistema de guías (pistas graduales)

Cada actividad con intento verificable tiene hasta **3 pistas** que se piden a demanda o aparecen tras 2 intentos fallidos. **Cada pista usada se registra** (`pista_usada`) como evidencia de autorregulación (no penaliza).

| Nivel | Función | Regla |
|---|---|---|
| Pista 1 | **Pregunta orientadora** | No menciona operaciones. Dirige la atención. |
| Pista 2 | **Señalamiento** | Resalta en pantalla una columna, dato o par de datos relevante. |
| Pista 3 | **Ejemplo análogo** | Un ejemplo resuelto con **otros números** (nunca los del caso del estudiante). |

**Textos base (el agente puede ajustar redacción, no el nivel de ayuda):**

| Actividad | Pista 1 | Pista 2 | Pista 3 |
|---|---|---|---|
| E1 – ganancia por periodo | "Mira lo que ganaste cada periodo. ¿Cambia de un periodo a otro?" | Resalta los "+X 🪙 este periodo" de la inversión. | "Con 200 🪙 al 2 %, ganas 4 🪙 cada periodo, siempre 4." |
| E2 – conclusión de variable | "Compara los dos experimentos. ¿Qué número cambió y cuál no?" | Resalta ambas gráficas superpuestas con la variable cambiada marcada. | "Si 100 🪙 ganan 2 y 200 🪙 ganan 4, ¿qué pasó con la ganancia cuando el capital se duplicó?" |
| E3 – R1 | "¿Qué dos cosas necesitas para saber cuánto ganas en **un** periodo?" | Resalta el capital y la tasa en la tarjeta de plan. | "Si ganas 4 🪙 con 200 🪙 y tasa 0,02, mira qué operación une 200 y 0,02 para dar 4." |
| E3 – R2 | "Tu regla sirve para un periodo. ¿Qué haces con esa ganancia si hay más periodos?" | Resalta la fila de periodos y el total acumulado. | "Si cada periodo ganas 4 🪙 y son 5 periodos, ¿cómo llegas a 20?" |
| E4 – saldo siguiente | "Mira cómo cambia la ganancia de un periodo al siguiente. ¿Sobre qué dinero se calcula ahora?" | Resalta el saldo inicial de cada fila y la ganancia de esa fila. | "Con saldo 100 y tasa 0,10: 100 pasa a 110; 110 pasa a 121. ¿Qué se hizo con el saldo cada vez?" |
| E4 – R5 | "Si repites la misma multiplicación varios periodos seguidos, ¿cómo la escribirías más corto?" | Resalta los pasos de multiplicación en la tabla. | "1,1 × 1,1 × 1,1 se puede escribir como 1,1 con un 3 arriba." |
| E5 – punto de ventaja | "¿Desde qué periodo las dos líneas ya se separan lo suficiente?" | Resalta la zona de la gráfica donde la diferencia pasa tu umbral. | "En un ejemplo con otros valores, la diferencia pasó de 5 a 12 entre los periodos 5 y 8." |
| E6 – justificación | "¿Qué dato de tu tabla respalda tu elección?" | Abre "citar evidencia" con las filas más relevantes. | Marco de oración parcialmente completado con otro ejemplo. |
| E7 – verificación | "¿Qué regla tuya usarías para este caso? ¿Es simple o compuesto?" | Resalta las fichas de la regla correspondiente. | Ejemplo de uso de regla con otros números. |

**Regla de oro:** si el estudiante pide pista 3 repetidamente, no se bloquea nada; el docente ve el conteo de pistas por etapa para decidir apoyos.

---

## 8. Retroalimentación matemática

### 8.1 Principios
1. **Describe antes de evaluar:** muestra los datos (predicción, resultado, diferencia).
2. **Pregunta antes de explicar:** una pregunta que active el razonamiento.
3. **Nunca castiga:** no hay puntaje negativo ni mensajes de "incorrecto" en rojo; se usan "casi", "revisemos" y color neutro.
4. **Específica:** detecta patrones de error frecuentes (§8.2).
5. **Verificable:** todo mensaje apunta a evidencia visible (fila de tabla, punto de gráfica).

### 8.2 Diagnóstico de predicciones (`diagnosticarPrediccion`, función pura en el módulo de modelo)
Dado un caso real `{tipo, C, i, n}` y la predicción `p`:

| Código | Condición (tolerancia `0.5 %` del valor de referencia) | Mensaje (ejemplo) |
|---|---|---|
| `ACIERTO_CERCANO` | `|p − M| ≤ 1 % de M` | "¡Muy cerca! Tu cálculo estuvo a {dif} 🪙 del resultado. ¿Cómo lo estimaste?" |
| `SOLO_UN_PERIODO` | `p ≈ C·i` | "Tu número coincide con la ganancia de **un** periodo. ¿Cuántos periodos tiene tu inversión?" |
| `SOLO_GANANCIA` | `p ≈ I` (no sumó el capital) | "Parece que contaste solo la ganancia. ¿Qué parte del dinero sigue siendo tuya al final?" |
| `TASA_COMO_ENTERO` | `p ≈ múltiplo grande de C` (usó 3 en vez de 0.03) | "¿Cómo escribirías 3 % como número decimal?" |
| `COMPUESTO_COMO_SIMPLE` (E4+) | tipo compuesto y `p ≈ M_simple` | "Tu resultado sirve si la ganancia fuera igual cada periodo. Mira la tabla: ¿lo es?" |
| `SUBESTIMA` / `SOBREESTIMA` | resto de casos | "Quedaste {por debajo/por encima}. Revisa la tabla periodo a periodo: ¿dónde se separa de tu cálculo?" |

### 8.3 Retroalimentación al Constructor de reglas
- Mostrar tabla de casos con ✔/✘, valor de la regla del estudiante, valor real y diferencia.
- Si la regla falla en **todos** los casos y es de estructura distinta, sugerir pista 1.
- Si falla solo en algunos (típico: no usa `n`), señalar el patrón: "Funciona cuando n = 1. ¿Qué pasa cuando hay más periodos?".

### 8.4 Reglas de tono
Frases cortas, lenguaje amable, un emoji como máximo por mensaje, segunda persona ("tu regla", "tu predicción").

---

## 9. Comparación de decisiones

La app facilita comparar decisiones en cuatro niveles:

1. **Entre mis inversiones** (hasta 3, lado a lado): producto, `C`, `n`, `I`, `M`, **rendimiento total** `I/C` (para comparar con distinto capital) y **ganancia promedio por periodo** `I/n`.
2. **Con el gemelo** (E4+): botón "¿Y si fuera [gemelo]?" que abre el Comparador con los mismos `C` y `n`.
3. **Entre rondas** (E7 / deseable): ronda de práctica vs. ronda de plan o plan 1 vs. plan 2 (patrimonio por periodo en una misma gráfica).
4. **Con otros estudiantes** (Mesa de discusión, anónimo por defecto): dos estrategias en paralelo con tabla de decisiones y justificación; el docente formula preguntas de contraste.

**Visuales de comparación:** barras de "ganancia por periodo" (constante en simple, creciente en compuesto); líneas de saldo (azul simple, verde compuesto); tarjeta de diferencia con `C·[(1+i)^n − 1 − i·n]` **solo después de E5** y expresada con las palabras del estudiante primero.

---

## 10. Relación funcionalidades ↔ principios

### 10.1 Matriz por etapa (base de datos del panel pedagógico)

| Etapa | Principios EMR | Principios aprendizaje realista | Matematización | Nivel de razonamiento (EMR) | Nivel de representación (R-E-T) |
|---|---|---|---|---|---|
| E0 | Realidad | AR5 | — (contexto) | Situacional | Representación |
| E1 | Actividad, Realidad | AR1, AR2 | Horizontal | Situacional | Representación |
| E2 | Actividad, Interconexión, Niveles | AR4, AR5 | Horizontal → vertical | Referencial | Esquema |
| E3 | Reinvención guiada, Niveles | AR4, AR2 | Vertical | General → Formal | Esquema → Teoría |
| E4 | Reinvención guiada, Interconexión, Niveles | AR2, AR4 | Vertical | General → Formal | Esquema → Teoría |
| E5 | Interacción, Interconexión | AR3, AR2 | Vertical | General | Esquema |
| E6 | Actividad, Realidad, Interacción | AR5, AR2, AR3 | Horizontal y vertical | Referencial → General | Esquema |
| E7 | Niveles, Interconexión | AR4, AR5, AR2 | Vertical (evaluación del modelo) | Formal | Teoría |

### 10.2 Matriz por funcionalidad

| Funcionalidad | EMR | Aprendizaje realista | Cómo se evidencia |
|---|---|---|---|
| Inversión con monedas ficticias (F-07) | Realidad, Actividad | AR1 | `inversion_creada` |
| Predicción previa (E1) | Actividad | AR2, AR5 | `prediccion_registrada`, diagnóstico |
| Barra de saldos y avance del tiempo (F-08/F-09) | Realidad | AR4 (Representación) | `tiempo_avanzado` |
| Laboratorio con experimentos controlados (F-11) | Actividad, Interconexión | AR4 (Esquema), AR5 | `experimento_controlado_completado` |
| Constructor de reglas (F-12) | Reinvención guiada, Niveles | AR4 (Teoría) | `regla_verificada` |
| Pistas graduales (F-14) | Reinvención guiada | AR5 | `pista_usada` |
| Tabla de saldos del compuesto | Niveles, Interconexión | AR4 (Esquema) | `prediccion_registrada` (saldo siguiente) |
| Comparador (F-13) | Interacción, Interconexión | AR3 | `conclusion_comparacion` |
| Reflexión guiada (F-15) | — | AR2 (Korthagen) | `reflexion_registrada` |
| Ronda de plan con meta (F-18) | Actividad, Realidad | AR5 | `meta_definida`, `plan_ejecutado` |
| Justificación estructurada | Interacción | AR3, AR5 | `justificacion_registrada` |
| Mesa de discusión (F-20) | Interacción | AR3 | `estrategia_compartida` |
| Mapa del modelo (F-19) | Interconexión, Niveles | AR4 (Teoría) | `mapa_modelo_completado` |
| Panel pedagógico (F-16) | todos (visibilización) | AR2 (metacognición) | `panel_principio_visto` |

### 10.3 Cómo se conectan los principios (evitar lista aislada)
El panel presenta una **ruta**: Realidad + Actividad (E1) → Niveles e Interconexión (E2) → Reinvención guiada (E3–E4) → Interacción (E5–E6) → Niveles en lo formal (E7). Cada principio nuevo aparece "enlazado" al anterior con una frase corta (ver §11.4).

### 10.4 Ciclo de modelización en la app
| Momento | Dónde ocurre |
|---|---|
| 1. Problemática del contexto | E1 (decidir dónde invertir) |
| 2. Elementos significativos expresados matemáticamente | E1 (etiquetas de variables) → E3/E4 (fichas) |
| 3. Análisis matemático | E2–E5 (tablas, gráficas, comparaciones) |
| 4. Evaluar resultados | Reflexión, Comparador, E6 (meta vs. resultado), E7 (verificación) |

---

## 11. Panel pedagógico lateral

### 11.1 Comportamiento
- **Escritorio/tablet horizontal (≥ 1024 px):** panel fijo a la derecha (≈ 320 px), colapsable.
- **Móvil:** botón flotante "💡 ¿Qué estoy aprendiendo?" que abre un **cajón inferior** (80 % de alto máximo). No tapa los controles de inversión por defecto; se abre por toque, con un pequeño punto de aviso cuando cambia de contenido.
- **Contextual:** muestra el contenido de la **etapa actual** y puede actualizarse por **eventos relevantes** (§11.3).
- **No invasivo:** no abre solo, no bloquea acciones, se puede ocultar.
- **Progresivo:** muestra primero los principios de la etapa; los demás aparecen en la pestaña **"Mi ruta"** con candado hasta que se trabajan.
- **Distinción visual:** chips redondos para niveles EMR; chips con esquinas cuadradas para Representación/Esquema/Teoría; etiquetas distintas ("Nivel de razonamiento" / "Nivel de representación").

### 11.2 Estructura del contenido (cada entrada en `datos/pedagogia.js`)
```
etapa, titulo corto
principiosEMR: [{ id, nombre, explicacionBreve (≤ 20 palabras) }]
principiosAR:  [{ id, nombre, explicacionBreve (≤ 20 palabras) }]
queHaces:      frase en 2.ª persona sobre la acción matemática actual
tuRepresentacion: { nivelRazonamiento, nivelRepresentacion, descripcion }
tuModelo:      relación con interés simple/compuesto (símbolos solo si ya se revelaron)
evidenciaGuardada: función que lee los últimos eventos relacionados
enlaceConAnterior: frase corta que une con el principio de la etapa previa
```
Secciones visibles del panel (en este orden): **Principios que trabajas** → **Lo que haces matemáticamente** → **Tu representación** → **Tu modelo** → **Evidencia guardada** → botón **¿De dónde viene esto?** (modal con la aclaración de fuentes: EMR vinculada a Freudenthal; aprendizaje realista según Alsina (2009), adaptado de formación docente; ciclo de Korthagen).

### 11.3 Contenido por etapa (textos base; ajustar solo redacción)

| Etapa | Qué haces (ejemplo) | Tu modelo (ejemplo) |
|---|---|---|
| E0 | "Estás entrando a una situación de inversión donde tú tomas las decisiones." | "Aún no hay fórmulas: primero vas a vivir la situación." |
| E1 | "Estás eligiendo cuánto, dónde y por cuánto tiempo invertir, y prediciendo qué pasará. Identificas capital, tasa y periodos." | "Observa cuánto gana tu dinero cada periodo: es el inicio de tu modelo de interés simple." |
| E2 | "Estás cambiando una sola cosa a la vez para ver qué relaciones hay entre capital, tasa, periodos y ganancia." | "Estás descubriendo cómo se conectan las variables en un mismo modelo." |
| E3 | "Estás armando con fichas una regla que dé la ganancia y la pruebas con tus propios casos." | "Tu regla es una generalización del interés simple. Cuando funcione, verás su nombre matemático." |
| E4 | "Estás descubriendo por qué la ganancia cambia cada periodo y cómo se multiplica el saldo." | "El interés compuesto repite tu regla de un periodo, pero sobre un saldo que cambia." |
| E5 | "Estás comparando dos modelos con las mismas condiciones y explicando la diferencia." | "Simple: ganancia constante. Compuesto: ganancia creciente. Tú encuentras desde cuándo se nota." |
| E6 | "Estás tomando decisiones para una meta propia y justificándolas con datos de tus tablas." | "Eliges qué modelo usar y por qué. Tus decisiones se explican con tus reglas." |
| E7 | "Estás usando tus propias fórmulas para predecir casos nuevos y comprobando si funcionan." | "Tu modelo completo: simple (`I = C·i·n`) y compuesto (`M = C(1+i)^n`) conectados en un mapa." |

**Actualizaciones por evento (microtextos):**
| Evento | Microtexto del panel |
|---|---|
| `prediccion_registrada` | "Hacer una predicción es matematización horizontal: conviertes la situación en un número." |
| `inversion_vencida` | "Comparar lo que esperabas con lo que pasó es el paso 2 de la reflexión." |
| `experimento_controlado_completado` | "Cambiar una sola variable te permite ver su efecto sin mezclar causas." |
| `regla_verificada` | "Pasaste de casos concretos a una regla general: matematización vertical." |
| `conclusion_comparacion` | "Explicaste una diferencia con argumentos: eso es interacción y razonamiento." |
| `plan_ejecutado` | "Tu estrategia es un modelo en acción: ¿qué dice tu reflexión sobre ella?" |

### 11.4 Frases de enlace entre principios (interconexión de la ruta)
- E1→E2: "Ya viviste la situación (Realidad); ahora organízala (Niveles)."
- E2→E3: "Ya viste relaciones; ahora las expresas con tu propia regla (Reinvención guiada)."
- E3→E4: "Tu regla del simple va a ayudarte a entender el compuesto (Interconexión)."
- E4→E5: "Ya tienes dos modelos; compararlos y explicarlos es Interacción."
- E5→E6: "Usa lo que concluiste para decidir por ti mismo (Autonomía)."
- E6→E7: "Ahora comprueba tu modelo con casos nuevos (Niveles: formal)."

---

## 12. Evidencias de aprendizaje

### 12.1 Estructura de evento
```
{ id, ts, etapa, ronda, tipo, datos }
```
`datos` es un objeto pequeño y plano (≤ 500 bytes). Se guardan en el historial local y los resumen/eventos relevantes se sincronizan con la sala (ver Skill 3 §6).

### 12.2 Catálogo de eventos

| Tipo | Datos principales |
|---|---|
| `participante_unido` | alias, avatar |
| `prediccion_registrada` | contexto (`inversion`/`saldo`/`patrimonio`), valor, estrategia (`sumando`/`multiplicando`/`adivinando`/`regla`/`otra`) |
| `inversion_creada` | productoId, monto, plazo, periodoInicio, prediccion |
| `tiempo_avanzado` | de, a |
| `inversion_vencida` | inversionId, montoFinal, interes, desvioPrediccion, codigoDiagnostico |
| `simulacion_ejecutada` | productoId, C, n, variableCambiada (o `null`) |
| `experimento_controlado_completado` | variable, valorAntes, valorDespues |
| `conclusion_experimento` | variable, opcionElegida, esCorrecta, vistoEvidencia |
| `conclusion_observacion` | etapa, opciones elegidas, texto corto |
| `regla_probada` | reglaId, fichas, casosOk, casosTotal, aprobada |
| `regla_verificada` | reglaId, intentos, pistasUsadas |
| `pista_usada` | contexto, nivel |
| `reflexion_registrada` | paso, respuesta |
| `reflexion_comprobada` | cambioRealizado |
| `comparacion_ejecutada` | gemeloId, C, n |
| `punto_ventaja_encontrado` | umbral, n |
| `conclusion_comparacion` | opcionesElegidas, texto |
| `meta_definida` | valor, liquidez opcional |
| `plan_borrador` / `plan_ejecutado` | lista de inversiones, patrimonioFinal, cumplioMeta |
| `justificacion_registrada` | estructura completa, evidenciaCitada |
| `verificacion_modelo` | escenarioId, prediccion, real, ok |
| `mapa_modelo_completado` | conexiones |
| `estrategia_compartida` | modo (`alias`/`anonimo`) |
| `panel_principio_visto` | principioId |
| `insignia_otorgada` | insigniaId |
| `etapa_completada` | etapa |

### 12.3 Qué puede ver el docente a partir de las evidencias
- Por estudiante: etapa, patrimonio (informativo), tipos de producto usados, predicciones y su desvío, conteo de pistas, reglas construidas (fichas), justificaciones, insignias.
- Por grupo: distribución por etapa, uso simple vs. compuesto, errores frecuentes (diagnósticos agregados), pistas por etapa, comparaciones más usadas.
- **Producciones por nivel de razonamiento (EMR):** el docente ve *qué producciones* aparecieron (p. ej. "tabla", "regla con fichas", "formal en E7"), **no una etiqueta del estudiante**.

### 12.4 Indicadores de nivel por **producción** (no por estudiante)
| Nivel EMR | Producción observable |
|---|---|
| Situacional | Predicción por estrategia `sumando` o `adivinando`; conclusiones basadas en una sola inversión |
| Referencial | Uso de tabla/gráfica para responder; experimentos controlados completados |
| General | Regla verificada (R1, R2, R4); conclusión de comparación que menciona el patrón |
| Formal | Regla R3/R5 con notación; verificaciones de E7 con fichas/fórmulas |

---

## 13. Lista anti-calculadora (el agente debe cumplirla)

- [ ] Ninguna pantalla permite escribir `C, i, n` y obtener `M` sin pasar antes por predicción (en inversiones reales) o por experimento controlado (Laboratorio).
- [ ] La fórmula formal no aparece antes de verificar la regla correspondiente.
- [ ] Cada actividad pide al estudiante **hacer** algo (predecir, comparar, construir, justificar) antes de mostrar la respuesta.
- [ ] Las pistas no muestran el resultado del propio caso del estudiante.
- [ ] Hay reflexión integrada (E1, E6) y no solo al final.
- [ ] La interfaz distingue visualmente simple (azul) y compuesto (verde) y mantiene esa codificación.
- [ ] Los resultados de dinero no determinan insignias ni avance de etapa.
- [ ] El panel pedagógico se conecta con **acciones reales** del estudiante (eventos), no es texto decorativo.

---

## 14. Resumen de contratos que el Skill 3 debe implementar

El módulo de modelo (funciones puras, sin dependencias de React) debe exponer, como mínimo, estas capacidades (nombres y firmas exactas están en el Skill 3 §9):
`interesSimple`, `montoSimple`, `montoCompuesto`, `interesCompuesto`, `saldoSimple(k)`, `saldoCompuesto(k)`, `construirTablaSimple`, `construirTablaCompuesta`, `compararGemelos`, `primerPeriodoConDiferencia`, `redondear2`, `validarInversion`, `crearInversion`, `avanzarPeriodo`, `calcularResumenRonda`, `diagnosticarPrediccion`, `evaluarExpresion`, `evaluarRegla`, `calcularInsignias`.
