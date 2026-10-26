import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { agruparPorLugar, anosDesde, equipo, type Etapa } from './equipo';
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

  it('cuenta los años completos desde la etapa más antigua', () => {
    const etapas = [etapa('A', '2023-02'), etapa('B', '2017-06', '2017-09')];
    expect(anosDesde(etapas, new Date(2026, 4, 1))).toBe(8);
    expect(anosDesde(etapas, new Date(2026, 5, 1))).toBe(9);
    expect(anosDesde([])).toBe(0);
  });

  it('los logos casi negros o muy claros toman el color del texto', () => {
    expect(tonoIcono('000000')).toBe('oscuro');
    expect(tonoIcono('512BD4')).toBe('oscuro');
    expect(tonoIcono('005FAD')).toBe('oscuro');
    expect(tonoIcono('F7DF1E')).toBe('claro');
    expect(tonoIcono('3178C6')).toBeUndefined();
  });
});
