// Fuente única de cuántas publicaciones hacen falta para que el muro exista (decisión R-2: «ocultar»). La leen el código
// de la web (src/data/muro.ts) y scripts/paginas-estaticas.mjs, que importa este mismo archivo (sin import.meta.glob).
export const UMBRAL_MURO = 3;

/** ¿Hay muro con `n` publicaciones? Por debajo del umbral no hay enlace, ni ruta, ni página estática, ni sitemap, ni llms.txt. */
export function muroVisible(n: number, umbral: number = UMBRAL_MURO): boolean {
  return n >= umbral;
}
