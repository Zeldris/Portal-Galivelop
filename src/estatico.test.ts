import { execFileSync } from 'node:child_process';
import {
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { entradas, minutosLectura } from './data/diario';
import { ANCHO_ESTADO, PORTADA_ESTADO } from './data/marca';
import type { EstadoProyecto } from './data/tipos';
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
  for (const f of ['Proyecto-AbCd1234.js', 'tarkor-AbCd1234.js', 'EntradaDiario-AbCd1234.js'])
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

  it('/productos es una página real (índice indexable, no un paso a /equipo) con sus productos y su lista JSON-LD', () => {
    for (const [prefijo, idioma] of [
      ['', 'es'],
      ['gl/', 'gl'],
      ['en/', 'en'],
    ] as const) {
      const html = leer(`${prefijo}productos`);
      expect(html).not.toContain('noindex');
      expect(html).not.toContain('http-equiv="refresh"');
      expect(html).toContain(`<h1>${textos[idioma]['productos.titulo']}</h1>`);
      expect(html).toContain(textos[idioma]['productos.nota']);
      expect(html).toContain(`/${prefijo}productos/galivelop-developer/">`);
      expect(html).toContain(`/${prefijo}productos/galivelop-evaluator/">`);
      // El enlace de la cabecera, en cualquier página estática.
      expect(leer(`${prefijo}equipo`)).toContain(
        `<a class="nav-productos" href="/Portal-Galivelop/${prefijo}productos/">`,
      );
      expect(html).toContain('"@type":"ItemList"');
    }
  });

  it('llevan en la cabecera todos los enlaces de la cabecera de React', () => {
    // Cada `<Link to>` de Cabecera.tsx tiene su enlace en la cabecera estática (a Productos le faltó, retro 2026-11-24 P3).
    const rutas = [
      ...readFileSync(join(RAIZ, 'src/components/Cabecera.tsx'), 'utf8').matchAll(
        /<Link to="([^"]+)"/g,
      ),
    ].map((m) => m[1]);
    expect(rutas.length).toBeGreaterThan(5);
    const cab = leer('equipo').split('</header>')[0];
    for (const r of rutas) {
      const [camino, ancla] = r.split('#');
      const href = `/Portal-Galivelop/${camino.replace(/^\//, '')}${camino === '/' ? '' : '/'}${ancla ? `#${ancla}` : ''}`;
      expect(cab, r).toContain(`href="${href}"`);
    }
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

  it('la portada de la ficha va en el HTML fuera de lo oculto, con el markup de la app', () => {
    const ficha = leer('proyectos/tarkor');
    const cab = ficha.slice(
      ficha.indexOf('<header data-guion="cabecera"'),
      ficha.indexOf('</header>', ficha.indexOf('<header data-guion="cabecera"')),
    );
    expect(cab).toContain(
      '<img class="proyecto-fondo" src="/Portal-Galivelop/proyectos/tarkor/portada.webp" srcset="/Portal-Galivelop/proyectos/tarkor/portada-movil.webp 960w, /Portal-Galivelop/proyectos/tarkor/portada.webp 1600w" sizes="100vw" alt="" fetchpriority="high" />',
    );
    // La imagen no está dentro de ningún trozo oculto; el texto de la cabecera sí.
    expect(cab.indexOf('data-estatico')).toBeGreaterThan(cab.indexOf('<img'));
    expect(cab).toContain('data-cabecera-estatica class="proyecto-cabecera cabecera-ilustracion"');
    expect(ficha).toContain('<article class="proyecto" style="--acento-proyecto:');
  });

  it('precargan la imagen de cabecera, y el trozo de la ficha', () => {
    const ficha = leer('proyectos/tarkor');
    expect(ficha).toContain(
      '<link rel="preload" as="image" href="/Portal-Galivelop/proyectos/tarkor/portada.webp" imagesrcset="/Portal-Galivelop/proyectos/tarkor/portada-movil.webp 960w, /Portal-Galivelop/proyectos/tarkor/portada.webp 1600w" imagesizes="100vw" fetchpriority="high" />',
    );
    expect(ficha).toContain('href="/Portal-Galivelop/assets/Proyecto-AbCd1234.js"');
    expect(ficha).toContain('href="/Portal-Galivelop/assets/tarkor-AbCd1234.js"');
    expect(leer('')).toContain(
      '<link rel="preload" as="image" href="/Portal-Galivelop/marca/isobatas.svg" fetchpriority="high" />',
    );
  });

  it('la portada de cada ficha lleva su versión móvil en el preload (es, gl, en), y el archivo existe', () => {
    for (const prefijo of ['', 'gl/', 'en/']) {
      for (const [slug, original] of [
        ['tarkor', 'proyectos/tarkor/portada.webp'],
        ['galivelop-image-generator', 'proyectos/galivelop-image-generator/portada.webp'],
        ['galivelop-workflow', 'marca/portada-desarrollo.webp'],
      ]) {
        const movil = original.replace('.webp', '-movil.webp');
        const html = leer(`${prefijo}proyectos/${slug}`);
        expect(html).toMatch(
          new RegExp(
            `<link rel="preload" as="image" href="/Portal-Galivelop/${original}" imagesrcset="/Portal-Galivelop/${movil} 960w, /Portal-Galivelop/${original} \\d+w" imagesizes="100vw"`,
          ),
        );
        expect(() => readFileSync(join(RAIZ, 'public', movil))).not.toThrow();
      }
    }
  });

  it('el ancho que declara el preload es el del original (no el de la versión móvil)', () => {
    const ficha = leer('proyectos/galivelop-image-generator');
    expect(ficha).toContain('portada.webp 1600w"');
  });

  it('las miniaturas del menú de proyectos llevan width y height (sin saltos de maquetación)', () => {
    for (const prefijo of ['', 'gl/', 'en/']) {
      const miniaturas = [
        ...leer(`${prefijo}equipo`).matchAll(/<img src="[^"]*portada-mini\.webp"[^>]*>/g),
      ];
      expect(miniaturas.length).toBeGreaterThan(0);
      for (const [img] of miniaturas) expect(img).toContain('width="56" height="40"');
    }
  });

  it('toda cabecera con srcsetCabecera tiene su -movil.webp de 960 px y declara el ancho real del original', () => {
    const anchoWebp = (ruta: string) => {
      const b = readFileSync(join(RAIZ, 'public', ruta));
      const tipo = b.toString('ascii', 12, 16);
      if (tipo === 'VP8X') return 1 + b.readUIntLE(24, 3);
      if (tipo === 'VP8L') return 1 + (b.readUInt32LE(21) & 0x3fff);
      return b.readUInt16LE(26) & 0x3fff; // VP8
    };
    const comprueba = (src: string, ancho: number) => {
      expect(anchoWebp(src), `${src}: ancho declarado`).toBe(ancho);
      expect(anchoWebp(src.replace('.webp', '-movil.webp')), `${src}: versión móvil`).toBe(960);
    };
    const dir = join(RAIZ, 'src/data/proyectos');
    let fichas = 0;
    for (const f of readdirSync(dir).filter((n) => n.endsWith('.json'))) {
      const p = JSON.parse(readFileSync(join(dir, f), 'utf8'));
      const modo = p.cabecera ?? 'ilustracion';
      if (modo === 'ilustracion') comprueba(p.portada.src, p.portada.ancho);
      if (modo === 'color') comprueba(PORTADA_ESTADO[p.estado as EstadoProyecto], ANCHO_ESTADO);
      fichas++;
    }
    expect(fichas).toBeGreaterThan(0);
    for (const src of Object.values(PORTADA_ESTADO)) comprueba(src, ANCHO_ESTADO);
  });
});

