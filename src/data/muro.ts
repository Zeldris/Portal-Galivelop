import type { Idioma, ImagenPublicacion, Publicacion } from './tipos';

// Cualquier .json de src/data/muro/<proyecto>/ entra solo en el muro; la más reciente, la primera.
const modulos = import.meta.glob<{ default: Publicacion }>('./muro/*/*.json', { eager: true });

export const publicaciones: Publicacion[] = ordenar(Object.values(modulos).map((m) => m.default));

/** Más reciente primero; el mismo día, por orden inverso de pieza (NN-tema más alto primero). */
export function ordenar(lista: Publicacion[]): Publicacion[] {
  return [...lista].sort(
    (a, b) => b.fecha.localeCompare(a.fecha) || b.pieza.localeCompare(a.pieza),
  );
}

export function publicacionesDe(slug: string): Publicacion[] {
  return publicaciones.filter((p) => p.proyecto === slug);
}

/** Id del elemento en la página del muro (ancla de los enlaces desde la ficha). */
export function idPublicacion(p: Publicacion): string {
  return `${p.proyecto}-${p.pieza}`;
}

/** La versión de la imagen para el idioma; sin ella, la de por defecto (castellano). */
export function versionDe(
  imagen: ImagenPublicacion,
  idioma: Idioma,
): { src: string; mini: string } {
  return imagen.porIdioma?.[idioma] ?? { src: imagen.src, mini: imagen.mini };
}
