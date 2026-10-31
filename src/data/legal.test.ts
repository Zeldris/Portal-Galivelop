import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { documentosLegales } from './legal';
import { MARCA } from './marca';
import { textosIncompletos } from './textosIncompletos';

const leer = (ruta: string) => readFileSync(new URL(`../../${ruta}`, import.meta.url), 'utf8');
const app = leer('src/App.tsx');

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
  /** index.html y el código de src/ (sin tests), con su ruta. */
  const fuentes = (): [string, string][] => [
    ['index.html', leer('index.html')],
    ...readdirSync(new URL('../', import.meta.url), { recursive: true, encoding: 'utf8' })
      .filter((f) => /\.(tsx?|css)$/.test(f) && !/\.test\.tsx?$/.test(f))
      .map((f): [string, string] => [`src/${f}`, leer(`src/${f}`)]),
  ];
  const privacidad = documentosLegales.find((d) => d.slug === 'privacidad')!;
  const textoDe = (idioma: 'es' | 'gl' | 'en') =>
    JSON.stringify(privacidad, (_, v) =>
      v && typeof v === 'object' && idioma in v ? v[idioma] : v,
    );

  it('nombra, en los tres idiomas, cada clave que el portal guarda en el navegador', () => {
    const claves = new Set<string>();
    for (const [ruta, codigo] of fuentes()) {
      if (!/\b(localStorage|sessionStorage)\b/.test(codigo)) continue;
      const deEste = [
        ...codigo.matchAll(
          /(?:CLAVE_GUARDADA\s*=|(?:get|set|remove)Item\()\s*['"`]([^'"`]+)['"`]/g,
        ),
      ].map((m) => m[1]);
      expect(
        deEste.length,
        `${ruta} usa el almacenamiento con una clave que el test no reconoce`,
      ).toBeGreaterThan(0);
      deEste.forEach((c) => claves.add(c));
    }
    const escapar = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    for (const idioma of ['es', 'gl', 'en'] as const) {
      const texto = textoDe(idioma);
      const faltan = [...claves].filter(
        (c) => !new RegExp(`(?<![\\w.-])${escapar(c)}(?![\\w-])`).test(texto),
      );
      expect(faltan, `privacidad (${idioma})`).toEqual([]);
    }
  });

  it('no se carga nada de otro dominio: scripts, hojas, imágenes, marcos ni @import', () => {
    const externo =
      /<(script|link|iframe|img)\b[^>]*\b(src|href)\s*=\s*["'{]?\s*["'`]?(https?:)?\/\/|(@import|url\()\s*["']?(https?:)?\/\//gi;
    const hallados = fuentes().flatMap(([ruta, codigo]) =>
      [...codigo.matchAll(externo)].map((m) => `${ruta}: ${m[0]}`),
    );
    expect(hallados).toEqual([]);
  });
});
