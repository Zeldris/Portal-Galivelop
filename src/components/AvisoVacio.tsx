import { ruta } from '../data/proyectos';

/** Aviso de lista vacía (muro, novedades): la ventana de editor en blanco sobre la carta (recurso 27) y el texto. */
export function AvisoVacio({ texto }: { texto: string }) {
  return (
    <div className="vacio vacio-ilustrado">
      <img
        className="vacio-imagen"
        src={ruta('marca/estado-vacio.webp')}
        alt=""
        width={480}
        height={360}
        onError={(e) => (e.currentTarget.style.display = 'none')}
      />
      <p>{texto}</p>
    </div>
  );
}
