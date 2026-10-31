import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { documentosLegales } from './legal';
import { MARCA } from './marca';
import { textosIncompletos } from './textosIncompletos';

const app = readFileSync(new URL('../App.tsx', import.meta.url), 'utf8');

describe('textos legales', () => {
  it('están los tres, sin slugs ni órdenes repetidos', () => {
    expect(documentosLegales.map((d) => d.slug).sort()).toEqual([
      'aviso-legal',
      'privacidad',
      'terminos',
    ]);
    const ordenes = documentosLegales.map((d) => d.orden);
    expect(new Set(ordenes).size).toBe(ordenes.length);
  });

  for (const d of documentosLegales) {
    describe(d.slug, () => {
      it('tiene su ruta en App.tsx', () => {
        expect(app).toContain(`<Route path="/${d.slug}"`);
      });

      it('tiene fecha AAAA-MM-DD y todos sus textos en castellano, gallego e inglés', () => {
        expect(d.actualizado).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(Number.isNaN(Date.parse(d.actualizado))).toBe(false);
        expect(textosIncompletos({ titulo: d.titulo, secciones: d.secciones }, d.slug)).toEqual([]);
      });

      it('cada sección tiene contenido y sus enlaces son https o mailto', () => {
        expect(d.secciones.length).toBeGreaterThan(0);
        for (const s of d.secciones) {
          const piezas = [s.parrafos, s.datos, s.lista, s.enlaces].reduce(
            (n, x) => n + (x?.length ?? 0),
            0,
          );
          expect(piezas, `${d.slug}: «${s.titulo.es}» vacía`).toBeGreaterThan(0);
          const urls = [
            ...(s.datos ?? []).flatMap((x) => (x.enlace ? [x.enlace] : [])),
            ...(s.enlaces ?? []).map((e) => e.url),
          ];
          for (const u of urls) expect(u).toMatch(/^(https:\/\/|mailto:)/);
        }
      });

      it('el correo de contacto es el de la marca', () => {
        const correos = JSON.stringify(d).match(/mailto:[^"]+/g) ?? [];
        for (const c of correos) expect(c).toBe(`mailto:${MARCA.correo}`);
      });
    });
  }
});
