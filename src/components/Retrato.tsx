import type { CSSProperties } from 'react';
import { iniciales } from '../data/equipo';
import { ruta } from '../data/proyectos';

/**
 * Foto (o iniciales) de un miembro dentro del marco de carta náutica (recurso 17 de `docs/marca.md`). El marco es una
 * máscara: toma el color del texto, así que sirve en los dos temas.
 */
export function Retrato({
  nombre,
  foto,
  clase,
  lado,
}: {
  nombre: string;
  foto?: string;
  clase: string;
  lado: number;
}) {
  const marco = { '--marco': `url(${ruta('marca/marco-retrato.webp')})` } as CSSProperties;
  return (
    <span className={`retrato ${clase}`} style={marco}>
      {foto ? (
        <img src={ruta(foto)} alt="" width={lado} height={lado} />
      ) : (
        <span className="persona-iniciales" aria-hidden="true">
          {iniciales(nombre)}
        </span>
      )}
    </span>
  );
}
