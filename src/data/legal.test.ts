import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { documentosLegales } from './legal';
import { MARCA } from './marca';
import { textosIncompletos } from './textosIncompletos';

const app = readFileSync(new URL('../App.tsx', import.meta.url), 'utf8');
const leer = (ruta: string) => readFileSync(new URL(`../../${ruta}`, import.meta.url), 'utf8');
const privacidad = readFileSync(new URL('./legal/privacidad.json', import.meta.url), 'utf8');

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
      it('tiene su ruta en App.tsx, que pinta este mismo documento', () => {
        expect(app).toContain(
          `<Route path="/${d.slug}" element={<Legal documento={buscarLegal('${d.slug}')!} />} />`,
        );
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

      it('titular, correo y licencia del contenido son los de marca.ts', () => {
        const datos = d.secciones.flatMap((s) => s.datos ?? []);
        const valores = (es: string[]) =>
          datos.filter((x) => es.includes(x.etiqueta.es)).flatMap((x) => Object.values(x.valor));
        for (const v of valores(['Titular', 'Responsable'])) expect(v).toBe(MARCA.titular);
        for (const v of valores(['Correo'])) expect(v).toBe(MARCA.correo);
        const json = JSON.stringify(d);
        for (const c of json.match(/mailto:[^"]+/g) ?? []) expect(c).toBe(`mailto:${MARCA.correo}`);
        for (const u of json.match(/https:\/\/creativecommons\.org[^"]*/g) ?? [])
          expect(u).toBe(MARCA.licenciaContenido);
      });
    });
  }
});

// La privacidad describe lo que hace el portal; lo mecánico se vigila aquí y el resto en la revisión (REVIEW.md).
describe('la política de privacidad y el código', () => {
  const fuentes = ['index.html', 'src/i18n/Idioma.tsx', 'src/components/Tema.tsx']
    .map(leer)
    .join('\n');

  it('nombra cada clave que el portal guarda en el navegador', () => {
    const claves = [...new Set(fuentes.match(/galivelop\.[a-z]+/g) ?? [])];
    expect(claves.length).toBeGreaterThan(0);
    expect(claves.filter((c) => !privacidad.includes(c))).toEqual([]);
  });

  it('index.html no carga scripts ni hojas de estilo de otro dominio', () => {
    const externos =
      leer('index.html').match(/<(script|link)\b[^>]*(src|href)="(https?:)?\/\/[^"]*"[^>]*>/g) ??
      [];
    expect(externos).toEqual([]);
  });
});
