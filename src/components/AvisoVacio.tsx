import { ImagenTema } from './ImagenTema';

/** Aviso de lista vacía (muro, novedades): la ventana de editor en blanco sobre la carta (recurso 27) y el texto. */
export function AvisoVacio({ texto }: { texto: string }) {
  return (
    <div className="vacio vacio-ilustrado">
      <ImagenTema
        className="vacio-imagen"
        claro="marca/estado-vacio.webp"
        oscuro="marca/estado-vacio-oscura.webp"
        width={480}
        height={360}
        onError={(e) => (e.currentTarget.style.display = 'none')}
      />
      <p>{texto}</p>
    </div>
  );
}
