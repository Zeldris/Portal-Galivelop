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
    for (const clave of claves)
      expect(claveDeGuion(leer(clave).pagina)).toBe(clave === 'inicio' ? 'inicio' : clave);
  });
});
