import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, it } from 'vitest';

// Los tokens que declara `:root` en global.css (antes de la primera regla de componente) tienen que estar en la
// tabla de tokens de docs/marca.md. Habría cazado el `--chaflan` que faltaba. Las escalas `--z-*`, `--espacio-N`, `--espacio-neg-N` y `--letra-N` se documentan juntas.
const css = readFileSync(join(__dirname, 'global.css'), 'utf8');
const marca = readFileSync(join(__dirname, '../../docs/marca.md'), 'utf8');

it('docs/marca.md documenta todos los tokens de :root', () => {
  const cabecera = css.slice(0, css.indexOf('.cabecera {'));
  const tokens = [...new Set([...cabecera.matchAll(/^\s*(--[a-z0-9-]+):/gm)].map((m) => m[1]))];
  const sinDocumentar = tokens.filter(
    (t) =>
      !t.startsWith('--z-') &&
      !/^--(espacio|letra)-(neg-)?\d/.test(t) &&
      !marca.includes('`' + t + '`'),
  );
  expect(sinDocumentar).toEqual([]);
});
