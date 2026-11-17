/** Datos mínimos de un guion de lectura (src/data/guiones/<clave>.json) que usa el lector. */
export interface Guion {
  audio?: string[];
  pagina: string;
  trozos: { seccion: string }[];
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
