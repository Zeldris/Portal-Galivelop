import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { proyectos } from './proyectos';

/** Ancho y alto de un JPEG, del primer marcador SOF (FFC0-FFCF salvo C4, C8 y CC). */
function medidasJpeg(b: Buffer): [number, number] | null {
  let i = 2;
  while (i + 9 < b.length && b[i] === 0xff) {
    const m = b[i + 1];
    if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc)
      return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
    i += 2 + b.readUInt16BE(i + 2);
  }
  return null;
}

/** Texto del comentario JPEG (marcador FFFE), donde tools/og/generar.py deja la huella de la portada. */
function comentarioJpeg(b: Buffer): string | null {
  let i = 2;
  while (i + 3 < b.length && b[i] === 0xff && b[i + 1] !== 0xda) {
    const largo = b.readUInt16BE(i + 2);
    if (b[i + 1] === 0xfe) return b.subarray(i + 4, i + 2 + largo).toString('latin1');
    i += 2 + largo;
  }
  return null;
}

// La vista previa en redes de cada ficha: scripts/paginas-estaticas.mjs usa og.jpg y, si falta, la portada en WebP sin
// medidas, que Facebook no acepta. Se genera con `python3 tools/og/generar.py`, que deja en el JPEG la huella de la
// portada: si la portada cambia y la vista previa no se regenera, la tarjeta en redes enseñaría la imagen vieja.
describe('vista previa de cada proyecto', () => {
  it.each(proyectos.map((p) => [p.slug, p.portada.src]))(
    '%s tiene og.jpg de 1200×630, al día con su portada',
    (_, portada) => {
      const ruta = `public/${portada.replace(/[^/]+$/, '')}og.jpg`;
      expect(existsSync(ruta), `falta ${ruta}: python3 tools/og/generar.py`).toBe(true);
      const og = readFileSync(ruta);
      expect(medidasJpeg(og)).toEqual([1200, 630]);
      const huella = `portada:${createHash('sha1')
        .update(readFileSync(`public/${portada}`))
        .digest('hex')}`;
      expect(
        comentarioJpeg(og),
        `${ruta} no sale de la portada actual: python3 tools/og/generar.py`,
      ).toBe(huella);
    },
  );
});
