# SKILL 3 — ARQUITECTURA Y PLAN DE IMPLEMENTACIÓN: QR INVERSORES

> **Para quién es este archivo:** el agente programador.
> **Qué responde:** *cómo se construye* QR Inversores sobre el proyecto React existente, en qué orden y cómo se verifica.
> **Skills hermanos:** `SKILL_PRODUCTO_Y_EXPERIENCIA.md` (qué producto, reglas, alcance) y `SKILL_MODELO_MATEMATICO_Y_DIDACTICO.md` (fórmulas, catálogo, casos de verificación, guías, panel pedagógico, eventos).
> **Precedencia:** matemática y didáctica → Skill 2; comportamiento y alcance → Skill 1; decisiones técnicas → este Skill 3. Ante contradicciones, aplica esa precedencia y registra la decisión en `docs/DECISIONES.md`.
> **Este archivo no contiene código completo de la app:** define contratos, estructura y criterios. Escribe tú el código.

---

## 0. Protocolo obligatorio: trabajar sobre el proyecto existente

El entorno local **ya está configurado y funcionando**. **Prohibido** crear un proyecto desde cero, regenerar el scaffold (`create-vite`, `create-react-app`, etc.), cambiar de bundler o mover el proyecto a otra tecnología.

**Antes de definir o tocar cualquier arquitectura, ejecuta y documenta en `docs/INSPECCION.md`:**

1. **Estructura:** lista de carpetas y archivos de `src/`, `public/` y raíz (configuración, `vercel.json` si existe, `.env*`).
2. **`package.json`:** scripts (`dev`, `build`, `preview`/`start`, `test`, `lint`), dependencias y devDependencias, `"type"`, `engines`.
3. **Bundler:** ¿Vite o Create React App (u otro)? Esto define: prefijo de variables de entorno (`VITE_` o `REACT_APP_`), carpeta de salida (`dist` o `build`) y acceso a variables (`import.meta.env` o `process.env`).
4. **Inventario funcional:** componentes, páginas, rutas, estilos y funcionalidades ya implementadas; si ya usa router, estado global, gráficas, QR o servicios de datos.
5. **Decisión por elemento:** tabla **Reutilizar / Modificar / Ampliar / Dejar intacto** con justificación.
6. **Línea base:** ejecuta `npm install` (si hace falta), `npm run dev` y `npm run build` y anota resultados (¿compila?, ¿advertencias?).
7. **Convenciones existentes:** idioma de nombres de archivo/componentes, estilo de importación, formato (indentación, comillas). **Sigue las convenciones existentes** salvo que choquen con este plan; si el proyecto ya tiene carpetas equivalentes (p. ej. `components/`), úsalas en lugar de crear duplicadas y adapta los nombres de §4.

**Reglas de trabajo:**
- Mantener la configuración local actual (puerto, scripts, variables ya definidas).
- No eliminar funcionalidades existentes sin justificación en `docs/DECISIONES.md`. Si hay pantallas previas que no encajan, conservarlas montadas en una ruta propia (p. ej. `/legado/...`) o dejarlas intactas.
- Cambios **incrementales**: tras cada tarea, `npm run dev` y `npm run build` deben seguir funcionando.
- Un commit por tarea/fase con mensaje claro (convención: `fase-N: descripción`). Rama sugerida: `feature/qr-inversores`.

**Tecnologías permitidas:** React + JavaScript + CSS convencional.
**Prohibidas:** TypeScript, Next.js, Angular, Vue, Tailwind, Bootstrap, otros frameworks de estilos y cualquier migración tecnológica.

---

## 1. Principios de arquitectura

1. **Simple y mantenible antes que sofisticado.** Sin librerías de estado externas (usa Context + `useReducer`), sin framework de UI, sin librería de gráficas por defecto.
2. **El modelo matemático es un módulo puro** (JavaScript sin React, sin DOM) que se puede ejecutar con Node. **Ningún componente calcula interés.**
3. **El cliente es dueño de la experiencia del estudiante.** Toda la lógica del juego corre en el navegador del estudiante y se guarda localmente. Solo se sincroniza con la sala un **resumen y eventos** para que el docente los vea.
4. **Sincronización detrás de una interfaz** (`sesionService`) con dos adaptadores intercambiables: producción (Firebase) y local (demo/pruebas).
5. **Datos pedagógicos como datos:** etapas, pistas, panel, insignias y textos viven en `datos/` (no incrustados en componentes).
6. **Una sola fuente para el desbloqueo y avance de etapas** (`datos/etapas.js` + `estado/progreso.js`).
7. **CSS convencional modular**, con variables (tokens) y prefijo de clases `qri-` para no chocar con estilos existentes.

---

## 2. Stack tecnológico

### 2.1 Base (ya existe; no cambiar)
React, JavaScript, CSS y el bundler actual del proyecto.

### 2.2 Dependencias nuevas: solo si no existen ya, con justificación

| Necesidad | Decisión | Justificación | Alternativa más simple |
|---|---|---|---|
| **Rutas** (`/docente`, `/unirse/:codigo`, `/estudiante/:codigo`) | Si el proyecto ya usa un router, **reutilizarlo**. Si no, añadir `react-router-dom` (v6). | El flujo QR requiere URLs profundas y compartibles. | Enrutador mínimo propio con `window.history` y un componente `Ruta` (~50 líneas); solo si el agente prefiere cero dependencias. |
| **Generar QR** | `qrcode.react` (componente SVG pequeño). | Generar QR a mano es inviable y propenso a errores. | Paquete `qrcode` generando `dataURL` en un `<img>`. |
| **Sincronización entre celulares y docente** | **Firebase Realtime Database + Authentication anónima** (paquete `firebase`, importando solo `firebase/app`, `firebase/auth`, `firebase/database`, con carga diferida). | **Indispensable funcionalmente:** sin un canal compartido, el docente no puede ver a los estudiantes ni controlar la sala, y Vercel (estático) no guarda estado entre dispositivos. Firebase tiene capa gratuita, tiempo real, sin servidor propio, y la autenticación anónima da una identidad por dispositivo **sin registro**. | (a) Supabase Realtime (requiere tablas y políticas RLS); (b) Funciones serverless de Vercel + almacenamiento externo con *polling* (más código de backend); (c) WebRTC/PeerJS (frágil y sin persistencia). **Rechazadas** por mayor complejidad. |
| **Gráficas** | **Ninguna librería**: componentes SVG propios en React (§13). | Solo se requieren líneas y barras; evita dependencia pesada. | Si el proyecto **ya** incluye una librería de gráficas, usarla en lugar de crear SVG propio. |
| **Pruebas** | Si ya existe Vitest/Jest, usarlo. Si no, un **script Node sin dependencias** (`node:assert`). | El modelo es JavaScript puro. | — |

**Regla:** toda dependencia nueva se anota en `docs/DECISIONES.md` con versión, tamaño aproximado y motivo. No agregar nada más.

### 2.3 Variables de entorno
Centralizar su lectura en **un solo archivo** (`src/utilidades/entorno.js`) que respeta el bundler detectado (prefijo `VITE_` o `REACT_APP_`):

