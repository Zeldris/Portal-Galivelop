// Guiones de las animaciones paso a paso (storyboard v3, docs/diseno/2026-11-09-storyboard-animaciones-v3.html).
// Un guion es una lista de átomos de dibujo; cada átomo dice en qué pasos se ve y su geometría en los dos
// modos: escritorio (viewBox 960×540) y móvil (300×428). Los textos son literales (nombres técnicos, que no se
// traducen) o ids de `etiquetas` de la ficha, que sí se traducen.

/** Trozo de un rótulo: literal o id de una etiqueta de la ficha. */
export type Parte = string | { e: string };
export type Rotulo = Parte | Parte[];
/** Valor distinto en escritorio (`d`) y en móvil (`m`). */
export interface DosModos<T> {
  d: T;
  m: T;
}
export type PorModo<T> = T | DosModos<T>;

export type Tipo =
  /** Caja con chaflán: [x, y, ancho, alto]. */
  | 'B'
  /** Texto: [x, y]. */
  | 'T'
  /** Trazo: `d` de un path. */
  | 'L'
  /** Círculo: [cx, cy, r]. */
  | 'D'
  /** Medidor vertical: [x, y, ancho, alto]; `niveles` dice cuánto se llena en cada paso. */
  | 'M'
  /** Sombra discontinua de un medidor: [x, y, ancho, alto]. */
  | 'R'
  /** Persona: [x, y, escala]. */
  | 'P';

export type Geometria = number[] | string | null;
export type Ancla = 'start' | 'middle' | 'end';

export interface Atomo {
  k: Tipo;
  /** Pasos en los que se ve (1 = el primero). */
  pasos: ReadonlySet<number>;
  /** En móvil, si cambia. */
  pasosMovil?: ReadonlySet<number>;
  d: Geometria;
  m: Geometria;
  /** Texto (de la caja o del texto suelto); `null` en un modo = sin texto. */
  t?: PorModo<Rotulo | null>;
  /** Subtítulo de la caja. */
  s?: PorModo<Rotulo | null>;
  /** Clases de la caja, del texto o del trazo. */
  c?: PorModo<string>;
  a?: PorModo<Ancla>;
  /** Título de la caja en letra de datos. */
  mono?: boolean;
  /** Caja con una sola línea de texto plano en letra de datos. */
  plano?: boolean;
  /** Altura relativa del título cuando hay subtítulo (por defecto 0,44). */
  ty?: number;
  /** Clase extra de los textos de la caja. */
  tc?: string;
  /** Retardo de entrada, en segundos. */
  dl?: number;
  /** Entra cayendo desde arriba (el commit nuevo). */
  cae?: boolean;
  flecha?: 'cel' | 'al' | 'no';
  niveles?: Record<number, number>;
}

export interface Guion {
  id: string;
  /** Número de pasos: tiene que coincidir con los de la ficha. */
  pasos: number;
  atomos: Atomo[];
}

/** Pasos en forma «1-4,6». */
export function pasos(s: string): ReadonlySet<number> {
  const o = new Set<number>();
  for (const trozo of s.split(',')) {
    const p = trozo.trim();
    if (!p) continue;
    const [a, b] = p.split('-').map(Number);
    for (let i = a; i <= (b ?? a); i++) o.add(i);
  }
  return o;
}

export type Opciones = Omit<Atomo, 'k' | 'pasos' | 'pasosMovil' | 'd' | 'm'> & { ms?: string };

export function at(k: Tipo, st: string, d: Geometria, m: Geometria, o: Opciones = {}): Atomo {
  const { ms, ...resto } = o;
  return { ...resto, k, pasos: pasos(st), pasosMovil: ms ? pasos(ms) : undefined, d, m };
}

export const e = (id: string): Parte => ({ e: id });
export function dos(d: Ancla, m: Ancla): DosModos<Ancla>;
export function dos(d: string, m: string): DosModos<string>;
export function dos(d: Rotulo | null, m: Rotulo | null): DosModos<Rotulo | null>;
export function dos<T>(d: T, m: T): DosModos<T> {
  return { d, m };
}

export function esDosModos<T>(v: PorModo<T>): v is DosModos<T> {
  return typeof v === 'object' && v !== null && !Array.isArray(v) && 'd' in v && 'm' in v;
}

export function segun<T>(v: PorModo<T> | undefined, movil: boolean): T | undefined {
  if (v === undefined) return undefined;
  return esDosModos(v) ? (movil ? v.m : v.d) : v;
}

/** Ids de etiqueta que usa un rótulo. */
export function idsDe(r: Rotulo | null | undefined): string[] {
  if (r == null) return [];
  const partes = Array.isArray(r) ? r : [r];
  return partes.flatMap((p) => (typeof p === 'string' ? [] : [p.e]));
}

/** Todos los ids de etiqueta de un guion, en los dos modos. */
export function etiquetasDe(g: Guion): Set<string> {
  const ids = new Set<string>();
  for (const a of g.atomos) {
    for (const v of [a.t, a.s]) {
      if (v === undefined) continue;
      const vs = esDosModos(v) ? [v.d, v.m] : [v];
      for (const r of vs) for (const id of idsDe(r)) ids.add(id);
    }
  }
  return ids;
}

/** Une un rótulo con las etiquetas ya traducidas. */
export function componer(r: Rotulo | null | undefined, etiqueta: (id: string) => string): string {
  if (r == null) return '';
  const partes = Array.isArray(r) ? r : [r];
  return partes.map((p) => (typeof p === 'string' ? p : etiqueta(p.e))).join('');
}
