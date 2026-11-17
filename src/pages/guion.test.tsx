import { readFileSync } from 'node:fs';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { ProveedorIdioma } from '../i18n/Idioma';
import galileo from '../data/proyectos/galivelop-image-generator.json';
import workflow from '../data/proyectos/galivelop-workflow.json';
import tarkor from '../data/proyectos/tarkor.json';
import toveriai from '../data/proyectos/toveriai.json';
import type { Proyecto as TipoProyecto } from '../data/tipos';
import type { Guion } from '../utils/guion';
import { Equipo } from './Equipo';
import { Inicio } from './Inicio';
import { Novedades } from './Novedades';
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

const envolver = (pagina: React.ReactNode) =>
  renderToString(
    <StaticRouter location="/">
      <ProveedorIdioma idioma="es" cambiarIdioma={() => {}}>
        {pagina}
      </ProveedorIdioma>
    </StaticRouter>,
  );

const ficha = (p: unknown) => <FichaProyecto p={p as TipoProyecto} />;

describe('secciones y enfoques de los guiones en la página', () => {
  const paginas: [string, React.ReactNode][] = [
    ['inicio', <Inicio />],
    ['tarkor', ficha(tarkor)],
    ['toveriai', ficha(toveriai)],
    ['galivelop-workflow', ficha(workflow)],
    ['galivelop-image-generator', ficha(galileo)],
    ['novedades', <Novedades />],
    ['equipo', <Equipo />],
    ['proponer', <Proponer />],
    ['unirse', <Unirse />],
  ];
  it.each(paginas)('%s', (clave, pagina) => {
    expect(faltan(envolver(pagina), guion(clave))).toEqual([]);
  });
});
