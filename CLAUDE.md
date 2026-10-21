# Instrucciones para Claude en este repositorio

Portal público de la marca **Galivelop** (Galicia + Develop), publicado en GitHub Pages. Cómo
funciona, cómo añadir un proyecto y cómo se publica: [`docs/desarrollo.md`](docs/desarrollo.md).

## Al empezar cualquier sesión

1. Lee [`docs/traspaso.md`](docs/traspaso.md): estado, pendientes y siguiente paso.
2. `git fetch` de la rama de trabajo y comprueba que el último commit coincide con la bitácora.
3. `npm ci && npm run check` en verde antes de tocar nada.
4. Trae `main` a la rama (`git fetch origin main` y, si trae commits, `git merge origin/main`, nunca rebase): la
   tarea semanal y el usuario también suben a `main`.
5. Aplica el `selector` (qué skill y qué modelo pide la tarea) y sigue el flujo de
   [`docs/runbooks/skills-y-modelos.md`](docs/runbooks/skills-y-modelos.md): diseño, fallos, revisión antes de
   `main` ([`REVIEW.md`](REVIEW.md)), retro. Vocabulario: [`GLOSSARY.md`](GLOSSARY.md).

## Reglas

- **Lo que no está subido no existe**: commit + push en cada punto estable, con la bitácora
  actualizada en el mismo commit.
- Commits en español: primera línea con qué cambia, cuerpo con qué queda y estado de los tests,
  última línea `Siguiente: <paso>`.
- A `main` solo se sube con confirmación expresa (y `main` es lo que se publica).
- Antes de subir código a `main` (no solo contenido): `/code-review` del diff contra `origin/main` y sus
  arreglos; si el cambio es grande, también `/opt-tokens` y `/retro` (paso 5 del runbook).
- Tras una llamada interrumpida o rechazada, `git status` y `git diff` antes de repetirla: el cambio puede
  haberse guardado o subido ya.
- **Publicación semanal** (decisión y consentimiento del usuario, 2026-10-13): la web se actualiza
  los **domingos por la noche**. Una tarea programada de Claude («Tarkor semanal») revisa el avance
  de Tarkor, actualiza su ficha y sube la rama de trabajo a `main` **sin pedir confirmación** (el
  usuario lo autorizó para esa tarea). Debe gastar los mínimos tokens: leer solo la bitácora del
  juego y los commits desde la última fecha de `actualizado`. Por eso la rama de trabajo tiene que
  estar siempre publicable; entre semana, lo hecho se apunta en «Para la próxima publicación» de la
  bitácora. Fuera de esa tarea, `main` sigue necesitando confirmación expresa.
- Todo texto visible, en **castellano, gallego e inglés**. `npm run check` lo comprueba.
- No se enlaza el código de los proyectos (sus repos son privados): solo su versión pública.
- Mensaje de la marca (2026-10-04): Galivelop es un **taller** (crear, investigar, innovar,
  aprender), abierto a colaborar y sin ánimo de vender en la web: expone los proyectos. Galicia es
  solo una mención (el nombre), no la base del mensaje.
- Marca: azul celeste y blanco de la bandera gallega, sin copiar su composición.
- Al sacar información de otro repo (Tarkor, toVeriAI…), solo se lee: nunca se modifica desde aquí.
