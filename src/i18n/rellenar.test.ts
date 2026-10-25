import { describe, expect, it } from 'vitest';
import { rellenar } from './rellenar';
import { textos } from './textos';

describe('rellenar', () => {
  it('pone las variables y deja escritas las que faltan', () => {
    expect(rellenar('Imagen {n} de {total}', { n: 2, total: 5 })).toBe('Imagen 2 de 5');
    expect(rellenar('Imagen {n} de {total}', { n: 2 })).toBe('Imagen 2 de {total}');
  });

  it('elige singular o plural según el número', () => {
    expect(rellenar('{n} {n:elemento|elementos}', { n: 1 })).toBe('1 elemento');
    expect(rellenar('{n} {n:elemento|elementos}', { n: 3 })).toBe('3 elementos');
    expect(rellenar('{n} {n:elemento|elementos}', { n: 0 })).toBe('0 elementos');
  });

  it('los textos con plural salen en singular con 1 en los tres idiomas', () => {
    for (const idioma of ['es', 'gl', 'en'] as const) {
      const hitos = rellenar(textos[idioma]['vistazo.hitos'], { hechos: 1, total: 1 });
      expect(hitos).not.toMatch(/hitos|fitos|milestones/);
      const elementos = rellenar(textos[idioma]['afondo.elementos'], { n: 1 });
      expect(elementos).not.toMatch(/elementos|items/);
    }
  });
});
