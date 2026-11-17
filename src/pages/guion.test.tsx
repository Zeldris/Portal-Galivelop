import { readFileSync } from 'node:fs';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { ProveedorIdioma } from '../i18n/Idioma';
import tarkor from '../data/proyectos/tarkor.json';
import type { Proyecto as TipoProyecto } from '../data/tipos';
import type { Guion } from '../utils/guion';
import { Inicio } from './Inicio';
import { FichaProyecto } from './Proyecto';

const guion = (clave: string) =>
  JSON.parse(readFileSync(`src/data/guiones/${clave}.json`, 'utf8')) as Guion;

/** Cada sección del guion existe en la página renderizada: por `id` o por `data-guion`. */
function faltan(html: string, g: Guion) {
  return g.trozos
    .map((t) => t.seccion)
    .filter((s) => !html.includes(`id="${s}"`) && !html.includes(`data-guion="${s}"`));
}

const envolver = (pagina: React.ReactNode) =>
  renderToString(
    <StaticRouter location="/">
      <ProveedorIdioma idioma="es" cambiarIdioma={() => {}}>
        {pagina}
      </ProveedorIdioma>
    </StaticRouter>,
  );

describe('secciones de los guiones en la página', () => {
  it('inicio', () => {
    expect(faltan(envolver(<Inicio />), guion('inicio'))).toEqual([]);
  });
  it('tarkor', () => {
    const html = envolver(<FichaProyecto p={tarkor as unknown as TipoProyecto} />);
    expect(faltan(html, guion('tarkor'))).toEqual([]);
  });
});
