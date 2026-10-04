// Modelo de datos de un proyecto. Cada proyecto vive en src/data/proyectos/<slug>.json
// y sus imágenes en public/proyectos/<slug>/. Ver README.md, «Añadir un proyecto».

export const IDIOMAS = ['es', 'gl', 'en'] as const;
export type Idioma = (typeof IDIOMAS)[number];

/** Texto en los tres idiomas del portal. */
export type Texto = Record<Idioma, string>;

export type EstadoProyecto = 'publicado' | 'desarrollo' | 'diseno';
export type EstadoHito = 'hecho' | 'curso' | 'pendiente';

export interface Imagen {
  /** Ruta relativa a public/, p. ej. "proyectos/tarkor/portada.webp". */
  src: string;
  /** Versión reducida para miniaturas y tarjetas. */
  mini: string;
  ancho: number;
  alto: number;
  alt: Texto;
}

export interface Enlace {
  tipo: 'web' | 'descarga' | 'otro';
  url: string;
  etiqueta: Texto;
}

export interface Proyecto {
  slug: string;
  nombre: string;
  /** Orden en la portada (menor primero). */
  orden: number;
  estado: EstadoProyecto;
  /** Color de acento propio del proyecto (hex). */
  acento: string;
  /** Icono o logo del proyecto (ruta en public/), opcional. */
  icono?: string;
  /**
   * Cómo se usa la portada en la cabecera de la ficha: "ilustracion" (por defecto) la pone de fondo;
   * "captura" (capturas de una web o app) la enmarca en una ventana sobre un fondo de color.
   */
  cabecera?: 'ilustracion' | 'captura';
  /**
   * "abierta": se puede colaborar en el proyecto. "privada": no se colabora en su desarrollo,
   * pero se aceptan propuestas e interesados.
   */
  colaboracion: 'abierta' | 'privada';
  /** Correo de contacto propio del proyecto, opcional. */
  contacto?: string;
  /** Fecha de la última actualización de la ficha (AAAA-MM-DD). */
  actualizado: string;
  categoria: Texto;
  lema: Texto;
  resumen: Texto;
  /** Etapa actual en una frase corta (p. ej. "Alpha · hito 0.2 en curso"). */
  fase: Texto;
  etiquetas: string[];
  portada: Imagen;
  enlaces: Enlace[];
  galeria: Imagen[];
  descripcion: Texto[];
  caracteristicas: { icono: string; titulo: Texto; texto: Texto }[];
  ficha: { capa: Texto; tecnologias: string[] }[];
  hitos: { version?: string; nombre: Texto; estado: EstadoHito; detalle?: Texto }[];
  novedades: { fecha: string; texto: Texto }[];
  cifras: { valor: string; etiqueta: Texto }[];
  decisiones: { titulo: Texto; texto: Texto }[];
  equipo: { nombre: string; rol: Texto }[];
}
