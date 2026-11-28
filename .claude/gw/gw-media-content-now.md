# Notas del portal para gw-media-content-now

Se leen antes que la skill. Valen para toda pieza (LinkedIn, X, web) y para las entradas del diario.

- **Qué se cuenta:** lo nuevo del proyecto, para quien lo usa. Las normas de «Lo que no se escribe» de
  [`docs/desarrollo.md`](../../docs/desarrollo.md#diario-del-taller) valen también aquí: el texto no habla de sí mismo
  (qué es inventado, por qué se eligió una imagen o una palabra, qué se deja fuera, avisos sobre el propio texto).
- **Tono no es formato** (la persona, 2026-11-28): «el tono del diario» es cómo nos dirigimos a la gente (tutear, en
  llano, honesto, sin vender), no su estructura. Cada canal conserva su formato: en LinkedIn, gancho, un bloque por
  proyecto con su ficha y su código público, una pregunta final y etiquetas.
- **Antes de dar una pieza por buena**, se relee cada frase con una pregunta: ¿la diría en voz alta la persona que
  firma a un desconocido? Si no, se quita.
- **El check lo comprueba:** `src/data/metatexto.test.ts` recorre los `.md` de canal de cada pieza (no `sheet.md`)
  con la lista de `src/data/metatexto.ts`; si se cuela una frase nueva, se añade a la lista.
