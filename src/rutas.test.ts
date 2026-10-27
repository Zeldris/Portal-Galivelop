import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// Una ruta fija de `App.tsx` necesita su página estática (`FIJAS` de `scripts/paginas-estaticas.mjs`) y su fila en
// la medición (`PAGINAS` de `tools/qa/medir-paginas.cjs`); se olvidó al añadir /productos (2026-10-27).
const leer = (ruta: string) => readFileSync(new URL(`../${ruta}`, import.meta.url), 'utf8');

const rutasFijas = [...leer('src/App.tsx').matchAll(/<Route path="([^"]*)"/g)]
  .map((m) => m[1])
  .filter((r) => r !== '*' && !r.includes(':'))
  .map((r) => r.replace(/^\//, ''));

describe('rutas fijas de App.tsx', () => {
  it('hay rutas fijas que comprobar', () => {
    expect(rutasFijas).toContain('productos');
  });

  it('tienen página estática en FIJAS de paginas-estaticas.mjs', () => {
    const fuente = leer('scripts/paginas-estaticas.mjs');
    const inicio = fuente.indexOf('const FIJAS = {');
    const fin = fuente.indexOf('for (const [ruta, t]');
    expect(inicio, 'FIJAS en paginas-estaticas.mjs').toBeGreaterThan(-1);
    expect(fin, 'bucle de FIJAS en paginas-estaticas.mjs').toBeGreaterThan(inicio);
    const bloque = fuente.slice(inicio, fin);
    // Una clave es `''`, `muro` o `'participa/proponer'`; también vale asignarla después (`FIJAS.muro =`).
    const clave = (r: string) => (/^\w+$/.test(r) ? `'?${r}'?` : `'${r.replace(/[/.]/g, '\\$&')}'`);
    const faltan = rutasFijas.filter(
      (r) => !new RegExp(`(^|[\\s{,])${clave(r)}\\s*:|FIJAS\\.${clave(r)}\\s*=`, 'm').test(bloque),
    );
    expect(faltan).toEqual([]);
  });

  it('se miden en PAGINAS de medir-paginas.cjs', () => {
    const paginas =
      leer('tools/qa/medir-paginas.cjs').match(/const PAGINAS = \[([^\]]*)\]/)?.[1] ?? '';
    const medidas = [...paginas.matchAll(/'([^']*)'/g)].map((m) => m[1]);
    expect(rutasFijas.filter((r) => !medidas.includes(r))).toEqual([]);
  });
});
