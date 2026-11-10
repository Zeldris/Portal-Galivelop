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

/** Novedades y publicaciones, la más reciente primero; el mismo día, las publicaciones antes y, si no, el orden de origen. */
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
  // sort es estable: a igual fecha se mantiene el orden de la lista de arriba.
  return todas.sort((a, b) => b.fecha.localeCompare(a.fecha));
}

export const entradas: Entrada[] = juntarNovedades(novedadesFichas, publicaciones);
