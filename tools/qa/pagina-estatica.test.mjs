import { describe, expect, it } from 'vitest';
import { createRequire } from 'node:module';

const {
  normalizarRuta,
  normalizarBase,
  rutasDelSitemap,
  canonicalDe,
  motivoNoEstatica,
  cssEnlazados,
  resumenFuentes,
  esCodigoDeSrc,
  motivoSinCasos,
} = createRequire(import.meta.url)(
  './pagina-estatica.cjs',
);

const pagina = (canonical, estatico = true) =>
  `<html><head><link rel="canonical" href="https://zeldris.github.io/Portal-Galivelop/${canonical}" /></head><body><main id="contenido"${estatico ? ' data-estatico' : ''}></main></body></html>`;

describe('normalizarRuta', () => {
  it('pone la barra final y quita la inicial', () => {
    expect(['equipo', '/equipo', 'equipo/', 'proyectos/tarkor//'].map(normalizarRuta)).toEqual([
      'equipo/',
      'equipo/',
      'equipo/',
      'proyectos/tarkor/',
    ]);
  });
  it('no añade barra a un archivo como 404.html', () => {
    expect(['404.html', '/404.html', 'sitemap.xml'].map(normalizarRuta)).toEqual([
      '404.html',
      '404.html',
      'sitemap.xml',
    ]);
  });
  it('deja la portada vacía', () => {
    expect(['', '/'].map(normalizarRuta)).toEqual(['', '']);
  });
});

describe('motivoNoEstatica', () => {
  it('acepta la página estática de la ruta', () => {
    expect(motivoNoEstatica(pagina('equipo/'), 'equipo/')).toBeNull();
    expect(motivoNoEstatica(pagina(''), '')).toBeNull();
  });
  it('rechaza el HTML sin data-estatico, con el motivo', () => {
    expect(motivoNoEstatica(pagina('equipo/', false), 'equipo/')).toMatch(/no data-estatico/);
  });
  it('rechaza la portada servida en lugar de la ruta (sin barra final en vite preview)', () => {
    expect(motivoNoEstatica(pagina(''), 'equipo/')).toMatch(
      /returned the page of .*Portal-Galivelop\/ \(expected one ending in \/Portal-Galivelop\/equipo\/\)/,
    );
  });
  it('rechaza la página de otra ruta que acaba igual solo en parte', () => {
    expect(motivoNoEstatica(pagina('proyectos/tarkor/'), 'tarkor/')).toMatch(
      /returned the page of/,
    );
  });
  it('rechaza el HTML sin canonical', () => {
    expect(motivoNoEstatica('<main data-estatico></main>', 'equipo/')).toMatch(/no canonical/);
  });
});

describe('canonical y BASE', () => {
  it('lee el canonical con href antes que rel', () => {
    const html = '<link href="https://x.example.com/Portal-Galivelop/equipo/" rel="canonical">';
    expect(canonicalDe(html)).toBe('https://x.example.com/Portal-Galivelop/equipo/');
    expect(motivoNoEstatica(`<main data-estatico></main>${html}`, 'equipo/')).toBeNull();
  });
  it('ignora otros link y no confunde canonical con otro rel', () => {
    expect(canonicalDe('<link rel="alternate" href="/a/"><link rel="icon" href="/b">')).toBeUndefined();
  });
  it('la ruta esperada sale de BASE y no va fija', () => {
    const html = pagina('equipo/').replace('Portal-Galivelop', 'otro');
    expect(motivoNoEstatica(html, 'equipo/', 'http://localhost:4175/otro/')).toBeNull();
    expect(motivoNoEstatica(html, 'equipo/', 'http://localhost:4175/otro')).toBeNull();
    expect(motivoNoEstatica(html, 'equipo/')).toMatch(/expected one ending in \/Portal-Galivelop\/equipo\//);
  });
  it('normalizarBase deja una sola barra final', () => {
    expect(['http://h:1/x', 'http://h:1/x/', 'http://h:1/x//'].map(normalizarBase)).toEqual([
      'http://h:1/x/',
      'http://h:1/x/',
      'http://h:1/x/',
    ]);
  });
  it('rutasDelSitemap quita el origen y la ruta de BASE, con o sin barra final', () => {
    const xml =
      '<loc>https://s.example.com/otro/</loc><loc>https://s.example.com/otro/equipo/</loc><loc>https://s.example.com/otro/gl/</loc>';
    expect(rutasDelSitemap(xml, 'http://localhost:1/otro')).toEqual(['', 'equipo/', 'gl/']);
    expect(rutasDelSitemap(xml, 'http://localhost:1/otro/')).toEqual(['', 'equipo/', 'gl/']);
  });
});

describe('CSS y fuentes', () => {
  it('cssEnlazados devuelve todas las hojas, en cualquier orden de atributos', () => {
    const html =
      '<link rel="stylesheet" href="/Portal-Galivelop/assets/a-12345678.css"><link href="/Portal-Galivelop/assets/b-12345678.css" rel="stylesheet"><link rel="icon" href="/x.png">';
    expect(cssEnlazados(html)).toEqual(['a-12345678.css', 'b-12345678.css']);
  });
  it('resumenFuentes cuenta las @font-face de todas las hojas', () => {
    const r = resumenFuentes([
      '@font-face{font-display:swap}',
      '@font-face{font-display:block}@font-face{font-display:swap}',
    ]);
    expect(r).toEqual({ fontFace: 3, fontDisplay: ['font-display:swap', 'font-display:block'] });
  });
});

describe('auditar-seguridad y probar-lector', () => {
  it('solo el código de src/ (no sus tests) lleva la búsqueda completa', () => {
    expect(esCodigoDeSrc('/r/src/App.tsx')).toBe(true);
    expect(esCodigoDeSrc('/r/src/App.test.tsx')).toBe(false);
    expect(esCodigoDeSrc('/r/tools/qa/x.cjs')).toBe(false);
  });
  it('no es verde con 0 casos, y dice por qué', () => {
    expect(motivoSinCasos([], ['/equipo'])).toMatch(/ningún guion.*\/equipo.*no se ha probado nada/);
    expect(motivoSinCasos([], [])).toMatch(/src\/data\/guiones; no se ha probado nada/);
    expect(motivoSinCasos([{}], [])).toBeNull();
  });
});
