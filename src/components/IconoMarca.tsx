import candado from '../assets/iconos/candado.svg?raw';
import codigo from '../assets/iconos/codigo.svg?raw';
import ramasUnidas from '../assets/iconos/ramas-unidas.svg?raw';
import terminal from '../assets/iconos/terminal.svg?raw';

/** Iconos propios de la marca (recursos 7, 8 y 9 de `docs/marca.md`), en un solo trazado con `currentColor`. */
const ICONOS = { candado, codigo, 'ramas-unidas': ramasUnidas, terminal };
export type NombreIcono = keyof typeof ICONOS;

/** Se pinta en línea (no con `<img>`) para que tome el color del texto y casen las reglas de `svg` del CSS. */
export function IconoMarca({ nombre }: { nombre: NombreIcono }) {
  const svg = ICONOS[nombre];
  const viewBox = /viewBox="([^"]+)"/.exec(svg)?.[1];
  const trazado = svg.slice(svg.indexOf('>') + 1, svg.lastIndexOf('</svg>'));
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
