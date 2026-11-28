/**
 * Metatexto: frases en las que un texto público habla de sí mismo (qué es inventado o canon, qué se resumió, por qué
 * se eligió una imagen, qué se deja fuera, avisos sobre el propio texto). Norma «Lo que no se escribe» de
 * docs/desarrollo.md (la persona, 2026-11-28). Lo comprueban metatexto.test.ts en el diario y en las piezas de
 * docs/media. Lista ampliable: una expresión por frase que se haya colado, en castellano, gallego e inglés.
 */
export const FRASES_METATEXTO: RegExp[] = [
  // es
  /\bhe resumido\b/i,
  /\b(?:la|lo|las|los) he elegido porque\b/i,
  /\bm[íi]as son solo\b|\bm[íi]o es solo\b/i,
  /\b(?:me lo he inventado|lo invent[ée]|inventad[oa]s? para (?:el|la|este|esta))\b/i,
  /\b(?:es|son) canon\b/i,
  /\bfuera a prop[óo]sito\b/i,
  /\bla imagen de (?:arriba|portada) no es\b/i,
  /\bla parte que m[áa]s me gusta contar\b/i,
  /\bmerece ense[ñn]arse\b/i,
  /\bme gustar[íi]a darte m[áa]s datos\b/i,
  /\bno lo contamos\b/i,
  // gl
  /\bresum[ií]no\b/i,
  /\bescoll[ií]na porque\b/i,
  /\bmi[ñn]as son s[óo]\b/i,
  /\bf[óo]ra [áa] mantenta\b/i,
  /\ba imaxe de (?:arriba|portada) non [ée]\b/i,
  /\bm[áa]is me gusta contar\b/i,
  /\bmerece ensinarse\b/i,
  /\bgustar[íi]ame darche m[áa]is datos\b/i,
  /\bnon o contamos\b/i,
  // en
  /\bI(?: have|'ve)? shortened it\b/i,
  /\bI chose (?:it|this|them) because\b/i,
  /\bonly the wording is mine\b/i,
  /\bmade up for (?:the|this) (?:diary|post|piece)\b/i,
  /\bleft out on purpose\b/i,
  /\bthe image (?:at the top|above) is not\b/i,
  /\bthe part I most like telling\b/i,
  /\bwhich is exactly why it is worth showing\b/i,
  /\bI would like to give you more data\b/i,
];

/** Las frases de metatexto que aparecen en `texto` (vacío si no hay ninguna). */
export function metatexto(texto: string): string[] {
  return FRASES_METATEXTO.flatMap((re) => {
    const m = texto.match(re);
    return m ? [m[0]] : [];
  });
}
