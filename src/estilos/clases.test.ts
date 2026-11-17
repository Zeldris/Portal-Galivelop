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

/**
 * Selectores de atributo con valor (`.flujo-lista button[aria-current='step']`), con la clase más cercana que lo
 * acompaña (`flujo-lista`) o vacía si no hay ninguna (`[data-tema='claro'] …`).
 */
function atributosDe(css: string): { clase: string; attr: string; valor: string }[] {
  const selectores = css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\{[^{}]*\}/g, '{}');
  const vistos = new Map<string, { clase: string; attr: string; valor: string }>();
  for (const m of selectores.matchAll(
    /(?:\.([\w-]+)[^.{},[]*?)?\[([a-z-]+)=['"]([^'"]+)['"]\]/gi,
  )) {
    const par = { clase: m[1] ?? '', attr: m[2], valor: m[3] };
    vistos.set(`${par.clase}|${par.attr}=${par.valor}`, par);
  }
  return [...vistos.values()];
}

/**
 * Usado si un archivo con la clase pone ese valor al atributo: `attr="valor"` literal, el valor como cadena (`'step'`)
 * junto al atributo o, para `true`/`false`, una expresión sin ternario (`aria-pressed={activo}`, que React pinta
 * "true"); `aria-current={x ? 'location' : undefined}` no pinta "true".
 */
function atributoUsado(
  { clase, attr, valor }: { clase: string; attr: string; valor: string },
  fuentes: string[],
): boolean {
  const conClase = clase ? fuentes.filter((f) => usada(clase, f)) : fuentes;
  return conClase.some((f) => {
    if (f.includes(`${attr}="${valor}"`)) return true;
    if (!f.includes(attr)) return false;
    if (valor === 'true' || valor === 'false') return new RegExp(`${attr}=\\{[^}?]*\\}`).test(f);
    return f.includes(`'${valor}'`) || f.includes(`"${valor}"`);
  });
}

const css = () => leer(archivos(join(RAIZ, 'src'), (n) => n.endsWith('.css')));
const rutasFuente = () => [
  ...archivos(join(RAIZ, 'src'), (n) => /\.(tsx?|html)$/.test(n) && !/\.test\.tsx?$/.test(n)),
  ...archivos(join(RAIZ, 'scripts'), (n) => n.endsWith('.mjs')),
  join(RAIZ, 'index.html'),
];
const fuente = () => leer(rutasFuente());

describe('clases de las hojas de estilo', () => {
  it('ninguna clase queda sin uso', () => {
    const f = fuente();
    const sinUso = [...clasesDe(css())].filter((c) => !usada(c, f));
    expect(sinUso).toEqual([]);
  });

  // Retro 2026-11-14, P5: `Proyecto.tsx` pasó a `aria-current="location"` y la hoja siguió pintando
  // `[aria-current='true']`; solo lo vio la revisión.
  it('cada selector de atributo con valor lo pone algún componente', () => {
    const fuentes = rutasFuente().map((r) => readFileSync(r, 'utf8'));
    const sinUso = atributosDe(css())
      .filter((a) => !atributoUsado(a, fuentes))
      .map((a) => `.${a.clase}[${a.attr}='${a.valor}']`);
    expect(sinUso).toEqual([]);
  });
});
