import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// Lo escribe scripts/paginas-estaticas.mjs tras `npm run build`; sin build previo no hay nada que comprobar.
const hayBuild = existsSync('dist/proyectos/tarkor/index.html');

describe.skipIf(!hayBuild)('precarga del prerender (necesita `npm run build`)', () => {
  const head = (ruta: string) => readFileSync(`dist/${ruta}index.html`, 'utf8').split('</head>')[0];
  const urls = (html: string, rel: string) =>
    [...html.matchAll(new RegExp(`<link rel="${rel}"[^>]*href="([^"]+)"`, 'g'))].map((m) => m[1]);
  const enDist = (url: string) => existsSync('dist/' + url.replace(/^\/Portal-Galivelop\//, ''));

  it('la ficha de tarkor precarga su chunk de datos y el de la página', () => {
    const modulos = urls(head('proyectos/tarkor/'), 'modulepreload');
    expect(modulos.some((u) => /\/assets\/tarkor-[^/]+\.js$/.test(u))).toBe(true);
    expect(modulos.some((u) => /\/assets\/Proyecto-[^/]+\.js$/.test(u))).toBe(true);
  });

  it('cada página lleva 2 fuentes y la imagen LCP, y todo lo que precarga existe en dist/', () => {
    for (const ruta of ['', 'en/', 'proyectos/tarkor/']) {
      const html = head(ruta);
      expect(urls(html, 'preload')).toHaveLength(3);
      expect(html).toContain('as="image" fetchpriority="high"');
      for (const u of [...urls(html, 'preload'), ...urls(html, 'modulepreload')]) {
        expect(enDist(u), `${ruta}: ${u}`).toBe(true);
      }
    }
  });

  it('Inicio precarga isobatas.svg', () => {
    expect(head('en/')).toContain('href="/Portal-Galivelop/marca/isobatas.svg"');
  });
});
