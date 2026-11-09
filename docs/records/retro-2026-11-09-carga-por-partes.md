# Retro 2026-11-09: carga por partes, enlaces con barra, formas y rejillas

**Estado:** aprobada entera por la persona (2026-11-09, «Apruebo todo») y aplicada: T-a, T-b, T-c, R1 y R2 en la rama; R3 queda abajo para el workflow.

Revisado: lo que entra en `main` desde `bee9330` (enlaces con barra final, formas rectas y rejillas de 12
subcolumnas, carga por partes con `lazy` y fichas bajo demanda, arreglos de la fase 1) y la bitácora.

## Gasto (gw-opt-tokens)

Medido con `measure.py --since bee9330`: contexto medio de la sesión principal ~130k, techo ~160k; la bitácora
leída 10 veces (385k arrastrados; un solo `sed` sobre ella, 277k); arranque medio de subagente ~68k.

- **T-a. Recortar «Pendiente» de la bitácora** (proyecto). El párrafo de «Identidad visual propia» ya está en `main`:
  se condensa a dos líneas con enlace a `docs/marca.md` y a la retro del 2026-11-08. Ahorro: ~5k por lectura de la
  bitácora (×10 en esta sesión). Riesgo: perder un detalle; el texto completo queda en `git log` y en la retro.
- **T-b. Los subagentes no escriben `docs/handoff.md`** (proyecto, en los encargos de `gw-orchestrate-dealer` vía
  `.claude/gw/gw-opt-tokens.md`): devuelven el texto y la sesión principal lo apunta. Evita los conflictos de fusión
  de la bitácora (esta sesión: 5,6k de resolución, 90k arrastrados). Riesgo: ninguno.
- **T-c. Arreglo pequeño, en la sesión principal** (proyecto, nota en `.claude/gw/gw-opt-tokens.md`): un subagente
  arranca con ~68k; un arreglo de menos de ~20 líneas con el contexto ya cargado sale más barato en la principal.
  Riesgo: más contexto en la principal; se limita a arreglos cerrados.
- Sigue pendiente de la persona T1 de la retro anterior (`CLAUDE_CODE_AUTO_COMPACT_WINDOW=200000`).

## Retro

- **R1. Comprobación del mosaico móvil** (proyecto, comprobación): la fase 1 encontró que `.mosaico` caía a una
  columna en móvil tras pasar las rejillas a 12 subcolumnas. Propuesta: que `npm run medir` (o un test de
  Playwright en el build) cuente columnas por fila en 390 px y 1280 px para mosaico, cifras y galería.
- **R2. Documentar la carga por partes en `docs/desarrollo.md`** (proyecto, navegación): `src/paginas.ts`
  (`lazy`, `precargarRuta`), `ErrorBoundary`, `useFicha` y cómo se añade un campo a `CAMPOS_RESUMEN` en
  `tools/vite/resumenes.ts` (si no, la portada no lo ve).
- **R3. Conflictos de la bitácora al fusionar ramas de subagentes** (general): ver abajo.

## For Galivelop-workflow

- `merge-branch.sh` debería avisar de un conflicto en el archivo de `log` y proponer quedarse con la versión de la
  rama principal; y la plantilla de encargo de `gw-orchestrate-dealer`, decir «no toques la bitácora: devuelve el
  texto para ella».
