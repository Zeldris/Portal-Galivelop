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

// La vista previa en redes de cada ficha: scripts/paginas-estaticas.mjs usa og.jpg y, si falta, la portada en WebP sin
// medidas, que Facebook no acepta. Se genera con `python3 tools/og/generar.py`.
describe('vista previa de cada proyecto', () => {
  it.each(proyectos.map((p) => [p.slug, p.portada.src.replace(/[^/]+$/, '') + 'og.jpg']))(
    '%s tiene og.jpg de 1200×630',
    (_, og) => {
      const ruta = `public/${og}`;
      expect(existsSync(ruta), `falta ${ruta}: python3 tools/og/generar.py`).toBe(true);
      expect(medidasJpeg(readFileSync(ruta))).toEqual([1200, 630]);
    },
  );
});