| Variable (nombre lógico) | Uso |
|---|---|
| `URL_PUBLICA` | Base del QR. Si no existe, usa `window.location.origin`. Útil para probar en celular con la IP de la red local. |
| `MODO_SYNC` | `firebase` o `local`. Por defecto `firebase` si hay configuración completa; si no, `local`. |
| `FB_API_KEY`, `FB_AUTH_DOMAIN`, `FB_DATABASE_URL`, `FB_PROJECT_ID`, `FB_APP_ID` | Configuración de Firebase (pública por diseño; la seguridad está en las reglas, §15). |

Entregar `.env.example` con los nombres (sin valores reales) y confirmar que `.env.local` está en `.gitignore`.

---

## 3. Arquitectura general

```
┌──────────────────────── Navegador del DOCENTE (TV/computador) ───────────────────────┐
│ Páginas: /docente , /docente/:codigo                                               │
│ Componentes: QR, Participantes, Controles, Resultados, Mesa de discusión          │
│ Lee: participantes (tiempo real)  | Escribe: meta (estado, etapaMaxima, pregunta)  │
└──────────────────────────────▲───────────────────────────────────────────┬─────────┘
                               │                       sesionService (interfaz)
                     Firebase RTDB (producción)  /  Adaptador local (demo-pruebas)
                               │                                           │
┌──────────────────────────────┴───────────── Navegador del ESTUDIANTE (celular) ─────┐
│ Páginas: /unirse/:codigo , /estudiante/:codigo                                      │
│ Estado local (Context+Reducer) ← modelo/ (funciones puras) ← datos/ (etapas, guías) │
│ Persistencia: localStorage (con try/catch) | Sincroniza: resumen + eventos          │
│ Lee: meta (estado, etapaMaxima, época, pregunta, proyección)                       │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

Flujo de capas dentro del cliente: **UI (componentes) → estado (reducer/selectores) → modelo (funciones puras) y datos (JS estático)**. El servicio de sesión solo es llamado desde hooks (`useSesion`, `useSincronizacion`), nunca desde componentes presentacionales.

---

## 4. Estructura de carpetas propuesta

Adaptar a las convenciones existentes (§0.7). Todo lo nuevo vive bajo `src/`:

```
src/
  main.jsx | index.js            (existente: solo añadir imports de estilos globales si hace falta)
  App.jsx                        (existente: montar el enrutador y proveedores)
  rutas/
    AppRutas.jsx                 definición de rutas y página 404
  paginas/
    Inicio.jsx                   elegir "Soy docente" / "Soy estudiante"
    docente/DocenteInicio.jsx    crear sala o retomar la última
    docente/DocentePanel.jsx     panel proyectable
    estudiante/Unirse.jsx        validar sala + alias + avatar
    estudiante/UnirseManual.jsx  ingreso por código
    estudiante/Estudiante.jsx    contenedor de la experiencia (etapas)
    NoEncontrada.jsx
  componentes/
    comunes/                     Boton, Tarjeta, Modal, Cajon, Chip, Insignia, Aviso, Cargando, BarraProgreso
    estudiante/
      BarraSaldos.jsx            Disponible/Invertido/Ganancias/Patrimonio/Periodo
      CatalogoProductos.jsx, TarjetaProducto.jsx
      FormularioInversion.jsx    producto + monto + plazo + predicción (sin mostrar M)
      MisInversiones.jsx, TarjetaInversion.jsx
      ControlTiempo.jsx          avanzar 1 periodo / hasta vencimiento
      Historial.jsx              línea de tiempo de decisiones
      Laboratorio.jsx            simulación + retos + conclusiones
      TablaSaldos.jsx            tabla periodo a periodo
      ConstructorReglas.jsx      fichas + prueba contra casos
      Comparador.jsx
      PlanEstrategia.jsx         meta, borrador, justificación
      ReflexionGuiada.jsx        ciclo de 5 pasos
      MapaModelo.jsx
      VerificacionModelo.jsx
      MapaEtapas.jsx             progreso de etapas
      Guia.jsx                   pistas graduales
      Retroalimentacion.jsx
    docente/
      QRSala.jsx, ListaParticipantes.jsx, ControlesSala.jsx,
      SelectorEtapa.jsx, TablaResultados.jsx, GraficaColectiva.jsx,
      MesaDiscusion.jsx, PreguntaDetonante.jsx
    graficas/
      GraficaLineas.jsx, GraficaBarras.jsx, Sparkline.jsx
    panelPedagogico/
      PanelPedagogico.jsx, SeccionPrincipios.jsx, MiRuta.jsx, ModalFuentes.jsx
  modelo/                        JavaScript PURO (sin React, sin DOM, ejecutable en Node)
    catalogo.js
    interes.js                   fórmulas
    tablas.js                    tablas y series
    comparacion.js               compararGemelos, primerPeriodoConDiferencia
    inversiones.js               validar, crear, avanzar, resumen de ronda
    diagnostico.js               diagnosticarPrediccion
    evaluadorExpresiones.js      analizador sin eval
    reglas.js                    definición y evaluación de R1–R5
    insignias.js                 calcularInsignias
    redondeo.js
  datos/
    etapas.js                    etapas, desbloqueos y condiciones de avance
    pistas.js                    pistas por actividad
    pedagogia.js                 contenido del panel pedagógico
    textos.js                    mensajes de interfaz y retroalimentación
    avatares.js
  estado/
    EstudianteContext.jsx, estudianteReducer.js, selectores.js, progreso.js
    SesionContext.jsx
    persistencia.js              localStorage con try/catch y versión
  servicios/
    sesionService.js             fábrica que elige el adaptador
    adaptadorFirebase.js
    adaptadorLocal.js            BroadcastChannel + localStorage
  hooks/
    useSesion.js, useSincronizacion.js, usePresencia.js, useMediaQuery.js, useTemporizador.js
  utilidades/
    entorno.js, formato.js, codigos.js, escalas.js, ids.js
  estilos/
    tokens.css, base.css, utilidades.css
    componentes/*.css            un archivo por familia de componentes
    paginas/*.css
scripts/
  verificar-modelo.mjs           pruebas matemáticas sin dependencias
docs/
  INSPECCION.md, DECISIONES.md, PRUEBAS.md, DESPLIEGUE.md
vercel.json                      (ver §17)
.env.example
```

---

## 5. Modelo de datos

### 5.1 Datos de sala (Firebase Realtime Database; en modo local, mismo formato en localStorage)

```
sesiones/{codigo}/
  meta: {
    docenteUid, estado ('esperando'|'activa'|'pausada'|'finalizada'),
    etapaMaxima (1–7), epoca (entero; +1 en cada reinicio),
    creadaEn, expiraEn (creadaEn + 24 h), version: 1,
    preguntaActiva: { id, texto, ts } | null,
    proyeccion: [uid, uid] | []          // estrategias seleccionadas para la Mesa de discusión
  }
  participantes/{uid}: {
    alias, avatar, epoca, unidoEn, conectado (bool), ultimaVez,
    etapa, etapasCompletadas: [ints],
    resumen: { periodo, disponible, invertido, ganancias, patrimonio,
               nInversiones, usoSimple, usoCompuesto, conteoPistas },
    insignias: [ids]
  }
  eventos/{uid}/{pushId}: evento   // máximo ~300 por participante (ver §6.6)
  compartidas/{uid}: { modo ('alias'|'anonimo'), alias|null, meta, plan, justificacion, resultado }
```
Los valores numéricos se guardan con precisión completa; el redondeo es solo de presentación.

### 5.2 Estado local del estudiante (Context + Reducer)

```
{
  version: 1,
  codigo, uid, epocaVista,
  perfil: { alias, avatar },
  etapaActual (0–7), etapasCompletadas: [ints],
  rondas: [ { id, tipo ('practica'|'plan'), periodoActual, capitalInicial,
              disponible, inversiones: [ { id, productoId, monto, plazo, inicio,
                                           estado ('activa'|'vencida'), prediccion|null,
                                           montoFinal|null } ],
              meta|null, justificacion|null } ],
  rondaActivaId,
  laboratorio: { ultimaSimulacion|null, experimentos: [...], conclusiones: {...} },
  reglas: { R1..R5: { fichas: [...], aprobada: bool, intentos, pistasUsadas } },
  reflexiones: [ ... ],
  insignias: [ids],
  eventos: [ { id, ts, etapa, ronda, tipo, datos } ],   // catálogo en Skill 2 §12.2
  pistas: { contexto: nivelMaximoUsado }
}
```
**No almacenar valores derivados** (patrimonio, ganancias, devengado): se calculan con `selectores.js` y las funciones del modelo.

### 5.3 Identificadores
- `codigo`: 5 caracteres de `ABCDEFGHJKMNPQRSTUVWXYZ23456789` (31 símbolos ≈ 28 millones de combinaciones), generado con `crypto.getRandomValues` y verificando que no exista.
- `uid`: el de la autenticación anónima de Firebase (en modo local, un id aleatorio guardado en `localStorage`).
- `id` de inversión/evento: id corto aleatorio generado en cliente.

---

## 6. Manejo de sesiones y sincronización

### 6.1 Interfaz del servicio (`sesionService`)
Contrato (todas las funciones asíncronas devuelven promesas; las `observar*` devuelven la función para cancelar la suscripción):

| Función | Quién la usa | Qué hace |
|---|---|---|
| `iniciar()` | ambos | Autenticación anónima y conexión. Devuelve `uid`. |
| `crearSala()` | docente | Genera código único, crea `meta` y devuelve `{codigo}`. |
| `observarMeta(codigo, cb)` | ambos | Escucha cambios de `meta`. |
| `actualizarMeta(codigo, parcial)` | docente | Cambia estado, etapaMaxima, preguntaActiva, proyeccion; `reiniciar` incrementa `epoca`. |
| `unirse(codigo, perfil)` | estudiante | Crea/actualiza `participantes/{uid}`; resuelve alias duplicados. |
| `guardarProgreso(codigo, uid, parcial)` | estudiante | Actualiza etapa, resumen, insignias (agrupado y con *debounce* ~600 ms). |
| `registrarEvento(codigo, uid, evento)` | estudiante | Agrega a `eventos/{uid}`. |
| `compartirEstrategia(codigo, uid, datos)` | estudiante | Escribe `compartidas/{uid}`. |
| `observarParticipantes(codigo, cb)` | docente | Escucha `participantes`. |
| `observarEventos(codigo, cb)` | docente | Escucha eventos (opcional, para evidencias y diagnósticos agregados). |
| `observarCompartidas(codigo, cb)` | docente | Escucha estrategias compartidas. |
| `marcarPresencia(codigo, uid)` | estudiante | `conectado = true` y `onDisconnect → false`; actualiza `ultimaVez` cada 20 s. |

### 6.2 Adaptadores
- **`adaptadorFirebase`**: Realtime Database + autenticación anónima. Importación diferida (`import()`), de modo que la pantalla de inicio no cargue el SDK.
- **`adaptadorLocal`**: `localStorage` + `BroadcastChannel` (con *fallback* al evento `storage`). Permite probar el flujo completo con varias pestañas del **mismo navegador** sin red. Muestra un aviso visible "Modo demostración local: solo funciona en este navegador".

`sesionService.js` elige el adaptador según `MODO_SYNC` (ver §2.3).

### 6.3 Ciclo de vida de la sala
1. **Docente** entra a `/docente` → `crearSala()` → guarda `{codigo}` y su `uid` en `localStorage` para poder **retomar** la sala si recarga.
2. **Docente** muestra el QR y espera participantes (estado `esperando`).
3. **Docente** pulsa **Iniciar** → `estado = 'activa'`.
4. **Pausar/Reanudar** → `estado = 'pausada'/'activa'`. Los celulares muestran un aviso y deshabilitan acciones.
5. **Reiniciar** (con confirmación) → `epoca + 1`, `estado = 'esperando'` (o conserva `activa` según elección), `etapaMaxima` se mantiene. Cada celular detecta que `epoca` cambió, limpia su estado local de esa sala conservando `alias` y `avatar`, y vuelve a E1.
6. **Finalizar** → `estado = 'finalizada'`. Los celulares muestran "Ver mi resumen" (solo lectura).
7. **Expiración**: si `ahora > expiraEn`, la sala se considera caducada (los clientes la tratan como `finalizada`); el docente, al crear una sala nueva, intenta borrar sus salas caducadas.

### 6.4 Reconexión y persistencia
- El estudiante guarda su estado en `localStorage` con clave `qri:v1:{codigo}:{uid}` (siempre con `try/catch`; si falla, la app sigue funcionando en memoria).
- Al recargar o reescanear el QR en el mismo celular: si existe estado local, se restaura; si no, se intenta reconstruir `perfil`, `etapa` y `resumen` desde `participantes/{uid}`.
- Cambios de `epoca` invalidan el estado local antiguo.

### 6.5 Estados de conexión
- `usePresencia` expone `conectado` (verde/gris). El docente considera "conectado" a quien tenga `conectado = true`.
- Si el estudiante pierde la red: sigue operando con estado local; muestra un icono discreto "sin conexión"; al volver, reenvía el resumen y eventos pendientes (cola local simple de eventos no enviados).

### 6.6 Volumen de datos
- Eventos: pequeños (≤ 500 bytes), como máximo ~300 por estudiante; el resumen se envía agrupado, no en cada clic.
- Sala objetivo: hasta 40 estudiantes. La capa gratuita de Firebase es suficiente para uso en aula; documentar límites en `docs/DESPLIEGUE.md`.

---

## 7. Rutas, páginas y vistas

| Ruta | Página | Descripción |
|---|---|---|
| `/` | `Inicio` | Dos botones grandes: "Soy docente" · "Soy estudiante" (este último lleva a `/unirse`). |
| `/docente` | `DocenteInicio` | Crear sala o retomar la última sala guardada. |
| `/docente/:codigo` | `DocentePanel` | Panel proyectable. |
| `/unirse` | `UnirseManual` | Campo "Código de sala". |
| `/unirse/:codigo` | `Unirse` | Valida sala, pide alias y avatar. **Destino del QR.** |
| `/estudiante/:codigo` | `Estudiante` | Experiencia completa. Las vistas internas (Invertir · Laboratorio · Comparar · Historial) se manejan con **estado**, no con rutas, para evitar 404 y simplificar. |
| `*` | `NoEncontrada` | Mensaje amable y botón "Ir al inicio". |

**Proyecto existente:** si ya hay rutas o páginas, se **conservan**; las nuevas se agregan sin pisar las existentes (si colisionan, mover lo previo a `/legado/...` y documentar).

---

## 8. Funcionamiento del QR

1. `QRSala.jsx` recibe `codigo` y construye la URL: `{URL_PUBLICA | window.location.origin}/unirse/{codigo}`.
2. Renderiza el QR con `qrcode.react` (SVG): nivel de corrección **M**, margen blanco (*quiet zone*) incluido, fondo blanco y módulos de color oscuro (alto contraste, **no pastel**), tamaño ≥ 280 px en TV (`clamp()` según viewport).
3. Debajo del QR: **código en texto grande** (agrupado, p. ej. `K7M2P`), URL legible y botón "Copiar enlace".
4. **Pruebas locales con celular:** `localhost` no es accesible desde otro dispositivo. Para probar en red local: ejecutar el servidor de desarrollo expuesto en la red (usando el script/flag existente del bundler, sin cambiar la configuración permanente) y definir `URL_PUBLICA` con la IP de la computadora. En producción no se define: se usa el dominio de Vercel.
5. `Unirse.jsx` lee `:codigo`, valida (`observarMeta` una vez), y según estado: `esperando`/`activa`/`pausada` → formulario; `finalizada` o inexistente → mensaje amable (Skill 1 §8).
6. Alias validado con `^[\p{L}\p{N} _-]{2,14}$` (Unicode) tras `trim`; duplicados → sufijo " 2", " 3". Aviso "Usa un apodo, no tu nombre completo".

---

## 9. Módulo de modelo y lógica de inversión

Todo en `src/modelo/` como **JavaScript puro** (ES modules, sin importar React, CSS ni APIs del navegador) para poder ejecutarlo con Node. Las firmas son un **contrato**; los casos de prueba están en Skill 2 §5.

### 9.1 Catálogo y fórmulas
| Módulo | Contrato |
|---|---|
| `catalogo.js` | Exporta `PRODUCTOS` (S1–S3, C1–C3 según Skill 2 §3.1), `CAPITAL_INICIAL = 1000`, `HORIZONTE = 12`, `PASO_MONTO = 50`, `MAX_ACTIVAS = 4`, `obtenerProducto(id)`, `obtenerGemelo(id)`. |
| `redondeo.js` | `redondear2(x)` según Skill 2 §2.5. |
| `interes.js` | `interesSimple(C, i, n)`, `montoSimple(C, i, n)`, `montoCompuesto(C, i, n)`, `interesCompuesto(C, i, n)`, `saldoSimple(C, i, k)`, `saldoCompuesto(C, i, k)`. |
| `tablas.js` | `construirTablaSimple(C, i, n)` y `construirTablaCompuesta(C, i, n)` → filas `{periodo, saldoInicial, interesPeriodo, interesAcumulado, saldoFinal}`; `construirSerie(tipo, C, i, n)` → puntos `{k, saldo}` de 0 a `n`. |
| `comparacion.js` | `compararGemelos({productoSimpleId, C, n})` → `{simple, compuesto, diferencia, ventajaPorcentual}`; `primerPeriodoConDiferencia(C, i, umbral, maxN)` → entero o `null`. |
| `inversiones.js` | `validarInversion(ronda, {productoId, monto, plazo}, contexto)` → `{ok}` o `{ok:false, codigo}` (códigos de Skill 2 §3.2); `crearInversion(ronda, datos)` → nueva ronda; `avanzarPeriodo(ronda)` → nueva ronda (devenga, vence, acredita); `avanzarHastaVencimiento(ronda)`; `calcularResumenRonda(ronda)` → `{disponible, invertido, devengado, ganancias, patrimonio}`. Funciones **inmutables** (devuelven copias). |
| `diagnostico.js` | `diagnosticarPrediccion(caso, prediccion)` → código de Skill 2 §8.2. |
| `evaluadorExpresiones.js` | `evaluarExpresion(fichas, valores)` → `{ok, valor}` o `{ok:false, error}`; analizador por **descenso recursivo** (precedencia `^` > `× ÷` > `+ −`, paréntesis); **sin `eval` ni `Function`**; controla división por cero, paréntesis desbalanceados, fichas inválidas. |
| `reglas.js` | `REGLAS` (R1–R5 con descripción, fichas disponibles y función objetivo); `evaluarRegla(reglaId, fichas, casos)` → `{aprobada, resultados:[{caso, esperado, obtenido, ok, diferencia}]}`; `generarCasosPractica(reglaId, casosPropios)` para completar hasta 3 casos. |
| `insignias.js` | `calcularInsignias(eventos)` → lista de ids (reglas de Skill 1 §11); nunca depende del saldo. |

### 9.2 Reglas de implementación
- Todas las funciones de `modelo/` son **deterministas e inmutables**.
- **Prohibido** calcular `M`, `I`, saldos o devengados fuera de `modelo/`.
- Los componentes llaman a `modelo/` a través de `selectores.js` y del reducer.
- Los valores monetarios internos no se redondean; la capa de presentación usa `formato.js` (`formatearMonedas(x)` → "1 194,05 🪙", separador de miles con espacio, coma decimal).
- `avanzarPeriodo` debe respetar los invariantes I-1, I-2, I-3 (Skill 2 §3.3).

---

## 10. Interfaz y componentes React

### 10.1 Layout del estudiante
- **Cabecera:** avatar + alias + `MapaEtapas` compacto + botón "💡".
- **`BarraSaldos`** fija arriba: 💰 Disponible · 📈 Invertido · ✨ Ganancias · 🏦 Patrimonio · ⏱ Periodo n/12.
- **Contenido principal** según etapa y vista (pestañas inferiores en móvil: Invertir · Laboratorio · Comparar · Historial).
- **Panel pedagógico:** lateral en ≥ 1024 px; cajón inferior en móvil.
- **Guía/pistas:** tarjeta contextual dentro de cada actividad (`Guia.jsx`), no modal bloqueante.

### 10.2 Principios visuales (detalle en Skill 1 §18)
Tarjetas redondeadas, íconos amigables, colores pastel, simple = azul / compuesto = verde, animaciones ligeras con `prefers-reduced-motion`. Aspecto de "trading sencillo": tarjetas de producto, barra de saldos, gráfica de líneas y lista de movimientos; **evitar** estética bancaria o técnica.

### 10.3 Comportamiento de componentes clave
- **`FormularioInversion`:** controles deslizantes y entradas con paso fijo; límites tomados del producto y del estado (disponible, horizonte restante); la **vista previa** muestra el plan y las variables etiquetadas, **no el monto final**; el botón "Invertir" llama al reducer y muestra errores amigables según el código de `validarInversion`.
- **`ControlTiempo`:** "Avanzar 1 periodo" y "Avanzar hasta el siguiente vencimiento"; deshabilitado si `estado = pausada` o si `periodoActual = 12`.
- **`Laboratorio`:** controles (producto simple/compuesto según desbloqueo, `C`, `n` 1–24), botón "Simular"; detecta **experimento controlado** comparando con la simulación anterior (exactamente una variable cambió); registra eventos.
- **`ConstructorReglas`:** fichas táctiles (tocar para agregar, botón borrar), "Probar mi regla" → `evaluarRegla`; muestra ✔/✘ por caso; al aprobar, dispara la **revelación formal** (tarjeta con `I = C·i·n` / `M = C + I` o `M = C(1+i)^n`).
- **`TablaSaldos`:** muestra filas progresivamente; en E4 pide predecir el siguiente saldo (campo numérico) antes de revelar la fila.
- **`ReflexionGuiada`:** 5 pasos (Skill 2 §6.3), reutilizable en E1 (pasos 2–4) y E6.
- **`PanelPedagogico`:** lee `datos/pedagogia.js` + estado (etapa, últimos eventos); estructura y textos en Skill 2 §11.
- **`Guia`:** pistas 1–3 (Skill 2 §7), registra `pista_usada`.
- **`MapaModelo`:** conexión por toques (seleccionar origen → destino → elegir etiqueta); validación de conexiones esenciales.

### 10.4 Componentes del docente
`QRSala`, `ListaParticipantes` (avatar, alias, punto de conexión, etapa), `ControlesSala` (Iniciar, Pausar/Reanudar, Reiniciar con confirmación, Finalizar), `SelectorEtapa`, `TablaResultados` (sin ranking ni orden por patrimonio por defecto; orden por alias o etapa), `GraficaColectiva` (barras: estudiantes por etapa; barras: uso simple vs. compuesto), `MesaDiscusion` (elige hasta 2 estrategias compartidas y las muestra en paralelo), `PreguntaDetonante` (lista por etapa + texto libre de ≤ 140 caracteres).

---

## 11. Diseño responsive y CSS

### 11.1 Organización
- `tokens.css`: variables `:root` (colores pastel y acentos de Skill 1 §18, radios, sombras, espacios, tamaños tipográficos con `clamp()`, duraciones de animación, z-index).
- `base.css`: reset ligero, tipografía, foco visible, `prefers-reduced-motion`.
- `utilidades.css`: clases pequeñas reutilizables (`.qri-pila`, `.qri-fila`, `.qri-centro`).
- `componentes/*.css` y `paginas/*.css`: un archivo por familia, con clases `qri-*` (convención tipo BEM). Cada componente importa su CSS.
- **No eliminar ni reescribir estilos existentes**; si hay conflictos, aislar con el prefijo `qri-` y un contenedor raíz `.qri-app`.
- **Fuentes:** pila del sistema (`system-ui`, `"Trebuchet MS"`, `Verdana`, `sans-serif`); si se usa una fuente web redondeada, que sea opcional y con alternativa.

### 11.2 Breakpoints (mobile-first, `min-width`)
| Rango | Diseño |
|---|---|
| Base (≥ 360 px) | Una columna, pestañas inferiores, panel en cajón. |
| ≥ 640 px | Tarjetas en rejilla de 2 columnas, formularios más amplios. |
| ≥ 1024 px | Panel pedagógico fijo a la derecha, 2 columnas de contenido. |
| ≥ 1280 px | Panel del docente en 2 columnas grandes; tipografía escalada para TV. |

### 11.3 Reglas
- Sin scroll horizontal del `body`; las tablas se desplazan dentro de su contenedor.
- Objetivos táctiles ≥ 44 px; controles con etiquetas accesibles.
- `min-height: 100dvh` y márgenes de *safe-area* en móvil.
- Contraste de texto ≥ 4.5:1 (texto oscuro `#3B3355` sobre pasteles).
- Nada depende de `:hover`.
- Panel docente: probar a **1280×720** y **1920×1080**.

---

## 12. Gestión del estado

- **Context + `useReducer`** (sin librerías externas).
  - `SesionContext`: `meta` de la sala, estado de conexión, `uid`.
  - `EstudianteContext`: estado de §5.2 y `dispatch`.
- **Acciones del reducer (mínimo):** `INICIAR_SESION_LOCAL`, `RESTAURAR`, `REINICIAR_POR_EPOCA`, `CREAR_INVERSION`, `AVANZAR_PERIODO`, `AVANZAR_HASTA_VENCIMIENTO`, `NUEVA_PRACTICA`, `INICIAR_RONDA_PLAN`, `REGISTRAR_EVENTO`, `GUARDAR_SIMULACION`, `GUARDAR_CONCLUSION`, `GUARDAR_REGLA`, `GUARDAR_REFLEXION`, `DEFINIR_META`, `GUARDAR_JUSTIFICACION`, `COMPLETAR_ETAPA`, `OTORGAR_INSIGNIA`.
- El reducer **solo** usa funciones de `modelo/` para cálculos y **registra eventos** en cada acción relevante.
- **Avance de etapa:** `datos/etapas.js` define, por etapa, sus `condiciones` (conteos y banderas sobre eventos, según Skill 1 §6 y Skill 2 §6.2); `estado/progreso.js` expone `evaluarAvance(etapa, estado)` → `{cumple, faltantes}`. La interfaz muestra el progreso, nunca decide por su cuenta.
- **Tope del docente:** `etapaMaxima` de `meta` limita `etapaActual`.
- **Persistencia:** `persistencia.js` guarda tras cambios (con *debounce*); todas las operaciones de `localStorage` en `try/catch`.
- **Sincronización:** `useSincronizacion` observa cambios del estado y envía resumen/eventos con *debounce* y cola de reintentos.

---

## 13. Gráficas (SVG propio, sin dependencias)

| Componente | Uso | Requisitos |
|---|---|---|
| `GraficaLineas` | Evolución del patrimonio; comparador simple vs. compuesto; experimentos del Laboratorio | Varias series con color y nombre; ejes con escalas "bonitas" (`escalas.js`); `viewBox` responsive; punto/tooltip activable por **toque**; marca opcional (p. ej. el punto de ventaja); animación de trazo opcional. |
| `GraficaBarras` | Ganancia por periodo (constante en simple, creciente en compuesto); colectiva del docente | Barras con valores accesibles; mismas convenciones de color. |
| `Sparkline` | Mini-evolución en tarjetas de inversión | Sin ejes. |

**Accesibilidad:** cada gráfica incluye `<title>` y `<desc>` y una **tabla alternativa** (colapsable). Los datos provienen **siempre** de `modelo/tablas.js` o `construirSerie`.

---

## 14. Validaciones

- **Lógica de negocio** (monto, plazo, fondos, horizonte, activas, bloqueo de productos, pausa): solo en `modelo/inversiones.js` (códigos en Skill 2 §3.2). La interfaz limita los controles pero **no sustituye** la validación.
- **Entradas numéricas** (predicciones, metas): aceptar coma o punto decimal, rechazar vacío/no numérico/negativo con mensaje amable; rango de meta 1 000–2 500; predicción 0–10 000.
- **Textos libres** (justificaciones, preguntas): máximo 280 caracteres (pregunta del docente: 140), recorte de espacios; mostrar siempre como **texto** (React escapa; **prohibido** `dangerouslySetInnerHTML`).
- **Alias:** regla del §8, punto 6.
- **Código de sala:** mayúsculas, solo caracteres del alfabeto permitido.
- **Estado de sala:** acciones de juego bloqueadas si `pausada`; lectura permitida.

---

## 15. Seguridad básica

- **Sin datos personales:** solo alias y avatar; aviso en la unión.
- **Identidad:** autenticación **anónima** (invisible). El docente controla su sala por su `uid` guardado en el navegador; aviso: *"Para controlar la sala usa siempre este mismo navegador."*
- **Reglas de Firebase** (boceto que el agente debe refinar y probar en la consola/emulador antes de publicar; ruta raíz cerrada, sin listado de salas):

```json
{
  "rules": {
    ".read": false,
    ".write": false,
    "sesiones": {
      "$codigo": {
        "meta": {
          ".read": "auth != null",
          ".write": "auth != null && ((!data.exists() && newData.child('docenteUid').val() === auth.uid) || data.child('docenteUid').val() === auth.uid)"
        },
        "participantes": {
          ".read": "auth != null && root.child('sesiones/'+$codigo+'/meta/docenteUid').val() === auth.uid",
          "$uid": {
            ".read": "auth != null && $uid === auth.uid",
            ".write": "auth != null && $uid === auth.uid && root.child('sesiones/'+$codigo+'/meta').exists()",
            "alias": { ".validate": "newData.isString() && newData.val().length >= 2 && newData.val().length <= 14" }
          }
        },
        "eventos": {
          ".read": "auth != null && root.child('sesiones/'+$codigo+'/meta/docenteUid').val() === auth.uid",
          "$uid": { ".write": "auth != null && $uid === auth.uid" }
        },
        "compartidas": {
          ".read": "auth != null",
          "$uid": { ".write": "auth != null && $uid === auth.uid" }
        }
      }
    }
  }
}
```
  Añadir validaciones de tipo y longitud (estado permitido, `etapaMaxima` 1–7, tamaños de texto) y probar que **un estudiante no puede escribir en `meta` ni leer a otros participantes**.
- **Caducidad:** `expiraEn` a 24 h; limpieza de salas propias caducadas.
- **Código no enumerable:** la raíz `sesiones` no es legible; solo se accede conociendo el código.
- **Secretos:** la configuración web de Firebase no es secreta (la protege las reglas); **no** subir `.env.local`; **no** incluir otras claves.
- **Contenido:** todo texto de usuario se renderiza como texto plano; sin HTML inyectado.
- **Límites:** limitar frecuencia de escritura desde el cliente (*debounce*/cola) y tamaño de eventos.

