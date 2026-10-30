import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { textos } from './textos';

// Palabras de relleno de marketing: no dicen qué hace nada y suenan a venta (la marca expone, no vende). En vez de
// «revoluciona», decir qué hace. Idea de elayadesign/ai-design-skills (2026-10-30). Una frase se busca sin
// distinguir mayúsculas y por palabra entera.
const RELLENO = [
  // es
  'revoluciona\\w*',
  'de vanguardia',
  'sin esfuerzo',
  'al siguiente nivel',
  'de clase mundial',
  'potencia al máximo',
  'transforma tu flujo',
  // gl
  'revoluciona\\w*',
  'sen esforzo',
  'ao seguinte nivel',
  'de clase mundial',
  // en
  'revolutioni[sz]\\w*',
  'supercharg\\w*',
  'cutting[ -]edge',
  'effortless\\w*',
  'next level',
  'world[ -]class',
  'harness the power',
  'transform your workflow',
];
const patron = new RegExp(`(?<![\\p{L}])(${[...new Set(RELLENO)].join('|')})(?![\\p{L}])`, 'iu');

/** Todas las cadenas de un valor JSON, con la ruta donde está cada una. */
function cadenas(valor: unknown, ruta: string): [string, string][] {
  if (typeof valor === 'string') return [[ruta, valor]];
  if (Array.isArray(valor)) return valor.flatMap((v, i) => cadenas(v, `${ruta}[${i}]`));
  if (valor && typeof valor === 'object')
    return Object.entries(valor).flatMap(([k, v]) => cadenas(v, `${ruta}.${k}`));
  return [];
}

function jsonDe(dir: string): [string, unknown][] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e): [string, unknown][] => {
    const ruta = join(dir, e.name);
    if (e.isDirectory()) return jsonDe(ruta);
    return e.name.endsWith('.json') ? [[ruta, JSON.parse(readFileSync(ruta, 'utf8'))]] : [];
  });
}

describe('textos visibles sin palabras de relleno', () => {
  it('detecta el relleno en los tres idiomas', () => {
    expect(patron.test('Revolucionamos el desarrollo')).toBe(true);
    expect(patron.test('Leva o proxecto ao seguinte nivel')).toBe(true);
    expect(patron.test('A cutting-edge tool')).toBe(true);
    expect(patron.test('Revisión sin errores')).toBe(false);
  });

  it('ni textos.ts ni los datos de src/data lo usan', () => {
    const todas = [
      ...cadenas(textos, 'textos'),
      ...jsonDe('src/data').flatMap(([f, d]) => cadenas(d, f)),
    ];
    expect(
      todas.filter(([, texto]) => patron.test(texto)).map(([ruta, texto]) => `${ruta}: ${texto}`),
    ).toEqual([]);
  });
});
