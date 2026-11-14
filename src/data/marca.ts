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
