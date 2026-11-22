/** Rótulos del esquema, ya en el idioma de la página. */
export interface RotulosEsquema {
  descripcion: string;
  rama: string;
  tronco: string;
  quieto: string;
}

/**
 * Esquema «tronco → rama aparte → revisión → vuelve» de la página de un producto: los números son los de la lista de
 * pasos que lo acompaña. Los colores salen de los tokens (y del acento del producto) por las clases `esquema-*`.
 */
export function EsquemaRama({ rotulos }: { rotulos: RotulosEsquema }) {
  return (
    <figure className="esquema-rama">
      <svg viewBox="0 0 340 168" role="img" aria-label={rotulos.descripcion}>
        <path className="esquema-tronco" d="M8 124H56M284 124H332M322 118l8 6-8 6" />
        <path className="esquema-quieto" d="M56 124H284" />
        <path className="esquema-desvio" d="M56 124L104 52H236L284 124" />
        <text className="esquema-rotulo esquema-rotulo-rama" x="170" y="20" textAnchor="middle">
          {rotulos.rama}
        </text>
        <text className="esquema-rotulo" x="8" y="150">
          {rotulos.tronco}
        </text>
        <text className="esquema-rotulo" x="170" y="150" textAnchor="middle">
          {rotulos.quieto}
        </text>
        {NODOS.map(([x, y], i) => (
          <g key={i} className={`esquema-nodo esquema-nodo-${i + 1}`} aria-hidden="true">
            <rect x={x} y={y} width="22" height="22" />
            <text x={x + 11} y={y + 15.5} textAnchor="middle">
              {i + 1}
            </text>
          </g>
        ))}
      </svg>
    </figure>
  );
}

/** Esquina superior izquierda de cada nodo: sale del tronco, dos en la rama y vuelve. */
const NODOS = [
  [45, 113],
  [121, 41],
  [197, 41],
  [273, 113],
] as const;
