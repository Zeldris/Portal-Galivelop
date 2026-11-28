# Retro 2026-11-28: el metatexto en el diario y las publicaciones

Lo revisado: la pieza de LinkedIn «Saber parar» (`docs/media/2026-11-28/01-saber-parar/`), la limpieza del diario
(070cc3f, en `main`) y el test contra el metatexto (`src/data/metatexto.ts`, `src/data/metatexto.test.ts`).

**Estado:** pendiente: se presenta en la próxima retro, con la fase 2 del siguiente cambio grande.

## Qué pasó

Las entradas del diario y las piezas hablaban de sí mismas: qué era inventado y qué canon, qué se había resumido,
por qué se eligió una imagen y qué no era. Una norma del propio portal lo pedía («la Nota» del relato) y el agente
tiende a justificar sus decisiones dentro del texto. La persona: «una persona no lo escribiría ni se expondría
tanto». Arreglo en el portal: norma «Lo que no se escribe» (`docs/desarrollo.md#diario-del-taller`), notas de la
pieza (`.claude/gw/gw-media-content-now.md`) y un test que bloquea las frases que ya se colaron.

## For Galivelop-workflow

- `gw-media-content-now` (y `gw-media-content` al proponer): un paso fijo «Qué no se escribe» antes de «Check»: el
  texto habla del tema, nunca de sí mismo (ni qué es inventado, canon o resumido; ni por qué se eligió una imagen,
  una palabra o un enfoque, ni qué no es la imagen; ni lo que se deja fuera, ni avisos o disculpas sobre el propio
  texto). Prueba: releer cada frase preguntando si la persona que firma la diría en voz alta a un desconocido.
- `check.py` de `gw-media-content`: una lista ampliable de frases de metatexto por idioma (en `rules.json` o en la
  nota del proyecto), que falle nombrando la frase y el archivo, como hace aquí `src/data/metatexto.test.ts`.
