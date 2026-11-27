---
name: gw-portal
description: Pone al día el portal con los repos de la cuenta (fichas, próximamente, muro, productos, guiones de lectura) y detecta repos nuevos. Úsala cuando la persona pida revisar o actualizar los proyectos del portal, en la tarea semanal «Proyectos semanal» (modo semanal) y tras publicar una versión de un proyecto.
---

# gw-portal

Lo que `gw-harvest` hace con las retros, esta skill lo hace con los repos: los recorre, ve qué cambió desde la última
puesta al día de cada ficha y lo lleva al portal. Es propia del portal (no del flujo: `/gw-update` no la toca).

**Los repos de los proyectos solo se leen**: nunca se escribe, se sube ni se reescribe nada en ellos (un `fetch` en un
clon propio sí). Nunca se registran como raíz de la sesión (`register_repo_root`): cargarían su `CLAUDE.md` y sus
skills en cada llamada.

## Modos

Se elige por lo que diga la persona o el prompt; sin indicación, **informe**.

- **informe**: no toca nada, **tampoco abre pedidos**; devuelve las cuatro listas del paso 5.
- **aplicar**: aplica el contenido en la rama de trabajo de la sesión, con commit y push; a `main`, solo con la
  confirmación de la persona. **Abre los pedidos** (paso 5b).
