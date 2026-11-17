#!/usr/bin/env node
// Audita lo que `npm run seo` no mira: validez del HTML de `dist/`, datos estructurados (JSON-LD), la web sin
// JavaScript, la impresión y la paridad entre castellano, gallego e inglés. Todo con comprobaciones propias, sin
// dependencias nuevas. Pide Playwright (como medir-paginas.cjs): en local, `npm i --no-save playwright`. Uso, tras
// `npm run build`:
//   npm run auditar:html                 (todo; sale con 1 si hay errores)
//   PDF_DIR=/ruta/print npm run auditar:html     (dónde dejar los PDF de impresión; por defecto, tmp del sistema)
//   JSON=/ruta/hallazgos.json ...        (además, vuelca los hallazgos en JSON)
// Sin servidor en el puerto 4177, arranca `vite preview` y lo para al acabar. Gravedad: grave y medio cuentan como
// error (salida 1); leve solo se lista.
const { spawn } = require('node:child_process');
const { existsSync, readFileSync, readdirSync, statSync, mkdirSync, writeFileSync } = require('node:fs');
const { join, relative } = require('node:path');
const os = require('node:os');
let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  console.error('auditar-html: Playwright is not installed. Run: npm i --no-save playwright');
  process.exit(2);
}

const RAIZ = join(__dirname, '..', '..');
const DIST = join(RAIZ, 'dist');
const PUERTO = 4177;
const BASE = process.env.BASE || `http://localhost:${PUERTO}/Portal-Galivelop/`;
const SITIO = 'https://zeldris.github.io/Portal-Galivelop/';
const PDF_DIR = process.env.PDF_DIR || join(os.tmpdir(), 'auditar-html-print');
const IDIOMAS = ['es', 'gl', 'en'];

const hallazgos = [];
const h = (gravedad, area, paginas, texto) => hallazgos.push({ gravedad, area, paginas: [].concat(paginas), texto });

// ---------- Lectura de dist ----------
function htmls(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) return htmls(p);
    return n.endsWith('.html') ? [p] : [];
  });
}
/** Ruta pública (`/gl/equipo/`) y idioma esperado de un archivo de dist. */
function rutaDe(archivo) {
  const rel = relative(DIST, archivo).replace(/\\/g, '/');
  const ruta = '/' + rel.replace(/index\.html$/, '');
  const m = ruta.match(/^\/(gl|en)(\/|$)/);
  return { rel, ruta, idioma: m ? m[1] : 'es', base: m ? ruta.replace(/^\/(gl|en)/, '') || '/' : ruta };
}

