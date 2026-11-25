<!-- galivelop-workflow v0.9.0 -->
# gw-opt-tokens — notas del proyecto

Las lee la skill `gw-opt-tokens` antes de proponer nada, y se actualizan cuando la persona aprueba un cambio. El flujo
las crea una vez; desde entonces son del proyecto. (Antes vivían en `.claude/skills/opt-tokens/proyecto.md` y en `.claude/gw/opt-tokens.md`.)

## Herramientas que ya ahorran

- **Hoja claro/oscuro de una figura** (2026-11-25, retro T2): `python3 tools/qa/hoja-figura.py <figura-clara>`
  (busca la `-oscuro` al lado; deja `capturas/hoja-<nombre>.png`) da las dos versiones en una imagen; abrirlas por
  separado, tres lecturas, costó ~380k arrastrados. La grande solo si la hoja no basta.
- **Entradas de `pending.md` y de la bitácora en sub-viñetas cortas** (2026-11-25, retro T1): la entrada de la
  auditoría de marca era una línea de ~2k caracteres y `pending.md` se leyó 22 veces (1,1M arrastrados); se mira con
  `grep -n '^- ' docs/records/pending.md | cut -c1-160` y se lee solo la entrada con `sed -n '<n>,<m>p'`. Una entrada
  que pasa de ~3 líneas se parte en sub-viñetas.
- **Diagramas con `gw-worker` y Fable** (2026-11-24, retro P1): fila de `selector.cases`; el `general-purpose` de los
  diagramas de productos arrancó con 79k (un `gw-worker`, 24k): ~0,9M de entrada por encargo. El generador de los
  de productos está en `scripts/diagramas/productos.py` (P2): retocar un texto no obliga a redibujar.
- **Capturas de prototipo en hoja de contacto** (2026-11-24, retro P5): el subagente del `prototype` devuelve una
  sola imagen de miniaturas (o la URL del Artifact), no una captura por variante; la principal leyó tres (153k
  arrastrados). La grande se abre solo si la hoja no basta.
- **Contador de «Pendiente» con `handoff.py move-pending`** (2026-11-17, retro P2): la cifra de la bitácora la escribe el script tras tocar `pending.md`; contarla a mano costó un commit (221c6c1) y relecturas de `pending.md`.
- **`/gw-update` con el flujo leído en un subagente** (2026-11-16, retro P3, propuesto al flujo): el ensayo de `apply.py`, el CHANGELOG y el diff de plantillas los resume un subagente barato; en la 0.7.0 entraron en la sesión principal (~520k arrastrados).

- **Campos de una ficha con `bloque.py`** (2026-11-05, T2): `.claude/skills/gw-portal/scripts/bloque.py <ficha>
  <campo> -` cambia un campo y deja el resto del archivo igual; la sesión de las fichas gastó ~8 llamadas rehaciendo
  JSON a mano.
- `python3 .claude/gw/scripts/recover.py --state` y `--search "<texto>"`: recuperar lo que se llevó una
  compactación.
- `gw-orchestrate-dealer`: el trabajo de más de un paso, repartido a subagentes de contexto limpio.
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
  2026-10-27 abre también el menú, el submenú, cada hoja de apartado y la ampliación de imágenes y galerías (las hojas cortadas que vio la persona en el
  móvil no salían porque solo medía la página cerrada).
- **Recorrido en texto para auditorías** (2026-11-14, retro P1): `tools/qa/recorrido.cjs` completa a `npm run medir`
  con lo que este no mira (anchos de tablet y escritorio, tema oscuro, contraste del foco con Tab y enlaces internos
  que no dan 200). Una auditoría lo lanza en vez de escribir sus propios scripts de Playwright (la del 2026-11-14
  escribió cuatro, con 27 capturas y 1,7M arrastrados).
- **Bitácora por partes** (2026-10-25): `recover.py --state`, o `sed -n '/^## Pendiente/,/^## /p'
  docs/handoff.md` para una sección; entera solo al empezar (el rediseño la leyó 66 veces, 415k arrastrados).
- **Subagentes con plan cerrado, en el modelo barato** (2026-10-25): aplicar estilos o textos ya decididos, hacer
  capturas o lotes manuales va con la fila de `gw-selector` del modelo barato; la sesión principal revisa el diff y las
  capturas por sección. En el rediseño, 6 de 8 subagentes usaron el grande (4,3M de entrada).
