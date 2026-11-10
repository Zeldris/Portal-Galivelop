import { describe, expect, it } from 'vitest';
import { fichasCompletas } from './fichasCompletas';
import { entradas, juntarNovedades } from './novedades';
import type { Publicacion } from './tipos';

const texto = (s: string) => ({ es: s, gl: s, en: s });

describe('novedades', () => {
  it('juntan todas las novedades de todas las fichas', () => {
    const esperadas = fichasCompletas.reduce((n, f) => n + f.novedades.length, 0);
    expect(entradas.filter((e) => e.tipo === 'novedad')).toHaveLength(esperadas);
    for (const f of fichasCompletas) {
      for (const n of f.novedades) {
        expect(entradas).toContainEqual({ tipo: 'novedad', proyecto: f.slug, ...n });
      }
    }
  });

  it('van de la más reciente a la más antigua', () => {
    const fechas = entradas.map((e) => e.fecha);
    expect(fechas).toEqual([...fechas].sort().reverse());
  });

  it('mezclan las publicaciones del muro por fecha, y el mismo día la publicación va antes', () => {
    const post = {
      proyecto: 'b',
      pieza: 'x',
      fecha: '2026-01-02',
      titulo: texto('t'),
      texto: texto('p'),
    };
    const lista = juntarNovedades(
      [
        { proyecto: 'a', fecha: '2026-01-01', texto: texto('vieja') },
        { proyecto: 'a', fecha: '2026-01-02', texto: texto('mismo día') },
        { proyecto: 'a', fecha: '2026-01-03', texto: texto('nueva') },
      ],
      [post as Publicacion],
    );
    expect(lista.map((e) => (e.tipo === 'novedad' ? e.texto.es : 'post'))).toEqual([
      'nueva',
      'post',
      'mismo día',
      'vieja',
    ]);
  });

  it('el mismo día ordena las novedades por proyecto, como la página estática', () => {
    const lista = juntarNovedades(
      [
        { proyecto: 'zeta', fecha: '2026-01-01', texto: texto('z1') },
        { proyecto: 'alfa', fecha: '2026-01-01', texto: texto('a1') },
        { proyecto: 'zeta', fecha: '2026-01-01', texto: texto('z2') },
      ],
      [],
    );
    expect(lista.map((e) => (e.tipo === 'novedad' ? e.texto.es : 'post'))).toEqual([
      'a1',
      'z1',
      'z2',
    ]);
  });
});
