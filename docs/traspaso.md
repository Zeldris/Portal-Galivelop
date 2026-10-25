# Bitácora de traspaso

Se actualiza en cada commit. Reglas en [`CLAUDE.md`](../CLAUDE.md).

## Estado actual

| | |
|---|---|
| **Actualizado** | 2026-10-25 |
| **Rama de trabajo** | `claude/galivelop-dev-portal-1h89ci` (la que publica la tarea semanal); esta sesión, `ccr-47f8fddd-o5ek6p` |
| **Tarea en curso** | «Próximamente» en el inicio (rama `ccr-47f8fddd-o5ek6p`): fila atenuada, sin enlace, con Galivelop Image Generator (2 de 6 fases), Voice Generator (1 de 8) y Developer (1 de 6); datos en `src/data/proximamente.json`. Hecho, comprobado y con su `/code-review` (10 hallazgos: 6 arreglados, 2 leves en «Pendiente», 2 se quedan así por decisión: sin HTML estático ni `llms.txt` y la etiqueta en cada tarjeta); falta la fase 2 |
| **Siguiente paso** | «Próximamente»: fase 2 (opt-tokens y retro, por llevar componente y estilos) presentada a la persona, `revisado.sh` y confirmación de la persona para subir a `main`. Pendiente de la persona: pegar de nuevo el bloque ```text de `docs/runbooks/tarea-semanal.md` en la conversación de «Proyectos semanal» (ahora lleva el paso 2b y el bloque PRÓXIMAMENTE; desde otra sesión no se puede); la primera publicación del muro llega cuando un proyecto marque una pieza de `docs/difusion` como `"estado": "listo"`, el flujo cree `web.md` y la tarea lleve el paso 2b (ver «Pendiente») |
| **En `main`** | Todo publicado: muro (`/muro`, oculto hasta la primera publicación) (2026-10-25, confirmación de la persona); rediseño de la ficha («De un vistazo», barra de grupos, apartados en hoja) y del inicio, `npm run medir`, `leerAncla()` y plurales en plantilla (2026-10-25, confirmación de la persona). https://zeldris.github.io/Portal-Galivelop/ |
| **Tests** | `npm run check`: tsc 0 errores, vitest 47/47 y `tools/qa/tests/test-ganchos.sh` (ganchos y scripts del flujo, `.claude/gw.json` y 11 casos de la regla de `main`, 3 de ellos de la tarea semanal, más la clasificación código/contenido, el `pre-commit`, `content` fijado y nada del flujo en el `.gitignore`; pide bash, git y python3). `npm run build` correcto |

### Para la próxima publicación

La web se publica los domingos a las 20:45 (hora de Madrid) con la tarea programada «Proyectos semanal» (ver `AGENTS.md`).
Aquí se apunta lo que está en la rama de trabajo y aún no en `main`.

- «Próximamente» en el inicio (código: componente `TarjetaProxima`, sección en `Inicio.tsx`, estilos, iconos `audio` y `code`, 4 textos por idioma, su test y `textosIncompletos` compartido en `src/data/textosIncompletos.ts`; la tarea semanal pone al día sus fases con el bloque PRÓXIMAMENTE). Revisado con `/code-review`, falta la fase 2 y la marca: no entra en `main` sin `/code-review`, marca y confirmación de la persona. Está solo en `ccr-47f8fddd-o5ek6p`, no en la rama de la tarea semanal.

## Hecho

- ✅ 2026-10-25 · Muro: página `/muro` con filtro por proyecto y ancla por publicación, las 3 últimas en cada ficha, página estática y `llms.txt`; se oculta sin publicaciones. Contrato de `docs/difusion/**/web.md` (`estado: "listo"`, bloque `muro`) en «El muro» de `docs/desarrollo.md` y paso 2b de la tarea semanal. Probado con piezas de ejemplo (escritorio y móvil, menú sin desbordes de 320 a 1400 px) que luego se quitaron. Revisado (fase 1, 9 arreglos); retro `docs/registros/retro-2026-10-25-muro.md` aplicada entera (`npm run medir` arranca su servidor, reglas del muro probadas con ejemplo); fase 3 con 4 arreglos en `medir` y en las reglas, 2 leves en «Pendiente». Publicado en `main` con confirmación de la persona; la rama de la tarea, igualada con `main`. El prompt de «Proyectos semanal» solo se cambia desde su propia conversación: falta que la persona pegue allí el bloque de `docs/runbooks/tarea-semanal.md`.
- ✅ 2026-10-25 · Tarea «Proyectos semanal» movida de las 22:46 a las 20:45 de los domingos (Europe/Madrid), a petición de la persona.
- ✅ 2026-10-25 · Rediseño de experiencia de usuario: ficha con «De un vistazo», barra fija de grupos y apartados en hoja; inicio en 3 columnas y más corto (móvil de 11,4 a 8,6 pantallas). Revisado (fase 1, 8 arreglos; fase 3, 7), retro aplicada y publicado en `main` con confirmación de la persona.
- ✅ Ficha de Galivelop-workflow: la cabecera ya no enmarca el primer diagrama (modo `cabecera: "color"`, nuevo) y los 7 diagramas van en la galería de debajo, como Tarkor.
- ✅ 2026-10-23 · Ficha ampliada de Álvaro en `/equipo` (trayectoria, formación, tecnologías, idiomas, fortalezas y foto) y versión breve en las tarjetas de equipo de cada proyecto; revisada (`/code-review`, arreglos en `d00b261`) y publicada en `main` con confirmación de la persona.

Las 10 últimas; al añadir una, se borra la más antigua (lo anterior está en `git log -- docs/traspaso.md`;
opt-tokens, 2026-10-22).

- ✅ Ficha de Galivelop-workflow más técnica (2026-10-23): seis diagramas y cuatro apartados nuevos. Publicado en `main` (confirmación del usuario).
- ✅ Revisión semanal (2026-10-23): Tarkor, 4 novedades (Casa de obras y Almacén, vasallaje con cuota y asaltos, reparar edificios y caza, ronda de pruebas), textos e imágenes sin cambios (lo del 18 ya estaba); toVeriAI, 2 novedades (racha más visible, volver a la página al iniciar sesión), fase e hitos sin cambios; Galivelop-workflow sin cambios (v0.3.0 ya en la ficha). Publicado en `main`.
- ✅ Flujo Galivelop-workflow 0.3.0 (2026-10-23, confirmación del usuario), publicado en `main` con su revisión y marca:
  `aplicar.py --update` (14 scripts, esquema, 19 skills, `test_medir.py` nuevo, `pre-commit`, `pre-push` y
  `comprobar.yml`); `AGENTS.md` y `CLAUDE.md` fusionados a mano («la persona», `.claude/gw/scripts/`), la regla de
  carpetas en `/tmp` por usuario en `REVIEW.md`, marcas a 0.3.0 en `GLOSSARY.md` y `.claude/gw/opt-tokens.md` y
  `version` 0.3.0. En `comprobar.yml` se repusieron Node 22 con caché de npm y el build del portal (los volvió a
  quitar el `--update`); por eso `aplicar.py --check` sigue avisando de ese archivo. `doctor.py` sin FAIL.
  Después, la ficha de Galivelop-workflow a la 0.3.0 (fase 7, hitos y novedad en los tres idiomas; la última que
  ponen al día las sesiones) y en `AGENTS.md` la regla de la tarea semanal dice que manda desde esa ficha.
- ✅ Orden, flujo 0.2.0 y tarea semanal (2026-10-23): publicado en `main` (confirmación expresa) el orden de proyectos (el último añadido, el primero, también
  en páginas estáticas), el flujo Galivelop-workflow 0.2.0 y la tarea «Proyectos semanal» para todas las fichas;
  `content` ya no cubre los `.ts` de `src/data/`.

- ✅ Vista previa en redes (2026-10-22): `og:image`, `twitter:image` y el JSON-LD llevan `?v=<hash de la imagen>`
  en todas las páginas y el 404 (Discord se quedaba con el diagrama antiguo de Galivelop-workflow); `og:image:alt` y
  `twitter:image:alt` de cada ficha, con el `alt` de su portada. Dos `/code-review` y marca. Publicado en `main`
  (confirmación del usuario). **Pendiente de comprobar a mano (usuario, Discord):** un mensaje nuevo con el enlace
  muestra el diagrama nuevo; el mensaje ya enviado no se actualiza.
- ✅ Ficha de **Galivelop-workflow** a la v0.2.0 (2026-10-22, petición del usuario: destacar lo propio y dar su
  sitio a lo de Matt Pocock), en `ccr-47f8fddd-o5ek6p`: apartados «Skills propias» (las 9, con sus scripts),
  «Ganchos y scripts propios» (8 piezas) y «Skills de Matt Pocock» (las 12, MIT; `pr` con el crédito a Dex Horthy);
  «Cómo funciona» pasa a ser el flujo de una tarea en 8 pasos; 6 características, cifras 9/12, decisión «Lo
  comprobable, con scripts», novedad de la 0.2.0 y párrafo de lo propio frente a lo reutilizado. Diagrama nuevo
  con fuente en `docs/diagramas/galivelop-workflow.svg` (exportado con Chromium a `portada.webp` 1600x1000 y
  `portada-mini.webp` 720x450): las dos filas de la tarea con las tres fases, el bucle `gw-harvest → vX.Y.Z →
  gw-update` y una leyenda por origen (galivelop / mattpocock/skills / Claude Code). Capturas es/gl en móvil y
  escritorio sin desbordes. Textos sacados del repo del flujo en la v0.2.0 (`01d1a75`), solo leído. Traída a la rama de trabajo y
  publicada en `main` con confirmación expresa del usuario (solo contenido).
- ✅ Ficha de **Galivelop-workflow** publicada (2026-10-22, petición del usuario): traída de
  `claude/ficha-galivelop-workflow`, al día con el flujo (fases 0-4 hechas, fase 5 = piloto en este portal, en curso;
  dos novedades del 2026-10-22; doce skills de Matt Pocock), línea de trabajo «Método de trabajo con IA» y fila en el
  README. Capturas en escritorio y móvil sin desborde (es y gl). `/code-review` contra `main`: 11 hallazgos
  arreglados (descripción y fase coherentes con la hoja de ruta, Álvaro en el equipo, schema.org, rejilla de líneas,
  «run-in», «adaptación» en gallego); segunda revisión: 7 más (rejilla según el número de líneas, solo Linux y macOS en
  schema.org, vista previa en redes con el proyecto, «Adapting» en inglés). La fila del README repite el resumen a mano,
  como las de los otros proyectos. Publicada en `main` con su marca.

## Pendiente

- **«Próximamente», leves de la revisión** (2026-10-25): (a) la fila se oculta con un filtro de línea activo (los filtros
  solo salen con 5 fichas o más); (b) la barra de avance está repetida en `TarjetaProyecto`, `Proyecto.tsx` y
  `TarjetaProxima`: pasarla a un componente `<Barra>`.
- **Carpeta nueva de difusión** (2026-10-25): `gw-media-content` del flujo 0.4.0 guarda las piezas en
  `docs/difusion/AAAA-MM-DD/NN-tema/` (imágenes en `medios/`) en vez de `docs/difusion/AAAA-MM-DD-tema/`. **El portal no
  necesita cambios:** el `git grep … -- 'docs/difusion/**/web.md'` del paso 2b encuentra las dos formas (probado en un
  repo de prueba); la `pieza` sale `2026-10-25-01-mapa-del-mundo`, que acepta `src/data/muro.test.ts` (ya ordena
  `NN` del mismo día); `archivo` relativo a la pieza (`medios/…`) con su `-mini` al lado, como genera `render.mjs`
  (también `<nombre>.en-mini.webp`). Las piezas planas siguen igual. Pendiente **fuera del portal**: (1) que
  Galivelop-workflow cree `web.md` con el bloque JSON (en curso; en la rama `ccr-6dfbc880-ddr41g` la plantilla aún no
  lo trae); (2) la persona pega el paso 2b de `docs/runbooks/tarea-semanal.md` en la conversación de «Proyectos
  semanal» (lo hace ella). Con el flujo cerrado, comprobar aquí que una pieza nueva llega al muro.

- **Repos nuevos como proyectos** (2026-10-25, a petición de la persona): evaluados `Zeldris/galivelop-image-generator`
  (18 commits; plan F0-F5 con D1-D27 y F0 «esqueleto» hecha: esquemas, textos es/en y tests; aún no genera imágenes;
  servicio local con stable-diffusion.cpp, Steam Deck de referencia, piloto con WMF), `Zeldris/galivelop-developer`
  y `Zeldris/galivelop-voice-generator` (solo el flujo instalado, README vacío). Recomendación dada: ficha de
  image-generator al llegar a F2 (genera de verdad) y las otras dos cuando tengan código propio. La persona avisará
  (está trabajando en ellos) y decide entonces; una ficha nueva lleva código, revisión y su bloque en
  `docs/runbooks/tarea-semanal.md`. Fuera, por decisión de la persona: `Zeldris/Zeldris` (README de perfil) y
  `raquelccarreraA/Labs-Log-Detective`.
  **Revisión de las 20:05 del 2026-10-25** (antes de la tarea semanal): image-generator con **F1 (núcleo) en `main`**:
  proyectos, pedidos, cola, entrega y CLI `python3 -m gimg`, pero solo con motor de prueba (`FakeEngine`), sin generar
  imágenes todavía (F2); developer con **F0 cerrada en `main`** (CLI `gdev` con subcomandos vacíos, esquemas, plan
  D1-D23); voice-generator con **diseño (D1-D17, F0-F7) y F0 esqueleto en `main`**. Ninguno tiene aún algo que un
  visitante pueda ver o probar, y ninguno tiene la skill de contenido para redes: **hoy no se añade ninguna ficha**. Se
  mantiene la recomendación (image-generator al cerrar F2; developer y voice-generator con su primera función real).

- Leve, de la revisión de fase 3 del muro (2026-10-25): `npm run medir` reutiliza cualquier servidor que ya responda
  en 4173 sin comprobar que sirve el `dist/` actual; parar el servidor con `process.kill(-pid)` y lanzar `npx` sin
  shell no valen en Windows (sin probar allí; lo comprobaría la persona en su equipo si lo usa).

- Leve, de la revisión del muro (2026-10-25): `scripts/paginas-estaticas.mjs` repite a mano el título y la
  entradilla del muro de `src/i18n/textos.ts` y la lectura y el orden de `src/data/muro.ts` (sin test que los ate);
  su HTML estático no enlaza la ficha ni las imágenes de cada publicación y `/muro` lleva el JSON-LD genérico del
  sitio (sin `Blog`/`ItemList` ni fechas).

- Propuesta para el flujo (próxima recogida), del muro (2026-10-25): la skill `gw-media-content` debería dejar en
  cada pieza un `web.md` con el bloque JSON de «El muro» de `docs/desarrollo.md`, **con `estado`** (hoy el de
  Tarkor no lo trae y la tarea no publicaría nada); y unificar la carpeta de las piezas (Tarkor usa
  `AAAA-MM-DD-tema/`, la skill `AAAA-MM-DD/NN-tema/`; el portal acepta las dos).

- Leve, de la revisión del rediseño (2026-10-25): abrir un apartado cambia el `#ap-…` con `replaceState`, así que el botón Atrás del móvil sale de la ficha en vez de cerrar la hoja (valorar `pushState` y cerrar con `popstate`); el límite de 160 px de la barra de grupos (`NavFicha`) está fijo y no sigue a la altura real de la cabecera y la barra.

