import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// Reglas mecánicas de la hoja de estilos de la marca (docs/marca.md, «Reglas»).
// Una línea puede saltárselas con `/* marca: permitido, <motivo> */` en la línea anterior.
const RUTA = join(__dirname, 'global.css');
const lineas = readFileSync(RUTA, 'utf8').split('\n');

const PERMITIDO = /^\s*\/\*\s*marca: permitido,\s*\S/;
const permitida = (i: number) => i > 0 && PERMITIDO.test(lineas[i - 1]);

/** Valor de la declaración que empieza en la línea `i` (puede seguir en las siguientes hasta `;`). */
function valorDe(i: number, propiedad: string): string {
  const resto = lineas[i].slice(lineas[i].indexOf(':', lineas[i].indexOf(propiedad)) + 1);
  let texto = resto;
  for (let j = i + 1; !texto.includes(';') && j < lineas.length; j++) texto += ' ' + lineas[j];
  return texto
    .split(';')[0]
    .replace(/\/\*.*?\*\//g, '')
    .trim();
}

/** Desenfoque (3.er valor de longitud) de cada sombra de un `box-shadow`. */
function desenfoques(valor: string): number[] {
  if (/^none$/i.test(valor)) return [];
  // Los colores y `var()` llevan comas y números que no son longitudes.
  const sinFunciones = valor.replace(
    /\b(?:rgba?|hsla?|color-mix|var)\((?:[^()]|\([^()]*\))*\)/g,
    ' ',
  );
  return sinFunciones.split(',').flatMap((sombra) => {
    const longitudes = sombra.match(/(?<![\w#.-])-?\d*\.?\d+(?:px|rem|em)?(?![\w%])/g) ?? [];
    return longitudes.length >= 3 ? [parseFloat(longitudes[2])] : [];
  });
}

function infracciones(comprueba: (linea: string, i: number) => string | null): string[] {
  const out: string[] = [];
  lineas.forEach((linea, i) => {
    const motivo = comprueba(linea, i);
    if (motivo && !permitida(i)) out.push(`global.css:${i + 1}: ${motivo} → ${linea.trim()}`);
  });
  return out;
}

describe('hoja de estilos de la marca', () => {
  it.each([
    ['backdrop-filter', /backdrop-filter/, 'sin desenfoques de fondo (regla 2)'],
    ['blur(', /blur\(/, 'sin desenfoques (regla 2)'],
    ['-gradient(', /-gradient\(/, 'sin degradados de fondo (regla 2)'],
  ])('no usa %s', (_nombre, patron, motivo) => {
    expect(infracciones((l) => (patron.test(l) ? motivo : null))).toEqual([]);
  });

  it('no lleva sombras difusas', () => {
    const fallos = infracciones((l, i) => {
      if (!/(?:^|[\s;{])(?:box-shadow|--sombra)\s*:/.test(l)) return null;
      const propiedad = /box-shadow\s*:/.test(l) ? 'box-shadow' : '--sombra';
      const difusa = desenfoques(valorDe(i, propiedad)).some((d) => d !== 0);
      return difusa ? 'sombra con desenfoque distinto de 0 (reglas 2 y 4)' : null;
    });
    expect(fallos).toEqual([]);
  });

  it('no redondea esquinas', () => {
    const fallos = infracciones((l, i) => {
      if (!/border-radius\s*:/.test(l)) return null;
      return /^0(px)?$/.test(valorDe(i, 'border-radius'))
        ? null
        : 'border-radius distinto de 0 (regla 3)';
    });
    expect(fallos).toEqual([]);
  });

  it('el analizador de sombras distingue difusas de filetes', () => {
    expect(desenfoques('0 12px 32px -18px rgb(19 33 43 / 0.35)')).toEqual([32]);
    expect(desenfoques('1px 0 0 var(--borde), 0 1px 0 var(--borde)')).toEqual([0, 0]);
    expect(desenfoques('0 0 0 2px var(--c)')).toEqual([0]);
    expect(desenfoques('none')).toEqual([]);
  });
});
