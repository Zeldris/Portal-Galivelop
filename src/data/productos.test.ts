import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { NOMBRES_ICONOS } from '../components/Icono';
import { buscarPersonaPorId, equipo } from './equipo';
import { correoDeProducto, ESTADOS_PRODUCTO, productos, productosDe } from './productos';
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
        expect(p.queOfrece).toBeDefined();
        expect(Array.isArray(p.servicios)).toBe(true);
        expect(
          textosIncompletos({ queOfrece: p.queOfrece, servicios: p.servicios }, p.slug),
        ).toEqual([]);
      });

      it('usa un icono que existe y un color hex', () => {
        expect(NOMBRES_ICONOS).toContain(p.icono);
        expect(p.acento).toMatch(/^#[0-9a-f]{6}$/i);
      });

      it('si apunta a un proyecto con ficha o a «Próximamente», existe (el producto privado no apunta a ninguno, ADR 0005)', () => {
        if (p.proyecto) expect(proyectos.map((x) => x.slug)).toContain(p.proyecto);
        if (p.proximo) expect(proximos.map((x) => x.slug)).toContain(p.proximo);
      });

      it('su responsable y sus colaboradores son miembros del equipo', () => {
        expect(buscarPersonaPorId(p.responsable)).toBeDefined();
        for (const id of p.colaboradores) expect(buscarPersonaPorId(id)).toBeDefined();
      });

      it('si tiene página, lleva su ficha de requisitos mínimos en los tres idiomas', () => {
        if (!p.pagina) return;
        expect(p.pagina.requisitos?.items.length ?? 0).toBeGreaterThan(0);
        expect(textosIncompletos({ requisitos: p.pagina.requisitos }, p.slug)).toEqual([]);
      });
    });
  }
});

describe('productos de cada miembro (ADR 0004)', () => {
  it('cada producto sale en el perfil de su responsable y de cada colaborador', () => {
    for (const p of productos) {
      for (const id of [p.responsable, ...p.colaboradores]) {
        expect(productosDe(id), `${p.slug} en ${id}`).toContain(p);
      }
    }
  });
  it('el correo del primer contacto lleva el asunto codificado', () => {
    expect(correoDeProducto('persona@example.com', 'Galivelop Developer: Primer contacto')).toBe(
      'mailto:persona@example.com?subject=Galivelop%20Developer%3A%20Primer%20contacto',
    );
  });
  for (const p of productos.filter((x) => x.pagina)) {
    it(`la página de ${p.slug} tiene sus textos en los tres idiomas, sus imágenes y sus cuatro pasos`, () => {
      const g = p.pagina!;
      expect(textosIncompletos(g, p.slug)).toEqual([]);
      expect(g.actualizado).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(g.pasos).toHaveLength(4);
      expect(g.lema.length).toBeGreaterThan(0);
      if (g.portada)
        for (const f of [g.portada.src, g.portada.mini])
          expect(existsSync(`public/${f}`), f).toBe(true);
      for (const fig of g.figuras ?? []) {
        expect(fig.ancho).toBeGreaterThan(0);
        expect(fig.alto).toBeGreaterThan(0);
        for (const f of [fig.src, fig.mini, fig.srcOscuro, fig.miniOscuro])
          expect(
            typeof f === 'string' && existsSync(`public${f.startsWith('/') ? '' : '/'}${f}`),
            f,
          ).toBe(true);
      }
      // Sin el signo de apertura en gallego, y sin lo que la página no cuenta: precios ni repositorios.
      const todo = JSON.stringify(g);
      const gallego = JSON.stringify(g, (k, v) => (k === 'es' || k === 'en' ? undefined : v));
      expect(gallego).not.toMatch(/[¿¡]/);
      expect(todo).not.toMatch(/github\.com|€/);
    });
  }
  it('quien no lleva ninguno no tiene productos (y su perfil, ninguna sección)', () => {
    expect(productosDe('nadie')).toEqual([]);
    for (const persona of equipo) {
      const suyos = productos.filter(
        (p) => p.responsable === persona.id || p.colaboradores.includes(persona.id),
      );
      expect(productosDe(persona.id)).toEqual(suyos);
    }
  });
});
