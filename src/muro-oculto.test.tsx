import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Pie } from './components/Pie';
import { ProveedorIdioma } from './i18n/Idioma';
import { Muro } from './pages/Muro';

// El muro se oculta por debajo del umbral (src/data/muro-umbral.ts): se inyecta `hayMuro` para probar los dos lados
// sin añadir publicaciones falsas a src/data/muro/.
const estado = vi.hoisted(() => ({ hayMuro: false }));
vi.mock('./data/muro', async (original) => ({
  ...(await original<typeof import('./data/muro')>()),
  get hayMuro() {
    return estado.hayMuro;
  },
}));

const pagina = (el: React.ReactElement) =>
  renderToString(
    <ProveedorIdioma idioma="es" cambiarIdioma={() => {}}>
      <MemoryRouter>{el}</MemoryRouter>
    </ProveedorIdioma>,
  );

beforeEach(() => {
  estado.hayMuro = false;
});

describe('muro por debajo del umbral', () => {
  it('el pie no enlaza a /muro', () => {
    expect(pagina(<Pie />)).not.toContain('/muro');
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
  it('/muro enseña el muro', () => {
    const html = pagina(<Muro />);
    expect(html).toContain('muro-contenedor');
    expect(html).not.toContain('no-encontrado');
  });
});
