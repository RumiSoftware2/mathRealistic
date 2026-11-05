# QR Inversores

Experiencia educativa con dinero ficticio para explorar y construir las reglas del interés simple y compuesto. Hecha con el Vite + React existentes, JavaScript y CSS convencional.

## Desarrollo

```sh
npm install
npm run dev
```

Validación del modelo y compilación:

```sh
npm run verificar:modelo
npm run lint
npm run build
```

## Guía rápida para docentes

1. Abre `/docente` y pulsa **Crear sala**. Aparecen el código y un QR para proyectar.
2. Comparte la dirección de la sala o pide al grupo escanear el QR. Cada estudiante elige un apodo y avatar.
3. Pulsa **Iniciar**. Puedes pausar, reanudar, cambiar la etapa máxima y reiniciar la sala; los estudiantes conservan su apodo y avatar al reiniciar.
4. Usa la pregunta detonante para conversar sobre lo que el grupo observa. No se clasifica al grupo por sus monedas.

Por defecto la aplicación usa el **modo demostración local**. Los estudiantes pueden hacer la actividad en el teléfono, pero sus avances no llegan al docente hasta configurar Firebase. Sigue [docs/ACTIVAR_CELULARES.md](docs/ACTIVAR_CELULARES.md) para habilitar la sala compartida en Vercel.

Consulta [docs/INSPECCION.md](docs/INSPECCION.md), [docs/DECISIONES.md](docs/DECISIONES.md) y [docs/PRUEBAS.md](docs/PRUEBAS.md) para el estado de implementación.
