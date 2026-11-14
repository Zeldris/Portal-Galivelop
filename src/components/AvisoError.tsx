import { ImagenTema } from './ImagenTema';

/** Aviso de fallo de carga (no «no existe»): el cable desconectado (recurso 28), título, texto y un botón que vuelve a intentarlo. */
export function AvisoError({
  titulo,
  texto,
  boton,
  alPulsar,
}: {
  titulo: string;
  texto: string;
  boton: string;
  alPulsar: () => void;
}) {
  return (
    <section className="seccion no-encontrado" role="alert">
      <div className="contenedor">
        <ImagenTema
          className="aviso-error-imagen"
          claro="marca/aviso-error.webp"
          oscuro="marca/aviso-error-oscura.webp"
          width={480}
          height={360}
          // Sin red (el caso típico de este aviso), mejor nada que una caja rota.
          onError={(e) => (e.currentTarget.style.display = 'none')}
        />
        <h1>{titulo}</h1>
        <p>{texto}</p>
        <button type="button" className="boton boton-primario" onClick={alPulsar}>
          {boton}
        </button>
      </div>
    </section>
  );
}
