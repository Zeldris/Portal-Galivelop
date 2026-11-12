import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';

// Reglas mecánicas de la marca (docs/marca.md, «Reglas» y «Alcance»), en todas las hojas de estilo de la web, también
// las de las páginas de proyecto. Una línea puede saltárselas con `/* marca: permitido, <motivo> */` en la línea
// anterior; lo que enseña cada proyecto (galería, capturas), con `/* marca: permitido, contenido del proyecto */`.
const SRC = join(__dirname, '..');

/** Todas las hojas `.css` de `src/`. */
function hojas(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? hojas(join(dir, e.name)) : e.name.endsWith('.css') ? [join(dir, e.name)] : [],
  );
}

/** El CSS con los comentarios en blanco (misma cuenta de líneas): lo que se comprueba es el código, no lo que dice un comentario. */
function sinComentarios(texto: string): string {
  return texto.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' '));
}

const PERMITIDO = /^\s*\/\*\s*marca: permitido,\s*\S/;

interface Hoja {
  nombre: string;
  lineas: string[];
  codigo: string[];
}
const HOJAS: Hoja[] = hojas(SRC).map((ruta) => {
  const texto = readFileSync(ruta, 'utf8');
  return {
    nombre: relative(SRC, ruta),
    lineas: texto.split('\n'),
    codigo: sinComentarios(texto).split('\n'),
  };
});

/** Valor de la declaración que empieza en la línea `i` (puede seguir en las siguientes hasta `;`). */
function valorDe(codigo: string[], i: number, propiedad: string): string {
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

function infracciones(
  comprueba: (linea: string, i: number, hoja: Hoja) => string | null,
): string[] {
  const out: string[] = [];
  for (const hoja of HOJAS) {
    hoja.codigo.forEach((linea, i) => {
      const motivo = comprueba(linea, i, hoja);
      const permitida = i > 0 && PERMITIDO.test(hoja.lineas[i - 1]);
      if (motivo && !permitida)
        out.push(`${hoja.nombre}:${i + 1}: ${motivo} → ${hoja.lineas[i].trim()}`);
    });
  }
  return out;
}

/** Selector del bloque más interno de cada línea (`''` fuera de reglas). */
function selectores(codigo: string[]): string[] {
  const pila: string[] = [];
  let pendiente = '';
  return codigo.map((linea) => {
    const actual = pila.at(-1) ?? '';
    for (const trozo of linea.split(/([{}])/)) {
      if (trozo === '{') {
        pila.push(pendiente.trim());
        pendiente = '';
      } else if (trozo === '}') {
        pila.pop();
        pendiente = '';
      } else if (trozo.includes(';')) pendiente = trozo.slice(trozo.lastIndexOf(';') + 1);
      else pendiente += ' ' + trozo;
    }
    return actual || (pila.at(-1) ?? '');
  });
}

/** Un bloque de tokens: `:root` (o una lista de ellos), con o sin tema (`[data-tema=…]`, `:not(…)`). */
const RAIZ = /^:root(?:\[[^\]]*\]|:not\([^)]*\))*$/;

/** Colores escritos a mano que valen fuera de los tokens: blanco, negro y la noche (velos y tintas sobre imagen). */
const COLOR_SUELTO = /#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?|okl(?:ab|ch)|lab|lch|hwb|color)\(/gi;
const COLOR_VALIDO =
  /^(?:#fff|#ffffff|#000|#000000)(?![0-9a-f])|^rgba?\(\s*(?:255 255 255|0 0 0|3 9 15)\b/i;

describe('hojas de estilo de la marca', () => {
  it('cubre todas las hojas de src/', () => {
    expect(HOJAS.map((h) => h.nombre)).toContain(join('estilos', 'global.css'));
  });

  it('los colores salen de los tokens', () => {
    const raiz = new Map(
      HOJAS.map((h) => [
        h,
        selectores(h.codigo).map((sel) => sel.split(',').every((x) => RAIZ.test(x.trim()))),
      ]),
    );
    const fallos = infracciones((l, i, hoja) => {
      // Un token (`--algo: #hex` en `:root`) define la paleta; el resto de la hoja la usa con var().
      if (raiz.get(hoja)![i] && /^\s*--[\w-]+\s*:/.test(l)) return null;
      const sueltos = [...l.matchAll(COLOR_SUELTO)].filter(
        (m) => !COLOR_VALIDO.test(l.slice(m.index)),
      );
      return sueltos.length ? 'color fuera de la paleta (Alcance)' : null;
    });
    expect(fallos).toEqual([]);
  });

  it.each([
    ['backdrop-filter', /backdrop-filter/, 'sin desenfoques de fondo (regla 2)'],
    ['blur(', /blur\(/, 'sin desenfoques (regla 2)'],
    ['-gradient(', /-gradient\(/, 'sin degradados de fondo (regla 2)'],
    ['drop-shadow(', /drop-shadow\(/, 'sin sombras difusas (reglas 2 y 4)'],
  ])('no usa %s', (_nombre, patron, motivo) => {
    expect(infracciones((l) => (patron.test(l) ? motivo : null))).toEqual([]);
  });

  it('no lleva sombras difusas', () => {
    const fallos = infracciones((l, i, h) => {
      // También las propiedades propias con forma de sombra (`--sombra`, `--sombra-panel`…).
      const m = l.match(/(?:^|[\s;{])(box-shadow|--[\w-]*sombra[\w-]*)\s*:/);
      if (!m) return null;
      const propiedad = m[1];
      const difusa = desenfoques(valorDe(h.codigo, i, propiedad)).some((d) => d !== 0);
      return difusa ? 'sombra con desenfoque distinto de 0 (reglas 2 y 4)' : null;
    });
    expect(fallos).toEqual([]);
  });

  it('no redondea esquinas', () => {
    const fallos = infracciones((l, i, h) => {
      // La abreviada y las cuatro esquinas sueltas (`border-top-left-radius`…).
      const m = l.match(/(border(?:-[a-z]+)*-radius)\s*:/);
      if (!m) return null;
      return /^(?:0(?:px)?)(?:\s+0(?:px)?)*$/.test(valorDe(h.codigo, i, m[1]))
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
