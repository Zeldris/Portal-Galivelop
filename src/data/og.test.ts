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
// medidas, que Facebook no acepta. Se genera con `python3 tools/og/generar.py` a partir de `tools/og/fuentes/<slug>/og-fuente.png`
// (o `.jpg`, una imagen hecha para redes) si existe, y si no de la portada; deja en el JPEG la huella de ese
// origen: si cambia y la vista previa no se regenera, la tarjeta en redes enseñaría la imagen vieja.
describe('vista previa de cada proyecto', () => {
  it.each(proyectos.map((p) => [p.slug, p.portada.src]))(
    '%s tiene og.jpg de 1200×630, al día con su origen',
    (slug, portada) => {
      const carpeta = `public/${portada.replace(/[^/]+$/, '')}`;
      const ruta = `${carpeta}og.jpg`;
      expect(existsSync(ruta), `falta ${ruta}: python3 tools/og/generar.py`).toBe(true);
      const og = readFileSync(ruta);
      expect(medidasJpeg(og)).toEqual([1200, 630]);
      const fuente = ['og-fuente.png', 'og-fuente.jpg'].find((f) =>
        existsSync(`tools/og/fuentes/${slug}/${f}`),
      );
      const origen = fuente ? `tools/og/fuentes/${slug}/${fuente}` : `public/${portada}`;
      const huella = `${fuente ? 'og-fuente' : 'portada'}:${createHash('sha1')
        .update(readFileSync(origen))
        .digest('hex')}`;
      expect(comentarioJpeg(og), `${ruta} no sale de ${origen}: python3 tools/og/generar.py`).toBe(
        huella,
      );
    },
  );

  // En gallego e inglés: og-gl.jpg y og-en.jpg salen de og-fuente-gl.png y og-fuente-en.png (o .jpg; el texto de la
  // imagen traducido) y van en las páginas de ese idioma; sin esa fuente no debe quedar un og-<idioma>.jpg viejo. Una
  // og-fuente en castellano lleva texto, así que exige las dos (si no, /gl/ y /en/ enseñarían el texto en castellano).
  it.each(proyectos.flatMap((p) => ['gl', 'en'].map((idioma) => [p.slug, idioma, p.portada.src])))(
    '%s en %s: og-<idioma>.jpg al día con su og-fuente-<idioma>',
    (slug, idioma, portada) => {
      const ruta = `public/${portada.replace(/[^/]+$/, '')}og-${idioma}.jpg`;
      const deIdioma = (x: string) => `tools/og/fuentes/${slug}/og-fuente-${x}`;
      const fuente = [`${idioma}.png`, `${idioma}.jpg`].map(deIdioma).find((f) => existsSync(f));
      const castellano = ['png', 'jpg'].some((x) =>
        existsSync(`tools/og/fuentes/${slug}/og-fuente.${x}`),
      );
      expect(
        castellano && !fuente,
        `falta ${deIdioma(`${idioma}.png`)}: la og-fuente en castellano lleva texto (node tools/og/traducir.mjs ${slug})`,
      ).toBe(false);
      if (!fuente) {
        expect(existsSync(ruta), `sobra ${ruta}: python3 tools/og/generar.py`).toBe(false);
        return;
      }
      expect(existsSync(ruta), `falta ${ruta}: python3 tools/og/generar.py`).toBe(true);
      const og = readFileSync(ruta);
      expect(medidasJpeg(og)).toEqual([1200, 630]);
      const huella = `og-fuente:${createHash('sha1').update(readFileSync(fuente)).digest('hex')}`;
      expect(comentarioJpeg(og), `${ruta} no sale de ${fuente}: python3 tools/og/generar.py`).toBe(
        huella,
      );
    },
  );
});
