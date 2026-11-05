# Retro: skill gw-seo, «Avance» de las fichas e Image Generator (2026-11-05)

**Estado:** aprobada entera por la persona (2026-11-05, «Apruebo todo») y aplicada: R1, R2 y T2 en la rama; T1 apuntada para
la persona; `gw-seo` queda para Galivelop-workflow.

Lo revisado: los commits de `ccr-83ea043c-r1gbyp` que van a `main` (desde `941d3ce`: skill `gw-seo`, títulos y
descripciones, arreglos de la revisión, «Avance» de las cuatro fichas y la ficha entera de Image Generator) y la
sesión medida con `gw-opt-tokens` (`measure.py --since 941d3ce`).

## Medida (`gw-opt-tokens`)

- 79 llamadas, contexto medio de **279k** (techo 386k), sin compactación. Siete subagentes Sonnet con un arranque de
  unos 77k cada uno, de 7 a 18 llamadas: proporcionado para leer un repo entero y devolver un resumen.
- La sesión se abrió en `/home/user` (cuatro repos) y arrastra lo de antes del `/clear`; sin el tope de compactación,
  el contexto no baja. Es casi todo el gasto, igual que en las retros del 31-10 y del 02-11.

## Propuestas

| # | Qué | Dónde | Destino |
|---|---|---|---|
| T1 | Abrir las sesiones del portal desde la carpeta del repo, en un entorno solo con el portal, y `CLAUDE_CODE_AUTO_COMPACT_WINDOW=200000` en el entorno de la nube. Ya estaba pedido; sigue siendo lo que más cuesta (279k de media frente al umbral de 150k). | Lo hace la persona al crear el entorno | Portal |
| T2 | `tools/fichas/bloque.py <ficha> <campo> <json>`: cambia un campo de primer nivel de una ficha y deja el resto del archivo igual, con su test. Esta sesión gastó unas 8 llamadas en reescribir JSON (un volcado desplegó arrays de una línea y hubo que deshacerlo). Lo usarían también `gw-portal` y la tarea semanal. Riesgo: ninguno (el test compara el archivo antes y después). | `tools/fichas/`, `docs/desarrollo.md` | Portal |
| R1 | El «Avance» de las cuatro fichas se había separado de sus roadmaps porque `gw-portal` solo mira la cabecera de la bitácora. Añadir a cada repo de `fuentes.json` la ruta de su roadmap (Tarkor `docs/producto/21-roadmap.md`; flujo `docs/plan.md` §9; Image Generator `docs/plan.md`, tabla «Fases»; toVeriAI `docs/producto/21-roadmap.md`) y, en `proyectos.md`, que los hitos se comparen con esa tabla cada semana. Riesgo: más lectura el domingo; se limita a la tabla de fases. | `.claude/skills/gw-portal/fuentes.json` y `proyectos.md` | Portal |
| R2 | `tools/qa/tests/test-ganchos.sh` decide qué skills son del flujo por el `version:` de su `SKILL.md`; una skill nacida aquí con versión pierde sus tests en silencio (le pasó a `gw-seo`, lo vio la revisión). Que se salte solo las skills que lista la tabla de `.claude/skills/README.md` (las del flujo) y avise de una skill con `scripts/test_*.py` que no corre. | `tools/qa/tests/test-ganchos.sh` | Portal |

## For Galivelop-workflow

- **Skill `gw-seo`** (`.claude/skills/gw-seo/`, nacida en el portal): comprueba el SEO de una web estática generada,
  sin red (`scripts/comprobar.py`, solo biblioteca estándar, 47 tests) y deja el criterio a la skill; referencias con
  fuente y fecha, adaptadas en parte de AgriciDaniel/claude-seo (MIT, licencia incluida). Para recogerla con
  `gw-harvest`: le falta la `metadata.version` del flujo (se quitó aquí por R2).