describe('feed Atom de novedades', () => {
  const feed = (prefijo: string) =>
    readFileSync(join(tmp, 'dist', prefijo, 'novedades/feed.xml'), 'utf8');
  const proyectos = readdirSync(join(RAIZ, 'src/data/proyectos'))
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(readFileSync(join(RAIZ, 'src/data/proyectos', f), 'utf8')));
  const totalNovedades = proyectos.reduce((n, p) => n + (p.novedades?.length ?? 0), 0);

  it('hay uno por idioma, con su enlace a sí mismo, a la página y una entrada por novedad', () => {
    for (const [prefijo, idioma] of [
      ['', 'es'],
      ['gl/', 'gl'],
      ['en/', 'en'],
    ] as const) {
      const xml = feed(prefijo);
      expect(xml).toMatch(
        /^<\?xml version="1.0" encoding="utf-8"\?>\n<feed xmlns="http:\/\/www.w3.org\/2005\/Atom"/,
      );
      expect(xml).toContain(`xml:lang="${idioma}"`);
      expect(xml).toContain(
        `<link rel="self" type="application/atom+xml" href="https://zeldris.github.io/Portal-Galivelop/${prefijo}novedades/feed.xml" />`,
      );
      expect(xml).toContain(
        `href="https://zeldris.github.io/Portal-Galivelop/${prefijo}novedades/" />`,
      );
      // Al menos las novedades de las fichas (el muro suma las suyas).
      expect((xml.match(/<entry>/g) ?? []).length).toBeGreaterThanOrEqual(totalNovedades);
      expect(xml.endsWith('</feed>\n')).toBe(true);
    }
  });

  it('los id de las entradas son únicos y no dependen de la dirección del sitio', () => {
    const ids = [
      ...feed('').matchAll(/<entry>\n {4}<title>[^<]*<\/title>\n {4}<id>([^<]+)<\/id>/g),
    ].map((m) => m[1]);
    expect(ids.length).toBeGreaterThanOrEqual(totalNovedades);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^tag:zeldris\.github\.io,2026:novedades\/es\//);
  });

  it('el texto va escapado: ningún & suelto ni etiqueta dentro de un título o resumen', () => {
    const xml = feed('en/');
    for (const m of xml.matchAll(/<(title|summary)>([^]*?)<\/\1>/g)) {
      expect(m[2]).not.toMatch(/<|&(?!amp;|quot;|lt;)/);
    }
  });

  it('cada página lo anuncia en su idioma y /novedades lo enlaza sin JavaScript', () => {
    expect(leer('gl/equipo')).toContain(
      '<link rel="alternate" type="application/atom+xml" title="Novidades · Galivelop" href="https://zeldris.github.io/Portal-Galivelop/gl/novedades/feed.xml" />',
    );
    expect(leer('novedades')).toContain(
      `<a href="https://zeldris.github.io/Portal-Galivelop/novedades/feed.xml" type="application/atom+xml">${textos.es['novedades.feed']}</a>`,
    );
  });
});

