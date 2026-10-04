import { ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';

interface Props {
  id: string;
  titulo: string;
  abierto: boolean;
  alCambiar: (abierto: boolean) => void;
  /** Dato breve junto al título (p. ej. número de elementos). */
  extra?: string;
  children: ReactNode;
}

/** Sección plegable sobre <details>: accesible con teclado y lector de pantalla sin código extra. */
export function Plegable({ id, titulo, abierto, alCambiar, extra, children }: Props) {
  return (
    <details
      id={id}
      className="plegable"
      open={abierto}
      onToggle={(e) => {
        const ahora = (e.currentTarget as HTMLDetailsElement).open;
        if (ahora !== abierto) alCambiar(ahora);
      }}
    >
      <summary>
        <h2>{titulo}</h2>
        {extra && <span className="plegable-extra">{extra}</span>}
        <ChevronDown className="plegable-flecha" size={20} aria-hidden="true" />
      </summary>
      <div className="plegable-cuerpo">{children}</div>
    </details>
  );
}