// ---------- Mini analizador de HTML ----------
const VACIOS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const BLOQUES = new Set(['div', 'p', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'table', 'section', 'article', 'main', 'nav', 'header', 'footer', 'form', 'blockquote', 'pre', 'figure', 'dl', 'hr']);
function atributos(s) {
  const a = {};
  for (const m of s.matchAll(/([^\s=\/"'>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g)) a[m[1].toLowerCase()] = m[2] ?? m[3] ?? m[4] ?? '';
  return a;
}
/** Devuelve {etiquetas, errores}: etiquetas con atributos y pila de ancestros; errores de anidamiento. */
function analizar(html) {
  const sinScripts = html.replace(/<!--[\s\S]*?-->/g, '').replace(/<(script|style|noscript)\b[^>]*>[\s\S]*?<\/\1>/gi, (m) => m.match(/^<[^>]*>/)[0] + `</${m.match(/^<(\w+)/)[1]}>`);
  const pila = [];
  const etiquetas = [];
  const errores = [];
  for (const m of sinScripts.matchAll(/<(\/?)([a-zA-Z][\w-]*)([^>]*)>/g)) {
    const [, cierra, nombre0, resto] = m;
    const nombre = nombre0.toLowerCase();
    if (cierra) {
      const i = pila.map((p) => p.nombre).lastIndexOf(nombre);
      if (i >= 0) pila.length = i;
      continue;
    }
    const attrs = atributos(resto);
    const ancestros = pila.map((p) => p.nombre);
    etiquetas.push({ nombre, attrs, ancestros });
    if (nombre === 'a' && ancestros.includes('a')) errores.push('<a> dentro de <a>');
    if (nombre === 'button' && ancestros.includes('a')) errores.push('<button> dentro de <a>');
    if (nombre === 'a' && ancestros.includes('button')) errores.push('<a> dentro de <button>');
    if (nombre === 'button' && ancestros.includes('button')) errores.push('<button> dentro de <button>');
    if (BLOQUES.has(nombre) && ancestros.at(-1) === 'p') errores.push(`<${nombre}> dentro de <p>`);
    if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(nombre) && ancestros.includes('button')) errores.push(`<${nombre}> dentro de <button>`);
    if (nombre === 'li' && !['ul', 'ol', 'menu'].includes(ancestros.at(-1))) errores.push('<li> fuera de ul/ol');
    if (!VACIOS.has(nombre) && !/\/\s*$/.test(resto)) pila.push({ nombre });
  }
  return { etiquetas, errores: [...new Set(errores)] };
}
const sinEtiquetas = (s) => s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/\s+/g, ' ').trim();
const contenidoRoot = (html) => (html.match(/<div id="root">([\s\S]*?)<\/div>\s*<\/body>/) || [, ''])[1];

// ---------- a) HTML ----------
const paginas = htmls(DIST).map((f) => {
  const html = readFileSync(f, 'utf8');
  const info = rutaDe(f);
  return { f, html, ...info, ...analizar(html) };
});
const noHtml = (p) => /^google[0-9a-f]+\.html$/.test(p.rel) || p.rel === '404.html';
// Las páginas puente (meta refresh + noindex, como /productos) se saltan: son redirecciones a propósito.
const reales = paginas.filter((p) => !noHtml(p) && !/http-equiv="refresh"/i.test(p.html));

function auditarHtml() {
  const titulos = new Map();
  const descs = new Map();
  for (const p of reales) {
    const ids = p.etiquetas.map((e) => e.attrs.id).filter(Boolean);
    const dup = ids.filter((x, i) => ids.indexOf(x) !== i);
    if (dup.length) h('medio', 'html', p.rel, `ids duplicados: ${[...new Set(dup)].join(', ')}`);
    const lang = (p.html.match(/<html[^>]*\blang="([^"]*)"/) || [])[1];
    if (lang !== p.idioma) h('grave', 'html', p.rel, `<html lang="${lang}"> y la ruta pide "${p.idioma}"`);
    const canon = (p.html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1];
    const esperada = SITIO + p.ruta.slice(1);
    if (!canon) h('grave', 'html', p.rel, 'sin canonical');
    else if (!/^https:\/\//.test(canon)) h('grave', 'html', p.rel, `canonical no absoluto: ${canon}`);
    else if (canon !== esperada) h('grave', 'html', p.rel, `canonical ${canon} ≠ ${esperada}`);
    const alt = [...p.html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => [m[1], m[2]]);
    const mapa = Object.fromEntries(alt);
    for (const l of [...IDIOMAS, 'x-default']) if (!mapa[l]) h('grave', 'html', p.rel, `falta hreflang="${l}"`);
    if (alt.length !== new Set(alt.map((a) => a[0])).size) h('medio', 'html', p.rel, 'hreflang repetido');
    for (const l of IDIOMAS) {
      if (!mapa[l]) continue;
      const rutaL = mapa[l].replace(SITIO, '/');
      const otra = reales.find((q) => q.ruta === rutaL);
      if (!otra) {
        h('grave', 'html', p.rel, `hreflang ${l} apunta a ${mapa[l]}, que no existe en dist`);
        continue;
      }
      const suyo = Object.fromEntries([...otra.html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => [m[1], m[2]]));
      for (const k of [...IDIOMAS, 'x-default']) if (suyo[k] !== mapa[k]) h('grave', 'html', p.rel, `hreflang no recíproco: ${otra.rel} da ${k}=${suyo[k]}, esta da ${mapa[k]}`);
    }
    if (mapa['x-default'] && mapa.es && mapa['x-default'] !== mapa.es) h('leve', 'html', p.rel, 'x-default no apunta a la versión en castellano');
    const h1 = p.etiquetas.filter((e) => e.nombre === 'h1').length;
    const estatico = contenidoRoot(p.html);
    const h1Est = (estatico.match(/<h1\b/g) || []).length;
    if ((h1 !== 1 || h1Est !== 1)) h('medio', 'html', p.rel, `${h1} <h1> (${h1Est} dentro de #root)`);
    const titulo = sinEtiquetas((p.html.match(/<title>([\s\S]*?)<\/title>/) || [, ''])[1]);
    const desc = (p.html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
    if (!titulo) h('grave', 'html', p.rel, 'sin <title>');
    if (!desc) h('grave', 'html', p.rel, 'sin meta description');
    const kt = p.idioma + '|' + titulo;
    const kd = p.idioma + '|' + desc;
    titulos.set(kt, [...(titulos.get(kt) || []), p.rel]);
    descs.set(kd, [...(descs.get(kd) || []), p.rel]);
    for (const e of p.errores) h('medio', 'html', p.rel, `anidamiento inválido: ${e}`);
    // Anidamientos del DOM estático (el generado por React se ve en la sección sin JS / con JS no se parsea aquí).
    const metas = (p.html.match(/<meta charset/gi) || []).length;
    if (metas !== 1) h('leve', 'html', p.rel, `${metas} <meta charset>`);
    if (!/^<!doctype html>/i.test(p.html.trimStart())) h('medio', 'html', p.rel, 'sin <!doctype html>');
    for (const img of p.etiquetas.filter((e) => e.nombre === 'img')) {
      if (img.attrs.alt === undefined) h('medio', 'html', p.rel, `<img> sin alt: ${img.attrs.src}`);
      if (!img.attrs.width || !img.attrs.height) h('leve', 'html', p.rel, `<img> sin width/height (CLS): ${img.attrs.src}`);
    }
  }
  for (const [mapaUnicos, que] of [[titulos, '<title>'], [descs, 'meta description']])
    for (const [k, rels] of mapaUnicos) if (rels.length > 1) h('medio', 'html', rels, `${que} repetido en ${k.split('|')[0]}: «${k.split('|')[1].slice(0, 70)}»`);
}

// ---------- b) JSON-LD ----------
const REQUERIDAS = {
  Organization: ['name', 'url'],
  WebSite: ['name', 'url'],
  Person: ['name'],
  SoftwareApplication: ['name', 'offers', 'applicationCategory'],
  WebApplication: ['name', 'offers', 'applicationCategory'],
  VideoGame: ['name'],
  BreadcrumbList: ['itemListElement'],
  ProfilePage: ['mainEntity'],
  WebPage: ['name'],
  CollectionPage: ['name'],
  ListItem: ['position', 'name'],
  Article: ['headline', 'author', 'datePublished'],
};
const TIPOS_OK = new Set([...Object.keys(REQUERIDAS), 'ImageObject', 'ContactPoint', 'Offer', 'ItemList', 'AboutPage', 'ContactPage', 'PostalAddress', 'Thing', 'CreativeWork', 'Blog', 'BlogPosting', 'NewsArticle']);
const CLAVES_URL = new Set(['url', 'logo', 'image', '@id', 'item', 'sameAs', 'contentUrl', 'thumbnailUrl']);
function recorrer(nodo, fn, ruta = '') {
  if (Array.isArray(nodo)) return nodo.forEach((x, i) => recorrer(x, fn, `${ruta}[${i}]`));
  if (nodo && typeof nodo === 'object') {
    fn(nodo, ruta);
    for (const [k, v] of Object.entries(nodo)) recorrer(v, fn, ruta + '.' + k);
  }
}
function auditarJsonLd() {
  for (const p of reales) {
    const bloques = [...p.html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
    if (!bloques.length) h('medio', 'jsonld', p.rel, 'sin JSON-LD');
    let nombres = 0;
    bloques.forEach((txt, i) => {
      let json;
      try {
        json = JSON.parse(txt);
      } catch (e) {
        h('grave', 'jsonld', p.rel, `JSON-LD #${i + 1} no es JSON válido: ${e.message}`);
        return;
      }
      if (!/schema\.org/.test(JSON.stringify(json['@context'] || ''))) h('grave', 'jsonld', p.rel, `JSON-LD #${i + 1} sin @context de schema.org`);
      recorrer(json, (n, ruta) => {
        for (const [k, v] of Object.entries(n)) {
          if (!CLAVES_URL.has(k)) continue;
          for (const u of [].concat(v)) if (typeof u === 'string' && !/^https?:\/\//.test(u)) h('medio', 'jsonld', p.rel, `${n['@type'] || 'nodo'}${ruta}.${k} no es URL absoluta: ${u}`);
        }
        if (n.inLanguage && !(typeof n.inLanguage === 'string' ? n.inLanguage : n.inLanguage.name || '').toLowerCase().startsWith(p.idioma)) h('grave', 'jsonld', p.rel, `inLanguage "${n.inLanguage}" en página "${p.idioma}"`);
        if (n.email && /@/.test(n.email)) nombres++;
        const tipos = [].concat(n['@type'] || []);
        for (const t of tipos) {
          if (!TIPOS_OK.has(t)) h('medio', 'jsonld', p.rel, `tipo no esperado: ${t}`);
          for (const req of REQUERIDAS[t] || []) if (n[req] === undefined || n[req] === '') h(req === 'offers' || req === 'applicationCategory' ? 'leve' : 'medio', 'jsonld', p.rel, `${t}${ruta} sin «${req}» (requerida o recomendada por Google)`);
        }
        if (n['@type'] === 'WebSite' && n.url && p.base === '/' && n.url !== SITIO + p.ruta.slice(1)) h('leve', 'jsonld', p.rel, `WebSite.url ${n.url} no es la portada de este idioma`);
      });
    });
    if (nombres) h('leve', 'jsonld', p.rel, 'JSON-LD publica un correo personal (email) en el HTML');
    const tienePagina = bloques.some((b) => /"url":"[^"]*"/.test(b));
    if (!tienePagina && bloques.length) h('leve', 'jsonld', p.rel, 'ningún nodo con url');
    if (p.base !== '/' && !bloques.some((b) => b.includes('BreadcrumbList'))) h('leve', 'jsonld', p.rel, 'sin BreadcrumbList en página interior');
  }
}

// ---------- c-d) Navegador ----------
async function responde() {
  return fetch(BASE, { signal: AbortSignal.timeout(2000) }).then((r) => r.ok, () => false);
}
let vista = null;
const parar = (hijo) => {
  try {
    process.kill(-hijo.pid);
  } catch {
    // Ya había terminado.
  }
};
async function servidor() {
  if (process.env.BASE || (await responde())) return;
  vista = spawn('npx', ['vite', 'preview', '--port', String(PUERTO), '--strictPort'], { cwd: RAIZ, stdio: ['ignore', 'ignore', 'pipe'], detached: true });
  let fallo = null;
  vista.on('exit', (c) => (fallo ??= `exited with code ${c}`));
  for (let i = 0; i < 60 && !fallo; i++) {
    if (await responde()) return;
    await new Promise((r) => setTimeout(r, 250));
  }
  parar(vista);
  console.error(`auditar-html: vite preview did not start (${fallo ?? 'timeout'})`);
  process.exit(2);
}
for (const s of ['SIGINT', 'SIGTERM']) process.on(s, () => (vista && parar(vista), process.exit(130)));

async function sinJs(navegador) {
  const ctxSin = await navegador.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 800 } });
  const ctxCon = await navegador.newContext({ viewport: { width: 1280, height: 800 } });
  const medir = () => {
    const visible = (el) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden';
    };
    const enMain = [...document.querySelectorAll('a[href]')].filter(visible);
    return {
      h1: [...document.querySelectorAll('h1')].map((x) => x.textContent.trim()).join(' | '),
      parrafos: document.querySelectorAll('p').length,
      h2: document.querySelectorAll('h2').length,
      enlaces: document.querySelectorAll('a[href]').length,
      enlacesNav: document.querySelectorAll('nav a[href], header a[href]').length,
      enlacesVisibles: enMain.length,
      botones: document.querySelectorAll('button').length,
      noscript: document.querySelectorAll('noscript').length,
      texto: (document.body.innerText || '').replace(/\s+/g, ' ').trim().length,
      sinHref: [...document.querySelectorAll('a:not([href])')].map((x) => x.textContent.trim().slice(0, 30)),
      hrefVacio: [...document.querySelectorAll('a[href="#"], a[href=""], a[href^="javascript:"]')].length,
      raizVacia: !document.getElementById('root')?.children.length,
      cabecera: !!document.querySelector('header'),
      pie: !!document.querySelector('footer'),
    };
  };
  for (const p of reales) {
    const url = BASE + p.ruta.slice(1);
    const a = await ctxSin.newPage();
    const b = await ctxCon.newPage();
    try {
      await a.goto(url, { waitUntil: 'load' });
      await b.goto(url, { waitUntil: 'networkidle' });
      const s = await a.evaluate(medir);
      const c = await b.evaluate(medir);
      if (s.raizVacia) h('grave', 'sinjs', p.rel, 'sin JS, #root vacío: la página no muestra nada');
      else {
        if (!s.h1) h('grave', 'sinjs', p.rel, 'sin JS no hay <h1>');
        if (c.h1 && s.h1 && c.h1 !== s.h1) h('leve', 'sinjs', p.rel, `h1 distinto: sin JS «${s.h1.slice(0, 50)}» / con JS «${c.h1.slice(0, 50)}»`);
        if (s.enlaces < 3) h('medio', 'sinjs', p.rel, `sin JS solo ${s.enlaces} enlaces (con JS ${c.enlaces})`);
        if (!s.enlacesNav) h('medio', 'sinjs', p.rel, `sin JS no hay enlaces de navegación (con JS ${c.enlacesNav}): no se puede ir a otra página`);
        if (!s.cabecera || !s.pie) h('medio', 'sinjs', p.rel, `sin JS falta ${!s.cabecera ? 'cabecera' : ''}${!s.cabecera && !s.pie ? ' y ' : ''}${!s.pie ? 'pie' : ''} (con JS: cabecera ${c.cabecera}, pie ${c.pie})`);
        if (s.hrefVacio) h('medio', 'sinjs', p.rel, `${s.hrefVacio} enlaces con href vacío, # o javascript:`);
        if (s.sinHref.length) h('medio', 'sinjs', p.rel, `<a> sin href (solo onClick): ${s.sinHref.join(', ')}`);
        if (c.texto > 0 && s.texto < c.texto * 0.3) h('medio', 'sinjs', p.rel, `sin JS se ve solo el ${Math.round((100 * s.texto) / c.texto)} % del texto (${s.texto} de ${c.texto} caracteres)`);
        if (c.h2 > s.h2) h('leve', 'sinjs', p.rel, `sin JS ${s.h2} h2, con JS ${c.h2}`);
      }
      if (!s.noscript) h('leve', 'sinjs', p.rel, 'sin <noscript>');
      p.sinjs = { s, c };
    } catch (e) {
      h('medio', 'sinjs', p.rel, `no se pudo abrir: ${e.message.split('\n')[0]}`);
    }
    await a.close();
    await b.close();
  }
  await ctxSin.close();
  await ctxCon.close();
}

async function impresion(navegador) {
  mkdirSync(PDF_DIR, { recursive: true });
  const rutas = ['/', '/proyectos/tarkor/', '/aviso-legal/', '/gl/proyectos/tarkor/'];
  for (const tema of ['claro', 'oscuro']) {
    const ctx = await navegador.newContext({ viewport: { width: 1280, height: 800 } });
    await ctx.addInitScript((t) => localStorage.setItem('galivelop.tema', t), tema);
    for (const ruta of rutas) {
      const nombre = `${tema}${ruta.replace(/\//g, '_')}`;
      const pg = await ctx.newPage();
      await pg.goto(BASE + ruta.slice(1), { waitUntil: 'networkidle' });
      await pg.emulateMedia({ media: 'print' });
      const m = await pg.evaluate(() => {
        const vis = (sel) => [...document.querySelectorAll(sel)].filter((e) => {
          const r = e.getBoundingClientRect();
          return getComputedStyle(e).display !== 'none' && getComputedStyle(e).visibility !== 'hidden' && r.width > 0 && r.height > 0;
        }).length;
        const lum = (c) => {
          // color(srgb r g b / a) trae los canales de 0 a 1, no de 0 a 255.
          const m = (c.match(/[\d.]+/g)?.map(Number) || [0, 0, 0]).map((v, i) => (c.startsWith('color(srgb') && i < 3 ? v * 255 : v));
          const f = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
          return 0.2126 * f(m[0]) + 0.7152 * f(m[1]) + 0.0722 * f(m[2]);
        };
        const cuerpo = getComputedStyle(document.body);
        const main = document.querySelector('main') || document.body;
        const fondoDe = (el) => {
          for (; el; el = el.parentElement) {
            const c = getComputedStyle(el).backgroundColor;
            if (c && !/rgba\(.*,\s*0\)|transparent/.test(c)) return c;
          }
          return 'rgb(255,255,255)';
        };
        const oscuroSobreOscuro = [...main.querySelectorAll('p, h1, h2, li')].filter((e) => e.getBoundingClientRect().height > 0).slice(0, 80).filter((e) => {
          const f = lum(fondoDe(e));
          const t = lum(getComputedStyle(e).color);
          return Math.abs(f - t) < 0.3 && f < 0.5;
        }).length;
        return {
          cabecera: vis('header'),
          nav: vis('nav'),
          pie: vis('footer'),
          botones: vis('button'),
          enlaceSalto: vis('.saltar'),
          color: cuerpo.color,
          fondo: fondoDe(document.body),
          colorTexto: getComputedStyle(main.querySelector('p') || main).color,
          oscuroSobreOscuro,
          ancho: document.documentElement.scrollWidth,
          ventana: window.innerWidth,
        };
      });
      const pdf = join(PDF_DIR, `${nombre}.pdf`);
      await pg.pdf({ path: pdf, format: 'A4', printBackground: false });
      const bytes = readFileSync(pdf);
      const paginasPdf = (bytes.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
      const id = `${ruta} (${tema})`;
      if (m.cabecera || m.nav) h('medio', 'impresion', id, `en impresión siguen visibles cabecera/menú (header ${m.cabecera}, nav ${m.nav})`);
      if (m.botones) h('leve', 'impresion', id, `${m.botones} <button> visibles al imprimir (tema, idioma, menú, copiar…)`);
      if (m.pie > 1) h('leve', 'impresion', id, `${m.pie} pies visibles`);
      if (m.enlaceSalto) h('leve', 'impresion', id, 'enlace de salto visible al imprimir');
      const f = m.fondo.match(/[\d.]+/g).map(Number).map((v, i) => (m.fondo.startsWith('color(srgb') && i < 3 ? v * 255 : v));
      const fondoOscuro = f[0] + f[1] + f[2] < 300 && f[3] !== 0;
      if (fondoOscuro || m.oscuroSobreOscuro) h('grave', 'impresion', id, `texto ${m.colorTexto} sobre fondo ${m.fondo} al imprimir (${m.oscuroSobreOscuro} textos ilegibles): el tema oscuro se imprime`);
      if (m.ancho > m.ventana + 2) h('leve', 'impresion', id, `desborda en horizontal al imprimir (${m.ancho}px)`);
      if (paginasPdf > 20) h('leve', 'impresion', id, `${paginasPdf} páginas de PDF`);
      // Páginas en blanco: se rasteriza con el propio Chromium sacando el texto de cada página no es posible; se estima por tamaño.
      console.log(`  impresión ${id}: ${paginasPdf} págs PDF, header ${m.cabecera}, nav ${m.nav}, footer ${m.pie}, botones ${m.botones}, texto ${m.colorTexto}, fondo ${m.fondo}`);
      await pg.close();
    }
    await ctx.close();
  }
}

// ---------- e) Paridad ----------
const textos = (html) => [...contenidoRoot(html).matchAll(/<(p|li|h[1-6]|figcaption|summary|dd|dt|button|a)\b[^>]*>([\s\S]*?)<\/\1>/g)].map((m) => sinEtiquetas(m[2])).filter(Boolean);
const palabras = (s) => s.split(/\s+/).filter(Boolean).length;
const NOMBRES_PROPIOS = /^[\p{Lu}0-9][\p{L}0-9.+·’'\-]*(\s+[\p{Lu}0-9][\p{L}0-9.+·’'\-]*)*$/u;
function auditarParidad() {
  const grupos = new Map();
  for (const p of reales) grupos.set(p.base, { ...(grupos.get(p.base) || {}), [p.idioma]: p });
  for (const [base, g] of grupos) {
    for (const l of IDIOMAS) if (!g[l]) h('grave', 'paridad', base, `falta la versión «${l}»`);
    if (!g.es) continue;
    const cuenta = (p) => {
      const root = contenidoRoot(p.html);
      return {
        h2: (root.match(/<h2\b/g) || []).length,
        h3: (root.match(/<h3\b/g) || []).length,
        enlaces: (root.match(/<a\b[^>]*href=/g) || []).length,
        imgs: (root.match(/<img\b/g) || []).length,
        jsonld: (p.html.match(/application\/ld\+json/g) || []).length,
      };
    };
    const ce = cuenta(g.es);
    for (const l of ['gl', 'en']) {
      if (!g[l]) continue;
      const c = cuenta(g[l]);
      for (const k of Object.keys(ce)) if (ce[k] !== c[k]) h('medio', 'paridad', g[l].rel, `${k}: es ${ce[k]} / ${l} ${c[k]}`);
      const te = new Set(textos(g.es.html));
      const iguales = textos(g[l].html).filter((t) => palabras(t) > 4 && te.has(t) && !NOMBRES_PROPIOS.test(t));
      if (iguales.length) h('medio', 'paridad', g[l].rel, `${iguales.length} textos idénticos al castellano: «${iguales.slice(0, 3).map((t) => t.slice(0, 60)).join('» «')}»`);
      for (const k of ['title', 'desc']) {
        const re = k === 'title' ? /<title>([\s\S]*?)<\/title>/ : /<meta name="description" content="([^"]*)"/;
        const a = (g.es.html.match(re) || [])[1];
        if (a && a === (g[l].html.match(re) || [])[1] && palabras(a) > 4) h('medio', 'paridad', g[l].rel, `${k === 'title' ? 'título' : 'descripción'} idéntico al castellano`);
      }
    }
  }
  // Datos: objetos {es, gl, en} de src/data/**/*.json con cadenas largas iguales.
  const jsons = (dir) => readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? jsons(p) : n.endsWith('.json') ? [p] : [];
  });
  const dir = join(RAIZ, 'src', 'data');
  if (!existsSync(dir)) return;
  for (const f of jsons(dir)) {
    let json;
    try {
      json = JSON.parse(readFileSync(f, 'utf8'));
    } catch {
      continue;
    }
    const sin = [];
    const incompletos = [];
    recorrer(json, (n, ruta) => {
      const ks = Object.keys(n);
      if (!ks.includes('es') || !(ks.includes('gl') || ks.includes('en'))) return;
      for (const l of ['gl', 'en']) {
        if (typeof n.es !== 'string') continue;
        if (!(l in n) || n[l] === '' || n[l] == null) incompletos.push(`${ruta}.${l}`);
        else if (n[l] === n.es && palabras(n.es) > 4 && !NOMBRES_PROPIOS.test(n.es)) sin.push(`${ruta.replace(/^\./, '')}.${l}: «${n.es.slice(0, 50)}»`);
      }
    });
    const rel = relative(RAIZ, f);
    if (incompletos.length) h('medio', 'paridad', rel, `${incompletos.length} traducciones que faltan: ${incompletos.slice(0, 3).join(', ')}`);
    if (sin.length) h('medio', 'paridad', rel, `${sin.length} textos sin traducir (idénticos al castellano), p. ej. ${sin.slice(0, 3).join(' | ')}`);
  }
}

