# Bitácora de traspaso

Se actualiza en cada commit. Reglas en [`CLAUDE.md`](../CLAUDE.md).

## Estado actual

| | |
|---|---|
| **Actualizado** | 2026-10-04 |
| **Rama de trabajo** | `claude/galivelop-dev-portal-1h89ci` |
| **En `main`** | Portal completo, subido el 2026-10-04 con confirmación expresa. Pages con Source «GitHub Actions»: https://zeldris.github.io/Portal-Galivelop/ |
| **Tests** | `npm run check`: tsc 0 errores, vitest 14/14. `npm run build` correcto |

## Hecho

- ✅ Análisis de los repos (World-Maker-Fantasy, Instalador-WMF-Tarkor, VeriNews_AI).
- ✅ Logo GD (azul celeste y blanco), favicon, PNG 512 e imagen para redes.
- ✅ Portal en React + Vite: portada, fichas con galería y secciones plegables, tres idiomas,
  tema claro/oscuro, 404 para rutas en Pages.
- ✅ Fichas de **Tarkor** (juego + instalador como un solo proyecto; 17 imágenes: ilustraciones
  de `backend/uploads`, captura del mapa de zona y del asistente del instalador) y **toVeriAI**
  (9 capturas sacadas del frontend en local; el resultado de análisis usa datos de ejemplo).
- ✅ Revisión móvil (360, 390 y 768 px, claro/oscuro, tres idiomas): sin desbordes; menú
  desplegable bajo 760 px, cifras y tarjetas compactas, galería ampliada opaca y con deslizar.
- ✅ Equipo confirmado (Tarkor: solo Álvaro; toVeriAI: Raquel C. y Álvaro) y contacto:
  cordproinf@gmail.com (marca; sustituye al personal desde 2026-10-04) y web.admin.toveriai@gmail.com (toVeriAI).
- ✅ Nuevo mensaje de marca (2026-10-04): Galivelop como taller abierto (crear, investigar,
  innovar, aprender), «El taller», «Participa», y colaboración por proyecto (Tarkor abierto,
  toVeriAI privado). En la rama; pendiente de confirmar el paso a `main`.
- ✅ Formularios «Propón un proyecto» y «Únete al taller» (correo preparado con mailto, en
  castellano, a cordproinf@gmail.com). Correo personal retirado de la web. En la rama; pendiente
  de confirmar el paso a `main`.
- ✅ Revisión completa de contenidos (2026-10-04) con referencias de estudios y laboratorios
  independientes (Ink & Switch: líneas de investigación; Recurse Center: principios y «para quién
  es»; casos de estudio reto → enfoque → estado → aprendizajes): sección «Líneas de trabajo»
  (src/data/lineas.ts + campo `lineas`), «Cómo trabajamos» con cuatro principios, «Es para ti si…»
  y «Cómo funciona» en Participa, fichas reescritas y nueva sección «Lo que estamos aprendiendo»
  (campo `aprendizajes`). En la rama; pendiente de confirmar el paso a `main`.
- ✅ Workflows: `pages.yml` (publica al subir a `main`) y `comprobar.yml` (ramas y PR).

## Pendiente

1. Cuando el instalador de Tarkor sea público: añadirlo en `enlaces` de `tarkor.json` y pasar
   el estado si procede.
2. Capturas reales de partida de Tarkor (la interfaz del juego solo tiene la del mapa de zona).

## Comprobar el estado

```bash
npm ci && npm run check && npm run build
```
