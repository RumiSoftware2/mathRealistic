# Activar la sala compartida en Vercel

La app ya publicada responde en `https://math-realistic.vercel.app/`. Sin Firebase, cada celular puede abrir y hacer la actividad, pero el docente no verá sus avances. La sala entre celulares requiere una base de datos compartida.

## Configuración única de Firebase

1. En [Firebase Console](https://console.firebase.google.com/), crea un proyecto.
2. En **Authentication → Sign-in method**, habilita **Anonymous**.
3. En **Realtime Database**, crea una base de datos y copia su URL. En **Rules**, pega el contenido de `database.rules.json` y publícalo.
4. En **Project settings → General → Your apps**, registra una app web (</>) y copia sus valores de configuración: `apiKey`, `authDomain`, `databaseURL`, `projectId` y `appId`.
5. En la configuración del proyecto Vercel, abre **Settings → Environment Variables** y crea estas variables para **Production** (y Preview si se probará en preview):

   - `VITE_MODO_SYNC` = `firebase`
   - `VITE_FB_API_KEY` = `apiKey` de Firebase
   - `VITE_FB_AUTH_DOMAIN` = `authDomain`
   - `VITE_FB_DATABASE_URL` = URL completa de Realtime Database
   - `VITE_FB_PROJECT_ID` = `projectId`
   - `VITE_FB_APP_ID` = `appId`

6. En Firebase Authentication, agrega `math-realistic.vercel.app` a **Authorized domains**.
7. En Vercel, vuelve a desplegar la app para que Vite incorpore las variables `VITE_`.

Las claves de configuración de una app web Firebase son públicas por diseño; la protección de datos depende de Authentication y las reglas de Realtime Database. No pegues credenciales privadas ni contraseñas en el chat.

## Comprobación en clase

1. Abre `https://math-realistic.vercel.app/docente`, crea una sala y pulsa **Iniciar**.
2. Escanea el QR con dos celulares y elige un apodo en cada uno.
3. Confirma que ambos nombres aparezcan en el panel docente.
4. Completa una inversión en un celular; comprueba que su etapa y resumen cambien en el panel.
5. Pausa la sala. El celular debe impedir nuevas inversiones y avances; reanuda y prueba de nuevo.

El aviso **“Modo local activo”** significa que el build publicado todavía no recibió las variables Firebase o que `VITE_MODO_SYNC` está en `local`.
