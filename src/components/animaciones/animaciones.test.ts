import { describe, expect, it } from 'vitest';
import { fichasCompletas } from '../../data/fichasCompletas';
import { textosIncompletos } from '../../data/textosIncompletos';
import { IDIOMAS, type Animacion } from '../../data/tipos';
import { GUIONES } from '.';
import { componer, etiquetasDe, segun, type Atomo, type Guion } from './tipos';

// Las animaciones se parten en dos: el dibujo (guiones en TS) y los textos (la ficha, en tres idiomas). Estos tests
// cuidan la costura: mismos pasos, mismas etiquetas y textos que caben en su sitio en los tres idiomas.

const conAnimaciones = fichasCompletas.filter((p) => p.animaciones?.length);
const animaciones: Animacion[] = conAnimaciones.flatMap((p) => p.animaciones ?? []);

describe('animaciones paso a paso', () => {
  it('cada animación de una ficha tiene su guion, con los mismos pasos, y cada guion se usa', () => {
    expect(conAnimaciones.map((p) => p.slug)).toContain('galivelop-workflow');
    for (const a of animaciones) {
      expect(GUIONES[a.id], `guion de «${a.id}»`).toBeDefined();
      expect(a.pasos.length, `pasos de «${a.id}»`).toBe(GUIONES[a.id].pasos);
    }
    expect(Object.keys(GUIONES).sort()).toEqual(animaciones.map((a) => a.id).sort());
  });

  it('las etiquetas de la ficha y las del guion son las mismas, en los dos sentidos', () => {
    for (const g of Object.values(GUIONES)) {
      const a = animaciones.find((x) => x.id === g.id);
      const delGuion = [...etiquetasDe(g)].sort();
      expect(Object.keys(a?.etiquetas ?? {}).sort(), `etiquetas de «${g.id}»`).toEqual(delGuion);
    }
  });

  it('los enlaces de «Cómo funciona» llevan a una animación y a un paso que existen', () => {
    const workflow = fichasCompletas.find((p) => p.slug === 'galivelop-workflow');
    expect(workflow?.pasos.filter((x) => x.animacion).length).toBeGreaterThan(0);
    for (const p of fichasCompletas) {
      for (const paso of p.pasos) {
        if (!paso.animacion) continue;
        const a = p.animaciones?.find((x) => x.id === paso.animacion?.id);
        expect(a, `${p.slug}: ${paso.titulo.es}`).toBeDefined();
        expect(paso.animacion.paso).toBeGreaterThanOrEqual(1);
        expect(paso.animacion.paso).toBeLessThanOrEqual(a?.pasos.length ?? 0);
      }
    }
  });

  it('textosIncompletos ve un texto que falta en una etiqueta, un título o una narración', () => {
    const a = animaciones[0];
    const id = Object.keys(a.etiquetas)[0];
    const rota = {
      animaciones: [
        {
          ...a,
          etiquetas: { ...a.etiquetas, [id]: { ...a.etiquetas[id], gl: '' } },
          pasos: [{ ...a.pasos[0], narracion: { es: 'x', gl: 'x' } }, ...a.pasos.slice(1)],
        },
      ],
    };
    expect(textosIncompletos(rota)).toEqual([
      `.animaciones[0].pasos[0].narracion.en`,
      `.animaciones[0].etiquetas.${id}.gl`,
    ]);
  });

  it('cada rótulo cabe en su caja o en el dibujo, en los dos modos y los tres idiomas', () => {
    expect(fuera()).toEqual([]);
  });
});

// Ancho medio de un carácter, en em, de cada letra del dibujo: medido en Chromium (0,38 Big Shoulders, 0,6 JetBrains
// Mono, 0,48 Literata) y redondeado por lo alto, para que el margen quede del lado bueno.
const MONO = 0.6;
const TITULOS = 0.44;
const TEXTO = 0.52;
/** Clase del texto → [tamaño en escritorio, tamaño en móvil, ancho por carácter en em]; como en global.css. */
const LETRA: Record<string, [number, number, number]> = {
  ti: [24, 22, TITULOS],
  tm: [16, 13, MONO],
  su: [15, 13, MONO],
  lb: [15, 13, MONO],
  tx: [17, 13, TEXTO],
  nm: [44, 26, TITULOS],
  ck: [20, 15, MONO],
  ckb: [40, 30, TITULOS],
  xb: [40, 30, TITULOS],
};
const LIENZO = { d: 960, m: 300 };

function ancho(texto: string, clases: string, movil: boolean): number {
  const clase = clases.split(/\s+/).find((c) => c in LETRA) ?? 'tm';
  const [d, m, em] = LETRA[clase];
  return [...texto].length * (movil ? m : d) * em;
}

/** Rótulos que se salen de su caja (B) o del lienzo (T), con el modo, el idioma y cuánto sobra. */
function fuera(): string[] {
  const malos: string[] = [];
  for (const a of animaciones) {
    const g: Guion = GUIONES[a.id];
    for (const idioma of IDIOMAS) {
      const etiqueta = (id: string) => a.etiquetas[id]?.[idioma] ?? '';
      for (const movil of [false, true]) {
        const modo = movil ? 'm' : 'd';
        g.atomos.forEach((at: Atomo, i) => {
          const geo = movil ? at.m : at.d;
          if (!Array.isArray(geo)) return;
          const t = componer(segun(at.t, movil), etiqueta);
          const s = componer(segun(at.s, movil), etiqueta);
          const nombre = `${a.id}#${i} ${modo} ${idioma}`;
          if (at.k === 'B') {
            const [, , w] = geo;
            const libre = w - (movil ? 12 : 16) - 4;
            const clase =
              (s ? (at.mono ? 'tm' : 'ti') : at.plano || at.mono ? 'tm' : 'ti') +
              ' ' +
              (at.tc ?? '');
            for (const [texto, c] of [
              [t, clase],
              [s, 'su ' + (at.tc ?? '')],
            ]) {
              const sobra = ancho(texto, c, movil) - libre;
              if (texto && sobra > 0) malos.push(`${nombre} «${texto}» +${Math.ceil(sobra)}`);
            }
          } else if (at.k === 'T' && t) {
            const [x] = geo;
            const w = ancho(t, segun(at.c, movil) ?? '', movil);
            const ancla = segun(at.a, movil) ?? 'start';
            const [ini, fin] =
              ancla === 'start'
                ? [x, x + w]
                : ancla === 'end'
                  ? [x - w, x]
                  : [x - w / 2, x + w / 2];
            const sobra = Math.max(4 - ini, fin - (LIENZO[modo] - 4));
            if (sobra > 0) malos.push(`${nombre} «${t}» +${Math.ceil(sobra)}`);
          }
        });
      }
    }
  }
  return malos;
}
