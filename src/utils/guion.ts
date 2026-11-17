/** Datos mínimos de un guion de lectura (src/data/guiones/<clave>.json) que usa el lector. */
export interface Guion {
  audio?: string[];
  pagina: string;
  trozos: Trozo[];
}

/** Un trozo del guion: la sección que lee, su texto en castellano y, si es alto, los elementos que va recorriendo. */
export interface Trozo {
  seccion: string;
  es: string;
  enfoques?: Enfoque[];
}

/** Cuando el texto llega a `frase` (literal, dentro del `es` del trozo), la vista se centra en `ver` (`id` o `data-guion`). */
export interface Enfoque {
  frase: string;
  ver: string;
}

/** Margen (fracción del audio) con el que el enfoque se adelanta a la frase, para que el scroll llegue a tiempo. */
export const ADELANTO_ENFOQUE = 0.015;

/** Fracción (0 a 1) del texto en que empieza la frase; -1 si no está. Las voces van a ritmo casi constante: vale como tiempo. */
export function posicionDeFrase(es: string, frase: string): number {
  const i = es.indexOf(frase);
  return i < 0 || es.length === 0 ? -1 : i / es.length;
}

/** El enfoque que toca con `fraccion` (0 a 1) del audio reproducida: el último cuya frase ya se ha alcanzado; `null` si ninguno. */
export function enfoqueEn(
  es: string,
  enfoques: Enfoque[] | undefined,
  fraccion: number,
  adelanto = ADELANTO_ENFOQUE,
): Enfoque | null {
  let elegido: Enfoque | null = null;
  let mejor = -1;
  for (const e of enfoques ?? []) {
    const pos = posicionDeFrase(es, e.frase);
    if (pos >= 0 && pos - adelanto <= fraccion && pos >= mejor) {
      elegido = e;
      mejor = pos;
    }
  }
  return elegido;
}

/** Clave del guion de una ruta (la de `pathname` del router, sin prefijo de idioma): `/` es `inicio`; el resto, su último tramo. */
export function claveDeGuion(pathname: string): string {
  const tramos = pathname.split('/').filter(Boolean);
  return tramos.length === 0 ? 'inicio' : tramos[tramos.length - 1];
}

/** Ruta del MP3 de un trozo (`nn` desde 01), bajo la base de la web. */
export function rutaAudio(base: string, idioma: string, clave: string, i: number, seccion: string) {
  return `${base}audio/${idioma}/${clave}/${String(i + 1).padStart(2, '0')}-${seccion}.mp3`;
}

/** El elemento de una sección del guion: por `id` y, si no tiene, por `data-guion`. */
export function buscarSeccion(seccion: string, raiz: ParentNode = document): HTMLElement | null {
  const id = raiz instanceof Document ? raiz.getElementById(seccion) : null;
  return id ?? raiz.querySelector<HTMLElement>(`[data-guion="${CSS.escape(seccion)}"]`);
}
