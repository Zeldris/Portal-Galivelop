import { describe, expect, it } from 'vitest';
import { estadoGuion, fechaMasNueva } from './guionFecha';

describe('estadoGuion', () => {
  it('desfasado si la página es más nueva que `narra`', () => {
    expect(estadoGuion('2026-11-15', '2026-11-22')).toBe('desfasado');
  });
  it('al día si la fecha es igual o anterior', () => {
    expect(estadoGuion('2026-11-22', '2026-11-22')).toBe('al-dia');
    expect(estadoGuion('2026-11-24', '2026-11-22')).toBe('al-dia');
  });
  it('sin fecha en la página, se omite', () => {
    expect(estadoGuion('2026-11-17', undefined)).toBe('sin-fecha');
  });
});

describe('fechaMasNueva', () => {
  it('da la mayor, o nada si no hay', () => {
    expect(fechaMasNueva(['2026-11-22', '2026-11-24', '2026-11-01'])).toBe('2026-11-24');
    expect(fechaMasNueva([])).toBeUndefined();
  });
});
