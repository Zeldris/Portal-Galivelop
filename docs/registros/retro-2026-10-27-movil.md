# Retro de la ronda de pruebas de front en móvil (2026-10-27)

**Estado:** presentada a la persona y aprobada entera; aplicadas P1 y P2; G1 decidida para el flujo.

Lo revisado: los commits de la rama `ccr-47f8fddd-o5ek6p` desde `305f3cf` (barrido con Playwright a 320-1280 px,
arreglos de la ronda y los de la fase 1) y la bitácora. Medida con `opt-tokens` (`medir.py --since 305f3cf`): 243
llamadas, 121k de contexto medio (suelo 102k, techo 142k), 8 compactaciones; Bash 197 llamadas y 1,31M arrastrados,
Read 43 (39 imágenes) y 912k; `docs/traspaso.md` leído 20 veces (400k) y `global.css` 45 (242k); una captura releída
4 veces; un subagente general en el modelo grande, 2,38M de entrada. La sesión entera: 1.337 llamadas, 50
compactaciones. Una ronda de `/code-review --max-findings all`: 9 hallazgos.

## P1 · `npm run medir` mide el móvil estrecho (portal, aplicada)

La ronda se hizo con capturas y con sondas de Playwright escritas a mano cada vez; el corte del mosaico se dio por
bueno a 360 px y no lo era. `tools/qa/medir-paginas.cjs` mide ahora el móvil a 390, 360 y 320 px y añade dos columnas:
`cortes` (la caja más interna cuyo texto se sale, sin contar las que desplazan ni las de `text-overflow: ellipsis`) y
`tactiles` (controles por debajo de 24×24 px, el mínimo de WCAG 2.5.8, con la zona del `::after` sumada; los campos se
miden por su `label`). Falla con salida 1 si hay alguno. En su primera pasada encontró dos fallos que el barrido no
vio, ya arreglados en `global.css`: los botones de idioma de la cabecera tenían 28 px de alto (ahora la misma zona
de ~44 px que los enlaces sueltos) y el mosaico de dos columnas cortaba «configuración» a 360 px (pasa a una columna
por debajo de 380 px, `23.6875em`). Comprobado en rojo: sin cada arreglo, el script los marca y sale con 1.

## P2 · Capturas y git, en `opt-tokens.md` (portal, aplicada)

Dos notas en `.claude/gw/opt-tokens.md`: lo que se saca de una captura se escribe en texto y la captura no se vuelve
a abrir (una se leyó 4 veces); git con salida corta (`git status --short`, `git log --oneline -N`; un `branch -a` con
su log entró con 6k). También la nueva medida de referencia y lo que mide ahora `npm run medir`.

## For Galivelop-workflow

### G1 · Aviso al lanzar un subagente sin `model`

La regla «subagentes con plan cerrado, en el modelo barato» está escrita en `opt-tokens.md` desde el 2026-10-25 y se
ha roto dos veces: en esta ronda un subagente general heredó el modelo grande y gastó 2,38M de entrada en trabajo
mecánico. Una regla escrita que se sigue rompiendo pide una comprobación: un gancho `PreToolUse` sobre `Agent` que
avise (sin bloquear) cuando falta `model`, con el recordatorio de `selector`. Va al flujo porque sirve a cualquier
proyecto; aquí no se toca `.claude/settings.json` ni los scripts copiados del flujo.
