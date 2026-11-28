import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { entradas, textosDe } from './diario';
import { metatexto } from './metatexto';
import { IDIOMAS } from './tipos';

const MEDIA = join(__dirname, '..', '..', 'docs', 'media');

/** Los textos de canal de cada pieza de docs/media (todo .md salvo la hoja, `sheet.md` o `ficha.md`, y las propuestas). */
function textosDePiezas(): string[] {
  const salida: string[] = [];
  const recorrer = (dir: string) => {
    for (const nombre of readdirSync(dir)) {
      const ruta = join(dir, nombre);
      if (statSync(ruta).isDirectory()) {
        if (nombre !== 'proposals' && nombre !== 'propuestas' && nombre !== 'media') recorrer(ruta);
      } else if (nombre.endsWith('.md') && nombre !== 'sheet.md' && nombre !== 'ficha.md')
        salida.push(ruta);
    }
  };
  recorrer(MEDIA);
  return salida;
}

describe('metatexto: el texto público no habla de sí mismo', () => {
  it('detecta las frases que ya se colaron', () => {
    expect(metatexto('Lo he resumido mucho. Mías son solo las palabras.')).toEqual([
      'he resumido',
      'Mías son solo',
    ]);
    expect(metatexto('La he elegido porque también es una luz.')).toEqual(['La he elegido porque']);
    expect(metatexto('The image at the top is not from the Genesis.')).toEqual([
      'The image at the top is not',
    ]);
  });

  it('no salta con texto normal sobre el tema', () => {
    expect(metatexto('se ponen encima al final, para que no salgan letras inventadas')).toEqual([]);
    expect(metatexto('Aún no hemos medido cuánto se calienta la consola.')).toEqual([]);
  });

  for (const e of entradas) {
    it(`diario «${e.slug}»: sin metatexto`, () => {
      for (const idioma of IDIOMAS)
        expect(metatexto(textosDe(e, idioma).join('\n')), idioma).toEqual([]);
    });
  }

  for (const ruta of textosDePiezas()) {
    it(`pieza ${ruta.slice(MEDIA.length + 1)}: sin metatexto`, () => {
      expect(metatexto(readFileSync(ruta, 'utf8'))).toEqual([]);
    });
  }
});