---

## 16. Pruebas

### 16.1 Pruebas matemáticas (obligatorias)
- Archivo `scripts/verificar-modelo.mjs` (o suite Vitest/Jest si ya existe). Debe importar **solo** `src/modelo/*` (por eso éste debe ser JS puro) y ejecutar **todos** los casos **M-01 a M-20** del Skill 2 §5 con `node:assert`, tolerancia `0.005` (mostrados) y `1e-6` (internos).
- Script en `package.json`: `"verificar:modelo": "node scripts/verificar-modelo.mjs"`. (Si el proyecto usa módulos CommonJS, nombrar el archivo con `.mjs` y asegurar compatibilidad.)
- Pruebas de propiedades (M-16 a M-18) con generación aleatoria **con semilla fija** (reproducible) sobre combinaciones del catálogo y secuencias de acciones.
- Salida: tabla con ✔/✘; el proceso termina con código ≠ 0 si algo falla.

### 16.2 Pruebas funcionales (manuales guiadas, registrar en `docs/PRUEBAS.md`)

| ID | Prueba | Resultado esperado |
|---|---|---|
| FT-01 | Docente crea sala; recarga la página | La sala se retoma; QR y código siguen iguales. |
| FT-02 | 5 celulares escanean el QR | Aparecen en el panel del docente en ≤ 3 s. |
| FT-03 | Alias duplicado | Se agrega " 2". |
| FT-04 | Código inválido / sala finalizada | Mensaje amable, sin errores de consola. |
| FT-05 | Estudiante cierra el navegador y vuelve | Recupera inversiones, etapa y eventos. |
| FT-06 | Docente pausa | Celulares bloquean acciones y muestran aviso en ≤ 3 s; al reanudar, vuelven a habilitarse. |
| FT-07 | Docente reinicia | Celulares vuelven a E1 conservando alias/avatar. |
| FT-08 | Tope de etapa = 3 | Un estudiante en E3 no puede pasar a E4 hasta que el docente suba el tope. |
| FT-09 | Intento de invertir en C1 en E2 | Producto bloqueado. |
| FT-10 | Cada código de error de validación | Mensaje correcto en la interfaz. |
| FT-11 | E1 completo | Predicción obligatoria; no hay monto final antes de invertir; resultado coincide con motor. |
| FT-12 | E3: regla correcta y regla incorrecta | La correcta se aprueba y revela la fórmula; la incorrecta muestra contraejemplos y no revela. |
| FT-13 | E4: R4 y R5 | La ficha `^` se habilita solo tras R4; la fórmula se revela tras R5. |
| FT-14 | E5: punto de ventaja `C=1000, i=0.02, umbral 10` | La app valida `n = 8`. |
| FT-15 | E6: plan + justificación + reflexión | Avanza a E7 sin requerir alcanzar la meta. |
| FT-16 | Panel pedagógico en cada etapa | Contenido de la etapa; microtextos por evento; chips diferenciados (EMR vs. R-E-T). |
| FT-17 | Mesa de discusión | El docente proyecta 2 estrategias; se ven tablas y justificaciones. |
| FT-18 | Insignias | Se otorgan por acciones; ninguna depende del dinero. |
| FT-19 | Pérdida de conexión en un celular | Sigue funcionando; resincroniza al volver. |
| FT-20 | Responsive | 360×640, 390×844, 768×1024, 1280×720 y 1920×1080 sin desbordes ni elementos tapados. |
| FT-21 | Accesibilidad | Navegación con teclado en el docente; foco visible; contraste; `prefers-reduced-motion`. |
| FT-22 | Funcionalidades previas | Las del proyecto original siguen funcionando. |

