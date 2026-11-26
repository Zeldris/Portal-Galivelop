import type { Idioma, Texto } from './tipos';

// Diario del taller (Q-32, Q-37 a Q-42). Cada entrada vive en src/data/diario/<slug>.json, con todo su texto en
// castellano, gallego e inglés. Cómo añadir una: docs/desarrollo.md («Diario del taller»).

export type Bloque =
  /** `código` entre comillas invertidas se pinta como <code>. */
  | { tipo: 'parrafo'; texto: Texto }
  /** Recuadro «Decisión» con borde celeste. */
  | { tipo: 'decision'; texto: Texto; cita: Texto }
  /** Recuadro con título y lista («Qué cambió», «Qué aprendimos»). */
  | { tipo: 'lista'; titulo: Texto; items: Texto[] }
  /** Una animación de una ficha (`animaciones` del proyecto), en reposo; reproducirla es opcional. */
  | { tipo: 'animacion'; proyecto: string; id: string; pie: Texto };

export interface SeccionDiario {
  etiqueta: Texto;
  titulo: Texto;
  bloques: Bloque[];
}

export interface EntradaDiario {
  slug: string;
  /** AAAA-MM-DD: fecha de la entrada, `lastmod` del sitemap y `datePublished`. */
  fecha: string;
  /** Id de equipo.json. */
  autor: string;
  /** Slug de una ficha de src/data/proyectos/. */
  proyecto?: string;
  titulo: Texto;
  /** Entradilla bajo el título. */
  bajada: Texto;
  /** Para buscadores y redes, ≤ 160 caracteres. */
  descripcion: Texto;
  secciones: SeccionDiario[];
}

const modulos = import.meta.glob<{ default: EntradaDiario }>('./diario/*.json', { eager: true });

/** De la más nueva a la más vieja (a igual fecha, por slug, para que el orden no dependa del sistema de archivos). */
export const entradas: EntradaDiario[] = Object.values(modulos)
  .map((m) => m.default)
  .sort((a, b) => b.fecha.localeCompare(a.fecha) || a.slug.localeCompare(b.slug));

export function buscarEntrada(slug: string | undefined): EntradaDiario | undefined {
  return entradas.find((e) => e.slug === slug);
}

/** Todos los textos de la entrada en un idioma, en orden de lectura. */
export function textosDe(entrada: EntradaDiario, idioma: Idioma): string[] {
  const textos: string[] = [entrada.titulo[idioma], entrada.bajada[idioma]];
  for (const s of entrada.secciones) {
    textos.push(s.etiqueta[idioma], s.titulo[idioma]);
    for (const b of s.bloques) {
      if (b.tipo === 'parrafo') textos.push(b.texto[idioma]);
      else if (b.tipo === 'decision') textos.push(b.texto[idioma], b.cita[idioma]);
      else if (b.tipo === 'lista') textos.push(b.titulo[idioma], ...b.items.map((i) => i[idioma]));
      else textos.push(b.pie[idioma]);
    }
  }
  return textos;
}

const PALABRAS_POR_MINUTO = 200;

/** Minutos de lectura: palabras de títulos, bajada y bloques del idioma / 200, hacia arriba, mínimo 1. */
export function minutosLectura(entrada: EntradaDiario, idioma: Idioma): number {
  const palabras = textosDe(entrada, idioma).reduce(
    (n, t) => n + t.split(/\s+/).filter(Boolean).length,
    0,
  );
  return Math.max(1, Math.ceil(palabras / PALABRAS_POR_MINUTO));
}