- **CI en una llamada** (2026-10-25): `list_workflow_runs` con `perPage: 1` y la rama (`branch`), solo al cerrar un
  bloque y no otra vez hasta el siguiente push (la sesión del 2026-10-25 hizo 28 llamadas, 575k arrastrados).
- **Tareas programadas de una vez** (2026-10-25): `get_trigger` y `update_trigger` devuelven el prompt entero (~4k);
  se prepara el texto completo y se cambia con un solo `update_trigger`, sin `get_trigger` para comprobar (la
  respuesta ya lo trae). 10 llamadas arrastraron ~525k.
- **`/clear` al llegar a `main`** (2026-10-25): una sesión encadenó varias tareas sin `/clear` (605 llamadas, 18
  compactaciones, 115k de contexto medio); tras cada subida a `main`, `/clear` y retomar desde la bitácora. Desde el
  2026-10-31 lo pide `AGENTS.md` («Relevos»): esta nota sola no se cargaba y no se siguió (225k de media).
- **Reddit no se lee desde la nube** (2026-10-31): responde 403 a todo (`www`, `old.reddit.com`, la API y
  `WebFetch`); se pide a la persona el texto pegado o una captura, sin probar más vías (6 llamadas perdidas).

- **Capturas con medidas** (2026-10-27): `npm run capturas -- <ruta> [selector | --menu]` (`tools/qa/capturas.cjs`,
  tras `npm run build`) deja el PNG en `capturas/` (escritorio y móvil) y escribe alto, pantallas, desborde, cortes y
  táctiles de lo capturado: la captura se abre una vez para juzgar el aspecto y se manda con `SendUserFile`, sin
  releerla para medir (Productos leyó 13, 189k arrastrados).
- **Página nueva con plan cerrado, al modelo barato** (2026-10-27): fila de `selector.cases` en `.claude/gw.json`;
  la sesión reparte con `gw-orchestrate-dealer` y revisa el diff y las capturas. La lista de sitios que toca una página
  está en «Añadir una página» de `docs/desarrollo.md` (y `src/rutas.test.ts` la vigila).
- **Formato comprobado, no juzgado** (2026-10-27): `prettier --check` en `npm run check` (`.prettierrc`); la revisión
  no gasta hallazgos en estilo.
- **`/gw-update` con la salida filtrada** (2026-11-02): `python3 <flujo>/scripts/aplicar.py . --dry-run 2>&1 | grep -v
  '^  [-+ @]'` (y lo mismo con `--update`): sin el diff entero de `REVIEW.md`/`GLOSSARY.md` contra la plantilla
  (~300k arrastrados), que no se usa; el que importa es el de plantilla vieja contra nueva (paso 3 de la skill).

- **Clones de `gw-portal` en el scratchpad** (2026-11-04): `recoger.py --clones <scratchpad>/clones`; en `/home/user`
  cargaban tres repos más en cada llamada (75k de arranque por subagente). Y `proyectos.md` se lee por sección
  (`sed -n '/^## TARKOR/,/^## /p'`): entero, 17 lecturas y 152k arrastrados.
- 2026-11-04, flujo 0.5.0 y `gw-portal` aplicar: 149 llamadas, 129k de contexto medio (suelo 113k, techo 158k), 5
  compactaciones; 9 subagentes, 9,8M de entrada.
- **Prototipo publicado desde un subagente** (2026-11-08, T1): el `quickstart` de `Artifact` mete ~10k en el contexto
  y se arrastró 308k; un subagente ligero (fork o encargo con el HTML) publica y devuelve solo la URL. Nota en
  `AGENTS.md` (`prototype`).
- **Barrido de estilos con plan cerrado, al modelo barato** (2026-11-08, T2): `global.css` se leyó 44 veces (410k) y
  hubo 113 llamadas de Bash con el modelo grande; aplicar una hoja de estilos o una decisión de diseño ya escrita va
  con la fila de `selector.cases` de «Página o sección nueva con el plan cerrado»: un subagente ligero por bloque de
  la hoja, que devuelve el diff; la sesión revisa el diff y las capturas.