### 16.3 Revisión técnica
`npm run build` sin errores ni advertencias relevantes; consola del navegador sin errores en todas las rutas; `lint` (si existe) sin errores.

---

## 17. Compatibilidad con Vercel y despliegue

1. **Sistema de construcción:** conservar el actual. Verificar en `package.json`:
   - Comando de build: el script `build` existente (normalmente `npm run build`).
   - Directorio de salida: **`dist`** si es Vite, **`build`** si es Create React App. Configurarlo en Vercel (Project Settings → Build & Output) o dejar que Vercel detecte el *preset*.
   - **No** cambiar de bundler. Si es Vite, conservar su configuración y no modificar `base` (debe ser `/`).
2. **SPA y rutas internas:** crear `vercel.json` en la raíz con una reescritura de todas las rutas hacia `index.html`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
   (Si ya existe un `vercel.json`, **fusionar** sin perder configuración previa.)
3. **Rutas y recursos:** usar importaciones de assets o rutas relativas a `public/` compatibles con producción; **ninguna ruta absoluta del computador local** (p. ej. `C:\...`, `/Users/...`). Revisar `grep` de estas cadenas antes de entregar.
4. **Variables de entorno:** `.env.example` en el repositorio; los valores reales en **Vercel → Settings → Environment Variables** (Production y Preview) y en `.env.local` para desarrollo. Mantener separadas las configuraciones locales y de producción. `URL_PUBLICA` **no** se define en producción.
5. **Firebase en producción:** crear el proyecto, habilitar Realtime Database y Authentication anónima, publicar las reglas de §15 y agregar el dominio de Vercel a los dominios autorizados.
6. **Verificaciones antes de entregar** (registrar en `docs/DESPLIEGUE.md`):
   - [ ] `npm run build` local sin errores; vista previa local de la build (`npm run preview` o equivalente) funciona.
   - [ ] Funciona en `localhost` y en el dominio desplegado.
   - [ ] **Recargar** `/docente`, `/docente/XXXXX`, `/unirse/XXXXX` y `/estudiante/XXXXX` **no** devuelve 404.
   - [ ] **QR escaneado desde un celular real contra el dominio de producción** lleva a `/unirse/CÓDIGO` y permite entrar.
   - [ ] Sincronización docente ↔ estudiantes en producción con ≥ 3 dispositivos.
   - [ ] Sin errores en la consola del navegador ni en el *build log* de Vercel.
   - [ ] Variables de entorno de producción configuradas; ningún valor sensible en el repositorio.
