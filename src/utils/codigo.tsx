import type { ReactNode } from 'react';

/** Un texto con `código` entre comillas invertidas: cada tramo se pinta como <code>; el resto, tal cual. */
export function conCodigo(texto: string): ReactNode[] {
  return texto
    .split(/`([^`]+)`/)
    .map((tramo, i) => (i % 2 === 1 ? <code key={i}>{tramo}</code> : tramo))
    .filter((tramo) => tramo !== '');
}
