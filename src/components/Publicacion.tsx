import { X } from 'lucide-react';
import { useRef, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { idPublicacion, versionDe } from '../data/muro';
import { buscarProyecto, ruta } from '../data/proyectos';
import type { ImagenPublicacion, Publicacion as TipoPublicacion } from '../data/tipos';
import { useIdioma } from '../i18n/Idioma';

/** Imagen de una publicación: miniatura que se abre a pantalla completa, en la versión del idioma elegido. */
function ImagenMuro({ imagen }: { imagen: ImagenPublicacion }) {
  const { t, tx, idioma } = useIdioma();
  const dialogo = useRef<HTMLDialogElement>(null);
  const v = versionDe(imagen, idioma);
  return (
    <>
      <button type="button" className="publicacion-imagen" onClick={() => dialogo.current?.showModal()} aria-label={t('galeria.ampliar')}>
        <img src={ruta(v.mini)} alt={tx(imagen.alt)} loading="lazy" width={imagen.ancho} height={imagen.alto} />
      </button>
      <dialog ref={dialogo} className="galeria-dialogo" onClick={(e) => e.target === dialogo.current && dialogo.current.close()}>
        <figure>
          <img src={ruta(v.src)} alt={tx(imagen.alt)} loading="lazy" />
          <figcaption>{tx(imagen.alt)}</figcaption>
        </figure>
        <button type="button" className="galeria-cerrar" onClick={() => dialogo.current?.close()} aria-label={t('galeria.cerrar')}>
          <X size={22} />
        </button>
      </dialog>
    </>
  );
}

/** Una publicación del muro, con el proyecto que la firma. */
export function Publicacion({ p }: { p: TipoPublicacion }) {
  const { tx, fecha } = useIdioma();
  const proyecto = buscarProyecto(p.proyecto);
  const imagenes = p.imagenes ?? [];
  return (
    <article id={idPublicacion(p)} className="publicacion" style={proyecto ? ({ '--acento-proyecto': proyecto.acento } as CSSProperties) : undefined}>
      <header className="publicacion-cabecera">
        {proyecto && (
          <Link to={`/proyectos/${proyecto.slug}`} className="publicacion-autor">
            {proyecto.icono && <img src={ruta(proyecto.icono)} alt="" width={28} height={28} />}
            {proyecto.nombre}
          </Link>
        )}
        <time dateTime={p.fecha}>{fecha(p.fecha)}</time>
      </header>
      <h2 className="publicacion-titulo">{tx(p.titulo)}</h2>
      <p className="publicacion-entradilla">{tx(p.texto)}</p>
      {p.cuerpo?.map((parrafo, i) => <p key={i}>{tx(parrafo)}</p>)}
      {imagenes.length > 0 && (
        <div className={`publicacion-imagenes publicacion-imagenes-${Math.min(imagenes.length, 3)}`}>
          {imagenes.map((imagen, i) => <ImagenMuro key={i} imagen={imagen} />)}
        </div>
      )}
    </article>
  );
}
