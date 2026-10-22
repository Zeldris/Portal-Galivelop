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

## Móvil y accesibilidad

- Nada desborda en horizontal a 320-390 px, ni con el texto agrandado (cortes en `em` en la cabecera).
- Los botones solo con icono llevan `aria-label`; lo que se mueve solo (la galería) se puede pausar y respeta
  «reducir movimiento».

## Ganchos y scripts

Retro del 2026-10-21: las dos revisiones del flujo traído de Tarkor hallaron 29 fallos en los ganchos. Desde el
2026-10-22 los ganchos y scripts son los de Galivelop-workflow (`.githooks/`, `.claude/gw/scripts/`): no se editan
aquí, se proponen en el repo del flujo; lo del portal es su configuración (`.claude/gw.json`) y su test.

- La raíz del repo se saca de la ruta del script (`$(dirname "$0")`), no de `$CLAUDE_PROJECT_DIR` ni del directorio
  actual: en la nube la sesión puede arrancar en `/home/user`.
- Un gancho de subida comprueba el commit que se sube, no la carpeta de trabajo, y falla cerrado cuando le falta un
  dato (un commit que no tiene, una API que no responde).
- Los scripts de shell corren en bash 3.2 (macOS): nada de `mapfile` ni arrays asociativos.
- Lo traído de otro repo se adapta a cómo trabaja el portal: aquí se sube directo a `main`, no por PR, y la marca de
  revisión va en el repo (`docs/registros/revisado.txt`) para que la vea la tarea semanal. Se comprueba contra los
  contratos de **este** repo (rutas, formatos, claves de configuración), no contra los del original.
- Un cambio en `.claude/gw.json` (sobre todo `content`, `check` o `reviewMark`) o en `.githooks/` lleva su caso en
  `tools/qa/tests/test-ganchos.sh`: `content` decide qué puede publicar sola la tarea semanal.
