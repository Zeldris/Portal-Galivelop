import { ruta } from '../data/proyectos';

/**
 * Separador de la marca (recurso 12 de `docs/marca.md`): filete con rosa de ocho puntas entre bloques largos. Es
 * decorativo; en el tema oscuro lo invierte el CSS (`.separador`).
 */
export function Separador() {
  return (
    <img
      className="separador"
      src={ruta('/marca/separador.webp')}
      alt=""
      width={1200}
      height={100}
      loading="lazy"
    />
  );
}
