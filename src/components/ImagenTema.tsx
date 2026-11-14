import type { ImgHTMLAttributes } from 'react';
import { ruta } from '../data/proyectos';

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'className' | 'alt'> & {
  /** Ruta en public/ de la versión clara. */
  claro: string;
  /** Ruta en public/ de la versión oscura. */
  oscuro: string;
  className: string;
  alt?: string;
};

/** Una ilustración con versión clara y oscura: pinta las dos y el CSS (`.solo-claro`, `.solo-oscuro`) muestra la del tema. */
export function ImagenTema({ claro, oscuro, className, alt = '', ...resto }: Props) {
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
          {...resto}
          className={`${className} solo-${tema}`}
          src={ruta(src)}
          alt={alt}
        />
      ))}
    </>
  );
}
