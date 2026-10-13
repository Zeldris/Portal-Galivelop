# Bitácora de traspaso

Se actualiza en cada commit. Reglas en [`CLAUDE.md`](../CLAUDE.md).

## Estado actual

| | |
|---|---|
| **Actualizado** | 2026-10-13 |
| **Rama de trabajo** | `claude/galivelop-dev-portal-1h89ci` |
| **En `main`** | Todo publicado (confirmación expresa, 2026-10-13), incluida la captura del Paso de los Pilares Rotos. https://zeldris.github.io/Portal-Galivelop/ |
| **Tests** | `npm run check`: tsc 0 errores, vitest 17/17. `npm run build` correcto |

## Hecho

- ✅ Galería única (2026-10-13): capturas e ilustraciones juntas arriba, con pestañas «Capturas» e
  «Ilustraciones» que marcan el grupo actual; rotación automática cada 6 s en bucle (pasa de un
  grupo a otro), se para al usarla a mano y vuelve tras 3 min; botón de pausa con barra de
  progreso, sin rotar fuera de pantalla, con la pestaña oculta ni con «reducir movimiento».
  Quitada la sección plegable «Capturas».
- ✅ Arreglo móvil (2026-10-12): la galería de «Capturas» dentro de un plegable ensanchaba la
  columna (`.plegables` con `minmax(0, 1fr)`); la cabecera se adapta al texto agrandado del móvil
  (cortes en `em`: menú hamburguesa bajo 53,75em y solo el símbolo GV bajo 22,6em). Comprobado de
  320 a 1280 px con letra de 16, 20 y 24 px. Publicado en `main`.
- ✅ Sección «Capturas» (2026-10-12): campo `capturas` en cada proyecto, galería aparte de la de
  arte. Tarkor con 5 capturas del juego que pasó el usuario (combate, tres mapas de zona y
  habilidades de reino) en `public/proyectos/tarkor/juego-*.webp`.
- ✅ Ficha de **Tarkor** revisada a fondo (2026-10-12) con datos contrastados en World-Maker-Fantasy
  (`main`, bitácora del 2026-10-11): hito 0.3 «Reino profundo» en curso, +3.900 tests, 8 rasgos
  (mundo vivo, Libro de Sucesos, NPC que recuerdan, reino por generaciones, conflicto, rol de mesa…),
  hitos 0.1–0.3 con su estado real, novedades hasta el 2026-10-12 e instalador en pausa (falta
  empaquetar para la beta 0.8). Iconos nuevos: `book`, `swords`, `users`.
  Quitado el apartado «Juegos que nos inspiran» a petición del usuario (2026-10-12),
  y sin menciones a los juegos de referencia en ninguna parte de la ficha.
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
- ✅ Galería de Tarkor (2026-10-05): 4 razas (orcos de las Llanuras, goirntes, nabieus del Margen Silencioso, faerus), 2 NPC, 7 de fauna y 3 de flora; sin mapas de zona, Nuente ni Cruzavientos. Publicada en `main`.
- ✅ Vista previa en redes (2026-10-08): captura de la portada (`public/marca/galivelop-portal.jpg`) y etiquetas og/twitter con URL absolutas; antes X la mostraba en gris. Publicada en `main`.
- ✅ Workflows: `pages.yml` (publica al subir a `main`) y `comprobar.yml` (ramas y PR).

## Pendiente

1. Equipo: redes sociales que se vayan pasando (en `src/data/equipo.json`).
2. Cuando el instalador de Tarkor sea público: añadirlo en `enlaces` de `tarkor.json` y pasar
   el estado si procede.

## Comprobar el estado

```bash
npm ci && npm run check && npm run build
```
