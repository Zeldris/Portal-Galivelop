# `opt-tokens` en el portal Galivelop

Lo propio de este proyecto para la skill. En otro proyecto, este archivo se reescribe.

## Lo que ya ahorra (no proponerlo otra vez)

- **Tarea semanal en su propia sesión** («Tarkor semanal (portal)»): la revisión de los domingos no arrastra el
  contexto de las sesiones de trabajo y solo lee la bitácora del juego, sus commits y el diff de
  `tarkor-contenido-web.md`.
- **Hojas de contacto** para elegir imágenes: una cuadrícula de miniaturas con su nombre (Python PIL) en vez de
  abrir cada imagen.
- **Capturas por sección** con Playwright (`element.screenshot`) en vez de la página entera.
- **Datos de Tarkor desde el catálogo** (`backend/src/scripts/worldCatalog.ts`) con `grep`/regex por `slug`, sin
  leer el archivo entero (más de 12.000 líneas).
- **Compactar a 200k** (`CLAUDE_CODE_AUTO_COMPACT_WINDOW` en `.claude/settings.json`) y el gancho de
  `recuperar.py --estado` tras cada compactación.

## Gastos conocidos

- **Capturas de pantalla** para revisar cambios visuales: necesarias, pero mejor por sección y a 1280 px.
- **Salida de `npm run check`**: filtrar con `grep -E "Tests|error"`.

## Dónde está el registro

En la nube, la sesión arranca en `/home/user` y su registro queda en `~/.claude/projects/-home-user/`, no en la
carpeta del portal: `python3 .claude/skills/opt-tokens/medir.py --sesion "$(ls -t ~/.claude/projects/-home-user/*.jsonl | head -1)"`.
Lo mismo para `tools/qa/recuperar.py` (`--sesion`).