- **Hoja de contacto de páginas** (2026-11-08, T3): `npm run capturas -- --hoja <ruta> <ruta>…` deja una imagen con N
  páginas en miniatura (escritorio y móvil, claro y oscuro); la captura entera, solo de la página sospechosa;
  `npm run medir` da cortes y desbordes en texto. 17 capturas de página entera costaron ~570k arrastrados.
- **Los subagentes no escriben la bitácora** (2026-11-09, T-b): el encargo dice «no toques `docs/handoff.md`; devuelve
  el texto para ella» y la sesión principal lo apunta al fusionar. Resolver un conflicto de la bitácora costó 5,6k y
  se arrastró 90k.
- **Arreglo pequeño, en la sesión principal** (2026-11-09, T-c): un subagente arranca con ~68k de contexto; un arreglo
  cerrado de menos de ~20 líneas cuyo contexto ya está cargado sale más barato hecho aquí. Lo demás sigue repartiéndose.
- **Bitácora sin lo ya publicado** (2026-11-09, T-a): una entrada de «Pendiente» que ya está en `main` se resume en dos
  líneas con enlace a su retro; la de «Identidad visual propia» tenía 6,5k caracteres y la bitácora se leyó 10 veces.
- **Columnas de las rejillas en texto** (2026-11-09, R1): `npm run medir` avisa si una rejilla de `COLUMNAS` se queda
  con menos columnas de las que toca, en escritorio o móvil; no hace falta una captura para eso.
- **Componente con diseño aprobado, partido en dos encargos** (2026-11-09, T-a): datos, textos, ficha, prerender y
  documentación al modelo barato con plan cerrado; solo la lógica del componente al grande (fila de `selector.cases`).
  El subagente de las animaciones lo hizo todo con el grande: 14,2M de entrada, ~60 % del gasto de la tarea.
- **Documentos de diseño por secciones** (2026-11-09, T-b): `grep -n '^<h\|^#'` para los encabezados y `sed -n` de la
  sección, o lo lee el subagente que lo usa; el storyboard leído entero con `cat` se arrastró 245k.
- **Capturas solo para juicio visual** (2026-11-09, T-c): si un rótulo se corta lo dicen `npm run medir` y los tests de
  encaje; una captura final por pantalla, no por intento (~38k cada imagen arrastrada).
- **La fase 1 tras un `/clear`** (2026-11-10, T1): la revisión de código es un fork y hereda el contexto de la sesión
  (127k por llamada, 3,7M en 29 llamadas); con el trabajo subido y la bitácora al día, se pide `/clear` y la sesión
  nueva empieza por `/code-review`: arranca en ~70k, ~1,6M menos por revisión.

## Costes conocidos

- **Arranque fijo de ~86k por llamada en la nube** (2026-11-25, retro T3; Q-22): sistema, herramientas y MCP (Claude
  Docs, GitHub, remoto) son el 73 % de la entrada (22M de 30M en 254 llamadas) y los conectores no se pueden
  desactivar en la nube. Solo baja con menos llamadas: órdenes juntas, `/clear` entre tareas y subagentes para lo
  que lee mucho.
- **Repos hermanos en `/home/user`** (2026-10-26): cada repo que se añade con `add_repo` en la sesión principal mete
  su `CLAUDE.md`/`AGENTS.md` y su lista de skills en cada llamada (~15k con cuatro repos; suelo de 114k en la página
  de miembro) y encarece el arranque de cada subagente (74k). Para leer otro repo, un subagente lo clona en el
  scratchpad (`git clone --depth 50` sin `register_repo_root`) y devuelve el resumen con rutas.
- **`src/i18n/textos.ts`** (2026-10-26, 30 lecturas y 128k arrastrados en la página de miembro): `grep -n "'<clave>'"`
  y `sed -n` del rango, nunca entero.
- **Leer otro repo en la sesión principal** (aplicar Galivelop-workflow, 2026-10-22: guía, config, plantillas y
  scripts, ~30k tokens arrastrados en cada llamada): con `gw-orchestrate-dealer`, un subagente lee y resume con rutas.
- **Capturas de pantalla** para revisar cambios visuales: necesarias, pero mejor por sección y a 1280 px.
- **Capturas releídas** (2026-10-27, una misma captura leída 4 veces en la ronda de móvil): lo que se saca de una
  captura se escribe en texto (medidas, qué falla y dónde) y la captura no se vuelve a abrir.
