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
    ['/llms.txt', '/llms.txt'],
    ['/sitemap.xml', '/sitemap.xml'],
    ['/sitemap.xml?v=1#a', '/sitemap.xml?v=1#a'],
    ['/gl/robots.txt', '/gl/robots.txt'],
    ['/proyectos/v1.2/', '/proyectos/v1.2/'],
    ['/proyectos/v1.2', '/proyectos/v1.2'],
    ['/v1.2/muro', '/v1.2/muro/'],
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

/** Importaciones de Link o NavLink desde react-router(-dom): con llaves, con alias o con espacio de nombres. */
function importaLinkDelRouter(codigo: string): boolean {
  const desde = String.raw`from\s*['"]react-router(?:-dom)?['"]`;
  const conLlaves = new RegExp(String.raw`import\s*(?:[\w$]+\s*,\s*)?\{([^}]*)\}\s*${desde}`, 'g');
  if ([...codigo.matchAll(conLlaves)].some((m) => /\b(Link|NavLink)\b/.test(m[1]))) return true;
  // `import * as X from 'react-router-dom'` da acceso a X.Link: tampoco se admite.
  return new RegExp(String.raw`import\s*\*\s*as\s+[\w$]+\s*${desde}`).test(codigo);
}

describe('importaciones de Link', () => {
  it('ningún .tsx importa Link ni NavLink de react-router(-dom) (se usa components/Enlace)', () => {
    const malos = archivosTsx('src')
      .filter((f) => !f.endsWith('Enlace.tsx'))
      .filter((f) => importaLinkDelRouter(readFileSync(f, 'utf8')));
    expect(malos, `Importan Link/NavLink del router: ${malos.join(', ')}`).toEqual([]);
  });

  it('detecta las formas de importar del router y deja pasar Enlace', () => {
    for (const mala of [
      "import { Link } from 'react-router-dom';",
      "import { Link } from 'react-router';",
      'import { useParams, NavLink } from "react-router-dom";',
      "import { Link as L } from 'react-router';",
      "import {\n  useParams,\n  Link,\n} from 'react-router-dom';",
      "import * as Router from 'react-router-dom';",
      "import * as R from 'react-router';",
      "import Router, { Link } from 'react-router';",
    ])
      expect(importaLinkDelRouter(mala), mala).toBe(true);
    for (const buena of [
      "import { useParams, useLocation } from 'react-router-dom';",
      "import { Link } from '../components/Enlace';",
      "import { Link, type LinkProps } from './Enlace';",
      "import { Route, Routes } from 'react-router';",
    ])
      expect(importaLinkDelRouter(buena), buena).toBe(false);
  });
});
