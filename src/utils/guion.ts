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

/**
 * Margen (fracción del audio) con el que el enfoque se adelanta a la frase. A cero: medido con `silencedetect` sobre
 * los MP3 (2026-11-17), el cálculo por posición en el texto ya salta antes de que suene la frase (unos 0,7 s de
 * media), lo justo para el scroll; con 0,015 se adelantaba entre 1 y 2,5 s.
 */
export const ADELANTO_ENFOQUE = 0;

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

const CONTROLES = 'input, textarea, select, button, a, [contenteditable], .lector, .lector-boton';
const PROPIO = '.lector, .lector-boton';
type Objetivo = { closest(selector: string): unknown } | null;

/** ¿Esta tecla, pulsada sobre `objetivo`, es un gesto de scroll de la persona (y no escribir o activar un control)? */
export function teclaPausa(key: string, objetivo: Objetivo): boolean {
  if (!TECLAS_SCROLL.has(key)) return false;
  return !objetivo?.closest(CONTROLES);
}

/** ¿Un gesto de rueda o táctil sobre `objetivo` es scroll de la página (no sobre la barra del lector ni su botón)? */
export function gestoPausa(objetivo: Objetivo): boolean {
  return !objetivo?.closest(PROPIO);
}

const TECLAS_SCROLL = new Set([' ', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End']);

/** Una ruta sin la barra final (salvo `/`), para comparar con la `pagina` del guion. */
export function rutaNormal(ruta: string): string {
  return ruta.length > 1 ? ruta.replace(/\/+$/, '') || '/' : ruta;
}

/** Zona de la ventana que no tapan las barras fijas: de `arriba` a `abajo`, en px desde el borde superior. */
export interface ZonaLibre {
  arriba: number;
  abajo: number;
}

/** Hueco entre el elemento y el borde de la zona libre cuando no cabe y se muestra su inicio. */
const HUECO = 16;

/**
 * Cuánto bajar (o subir, si es negativo) para que un elemento (`top` y `alto` en px de la ventana) se vea en la zona
 * libre: si ya se ve entero, nada (`0`, así no tiembla al pasar de un enfoque a otro que ya está en pantalla); si
 * cabe, centrado en ella; si no cabe, con su inicio justo bajo las barras de arriba.
 */
export function desplazamiento(top: number, alto: number, zona: ZonaLibre): number {
  const libre = zona.abajo - zona.arriba;
  if (alto <= libre) {
    if (top >= zona.arriba && top + alto <= zona.abajo) return 0;
    return Math.round(top - (zona.arriba + (libre - alto) / 2));
  }
  // No cabe: si su inicio ya está en el primer cuarto de la zona, se deja (no tiembla).
  if (top >= zona.arriba && top <= zona.arriba + libre * 0.25) return 0;
  return Math.round(top - (zona.arriba + HUECO));
}
