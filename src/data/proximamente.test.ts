import { describe, expect, it } from 'vitest';
import { NOMBRES_ICONOS } from '../components/Icono';
import { proximos } from './proximamente';
import { proyectos } from './proyectos';
import { IDIOMAS } from './tipos';

describe('próximamente', () => {
  it('los slugs no se repiten ni coinciden con los de un proyecto con ficha', () => {
    const slugs = proximos.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    const conFicha = new Set(proyectos.map((p) => p.slug));
    expect(slugs.filter((s) => conFicha.has(s))).toEqual([]);
  });

  for (const p of proximos) {
    describe(p.slug, () => {
      it('tiene sus textos en castellano, gallego e inglés', () => {
        const faltan = (['lema', 'siguiente'] as const).flatMap((campo) =>
          IDIOMAS.filter((l) => typeof p[campo]?.[l] !== 'string' || !p[campo][l].trim()).map((l) => `${campo}.${l}`),
        );
        expect(faltan).toEqual([]);
      });

      it('usa un icono que existe y un color hex', () => {
        expect(NOMBRES_ICONOS).toContain(p.icono);
        expect(p.acento).toMatch(/^#[0-9a-f]{6}$/i);
      });

      it('sus fases son enteras y las hechas no pasan del total', () => {
        const { hechas, total } = p.fases;
        expect(Number.isInteger(hechas) && Number.isInteger(total)).toBe(true);
        expect(total).toBeGreaterThan(0);
        expect(hechas).toBeGreaterThanOrEqual(0);
        expect(hechas).toBeLessThanOrEqual(total);
      });
    });
  }
});
