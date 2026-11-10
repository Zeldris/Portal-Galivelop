import novedadesFichas from 'virtual:proyectos-novedades';
import { publicaciones } from './muro';
import type { Publicacion, Texto } from './tipos';

/** Una novedad de una ficha, con el proyecto al que pertenece (sale de `novedades` de src/data/proyectos/<slug>.json). */
export interface NovedadDeProyecto {
  proyecto: string;
  fecha: string;
  texto: Texto;
}

/** Lo que enseña /novedades: las novedades de las fichas y las publicaciones del muro, juntas. */
export type Entrada =
  | ({ tipo: 'novedad' } & NovedadDeProyecto)
  | { tipo: 'publicacion'; proyecto: string; fecha: string; publicacion: Publicacion };

/**
 * Novedades y publicaciones, la más reciente primero; el mismo día, las publicaciones antes (en su orden) y las
 * novedades por proyecto (en el orden de su ficha). La página estática (scripts/paginas-estaticas.mjs) ordena igual.
 */
export function juntarNovedades(novedades: NovedadDeProyecto[], posts: Publicacion[]): Entrada[] {
  const todas: Entrada[] = [
    ...posts.map((p) => ({
      tipo: 'publicacion' as const,
      proyecto: p.proyecto,
      fecha: p.fecha,
      publicacion: p,
    })),
    ...novedades.map((n) => ({ tipo: 'novedad' as const, ...n })),
  ];
  // sort es estable: lo que empata se queda en el orden de la lista de arriba.
  const muro = (e: Entrada) => (e.tipo === 'publicacion' ? 1 : 0);
  return todas.sort(
    (a, b) =>
      b.fecha.localeCompare(a.fecha) ||
      muro(b) - muro(a) ||
      (a.tipo === 'novedad' && a.proyecto !== b.proyecto ? (a.proyecto < b.proyecto ? -1 : 1) : 0),
  );
}

export const entradas: Entrada[] = juntarNovedades(novedadesFichas, publicaciones);
