import { describe, expect, it } from 'vitest';
import { createRequire } from 'node:module';

const { normalizarRuta, motivoNoEstatica } = createRequire(import.meta.url)(
  './pagina-estatica.cjs',
);

const pagina = (canonical, estatico = true) =>
  `<html><head><link rel="canonical" href="https://zeldris.github.io/Portal-Galivelop/${canonical}" /></head><body><main id="contenido"${estatico ? ' data-estatico' : ''}></main></body></html>`;

describe('normalizarRuta', () => {
  it('pone la barra final y quita la inicial', () => {
    expect(['equipo', '/equipo', 'equipo/', 'proyectos/tarkor//'].map(normalizarRuta)).toEqual([
      'equipo/',
      'equipo/',
      'equipo/',
      'proyectos/tarkor/',
    ]);
  });
  it('deja la portada vacía', () => {
    expect(['', '/'].map(normalizarRuta)).toEqual(['', '']);
  });
});

describe('motivoNoEstatica', () => {
  it('acepta la página estática de la ruta', () => {
    expect(motivoNoEstatica(pagina('equipo/'), 'equipo/')).toBeNull();
    expect(motivoNoEstatica(pagina(''), '')).toBeNull();
  });
  it('rechaza el HTML sin data-estatico, con el motivo', () => {
    expect(motivoNoEstatica(pagina('equipo/', false), 'equipo/')).toMatch(/no data-estatico/);
  });
  it('rechaza la portada servida en lugar de la ruta (sin barra final en vite preview)', () => {
    expect(motivoNoEstatica(pagina(''), 'equipo/')).toMatch(
      /returned the page of .*Portal-Galivelop\/ \(expected one ending in \/Portal-Galivelop\/equipo\/\)/,
    );
  });
  it('rechaza la página de otra ruta que acaba igual solo en parte', () => {
    expect(motivoNoEstatica(pagina('proyectos/tarkor/'), 'tarkor/')).toMatch(
      /returned the page of/,
    );
  });
  it('rechaza el HTML sin canonical', () => {
    expect(motivoNoEstatica('<main data-estatico></main>', 'equipo/')).toMatch(/no canonical/);
  });
});
