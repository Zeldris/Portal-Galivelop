import { iniciales } from '../data/equipo';
import { ruta } from '../data/proyectos';

/**
 * Foto (o iniciales) de un miembro dentro del marco de carta náutica (recurso 17 de `docs/marca.md`). El marco es una
 * máscara (en `global.css`): toma el color del texto, así que sirve en los dos temas.
 */
export function Retrato({
  nombre,
  foto,
  clase,
  lado,
  perezosa = false,
}: {
  nombre: string;
  foto?: string;
  clase: string;
  lado: number;
  /** `loading="lazy"`, para los retratos que quedan lejos del principio de la página. */
  perezosa?: boolean;
}) {
  return (
    <span className={`retrato ${clase}`}>
      {foto ? (
        <img
          src={ruta(foto)}
          alt=""
          width={lado}
          height={lado}
          loading={perezosa ? 'lazy' : undefined}
        />
      ) : (
        <span className="persona-iniciales" aria-hidden="true">
          {iniciales(nombre)}
        </span>
      )}
    </span>
  );
}