- Leve, de la revisión de la ficha de Álvaro: `formatearMes` abrevia «septiembre» como «sep.» (la RAE da «sept.»); las dos etapas de formación de Chios salen iguales hasta saber qué ciclo es cada una (y los enlaces de GitHub y demás, cuando la persona los pase).

- Propuesta para el flujo (próxima recogida): `aplicar.py --update` sustituyó `comprobar.yml` como «copia anterior»
  y se llevó el build y Node 22 del portal sin avisar; se repusieron a mano. **Pasó otra vez en la 0.3.0**: el
  simulacro lo dio como «update» y no como «propose», aunque tenía cambios locales. Un sitio en el CI para los pasos propios
  del proyecto evitaría perderlos en cada actualización.
- Propuesta para el flujo, hallazgos de la revisión del 2026-10-23 en sus scripts (aquí no se editan):
  `pre-push` y `revision-antes-de-main.sh` leen la política de la punta de `main` y, si esa config está rota, ni el
  arreglo puede subir; los dos dejan pasar sin comprobar la marca si no pueden traer la punta remota (deberían fallar
  cerrados); los cambios del `pre-push` 0.2.0 no traen caso en el test del proyecto; `recuperar.py` solo espera 1 s
  la entrada del gancho y puede tomar el transcript de otra sesión.
