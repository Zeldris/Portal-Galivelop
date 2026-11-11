import type { ComponentType } from 'react';
import candado from '../assets/iconos/candado.svg?raw';
import codigo from '../assets/iconos/codigo.svg?raw';
import ramasUnidas from '../assets/iconos/ramas-unidas.svg?raw';
import terminal from '../assets/iconos/terminal.svg?raw';

/** Iconos propios de la marca (recursos 7, 8 y 9 de `docs/marca.md`), en un solo trazado con `currentColor`. */
const FUENTES = { candado, codigo, 'ramas-unidas': ramasUnidas, terminal };
export type NombreIcono = keyof typeof FUENTES;

/** `viewBox` y contenido de cada SVG, leídos una vez al cargar el módulo. */
const ICONOS = Object.fromEntries(
  Object.entries(FUENTES).map(([nombre, svg]) => {
    const m = /<svg\b[^>]*\sviewBox="([^"]+)"[^>]*>([\s\S]*)<\/svg>/.exec(svg);
    if (!m) throw new Error(`IconoMarca: ${nombre}.svg sin <svg viewBox> legible`);
    return [nombre, { viewBox: m[1], trazado: m[2] }];
  }),
) as Record<NombreIcono, { viewBox: string; trazado: string }>;

/** Se pinta en línea (no con `<img>`) para que tome el color del texto y casen las reglas de `svg` del CSS. */
export function IconoMarca({ nombre }: { nombre: NombreIcono }) {
  const { viewBox, trazado } = ICONOS[nombre];
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      aria-hidden="true"
      focusable="false"
      dangerouslySetInnerHTML={{ __html: trazado }}
    />
  );
}

/** El icono como componente, para ponerlo en los mismos huecos que un icono de lucide (siempre decorativo). */
export const iconoMarca = (nombre: NombreIcono): ComponentType<{ 'aria-hidden'?: 'true' }> =>
  function Icono() {
    return <IconoMarca nombre={nombre} />;
  };
