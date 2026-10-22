# Bitácora de traspaso

Se actualiza en cada commit. Reglas en [`CLAUDE.md`](../CLAUDE.md).

## Estado actual

| | |
|---|---|
| **Actualizado** | 2026-10-22 |
| **Rama de trabajo** | `claude/galivelop-dev-portal-1h89ci` (la que publica la tarea semanal) |
| **Tarea en curso** | Ninguna |
| **Siguiente paso** | Esperar el aviso del usuario: cuando el repo de Galivelop-workflow acabe de actualizarse, actualizar otra vez la ficha de Galivelop-workflow (`CLAUDE_CODE_AUTO_COMPACT_WINDOW=200000` ya está en el entorno, comprobado el 2026-10-22) |
| **En `main`** | Todo publicado (confirmación expresa, 2026-10-22), incluida la ficha de Galivelop-workflow. https://zeldris.github.io/Portal-Galivelop/ |
| **Tests** | `npm run check`: tsc 0 errores, vitest 23/23 y `tools/qa/tests/test-ganchos.sh` (ganchos y scripts del flujo, `.claude/gw.json` y 11 casos de la regla de `main`, 3 de ellos de la tarea semanal, más la clasificación código/contenido, el `pre-commit`, `content` fijado y nada del flujo en el `.gitignore`; pide bash, git y python3). `npm run build` correcto |

### Para la próxima publicación

La web se publica los domingos por la noche con la tarea programada «Tarkor semanal» (ver `CLAUDE.md`).
Aquí se apunta lo que está en la rama de trabajo y aún no en `main`.

- (nada pendiente: `main` al día a 2026-10-22)

## Hecho

Las 10 últimas; al añadir una, se borra la más antigua (lo anterior está en `git log -- docs/traspaso.md`;
opt-tokens, 2026-10-22).

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
- ✅ Tarea «Tarkor semanal» con instrucciones nuevas (2026-10-18): sincroniza todas las secciones de la
  ficha con `tarkor-contenido-web.md` (y añade elementos nuevos), sin nombrar juegos de referencia.
- ✅ Ficha de Tarkor rehecha (2026-10-18) desde `World-Maker-Fantasy/docs/producto/tarkor-contenido-web.md`:
  8 pilares con cifras, turno, apartados Mundo, Razas, Facciones, Clases, Bestiario, Flora y oficios y
  Preguntas frecuentes; cifras corregidas (9 clases · 31 especializaciones, +4.200 tests). Sin nombrar
  juegos de referencia (decisión del usuario). Verificación de Google movida a `public/`. Publicado en `main`.

Datos fijos que salían en entradas antiguas:

- Tarea «Tarkor semanal»: `trig_012hEySn87yUmW8zcoeSvzYm`, domingos 22:46 Europe/Madrid, en la sesión «Tarkor semanal
  (portal)» (`session_0153sKUm2ZLwd6cFbMATVqfa`).
- Contacto: alvarogarciagrana@gmail.com (marca y gestión) y web.admin.toveriai@gmail.com (toVeriAI). Equipo: Tarkor,
  solo Álvaro; toVeriAI, Raquel C. (fundadora) y Álvaro. Discord: https://discord.gg/8vyjW3VrN.

## Pendiente

- «About» del repo en GitHub (descripción, web y topics): lo pone el usuario (el proxy no deja cambiar ajustes del
  repo; pendiente desde el SEO del 2026-10-14).
1. Equipo: redes sociales que se vayan pasando (en `src/data/equipo.json`).
2. Cuando el instalador de Tarkor sea público: añadirlo en `enlaces` de `tarkor.json` y pasar
   el estado si procede.

## Comprobar el estado

```bash
npm ci && npm run check && npm run build
```