7. **Despliegue de humo temprano:** hacer un primer despliegue al terminar la Fase 1 y otro al terminar la Fase 6, para detectar problemas pronto.

---

## 18. Plan de implementación por fases

Cada fase se integra al proyecto existente de forma incremental y deja la app ejecutable. **Plantilla de cada fase:** Objetivo · Actividades · Archivos/componentes · Dependencias · Resultado esperado · Criterios de aceptación · Pruebas.

### Fase 1 — Preparación del proyecto
- **Objetivo:** conocer el proyecto existente y dejarlo listo para el trabajo, sin romper nada.
- **Actividades:** ejecutar el protocolo de §0 (`docs/INSPECCION.md`); crear carpetas de §4 que falten; instalar solo las dependencias justificadas (router/QR/firebase, según §2.2); crear `src/utilidades/entorno.js`; crear `.env.example`; crear `vercel.json`; registrar decisiones; montar el enrutador con rutas vacías (`/`, `/docente`, `/unirse`, `*`) sin pisar las existentes; **primer despliegue de humo en Vercel**.
- **Archivos:** `docs/INSPECCION.md`, `docs/DECISIONES.md`, `vercel.json`, `.env.example`, `rutas/AppRutas.jsx`, `utilidades/entorno.js`, páginas vacías.
- **Dependencias:** ninguna.
- **Resultado:** proyecto original funcionando + estructura nueva + despliegue de humo.
- **Criterios:** `npm run dev` y `npm run build` funcionan; funcionalidades previas intactas; recargar rutas internas en Vercel sin 404.
- **Pruebas:** FT-22; recarga de `/docente` en producción; consola sin errores.

