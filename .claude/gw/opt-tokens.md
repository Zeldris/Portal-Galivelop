<!-- galivelop-workflow v0.3.0 -->
# opt-tokens — notas del proyecto

Las lee la skill `opt-tokens` antes de proponer nada, y se actualizan cuando la persona aprueba un cambio. El flujo
las crea una vez; desde entonces son del proyecto. (Antes vivían en `.claude/skills/opt-tokens/proyecto.md`.)

## Herramientas que ya ahorran

- `python3 .claude/gw/scripts/recuperar.py --estado` y `--buscar "<texto>"`: recuperar lo que se llevó una
  compactación.
- `orchestrate-dealer`: el trabajo de más de un paso, repartido a subagentes de contexto limpio.
- **Tarea semanal en su propia sesión** («Proyectos semanal»): la revisión de los domingos no arrastra el
  contexto de las sesiones de trabajo y de cada proyecto solo lee su bitácora o su CHANGELOG, sus commits y el diff
  de su texto para la web (en Tarkor, `tarkor-contenido-web.md`).
- **Hojas de contacto** para elegir imágenes: una cuadrícula de miniaturas con su nombre (Python PIL) en vez de
  abrir cada imagen.
- **Capturas por sección** con Playwright (`element.screenshot`) en vez de la página entera.
- **Datos de Tarkor desde el catálogo** (`backend/src/scripts/worldCatalog.ts`) con `grep`/regex por `slug`, sin
  leer el archivo entero (más de 12.000 líneas).
- **Bitácora corta:** «Hecho» guarda solo las 10 últimas entradas (2026-10-22; se leía 8 veces por sesión).
- **Medir páginas en texto** (2026-10-25): `npm run medir` (`tools/qa/medir-paginas.cjs`, tras `npm run build`;
  arranca y para él mismo `vite preview`, desde la retro del muro) da alto, pantallas, desbordamiento y errores de
  consola por página en escritorio y móvil. Las capturas, solo para juzgar el aspecto (el rediseño leyó 39, muchas
  solo para medir).
- **Bitácora por partes** (2026-10-25): `recuperar.py --estado`, o `sed -n '/^## Pendiente/,/^## /p'
  docs/traspaso.md` para una sección; entera solo al empezar (el rediseño la leyó 66 veces, 415k arrastrados).
- **Subagentes con plan cerrado, en el modelo barato** (2026-10-25): aplicar estilos o textos ya decididos, hacer
  capturas o lotes manuales va con la fila de `selector` del modelo barato; la sesión principal revisa el diff y las
  capturas por sección. En el rediseño, 6 de 8 subagentes usaron el grande (4,3M de entrada).
- **CI en una llamada** (2026-10-25): `list_workflow_runs` con `perPage: 1` y la rama (`branch`), solo al cerrar un
  bloque y no otra vez hasta el siguiente push (la sesión del 2026-10-25 hizo 28 llamadas, 575k arrastrados).
- **Tareas programadas de una vez** (2026-10-25): `get_trigger` y `update_trigger` devuelven el prompt entero (~4k);
  se prepara el texto completo y se cambia con un solo `update_trigger`, sin `get_trigger` para comprobar (la
  respuesta ya lo trae). 10 llamadas arrastraron ~525k.
- **`/clear` al llegar a `main`** (2026-10-25): una sesión encadenó varias tareas sin `/clear` (605 llamadas, 18
  compactaciones, 115k de contexto medio); tras cada subida a `main`, `/clear` y retomar desde la bitácora.

## Costes conocidos

- **Leer otro repo en la sesión principal** (aplicar Galivelop-workflow, 2026-10-22: guía, config, plantillas y
  scripts, ~30k tokens arrastrados en cada llamada): con `orchestrate-dealer`, un subagente lee y resume con rutas.
- **Capturas de pantalla** para revisar cambios visuales: necesarias, pero mejor por sección y a 1280 px.
- **Salida de `npm run check`**: filtrar con `grep -E "Tests|error"`.
- **`src/estilos/global.css`** (más de 2.800 líneas): `grep -n '<selector>'` y `sed -n` del rango, nunca entero
  (el rediseño lo leyó 32 veces, 210k arrastrados).

## Ajustes en vigor

- Ventana de compactación automática: `CLAUDE_CODE_AUTO_COMPACT_WINDOW` (200000) en `.claude/settings.json`. En la
  nube la sesión arranca en `/home/user` y ese archivo no se carga: la misma variable va en las variables del
  entorno de la nube (ajustes del entorno, «Edit»; la pone el usuario, aceptado el 2026-10-22). Se comprueba con
  `env | grep AUTO_COMPACT` al empezar.

## Dónde está el registro

En la nube, la sesión arranca en `/home/user` y su registro queda en `~/.claude/projects/-home-user/`, no en la
carpeta del portal. `medir.py` y `recuperar.py` lo buscan también en las carpetas de los directorios padre; a mano:
`python3 .claude/skills/opt-tokens/scripts/medir.py --sesion "$(ls -t ~/.claude/projects/-home-user/*.jsonl | head -1)"`.

## Referencias medidas

- 2026-10-25, sesión larga (repos nuevos, tarea semanal, muro, «Próximamente»): 605 llamadas, 115k de contexto medio
  (suelo 96k, techo 141k), 18 compactaciones; 12 subagentes, 8,1M de entrada. Solo «Próximamente»: 51 llamadas, 124k.
- 2026-10-25, rediseño del front: 394 llamadas, 112k de contexto medio (suelo 94k, techo 141k), 10 compactaciones;
  8 subagentes, 5,4M de entrada.
- 2026-10-22, piloto de Galivelop-workflow: 62 llamadas, 171k de contexto medio, suelo 71k, techo 237k, sin
  compactar (la ventana de 200k no se aplicó).
- 2026-10-21, sesión del flujo traído de Tarkor: ~681k de contexto medio por llamada antes del `/clear`.
