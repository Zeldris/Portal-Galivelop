import { describe, expect, it } from 'vitest';
import {
  enfoqueEn,
  gestoPausa,
  posicionDeFrase,
  rutaNormal,
  teclaPausa,
  type Enfoque,
} from './guion';

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

describe('gestos que pausan el lector', () => {
  const en = (selectores: string[]) => ({
    closest: (s: string) => selectores.some((x) => s.split(', ').includes(x)),
  });
  it('la tecla pausa sobre la página, no sobre controles ni editables', () => {
    expect(teclaPausa(' ', null)).toBe(true);
    expect(teclaPausa(' ', en([]))).toBe(true);
    for (const c of ['input', 'textarea', 'select', 'button', 'a', '[contenteditable]', '.lector'])
      expect(teclaPausa(' ', en([c])), c).toBe(false);
    expect(teclaPausa('a', null)).toBe(false);
  });
  it('rueda y táctil no pausan sobre la barra o el botón del lector', () => {
    expect(gestoPausa(null)).toBe(true);
    expect(gestoPausa(en(['.lector']))).toBe(false);
    expect(gestoPausa(en(['.lector-boton']))).toBe(false);
  });
  it('rutaNormal quita la barra final salvo en la raíz', () => {
    expect(rutaNormal('/equipo/')).toBe('/equipo');
    expect(rutaNormal('/')).toBe('/');
  });
});