- **Git con salida corta** (2026-10-27, un `git branch -a` con su log entró con 6k): `git status --short`,
  `git log --oneline -N` y `git diff --stat`; el diff entero, solo del archivo que se revisa.
- **Salida de `npm run check`**: filtrar con `grep -E "Tests|error"`.
- **`src/estilos/global.css`** (más de 2.800 líneas): `grep -n '<selector>'` y `sed -n` del rango, nunca entero
  (el rediseño lo leyó 32 veces, 210k arrastrados).
- **`scripts/paginas-estaticas.mjs`** (2026-11-10, T2; 19 lecturas, 127k arrastrados): sus plantillas van en líneas
  muy largas; `grep -n "pg.ruta === '<ruta>'"` o el nombre de la constante y `sed -n` de unas 10 líneas.

## Ajustes en vigor

- Ventana de compactación automática: `CLAUDE_CODE_AUTO_COMPACT_WINDOW` (200000) en `.claude/settings.json`. En la
  nube la sesión arranca en `/home/user` y ese archivo no se carga: la misma variable va en las variables del
  entorno de la nube (ajustes del entorno, «Edit»; la pone el usuario, aceptado el 2026-10-22). Se comprueba con
  `env | grep AUTO_COMPACT` al empezar.

## Dónde está el registro

En la nube, la sesión arranca en `/home/user` y su registro queda en `~/.claude/projects/-home-user/`, no en la
carpeta del portal. `measure.py` y `recover.py` lo buscan también en las carpetas de los directorios padre; a mano:
`python3 .claude/skills/gw-opt-tokens/scripts/measure.py --session "$(ls -t ~/.claude/projects/-home-user/*.jsonl | head -1)"`.

## Referencias medidas

- 2026-10-27, Productos y rediseño del inicio (desde 906f9f8): 81 llamadas, 125k de contexto medio (suelo 107k, techo
  138k), 6 compactaciones; 13 capturas (189k arrastrados); un subagente en el modelo grande, 1,6M de entrada y 76k de
  arranque (repos hermanos cargados).

- 2026-11-08, identidad visual: 120 llamadas, 132k de contexto medio (suelo 98k, techo 154k).
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
- **`docs/marca.md` por secciones** (2026-11-12, retro P2): `grep -n '^##' docs/marca.md` y `sed -n '/^## Alcance/,/^## /p'
  docs/marca.md`; entero solo la primera vez en la tarea (la hoja del generador lo leyó 13 veces, 252k arrastrados).
- **Documento de otro repo para aplicar** (2026-11-12, retro P3, propuesto al flujo): el subagente devuelve los puntos
  con su texto literal y las rutas, no un resumen; la sesión leyó la hoja del generador 3 veces más (250k).
- **Node fijo en la máquina local** (2026-11-12, retro P4): `/home/deck/.local/node`, en el PATH por
  `.claude/settings.local.json`; sin él, cada orden exportaba el PATH a mano y un push falló.
- 2026-11-12, imágenes, «reutilizar» y hoja del generador sin `/clear` entre medias: 104 llamadas, 125k de contexto
  medio (techo 166k), 2 compactaciones con presupuesto 1; 3 subagentes, 3,0M de entrada.
- **Informe de `gw-portal` leído por subagentes** (2026-11-22, retro P3): en informe y aplicar, la sesión principal recibe solo el resumen por repo (la de la ADR 0005 leyó `informe.txt` 8 veces, 358k arrastrados).
- **Línea base 2026-11-22** (sesión de `gw-portal`, flujo 0.8.2 y ADR 0005, sin `/clear`): 215 llamadas, contexto medio 125k, techo 165k, 4 compactaciones; bitácora leída 24 veces (1,34M arrastrados).
- **Línea base 2026-11-25** (auditoría de marca, D1-D13, guiones y camino a `main`, desde e2c9b9b): 254 llamadas, contexto medio 119k (suelo 95k, techo 165k), 2 compactaciones con presupuesto 1; 7 subagentes, 5,7M de entrada; `pending.md` 22 lecturas (1,1M), bitácora 36 (787k).
