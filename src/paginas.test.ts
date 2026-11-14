import { describe, expect, it, vi } from 'vitest';
import { cargarPagina, olvidarFallos, paginaDeRuta } from './paginas';

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

const BASE = import.meta.env.BASE_URL;

describe('paginaDeRuta (qué chunk se espera antes del primer render)', () => {
  it.each([
    ['', undefined],
    ['gl/', undefined],
    ['proyectos/tarkor/', 'Proyecto'],
    ['proyectos/tarkor', 'Proyecto'],
    ['gl/proyectos/tarkor/', 'Proyecto'],
    ['en/proyectos/galivelop-workflow/', 'Proyecto'],
    ['muro/', 'Muro'],
    ['en/equipo/', 'Equipo'],
    ['equipo/ana/', 'Miembro'],
    ['productos/', 'Productos'],
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
