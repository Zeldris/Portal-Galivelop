# Questions

Questions for the user, one entry each; `python3 .claude/gw/scripts/questions.py` reads and rewrites this
file (format: header of scripts/questions.py). Answer by number: `questions.py answer "5. a, 6. ok"`.

## Q-1
- Refs:
- Status: answered
- Asked: 2026-11-22
- Question: gw-update 0.8.0→0.8.2: ¿aplico apply.py --update (79 archivos del flujo y version/workflowClone/workflowRepository en gw.json)?
- Recommendation: sí
- Answer: sí
- Answered: 2026-11-22

## Q-2
- Refs:
- Status: answered
- Asked: 2026-11-22
- Question: AGENTS.md: ¿traigo las dos líneas nuevas de la plantilla (Findings:/Retries: en el último párrafo con los trailers; no hacer un commit solo para el ledger de métricas)?
- Recommendation: sí, las dos
- Answer: sí
- Answered: 2026-11-22

## Q-3
- Refs:
- Status: answered
- Asked: 2026-11-22
- Question: REVIEW.md: ¿añado el criterio «el código que lee lo que escribe un agente o una persona lleva un test con una muestra real»?
- Recommendation: sí
- Answer: sí
- Answered: 2026-11-22

## Q-4
- Refs:
- Status: answered
- Asked: 2026-11-22
- Question: .github/workflows/check.yml (del portal): ¿añado paths-ignore del ledger para que un push que solo lo toca no arranque el CI?
- Recommendation: sí
- Answer: sí
- Answered: 2026-11-22

## Q-5
- Refs:
- Status: answered
- Asked: 2026-11-22
- Question: workflowClone: ¿dejo el valor por defecto ../Galivelop-workflow (tu clon local) aunque en la nube esté en ../zeldris/galivelop-workflow?
- Recommendation: dejar ../Galivelop-workflow
- Answer: dejar ../Galivelop-workflow
- Answered: 2026-11-22

## Q-6
- Refs:
- Status: answered
- Asked: 2026-11-22
- Question: Avisos de nombres viejos (41 usos, los mismos archivos de siempre): ¿los silencio con legacyNamesSkip o se quedan como hasta ahora?
- Recommendation: dejarlos como hasta ahora
- Answer: dejarlos como hasta ahora
- Answered: 2026-11-22

## Q-7
- Refs:
- Status: answered
- Asked: 2026-11-24
- Question: Escala de espaciado (margin, padding, gap; ~700 valores en global.css): a) de 2 en 2 px hasta 20 y luego 24, 28, 32, 40, 48, 56, 72 (–espacio-1…); solo se mueven los raros (3, 5, 7, 9, 11, 22, 26, 30, 36, 44, 60 px; ~50 usos, 1-2 px), casi sin cambio visible; b) retícula de 4 px (4, 8, 12, 16, 20, 24, 32, 40, 48, 64): más ordenada, pero ~300 usos (6, 10, 14, 18 px) se mueven 2 px y cambian las capturas
- Recommendation: a) escala de 2 en 2 px
- Answer: a
- Answered: 2026-11-24

## Q-8
- Refs:
- Status: answered
- Asked: 2026-11-24
- Question: Espaciados fluidos (clamp(40px, 6vw, 64px) y unos 15 parecidos, en cabeceras de sección y hero): ¿tokens con nombre por papel o se dejan fuera de Stylelint?
- Recommendation: fichas con nombre por papel (--espacio-seccion, --espacio-bloque…), una por cada clamp distinto que se repita; los sueltos, al más parecido
- Answer: ok
- Answered: 2026-11-24

## Q-9
- Refs:
- Status: answered
- Asked: 2026-11-24
- Question: Escala de letra (~45 tamaños rem distintos, 0.6-2.25rem): a) 11 pasos 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1, 1.1, 1.25, 1.5, 2rem, redondeando al más cercano (0.92→0.9, 0.88→0.9, 1.15→1.1, 1.35→1.25…), más los títulos fluidos del hero y de h1/h2 como tokens con nombre; b) mantener cada tamaño actual como token (sin cambio visible, escala de ~45 pasos que no ordena nada)
- Recommendation: a) 11 pasos y títulos fluidos con nombre
- Answer: a
- Answered: 2026-11-24

## Q-10
- Refs:
- Status: answered
- Asked: 2026-11-24
- Question: ¿Te enseño capturas antes/después (inicio, /productos, una ficha; móvil y escritorio) antes de subir el cambio?
- Recommendation: sí, capturas antes/después antes de subir
- Answer: ok
- Answered: 2026-11-24
