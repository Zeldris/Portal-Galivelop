// Modelo de datos de un proyecto. Cada proyecto vive en src/data/proyectos/<slug>.json
// y sus imágenes en public/proyectos/<slug>/. Ver docs/desarrollo.md, «Añadir o actualizar un proyecto».

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
  /** Párrafos de «El proyecto»: el reto, el enfoque y dónde está hoy. */
  descripcion: Texto[];
  /** Líneas de trabajo del taller a las que pertenece (ids de src/data/lineas.ts). */
  lineas: string[];
  /** «Lo que estamos aprendiendo»: retos técnicos o de producto que el proyecto nos obliga a resolver. */
  aprendizajes: Texto[];
  caracteristicas: { icono: string; titulo: Texto; texto: Texto }[];
  /** «Cómo funciona»: pasos del uso principal (un turno, un análisis…). */
  pasos: { titulo: Texto; texto: Texto }[];
  /**
   * Apartados propios del proyecto (el mundo de un juego, la metodología de una herramienta…).
   * Cada uno se muestra como una sección plegable con una lista de elementos.
   */
  apartados: {
    id: string;
    titulo: Texto;
    intro?: Texto;
    /** `valor`: dato corto e igual en todos los idiomas (p. ej. «26 %» o «0.4»). */
    items: { nombre: Texto; valor?: string; texto: Texto }[];
  }[];
  ficha: { capa: Texto; tecnologias: string[] }[];
  hitos: { version?: string; nombre: Texto; estado: EstadoHito; detalle?: Texto }[];
  novedades: { fecha: string; texto: Texto }[];
  cifras: { valor: string; etiqueta: Texto }[];
  decisiones: { titulo: Texto; texto: Texto }[];
  equipo: { nombre: string; rol: Texto }[];
}
