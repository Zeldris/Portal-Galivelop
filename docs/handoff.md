# Bitácora de traspaso

Se actualiza en cada commit. Reglas en [`CLAUDE.md`](../CLAUDE.md).

## Estado actual

| | |
|---|---|
| **Actualizado** | 2026-11-16 (`/gw-update` a Galivelop-workflow 0.7.0 en `ccr-8e0862c2-niq1xt`) |
| **Rama de trabajo** | `claude/galivelop-dev-portal-1h89ci` (la que publica la tarea semanal); esta sesión, `ccr-8e0862c2-niq1xt` (al día con `main`, c926bcc, 2026-11-15) |
| **Tarea en curso** | `/gw-update` 0.6.0 → 0.7.0 en `ccr-8e0862c2-niq1xt`: aplicado y subido; falta la fase 1 (revisión de lo fusionado a mano: `AGENTS.md`, `.claude/gw.json`, `.claude/gw/gw-update.md`) y la fase 3 antes de `main`, con confirmación de la persona |
| **Siguiente paso** | Publicaciones en X: **P7 lista para publicar** en `docs/media/2026-11-15/01-fichas-al-dia/` (la persona la publica y apunta el enlace en `## Published` de su `sheet.md`); **P1, P3, P5 y P6 guardadas** en `docs/media/proposals/2026-11-14.md` hasta que la persona las pida (texto en castellano ≤280 y 4 imágenes 1200×675). Reddit del 2026-11-14 publicado; `check.py` no admite guiones en `r/u_…` (a reportar a Galivelop-workflow). En cola en el generador: portada 31 de workflow (31d q974, sin aprobar) |
| **En `main`** | **Ficha de Galivelop-workflow contrastada con su repo** (b17058f, 2026-11-15, la persona: «Llévalo a main cuando el CI esté en verde»; CI en verde en 82104ca; solo contenido). Antes, **Galivelop-workflow 0.7.0 en su ficha** (2026-11-15). Lo anterior, en «Hecho» y en `git log origin/main`. https://zeldris.github.io/Portal-Galivelop/ |
| **Tests** | `npm run check`: tsc 0 errores, `prettier --check` de `src/`, vitest 216/216 y `tools/qa/tests/test-ganchos.sh`. `npm run build` correcto (42 páginas estáticas, sitemap, robots y llms) |

### Para la próxima publicación

La web se publica los domingos a las 20:45 (hora de Madrid) con la tarea programada «Proyectos semanal» (ver `AGENTS.md`).
Aquí se apunta lo que está en la rama de trabajo y aún no en `main`.

- 2026-11-16 · **Flujo Galivelop-workflow 0.7.0** (`ccr-8e0862c2-niq1xt`, código del flujo, no de la web): `apply.py --update` (scripts, skills, `.githooks/`, agente `gw-reviewer`), `AGENTS.md` con los cambios de la plantilla, «Pendiente» en `docs/records/pending.md` y `ci-local.py --validate` en el check. Pide fase 1 y 3 antes de `main`.

- 2026-11-15 · **(en `main`, b17058f) Ficha de Galivelop-workflow contrastada con su repo (v0.7.0)** (`ccr-8e0862c2-niq1xt`, solo contenido; la persona: «Arregla todo lo que esté mal»): hitos 0.7 y 0.8 con todo lo que pasa a la 0.8 (ficha de tarea, idiomas configurables), hitos de los parches 0.6.1 y 0.6.2, `harvest.py` y `--search` en vez de los nombres viejos, seis skills de Matt Pocock con nota final (no tres) y «sin cambios en lo que hacen», `logRows` (una fila por rama con tope), dos fallos «se avisa a la persona», requisitos con Python 3.8+ y Windows, cifra de pruebas «+2.700» (el repo no da una exacta), «prantillas» en gallego y producto sin «todos los proyectos».


## Hecho

