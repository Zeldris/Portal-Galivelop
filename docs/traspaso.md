# Bitácora de traspaso

Se actualiza en cada commit. Reglas en [`CLAUDE.md`](../CLAUDE.md).

## Estado actual

| | |
|---|---|
| **Actualizado** | 2026-10-23 |
| **Rama de trabajo** | `claude/galivelop-dev-portal-1h89ci` (la que publica la tarea semanal) |
| **Tarea en curso** | Ninguna. Las fichas las pone al día la tarea «Proyectos semanal»; su texto nuevo (`docs/runbooks/tarea-semanal.md`) lo tiene que pegar el usuario en la conversación de la tarea |
| **Siguiente paso** | Comprobar que el usuario pegó el texto de la tarea; la próxima revisión semanal, el domingo 2026-10-25 |
| **En `main`** | Todo publicado (confirmación expresa, 2026-10-23): orden de proyectos, flujo 0.2.0 y tarea semanal para todos los proyectos. https://zeldris.github.io/Portal-Galivelop/ |
| **Tests** | `npm run check`: tsc 0 errores, vitest 23/23 y `tools/qa/tests/test-ganchos.sh` (ganchos y scripts del flujo, `.claude/gw.json` y 11 casos de la regla de `main`, 3 de ellos de la tarea semanal, más la clasificación código/contenido, el `pre-commit`, `content` fijado y nada del flujo en el `.gitignore`; pide bash, git y python3). `npm run build` correcto |

### Para la próxima publicación

La web se publica los domingos por la noche con la tarea programada «Proyectos semanal» (ver `AGENTS.md`).
Aquí se apunta lo que está en la rama de trabajo y aún no en `main`.

Nada pendiente.

## Hecho

Las 10 últimas; al añadir una, se borra la más antigua (lo anterior está en `git log -- docs/traspaso.md`;
opt-tokens, 2026-10-22).

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
- ✅ Piloto de Galivelop-workflow v0.1.0 (2026-10-22, rama `claude/piloto-galivelop-workflow`): `aplicar.py --init`
  (es; bitácora `docs/traspaso.md`; `npm ci`; `npm run check`; `main` directo; marca en `docs/registros/revisado.txt`;
  `content` acotado en la fase 1: `^docs/`, `^src/data/`, imágenes de `^public/`, los cinco `.md` de la raíz y los
  `.md` de las skills), más `visibleLanguages` es/gl/en,
  filas del portal en `selector.cases`, `designReferences` y `requireRetro: false` (regla del portal: retro solo en
  cambios grandes). Sustituidos por los del flujo: las 14 skills (las notas «En este repositorio» pasan a `AGENTS.md`),
  `.githooks/pre-push` (+ `pre-commit` nuevo), los ganchos de `.claude/settings.json` (`.claude/hooks/` borrado) y
  `tools/qa/{es-codigo.sh,revisado.sh,recuperar.py}` (ahora en `.claude/gw/scripts/`); `opt-tokens/proyecto.md` →
  `.claude/gw/opt-tokens.md`. `CLAUDE.md` = `@AGENTS.md` + lo de Claude; las reglas del portal, en «Reglas del
  proyecto» de `AGENTS.md`. `comprobar.yml` del flujo + Node y build. `.gitignore` deja versionar `.claude/gw*` y
  quita `__pycache__` del repo. `test-ganchos.sh` reescrito para el gancho del flujo. Paso 6: `git push --dry-run origin HEAD:main`
  con un commit de código de prueba, rechazado por el `pre-push`; commit quitado sin subir. El usuario aprobó (2026-10-22) la fusión de
  `CLAUDE.md`, la de `comprobar.yml` y `requireRetro: false`. Tres fases hechas (dos `/code-review`, 10 y 11 hallazgos arreglados; `/opt-tokens` y `/retro` aplicados), marca `1a284bd` y
  publicado en `main` con la rama de trabajo al día (confirmación del usuario).
- ✅ Créditos a Matt Pocock (2026-10-21, petición del usuario): mención al final de cada una de sus 11 skills,
  apartado «Agradecimiento» en `.claude/skills/README.md` (hemos aprendido esta forma de trabajar gracias a su
  trabajo) y nota en el runbook. Cambia `.claude/`, así que lleva `/code-review` y marca de revisado.
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

Datos fijos que salían en entradas antiguas:

- Tarea «Proyectos semanal» (antes «Tarkor semanal»; texto en `docs/runbooks/tarea-semanal.md`): `trig_012hEySn87yUmW8zcoeSvzYm`, domingos 22:46 Europe/Madrid, en la sesión «Tarkor semanal
  (portal)» (`session_0153sKUm2ZLwd6cFbMATVqfa`).

## Pendiente

- Propuesta para el flujo (próxima recogida): `aplicar.py --update` sustituyó `comprobar.yml` como «copia anterior»
  y se llevó el build y Node 22 del portal sin avisar; se repusieron a mano. Un sitio en el CI para los pasos propios
  del proyecto evitaría perderlos en cada actualización.
- Propuesta para el flujo, hallazgos de la revisión del 2026-10-23 en sus scripts (aquí no se editan):
  `pre-push` y `revision-antes-de-main.sh` leen la política de la punta de `main` y, si esa config está rota, ni el
  arreglo puede subir; los dos dejan pasar sin comprobar la marca si no pueden traer la punta remota (deberían fallar
  cerrados); los cambios del `pre-push` 0.2.0 no traen caso en el test del proyecto; `recuperar.py` solo espera 1 s
  la entrada del gancho y puede tomar el transcript de otra sesión.
- «About» del repo en GitHub (descripción, web y topics): lo pone el usuario (el proxy no deja cambiar ajustes del
  repo; pendiente desde el SEO del 2026-10-14).
1. Equipo: redes sociales que se vayan pasando (en `src/data/equipo.json`).
2. Cuando el instalador de Tarkor sea público: añadirlo en `enlaces` de `tarkor.json` y pasar
   el estado si procede.

## Comprobar el estado

```bash
npm ci && npm run check && npm run build
```
