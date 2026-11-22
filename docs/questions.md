# Questions

Questions for the user, one entry each; `python3 .claude/gw/scripts/questions.py` reads and rewrites this
file (format: header of scripts/questions.py). Answer by number: `questions.py answer "5. a, 6. ok"`.

## Q-1
- Refs:
- Status: open
- Asked: 2026-11-22
- Question: gw-update 0.8.0→0.8.2: ¿aplico apply.py --update (79 archivos del flujo y version/workflowClone/workflowRepository en gw.json)?
- Recommendation: sí

## Q-2
- Refs:
- Status: open
- Asked: 2026-11-22
- Question: AGENTS.md: ¿traigo las dos líneas nuevas de la plantilla (Findings:/Retries: en el último párrafo con los trailers; no hacer un commit solo para el ledger de métricas)?
- Recommendation: sí, las dos

## Q-3
- Refs:
- Status: open
- Asked: 2026-11-22
- Question: REVIEW.md: ¿añado el criterio «el código que lee lo que escribe un agente o una persona lleva un test con una muestra real»?
- Recommendation: sí

## Q-4
- Refs:
- Status: open
- Asked: 2026-11-22
- Question: .github/workflows/check.yml (del portal): ¿añado paths-ignore del ledger para que un push que solo lo toca no arranque el CI?
- Recommendation: sí

## Q-5
- Refs:
- Status: open
- Asked: 2026-11-22
- Question: workflowClone: ¿dejo el valor por defecto ../Galivelop-workflow (tu clon local) aunque en la nube esté en ../zeldris/galivelop-workflow?
- Recommendation: dejar ../Galivelop-workflow

## Q-6
- Refs:
- Status: open
- Asked: 2026-11-22
- Question: Avisos de nombres viejos (41 usos, los mismos archivos de siempre): ¿los silencio con legacyNamesSkip o se quedan como hasta ahora?
- Recommendation: dejarlos como hasta ahora