### Fase 2 — Diseño de interfaz y componentes
- **Objetivo:** sistema visual y componentes base reutilizables.
- **Actividades:** `tokens.css`, `base.css`, `utilidades.css`; componentes `comunes/` (Boton, Tarjeta, Modal, Cajon, Chip, Insignia, Aviso, Cargando, BarraProgreso); `BarraSaldos`, `TarjetaProducto`, `MapaEtapas`, layout del estudiante y del docente con **datos de ejemplo estáticos**; `GraficaLineas`/`GraficaBarras` con datos de ejemplo; revisión responsive.
- **Archivos:** `estilos/*`, `componentes/comunes/*`, `componentes/graficas/*`, plantillas de páginas.
- **Dependencias:** Fase 1.
- **Resultado:** pantallas estáticas fieles al brief visual, en celular, tablet, escritorio y TV.
- **Criterios:** sin desbordes en los 5 tamaños de FT-20; contraste y foco correctos; colores pastel y simple=azul/compuesto=verde.
- **Pruebas:** FT-20, FT-21 (parcial).

### Fase 3 — Desarrollo del modelo matemático
- **Objetivo:** módulo puro de cálculo verificado.
- **Actividades:** implementar `modelo/` (§9) completo; escribir `scripts/verificar-modelo.mjs` con M-01…M-20; implementar el evaluador de expresiones y `reglas.js`.
- **Archivos:** `modelo/*`, `scripts/verificar-modelo.mjs`, script `verificar:modelo`.
- **Dependencias:** Fase 1 (puede ir en paralelo con Fase 2).
- **Resultado:** `npm run verificar:modelo` pasa al 100 %.
- **Criterios:** todos los casos del Skill 2 §5; ninguna función usa React/DOM; sin `eval`/`Function`.
- **Pruebas:** M-01…M-20 y propiedades con semilla.

