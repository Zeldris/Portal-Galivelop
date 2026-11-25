import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { hayMuro, publicaciones } from './muro';
import { muroVisible, UMBRAL_MURO } from './muro-umbral';

describe('umbral del muro (R-2: oculto hasta tener 3 publicaciones)', () => {
  it('el umbral es 3', () => expect(UMBRAL_MURO).toBe(3));

  it('por debajo del umbral no hay muro; en el umbral y por encima, sí', () => {
    expect([0, 1, 2].map((n) => muroVisible(n))).toEqual([false, false, false]);
    expect([3, 4, 10].map((n) => muroVisible(n))).toEqual([true, true, true]);
  });

  it('acepta otro umbral inyectado', () => {
    expect(muroVisible(1, 2)).toBe(false);
    expect(muroVisible(2, 2)).toBe(true);
  });

  it('hayMuro de la web sale de las publicaciones reales y del mismo umbral', () => {
    expect(hayMuro).toBe(publicaciones.length >= UMBRAL_MURO);
  });

  it('el script de páginas estáticas importa el mismo umbral, sin copiar el número', () => {
    const script = readFileSync(join(__dirname, '../../scripts/paginas-estaticas.mjs'), 'utf8');
    expect(script).toContain("from '../src/data/muro-umbral.ts'");
    expect(script).not.toMatch(/publicaciones\.length\s*>\s*0/);
  });
});
