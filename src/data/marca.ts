import type { EstadoProyecto } from './tipos';

// Datos de contacto de la marca. El correo recibe las propuestas y solicitudes de los formularios (los de cada proyecto van en su .json, campo "contacto").
export const MARCA = {
  correo: 'alvarogarciagrana@gmail.com',
  /** Titular del portal (aviso legal y privacidad: src/data/legal/). */
  titular: 'Álvaro García Graña',
  /** Repositorio del portal; su LICENSE es la licencia MIT del código. */
  repositorio: 'https://github.com/Zeldris/Portal-Galivelop',
  /** Licencia de los textos e imágenes propias (el aviso legal enlaza la misma). */
  licenciaContenido: 'https://creativecommons.org/licenses/by/4.0/',
  github: 'https://github.com/Zeldris',
  discord: 'https://discord.gg/HWakpsAv3V',
};

/** Portada de la marca por estado (recurso 6, en `public/`): fondo velado de las fichas con `cabecera: "color"`. */
export const PORTADA_ESTADO: Record<EstadoProyecto, string> = {
  desarrollo: 'marca/portada-desarrollo.webp',
  diseno: 'marca/portada-diseno.webp',
  publicado: 'marca/portada-publicado.webp',
};

/** Ancho de las portadas por estado (`PORTADA_ESTADO`). */
export const ANCHO_ESTADO = 1600;
/** Ancho de la versión móvil de una portada de cabecera (`<nombre>-movil.webp`, de `scripts/miniatura-webp.mjs`). */
export const ANCHO_MOVIL = 960;
/** La cabecera de la ficha ocupa todo el ancho de la pantalla. */
export const SIZES_CABECERA = '100vw';
/** `srcset` de una imagen de cabecera: su versión móvil (960 px) y el original (`ancho` px). `ruta` da la URL pública. */
export function srcsetCabecera(src: string, ancho: number, ruta: (s: string) => string): string {
  return `${ruta(src.replace(/\.webp$/, '-movil.webp'))} ${ANCHO_MOVIL}w, ${ruta(src)} ${ancho}w`;
}
/**
 * Teléfonos en vertical, los que eligen `<nombre>-cuadrada.webp` (ver `Imagen.cuadrada`): ahí la cabecera de la ficha
 * mide 320-480 × ~465 px en la app (proporción 0,6-1,03) y la pantalla entera en la estática; de la portada apaisada
 * solo se ve el centro. El cuadrado de 540 px se ve con la misma nitidez que la versión móvil de 960 × 540.
 */
export const MEDIA_CUADRADA = '(max-width: 480px)';
/** Ruta del recorte cuadrado de una portada. */
export const cuadradaDe = (src: string): string => src.replace(/\.webp$/, '-cuadrada.webp');
/** Ancho de la miniatura de una portada (`<nombre>-mini.webp`). */
export const ANCHO_MINI = 720;
/**
 * La portada de la página de producto: columna de 560 px en escritorio y, en móvil, el ancho menos los 16 px de margen
 * de cada lado. Con `100vw`, un móvil de 390 px y doble densidad pedía 780 px y bajaba la versión de 960 (118 KB en
 * Developer); a 716 px le basta la miniatura de 720 (63 KB).
 */
export const SIZES_PORTADA_PRODUCTO = '(min-width: 860px) 560px, calc(100vw - 32px)';
/**
 * `srcset` de la portada de una página de producto: su miniatura (720 px), su versión móvil (960 px, la que elige un móvil
 * de doble densidad; sin ella bajaba el original) y el original (`ancho` px).
 */
export function srcsetPortadaProducto(
  portada: { src: string; mini: string; ancho: number },
  ruta: (s: string) => string,
): string {
  return `${ruta(portada.mini)} ${ANCHO_MINI}w, ${srcsetCabecera(portada.src, portada.ancho, ruta)}`;
}
