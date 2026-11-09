import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { conBarraFinal } from './Enlace';

describe('conBarraFinal', () => {
  it.each([
    ['/proyectos/tarkor', '/proyectos/tarkor/'],
    ['/proyectos/tarkor/', '/proyectos/tarkor/'],
    ['/muro?proyecto=x#id', '/muro/?proyecto=x#id'],
    ['/muro#id', '/muro/#id'],
    ['/muro/?a=1', '/muro/?a=1'],
    ['/', '/'],
    ['/#lineas', '/#lineas'],
    ['#id', '#id'],
    ['?q=1', '?q=1'],
    ['equipo', 'equipo'],
  ])('%s -> %s', (entrada, salida) => {
    expect(conBarraFinal(entrada)).toBe(salida);
  });
});

function archivosTsx(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const ruta = join(dir, e.name);
    return e.isDirectory() ? archivosTsx(ruta) : ruta.endsWith('.tsx') ? [ruta] : [];
  });
}

describe('importaciones de Link', () => {
  it('ningún .tsx importa Link ni NavLink de react-router-dom (se usa components/Enlace)', () => {
    const malos = archivosTsx('src')
      .filter((f) => !f.endsWith('Enlace.tsx'))
      .filter((f) => {
        const m = [
          ...readFileSync(f, 'utf8').matchAll(/import\s*\{([^}]*)\}\s*from\s*'react-router-dom'/g),
        ];
        return m.some((x) => /\b(Link|NavLink)\b/.test(x[1]));
      });
    expect(malos, `Importan Link/NavLink de react-router-dom: ${malos.join(', ')}`).toEqual([]);
  });
});
