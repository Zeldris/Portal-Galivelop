<!-- galivelop-workflow v0.1.0 -->
# opt-tokens — notas del proyecto

Las lee la skill `opt-tokens` antes de proponer nada, y se actualizan cuando el usuario aprueba un cambio. El flujo
las crea una vez; desde entonces son del proyecto. (Antes vivían en `.claude/skills/opt-tokens/proyecto.md`.)

## Herramientas que ya ahorran

- `python3 .claude/gw/scripts/recuperar.py --estado` y `--buscar "<texto>"`: recuperar lo que se llevó una
  compactación.
- `orchestrate-dealer`: el trabajo de más de un paso, repartido a subagentes de contexto limpio.
- **Tarea semanal en su propia sesión** («Tarkor semanal (portal)»): la revisión de los domingos no arrastra el
  contexto de las sesiones de trabajo y solo lee la bitácora del juego, sus commits y el diff de
  `tarkor-contenido-web.md`.
- **Hojas de contacto** para elegir imágenes: una cuadrícula de miniaturas con su nombre (Python PIL) en vez de
  abrir cada imagen.
- **Capturas por sección** con Playwright (`element.screenshot`) en vez de la página entera.
- **Datos de Tarkor desde el catálogo** (`backend/src/scripts/worldCatalog.ts`) con `grep`/regex por `slug`, sin
  leer el archivo entero (más de 12.000 líneas).

## Costes conocidos

- **Capturas de pantalla** para revisar cambios visuales: necesarias, pero mejor por sección y a 1280 px.
- **Salida de `npm run check`**: filtrar con `grep -E "Tests|error"`.

## Ajustes en vigor

- Ventana de compactación automática: `CLAUDE_CODE_AUTO_COMPACT_WINDOW` (200000) en `.claude/settings.json`.

## Dónde está el registro

En la nube, la sesión arranca en `/home/user` y su registro queda en `~/.claude/projects/-home-user/`, no en la
carpeta del portal. `medir.py` y `recuperar.py` lo buscan también en las carpetas de los directorios padre; a mano:
`python3 .claude/skills/opt-tokens/scripts/medir.py --sesion "$(ls -t ~/.claude/projects/-home-user/*.jsonl | head -1)"`.

## Referencias medidas

- 2026-10-21, sesión del flujo traído de Tarkor: ~681k de contexto medio por llamada antes del `/clear`.