### Fase 4 — Sistema de inversión
- **Objetivo:** experiencia individual jugable de E0–E2, con estado, persistencia y motor de etapas.
- **Actividades:** `estudianteReducer`, `EstudianteContext`, `selectores`, `persistencia`; `datos/etapas.js` y `estado/progreso.js` (E0–E7 definidas, E0–E2 funcionales); `CatalogoProductos`, `FormularioInversion` (predicción obligatoria, sin mostrar M), `MisInversiones`, `ControlTiempo`, `Historial`, `Laboratorio` (experimentos controlados y conclusiones), `TablaSaldos`; gráfica de patrimonio real; registro de eventos; diagnóstico de predicciones y `Retroalimentacion`; ronda de práctica reiniciable. **Modo sin red**: usa solo el adaptador local o ninguno (la sesión se integra en la Fase 6).
- **Archivos:** `estado/*`, `datos/etapas.js`, `componentes/estudiante/*` (los listados), `paginas/estudiante/Estudiante.jsx`.
- **Dependencias:** Fases 2 y 3.
- **Resultado:** un estudiante (sin sala) puede jugar E0–E2 con resultados correctos.
- **Criterios:** invariantes I-1…I-3 en toda secuencia; catálogo compuesto bloqueado; sin monto final antes de invertir; recarga conserva estado.
- **Pruebas:** FT-05, FT-09, FT-10, FT-11, M-14, M-18; revisión manual de invariantes.

### Fase 5 — Construcción de las guías educativas
- **Objetivo:** convertir el simulador en experiencia de **construcción del modelo**.
- **Actividades:** `datos/pistas.js` y `Guia` (3 niveles); `ConstructorReglas` + revelación formal (E3, E4); tablas con predicción del siguiente saldo (E4); `Comparador` y punto de ventaja (E5); `PlanEstrategia`, `ReflexionGuiada` y justificación estructurada (E6); `VerificacionModelo` y `MapaModelo` (E7); segunda ronda de plan; `insignias.js` conectada; completar `datos/etapas.js` con condiciones de avance.
- **Archivos:** `datos/pistas.js`, `datos/textos.js`, `componentes/estudiante/*` restantes, `modelo/reglas.js` (uso), `modelo/insignias.js`.
- **Dependencias:** Fase 4.
- **Resultado:** E0–E7 completamente jugables de principio a fin.
- **Criterios:** lista anti-calculadora de Skill 2 §13 cumplida; fórmulas reveladas solo tras verificar; pistas registradas; insignias no dependen de dinero.
- **Pruebas:** FT-12 a FT-15, FT-18.

### Fase 6 — Implementación del código QR y las sesiones
- **Objetivo:** sala, QR, unión de estudiantes y sincronización.
- **Actividades:** `sesionService` + `adaptadorLocal` + `adaptadorFirebase`; `SesionContext`; `useSesion`, `useSincronizacion`, `usePresencia`; `QRSala`; `Unirse`, `UnirseManual`; reconexión; manejo de pausa, reinicio por `epoca`, finalización y caducidad; publicar reglas de Firebase (§15); **despliegue de humo y prueba real del QR**.
- **Archivos:** `servicios/*`, `hooks/*`, `estado/SesionContext.jsx`, `componentes/docente/QRSala.jsx`, `paginas/estudiante/Unirse*.jsx`, `utilidades/codigos.js`.
- **Dependencias:** Fases 1 y 4 (5 recomendable para sincronizar etapas completas).
- **Resultado:** estudiantes entran por QR y su progreso llega a la sala.
- **Criterios:** unión en ≤ 3 s; códigos válidos/ inválidos manejados; reglas de seguridad probadas (un estudiante no escribe `meta`).
- **Pruebas:** FT-01 a FT-05, FT-19; verificar QR en celular real en producción.

