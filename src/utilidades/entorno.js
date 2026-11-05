const env = import.meta.env
const firebase = {
  apiKey: env.VITE_FB_API_KEY,
  authDomain: env.VITE_FB_AUTH_DOMAIN,
  databaseURL: env.VITE_FB_DATABASE_URL,
  projectId: env.VITE_FB_PROJECT_ID,
  appId: env.VITE_FB_APP_ID,
}
const firebaseConfigurado = Object.values(firebase).every(Boolean)

export const entorno = {
  urlPublica: env.VITE_URL_PUBLICA || window.location.origin,
  modoSync: env.VITE_MODO_SYNC || (firebaseConfigurado ? 'firebase' : 'local'),
  firebase,
}

export const firebaseDisponible = Object.values(entorno.firebase).every(Boolean) && entorno.modoSync === 'firebase'
