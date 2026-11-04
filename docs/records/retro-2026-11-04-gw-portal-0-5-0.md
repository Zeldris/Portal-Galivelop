# Retro 2026-11-04 · flujo 0.5.0 y `gw-portal` en modo aplicar

**Estado:** aprobada por la persona el 2026-11-04 y aplicada: P1, P2 y P4 en la skill `gw-portal`; P3 y el resto, en «For Galivelop-workflow» para `gw-harvest`. P5 no pide cambio de archivos.

Lo revisado es lo que entra en `main`: el paso del flujo de 0.4.3 a 0.5.0, el informe y la aplicación de
`gw-portal` (Tarkor, toVeriAI, Image Generator, ficha y diagramas del workflow) y los arreglos de la revisión.

## Medida (`gw-opt-tokens`, sesión entera)

- **Sesión principal:** 149 llamadas, 5 compactaciones y un contexto medio de 129k (con un suelo de 113k y un techo de 158k). La ventana de 200k sí se aplicó.
- **Subagentes:** 9, con 9,8M de entrada y un arranque medio de **75k**. Siguen cargados los repos hermanos.
- **Lo más releído:**
  - `proyectos.md`: 17 lecturas y 152k arrastrados.
  - `recoger.py`: 23 lecturas y 82k arrastrados.
  - Las dos bitácoras, la vieja y la nueva: 37 lecturas y 144k arrastrados.

## Propuestas, de más a menos peso

### P1 · Clones de `gw-portal` en el scratchpad, no en `/home/user` (proyecto; ahorro alto)

Con los repos clonados en `/home/user`, cada llamada carga el `CLAUDE.md` y el `AGENTS.md` de otros tres repos, y también tres copias más de la lista de skills. Esto ya está apuntado en «Costes conocidos» y sigue pasando.

- **Coste:** los 75k de arranque de cada subagente y unos 15k en cada llamada de la sesión.
- **Cambio:**
  - En el paso 3 de `.claude/skills/gw-portal/SKILL.md`, usar `--clones <scratchpad>/clones` en vez de `/home/user`. La skill es del portal, así que se puede editar aquí.
  - Borrar los clones que haya en `/home/user`, salvo el portal.
- **Riesgo:** cada sesión vuelve a clonar, pero `--depth 50` tarda pocos segundos. La tarea semanal ya corre en una sesión propia y no cambia nada.

### P2 · Leer solo la sección del proyecto en `proyectos.md` (proyecto; ahorro medio)

En el paso 4 de `SKILL.md`, añadir «lee solo tu sección: `sed -n '/^## TARKOR/,/^## /p' proyectos.md`, más
"Reglas para todas las fichas" una vez».

- **Coste:** 152k arrastrados.
- **Riesgo:** bajo. Las reglas comunes siguen en su sección, que se lee una vez.

### P3 · Revisar las rutas viejas tras `/gw-update` (flujo; calidad)

La 0.5.0 renombró `docs/traspaso.md` a `docs/handoff.md`, `docs/difusion` a `docs/media` y `estado: listo` a `status: ready`, pero la skill propia `gw-portal` siguió con los nombres viejos. Solo lo encontró la revisión: 3 de los 12 hallazgos.

- **Cambio:** que `apply.py --update` haga `git grep` de los nombres viejos en los archivos del proyecto que no copia el flujo y los liste.
- **Destino:** el flujo (abajo).

### P4 · Mirar el diagrama después del último cambio (proyecto; calidad)

Un subagente ensanchó un rect de `gw-sesion.svg` después del render y dejó `--estado` sin cambiar. Lo vio la sesión principal.

- **Cambio:** en la regla de diagramas de `proyectos.md`, «tras el último cambio del SVG, vuelve a renderizar y mira el -mini; la sesión principal hace `grep` de los nombres viejos en los SVG antes de subir».
- **Riesgo:** ninguno.

### P5 · Abrir la sesión desde el repo (la persona; ya conocido)

Abierta en `/home/user`, la sesión no carga `.claude/settings.json` y mezcla las skills de cinco repos. No hay cambio de archivos: es abrirla con el repo como carpeta.

## For Galivelop-workflow

- **P3:** tras migrar nombres, `apply.py --update` lista los usos viejos (`traspaso`, `difusion`, `"estado": "listo"`, `revisado`) en los archivos propios del proyecto.
- **Caché del check:** la clave de `.claude/gw/scripts/check-green.sh` no incluye los archivos que ignora git. Un cambio en un archivo ignorado que sí lee el check, como la configuración local, da un «verde» viejo. Propuesta: meter en la clave lo que declare el proyecto, o avisarlo en el mensaje.
- **`.githooks/pre-push`:** sugiere `git rebase -i` en un flujo que dice «merge, nunca rebase». Hay que proponer `git commit --amend` solo si no se ha subido, o un commit nuevo.
- **`apply.py --update`:** vuelve a quitar del CI lo que el proyecto añadió (los pasos propios del portal). Hay que respetar un bloque marcado como propio.
