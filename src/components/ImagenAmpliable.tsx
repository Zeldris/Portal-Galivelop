import { X } from 'lucide-react';
import { useRef } from 'react';
import { ruta } from '../data/proyectos';
import type { Imagen } from '../data/tipos';
import { useIdioma } from '../i18n/Idioma';

/** Miniatura que se abre a pantalla completa al pulsarla (tarjetas de los apartados). */
export function ImagenAmpliable({ imagen }: { imagen: Imagen }) {
  const { t, tx } = useIdioma();
  const dialogo = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button
        type="button"
        className="tarjeta-imagen"
        onClick={() => dialogo.current?.showModal()}
        aria-label={t('galeria.ampliar')}
      >
        <img
          src={ruta(imagen.mini)}
          alt={tx(imagen.alt)}
          loading="lazy"
          width={imagen.ancho}
          height={imagen.alto}
        />
      </button>
      <dialog
        ref={dialogo}
        className="galeria-dialogo"
        onClick={(e) => e.target === dialogo.current && dialogo.current.close()}
      >
        <figure>
          <img src={ruta(imagen.src)} alt={tx(imagen.alt)} loading="lazy" />
          <figcaption>{tx(imagen.alt)}</figcaption>
        </figure>
        <button
          type="button"
          className="galeria-cerrar"
          onClick={() => dialogo.current?.close()}
          aria-label={t('galeria.cerrar')}
        >
          <X size={22} />
        </button>
      </dialog>
    </>
  );
}
