import datos from './proximamente.json';
import type { Texto } from './tipos';

// Proyectos que aún no tienen ficha: salen atenuados en «Próximamente», al final de los proyectos del inicio.
// No tienen página propia ni entran en el mapa del sitio. Cuando uno pasa a tener ficha, se quita de aquí.

export interface Proximo {
  /** Identificador; no puede coincidir con el slug de un proyecto con ficha. */
  slug: string;
  nombre: string;
  /** Color de acento (hex). */
  acento: string;
  /** Nombre de un icono de src/components/Icono.tsx. */
  icono: string;
  /** Qué es, en una línea. */
  lema: Texto;
  /** Fases del plan del proyecto: las cerradas y el total. */
  fases: { hechas: number; total: number };
  /** El paso que viene, para completar «Siguiente: …». */
  siguiente: Texto;
}

export const proximos: Proximo[] = datos as Proximo[];
