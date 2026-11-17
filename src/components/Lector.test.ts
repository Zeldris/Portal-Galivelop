import { describe, expect, it } from 'vitest';
import { abrirPliegues } from './Lector';

/** Nodo mínimo: `details` si `tag` lo dice; `closest` busca hacia arriba (sin DOM en los tests). */
type Nodo = Parameters<typeof abrirPliegues>[0];
function nodo(tag: string, padre: Nodo | null = null): Nodo {
  const n: Nodo = {
    tagName: tag,
    open: false,
    parentElement: padre,
    closest(sel) {
      for (let x: Nodo | null = n; x; x = x.parentElement)
        if (x.tagName.toLowerCase() === sel) return x;
      return null;
    },
  };
  return n;
}

describe('abrirPliegues', () => {
  it('abre el details que contiene al elemento y los anidados', () => {
    const a = nodo('DETAILS');
    const b = nodo('DETAILS', a);
    const c = nodo('P', b);
    abrirPliegues(c);
    expect([a.open, b.open]).toEqual([true, true]);
  });
  it('abre el elemento si es un details', () => {
    const d = nodo('DETAILS');
    abrirPliegues(d);
    expect(d.open).toBe(true);
  });
  it('no toca nada si no hay details', () => {
    const p = nodo('P');
    abrirPliegues(p);
    expect(p.open).toBe(false);
  });
});
