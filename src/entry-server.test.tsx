import { describe, expect, it } from 'vitest';
import { renderizar } from './entry-server';
import { buscarProyecto } from './data/proyectos';
import { textos } from './i18n/textos';

const BASE = import.meta.env.BASE_URL;
const h1 = (html: string) => [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => m[1]);
const sinEtiquetas = (s: string) => s.replace(/<[^>]+>/g, '').replace(/<!--[\s\S]*?-->/g, '');

describe('prerender de la app (entry-server)', () => {
  it('la ficha de tarkor sale entera, con un único <h1> con su nombre y sin «cargando»', async () => {
    const html = await renderizar(`${BASE}proyectos/tarkor/`);
    const titulos = h1(html);
    expect(titulos).toHaveLength(1);
    expect(sinEtiquetas(titulos[0])).toContain(buscarProyecto('tarkor')!.nombre);
    expect(html).not.toContain('carga-pagina');
    expect(html).toContain('id="contenido"');
  });

  it('la portada en gallego lleva sus textos y los enlaces con el prefijo /gl/', async () => {
    const html = await renderizar(`${BASE}gl/`);
    expect(h1(html)).toHaveLength(1);
    expect(html).toContain(`href="${BASE}gl/equipo/"`);
    expect(html).toContain(textos.gl['nav.equipo']);
  });

  it('las páginas perezosas (equipo, novedades) salen sin el hueco de carga', async () => {
    for (const ruta of ['equipo/', 'en/novedades/']) {
      const html = await renderizar(`${BASE}${ruta}`);
      expect(html, ruta).not.toContain('carga-pagina');
      expect(h1(html), ruta).toHaveLength(1);
    }
  });
});
