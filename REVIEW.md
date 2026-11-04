<!-- galivelop-workflow v0.5.0 -->
# Guía de revisión

Lo que el revisor (`/code-review`, o cualquier agente que revise un diff) comprueba en cada diff del portal, además
de los fallos de siempre. Lo mecánico ya lo comprueban `npm run check` (tsc, vitest y `test-ganchos.sh`) y los ganchos
de git; aquí está lo que pide criterio. Cada regla acaba en `(check: …)`, con lo que la hace cumplir, o en
`(criterio)` si no hay check; una regla mecánica marcada `(criterio)` pide su check.

## Cómo se informa

- Antes de dar un hallazgo, intenta refutarlo: busca el código, el test o el gancho que ya lo cubre. Solo se informa
  de lo que sobrevive, con la ruta y la línea. (criterio)
- Los hallazgos se escriben también en un archivo fuera del árbol (el scratchpad, o
  `"$(git rev-parse --git-dir)/review.md"`), no solo en la conversación: una compactación o un relevo se los lleva, y
  de ese archivo salen los encargos de los arreglos y los leves que se apuntan en la bitácora. (criterio)
- Un dato que caduca (una versión, un precio, una cuota, un límite de un servicio externo) escrito en el diff lleva su
  fecha y su fuente; si no, es un hallazgo. (criterio)
- La revisión acaba con un veredicto, uno de tres: `SHIP` (nada que arreglar), `SHIP WITH FIXES` (hay arreglos, ninguno
  bloquea) o `DO NOT SHIP` (algo grave o que rompe). (criterio)

## Tres idiomas, siempre

- Todo texto visible nuevo está en castellano, gallego e inglés: claves en `src/i18n/textos.ts` y `Texto` en los
  JSON de proyectos. Incluye `aria-label`, `alt`, títulos de las páginas estáticas
  (`scripts/paginas-estaticas.mjs`) y pies de foto. (check: `textos.test.ts`, `proyectos.test.ts`, `equipo.test.ts`
  y `legal.test.ts` exigen los tres idiomas; que la traducción sea de verdad, criterio)
- El gallego no es castellano con otra ortografía: «xogo», «facer», «tamén», «lapelas»… (criterio)

## Lo que no se publica

- Solo se enlaza el código de un proyecto con repo público (`enlaces`, tipo `otro`); el de un repo privado, nunca. (criterio)
- **La privacidad dice lo que hace el código.** Un cambio en formularios, correos de contacto (`contacto` de una
  ficha, `colabora` de un miembro), `localStorage` o recursos de otro dominio revisa
  `src/data/legal/privacidad.json` y su `actualizado`; `src/data/legal.test.ts` vigila solo lo mecánico (claves del navegador, recursos de otro dominio). (criterio)
- En Tarkor, ningún juego de referencia (X4, D&D, BG3, Medieval Dynasty…) ni identificadores internos del
  juego (`QA-27`, `P164`, `CR-69`…), aunque vengan en sus documentos o commits. (criterio)
- Lo marcado 🗺️ en el contenido de Tarkor no se presenta como jugable. (criterio)
- toVeriAI es producto de Raquel (fundadora y creadora): sin menciones a su origen académico (decisión del
  usuario, 2026-10-04). (criterio)

## Un dato, un sitio

- Un dato que ya está en `src/data/` (proyectos, equipo, marca, líneas) no se repite a mano en un componente,
  en `index.html` ni en el README sin necesidad; si se repite (vista previa en redes, `llms.txt`), se cambia en
  todos los sitios a la vez. (criterio)
- La configuración del flujo vive solo en `.claude/gw.json` y solo la lee `.claude/gw/scripts/config.py`. (criterio)
- `valor` de un elemento de apartado es texto igual en los tres idiomas, nunca un objeto (React no lo pinta). (criterio)

## Rutas y SEO

- Una ruta nueva se añade también en `scripts/paginas-estaticas.mjs` (página estática, sitemap) y funciona con
  los prefijos `/gl/` y `/en/`. (check: `src/rutas.test.ts`, para las rutas fijas de `App.tsx`)
- Los enlaces internos usan `Link` (respetan el prefijo de idioma); las imágenes, `ruta()` (respetan la base). (criterio)
- El `lastmod` del sitemap es la fecha real del último cambio del contenido principal de la página (sus datos, por
  `actualizado` o por git; no `textos.ts`), nunca la del build: Google deja de fiarse de un `lastmod` que no lo es. (criterio)
- Un proyecto nuevo trae su `og.jpg` (`tools/og/generar.py`). (check: `src/data/og.test.ts`)

## Móvil y accesibilidad

- Navegadores: los del objetivo por defecto de Vite 8 (`baseline-widely-available`: Safari e iOS 16.4+, Chrome y Edge
  111+, Firefox 114+). Una API que solo falta en versiones anteriores no es un hallazgo. (criterio)
- Nada desborda en horizontal a 320-390 px, ni con el texto agrandado (cortes en `em` en la cabecera). (criterio)
- Los botones solo con icono llevan `aria-label`; lo que se mueve solo (la galería) se puede pausar y respeta
  «reducir movimiento». (criterio)

## Estilos y textos

- Un componente que usan dos páginas vive en `src/components/`, no dentro de una de ellas (`TarjetaProducto`
  empezó en `pages/Productos.tsx` y lo usaba el inicio, 2026-10-27). (criterio)
