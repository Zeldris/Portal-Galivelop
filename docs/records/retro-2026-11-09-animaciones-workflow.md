# Retro 2026-11-09: animaciones paso a paso del workflow

**Estado:** pendiente de la persona.

Revisado: lo que entra en `main` desde `b142031` (componente `AnimacionFlujo` y sus guiones, ficha es/gl/en, galería
de 7 a 3, prerender como `<ol>`, tests de la costura, arreglos de la fase 1, falso positivo de `npm run medir`) y la
bitácora.

## Gasto (gw-opt-tokens)

Medido con `measure.py --since b142031`: 197 llamadas y 24M de entrada en total. Sesión principal: 40 llamadas,
contexto medio 135k, techo 161k. Subagentes: arranque ~69k cada uno; el de implementación fue en el modelo grande
(116 llamadas, 122k de media, **14,2M de entrada, ~60 % del gasto**); la revisión (fork) 3,1M; los de Sonnet, 1,07M y
0,28M.

- **T-a. Partir la implementación de un componente con storyboard aprobado** (proyecto, nota en
  `.claude/gw/gw-opt-tokens.md` y fila en `selector.cases`): datos, textos es/gl/en, JSON de la ficha, prerender y
  documentación van a un subagente del modelo barato con plan cerrado; solo la lógica del componente (estado,
  temporización, accesibilidad, medida del contenedor) va al grande. La regla del modelo barato con plan cerrado ya
  existía, pero el encargo fue uno solo y entero al grande. Ahorro estimado: 5-7M de los 14,2M. Riesgo: la costura
  entre las dos partes; contrapeso: los tests de costura guion/ficha que ya existen.
- **T-b. Documentos de diseño por secciones** (proyecto, nota en `.claude/gw/gw-opt-tokens.md`): el storyboard se leyó
  entero con `cat` en la sesión principal (6,6k que se arrastraron 245k). Se lee con `grep -n` de los encabezados y
  `sed -n` de la sección, o lo lee el subagente que lo necesita. Riesgo: ninguno.
- **T-c. Capturas solo para juicio visual** (proyecto, nota en `.claude/gw/gw-opt-tokens.md`): tres imágenes en la
  principal (~38k cada una, arrastradas) y muchas en el subagente servían para saber si un rótulo se cortaba, que ya
  dicen `npm run medir` y el test de encaje. Para mirar varias, `npm run capturas` y la hoja de contactos. Riesgo:
  perder un defecto visual; contrapeso: una captura final por pantalla, no por intento.
- Sigue pendiente de la persona T1 de retros anteriores (`CLAUDE_CODE_AUTO_COMPACT_WINDOW=200000`).

## Retro

- **R1. `npm run medir` daba por cortado el texto de un SVG** (proyecto, comprobación): ya arreglado en esta rama
  (e23496c); el encaje de rótulos lo cuida `animaciones.test.ts`. Solo se apunta.
- **R2. Los tres leves de la fase 1** (proyecto): `reducido()` repetido en tres componentes, el test de encaje no mira
  solapes ni alto, y el formato de `Siguiente:` en commits ya subidos. Quedan en «Pendiente» de la bitácora; se
  propone sacar `reducido()` a un util en la próxima tarea de código.
- **R3. `commit-msg` no avisó del formato de `Siguiente:`** (general): ver abajo.

## For Galivelop-workflow

- El gancho `commit-msg` debería exigir que `Siguiente:` esté en el mismo bloque final que las líneas de atribución
  (sin línea en blanco entre ellas) cuando las hay; hoy acepta los dos párrafos y la revisión lo encontró a mano.
- La plantilla de encargo de `gw-orchestrate-dealer` podría proponer el corte «datos y textos al barato, lógica al
  grande» cuando el trabajo es un componente nuevo con su diseño ya aprobado.