// ---------- Salida ----------
(async () => {
  if (!existsSync(join(DIST, 'index.html'))) {
    console.error('auditar-html: dist/ is missing. Run: npm run build');
    process.exit(2);
  }
  auditarHtml();
  auditarJsonLd();
  auditarParidad();
  await servidor();
  const navegador = await chromium.launch();
  await sinJs(navegador);
  await impresion(navegador);
  await navegador.close();
  if (vista) parar(vista);
  const orden = { grave: 0, medio: 1, leve: 2 };
  hallazgos.sort((a, b) => orden[a.gravedad] - orden[b.gravedad] || a.area.localeCompare(b.area));
  // Agrupa por (gravedad, área, texto sin la ruta) para no repetir lo mismo en 47 páginas.
  const grupos = new Map();
  for (const x of hallazgos) {
    const k = `${x.gravedad}|${x.area}|${x.texto.replace(/\d+/g, '#')}`;
    const g = grupos.get(k) || { ...x, paginas: [], n: 0 };
    g.paginas.push(...x.paginas);
    g.n++;
    grupos.set(k, g);
  }
  for (const g of grupos.values()) console.log(`[${g.gravedad}] ${g.area} (${[...new Set(g.paginas)].length} pág.): ${g.texto} — ${[...new Set(g.paginas)].slice(0, 4).join(', ')}`);
  const cuenta = (g) => hallazgos.filter((x) => x.gravedad === g).length;
  console.log(`\nauditar-html: ${paginas.length} HTML, ${cuenta('grave')} graves, ${cuenta('medio')} medios, ${cuenta('leve')} leves`);
  if (process.env.JSON) writeFileSync(process.env.JSON, JSON.stringify(hallazgos, null, 2));
  process.exit(cuenta('grave') + cuenta('medio') ? 1 : 0);
})().catch((e) => {
  console.error(e);
  if (vista) parar(vista);
  process.exit(2);
});
