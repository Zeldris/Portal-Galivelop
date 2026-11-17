import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { textos } from './i18n/textos';

// Corre scripts/paginas-estaticas.mjs sobre un dist/ mínimo (el index.html del repo y unos «chunks» de mentira) y mira el
// HTML que genera: cabecera y pie sin JavaScript, h1 igual que el de la app, publisher con url y precargas.
const RAIZ = resolve(__dirname, '..');
let tmp = '';
const leer = (ruta: string) => readFileSync(join(tmp, 'dist', ruta, 'index.html'), 'utf8');

beforeAll(() => {
  tmp = mkdtempSync(join(tmpdir(), 'estatico-'));
  for (const d of ['public', 'src', 'tools']) symlinkSync(join(RAIZ, d), join(tmp, d));
  mkdirSync(join(tmp, 'dist/assets'), { recursive: true });
  const base = readFileSync(join(RAIZ, 'index.html'), 'utf8').replaceAll(
    '%BASE_URL%',
    '/Portal-Galivelop/',
  );
  writeFileSync(join(tmp, 'dist/index.html'), base);
  writeFileSync(join(tmp, 'dist/404.html'), base);
  for (const f of ['Proyecto-AbCd1234.js', 'tarkor-AbCd1234.js'])
    writeFileSync(join(tmp, 'dist/assets', f), '');
  execFileSync('node', [join(RAIZ, 'scripts/paginas-estaticas.mjs')], { cwd: tmp, stdio: 'pipe' });
}, 60_000);

afterAll(() => rmSync(tmp, { recursive: true, force: true }));

describe('páginas estáticas', () => {
  it('llevan cabecera con el menú y el selector de idioma como enlaces a la misma página', () => {
    const html = leer('gl/equipo');
    expect(html).toContain('<header class="cabecera">');
    expect(html).toContain(`>${textos.gl['nav.saltar']}</a>`);
    expect(html).toContain('<a href="/Portal-Galivelop/gl/novedades/">');
    expect(html).toContain('<a lang="es" href="/Portal-Galivelop/equipo/">ES</a>');
    expect(html).toContain(
      '<a lang="gl" aria-current="page" href="/Portal-Galivelop/gl/equipo/">GL</a>',
    );
    expect(html).toContain('<a lang="en" href="/Portal-Galivelop/en/equipo/">EN</a>');
  });

  it('llevan el pie con los enlaces legales y de participa en su idioma', () => {
    const html = leer('en/participa/unirse');
    expect(html).toContain('<footer class="pie" data-estatico>');
    expect(html).toContain('href="/Portal-Galivelop/en/privacidad/">Privacy policy</a>');
    expect(html).toContain(`>${textos.en['prop.titulo']}</a>`);
    expect(html).toContain('href="https://creativecommons.org/licenses/by/4.0/"');
  });

  it('el h1 es el de la app en inicio, equipo, proponer y unirse, en los tres idiomas', () => {
    for (const i of ['es', 'gl', 'en'] as const) {
      const prefijo = i === 'es' ? '' : `${i}/`;
      const h1 = (ruta: string) =>
        leer(`${prefijo}${ruta}`.replace(/\/$/, '')).match(/<h1>([^<]*)<\/h1>/)?.[1];
      expect(h1('')).toBe(`${textos[i]['hero.titulo1']} ${textos[i]['hero.titulo2']}`);
      expect(h1('equipo')).toBe(textos[i]['equipo.titulo']);
      expect(h1('participa/proponer')).toBe(textos[i]['prop.titulo']);
      expect(h1('participa/unirse')).toBe(textos[i]['unir.titulo']);
    }
  });

  it('el publisher del JSON-LD lleva la url del portal', () => {
    const ld = leer('').match(/<script type="application\/ld\+json">([^<]*)<\/script>/)![1];
    const web = JSON.parse(ld)['@graph'].find((x: { '@type': string }) => x['@type'] === 'WebSite');
    expect(web.publisher.url).toBe('https://zeldris.github.io/Portal-Galivelop/');
  });

  it('precargan la imagen de cabecera, y el trozo de la ficha', () => {
    const ficha = leer('proyectos/tarkor');
    expect(ficha).toContain(
      '<link rel="preload" as="image" href="/Portal-Galivelop/proyectos/tarkor/portada.webp" fetchpriority="high" />',
    );
    expect(ficha).toContain('href="/Portal-Galivelop/assets/Proyecto-AbCd1234.js"');
    expect(ficha).toContain('href="/Portal-Galivelop/assets/tarkor-AbCd1234.js"');
    expect(leer('')).toContain(
      '<link rel="preload" as="image" href="/Portal-Galivelop/marca/isobatas.svg" fetchpriority="high" />',
    );
  });
});
