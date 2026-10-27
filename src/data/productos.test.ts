import { describe, expect, it } from 'vitest';
import { NOMBRES_ICONOS } from '../components/Icono';
import { buscarPersonaPorId, equipo } from './equipo';
import { ESTADOS_PRODUCTO, productos } from './productos';
import { proximos } from './proximamente';
import { proyectos } from './proyectos';
import { textosIncompletos } from './textosIncompletos';

describe('productos', () => {
  it('hay productos y sus slugs no se repiten', () => {
    expect(productos.length).toBeGreaterThan(0);
    const slugs = productos.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('van ordenados por `orden`', () => {
    const ordenes = productos.map((p) => p.orden);
    expect(ordenes).toEqual([...ordenes].sort((a, b) => a - b));
  });

  for (const p of productos) {
    describe(p.slug, () => {
      it('tiene slug, nombre, estado y sus textos en castellano, gallego e inglés', () => {
        expect(p.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
        expect(p.nombre?.trim()).toBeTruthy();
        expect(ESTADOS_PRODUCTO).toContain(p.estado);
        expect(textosIncompletos({ queOfrece: p.queOfrece ?? {}, servicios: p.servicios }, p.slug)).toEqual([]);
      });

      it('usa un icono que existe y un color hex', () => {
        expect(NOMBRES_ICONOS).toContain(p.icono);
        expect(p.acento).toMatch(/^#[0-9a-f]{6}$/i);
      });

      it('nace de un proyecto del taller: con ficha o en «Próximamente»', () => {
        if (p.proyecto) expect(proyectos.map((x) => x.slug)).toContain(p.proyecto);
        if (p.proximo) expect(proximos.map((x) => x.slug)).toContain(p.proximo);
        expect(p.proyecto || p.proximo).toBeTruthy();
      });

      it('su responsable y sus colaboradores son miembros del equipo', () => {
        expect(buscarPersonaPorId(p.responsable)).toBeDefined();
        for (const id of p.colaboradores) expect(buscarPersonaPorId(id)).toBeDefined();
      });
    });
  }
});

describe('integrantes promocionados', () => {
  for (const persona of equipo.filter((p) => p.promocionado)) {
    it(`${persona.id}: sus servicios van en castellano, gallego e inglés`, () => {
      expect(textosIncompletos({ servicios: persona.servicios }, persona.id)).toEqual([]);
    });
  }
  it('quien tiene servicios está promocionado', () => {
    expect(equipo.filter((p) => p.servicios?.length && !p.promocionado)).toEqual([]);
  });
});
