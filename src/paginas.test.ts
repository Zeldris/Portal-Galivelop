import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it, vi } from 'vitest';
import { cargarPagina, olvidarFallos, paginaDeRuta } from './paginas';
import { paginaDeSegmentos } from './rutas';

describe('cargarPagina (fallo de un chunk)', () => {
  it('guarda el fallo hasta olvidarFallos: React no pide otro import en cada reintento', async () => {
    vi.doMock('./pages/Muro', () => {
      throw new Error('red cortada');
    });
    const primera = cargarPagina('Muro');
    // vitest envuelve el error de la fábrica: el motivo es el fallo simulado al importar.
    await expect(primera).rejects.toThrow(/error when mocking/);
    expect(cargarPagina('Muro')).toBe(primera);
    olvidarFallos();
    vi.doUnmock('./pages/Muro');
    const segunda = cargarPagina('Muro');
    expect(segunda).not.toBe(primera);
    await expect(segunda).resolves.toBeTypeOf('function');
  });
});

describe('Inicio (reintento tras un fallo)', () => {
  it('olvidarFallos permite reintentar el import de Inicio', async () => {
    vi.doMock('./pages/Inicio', () => {
      throw new Error('red cortada');
    });
    const primera = cargarPagina('Inicio');
    await expect(primera).rejects.toThrow(/error when mocking/);
    expect(cargarPagina('Inicio')).toBe(primera);
    olvidarFallos();
    vi.doUnmock('./pages/Inicio');
    const segunda = cargarPagina('Inicio');
    expect(segunda).not.toBe(primera);
    await expect(segunda).resolves.toBeTypeOf('function');
  });
});

const BASE = import.meta.env.BASE_URL;

describe('paginaDeRuta (qué chunk se espera antes del primer render)', () => {
  it.each([
    ['', 'Inicio'],
    ['gl/', 'Inicio'],
    ['en/', 'Inicio'],
    ['proyectos/tarkor/', 'Proyecto'],
    ['proyectos/tarkor', 'Proyecto'],
    ['gl/proyectos/tarkor/', 'Proyecto'],
    ['en/proyectos/galivelop-workflow/', 'Proyecto'],
    ['muro/', 'Muro'],
    ['en/equipo/', 'Equipo'],
    ['equipo/ana/', 'Miembro'],
    ['productos/', 'Productos'],
    ['productos/galivelop-developer/', 'Producto'],
    ['gl/productos/galivelop-developer/', 'Producto'],
    ['productos/galivelop-evaluator/', 'Producto'],
    ['gl/productos/galivelop-evaluator/', 'Producto'],
    ['productos/galivelop-developer/otra/', 'NoEncontrado'],
    ['diario/', 'Diario'],
    ['gl/diario/', 'Diario'],
    ['diario/railes-no-solo-instrucciones/', 'EntradaDiario'],
    ['en/diario/railes-no-solo-instrucciones/', 'EntradaDiario'],
    ['diario/railes-no-solo-instrucciones/otra/', 'NoEncontrado'],
    ['participa/proponer/', 'Proponer'],
    ['gl/participa/unirse/', 'Unirse'],
    ['aviso-legal/', 'Legal'],
    ['privacidad/', 'Legal'],
    ['terminos/', 'Legal'],
    ['proyectos/', 'NoEncontrado'],
    ['muro/otra/', 'NoEncontrado'],
    ['no-existe/', 'NoEncontrado'],
  ])('%s -> %s', (ruta, pagina) => {
    expect(paginaDeRuta(BASE + ruta)).toBe(pagina);
  });
});

// La misma tabla la usa scripts/paginas-estaticas.mjs para el `modulepreload` de cada página: una ruta que generase y
// que aquí diese «NoEncontrado» rompe el build.
describe('paginaDeSegmentos (tabla compartida con paginas-estaticas.mjs)', () => {
  it('cada texto legal de src/data/legal tiene página Legal', () => {
    const slugs = readdirSync('src/data/legal')
      .filter((f) => f.endsWith('.json'))
      .map((f) => JSON.parse(readFileSync(`src/data/legal/${f}`, 'utf8')).slug as string);
    expect(slugs.length).toBeGreaterThan(0);
    expect(slugs.filter((s) => paginaDeSegmentos([s]) !== 'Legal')).toEqual([]);
  });

  it('un nombre heredado de Object no es una página', () => {
    expect(paginaDeSegmentos(['constructor'])).toBe('NoEncontrado');
    expect(paginaDeSegmentos(['toString'])).toBe('NoEncontrado');
  });
});
