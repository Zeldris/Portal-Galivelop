import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ordenar, publicaciones, versionDe } from './muro';
import { proyectos } from './proyectos';
import { IDIOMAS, type Publicacion, type Texto } from './tipos';

const PUBLIC = join(__dirname, '../../public');
const MURO = join(__dirname, 'muro');

const incompleto = (t: Texto | undefined) =>
  !t || IDIOMAS.some((l) => typeof t[l] !== 'string' || !t[l].trim());

/** Lo que falla en una publicación, con su motivo; `existe` dice si una ruta de imagen está en public/. */
function problemas(p: Publicacion, existe: (src: string) => boolean): string[] {
  const fallos: string[] = [];
  if (!proyectos.some((x) => x.slug === p.proyecto))
    fallos.push(`proyecto desconocido: ${p.proyecto}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(p.fecha)) fallos.push(`fecha no es AAAA-MM-DD: ${p.fecha}`);
  if (!/^\d{4}-\d{2}-\d{2}-[a-z0-9-]+$/.test(p.pieza))
    fallos.push(`pieza no es AAAA-MM-DD-tema: ${p.pieza}`);
  const imagenes = p.imagenes ?? [];
  const textos: [string, Texto | undefined][] = [
    ['titulo', p.titulo],
    ['texto', p.texto],
    ...(p.cuerpo ?? []).map((t, n): [string, Texto] => [`cuerpo[${n}]`, t]),
    ...imagenes.map((i): [string, Texto] => [`alt de ${i.src}`, i.alt]),
  ];
  const sinIdiomas = textos.filter(([, t]) => incompleto(t)).map(([nombre]) => nombre);
  if (sinIdiomas.length) fallos.push(`textos sin los tres idiomas: ${sinIdiomas.join(', ')}`);
  const medida = (n: number) => Number.isInteger(n) && n > 0;
  for (const i of imagenes)
    if (!medida(i.ancho) || !medida(i.alto)) fallos.push(`imagen sin ancho o alto: ${i.src}`);
  const carpeta = `proyectos/${p.proyecto}/muro/${p.pieza}/`;
  for (const i of imagenes) {
    for (const v of [i, ...Object.values(i.porIdioma ?? {})]) {
      for (const src of [v.src, v.mini] as unknown[]) {
        if (typeof src !== 'string') {
          fallos.push(`imagen sin src o mini: ${i.src}`);
          continue;
        }
        if (!src.startsWith(carpeta)) fallos.push(`imagen fuera de ${carpeta}: ${src}`);
        if (!existe(src)) fallos.push(`imagen que no está en public/: ${src}`);
      }
    }
  }
  return fallos;
}

const ejemplo = (pieza: string, fecha: string): Publicacion => ({
  proyecto: 'tarkor',
  pieza,
  fecha,
  titulo: { es: 't', gl: 't', en: 't' },
  texto: { es: 'x', gl: 'x', en: 'x' },
});

describe('muro', () => {
  it('ordena de la más reciente a la más antigua y, el mismo día, la última pieza primero', () => {
    const lista = ordenar([
      ejemplo('2026-10-01-a', '2026-10-01'),
      ejemplo('2026-10-23-01-b', '2026-10-23'),
      ejemplo('2026-10-23-02-c', '2026-10-23'),
    ]);
    expect(lista.map((p) => p.pieza)).toEqual([
      '2026-10-23-02-c',
      '2026-10-23-01-b',
      '2026-10-01-a',
    ]);
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

  // Las reglas de una publicación, aparte de los datos: hoy no hay ninguna y la primera la escribe la tarea semanal,
  // así que se prueban también con un ejemplo bueno y uno malo.
  it('las reglas aceptan una publicación bien hecha', () => {
    const imagen = {
      src: 'proyectos/tarkor/muro/2026-10-20-a/m.webp',
      mini: 'proyectos/tarkor/muro/2026-10-20-a/m-mini.webp',
      ancho: 1600,
      alto: 900,
      alt: { es: 'a', gl: 'a', en: 'a' },
    };
    expect(
      problemas({ ...ejemplo('2026-10-20-a', '2026-10-20'), imagenes: [imagen] }, () => true),
    ).toEqual([]);
  });

  it('las reglas rechazan cada fallo con su motivo', () => {
    const mala = {
      ...ejemplo('2026-10-20-a', '20-10-2026'),
      proyecto: 'no-existe',
      pieza: 'Mapa',
      titulo: { es: 't', gl: '', en: 't' },
      cuerpo: [
        { es: 'c', gl: 'c', en: 'c' },
        { es: 'c', gl: 'c' },
      ],
      imagenes: [
        {
          src: 'proyectos/otro/m.webp',
          mini: 'proyectos/otro/m-mini.webp',
          ancho: 0,
          alto: 900,
          alt: { es: 'a', gl: 'a', en: 'a' },
          porIdioma: { en: { src: 'proyectos/otro/m.en.webp' } },
        },
      ],
    } as Publicacion;
    expect(problemas(mala, () => false)).toEqual([
      'proyecto desconocido: no-existe',
      'fecha no es AAAA-MM-DD: 20-10-2026',
      'pieza no es AAAA-MM-DD-tema: Mapa',
      'textos sin los tres idiomas: titulo, cuerpo[1]',
      'imagen sin ancho o alto: proyectos/otro/m.webp',
      'imagen fuera de proyectos/no-existe/muro/Mapa/: proyectos/otro/m.webp',
      'imagen que no está en public/: proyectos/otro/m.webp',
      'imagen fuera de proyectos/no-existe/muro/Mapa/: proyectos/otro/m-mini.webp',
      'imagen que no está en public/: proyectos/otro/m-mini.webp',
      'imagen fuera de proyectos/no-existe/muro/Mapa/: proyectos/otro/m.en.webp',
      'imagen que no está en public/: proyectos/otro/m.en.webp',
      'imagen sin src o mini: proyectos/otro/m.webp',
    ]);
  });

  for (const p of publicaciones) {
    it(`${p.proyecto}/${p.pieza} cumple las reglas`, () => {
      expect(problemas(p, (src) => existsSync(join(PUBLIC, src)))).toEqual([]);
    });
  }
});
