import type { Texto } from './tipos';

// Productos de la marca (ADR 0002). Cada uno vive en src/data/productos/<slug>.json. Sin precio: lo legal y lo
// financiero se trata por correo (MARCA.correo). Lo que aún no tiene versión usable se ofrece como «próximamente».

export const ESTADOS_PRODUCTO = ['disponible', 'proximamente'] as const;
export type EstadoProducto = (typeof ESTADOS_PRODUCTO)[number];

export interface Producto {
  slug: string;
  nombre: string;
  /** Otro nombre con el que se conoce (ADR 0005: GalivelopCode). */
  alias?: string;
  /** Orden en el perfil del miembro: el menor, primero. */
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
  /** Textos de su página, `/productos/<slug>` (ADR 0005); sin ella, el producto solo sale en el perfil. */
  pagina?: PaginaProducto;
}

/** Imagen con su versión pequeña (720 px), sus medidas y su texto alternativo. */
export interface Imagen {
  src: string;
  mini: string;
  ancho: number;
  alto: number;
  alt: Texto;
}

interface TituloTexto {
  titulo: Texto;
  texto: Texto;
}

/** Lo que cuenta la página de un producto (src/pages/Producto.tsx y `cuerpo()` de scripts/paginas-estaticas.mjs). */
export interface PaginaProducto {
  /** Fecha (AAAA-MM-DD) de lo que cuenta: el `lastmod` del sitemap y el `narra` de su guion. */
  actualizado: string;
  /** Título (tras el nombre y el alias) y descripción para buscadores y redes. */
  seo: { titulo: Texto; descripcion: Texto };
  /** Imagen de la cabecera; sin ella, la cabecera es solo texto. */
  portada?: Imagen;
  /** El lema, partido en los renglones del rótulo. */
  lema: Texto[];
  entrada: Texto;
  /** El problema que resuelve, tras la cabecera. */
  problema?: TituloTexto;
  /** Lo que te da (distinto de `garantias`, que son el «por qué fiarse»). */
  beneficios?: { titulo: Texto; items: TituloTexto[] };
  pasosTitulo: Texto;
  /** Los cuatro pasos, en orden. */
  pasos: TituloTexto[];
  /**
   * Diagramas bajo los pasos (WebP en `public/`, con su `mini` de 720 px de ancho) y su versión del tema oscuro
   * (`srcOscuro` y `miniOscuro`, con las mismas medidas: fondo noche, nunca el papel claro).
   */
  figuras?: (Imagen & { srcOscuro: string; miniOscuro: string; pie?: Texto })[];
  garantiasTitulo: Texto;
  garantias: TituloTexto[];
  /** Para quién es, tras «por qué fiarse». */
  paraQuien?: { titulo: Texto; items: Texto[] };
  /** Frase de estado junto al contacto («está en desarrollo…»), sin cifras. */
  estadoTexto?: Texto;
  contacto: TituloTexto;
  /**
   * Ficha de requisitos mínimos para instalarlo o implantarlo, plegada antes del apartado técnico. Solo lo que afirma
   * el repo del producto: lo que no consta no se escribe.
   */
  requisitos?: {
    /** Frase de entrada (para qué versión vale, que puede cambiar…). */
    intro?: Texto;
    items: { etiqueta: Texto; valor: Texto; codigo?: boolean }[];
  };
  tecnico: {
    /** Los papeles del flujo (quien hace, quien revisa…); sin ellos, no sale el apartado. */
    papeles?: Texto[];
    papelesTexto?: Texto;
    /** `codigo`: el valor es una orden o un nombre literal y va en monoespaciada. */
    datos: { etiqueta: Texto; valor: Texto; codigo?: boolean }[];
  };
}

const modulos = import.meta.glob<{ default: Producto }>('./productos/*.json', { eager: true });

export const productos: Producto[] = Object.values(modulos)
  .map((m) => m.default)
  .sort((a, b) => a.orden - b.orden);

export function buscarProducto(slug: string | undefined): Producto | undefined {
  return productos.find((p) => p.slug === slug);
}

/** Dirección `mailto:` del primer contacto de un producto, con el asunto ya traducido. */
export function correoDeProducto(correo: string, asunto: string): string {
  return `mailto:${correo}?subject=${encodeURIComponent(asunto)}`;
}

/** Productos que lleva un miembro, como responsable o colaborador, en el orden de siempre (ADR 0004: van en su perfil). */
export function productosDe(id: string): Producto[] {
  return productos.filter((p) => p.responsable === id || p.colaboradores.includes(id));
}
