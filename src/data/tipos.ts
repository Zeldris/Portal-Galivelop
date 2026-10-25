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
  /** Orden de alta: el siguiente número libre. En el portal sale primero el mayor (el último añadido). */
  orden: number;
  estado: EstadoProyecto;
  /** Color de acento propio del proyecto (hex). */
  acento: string;
  /** Icono o logo del proyecto (ruta en public/), opcional. */
  icono?: string;
  /**
   * Cómo se usa la portada en la cabecera de la ficha: "ilustracion" (por defecto) la pone de fondo;
   * "captura" (capturas de una web o app) la enmarca en una ventana sobre un fondo de color;
   * "color" deja solo el fondo de color y las imágenes van en la galería de debajo.
   */
  cabecera?: 'ilustracion' | 'captura' | 'color';
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
  /** Capturas reales del producto (la interfaz del juego, de la web…), en su propia sección. */
  capturas: Imagen[];
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
   * Se muestran como mosaico en «A fondo»; cada uno se abre en una hoja con su lista de elementos.
   */
  apartados: Apartado[];
  ficha: { capa: Texto; tecnologias: string[] }[];
  hitos: { version?: string; nombre: Texto; estado: EstadoHito; detalle?: Texto }[];
  novedades: { fecha: string; texto: Texto }[];
  cifras: { valor: string; etiqueta: Texto }[];
  decisiones: { titulo: Texto; texto: Texto }[];
  equipo: { nombre: string; rol: Texto }[];
}

export interface Apartado {
  id: string;
  titulo: Texto;
  intro?: Texto;
  /** `valor`: dato corto e igual en todos los idiomas (p. ej. «26 %» o «0.4»). */
  items: { nombre: Texto; valor?: string; texto: Texto; imagen?: Imagen }[];
  /** Galería propia del apartado, por grupos con pestañas (p. ej. «Arte del mundo»). No rota sola. */
  grupos?: { id: string; etiqueta: Texto; imagenes: Imagen[] }[];
}

/** Imagen de una publicación del muro: puede tener otra versión por idioma (p. ej. una tarjeta con texto en inglés). */
export interface ImagenPublicacion extends Imagen {
  /** Versión para un idioma; el que no la tenga usa `src`/`mini` (la versión en castellano). */
  porIdioma?: Partial<Record<Idioma, { src: string; mini: string }>>;
}

/**
 * Publicación del muro. Cada una vive en src/data/muro/<proyecto>/<pieza>.json y sus imágenes en
 * public/proyectos/<proyecto>/muro/<pieza>/. Sale del `web.md` de una pieza de `docs/difusion/` del proyecto
 * marcada como lista; ver docs/desarrollo.md, «El muro».
 */
export interface Publicacion {
  /** Slug del proyecto (el de src/data/proyectos/<slug>.json). */
  proyecto: string;
  /** Carpeta de la pieza dentro de docs/difusion/ del proyecto, con «/» cambiada por «-». Igual al nombre del archivo. */
  pieza: string;
  fecha: string;
  titulo: Texto;
  /** Entradilla: una o dos frases. */
  texto: Texto;
  /** Párrafos que siguen a la entradilla, opcionales. */
  cuerpo?: Texto[];
  imagenes?: ImagenPublicacion[];
}
