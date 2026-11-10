// La pestaña y el paso en que se dejó la animación de «Cómo funciona», para volver a ellos al recargar (sessionStorage:
// solo esta pestaña del navegador; sin él, o con lo guardado roto, se empieza por la primera animación en su paso 1).

const CLAVE = 'galivelop.flujo';

export interface Posicion {
  id: string;
  paso: number;
}

type Almacen = Pick<Storage, 'getItem' | 'setItem'>;

function almacen(): Almacen | null {
  try {
    return typeof window === 'undefined' ? null : window.sessionStorage;
  } catch {
    return null;
  }
}

/** Lo guardado, solo si nombra una animación que existe; el paso queda entre 1 y su número de pasos. */
export function leerPosicion(
  pasosDe: (id: string) => number | undefined,
  a: Almacen | null = almacen(),
): Posicion | null {
  try {
    const crudo = a?.getItem(CLAVE);
    if (!crudo) return null;
    const v: unknown = JSON.parse(crudo);
    if (typeof v !== 'object' || v === null) return null;
    const { id, paso } = v as Record<string, unknown>;
    if (typeof id !== 'string' || typeof paso !== 'number' || !Number.isFinite(paso)) return null;
    const total = pasosDe(id);
    if (!total) return null;
    return { id, paso: Math.min(Math.max(1, Math.round(paso)), total) };
  } catch {
    return null;
  }
}

export function guardarPosicion(p: Posicion, a: Almacen | null = almacen()): void {
  try {
    a?.setItem(CLAVE, JSON.stringify(p));
  } catch {
    // Sin almacenamiento (modo privado, bloqueado): al recargar se empieza por el paso 1.
  }
}
