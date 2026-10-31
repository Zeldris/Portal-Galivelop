import type { Texto } from './tipos';

// Textos legales del portal (aviso legal, privacidad y términos). Cada uno vive en src/data/legal/<slug>.json y tiene
// su página en /<slug>; el pie los enlaza todos.

/** Una fila «dato: valor» (titular, correo…); con `enlace`, el valor es un enlace. */
export interface DatoLegal {
  etiqueta: Texto;
  valor: Texto;
  enlace?: string;
}

export interface EnlaceLegal {
  etiqueta: Texto;
  url: string;
}

/** Una sección: párrafos, filas de datos, lista y enlaces, en ese orden; las vacías no se pintan. */
export interface SeccionLegal {
  titulo: Texto;
  parrafos?: Texto[];
  datos?: DatoLegal[];
  lista?: Texto[];
  enlaces?: EnlaceLegal[];
}

export interface DocumentoLegal {
  /** También es su ruta: /aviso-legal, /privacidad, /terminos. */
  slug: string;
  /** Orden en el pie: el menor, primero. */
  orden: number;
  /** Fecha de la última versión (AAAA-MM-DD). */
  actualizado: string;
  titulo: Texto;
  secciones: SeccionLegal[];
}

const modulos = import.meta.glob<{ default: DocumentoLegal }>('./legal/*.json', { eager: true });

export const documentosLegales: DocumentoLegal[] = Object.values(modulos)
  .map((m) => m.default)
  .sort((a, b) => a.orden - b.orden);

export function buscarLegal(slug: string): DocumentoLegal | undefined {
  return documentosLegales.find((d) => d.slug === slug);
}
