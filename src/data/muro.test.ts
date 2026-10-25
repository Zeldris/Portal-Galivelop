import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ordenar, publicaciones, versionDe } from './muro';
import { proyectos } from './proyectos';
import { IDIOMAS, type Publicacion, type Texto } from './tipos';

const PUBLIC = join(__dirname, '../../public');
const MURO = join(__dirname, 'muro');

const incompleto = (t: Texto | undefined) => !t || IDIOMAS.some((l) => typeof t[l] !== 'string' || !t[l].trim());

const ejemplo = (pieza: string, fecha: string): Publicacion => ({
  proyecto: 'tarkor',
  pieza,
  fecha,
  titulo: { es: 't', gl: 't', en: 't' },
  texto: { es: 'x', gl: 'x', en: 'x' },
});

describe('muro', () => {
  it('ordena de la más reciente a la más antigua y, el mismo día, la última pieza primero', () => {
    const lista = ordenar([ejemplo('2026-10-01-a', '2026-10-01'), ejemplo('2026-10-23-01-b', '2026-10-23'), ejemplo('2026-10-23-02-c', '2026-10-23')]);
    expect(lista.map((p) => p.pieza)).toEqual(['2026-10-23-02-c', '2026-10-23-01-b', '2026-10-01-a']);
  });

  it('elige la imagen del idioma y, si no la hay, la de por defecto', () => {
    const imagen = {
      src: 'a.es.webp',
      mini: 'a.es-mini.webp',
      ancho: 1600,
      alto: 900,
      alt: { es: 'a', gl: 'a', en: 'a' },
      porIdioma: { en: { src: 'a.en.webp', mini: 'a.en-mini.webp' } },
    };
    expect(versionDe(imagen, 'en').src).toBe('a.en.webp');
    expect(versionDe(imagen, 'gl').src).toBe('a.es.webp');
  });

  // Solo hay carpetas de proyectos con su .json, y cada archivo se llama como su pieza.
  const archivos = readdirSync(MURO, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .flatMap((d) => readdirSync(join(MURO, d.name)).map((f) => ({ carpeta: d.name, archivo: f })));

  it('cada archivo está en la carpeta de su proyecto y se llama como su pieza', () => {
    for (const { carpeta, archivo } of archivos) {
      expect(archivo).toMatch(/\.json$/);
      const p = JSON.parse(readFileSync(join(MURO, carpeta, archivo), 'utf8')) as Publicacion;
      expect(`${p.proyecto}/${p.pieza}.json`).toBe(`${carpeta}/${archivo}`);
    }
    expect(publicaciones.length).toBe(archivos.length);
  });

  for (const p of publicaciones) {
    describe(`${p.proyecto}/${p.pieza}`, () => {
      it('es de un proyecto que existe, con fecha válida y textos en los tres idiomas', () => {
        expect(proyectos.some((x) => x.slug === p.proyecto)).toBe(true);
        expect(p.fecha).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(p.pieza).toMatch(/^\d{4}-\d{2}-\d{2}-[a-z0-9-]+$/);
        const textos = [p.titulo, p.texto, ...(p.cuerpo ?? []), ...(p.imagenes ?? []).map((i) => i.alt)];
        expect(textos.filter(incompleto)).toEqual([]);
      });

      it('todas sus imágenes existen en public/ y están en su carpeta', () => {
        const rutas = (p.imagenes ?? []).flatMap((i) => [i, ...Object.values(i.porIdioma ?? {})]).flatMap((v) => [v.src, v.mini]);
        expect(rutas.filter((src) => !src.startsWith(`proyectos/${p.proyecto}/muro/${p.pieza}/`))).toEqual([]);
        expect(rutas.filter((src) => !existsSync(join(PUBLIC, src)))).toEqual([]);
      });
    });
  }
});