- 2026-11-15 · **`/gw-portal` (aplicar): Galivelop-workflow 0.7.0** (`ccr-8e0862c2-niq1xt`): ficha con fase, enlace a la versión, descripción, hitos (0.7 hecha; las preguntas pasan a la 0.8), novedad del 2026-11-15, cifra de pruebas 2767, «Versiones publicadas» (Autores y subagentes), garantías y piezas (autores no permitidos, aviso de copia generada); producto a 0.7.0; diagramas de portada y arquitectura a v0.7.0. Sin cambios: Tarkor (auditorías y versiones del instalador son internas), toVeriAI, generador de imágenes, World-Maker-Fantasy, voz y developer. Sin repos nuevos.
- 2026-11-14 · **Pieza de Reddit** `docs/media/2026-11-14/04-novedades-reddit/` publicada en el perfil u/Alvaro-Garcia-Grana (la persona: «siempre en el mío»; sin enlace apuntado), en inglés, con una imagen oscura de todos los proyectos (`media/1-changelog.webp`).
- 2026-11-15 · **Pieza de X «Fichas al día»** (P7 de `docs/media/proposals/2026-11-14.md`, `ccr-8e0862c2-niq1xt`; la persona: «Actualizar y producir»): `docs/media/2026-11-15/01-fichas-al-dia/`, un post en castellano con enlace a /novedades y 4 tarjetas 1200×675 (resumen con workflow 0.6.2, 2671 pruebas e IG 0.5.0; workflow 0.6.2; Galivelop IG; Tarkor); `check.py` en OK. Sin publicar.
- 2026-11-15 · **Revisión semanal** (tarea «Proyectos semanal», publicada en `main`): Galivelop-workflow, versión 0.6.2 (2671 tests), las 0.6.2 y 0.6.1 en versiones publicadas, dos novedades, y los diagramas (`galivelop-workflow.svg`, `gw-arquitectura.svg`) y sus imágenes, puestos al día; toVeriAI, una novedad (cambiar rápido de entrada ya no mezcla datos); Galivelop IG, una novedad (herramientas de marca más fiables y el taller de logos con peso de fuente y .ttc); Tarkor, una novedad (arreglos de la ronda de pruebas); el muro y próximamente, sin cambios; ningún hito retirado.
- 2026-11-14 · **Tarjeta de Álvaro en el equipo de cada ficha** (`ccr-5c066d81-ndsd13`; a `main` con el visto bueno de la persona: «Perfecto, vamos a main»): línea nueva `perfil.titular` «Arquitecto de software y sistemas de IA locales; full stack desde 2017» (solo en la tarjeta; el `resumen` de su página y su descripción no cambia, para no repetir el rol), cinco destacadas para arquitecto de IA (Claude Code, Ollama, Python, Java, Docker) y redes en iconos repartidos a lo ancho bajo la tarjeta, fuera de su enlace (`ListaRedes`, compartida con Equipo y Miembro; 44 px de toque). `/code-review` del 2026-11-14: 6 arreglados; leve pendiente: el dato `titular` no tiene test propio.
- 2026-11-14 · **Arreglos de la auditoría completa** (`ccr-5c066d81-ndsd13`): (1) CSS (f134b44): foco visible en `.boton` y token `--foco`, contrastes de bordes, `.saltar` y `.sobre-marca b`, menú móvil hasta 1100 px y con scroll en poca altura, objetivos de 24 px; (2) contenido (a28a6a1): toVeriAI (~19 %, hito 1.12, novedad del 11-02, TiDB), IG 0.5.0 y 4 / 8, Workflow 0.7 próxima, Tarkor +4.200 (documentada; contarlos pide base de datos), README; (3) componentes: submenú (hover solo con ratón, Escape devuelve el foco, se cierra al salir con Tab), Escape en el menú móvil, cambio de idioma sin remontar la app, foco al contenido tras navegar, reintento del chunk, 404 anclado, aviso al fallar copiar, `document.title` en Inicio, `aria-current="location"`. «Próximamente» se queda con su avance (la persona: «Dejarlo como está»).
- 2026-11-14 · `/gw-portal` en modo aplicar (`ccr-5c066d81-ndsd13`; la persona: «Sí, Java 21; solo el enlace de la última versión publicada»). **Workflow**: 0.5.2 y 0.6.0 en hitos, fase (en marcha la 0.7 «Preguntar»), versiones publicadas, dos novedades, enlace solo a la v0.6.0, versión del producto, 2554 pruebas, doce skills propias (+ `gw-metrics`) y diagramas de portada y arquitectura regenerados. **Generador**: 0.5.0 (hito hecho, fase, enlace solo a la v0.5.0, 1587 tests) y dos novedades (0.5.0 y prompt negativo). **Tarkor**: novedades del juego (2026-11-11) y del instalador (2026-11-12). **toVeriAI**: novedad de fondo, hito 1.13 en curso, Java 21. **Voice** (próximamente): 2/8 fases, siguiente el motor real de voz. `galivelop-evaluator` pasa a `ignorar` en `fuentes.json`. Las releases v0.6.0 y v0.5.0 se dan por publicadas por la etiqueta y su `release.yml`, sin comprobarlas en GitHub (acceso denegado).
- Lo anterior (46 entradas, hasta el 2026-11-12), en [`docs/records/handoff-archive.md`](records/handoff-archive.md#2026-11-15); y en `git log origin/main`.
- 🚧 2026-11-03 · **Skill `gw-portal`** (la persona: «tiene que empezar por gw-»). `SKILL.md` con modos informe, aplicar y semanal; `fuentes.json` (repos del titular, VeriNews_AI de extra, destino ficha, próximamente o ignorar); `scripts/recoger.py` (lista de repos, clones, fechas F y N de cada ficha, commits sin ruido, etiquetas, bitácoras y planes, rutas vigiladas, difusión lista, enlaces según ADR 0003, repos nuevos y perdidos) con 5 tests que corre `test-ganchos.sh` (también el «escaparate»: imágenes y diagramas del proyecto en el portal con su fecha, y los archivos públicos que lo nombran, contenido o código); `proyectos.md` con las reglas por proyecto sacadas del texto de la tarea semanal, más la regla de la persona (2026-11-03): con commits, siempre una novedad que cuente por encima lo trabajado o probado, y repaso del escaparate entero (ficha, imágenes, diagramas y páginas que lo nombran). Nada del portal se actualiza hasta la 0.5 del flujo. `docs/runbooks/tarea-semanal.md` lleva ya el texto corto (pendiente de pegar) y `src/data/tarea-semanal.test.ts` exige sección en `proyectos.md` y repo en `fuentes.json` para cada ficha y entrada de próximamente. Fila nueva en `selector.cases`.

## Pendiente

Lo pendiente está en [`docs/records/pending.md`](records/pending.md) (20 entradas); se añade y se quita allí.

## Comprobar el estado

```bash
npm ci && npm run check && npm run build
```
