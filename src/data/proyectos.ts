import type { EstadoHito, Proyecto } from './tipos';

// Cualquier .json de src/data/proyectos/ entra solo en el portal.
const modulos = import.meta.glob<{ default: Proyecto }>('./proyectos/*.json', { eager: true });

export const proyectos: Proyecto[] = Object.values(modulos)
  .map((m) => m.default)
  .sort((a, b) => a.orden - b.orden);

export function buscarProyecto(slug: string | undefined): Proyecto | undefined {
  return proyectos.find((p) => p.slug === slug);
}

const PESO: Record<EstadoHito, number> = { hecho: 1, curso: 0.5, pendiente: 0 };

/** Avance del proyecto (0-100) a partir de sus hitos: hecho cuenta 1, en curso 0,5. */
export function progreso(p: Proyecto): number {
  if (p.hitos.length === 0) return 0;
  const suma = p.hitos.reduce((acc, h) => acc + PESO[h.estado], 0);
  return Math.round((suma / p.hitos.length) * 100);
}

/** Ruta pública de un recurso de public/, respetando la base de Vite. */
export function ruta(src: string): string {
  return import.meta.env.BASE_URL + src.replace(/^\//, '');
}
