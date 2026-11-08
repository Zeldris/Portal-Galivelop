import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// Reglas mecánicas de la hoja de estilos de la marca (docs/marca.md, «Reglas»).
// Una línea puede saltárselas con `/* marca: permitido, <motivo> */` en la línea anterior.
const RUTA = join(__dirname, 'global.css');
const lineas = readFileSync(RUTA, 'utf8').split('\n');

/** El CSS con los comentarios en blanco (misma cuenta de líneas): lo que se comprueba es el código, no lo que dice un comentario. */
function sinComentarios(texto: string): string {
  return texto.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' '));
}
const codigo = sinComentarios(lineas.join('\n')).split('\n');

const PERMITIDO = /^\s*\/\*\s*marca: permitido,\s*\S/;
const permitida = (i: number) => i > 0 && PERMITIDO.test(lineas[i - 1]);

/** Valor de la declaración que empieza en la línea `i` (puede seguir en las siguientes hasta `;`). */
function valorDe(i: number, propiedad: string): string {
  const resto = codigo[i].slice(codigo[i].indexOf(':', codigo[i].indexOf(propiedad)) + 1);
  let texto = resto;
  for (let j = i + 1; !texto.includes(';') && j < codigo.length; j++) texto += ' ' + codigo[j];
  return texto.split(';')[0].trim();
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
  codigo.forEach((linea, i) => {
    const motivo = comprueba(linea, i);
    if (motivo && !permitida(i)) out.push(`global.css:${i + 1}: ${motivo} → ${lineas[i].trim()}`);
  });
  return out;
}

describe('hoja de estilos de la marca', () => {
  it.each([
    ['backdrop-filter', /backdrop-filter/, 'sin desenfoques de fondo (regla 2)'],
    ['blur(', /blur\(/, 'sin desenfoques (regla 2)'],
    ['-gradient(', /-gradient\(/, 'sin degradados de fondo (regla 2)'],
    ['drop-shadow(', /drop-shadow\(/, 'sin sombras difusas (reglas 2 y 4)'],
  ])('no usa %s', (_nombre, patron, motivo) => {
    expect(infracciones((l) => (patron.test(l) ? motivo : null))).toEqual([]);
  });

  it('no lleva sombras difusas', () => {
    const fallos = infracciones((l, i) => {
      // También las propiedades propias con forma de sombra (`--sombra`, `--sombra-panel`…).
      const m = l.match(/(?:^|[\s;{])(box-shadow|--[\w-]*sombra[\w-]*)\s*:/);
      if (!m) return null;
      const propiedad = m[1];
      const difusa = desenfoques(valorDe(i, propiedad)).some((d) => d !== 0);
      return difusa ? 'sombra con desenfoque distinto de 0 (reglas 2 y 4)' : null;
    });
    expect(fallos).toEqual([]);
  });

  it('no redondea esquinas', () => {
    const fallos = infracciones((l, i) => {
      // La abreviada y las cuatro esquinas sueltas (`border-top-left-radius`…).
      const m = l.match(/(border(?:-[a-z]+)*-radius)\s*:/);
      if (!m) return null;
      return /^(?:0(?:px)?)(?:\s+0(?:px)?)*$/.test(valorDe(i, m[1]))
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

  it('comprueba el código, no los comentarios', () => {
    const limpio = sinComentarios('a /* blur(\nx */ b');
    expect(limpio).not.toContain('blur(');
    expect(limpio.split('\n')).toHaveLength(2);
    expect(limpio.replace(/ +/g, ' ')).toBe('a \n b');
  });
});
