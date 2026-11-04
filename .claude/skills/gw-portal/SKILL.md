---
name: gw-portal
description: Pone al día el portal con los repos de la cuenta (fichas, próximamente, muro, productos) y detecta repos nuevos. Úsala cuando la persona pida revisar o actualizar los proyectos del portal, en la tarea semanal «Proyectos semanal» (modo semanal) y tras publicar una versión de un proyecto.
---

# gw-portal

Lo que `gw-harvest` hace con las retros, esta skill lo hace con los repos: los recorre, ve qué cambió desde la última
puesta al día de cada ficha y lo lleva al portal. Es propia del portal (no del flujo: `/gw-update` no la toca).

**Los repos de los proyectos solo se leen**: nunca se escribe, se sube ni se reescribe nada en ellos (un `fetch` en un
clon propio sí). Nunca se registran como raíz de la sesión (`register_repo_root`): cargarían su `CLAUDE.md` y sus
skills en cada llamada.

## Modos

Se elige por lo que diga la persona o el prompt; sin indicación, **informe**.

- **informe**: no toca nada; devuelve las tres listas del paso 5.
- **aplicar**: aplica el contenido en la rama de trabajo de la sesión, con commit y push; a `main`, solo con la
  confirmación de la persona.
- **semanal**: el de la tarea «Proyectos semanal». Aplica, comprueba y publica en `main` sin pedir confirmación
  (autorizado solo para esa tarea; reglas en [`docs/runbooks/tarea-semanal.md`](../../../docs/runbooks/tarea-semanal.md#reglas)).
  Gasta los mínimos tokens: sin subagentes, sin capturas de la web, sin explorar código, sin preguntas: lo que pida
  una decisión se apunta y se dice en la respuesta.

## Pasos

1. **Portal en su rama.** Semanal: `git fetch origin claude/galivelop-dev-portal-1h89ci main`, `git checkout
   claude/galivelop-dev-portal-1h89ci && git pull --ff-only` y, si `origin/main` trae commits que no están en la rama,
   `git merge origin/main`. Informe y aplicar: la rama de la sesión, con `origin/main` fusionado (`AGENTS.md`).
2. **Repos de la cuenta.** Llama a `list_repos` (`limit` 200) y guarda su JSON tal cual en el scratchpad
   (`repos.json`). Entran los del `titular` de [`fuentes.json`](fuentes.json) y sus `extras`; el script ignora el resto.
3. **Recogida mecánica:**

   ```bash
   python3 .claude/skills/gw-portal/scripts/recoger.py --repos <scratchpad>/repos.json --clones /home/user
   ```

   Por cada repo con línea `falta_clon`: si es privado, `add_repo` (lectura) primero; luego la orden de clonado que
   da el script, de uno en uno, y vuelve a ejecutarlo. Hecho cuando ningún repo con destino tiene `falta_clon`.
4. **Decidir, repo a repo**, con su sección de [`proyectos.md`](proyectos.md) (y las reglas comunes del final):
   - `ficha` / `proximamente`: qué novedades, fase, hitos, cifras, versión, textos, imágenes o muro cambian. Con commits
     desde N, siempre al menos una novedad (lo trabajado o probado, por encima). Y el **escaparate** de `proyectos.md`:
     la ficha entera, sus imágenes y diagramas, y cada archivo del portal que lo nombra (las dos listas del informe).
     Lee solo lo que el informe señala (un diff, una entrada del CHANGELOG, un archivo vigilado, la línea que lo nombra).
   - `enlace`: un repo que pasó a público sin enlace en la ficha (ADR 0003) se enlaza (`enlaces`, tipo `otro`); uno
     privado enlazado, se desenlaza. Es contenido.
   - `nuevo`: nunca se añade solo. Propón destino (ficha, próximamente o `ignorar` con motivo) con una línea de qué
     es, sacada de su README.
   - lo que pediría tocar código del portal (un campo o una sección nueva, un `.ts`, un componente): no se hace aquí.

   En informe y aplicar puedes repartir la lectura con un subagente ligero por repo (`gw-orchestrate-dealer`), que
   devuelve sus propuestas con rutas; en semanal, no. Hecho cuando cada repo del informe tiene su decisión.
5. **Informe** (los tres modos lo llevan en la respuesta):
   - **Contenido**: por proyecto, qué cambia (o «sin cambios»): novedades, campos de la ficha, imágenes y diagramas, y
     otros archivos del portal.
   - **Pide código**: qué y por qué; en aplicar y semanal se apunta en «Para la próxima publicación» de
     `docs/handoff.md`.
   - **Repos nuevos** y avisos (`perdidos`, `enlace`, `aviso`): en aplicar y semanal, también en esa sección.

   En modo informe, aquí se para.
6. **Aplicar** solo contenido (lo que casa con `content` de `.claude/gw.json`: los `.json` de `src/data/`, imágenes de
   `public/` y `docs/`), con las reglas de [`proyectos.md`](proyectos.md). Todo texto visible en es, gl y en.
7. **Comprobar:** `npm ci && npm run check`. Si falla, corrige tu cambio o deshazlo; nunca se publica algo roto.
8. **Bitácora y subida.** En `docs/handoff.md`, una línea al principio de «Hecho» (por proyecto: novedades,
   publicaciones del muro, textos e imágenes cambiadas). Commit en español; push a la rama.
   - Semanal: vacía «Para la próxima publicación» salvo lo que no se haya podido publicar; última línea del commit
     «Siguiente: próxima revisión semanal»; `git push origin claude/galivelop-dev-portal-1h89ci` y
     `git push origin HEAD:main` (nunca rebase ni force).
   - Aplicar: lo hecho va también a «Para la próxima publicación»; `main`, solo con confirmación.
9. **Responde**: en semanal, 4 líneas como máximo (qué cambió en cada proyecto, si se publicó y lo apuntado para una
   sesión); en los otros modos, las tres listas del paso 5.

## Mantener la skill

- Un proyecto nuevo: su repo en `fuentes.json` (con `destino` y `slug`), su sección en `proyectos.md` y su ficha o
  entrada en el portal; `src/data/tarea-semanal.test.ts` exige las dos primeras.
- Un repo que no va al portal: en `fuentes.json` con `"destino": "ignorar"` y su motivo, para que deje de salir como nuevo.
- Lo que el script pueda calcular (una fecha, un recuento, una ruta) va al script con su test, no a `proyectos.md`.
