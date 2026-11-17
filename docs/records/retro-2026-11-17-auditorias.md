# Retro: auditorías del 2026-11-17 y sus arreglos (2026-11-17)

**Estado:** pendiente de la persona.

Lo revisado: los 18 commits de `ccr-8e0862c2-niq1xt` que no están en `main` (af4f431..221c6c1: cuatro auditorías
como scripts, informe, chaflán, impresión, «Ver perfil», cabecera y pie estáticos, JS inicial 538 → 183 kB, vite
8.3.8, fase 1 con 8 arreglos en 0caa5b7). Gasto medido con `measure.py` (sesión anterior, últimas 24 h): sesión
principal 168 llamadas, contexto medio 124k (suelo 98k, techo 163k, 1 compactación); 10 subagentes con 18,3M de
entrada; en total 39M de entrada.

## Propuestas

- **P1 (flujo) — partir el encargo de un subagente cuando trae varios arreglos independientes.** El subagente
  «Arreglos de rendimiento y HTML» (`gw-worker`, sonnet) hizo 73 llamadas con 102k de contexto medio: 7,5M de
  entrada, el 41 % de todos los subagentes, para cuatro arreglos sin relación entre sí (cabecera y pie estáticos,
  trozos de JS, precarga de fuentes, vite). Partido en un subagente por arreglo, cada uno pagaría ~19k de arranque y
  no arrastraría el contexto de los otros (~30-40k medio en vez de 102k): ahorro estimado ~4M. Lo cambia
  `gw-orchestrate-dealer` (un encargo por arreglo cuando son independientes y pasan de tres), no `AGENTS.md`.
  Riesgo: dos arreglos que tocan el mismo archivo chocan al fusionar; contrapeso, `merge-branch.sh` corre el check.
- **P2 (proyecto) — quitar la cifra de entradas de la línea de «Pendiente» de la bitácora.** `docs/handoff.md` se
  leyó 28 veces y `docs/records/pending.md` 20 (~520k arrastrados entre las dos), y hubo un commit solo para poner
  el contador a 23 (221c6c1). La línea queda «Lo pendiente está en `docs/records/pending.md`»; quien quiera la cifra
  la cuenta con `grep -c '^- ' docs/records/pending.md`. Ahorro: un commit y una lectura de `pending.md` por cambio.
  Riesgo: ninguno.
- **P3 (proyecto) — barrido de leves de `scripts/paginas-estaticas.mjs`.** Es el script con más leves abiertas
  (tres, las tres de este bloque): `leerIcono` saca el SVG de los iconos con una regex frágil; la tabla ruta → trozo
  copia `PAGINA_DE_PRIMER_SEGMENTO` de `src/paginas.ts` (una página nueva perdería su `modulepreload` sin aviso);
  el build importa `.ts` en Node y exige Node ≥ 22.18. Tarea para después de esta subida (el proyecto no tiene plan
  con ids `B`: va a `pending.md` como una entrada): un test que compare la tabla con `PAGINA_DE_PRIMER_SEGMENTO`
  (o sacarla de ahí), `leerIcono` que falle si el resultado no empieza por `<svg`, y la versión de Node en
  `engines`. Riesgo: tocar el generador afecta a todas las páginas estáticas; contrapeso, `npm run seo` igual antes y
  después y la fase 1 de ese cambio.

Observación sin propuesta: la sesión encadenó `/gw-update` (subido a `main` el 2026-11-16) y las auditorías sin
`/clear` (las lecturas más pesadas, ~1,1M arrastrados, son del flujo). `AGENTS.md` ya pide el `/clear` al cerrar
cada tarea; no hace falta otra regla.

## For Galivelop-workflow

- `gw-orchestrate-dealer`: cuando un lote trae más de tres arreglos independientes, un encargo por arreglo (P1;
  medido: un `gw-worker` con cuatro arreglos, 73 llamadas y 102k de contexto medio, 7,5M de entrada).
