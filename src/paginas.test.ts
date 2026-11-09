import { describe, expect, it } from 'vitest';
import { paginaDeRuta } from './paginas';

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
