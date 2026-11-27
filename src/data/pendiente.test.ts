import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const ARCHIVO = join(__dirname, '..', '..', 'docs', 'records', 'pending.md');
const TOPE = 400;

describe('docs/records/pending.md', () => {
  it(`ninguna línea pasa de ${TOPE} caracteres`, () => {
    const largas = readFileSync(ARCHIVO, 'utf8')
      .split('\n')
      .map((linea, i) => ({ n: i + 1, largo: [...linea].length }))
      .filter((l) => l.largo > TOPE)
      .map((l) => `línea ${l.n}: ${l.largo} caracteres`);
    expect(largas, `Líneas de más de ${TOPE} caracteres; parte en sub-viñetas`).toEqual([]);
  });
});
