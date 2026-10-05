# Bitácora de traspaso

Se actualiza en cada commit. Reglas en [`CLAUDE.md`](../CLAUDE.md).

## Estado actual

| | |
|---|---|
| **Actualizado** | 2026-10-04 |
| **Rama de trabajo** | `claude/galivelop-dev-portal-1h89ci` |
| **En `main`** | Todo publicado (confirmación expresa, 2026-10-04), incluidas las fichas ampliadas y el submenú «Proyectos». https://zeldris.github.io/Portal-Galivelop/ |
| **Tests** | `npm run check`: tsc 0 errores, vitest 17/17. `npm run build` correcto |

## Hecho

- ✅ Análisis de los repos (World-Maker-Fantasy, Instalador-WMF-Tarkor, VeriNews_AI).
- ✅ Logo GV (antes GD; azul celeste y blanco), favicon, PNG 512 e imagen para redes.
- ✅ Portal en React + Vite: portada, fichas con galería y secciones plegables, tres idiomas,
  tema claro/oscuro, 404 para rutas en Pages.
- ✅ Fichas de **Tarkor** (juego + instalador como un solo proyecto; 17 imágenes: ilustraciones
  de `backend/uploads`, captura del mapa de zona y del asistente del instalador) y **toVeriAI**
  (9 capturas sacadas del frontend en local; el resultado de análisis usa datos de ejemplo).
- ✅ Revisión móvil (360, 390 y 768 px, claro/oscuro, tres idiomas): sin desbordes; menú
  desplegable bajo 760 px, cifras y tarjetas compactas, galería ampliada opaca y con deslizar.
- ✅ Equipo confirmado (Tarkor: solo Álvaro; toVeriAI: Raquel C. y Álvaro) y contacto:
  alvarogarciagrana@gmail.com (marca; vuelve a ser el correo de gestión desde 2026-10-05) y web.admin.toveriai@gmail.com (toVeriAI).
- ✅ Nuevo mensaje de marca (2026-10-04): Galivelop como taller abierto (crear, investigar,
  innovar, aprender), «El taller», «Participa», y colaboración por proyecto (Tarkor abierto,
  toVeriAI privado).
- ✅ Formularios «Propón un proyecto» y «Únete al taller» (correo preparado con mailto, en
  castellano, a alvarogarciagrana@gmail.com). El correo de gestión vuelve a ser alvarogarciagrana@gmail.com (2026-10-05).
- ✅ Revisión completa de contenidos (2026-10-04) con referencias de estudios y laboratorios
  independientes (Ink & Switch: líneas de investigación; Recurse Center: principios y «para quién
  es»; casos de estudio reto → enfoque → estado → aprendizajes): sección «Líneas de trabajo»
  (src/data/lineas.ts + campo `lineas`), «Cómo trabajamos» con cuatro principios, «Es para ti si…»
  y «Cómo funciona» en Participa, fichas reescritas y nueva sección «Lo que estamos aprendiendo»
  (campo `aprendizajes`).
- ✅ Discord de la comunidad (https://discord.gg/8vyjW3VrN) en Participa y en el pie (src/data/marca.ts).
- ✅ toVeriAI tratado como producto de Raquel (fundadora y creadora): sin menciones a su origen académico (2026-10-04).
- ✅ Página Equipo (`/equipo`, datos en `src/data/equipo.json`) con Álvaro y Raquel y sus LinkedIn.
- ✅ Fichas ampliadas tras releer los repos: «Cómo funciona» (`pasos`), apartados propios (`apartados`: mundo de Helek Sirik en Tarkor, dimensiones del IMI con sus pesos en toVeriAI), características y cifras más precisas, índice «En esta página» y submenú «Proyectos» en la cabecera.
- ✅ README convertido en presentación pública de Galivelop; la guía técnica pasa a `docs/desarrollo.md` (2026-10-04), publicado en `main`.
- ✅ Galería de Tarkor rehecha solo con zona, NPC, fauna y flora (16 imágenes; 2026-10-05), publicada en `main`.
- ✅ Workflows: `pages.yml` (publica al subir a `main`) y `comprobar.yml` (ramas y PR).

## Pendiente

1. Equipo: redes sociales que se vayan pasando (en `src/data/equipo.json`).
2. Cuando el instalador de Tarkor sea público: añadirlo en `enlaces` de `tarkor.json` y pasar
   el estado si procede.
3. Si se quieren capturas de la interfaz de Tarkor, irían aparte de la galería (que es solo arte del mundo).

## Comprobar el estado

```bash
npm ci && npm run check && npm run build
```
