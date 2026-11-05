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

No se hizo un despliegue ni una prueba de QR real desde celular: este entorno no incluye un proyecto Firebase, credenciales, dominio Vercel ni dispositivos móviles. Esos pasos siguen pendientes para aceptar el MVP de producción.
