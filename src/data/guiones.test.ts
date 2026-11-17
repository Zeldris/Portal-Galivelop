import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { claveDeGuion, rutaAudio, type Guion } from '../utils/guion';

const RAIZ = join(__dirname, '..', '..');
const DIR = join(__dirname, 'guiones');
const claves = readdirSync(DIR)
  .filter((f) => f.endsWith('.json'))
  .map((f) => f.replace(/\.json$/, ''));
const leer = (clave: string) =>
  JSON.parse(readFileSync(join(DIR, `${clave}.json`), 'utf8')) as Guion;

describe('audio de los guiones', () => {
  it('cada idioma de `audio` tiene el MP3 de cada trozo, con su nombre esperado', () => {
    const faltan: string[] = [];
    for (const clave of claves) {
      const g = leer(clave);
      for (const idioma of g.audio ?? []) {
        g.trozos.forEach((t, i) => {
          const ruta = rutaAudio('', idioma, clave, i, t.seccion);
          if (!existsSync(join(RAIZ, 'public', ruta))) faltan.push(ruta);
        });
      }
    }
    expect(faltan).toEqual([]);
  });

  it('un guion sin `audio` en un idioma no tiene su carpeta de audio a medias', () => {
    for (const clave of claves) {
      const g = leer(clave);
      for (const idioma of ['es', 'gl', 'en']) {
        if (g.audio?.includes(idioma)) continue;
        expect(
          existsSync(join(RAIZ, 'public', 'audio', idioma, clave)),
          `public/audio/${idioma}/${clave} existe pero el guion no lista «${idioma}» en "audio"`,
        ).toBe(false);
      }
    }
  });

  it('la clave del guion sale de su ruta', () => {
    for (const clave of claves) expect(claveDeGuion(leer(clave).pagina), clave).toBe(clave);
  });

  it('cada trozo lleva su texto en gallego e inglés, distinto del castellano', () => {
    const mal: string[] = [];
    for (const clave of claves)
      for (const t of leer(clave).trozos)
        for (const idioma of ['gl', 'en'] as const) {
          const texto = t[idioma]?.trim();
          if (!texto) mal.push(`${clave}/${t.seccion}: falta «${idioma}»`);
          else if (texto === t.es.trim())
            mal.push(`${clave}/${t.seccion}: «${idioma}» igual que «es»`);
        }
    expect(mal).toEqual([]);
  });

  it('el gallego no lleva `¿` inicial (decisión de la persona, 2026-11-17)', () => {
    const mal: string[] = [];
    for (const clave of claves)
      for (const t of leer(clave).trozos)
        if (t.gl?.includes('¿')) mal.push(`${clave}/${t.seccion}`);
    expect(mal).toEqual([]);
  });

  it('cada `frase` de un enfoque aparece una sola vez en el `es` de su trozo', () => {
    const mal: string[] = [];
    for (const clave of claves)
      for (const t of leer(clave).trozos)
        for (const e of t.enfoques ?? []) {
          const veces = t.es.split(e.frase).length - 1;
          if (veces !== 1) mal.push(`${clave}/${t.seccion}: «${e.frase}» aparece ${veces} veces`);
        }
    expect(mal).toEqual([]);
  });
});
