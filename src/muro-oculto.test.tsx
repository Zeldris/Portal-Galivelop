import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Pie } from './components/Pie';
import { ProveedorIdioma } from './i18n/Idioma';
import { Muro } from './pages/Muro';
import { Novedades } from './pages/Novedades';
import { cargarFicha } from './data/proyectos';
import { FichaProyecto } from './pages/Proyecto';

// El muro se oculta por debajo del umbral (src/data/muro-umbral.ts): se inyecta `hayMuro` para probar los dos lados
// sin añadir publicaciones falsas a src/data/muro/.
const { PUBS, estado } = vi.hoisted(() => {
  const tx = (t: string) => ({ es: t, gl: t, en: t });
  return {
    estado: { hayMuro: false },
    PUBS: [4, 3, 2, 1].map((n) => ({
      proyecto: 'tarkor',
      pieza: `2026-01-0${n}-p${n}`,
      fecha: `2026-01-0${n}`,
      titulo: tx(`Publicacion ${n}`),
      texto: tx(`Texto ${n}`),
    })),
  };
});
vi.mock('./data/muro', async (original) => {
  const real = await original<typeof import('./data/muro')>();
  return {
    ...real,
    get hayMuro() {
      return estado.hayMuro;
    },
    publicacionesDe: (slug: string) => (slug === 'tarkor' ? PUBS : []),
  };
});
vi.mock('./data/novedades', () => ({
  entradas: PUBS.map((p) => ({
    tipo: 'publicacion',
    proyecto: p.proyecto,
    fecha: p.fecha,
    publicacion: p,
  })),
}));

const pagina = (el: React.ReactElement, ruta = '/') =>
  renderToString(
    <ProveedorIdioma idioma="es" cambiarIdioma={() => {}}>
      <MemoryRouter initialEntries={[ruta]}>{el}</MemoryRouter>
    </ProveedorIdioma>,
  );

const fichaTarkor = async () => {
  const ficha = await cargarFicha('tarkor');
  return pagina(<FichaProyecto p={ficha!} />);
};

beforeEach(() => {
  estado.hayMuro = false;
});

describe('muro por debajo del umbral', () => {
  it('el pie no enlaza a /muro', () => {
    expect(pagina(<Pie />)).not.toContain('/muro');
  });
  it('/novedades enlaza cada publicación a la ficha, no al muro', () => {
    const html = pagina(<Novedades />);
    expect(html).toContain('Publicacion 4');
    expect(html).not.toContain('/muro');
    expect(html).toContain('href="/proyectos/tarkor/"');
  });
  it('la ficha enseña las publicaciones sin enlace al muro ni «ver todas»', async () => {
    const html = await fichaTarkor();
    expect(html).toContain('Publicacion 4');
    expect(html).not.toContain('/muro');
  });
  it('/muro enseña la página de no encontrado, no el muro', () => {
    const html = pagina(<Muro />);
    expect(html).toContain('no-encontrado');
    expect(html).not.toContain('muro-contenedor');
  });
});

describe('muro en el umbral', () => {
  beforeEach(() => {
    estado.hayMuro = true;
  });
  it('el pie enlaza a /muro', () => {
    expect(pagina(<Pie />)).toContain('href="/muro');
  });
  it('/novedades enlaza las publicaciones al muro', () => {
    expect(pagina(<Novedades />)).toContain('href="/muro/?proyecto=tarkor"');
  });
  it('la ficha enlaza las publicaciones al muro y enseña «ver todas»', async () => {
    const html = await fichaTarkor();
    expect(html).toContain('href="/muro/?proyecto=tarkor#tarkor-2026-01-04-p4"');
    expect(html).toContain('href="/muro/?proyecto=tarkor"');
  });
  it('/muro enseña el muro', () => {
    const html = pagina(<Muro />);
    expect(html).toContain('muro-contenedor');
    expect(html).not.toContain('no-encontrado');
  });
});
