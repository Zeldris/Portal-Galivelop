import { readFileSync } from 'node:fs';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Muro } from '../paginas';
import { ProveedorIdioma } from '../i18n/Idioma';
import { ImagenAmpliable } from './ImagenAmpliable';

describe('ImagenAmpliable', () => {
  it('el nombre accesible del botón incluye el alt de la imagen', () => {
    const html = renderToString(
      <ProveedorIdioma idioma="es" cambiarIdioma={() => {}}>
        <ImagenAmpliable
          imagen={{
            src: 'a.webp',
            mini: 'b.webp',
            ancho: 10,
            alto: 10,
            alt: { es: 'Mapa de rutas', gl: 'Mapa', en: 'Route map' },
          }}
        />
      </ProveedorIdioma>,
    );
    expect(html).toMatch(/aria-label="Ampliar[^"]*Mapa de rutas"/);
  });
});

describe('páginas perezosas', () => {
  it('no usan React.lazy (que guarda el fallo de un chunk para siempre)', () => {
    expect((Muro as unknown as { $$typeof?: symbol }).$$typeof).toBeUndefined();
    expect(typeof Muro).toBe('function');
  });
});

describe('fuentes con comprobación de texto', () => {
  it('el índice de la ficha marca la sección con aria-current="location"', () => {
    const src = readFileSync('src/pages/Proyecto.tsx', 'utf8');
    expect(src).not.toContain('aria-current="true"');
    expect(src).toContain('aria-current="location"');
  });
  it('el 404 estático ancla el prefijo de idioma a la base', () => {
    const src = readFileSync('scripts/paginas-estaticas.mjs', 'utf8');
    expect(src).not.toContain('/\\\\/(gl|en)(\\\\/|$)/');
    expect(src).toContain('^${BASE_404}(gl|en)');
  });
});