- Una clase de `src/estilos/global.css` que usan dos componentes va acotada por su contenedor
  (`.apartado-items .tarjeta-imagen`), o las reglas de uno deforman el otro (pasó con `.tarjeta-imagen`, 2026-10-25). (criterio)
- Un texto con número usa el plural de la plantilla (`{n} {n:elemento|elementos}`, ver `src/i18n/rellenar.ts`), no
  un ternario con dos claves en el componente. (criterio)
- El `#ancla` de la URL se lee con `leerAncla()` (`src/utils/ancla.ts`); un `decodeURIComponent` suelto en `src/` ya
  lo rechaza `src/utils/ancla.test.ts`, y las marcas de plural mal escritas, `src/i18n/rellenar.test.ts`. (check: esos
  dos tests)
- Una forma dentro de otra con menos de 32 px de hueco lleva de radio el de fuera menos el hueco (si sale más de 2 px). (criterio)
- Un `z-index` positivo nuevo sale de la escala `--z-*` de `global.css` (los negativos solo ordenan fondos dentro de
  su caja); una transición usa `--transicion` o `--curva`, nunca `ease` ni `linear` del navegador. (criterio)
- Los mensajes del sistema (avisos, errores del formulario) son tranquilos y concretos: qué ha pasado y qué hacer, sin
  exclamaciones. Las palabras de relleno («revolucionar», «de vanguardia»…) las rechaza `src/i18n/relleno.test.ts`. (criterio; check: `relleno.test.ts` para el relleno)

## Ganchos y scripts

Retro del 2026-10-21: las dos revisiones del flujo traído de Tarkor hallaron 29 fallos en los ganchos. Desde el
2026-10-22 los ganchos y scripts son los de Galivelop-workflow (`.githooks/`, `.claude/gw/scripts/`): no se editan
aquí, se proponen en el repo del flujo con `gw-harvest`; lo del portal es su configuración (`.claude/gw.json`) y su
test. (check: `config-guard.py` pregunta antes de editarlos)

- La raíz del repo se saca de la ruta del script (`$(dirname "$0")`) o de `git rev-parse --show-toplevel`, nunca de
  `$CLAUDE_PROJECT_DIR` ni del directorio actual: en la nube la sesión puede arrancar en `/home/user`. (criterio)
- Un gancho de subida comprueba **el commit que se sube**, no la carpeta de trabajo. (criterio)
- Los ganchos **fallan cerrados** cuando les falta un dato (un commit que el clon no tiene, una API que no responde),
  con la orden que lo arregla. Excepción razonada: las claves de rutas (`log`, `reviewMark`, `recordsDir`,
  `proposalsDir`, `ciLocalLog`) son opcionales con defecto en inglés, así que una ausente no es un dato que falte.
  (criterio)
- Los scripts de shell corren en bash 3.2 (macOS): nada de `mapfile` ni arrays asociativos. (criterio)
- Un paso de CI que compara con el sitio publicado lo lee **antes** de desplegar: justo después, GitHub Pages aún sirve
  la copia vieja de su caché (`max-age=600`). Pasó con IndexNow, 2026-10-30. (criterio)
- Una carpeta con nombre fijo en un directorio compartido (`$TMPDIR`, `/tmp`) es por usuario, se crea con permisos 700
  y se rechaza si ya existe como symlink o de otro usuario; los archivos sueltos, con `mktemp`. (criterio)
- Un cambio en `.claude/gw.json` (sobre todo `content`, `check` o `reviewMark`) o en `.githooks/` lleva su caso en
  `tools/qa/tests/test-ganchos.sh`: `content` decide qué puede publicar sola la tarea semanal. Vale para cualquier
  gancho o script propio del portal; un caso que espera un fallo comprueba el motivo, no solo el código de salida.
  (criterio)
- Un gancho que pregunta o bloquea se revisa **probando cómo saltárselo**: envoltorios con opciones que llevan valor
  (`sudo -u X`, `sudo -uX`, `env -u X`, `nice -n 5`, `timeout 5`, `xargs -I{}`), el destino de los copiadores (`cp`,
  `install`, `rsync`, `dd of=`, `-t DIR`), una carpeta antecesora de la protegida y una ruta relativa o con `..`; y
  los falsos positivos habituales (leer o copiar **desde** la carpeta, `git restore --staged`). Cada forma, su caso.
  (criterio)
- `pkill -f <patrón>` (y `pgrep -f`) casa también con la orden que lo lanza cuando el patrón va en ella
  (`bash -c "… pkill -f servidor"`), y la mata: un pidfile, `pgrep -x` o un patrón que no se case a sí mismo
  (`[s]ervidor`). (criterio)
- Un runbook o encargo que sigue una tarea programada (una sesión sin persona delante) se revisa como código, aunque
  case con `content`: lo que dice se ejecuta tal cual. Aquí, `docs/runbooks/tarea-semanal.md` y la skill `gw-portal`.
  (criterio)

## Traído de otro repo: se adapta a los contratos de este

- El código, los scripts o las reglas traídos de otro repositorio se comprueban contra **este** repo, no contra el
  original: formatos, rutas, extensiones de archivo, patrones de nombres, constantes, claves de configuración e
  identificadores de tarea. (criterio)
- Lo que viene de un proyecto que sube de otra forma se adapta a cómo sube el portal: directo a `main`, no por PR, y
  la marca de revisión en el repo (`docs/records/reviewed.txt`) para que la vea la tarea semanal. (criterio)
- Una tabla o un ejemplo de una guía que lee un script lo lee ese script en un test. (criterio)
