import datos from './equipo.json';
import type { Texto } from './tipos';

// Personas del taller. Para añadir a alguien: una entrada más en equipo.json (ver docs/desarrollo.md).
export const REDES = ['linkedin', 'github', 'web', 'correo', 'x', 'instagram', 'youtube', 'discord'] as const;
export type Red = (typeof REDES)[number];

/** Una etapa de la trayectoria o de la formación; meses en AAAA-MM, sin `hasta` si sigue. */
export interface Etapa {
  titulo: Texto;
  lugar: string;
  desde: string;
  hasta?: string;
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

export interface Persona {
  /** Identificador para el ancla /equipo#<id>. */
  id: string;
  nombre: string;
  orden: number;
  rol: Texto;
  bio: Texto;
  /** Slugs de los proyectos en los que participa. */
  proyectos: string[];
  redes: { tipo: Red; url: string }[];
  /** Foto opcional (ruta en public/); sin ella se muestran las iniciales. */
  foto?: string;
  perfil?: Perfil;
}

export const equipo: Persona[] = (datos as Persona[]).slice().sort((a, b) => a.orden - b.orden);

export function buscarPersona(nombre: string): Persona | undefined {
  return equipo.find((p) => p.nombre === nombre);
}

export function iniciales(nombre: string): string {
  return nombre
    .split(' ')
    .filter((x) => /^\p{L}/u.test(x))
    .slice(0, 2)
    .map((x) => x[0])
    .join('');
}
