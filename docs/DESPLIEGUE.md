# Despliegue y servicios

## Aplicación web

- Bundler: Vite. Comando: `npm run build`. Salida: `dist/`.
- `vercel.json` reescribe las rutas SPA a `index.html`.
- Copia `.env.example` a `.env.local` solo para desarrollo. No subas credenciales reales.
- `VITE_URL_PUBLICA` solo se usa si hace falta reemplazar el origen local. En producción el QR usa el dominio de la app.

## Firebase para sincronización entre dispositivos

El modo local es el predeterminado y sincroniza pestañas del mismo navegador con Realtime Database local (`localStorage` + `BroadcastChannel`). Para un salón con celulares distintos:

1. Crea un proyecto Firebase, activa Authentication → Anonymous y crea Realtime Database.
2. Publica `database.rules.json` como reglas de la base de datos. No uses reglas públicas de escritura.
3. Configura `VITE_MODO_SYNC=firebase` y las variables `VITE_FB_API_KEY`, `VITE_FB_AUTH_DOMAIN`, `VITE_FB_DATABASE_URL`, `VITE_FB_PROJECT_ID`, `VITE_FB_APP_ID` en `.env.local` y en Vercel.
4. Añade el dominio de producción entre los dominios autorizados de Firebase Authentication.
5. Despliega en Vercel y prueba el QR, la unión, pausa y reinicio desde dispositivos distintos.

El sitio `https://math-realistic.vercel.app/` respondió HTTP 200 al comprobarlo. No se pudo verificar una unión de estudiantes ni la sincronización con Firebase porque no hay configuración Firebase en este workspace y no se dispone de celulares para la prueba física del QR. Esos pasos siguen pendientes para aceptar el MVP de producción.
