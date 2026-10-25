import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { leerAncla } from './ancla';

describe('leerAncla', () => {
  it('quita la almohadilla y decodifica', () => {
    expect(leerAncla('#ap-%C3%B1u')).toBe('ap-ñu');
    expect(leerAncla('')).toBe('');
  });

  it('devuelve un ancla cortada tal cual en vez de lanzar URIError', () => {
    expect(leerAncla('#%E0%A4%A')).toBe('%E0%A4%A');
  });
});

describe('anclas en src/', () => {
  it('nadie decodifica la URL con decodeURIComponent suelto: se usa leerAncla()', () => {
    const raiz = join(__dirname, '..');
    const archivos = (readdirSync(raiz, { recursive: true }) as string[]).filter(
      (f) => /\.tsx?$/.test(f) && !/\.test\.tsx?$/.test(f) && !f.endsWith(join('utils', 'ancla.ts')),
    );
    const sueltos = archivos.filter((f) => readFileSync(join(raiz, f), 'utf8').includes('decodeURIComponent'));
    expect(sueltos).toEqual([]);
  });
});
