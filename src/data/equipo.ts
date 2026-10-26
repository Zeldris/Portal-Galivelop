import datos from './equipo.json';
import type { Texto } from './tipos';

// Personas del taller. Para añadir a alguien: una entrada más en equipo.json (ver docs/desarrollo.md).
export const REDES = ['linkedin', 'github', 'web', 'correo', 'x', 'instagram', 'youtube', 'discord'] as const;
export type Red = (typeof REDES)[number];

/**
 * Una etapa de la trayectoria o de la formación; meses en AAAA-MM, sin `hasta` si sigue. Sin `lugar` (una titulación
 * sin centro), el título hace de encabezado.
 */
export interface Etapa {
  titulo: Texto;
  lugar?: string;
  desde: string;
  hasta?: string;
  /** Qué hizo ahí, en una o dos frases. */
  descripcion?: Texto;
  /** Logo de la empresa o centro, en `public/` (p. ej. `equipo/empresas/orienteed.svg`); sin él, sus iniciales. */
  logo?: string;
  /** Clientes para los que trabajó desde esa empresa (consultorías), con su nombre comercial. */
  clientes?: string[];
  /** A quién iba dirigido lo que desarrolló: `B2C` (público), `B2B` (empresas) o los dos. */
  negocio?: Negocio[];
}

export type Negocio = 'B2C' | 'B2B';

/** Etapas seguidas en el mismo sitio, juntas bajo su nombre y su logo (como los puestos de una misma empresa). */
export interface Lugar {
  lugar?: string;
  logo?: string;
  /** Los de todas sus etapas, sin repetir. */
  clientes: string[];
  /** Los de todas sus etapas, sin repetir. */
  negocio: Negocio[];
  etapas: Etapa[];
}

/** `a` con los de `b` que aún no tiene, en orden. */
function unir<T>(a: T[], b: T[] = []): T[] {
  return [...new Set([...a, ...b])];
}

export function agruparPorLugar(etapas: Etapa[]): Lugar[] {
  const lugares: Lugar[] = [];
  for (const e of etapas) {
    const ultimo = lugares[lugares.length - 1];
    if (e.lugar && ultimo?.lugar === e.lugar) {
      ultimo.etapas.push(e);
      ultimo.logo ??= e.logo;
      ultimo.clientes = unir(ultimo.clientes, e.clientes);
      ultimo.negocio = unir(ultimo.negocio, e.negocio);
    } else {
      lugares.push({ lugar: e.lugar, logo: e.logo, clientes: unir([], e.clientes), negocio: unir([], e.negocio), etapas: [e] });
    }
  }
  return lugares;
}

/** Años desde la primera etapa (la más antigua) hasta `hoy`, redondeando hacia abajo. */
export function anosDesde(etapas: Etapa[], hoy = new Date()): number {
  if (!etapas.length) return 0;
  const primera = etapas.map((e) => e.desde).sort()[0];
  const [a, m] = primera.split('-').map(Number);
  return Math.floor((hoy.getFullYear() * 12 + hoy.getMonth() + 1 - (a * 12 + m)) / 12);
}

/** Perfil profesional ampliado, opcional: solo para quien quiera contarlo. */
export interface Perfil {
  /** Versión breve para la tarjeta de cada proyecto: una línea y unas pocas tecnologías. */
  resumen?: Texto;
  destacadas?: string[];
  ubicacion?: Texto;
  trayectoria?: Etapa[];
  formacion?: Etapa[];
  tecnologias?: { grupo: Texto; lista: string[] }[];
  idiomas?: { idioma: Texto; nivel: Texto }[];
  fortalezas?: Texto[];
}

/** Papel en un proyecto: lo creó o forma parte de su equipo. */
export const PAPELES = ['creo', 'equipo'] as const;
export type Papel = (typeof PAPELES)[number];

export interface Persona {
  /** Identificador para su página /equipo/<id> y el ancla /equipo#<id>. */
  id: string;
  nombre: string;
  orden: number;
  rol: Texto;
  bio: Texto;
  /** Slugs de los proyectos en los que participa. */
  proyectos: string[];
  /** Papel en cada proyecto (por slug), opcional: se muestra en su página. */
  papeles?: Partial<Record<string, Papel>>;
  redes: { tipo: Red; url: string }[];
  /** Foto opcional (ruta en public/); sin ella se muestran las iniciales. */
  foto?: string;
  perfil?: Perfil;
  /** Solo si colabora por su cuenta en proyectos de otras personas (ADR 0001): cierra su página. */
  colabora?: { texto: Texto; correo: string };
}

export const equipo: Persona[] = (datos as Persona[]).slice().sort((a, b) => a.orden - b.orden);

export function buscarPersona(nombre: string): Persona | undefined {
  return equipo.find((p) => p.nombre === nombre);
}

export function buscarPersonaPorId(id: string | undefined): Persona | undefined {
  return equipo.find((p) => p.id === id);
}

export function iniciales(nombre: string): string {
  return nombre
    .split(' ')
    .filter((x) => /^\p{L}/u.test(x))
    .slice(0, 2)
    .map((x) => x[0])
    .join('');
}
