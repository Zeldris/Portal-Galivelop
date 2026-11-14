import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { PAPEL_CLARO, PAPEL_OSCURO, contraste, tonosAcento } from './tonos';
import { proyectos } from './proyectos';
import { productos } from './productos';
import { proximos } from './proximamente';

describe('tonos del acento', () => {
  it('da los hex que calculó la hoja del generador', () => {
    // Hoja de voice-generator y «Familia Galivelop», decisión 5.
    expect(tonosAcento('#D9467A')).toEqual({
      vivo: '#d9467a',
      hondo: '#ce3c71',
      oscuro: '#db487b',
    });
    expect(tonosAcento('#0E9A93').hondo).toBe('#16827c');
  });

  it('deja el vivo si ya cumple', () => {
    // Celeste hondo del Portal: 5,15:1 sobre el papel.
    expect(tonosAcento('#0072a8').hondo).toBe('#0072a8');
  });

  it('cada acento de la web llega a 4,5:1 en los dos temas, y el blanco sobre el hondo también', () => {
    const acentos = [...proyectos, ...productos, ...proximos].map((p) => p.acento);
    for (const a of acentos) {
      const t = tonosAcento(a);
      expect(contraste(t.hondo, PAPEL_CLARO), a).toBeGreaterThanOrEqual(4.5);
      expect(contraste(t.hondo, '#ffffff'), a).toBeGreaterThanOrEqual(4.5);
      expect(contraste(t.oscuro, PAPEL_OSCURO), a).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('rechaza un acento que no es #rrggbb', () => {
    expect(() => tonosAcento('#e73')).toThrow(/no es un hex de 6 cifras/);
    expect(() => tonosAcento('#e0703aff')).toThrow(/no es un hex de 6 cifras/);
  });

  it('los papeles coinciden con --papel de global.css (si falla, cámbialos en tonos.ts)', () => {
    const css = readFileSync(join(__dirname, '../estilos/global.css'), 'utf8');
    const papeles = [...css.matchAll(/^\s*--papel:\s*(#[0-9a-f]{6})/gim)].map((m) =>
      m[1].toLowerCase(),
    );
    expect(papeles).toEqual([PAPEL_CLARO, PAPEL_OSCURO]);
  });
});
