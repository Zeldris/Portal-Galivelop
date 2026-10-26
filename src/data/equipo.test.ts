import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { agruparPorLugar, anosTrabajados, equipo, type Etapa } from './equipo';
import { tieneIcono, tonoIcono } from '../components/IconoTecnologia';

const PUBLIC = join(__dirname, '../../public');
const etapa = (lugar: string, desde: string, hasta?: string): Etapa => ({
  titulo: { es: 'x', gl: 'x', en: 'x' },
  lugar,
  desde,
  hasta,
});

describe('perfil de cada miembro', () => {
  it('cada tecnología tiene logo o monograma (si no, añádela en IconoTecnologia.tsx)', () => {
    const todas = equipo.flatMap((p) => (p.perfil?.tecnologias ?? []).flatMap((g) => g.lista));
    expect(todas.filter((x) => !tieneIcono(x))).toEqual([]);
  });

  it('los logos de empresas y centros existen en public/', () => {
    const logos = equipo.flatMap((p) => [...(p.perfil?.trayectoria ?? []), ...(p.perfil?.formacion ?? [])]);
    expect(logos.flatMap((e) => (e.logo ? [e.logo] : [])).filter((l) => !existsSync(join(PUBLIC, l)))).toEqual([]);
  });

  it('agrupa las etapas seguidas en el mismo sitio, sin juntar las que vuelven más tarde', () => {
    const lugares = agruparPorLugar([
      etapa('A', '2023-02'),
      etapa('A', '2021-03', '2023-02'),
      etapa('B', '2020-03', '2021-03'),
      etapa('A', '2018-01', '2019-01'),
    ]);
    expect(lugares.map((l) => [l.lugar, l.etapas.length])).toEqual([
      ['A', 2],
      ['B', 1],
      ['A', 1],
    ]);
  });

  it('el logo de un sitio es el de cualquiera de sus etapas', () => {
    const [l] = agruparPorLugar([etapa('A', '2023-02'), { ...etapa('A', '2021-03', '2023-02'), logo: 'a.svg' }]);
    expect(l.logo).toBe('a.svg');
  });

  it('un sitio junta los clientes y el negocio de todas sus etapas, sin repetirlos', () => {
    const [l] = agruparPorLugar([
      { ...etapa('A', '2023-02'), clientes: ['X', 'Y'], negocio: ['B2C'] },
      { ...etapa('A', '2021-03', '2023-02'), clientes: ['Y', 'Z'], negocio: ['B2C', 'B2B'] },
    ]);
    expect(l.clientes).toEqual(['X', 'Y', 'Z']);
    expect(l.negocio).toEqual(['B2C', 'B2B']);
  });

  it('el negocio de cada etapa es B2C o B2B', () => {
    const etapas = equipo.flatMap((p) => p.perfil?.trayectoria ?? []);
    expect(etapas.flatMap((e) => e.negocio ?? []).filter((n) => n !== 'B2C' && n !== 'B2B')).toEqual([]);
  });

  it('las etapas sin lugar (titulaciones sin centro) no se agrupan entre sí', () => {
    const sinLugar = { ...etapa('A', '2017-01', '2018-01'), lugar: undefined };
    const lugares = agruparPorLugar([sinLugar, { ...sinLugar, desde: '2014-01', hasta: '2016-01' }]);
    expect(lugares.map((l) => l.etapas.length)).toEqual([1, 1]);
  });

  it('cuenta los años trabajados, sin los huecos entre etapas ni los solapes', () => {
    // 2017-06 a 2017-09 (3 meses) + 2018-06 a 2021-03 + 2020-03 a 2021-03 (solapada) + 2021-03 a hoy.
    const etapas = [
      etapa('A', '2021-03'),
      etapa('B', '2020-03', '2021-03'),
      etapa('C', '2018-06', '2021-03'),
      etapa('D', '2017-06', '2017-09'),
    ];
    expect(anosTrabajados(etapas, new Date(2026, 2, 1))).toBe(8); // 7 años y 9 meses + 3 meses
    expect(anosTrabajados(etapas, new Date(2026, 1, 1))).toBe(7);
    expect(anosTrabajados([])).toBe(0);
  });

  it('los logos que no contrastan con el fondo de la píldora toman el color del texto', () => {
    expect(tonoIcono('000000')).toBe('oscuro');
    expect(tonoIcono('512BD4')).toBe('oscuro');
    expect(tonoIcono('005FAD')).toBe('oscuro');
    expect(tonoIcono('3178C6')).toBe('oscuro'); // TypeScript: 2,6:1 sobre la píldora del tema oscuro
    expect(tonoIcono('F7DF1E')).toBe('claro');
    expect(tonoIcono('4FC08D')).toBe('claro'); // Vue: 1,9:1 sobre la píldora del tema claro
    expect(tonoIcono('D97757')).toBeUndefined();
    expect(tonoIcono('6DB33F')).toBeUndefined(); // Spring conserva su verde en el claro (2,1:1)
  });
});