describe('diario del taller', () => {
  const ld = (ruta: string) =>
    JSON.parse(
      leer(ruta)
        .match(/<script type="application\/ld\+json">([^<]*)<\/script>/)![1]
        .replace(/\\u003c/g, '<'),
    );
  const idiomas = [
    ['', 'es'],
    ['gl/', 'gl'],
    ['en/', 'en'],
  ] as const;
  const e = entradas[0];
  const SITIO = 'https://zeldris.github.io/Portal-Galivelop/';

  it('cada entrada tiene su página por idioma, con su cuerpo, h2 por sección, autor enlazado y lectura', () => {
    expect(entradas.length).toBeGreaterThan(0);
    for (const [prefijo, i] of idiomas) {
      for (const x of entradas) {
        const html = leer(`${prefijo}diario/${x.slug}`);
        expect(html).toContain(`<h1>${x.titulo[i]}</h1>`);
        expect(html).toContain(
          `<link rel="canonical" href="${SITIO}${prefijo}diario/${x.slug}/" />`,
        );
        expect(html).toContain(`<time datetime="${x.fecha}">`);
        expect(html).toContain(`href="${SITIO}${prefijo}equipo/${x.autor}/"`);
        expect(html).toContain(
          textos[i]['diario.lecturaMin'].replace('{min}', String(minutosLectura(x, i))),
        );
        expect(html.match(/<h2>/g)).toHaveLength(x.secciones.length);
        expect(html).toContain('modulepreload');
        expect(html).toContain('EntradaDiario-AbCd1234.js');
      }
    }
  });

  it('el cuerpo estático lleva la animación como lista ordenada de pasos y `código` como <code>', () => {
    const html = leer(`diario/${e.slug}`);
    expect(html).toMatch(/<figure><ol><li><strong>/);
    expect(html).toContain('<code>');
    expect(html).not.toContain('`');
  });

  it('og:type es article en la entrada y website en el índice', () => {
    expect(leer(`diario/${e.slug}`)).toContain('<meta property="og:type" content="article" />');
    expect(leer('diario')).toContain('<meta property="og:type" content="website" />');
  });

  it('BlogPosting de la entrada: titular, descripción, fecha, autor con url, idioma, editor y dirección', () => {
    for (const [prefijo, i] of idiomas) {
      const d = ld(`${prefijo}diario/${e.slug}`);
      expect(d['@type']).toBe('BlogPosting');
      expect(d.headline).toBe(e.titulo[i]);
      expect(d.description).toBe(e.descripcion[i]);
      expect(d.datePublished).toBe(e.fecha);
      expect(d.author['@type']).toBe('Person');
      expect(d.author.name).toBeTruthy();
      expect(d.author.url).toBe(`${SITIO}${prefijo}equipo/${e.autor}/`);
      expect(d.inLanguage).toBe(i);
      expect(d.publisher['@type']).toBe('Organization');
      expect(d.url).toBe(`${SITIO}${prefijo}diario/${e.slug}/`);
      expect(d.mainEntityOfPage['@id']).toBe(d.url);
    }
  });

  it('el índice es un Blog con un blogPost por entrada y las lista en el HTML', () => {
    for (const [prefijo, i] of idiomas) {
      const d = ld(`${prefijo}diario`);
      expect(d['@type']).toBe('Blog');
      expect(d.blogPost).toHaveLength(entradas.length);
      expect(d.blogPost[0].url).toBe(`${SITIO}${prefijo}diario/${e.slug}/`);
      expect(d.blogPost[0].datePublished).toBe(e.fecha);
      expect(leer(`${prefijo}diario`)).toContain(
        `<a href="${SITIO}${prefijo}diario/${e.slug}/">${e.titulo[i]}</a>`,
      );
    }
  });

  it('sitemap con lastmod = fecha de la entrada, y llms.txt con su sección', () => {
    const sitemap = readFileSync(join(tmp, 'dist/sitemap.xml'), 'utf8');
    for (const [prefijo] of idiomas)
      expect(sitemap).toContain(
        `<loc>${SITIO}${prefijo}diario/${e.slug}/</loc><lastmod>${e.fecha}</lastmod>`,
      );
    expect(sitemap).toContain(`<loc>${SITIO}diario/</loc><lastmod>${entradas[0].fecha}</lastmod>`);
    const llms = readFileSync(join(tmp, 'dist/llms.txt'), 'utf8');
    expect(llms).toContain('## Diario');
    expect(llms).toContain(`- [${e.titulo.es}](${SITIO}diario/${e.slug}/): ${e.descripcion.es}`);
  });
});
