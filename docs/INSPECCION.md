# Inspección inicial

Fecha: 2026-11-05. Proyecto existente inspeccionado antes de modificarlo.

## Estructura

- Raíz: `package.json`, `package-lock.json`, `vite.config.js`, `eslint.config.js`, `index.html`, `README.md`, `.gitignore`.
- `src/`: `App.jsx`, `App.css`, `index.css`, `main.jsx`, `assets/{hero.png,react.svg,vite.svg}`.
- `public/`: `favicon.svg`, `icons.svg`.
- No había `.env*`, `vercel.json`, rutas, servicios ni documentación `docs/`.

## Configuración

- Bundler: Vite 8.3.6; React 19.3.1; JavaScript con módulos ES (`type: module`).
- Scripts: `dev: vite`, `build: vite build`, `preview: vite preview`, `lint: eslint .`; no existe script de pruebas.
- Dependencias: `react`, `react-dom`. Desarrollo: Vite, plugin React, ESLint y plugins oficiales.
- `engines`: no definido. Salida Vite: `dist`; variables: prefijo `VITE_`, acceso vía `import.meta.env`.
- `.gitignore` ya ignora `*.local`, incluidos `.env.local`.

## Inventario funcional previo

La app era la pantalla de muestra de Vite: contador, logos y enlaces; sin router, servicios, persistencia, gráficas o lógica pedagógica. `main.jsx` monta `App`; `App.css` e `index.css` definen los estilos globales. No había funcionalidades propias de QR Inversores que conservar.

| Elemento | Decisión | Justificación |
|---|---|---|
| Vite, React, `main.jsx`, `index.html` | Reutilizar | Base configurada y funcional. |
| `App.jsx`, `App.css`, `index.css` | Modificar | Reemplazar la pantalla de muestra por la aplicación y su estilo. |
| Assets de la plantilla | Dejar intactos | No interfieren; mantener los archivos existentes. |
| Carpetas de modelo, datos, estado, páginas, servicios, componentes y docs | Ampliar | Crear estructura incremental conforme a la guía. |
| React Router/Firebase/QR | Posponer decisión | No estaban instalados; decidir al implementar sesiones y generación QR, documentando límites de conectividad/configuración. |

## Línea base

- `npm run build`: aprobado, Vite compiló 20 módulos; salida `dist/`.
- `npm run dev -- --host 127.0.0.1`: aprobado, servidor listo en `http://127.0.0.1:5173/`.
- `npm install`: no necesario; `node_modules` ya estaba presente.
- Git inicial: rama `main`, sincronizada con `origin/main`; `GUIA/` ya estaba sin seguimiento y no fue creada por esta implementación.

## Convenciones

JSX y JavaScript moderno, componentes React, imports ES, indentación de dos espacios, comillas simples y sin punto y coma. La interfaz especificada usa español. Se preserva la configuración de Vite y se crean módulos JavaScript puros para el modelo.

## Alcance de verificación

La compilación de referencia y el servidor de desarrollo quedaron funcionando. El acceso real a celulares, Firebase y Vercel requiere credenciales, despliegue y dispositivos externos; dichos resultados solo se pueden registrar cuando estén disponibles.
