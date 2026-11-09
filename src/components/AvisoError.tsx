import { MarcaGV } from './Logo';

/** Aviso de fallo de carga (no «no existe»): título, texto y un botón que vuelve a intentarlo. */
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
        <MarcaGV tamano={64} />
        <h1>{titulo}</h1>
        <p>{texto}</p>
        <button type="button" className="boton boton-primario" onClick={alPulsar}>
          {boton}
        </button>
      </div>
    </section>
  );
}
