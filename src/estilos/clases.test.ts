import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// Cada clase de las hojas de `src/` la usa algún componente, página o script: una regla sin nadie que la use es código
// muerto que confunde al siguiente que toque la hoja (retro 2026-11-12, P1: `.avatar` quedó suelta tras un cambio).
const RAIZ = join(__dirname, '..', '..');

function archivos(dir: string, vale: (nombre: string) => boolean): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? archivos(join(dir, e.name), vale) : vale(e.name) ? [join(dir, e.name)] : [],
  );
}

const leer = (rutas: string[]) => rutas.map((r) => readFileSync(r, 'utf8')).join('\n');

/** Clases que aparecen en los selectores (sin comentarios ni declaraciones). */
function clasesDe(css: string): Set<string> {
  const selectores = css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\{[^{}]*\}/g, '{}');
  return new Set([...selectores.matchAll(/\.(-?[a-z_][\w-]*)/gi)].map((m) => m[1]));
}

/** Usada si sale entera, o si un prefijo suyo acabado en `-` va seguido de `${` (`` `estado-${estado}` ``). */
function usada(clase: string, fuente: string): boolean {
  const entera = new RegExp(`(?<![\\w-])${clase}(?![\\w-])`);
  if (entera.test(fuente)) return true;
  return [...clase.matchAll(/-/g)].some((m) =>
    fuente.includes(clase.slice(0, m.index! + 1) + '${'),
  );
}

describe('clases de las hojas de estilo', () => {
  it('ninguna clase queda sin uso', () => {
    const css = leer(archivos(join(RAIZ, 'src'), (n) => n.endsWith('.css')));
    const fuente = leer([
      ...archivos(join(RAIZ, 'src'), (n) => /\.(tsx?|html)$/.test(n) && !/\.test\.tsx?$/.test(n)),
      ...archivos(join(RAIZ, 'scripts'), (n) => n.endsWith('.mjs')),
      join(RAIZ, 'index.html'),
    ]);
    const sinUso = [...clasesDe(css)].filter((c) => !usada(c, fuente));
    expect(sinUso).toEqual([]);
  });
});
