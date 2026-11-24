import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { renderToString } from 'react-dom/server';
import { Route, Routes, StaticRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { ProveedorIdioma } from '../i18n/Idioma';
import type { Proyecto as TipoProyecto } from '../data/tipos';
import type { Guion } from '../utils/guion';
import { Equipo } from './Equipo';
import { Inicio } from './Inicio';
import { Miembro } from './Miembro';
import { Novedades } from './Novedades';
import { Producto } from './Producto';
import { Productos } from './Productos';
import { Proponer } from './Proponer';
import { FichaProyecto } from './Proyecto';
import { Unirse } from './Unirse';

const guion = (clave: string) =>
  JSON.parse(readFileSync(`src/data/guiones/${clave}.json`, 'utf8')) as Guion;

/** Lo que el lector busca (`id` o `data-guion`) y no está en la página renderizada: secciones y elementos de los enfoques. */
function faltan(html: string, g: Guion) {
  const hay = (v: string) => html.includes(`id="${v}"`) || html.includes(`data-guion="${v}"`);
  const pedidos = g.trozos.flatMap((t) => [t.seccion, ...(t.enfoques ?? []).map((e) => e.ver)]);
  return [...new Set(pedidos)].filter((v) => !hay(v));
}

const envolver = (pagina: React.ReactNode, ubicacion = '/') =>
  renderToString(
    <StaticRouter location={ubicacion}>
      <ProveedorIdioma idioma="es" cambiarIdioma={() => {}}>
        {pagina}
      </ProveedorIdioma>
    </StaticRouter>,
  );

const ficha = (p: unknown) => <FichaProyecto p={p as TipoProyecto} />;

const claves = readdirSync('src/data/guiones')
  .filter((f) => f.endsWith('.json'))
  .map((f) => f.replace(/\.json$/, ''));
const ficheroProyecto = (clave: string) => `src/data/proyectos/${clave}.json`;

const estaticas: Record<string, React.ReactNode> = {
  inicio: <Inicio />,
  novedades: <Novedades />,
  equipo: <Equipo />,
  productos: <Productos />,
  proponer: <Proponer />,
  unirse: <Unirse />,
};

/** La página de un guion: la estática de su clave, la ficha del proyecto de ese slug o la de un miembro (`/equipo/<id>`). */
function paginaDe(clave: string): string {
  const g = guion(clave);
  if (clave in estaticas) return envolver(estaticas[clave], g.pagina);
  if (existsSync(ficheroProyecto(clave))) {
    const p = JSON.parse(readFileSync(ficheroProyecto(clave), 'utf8'));
    return envolver(ficha(p), g.pagina);
  }
  if (g.pagina.startsWith('/equipo/')) {
    // La página de un miembro sale de su `id` en la ruta: se monta con la ruta de la app.
    const pagina = (
      <Routes>
        <Route path="/equipo/:id" element={<Miembro />} />
      </Routes>
    );
    return envolver(pagina, g.pagina);
  }
  if (g.pagina.startsWith('/productos/')) {
    const pagina = (
      <Routes>
        <Route path="/productos/:slug" element={<Producto />} />
      </Routes>
    );
    return envolver(pagina, g.pagina);
  }
  throw new Error(
    `El guion «${clave}» no tiene página conocida en guion.test.tsx: añádela (estática, proyecto, miembro o producto)`,
  );
}

describe('secciones y enfoques de los guiones en la página', () => {
  it('hay guiones que comprobar', () => {
    expect(claves.length).toBeGreaterThan(0);
  });
  it.each(claves)('%s', (clave) => {
    expect(faltan(paginaDe(clave), guion(clave))).toEqual([]);
  });
});
