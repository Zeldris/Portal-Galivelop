import { describe, expect, it } from 'vitest';
import { textos } from './textos';

// Dos claves con el mismo texto en los tres idiomas son casi siempre una clave repetida (pasó al rehacer el inicio,
// 2026-10-27). Las parejas que son iguales a propósito (menú y título de la misma página) se apuntan aquí.
const dobles = [
  ['nav.sobre', 'sobre.titulo'],
  ['proyecto.volver', 'nav.proyectos.todos'],
  ['sobre.verEquipo', 'proyectoPropio.boton'],
  ['via2.titulo', 'prop.titulo'],
  ['pasos.titulo', 'sec.pasos'],
].map((p) => p.sort().join(' = '));

describe('claves de textos.ts', () => {
  it('no hay dos claves con el mismo texto en los tres idiomas', () => {
    const porTexto = new Map<string, string[]>();
    for (const clave of Object.keys(textos.es) as (keyof typeof textos.es)[]) {
      if (textos.es[clave].length <= 12) continue;
      const texto = [textos.es[clave], textos.gl[clave], textos.en[clave]].join('|');
      porTexto.set(texto, [...(porTexto.get(texto) ?? []), clave]);
    }
    const repetidas = [...porTexto.values()]
      .filter((claves) => claves.length > 1)
      .map((claves) => claves.sort().join(' = '))
      .filter((pareja) => !dobles.includes(pareja));
    expect(repetidas).toEqual([]);
  });
});
