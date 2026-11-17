import { describe, expect, it } from 'vitest';
import { enfoqueEn, posicionDeFrase, type Enfoque } from './guion';

const es = 'Uno dos tres cuatro cinco seis siete ocho nueve diez';
const enfoques: Enfoque[] = [
  { frase: 'tres', ver: 'a' },
  { frase: 'seis', ver: 'b' },
  { frase: 'nueve', ver: 'c' },
];

describe('enfoqueEn', () => {
  it('la posición de una frase es su fracción del texto', () => {
    expect(posicionDeFrase(es, 'Uno')).toBe(0);
    expect(posicionDeFrase(es, 'tres')).toBeCloseTo(8 / es.length);
    expect(posicionDeFrase(es, 'zzz')).toBe(-1);
  });
  it('antes de la primera frase no hay enfoque', () => {
    expect(enfoqueEn(es, enfoques, 0)).toBeNull();
    expect(enfoqueEn(es, undefined, 0.5)).toBeNull();
  });
  it('elige el último enfoque alcanzado', () => {
    expect(enfoqueEn(es, enfoques, 0.2)?.ver).toBe('a');
    expect(enfoqueEn(es, enfoques, posicionDeFrase(es, 'seis') + 0.001)?.ver).toBe('b');
    expect(enfoqueEn(es, enfoques, 1)?.ver).toBe('c');
  });
  it('se adelanta un poco a la frase', () => {
    const pos = posicionDeFrase(es, 'seis');
    expect(enfoqueEn(es, enfoques, pos - 0.001, 0.01)?.ver).toBe('b');
    expect(enfoqueEn(es, enfoques, pos - 0.05, 0.01)?.ver).toBe('a');
  });
  it('no depende del orden en que se escriben los enfoques ni falla con una frase ausente', () => {
    const revuelto = [enfoques[2], { frase: 'no está', ver: 'x' }, enfoques[0]];
    expect(enfoqueEn(es, revuelto, 0.95)?.ver).toBe('c');
    expect(enfoqueEn(es, revuelto, 0.3)?.ver).toBe('a');
  });
});
