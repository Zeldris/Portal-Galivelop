import type { Texto } from './tipos';

// Productos de la marca (ADR 0002). Cada uno vive en src/data/productos/<slug>.json. Sin precio: lo legal y lo
// financiero se trata por correo (MARCA.correo). Lo que aún no tiene versión usable se ofrece como «próximamente».

export const ESTADOS_PRODUCTO = ['disponible', 'proximamente'] as const;
export type EstadoProducto = (typeof ESTADOS_PRODUCTO)[number];

export interface Producto {
  slug: string;
  nombre: string;
  /** Orden en el catálogo: el menor, primero. */
  orden: number;
  /** Color de acento (hex). */
  acento: string;
  /** Nombre de un icono de src/components/Icono.tsx. */
  icono: string;
  /** Slug del proyecto del taller con ficha del que nace, si la tiene. */
  proyecto?: string;
  /** Slug de la fila «Próximamente» del inicio, si aún no tiene ficha. */
  proximo?: string;
  estado: EstadoProducto;
  /** Versión que se ofrece; sin ella, el nombre basta. */
  version?: string;
  queOfrece: Texto;
  /** Servicios que acompañan al producto (soporte, implantación…). */
  servicios: Texto[];
  /** Id del miembro responsable (su creador). */
  responsable: string;
  /** Ids de los miembros que colaboran. */
  colaboradores: string[];
}

const modulos = import.meta.glob<{ default: Producto }>('./productos/*.json', { eager: true });

export const productos: Producto[] = Object.values(modulos)
  .map((m) => m.default)
  .sort((a, b) => a.orden - b.orden);

export function buscarProducto(slug: string | undefined): Producto | undefined {
  return productos.find((p) => p.slug === slug);
}
