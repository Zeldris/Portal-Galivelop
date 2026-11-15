import { readFileSync } from 'node:fs';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Galeria } from './components/Galeria';
import { ProveedorIdioma } from './i18n/Idioma';
import { Cifras } from './pages/Miembro';
import type { Persona } from './data/equipo';
import { queryCambiaElRender } from './paginas';
import { ICONOS_PORTADA } from './data/iconos-portada';

const envuelto = (hijo: React.ReactNode) =>
  renderToString(
    <ProveedorIdioma idioma="es" cambiarIdioma={() => {}}>
      {hijo}
    </ProveedorIdioma>,
  );

afterEach(() => vi.unstubAllGlobals());

describe('Galería y prefers-reduced-motion', () => {
  const img = {
    src: 'a.webp',
    mini: 'a.webp',
    ancho: 10,
    alto: 10,
    alt: { es: 'a', gl: 'a', en: 'a' },
  };
  const grupos = [{ id: 'g', etiqueta: 'g', imagenes: [img, img] }];

  it('el primer render no depende de la preferencia: lleva el botón de pausar igual que el HTML publicado', () => {
    const sin = envuelto(<Galeria grupos={grupos} />);
    vi.stubGlobal('window', { matchMedia: () => ({ matches: true }) });
    const con = envuelto(<Galeria grupos={grupos} />);
    expect(sin).toContain('Pausar la rotación');
    expect(con).toBe(sin);
  });
});

describe('Cifras del miembro', () => {
  it('lleva el mismo número de cifras aunque la fecha cambie los años (cero o uno)', () => {
    vi.useFakeTimers();
    const persona = {
      proyectos: [],
      perfil: { trayectoria: [{ titulo: { es: 'x', gl: 'x', en: 'x' }, desde: '2026-10' }] },
    } as unknown as Persona;
    vi.setSystemTime(new Date(2026, 10, 15));
    const pronto = envuelto(<Cifras p={persona} />);
    vi.setSystemTime(new Date(2028, 10, 15));
    const tarde = envuelto(<Cifras p={persona} />);
    vi.useRealTimers();
    expect((pronto.match(/<li/g) ?? []).length).toBe((tarde.match(/<li/g) ?? []).length);
    expect(pronto).toContain('<li');
  });
});

describe('hidratación saltada solo con parámetros que cambian el render', () => {
  it.each([
    ['?utm_source=x&fbclid=abc', false],
    ['', false],
    ['?proyecto=tarkor', true],
    ['?utm=1&modo=aprender', true],
  ])('%s', (search, esperado) => {
    expect(queryCambiaElRender(search)).toBe(esperado);
  });
});

describe('iconos de la portada', () => {
  it('se precargan todos los que pinta Inicio', () => {
    for (const n of [
      'compas',
      'candado',
      'mira',
      'historial',
      'ramas-unidas',
      'ramas',
      'bombilla',
      'terminal',
    ])
      expect(ICONOS_PORTADA).toContain(n);
  });
});

describe('IconoMarca', () => {
  it('un chunk que no llega deja el SVG vacío: no relanza el error en el render', () => {
    expect(readFileSync('src/components/IconoMarca.tsx', 'utf8')).not.toMatch(/throw error/);
  });
});
