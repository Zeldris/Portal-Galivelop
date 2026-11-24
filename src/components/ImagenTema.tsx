import type { ImgHTMLAttributes } from 'react';
import { ruta } from '../data/proyectos';

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'className' | 'alt'> & {
  /** Ruta en public/ de la versión clara. */
  claro: string;
  /** Ruta en public/ de la versión oscura. */
  oscuro: string;
  className: string;
  alt?: string;
  /** `srcSet` de cada versión, cuando la imagen tiene varios anchos (rutas ya resueltas con `ruta`). */
  srcSets?: { claro: string; oscuro: string };
};

/**
 * Una ilustración con versión clara y oscura: pinta las dos y el CSS (`.solo-claro`, `.solo-oscuro`) muestra la del
 * tema. Van con `loading="lazy"`: el navegador no descarga una imagen diferida oculta con `display: none`, así que
 * solo baja la del tema.
 */
export function ImagenTema({ claro, oscuro, className, alt = '', srcSets, ...resto }: Props) {
  return (
    <>
      {(
        [
          ['claro', claro],
          ['oscuro', oscuro],
        ] as const
      ).map(([tema, src]) => (
        <img
          key={tema}
          loading="lazy"
          {...resto}
          className={`${className} solo-${tema}`}
          src={ruta(src)}
          srcSet={srcSets?.[tema]}
          alt={alt}
        />
      ))}
    </>
  );
}
