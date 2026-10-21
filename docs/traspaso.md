# Bitácora de traspaso

Se actualiza en cada commit. Reglas en [`CLAUDE.md`](../CLAUDE.md).

## Estado actual

| | |
|---|---|
| **Actualizado** | 2026-10-21 |
| **Rama de trabajo** | `claude/galivelop-dev-portal-1h89ci` |
| **En `main`** | Todo publicado (confirmación expresa, 2026-10-13), incluida la galería única con rotación automática. https://zeldris.github.io/Portal-Galivelop/ |
| **Tests** | `npm run check`: tsc 0 errores, vitest 17/17. `npm run build` correcto |

## Para la próxima publicación

La web se publica los domingos por la noche con la tarea programada «Tarkor semanal» (ver `CLAUDE.md`).
Aquí se apunta lo que está en la rama de trabajo y aún no en `main`.

- (nada pendiente: `main` al día a 2026-10-21)

## Hecho

- ✅ Flujo de trabajo de Tarkor en el portal (2026-10-21): skills en `.claude/skills/` (selector y
  orchestrate-dealer reescritas; grilling, grill-with-docs, domain-modeling, diagnosing-bugs, codebase-design,
  improve-codebase-architecture, retro, writing-for-agents, pr, prototype, research y opt-tokens con su nota del
  portal), runbook `docs/runbooks/skills-y-modelos.md`, `REVIEW.md`, `GLOSSARY.md`, ganchos (`.claude/settings.json`:
  sesión, compactación con `tools/qa/recuperar.py --estado` y revisión antes de un PR a `main`; `.githooks/pre-push`
  con `npm run check`) y `tools/qa/revisado.sh`. No se traen `opt-ai`, `scout-updates` ni las rondas de pruebas.
  Dos rondas de `/code-review` (14 y 15 hallazgos, arreglados): el `pre-push` comprueba el commit que se sube y, en
  una subida a `main` con código, exige la marca de revisión, que va en el repo (`docs/registros/revisado.txt`)
  para que la tarea semanal pueda publicar contenido. Retro aplicada: test de los ganchos en `npm run check`
  (`tools/qa/tests/test-ganchos.sh`), regla «Ganchos y scripts» en `REVIEW.md` y fila «Traer algo de otro repo» en el
  `selector`. `/opt-tokens`: la sesión iba a ~681k de contexto por llamada; `/clear` tras subir a `main`. Publicado en `main`.
- ✅ Captura de la gestión del reino (2026-10-19) en «Capturas», tras las habilidades de reino.

- ✅ Novedades de Tarkor al día (2026-10-18): 4 nuevas del 15 al 18 de octubre (arte, testigos y montura, edificios y mapa, ronda de pruebas). Publicado en `main`.

- ✅ Arte de Tarkor (2026-10-18): 151 imágenes del banco de World-Maker-Fantasy en
  `public/proyectos/tarkor/arte/` (WebP 1600/720; mapas 1200/480). Carrusel con 24 seleccionadas;
  tarjetas con imagen (campo `imagen` en los elementos de los apartados) en Mundo, Lugares,
  Razas, Facciones, Personajes, Bestiario (33 especies), Flora y El reino; apartado «Arte del mundo»
  con galería por pestañas (campo `grupos`, sin rotación). Descartados: versiones «verano»
  (idénticas), quio y recursos sueltos. Borradas las imágenes antiguas sin uso. Pies de foto de «Arte del mundo» traducidos.
  Publicado en `main` (confirmación del usuario).
- ✅ Revisión semanal (2026-10-18): `tarkor-contenido-web.md` sin cambios desde la ficha rehecha hoy; Tarkor sin tocar, rama publicada en `main`.
- ✅ Tarea «Tarkor semanal» con instrucciones nuevas (2026-10-18): sincroniza todas las secciones de la
  ficha con `tarkor-contenido-web.md` (y añade elementos nuevos), sin nombrar juegos de referencia.
- ✅ Ficha de Tarkor rehecha (2026-10-18) desde `World-Maker-Fantasy/docs/producto/tarkor-contenido-web.md`:
  8 pilares con cifras, turno, apartados Mundo, Razas, Facciones, Clases, Bestiario, Flora y oficios y
  Preguntas frecuentes; cifras corregidas (9 clases · 31 especializaciones, +4.200 tests). Sin nombrar
  juegos de referencia (decisión del usuario). Verificación de Google movida a `public/`. Publicado en `main`.
- ✅ SEO extra (2026-10-14): cada página estática lleva su texto en HTML (lo leen buscadores e IA
  sin JavaScript; React lo sustituye al cargar), datos estructurados schema.org (Organization,
  WebSite, VideoGame para Tarkor, WebApplication para toVeriAI) y `llms.txt`. Publicado en `main`.
- ✅ Direcciones por idioma (2026-10-14): castellano sin prefijo, gallego en `/gl/…` e inglés en
  `/en/…` (`src/main.tsx` + `src/i18n/Idioma.tsx`); el selector cambia la dirección y la página.
  18 páginas estáticas con `hreflang` y `x-default`; sitemap con las 18. Publicado en `main`.
- ✅ SEO (2026-10-14): `scripts/paginas-estaticas.mjs` (tras el build) crea una página HTML real por
  ruta (sin el 404 de Pages) con título, descripción, canónica y vista previa propias, más
  `sitemap.xml` y `robots.txt`. Publicado en `main` (confirmación del usuario). Pendiente: «About» del
  repo (descripción, web y topics) lo pone el usuario (el proxy no deja cambiar ajustes del repo).
- ✅ Tarea programada «Tarkor semanal» (2026-10-13; `trig_012hEySn87yUmW8zcoeSvzYm`, domingos 22:46
  Europe/Madrid, en la sesión dedicada «Tarkor semanal (portal)», `session_0153sKUm2ZLwd6cFbMATVqfa`,
  con los dos repos): cada domingo revisa Tarkor, actualiza la ficha
  y publica en `main` (consentimiento del usuario). Descartado el flujo de GitHub Actions equivalente.
- ✅ Vista ampliada a pantalla completa (2026-10-13): la imagen ocupa toda la pantalla con el pie
  encima; usa la pantalla completa del navegador (oculta su barra en el móvil) y en táctiles gira
  a horizontal las imágenes apaisadas (Android; en iPhone basta con girar el móvil). Salir de la
  pantalla completa cierra la vista ampliada. Publicado en `main`.
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