### Fase 7 — Desarrollo del panel del docente
- **Objetivo:** panel proyectable y de control.
- **Actividades:** `DocentePanel`; `ListaParticipantes`, `ControlesSala` (iniciar, pausar, reanudar, reiniciar con confirmación, finalizar), `SelectorEtapa`, `TablaResultados` (sin ranking), `GraficaColectiva`, `MesaDiscusion`, `PreguntaDetonante`; vistas de evidencias por estudiante (predicciones, reglas, justificaciones, conteo de pistas).
- **Archivos:** `paginas/docente/*`, `componentes/docente/*`.
- **Dependencias:** Fase 6.
- **Resultado:** el docente controla y observa toda la sala.
- **Criterios:** legible en TV (1280×720 y 1920×1080); controles con efecto verificado en celulares; ningún ranking por dinero.
- **Pruebas:** FT-02, FT-06, FT-07, FT-08, FT-17, FT-20.

### Fase 8 — Integración del panel pedagógico EMR
- **Objetivo:** panel lateral contextual con principios, representación y evidencias.
- **Actividades:** `datos/pedagogia.js` con la matriz y los textos del Skill 2 §10–§11; `PanelPedagogico`, `SeccionPrincipios`, `MiRuta`, `ModalFuentes`; microtextos por evento; chips diferenciados (niveles EMR vs. R-E-T); comportamiento (lateral/cajón, no invasivo, progresivo); registro de `panel_principio_visto`.
- **Archivos:** `datos/pedagogia.js`, `componentes/panelPedagogico/*`.
- **Dependencias:** Fases 5 (eventos y etapas) y 2 (UI).
- **Resultado:** cada etapa muestra principios, qué hace el estudiante, su representación y su modelo.
- **Criterios:** contenido distinto por etapa; fórmulas en el panel solo si ya fueron reveladas; distinción EMR vs. R-E-T visible; `ModalFuentes` con atribuciones correctas.
- **Pruebas:** FT-16, FT-21.

### Fase 9 — Pruebas funcionales y matemáticas
- **Objetivo:** verificar de extremo a extremo.
- **Actividades:** ejecutar `verificar:modelo`; ejecutar FT-01…FT-22 con ≥ 5 dispositivos reales; corregir defectos; registrar en `docs/PRUEBAS.md`; prueba de invariantes con secuencias largas.
- **Archivos:** `docs/PRUEBAS.md`, correcciones puntuales.
- **Dependencias:** Fases 1–8.
- **Resultado:** informe de pruebas sin fallos críticos.
- **Criterios:** M-01…M-20 pasan; FT-01…FT-22 pasan o tienen defecto documentado no crítico.
- **Pruebas:** las listadas.

### Fase 10 — Ajustes visuales y entrega del MVP
- **Objetivo:** pulido, despliegue final y entrega.
- **Actividades:** ajustes visuales y de animación; revisión de textos; accesibilidad; limpieza de código y de rutas absolutas; verificación completa de §17; despliegue de producción; documentación final.
- **Archivos:** estilos, `docs/DESPLIEGUE.md`, `README` actualizado (si existe, ampliar sin borrar).
- **Dependencias:** Fase 9.
- **Resultado:** MVP en Vercel, con QR probado en celular real.
- **Criterios:** lista de §17.6 completa; criterios de aceptación de Skill 1 §16 cumplidos.
- **Pruebas:** FT-20 y FT-21 finales; recorrido E0→E7 en producción.

---

## 19. Orden de desarrollo y dependencias

```
F1 ──► F2 ──┐
  └──► F3 ──┴──► F4 ──► F5 ──┬──► F8 ──┐
                 │           │         ├──► F9 ──► F10
                 └──► F6 ────┴──► F7 ──┘
```
- F2 y F3 pueden avanzar en paralelo.
- F6 puede comenzar tras F4 (la sincronización usa el estado y el resumen del estudiante), pero **la sala completa con etapas** requiere F5.
- F7 requiere F6. F8 requiere F5.
- Orden sugerido de ejecución secuencial: **F1 → F3 → F2 → F4 → F5 → F6 → F7 → F8 → F9 → F10**.
- Despliegues de humo: tras F1 y tras F6.

---

## 20. Criterios de finalización (definición de "terminado")

El trabajo está terminado cuando:
1. Se cumplen todos los criterios de aceptación de **Skill 1 §16**.
2. `npm run verificar:modelo` pasa (M-01…M-20) y FT-01…FT-22 están registradas.
3. No hay errores de consola ni de build; la app funciona en `localhost` y en Vercel.
4. El QR se probó desde un celular real contra producción y las rutas internas no dan 404 al recargar.
5. Las funcionalidades previas del proyecto siguen operativas o su retiro está justificado en `docs/DECISIONES.md`.
6. Solo se usaron React, JavaScript y CSS convencional; las dependencias nuevas están justificadas.
7. Ningún componente calcula interés fuera de `modelo/`.
8. Las fórmulas solo se revelan tras la construcción; no existe ranking por dinero.

---

## 21. Entregables del agente programador

1. Proyecto React **actualizado** (código en `src/`, `scripts/`, `vercel.json`, `.env.example`).
2. `docs/INSPECCION.md` (estado inicial y decisiones de reutilización).
3. `docs/DECISIONES.md` (dependencias añadidas y justificaciones, cambios o retiros, contradicciones resueltas).
4. `docs/PRUEBAS.md` (resultados de pruebas matemáticas y funcionales).
5. `docs/DESPLIEGUE.md` (pasos de despliegue en Vercel, variables de entorno, configuración de Firebase y reglas, verificaciones de §17).
6. URL de producción en Vercel y evidencia de la prueba del QR en un celular real.
7. Breve guía de uso para el docente (1 página: crear sala, proyectar, iniciar/pausar/reiniciar, usar la Mesa de discusión), dentro del `README` o `docs/`.

---

## 22. Lista de verificación final para el agente programador

- [ ] Inspeccioné el proyecto existente antes de decidir nada.
- [ ] No usé TypeScript, Next.js, Angular, Vue, Tailwind, Bootstrap ni cambié de bundler.
- [ ] Mantuve el funcionamiento local y la configuración previa.
- [ ] El modelo es JavaScript puro y está verificado con M-01…M-20.
- [ ] Ningún componente calcula interés por su cuenta.
- [ ] Las etapas, pistas y panel pedagógico viven en `datos/` y se alimentan de eventos reales.
- [ ] El panel distingue niveles EMR de niveles R-E-T y cita las fuentes con su alcance real.
- [ ] La sincronización pasa por `sesionService` (Firebase en producción, local para pruebas).
- [ ] `vercel.json`, build, salida y variables de entorno verificados.
- [ ] Probé QR, recarga de rutas, consola y sincronización en producción con celulares reales.
