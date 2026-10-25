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
      const imagenes = rellenar(textos[idioma]['afondo.imagenes'], { n: 1 });
      expect(imagenes).not.toMatch(/imágenes|imaxes|images/);
    }
  });

  it('toda plantilla queda sin marcas y usa las mismas variables en los tres idiomas', () => {
    const variables = (plantilla: string) => [...plantilla.matchAll(/\{(\w+)/g)].map((m) => m[1]).sort().join(',');
    for (const clave of Object.keys(textos.es) as (keyof typeof textos.es)[]) {
      const deEs = variables(textos.es[clave]);
      for (const idioma of ['es', 'gl', 'en'] as const) {
        const plantilla = textos[idioma][clave];
        expect(variables(plantilla), `${idioma} ${clave}`).toBe(deEs);
        const vars = Object.fromEntries(deEs.split(',').filter(Boolean).map((v) => [v, 2]));
        // Una marca mal escrita ({n:elemento} sin «|plural») no se sustituye y saldría en la página.
        expect(rellenar(plantilla, vars), `${idioma} ${clave}`).not.toMatch(/\{\w+[:}]/);
      }
    }
  });
});
