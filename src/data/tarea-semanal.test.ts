import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// Todo dato del portal que caduca lo pone al día la tarea semanal: si no tiene bloque en su texto, nadie lo mantiene.
const DATA = __dirname;
const TAREA = readFileSync(join(DATA, '../../docs/runbooks/tarea-semanal.md'), 'utf8');
/** Datos que se ponen al día a mano, no en la tarea semanal (Productos los decide Álvaro, ADR 0002; los textos legales, el titular). */
const A_MANO = ['equipo.json', 'productos/', 'legal/'];

describe('tarea semanal', () => {
  it('nombra cada .json y cada carpeta de datos de src/data/, salvo los que se ponen a mano', () => {
    const datos = readdirSync(DATA, { withFileTypes: true })
      .filter((e) => e.isDirectory() || e.name.endsWith('.json'))
      .map((e) => (e.isDirectory() ? `src/data/${e.name}/` : `src/data/${e.name}`))
      .filter((ruta) => !A_MANO.some((m) => ruta.endsWith(`/${m}`)));
    expect(datos.filter((ruta) => !TAREA.includes(ruta))).toEqual([]);
  });

  it('tiene un bloque para cada ficha de src/data/proyectos/', () => {
    const fichas = readdirSync(join(DATA, 'proyectos')).filter((f) => f.endsWith('.json'));
    expect(fichas.filter((f) => !TAREA.includes(`(${f};`))).toEqual([]);
  });
});
