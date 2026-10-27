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
  solo para medir). Desde el 2026-10-27 mide el móvil a 390, 360 y 320 px y da también `cortes` (texto que se sale
  de su caja) y `tactiles` (controles por debajo de 24×24 px, con la zona del `::after` sumada): encontró el mosaico
  cortado a 360 y los botones de idioma de 28 px que el barrido con capturas no vio. Desde el segundo paso del
  2026-10-27 abre también el menú, el submenú y cada hoja de apartado (las hojas cortadas que vio la persona en el
  móvil no salían porque solo medía la página cerrada).
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

- **Repos hermanos en `/home/user`** (2026-10-26): cada repo que se añade con `add_repo` en la sesión principal mete
  su `CLAUDE.md`/`AGENTS.md` y su lista de skills en cada llamada (~15k con cuatro repos; suelo de 114k en la página
  de miembro) y encarece el arranque de cada subagente (74k). Para leer otro repo, un subagente lo clona en el
  scratchpad (`git clone --depth 50` sin `register_repo_root`) y devuelve el resumen con rutas.
- **`src/i18n/textos.ts`** (2026-10-26, 30 lecturas y 128k arrastrados en la página de miembro): `grep -n "'<clave>'"`
  y `sed -n` del rango, nunca entero.
- **Leer otro repo en la sesión principal** (aplicar Galivelop-workflow, 2026-10-22: guía, config, plantillas y
  scripts, ~30k tokens arrastrados en cada llamada): con `orchestrate-dealer`, un subagente lee y resume con rutas.
- **Capturas de pantalla** para revisar cambios visuales: necesarias, pero mejor por sección y a 1280 px.
- **Capturas releídas** (2026-10-27, una misma captura leída 4 veces en la ronda de móvil): lo que se saca de una
  captura se escribe en texto (medidas, qué falla y dónde) y la captura no se vuelve a abrir.
- **Git con salida corta** (2026-10-27, un `git branch -a` con su log entró con 6k): `git status --short`,
  `git log --oneline -N` y `git diff --stat`; el diff entero, solo del archivo que se revisa.
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

- 2026-10-27, ronda de móvil (fase 2, desde 305f3cf): 243 llamadas, 121k de contexto medio (suelo 102k, techo 142k),
  8 compactaciones; Bash 1,31M arrastrados, Read 912k (39 imágenes); un subagente general en el modelo grande, 2,38M
  de entrada. La sesión entera: 1.337 llamadas, 50 compactaciones.
- 2026-10-26, página de miembro y encargos: 260 llamadas, 128k de contexto medio (suelo 114k, techo 141k), 17
  compactaciones; 4 subagentes, 9,1M de entrada, 74k de arranque. La sesión entera (desde el 2026-10-25, sin `/clear`):
  983 llamadas, 38 compactaciones.
- 2026-10-25, sesión larga (repos nuevos, tarea semanal, muro, «Próximamente»): 605 llamadas, 115k de contexto medio
  (suelo 96k, techo 141k), 18 compactaciones; 12 subagentes, 8,1M de entrada. Solo «Próximamente»: 51 llamadas, 124k.
- 2026-10-25, rediseño del front: 394 llamadas, 112k de contexto medio (suelo 94k, techo 141k), 10 compactaciones;
  8 subagentes, 5,4M de entrada.
- 2026-10-22, piloto de Galivelop-workflow: 62 llamadas, 171k de contexto medio, suelo 71k, techo 237k, sin
  compactar (la ventana de 200k no se aplicó).
- 2026-10-21, sesión del flujo traído de Tarkor: ~681k de contexto medio por llamada antes del `/clear`.
