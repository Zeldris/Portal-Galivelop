# Retro 2026-11-25 — auditoría de marca, front 0.9.0 y escala de tokens a `main`

**Estado:** aprobada por la persona el 2026-11-25 («Apruebo todo», Q-23 a Q-28); T1, T2, T3, R1 y R2 aplicadas en
`ccr-1c3b5b63-tdttd6`; R3 decidida, se aplica tras la subida a `main`.

Lo revisado: `origin/main..HEAD` (48 commits desde e2c9b9b: herramientas de front del flujo 0.9.0, escala de tokens
de espaciado y letra, «Ver producto» como botón, auditoría de marca D1-D13, guiones G1, G3-G12 y G14) y la bitácora.
Medida (`gw-opt-tokens`, desde e2c9b9b): 254 llamadas, contexto medio 119k (techo 165k), 2 compactaciones con
presupuesto 1, arranque fijo ~86k por llamada (73 % de la entrada); 7 subagentes, 5,7M de entrada.

## Gasto de tokens

- **T1** (aplicada): `pending.md` se leyó 22 veces (1,1M arrastrados) y la bitácora 36 (787k); la entrada de la
  auditoría era una línea de ~2k caracteres. Partida en sub-viñetas; nota en `.claude/gw/gw-opt-tokens.md`.
- **T2** (aplicada): figuras claro y oscuro abiertas tres veces (~380k). `tools/qa/hoja-figura.py` las junta en una
  imagen.
- **T3** (aplicada): el arranque fijo no baja en la nube (Q-22); apuntado como coste conocido.

## Proyecto

- **R1** (aplicada, código): el arreglo 3337edb puso `outline-offset: -4px` en `.producto-copiar` «como en `.boton`»,
  que usa −6 px, y la revisión del arreglo no lo vio. Es mecánico: tokens `--foco-*` (`front/tokens.json` y `:root`)
  y `outline-offset` en `front.stylelint.spacingProperties`; `red-without-fix.sh` con `front.py run fast` sale en rojo
  sin el arreglo de `global.css`.
- **R2** (aplicada): barrido de los 5 leves de `global.css` en `docs/records/pending.md`, para la próxima versión.
- **R3** (decidida): `claude/galivelop-dev-portal-1h89ci`, la rama de la tarea semanal, estaba parada desde el
  2026-11-15 y 57 commits por detrás de `main`; tras subir, merge de `main` en ella (permiso de la persona).

## For Galivelop-workflow

- **Trailer `Findings:` en un párrafo aparte no cuenta y no avisa**: 8ee884e lo llevaba separado de `Siguiente:` por
  una línea en blanco; `commit-msg` lo aceptó y `change-size` siguió diciendo que el bloque no estaba cerrado. Que
  `commit-msg` rechace un `Findings:`/`Retries:` fuera del último párrafo, con el mismo mensaje que para uno suelto.
- **La rama que publica una tarea programada se queda vieja**: `recover.py --state` lista las ramas con trabajo fuera
  de `main`, pero no avisa cuando la rama de publicación (la de la bitácora) va por detrás de `main`. Un aviso ahí.