- Propuesta para el flujo: en la plantilla de `CLAUDE.md` 0.3.0, «El modelo de la sesión la elige la persona»
  debería ser «lo elige».
- Revisión del flujo 0.3.0 (2026-10-23, `/code-review --max-findings all`): nada grave o medio en el portal. Leves:
  `test_medir.py` (llega con la skill `opt-tokens`) no lo corre `npm run check`; `AGENTS.md` cita `opt-ai`, opcional
  y no instalada (solo aplica con medidas de IA local). Propuestas para el flujo (código suyo, no se edita aquí):
  `bitacora.py closed` ya no cuenta `- [x] **ID**` ni viñetas simples; `pre-push` con `worktreeDir` dentro del
  repo, `checkWrapper` que limpia el entorno, entrecomillado del wrapper repetido en `pre-push`/`fusionar.sh`/`config.py`
  y worktrees huérfanos con pid reutilizado; `revision-antes-de-main.sh` sondea `gh api` en cada llamada y bloquea
  cambios de título o base en PR cerrados; `enlaces-md.py` con symlinks hacia fuera; `config.py` acepta `cwd` fuera
  del repo en `relatedTests`; `doctor.py` duplica avisos del glosario por mayúsculas y da por bueno `npm run check`
  citado en un comentario; `session-start.sh` deja vivo el watchdog del `setup`.
- «About» del repo en GitHub (descripción, web y topics): lo pone el usuario (el proxy no deja cambiar ajustes del
  repo; pendiente desde el SEO del 2026-10-14).
1. Equipo: redes sociales que se vayan pasando (en `src/data/equipo.json`).
2. Cuando el instalador de Tarkor sea público: añadirlo en `enlaces` de `tarkor.json` y pasar
   el estado si procede.

## Comprobar el estado

```bash
npm ci && npm run check && npm run build
```
