import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// Todo dato del portal que caduca lo pone al día la tarea semanal con la skill gw-portal: si no tiene sección en
// su proyectos.md o su repo no está en fuentes.json, nadie lo mantiene.
const DATA = __dirname;
const SKILL = join(DATA, '../../.claude/skills/gw-portal');
const REGLAS = readFileSync(join(SKILL, 'proyectos.md'), 'utf8');
const FUENTES: { repos: Record<string, { destino: string; slug?: string }> } = JSON.parse(
  readFileSync(join(SKILL, 'fuentes.json'), 'utf8'),
);
/** Datos que se ponen al día a mano, no en la tarea semanal (Productos los decide Álvaro, ADR 0002; los textos legales, el titular). */
const A_MANO = ['equipo.json', 'productos/', 'legal/'];

const slugsDe = (destino: string) =>
  new Set(
    Object.values(FUENTES.repos)
      .filter((r) => r.destino === destino)
      .map((r) => r.slug),
  );

describe('tarea semanal (gw-portal)', () => {
  it('nombra cada .json y cada carpeta de datos de src/data/, salvo los que se ponen a mano', () => {
    const datos = readdirSync(DATA, { withFileTypes: true })
      .filter((e) => e.isDirectory() || e.name.endsWith('.json'))
      .map((e) => (e.isDirectory() ? `src/data/${e.name}/` : `src/data/${e.name}`))
      .filter((ruta) => !A_MANO.some((m) => ruta.endsWith(`/${m}`)));
    expect(datos.filter((ruta) => !REGLAS.includes(ruta))).toEqual([]);
  });

  it('tiene una sección para cada ficha de src/data/proyectos/', () => {
    const fichas = readdirSync(join(DATA, 'proyectos')).filter((f) => f.endsWith('.json'));
    expect(fichas.filter((f) => !REGLAS.includes(`(${f};`))).toEqual([]);
  });

  it('cada ficha tiene al menos un repo en fuentes.json', () => {
    const slugs = slugsDe('ficha');
    const fichas = readdirSync(join(DATA, 'proyectos'))
      .filter((f) => f.endsWith('.json'))
      .map((f) => f.replace(/\.json$/, ''));
    expect(fichas.filter((s) => !slugs.has(s))).toEqual([]);
  });

  it('cada entrada de proximamente.json tiene su repo en fuentes.json', () => {
    const slugs = slugsDe('proximamente');
    const entradas: { slug: string }[] = JSON.parse(
      readFileSync(join(DATA, 'proximamente.json'), 'utf8'),
    );
    expect(entradas.map((e) => e.slug).filter((s) => !slugs.has(s))).toEqual([]);
  });

  it('cada repo de fuentes.json tiene un destino válido, y slug salvo los ignorados', () => {
    const malos = Object.entries(FUENTES.repos).filter(
      ([, r]) =>
        !['ficha', 'proximamente', 'ignorar'].includes(r.destino) ||
        (r.destino !== 'ignorar' && !r.slug),
    );
    expect(malos.map(([n]) => n)).toEqual([]);
  });
});
