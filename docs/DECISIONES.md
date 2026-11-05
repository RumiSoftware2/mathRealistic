# Decisiones de implementación

## 2026-11-05 — Preparación

- Se conserva Vite + React + JavaScript y su configuración; no se migra el scaffold.
- Se reemplaza la pantalla demostrativa de Vite porque no tenía funcionalidad de producto que preservar. Los assets originales quedan intactos.
- El proyecto no trae router, QR ni sincronización. Se implementa navegación SPA mínima con History API; se añadieron `qrcode.react` 4.2.0 (QR SVG accesible) y `firebase` 13.2.0 (Realtime Database + autenticación anónima, carga dinámica del SDK). npm reportó ocho avisos de vulnerabilidad en el árbol instalado.
- `*.local` ya está excluido por Git; `.env.example` solo contendrá nombres de variables, nunca secretos.
- El servidor Firebase y la publicación en Vercel necesitan recursos externos no presentes en el entorno local. El modo de demostración local debe seguir permitiendo la experiencia en el mismo navegador.
- La sincronización local usa `localStorage`, `BroadcastChannel` y el evento `storage`. Firebase se selecciona solo si la configuración completa está presente y `VITE_MODO_SYNC=firebase`.
- Las etapas, tablas y pistas se guardan en JavaScript estático; el estado individual se persiste en el navegador.

## Precedencia

El Skill de modelo matemático y didáctico prevalece para fórmulas, valores y secuencia; el Skill de producto para comportamiento y alcance; el Skill de arquitectura para decisiones técnicas. La matemática se concentra en `src/modelo/` y ninguna vista calcula intereses por su cuenta.
