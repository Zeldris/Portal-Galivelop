import { camino } from './camino';
import { relevo } from './relevo';
import { trabajar } from './trabajar';
import type { Guion } from './tipos';

/** Guiones por id de animación (el `id` de `animaciones` en la ficha). */
export const GUIONES: Record<string, Guion> = Object.fromEntries(
  [trabajar, relevo, camino].map((g) => [g.id, g]),
);