- **semanal**: el de la tarea «Proyectos semanal». Aplica, comprueba y publica en `main` sin pedir confirmación
  (autorizado solo para esa tarea; reglas en [`docs/runbooks/tarea-semanal.md`](../../../docs/runbooks/tarea-semanal.md#reglas)).
  Gasta los mínimos tokens: sin subagentes, sin capturas de la web, sin explorar código, sin preguntas: lo que pida
  una decisión se apunta y se dice en la respuesta. **No abre pedidos**: solo apunta lo que falta en «Para la próxima publicación».

## Pasos

1. **Portal en su rama.** Semanal: `git fetch origin claude/galivelop-dev-portal-1h89ci main`, `git checkout
   claude/galivelop-dev-portal-1h89ci && git pull --ff-only` y, si `origin/main` trae commits que no están en la rama,
   `git merge origin/main`. Informe y aplicar: la rama de la sesión, con `origin/main` fusionado (`AGENTS.md`).
2. **Repos de la cuenta.** Llama a `list_repos` (`limit` 200) y guarda su JSON tal cual en el scratchpad
   (`repos.json`). Entran los del `titular` de [`fuentes.json`](fuentes.json) y sus `extras`; el script ignora el resto.
3. **Recogida mecánica**, que empieza por **poner al día la rama por defecto (`main`) de cada repo conectado**: antes
   de leer nada, el script trae de `origin` su rama por defecto y sus etiquetas en cada clon (un clon de una sesión
   anterior está viejo):

   ```bash
   python3 .claude/skills/gw-portal/scripts/recoger.py --repos <scratchpad>/repos.json --clones <scratchpad>/clones
   ```

   Los clones van al scratchpad, fuera de la carpeta de la sesión: dentro, cada llamada y cada subagente cargarían
   el `CLAUDE.md`, el `AGENTS.md` y las skills de cada repo (75k de arranque por subagente, retro del 2026-11-04).

   Por cada repo con línea `falta_clon`: si es privado, `add_repo` (lectura) primero; luego la orden de clonado que
   da el script, de uno en uno, y vuelve a ejecutarlo.
   Un repo con línea `sin_traer` no se pudo poner al día: vuelve a ejecutar el script y, si sigue, ese repo no se decide
   (sus datos son viejos); se dice en el informe. Hecho cuando ningún repo con destino tiene `falta_clon` y los que
   sigan con `sin_traer` están en el informe como no decididos.

4. **Decidir, repo a repo**, con su sección de [`proyectos.md`](proyectos.md) (y las reglas comunes del final):
   - De [`proyectos.md`](proyectos.md), lee una vez las secciones comunes y, por repo, solo la suya:
     `sed -n '/^## TARKOR/,/^## /p' .claude/skills/gw-portal/proyectos.md` (el encabezado, en mayúsculas).
   - `ficha` / `proximamente`: qué novedades, fase, hitos, cifras, versión, textos, imágenes o muro cambian. Con commits
     desde N, siempre al menos una novedad (lo trabajado o probado, por encima). Y el **escaparate** de `proyectos.md`:
     la ficha entera, sus imágenes y diagramas, y cada archivo del portal que lo nombra (las dos listas del informe).
     Lee solo lo que el informe señala (un diff, una entrada del CHANGELOG, un archivo vigilado, la línea que lo nombra).
   - **Guion de lectura** de cada página que cambie (la ficha, o el inicio si cambian sus proyectos): los trozos que
     ya no sean verdad se reescriben en los tres idiomas, sus `enfoques` se revisan y su audio queda pendiente («Guiones de lectura» de [`proyectos.md`](proyectos.md)).
   - `enlace`: un repo que pasó a público sin enlace en la ficha (ADR 0003) se enlaza (`enlaces`, tipo `otro`); uno
     privado enlazado, se desenlaza. Es contenido.
   - `nuevo`: nunca se añade solo. Propón destino (ficha, próximamente o `ignorar` con motivo) con una línea de qué
     es, sacada de su README, con la lista «Lo que necesita cada destino» (abajo). Cuenta también los repos nuevos
     **privados** (`add_repo` en lectura para leerlos), los de **otra cuenta** (solo si están en `extras`) y los
     **archivados o sin actividad** (propón `ignorar`, no ficha).
   - **Faltas de lo existente**: de cada ficha y cada «próximamente», comprueba qué piezas de la lista le faltan (imagen
     de tarjeta ausente, icono propio, guion sin audio, acento sin confirmar o sin contraste, enlace al código) y
     lístalas en «Pedidos pendientes».
   - lo que pediría tocar código del portal (un campo o una sección nueva, un `.ts`, un componente): no se hace aquí.
   - Para cambiar un campo entero de una ficha (hitos, fase, cifras, novedades…), `python3
     .claude/skills/gw-portal/scripts/bloque.py <ficha> <campo> -` con el JSON nuevo por la entrada estándar: deja el
     resto del archivo igual (un volcado entero despliega listas y ensucia el diff).

   En informe y aplicar, la lectura la hace un subagente ligero por repo (`gw-orchestrate-dealer`), que devuelve sus
   propuestas con rutas; la sesión principal no lee el informe del script entero (retro del 2026-11-22: 8 lecturas,
   358k arrastrados). El resumen nombra cada repo, también los que no cambian, para que no se pierda ninguno. En
   semanal, no. Hecho cuando cada repo del informe tiene su decisión.

5. **Informe** (los tres modos lo llevan en la respuesta):
   - **Contenido**: por proyecto, qué cambia (o «sin cambios»): novedades, campos de la ficha, imágenes y diagramas,
     trozos de guion reescritos (con su «audio pendiente») y otros archivos del portal.
   - **Pide código**: qué y por qué; en aplicar y semanal se apunta en «Para la próxima publicación» de
     `docs/handoff.md`.
   - **Repos nuevos** y avisos (`perdidos`, `enlace`, `aviso`): en aplicar y semanal, también en esa sección.
   - **Pedidos pendientes**: por proyecto, las piezas que faltan (imágenes de `docs/marca.md` sin «entregado», audios,
     acentos por confirmar) y el pedido que las cubre, si existe.

   En modo informe, aquí se para.

   **5b. Pedidos** (solo aplicar, para un repo nuevo propuesto como ficha o próximamente): abre en `docs/records/` el
   pedido de imágenes (`pedido-generador-<fecha>.md`, con sus filas nuevas al final de la tabla de proyectos nuevos de
   `docs/marca.md`, sin «entregado») y, si lleva ficha, el de voz (`pedido-voces-<fecha>.md`), al estilo de los
   existentes. Cítalos en el informe y en «Para la próxima publicación». En semanal solo se apuntan allí, sin abrirlos.

6. **Aplicar** solo contenido (lo que casa con `content` de `.claude/gw.json`: los `.json` de `src/data/`, imágenes de
   `public/` y `docs/`), con las reglas de [`proyectos.md`](proyectos.md). Todo texto visible en es, gl y en.
7. **Comprobar:** `npm ci && npm run check`; si hay ficha, próximamente o ruta nuevas, también `npm run build && npm run seo`
   (skill `gw-seo`). Si falla, corrige tu cambio o deshazlo; nunca se publica algo roto.
8. **Bitácora y subida.** En `docs/handoff.md`, una línea al principio de «Hecho» (por proyecto: novedades,
   publicaciones del muro, textos e imágenes cambiadas). Commit en español; push a la rama.
   - Semanal: vacía «Para la próxima publicación» salvo lo que no se haya podido publicar; última línea del commit
     «Siguiente: próxima revisión semanal»; `git push origin claude/galivelop-dev-portal-1h89ci` y
     `git push origin HEAD:main` (nunca rebase ni force).
   - Aplicar: lo hecho va también a «Para la próxima publicación»; `main`, solo con confirmación.
9. **Responde**: en semanal, 4 líneas como máximo (qué cambió en cada proyecto, si se publicó y lo apuntado para una
   sesión); en los otros modos, las cuatro listas del paso 5.

## Lo que necesita cada destino

Para no dejar nada sin pedir (detalle de cada punto en [`proyectos.md`](proyectos.md), «Proyecto nuevo»):

- **ficha**: JSON en es/gl/en; `acento` con contraste 4,5:1; portada, `-mini`, OG e icono (filas de `docs/marca.md`);
  guion de lectura y su pedido de voz; entrada en `fuentes.json` y sección en `proyectos.md`; enlace al código si el
  repo es público; apartado en README e inicio si lo enumeran; páginas estáticas y sitemap (`npm run build`).
- **próximamente**: entrada con acento, icono propio, imagen de tarjeta (`proxima.webp`), `fases` y `siguiente`.
- **ignorar**: motivo en `fuentes.json`.

## Fuera de las fichas

El portal enseña más que las fichas; lo que sigue también se revisa (informe lo lista, aplicar lo hace si es contenido):

- **Pedidos entregados.** Una imagen o audio de un pedido de `docs/records/` que llega (o que la persona dice que llegó)
  se integra: copiar a su ruta de `public/`, anotar «entregado» con su intento (q…) en la fila de `docs/marca.md`,
  enlazarla (`imagen` en `proximamente.json`, portada de la ficha) y, si es una OG, `node tools/og/traducir.mjs`
  (`tools/og/fuentes/<slug>/og-base.png`; el `og.jpg` de la ficha, `tools/og/generar.py`). Un pedido sin entregar
  más de dos semanas se recuerda en «Pedidos pendientes».
- **Diario** (`src/data/diario/`). Cada entrada con `proyecto` se relee contra su ficha: cifras, fases, qué existe
  ya. Una versión publicada o un hito cerrado de un proyecto es motivo para **proponer** (no escribir) una entrada
  nueva. El diario es código con revisión: ni semanal ni este flujo lo editan; se apunta en «Para la próxima publicación».
- **Guiones de otras páginas** (`productos`, `equipo`, `novedades`, `proponer`, `unirse`, además del inicio y las
  fichas): si cambia lo que cuentan (un producto, un miembro, un proyecto que entra o sale), se revisan igual.
- **Productos privados, equipo y legal** se mantienen a mano: se leen para avisar de lo que ya no sea verdad, no se editan.
- **Etiquetas:** `"etiquetas": true` en `fuentes.json` para todo repo cuya ficha nombre una versión (hoy solo el
  flujo; el generador de imágenes, con la 0.6.0 publicada, también debería).
- **Máximo de novedades:** `proyectos.md` dice 8, pero las fichas tienen entre 10 y 14 y nada lo comprueba ni se
  recorta (borrar lo publicado espera a la persona): decisión pendiente, no se aplica por su cuenta.
- **Mejoras de `recoger.py`** (script con test, no regla): repos archivados o sin actividad, un `ignorar` que gana
  README o etiqueta (`galivelop-artifacts`) y etiquetas de todos los repos con ficha.
- **Tarea semanal:** su texto sigue «pendiente de pegar» (`docs/runbooks/tarea-semanal.md`); al pegarlo, que diga que
  los pedidos faltantes solo se apuntan.

## Mantener la skill

- Un proyecto nuevo: su repo en `fuentes.json` (con `destino` y `slug`), su sección en `proyectos.md` y su ficha o
  entrada en el portal; `src/data/tarea-semanal.test.ts` exige las dos primeras.
- Un repo que no va al portal: en `fuentes.json` con `"destino": "ignorar"` y su motivo, para que deje de salir como nuevo.
- Lo que el script pueda calcular (una fecha, un recuento, una ruta) va al script con su test, no a `proyectos.md`.
