<!-- galivelop-workflow v0.3.0 -->
# Guía de revisión

Lo que el revisor (`/code-review`) comprueba en cada diff del portal, además de los fallos de siempre. Lo
mecánico ya lo comprueban `npm run check` (tsc y tests de datos) y el gancho `pre-push`; aquí está lo que pide
criterio.

## Tres idiomas, siempre

- Todo texto visible nuevo está en castellano, gallego e inglés: claves en `src/i18n/textos.ts` y `Texto` en los
  JSON de proyectos. Incluye `aria-label`, `alt`, títulos de las páginas estáticas
  (`scripts/paginas-estaticas.mjs`) y pies de foto.
- El gallego no es castellano con otra ortografía: «xogo», «facer», «tamén», «lapelas»…

## Lo que no se publica

- Nada de enlaces al código de los proyectos (sus repos son privados).
- En Tarkor, ningún juego de referencia (X4, D&D, BG3, Medieval Dynasty…) ni identificadores internos del
  juego (`QA-27`, `P164`, `CR-69`…), aunque vengan en sus documentos o commits.
- Lo marcado 🗺️ en el contenido de Tarkor no se presenta como jugable.
- toVeriAI es producto de Raquel (fundadora y creadora): sin menciones a su origen académico (decisión del
  usuario, 2026-10-04).

## Un dato, un sitio

- Un dato que ya está en `src/data/` (proyectos, equipo, marca, líneas) no se repite a mano en un componente,
  en `index.html` ni en el README sin necesidad; si se repite (vista previa en redes, `llms.txt`), se cambia en
  todos los sitios a la vez.
- `valor` de un elemento de apartado es texto igual en los tres idiomas, nunca un objeto (React no lo pinta).

## Rutas y SEO

- Una ruta nueva se añade también en `scripts/paginas-estaticas.mjs` (página estática, sitemap) y funciona con
  los prefijos `/gl/` y `/en/`.
- Los enlaces internos usan `Link` (respetan el prefijo de idioma); las imágenes, `ruta()` (respetan la base).
- El `lastmod` del sitemap es la fecha real del último cambio de lo que enseña la página (datos o git), nunca la del
  build: Google deja de fiarse de un `lastmod` que no lo es. Un proyecto nuevo trae su `og.jpg` (`tools/og/generar.py`).

## Móvil y accesibilidad

- Navegadores: los del objetivo por defecto de Vite 8 (`baseline-widely-available`: Safari e iOS 16.4+, Chrome y Edge
  111+, Firefox 114+). Una API que solo falta en versiones anteriores no es un hallazgo.

- Nada desborda en horizontal a 320-390 px, ni con el texto agrandado (cortes en `em` en la cabecera).
- Los botones solo con icono llevan `aria-label`; lo que se mueve solo (la galería) se puede pausar y respeta
  «reducir movimiento».

## Estilos y textos

- Un componente que usan dos páginas vive en `src/components/`, no dentro de una de ellas (`TarjetaProducto`
  empezó en `pages/Productos.tsx` y lo usaba el inicio, 2026-10-27).
- Una clase de `src/estilos/global.css` que usan dos componentes va acotada por su contenedor
  (`.apartado-items .tarjeta-imagen`), o las reglas de uno deforman el otro (pasó con `.tarjeta-imagen`, 2026-10-25).
- Un texto con número usa el plural de la plantilla (`{n} {n:elemento|elementos}`, ver `src/i18n/rellenar.ts`), no
  un ternario con dos claves en el componente.
- El `#ancla` de la URL se lee con `leerAncla()` (`src/utils/ancla.ts`); un `decodeURIComponent` suelto en `src/` ya
  lo rechaza `src/utils/ancla.test.ts`, y las marcas de plural mal escritas, `src/i18n/rellenar.test.ts`.
- Una forma dentro de otra con menos de 32 px de hueco lleva de radio el de fuera menos el hueco (si sale más de 2 px).
- Un `z-index` nuevo sale de la escala `--z-*` de `global.css`; una transición, de `--transicion` o `--curva`.
- Los mensajes del sistema (avisos, errores del formulario) son tranquilos y concretos: qué ha pasado y qué hacer, sin
  exclamaciones. Las palabras de relleno («revolucionar», «de vanguardia»…) las rechaza `src/i18n/relleno.test.ts`.

## Ganchos y scripts

Retro del 2026-10-21: las dos revisiones del flujo traído de Tarkor hallaron 29 fallos en los ganchos. Desde el
2026-10-22 los ganchos y scripts son los de Galivelop-workflow (`.githooks/`, `.claude/gw/scripts/`): no se editan
aquí, se proponen en el repo del flujo; lo del portal es su configuración (`.claude/gw.json`) y su test.

- La raíz del repo se saca de la ruta del script (`$(dirname "$0")`), no de `$CLAUDE_PROJECT_DIR` ni del directorio
  actual: en la nube la sesión puede arrancar en `/home/user`.
- Un gancho de subida comprueba el commit que se sube, no la carpeta de trabajo, y falla cerrado cuando le falta un
  dato (un commit que no tiene, una API que no responde).
- Los scripts de shell corren en bash 3.2 (macOS): nada de `mapfile` ni arrays asociativos.
- Una carpeta con nombre fijo en un directorio compartido (`$TMPDIR`, `/tmp`) es por usuario, se crea con permisos 700
  y se rechaza si ya existe como symlink o de otro usuario; los archivos sueltos, con `mktemp`.
- Lo traído de otro repo se adapta a cómo trabaja el portal: aquí se sube directo a `main`, no por PR, y la marca de
  revisión va en el repo (`docs/registros/revisado.txt`) para que la vea la tarea semanal. Se comprueba contra los
  contratos de **este** repo (rutas, formatos, claves de configuración), no contra los del original.
- Un cambio en `.claude/gw.json` (sobre todo `content`, `check` o `reviewMark`) o en `.githooks/` lleva su caso en
  `tools/qa/tests/test-ganchos.sh`: `content` decide qué puede publicar sola la tarea semanal.
