import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { buscarEntrada, entradas, minutosLectura, textosDe, type EntradaDiario } from './diario';
import { equipo } from './equipo';
import { IDIOMAS, type Proyecto, type Texto } from './tipos';

const CARPETA = join(__dirname, 'diario');
const FICHAS = join(__dirname, 'proyectos');
const ficha = (slug: string): Proyecto | undefined => {
  try {
    return JSON.parse(readFileSync(join(FICHAS, `${slug}.json`), 'utf8')) as Proyecto;
  } catch {
    return undefined;
  }
};

/** Todos los `Texto` de una entrada, con su ruta para el mensaje de error. */
function textos(e: EntradaDiario): [string, Texto][] {
  const r: [string, Texto][] = [
    ['titulo', e.titulo],
    ['bajada', e.bajada],
    ['descripcion', e.descripcion],
  ];
  e.secciones.forEach((s, i) => {
    r.push([`secciones[${i}].etiqueta`, s.etiqueta], [`secciones[${i}].titulo`, s.titulo]);
    s.bloques.forEach((b, j) => {
      const p = `secciones[${i}].bloques[${j}]`;
      if (b.tipo === 'parrafo') r.push([`${p}.texto`, b.texto]);
      else if (b.tipo === 'decision') r.push([`${p}.texto`, b.texto], [`${p}.cita`, b.cita]);
      else if (b.tipo === 'lista') {
        r.push([`${p}.titulo`, b.titulo]);
        b.items.forEach((t, k) => r.push([`${p}.items[${k}]`, t]));
      } else r.push([`${p}.pie`, b.pie]);
    });
  });
  return r;
}

const entrada = (palabras: number): Texto => ({
  es: Array(palabras).fill('a').join(' '),
  gl: 'a',
  en: 'a',
});

describe('diario', () => {
  it('hay entradas y sus slugs no se repiten', () => {
    expect(entradas.length).toBeGreaterThan(0);
    const slugs = entradas.map((e) => e.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('el nombre de cada archivo de src/data/diario/ es su slug', () => {
    const archivos = readdirSync(CARPETA).filter((f) => f.endsWith('.json'));
    expect(archivos.length).toBe(entradas.length);
    for (const f of archivos) {
      const { slug } = JSON.parse(readFileSync(join(CARPETA, f), 'utf8')) as { slug: string };
      expect(f, `slug «${slug}»`).toBe(`${slug}.json`);
      expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it('van de la más nueva a la más vieja', () => {
    const fechas = entradas.map((e) => e.fecha);
    expect(fechas).toEqual([...fechas].sort().reverse());
  });

  it('buscarEntrada da la entrada por su slug y undefined si no existe', () => {
    expect(buscarEntrada(entradas[0].slug)).toBe(entradas[0]);
    expect(buscarEntrada('no-existe')).toBeUndefined();
    expect(buscarEntrada(undefined)).toBeUndefined();
  });

  for (const e of entradas) {
    describe(e.slug, () => {
      it('cada texto está en castellano, gallego e inglés', () => {
        for (const [ruta, t] of textos(e)) {
          for (const i of IDIOMAS) {
            expect(t[i]?.trim(), `${ruta}.${i}`).toBeTruthy();
          }
        }
      });

      it('la fecha es AAAA-MM-DD y existe', () => {
        expect(e.fecha).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        const d = new Date(`${e.fecha}T00:00:00Z`);
        expect(Number.isNaN(d.getTime())).toBe(false);
        expect(d.toISOString().slice(0, 10)).toBe(e.fecha);
      });

      it('su autor está en equipo.json', () => {
        expect(
          equipo.map((p) => p.id),
          `autor «${e.autor}»`,
        ).toContain(e.autor);
      });

      it('su proyecto, si lo tiene, tiene ficha', () => {
        if (e.proyecto) expect(ficha(e.proyecto), `proyecto «${e.proyecto}»`).toBeDefined();
      });

      it('cada bloque `animacion` apunta a una animación que existe en su ficha', () => {
        for (const s of e.secciones) {
          for (const b of s.bloques) {
            if (b.tipo !== 'animacion') continue;
            const animaciones = ficha(b.proyecto)?.animaciones ?? [];
            expect(
              animaciones.map((a) => a.id),
              `animación «${b.id}» de «${b.proyecto}»`,
            ).toContain(b.id);
          }
        }
      });

      it('la descripción no pasa de 160 caracteres en ningún idioma', () => {
        for (const i of IDIOMAS) {
          expect(e.descripcion[i].length, `descripcion.${i}`).toBeLessThanOrEqual(160);
        }
      });

      it('tiene lectura calculada de al menos 1 minuto en cada idioma', () => {
        for (const i of IDIOMAS) expect(minutosLectura(e, i)).toBeGreaterThanOrEqual(1);
      });
    });
  }
});

// El diario lo cuenta quien firma, en primera persona: «la persona» es vocabulario interno del flujo (quien
// decide en la sesión) y no va en el texto público (revisión del bloque del diario, 6e28d10; retro 2026-11-26, P1).
describe('vocabulario del diario', () => {
  const INTERNO = /\b(la persona|a persoa|da persoa|the person)\b/i;
  it('ninguna entrada dice «la persona» en ningún idioma', () => {
    const malas = readdirSync(CARPETA)
      .filter((f) => f.endsWith('.json'))
      .flatMap((f) =>
        (readFileSync(join(CARPETA, f), 'utf8').match(new RegExp(INTERNO, 'gi')) ?? []).map(
          (m) => `${f}: «${m}»`,
        ),
      );
    expect(malas).toEqual([]);
  });
});

describe('minutosLectura', () => {
  // 2 (título) + 3 (bajada) + 1 + 1 (sección) + 4 (párrafo) + 1 + 2 (decisión) + 1 + 2 (lista) + 3 (pie) = palabras
  const base: EntradaDiario = {
    slug: 'x',
    fecha: '2026-01-01',
    autor: 'a',
    titulo: entrada(2),
    bajada: entrada(3),
    descripcion: entrada(1),
    secciones: [
      {
        etiqueta: entrada(1),
        titulo: entrada(1),
        bloques: [
          { tipo: 'parrafo', texto: entrada(4) },
          { tipo: 'decision', texto: entrada(1), cita: entrada(2) },
          { tipo: 'lista', titulo: entrada(1), items: [entrada(2)] },
          { tipo: 'animacion', proyecto: 'p', id: 'i', pie: entrada(3) },
        ],
      },
    ],
  };

  it('cuenta las palabras de títulos, bajada y bloques del idioma, sin la descripción', () => {
    expect(textosDe(base, 'es').join(' ').split(/\s+/).length).toBe(
      2 + 3 + 1 + 1 + 4 + 1 + 2 + 1 + 2 + 3,
    );
  });

  it('da 1 minuto como mínimo', () => {
    expect(minutosLectura(base, 'es')).toBe(1);
    expect(minutosLectura(base, 'en')).toBe(1);
  });

  it('redondea hacia arriba cada 200 palabras', () => {
    const largo = (n: number): EntradaDiario => ({
      ...base,
      secciones: [{ ...base.secciones[0], bloques: [{ tipo: 'parrafo', texto: entrada(n) }] }],
    });
    // título 2 + bajada 3 + etiqueta 1 + título 1 = 7 palabras fijas
    expect(minutosLectura(largo(193), 'es')).toBe(1); // 200
    expect(minutosLectura(largo(194), 'es')).toBe(2); // 201
    expect(minutosLectura(largo(393), 'es')).toBe(2); // 400
    expect(minutosLectura(largo(394), 'es')).toBe(3); // 401
  });
});
