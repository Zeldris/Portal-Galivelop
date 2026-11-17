#!/usr/bin/env node
// Auditoría de rendimiento y Core Web Vitals (laboratorio). Por cada página de dist/sitemap.xml (todas en castellano;
// gallego e inglés, solo el inicio) mide en móvil (390x844, 4G lento: 1,6 Mbps, 150 ms RTT, CPU x4) y en escritorio
// sin limitar: LCP (y su elemento), CLS (y los nodos que se mueven), FCP, TTFB, TBT aproximado (tareas largas >50 ms
// tras el FCP), peticiones, bytes por tipo, recursos que bloquean el render, imágenes más grandes de lo que se
// muestran y una INP aproximada (clic en el menú). Además, análisis estático de dist/: peso bruto/gzip/brotli de cada
// chunk, JS inicial, fuentes y preloads. Sale con 1 si una página móvil pasa de LCP 2,5 s, CLS 0,1 o TBT 200 ms.
// Las cifras de un contenedor son orientativas (CPU y red compartidas): sirven para comparar antes/después.
// Pide Playwright, que no es dependencia del portal (`npm i --no-save playwright`). Uso, tras `npm run build`:
//   npm run auditar:rendimiento [ruta ...]      (rutas como `equipo` o `/equipo`; por defecto, las del sitemap)
//   BASE=http://localhost:4175/Portal-Galivelop/ node tools/qa/auditar-rendimiento.cjs
// Sin BASE, si no hay nada en el puerto 4175, arranca `vite preview` y lo para al acabar.
const { spawn } = require('node:child_process');
const { existsSync, readFileSync, readdirSync, statSync } = require('node:fs');
const { join } = require('node:path');
const zlib = require('node:zlib');
let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  console.error('auditar-rendimiento: Playwright is not installed. Run: npm i --no-save playwright');
  process.exit(2);
}

const BASE = process.env.BASE || 'http://localhost:4175/Portal-Galivelop/';
const RAIZ = join(__dirname, '..', '..');
const DIST = join(RAIZ, 'dist');
const LIMITES = { lcp: 2500, cls: 0.1, tbt: 200 };
const PERFILES = [
  { nombre: 'movil', ancho: 390, alto: 844, movil: true },
  { nombre: 'escritorio', ancho: 1280, alto: 800, movil: false },
];

function rutasSitemap() {
  const xml = readFileSync(join(DIST, 'sitemap.xml'), 'utf8');
  const rutas = [...xml.matchAll(/<loc>[^<]*?\/Portal-Galivelop\/([^<]*)<\/loc>/g)].map((m) => m[1]);
  return rutas.filter((r) => !/^(gl|en)\/./.test(r));
}
const RUTAS = (process.argv.slice(2).length ? process.argv.slice(2) : rutasSitemap()).map((r) => r.replace(/^\//, ''));

const responde = () => fetch(BASE, { signal: AbortSignal.timeout(2000) }).then((r) => r.ok, () => false);
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
  if (!existsSync(join(DIST, 'index.html'))) {
    console.error('auditar-rendimiento: dist/ is missing. Run: npm run build');
    process.exit(2);
  }
  const hijo = (vista = spawn('npx', ['vite', 'preview', '--port', '4175', '--strictPort'], { cwd: RAIZ, stdio: 'ignore', detached: true }));
  for (let i = 0; i < 60; i++) {
    if (await responde()) return;
    await new Promise((r) => setTimeout(r, 250));
  }
  parar(hijo);
  console.error('auditar-rendimiento: vite preview did not start on port 4175');
  process.exit(2);
}
for (const senal of ['SIGINT', 'SIGTERM']) {
  process.on(senal, () => {
    if (vista) parar(vista);
    process.exit(130);
  });
}

// Se inyecta antes de que cargue la página: recoge las métricas con PerformanceObserver (con `buffered`).
const SONDA = () => {
  const m = { lcp: 0, lcpEl: '', cls: 0, mueve: [], fcp: 0, largas: [], eventos: [] };
  const nombre = (el) => (el ? el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/)[0] : '') + (el.currentSrc || el.src ? ' ' + (el.currentSrc || el.src).split('/').slice(-2).join('/') : '') : '?');
  const ver = (tipo, fn, extra = {}) => {
    try {
      new PerformanceObserver((l) => l.getEntries().forEach(fn)).observe({ type: tipo, buffered: true, ...extra });
    } catch {}
  };
  ver('largest-contentful-paint', (e) => ((m.lcp = e.startTime), (m.lcpEl = nombre(e.element))));
  ver('layout-shift', (e) => {
    if (e.hadRecentInput) return;
    m.cls += e.value;
    for (const s of e.sources || []) m.mueve.push(nombre(s.node));
  });
  ver('paint', (e) => e.name === 'first-contentful-paint' && (m.fcp = e.startTime));
  ver('longtask', (e) => m.largas.push([e.startTime, e.duration]));
  ver('event', (e) => m.eventos.push([e.name, e.duration, e.processingStart - e.startTime]), { durationThreshold: 16 });
  window.__m = m;
};

/** En la página: imágenes con más píxeles intrínsecos que los que se muestran (a la densidad del perfil). */
function imagenes(dpr) {
  return [...document.images]
    .filter((i) => i.complete && i.naturalWidth && i.clientWidth)
    .map((i) => ({ src: i.currentSrc.split('/Portal-Galivelop/')[1] || i.currentSrc, nat: i.naturalWidth, vis: i.clientWidth, ratio: i.naturalWidth / (i.clientWidth * dpr), lazy: i.loading }))
    .filter((i) => i.ratio > 1.5)
    .sort((a, b) => b.ratio - a.ratio);
}

const tipoDe = (t, url) => (t === 'Script' ? 'js' : t === 'Stylesheet' ? 'css' : t === 'Image' ? 'img' : t === 'Font' ? 'font' : t === 'Document' ? 'html' : /\.(webp|png|jpe?g|svg|avif)/.test(url) ? 'img' : 'otro');

async function medir(navegador, perfil, ruta) {
  const ctx = await navegador.newContext({ viewport: { width: perfil.ancho, height: perfil.alto }, deviceScaleFactor: perfil.movil ? 2 : 1, isMobile: perfil.movil, reducedMotion: 'no-preference' });
  const pagina = await ctx.newPage();
  const cdp = await ctx.newCDPSession(pagina);
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  if (perfil.movil) {
    await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  }
  const tipos = new Map();
  const bytes = { js: 0, css: 0, img: 0, font: 0, html: 0, otro: 0 };
  let peticiones = 0;
  cdp.on('Network.requestWillBeSent', (e) => tipos.set(e.requestId, tipoDe(e.type, e.request.url)));
  cdp.on('Network.loadingFinished', (e) => {
    peticiones++;
    bytes[tipos.get(e.requestId) || 'otro'] += e.encodedDataLength;
  });
  await pagina.addInitScript(SONDA);
  await pagina.goto(BASE + ruta, { waitUntil: 'load' });
  await pagina.waitForLoadState('networkidle').catch(() => {});
  // Deja pasar un poco más para el LCP tardío y los desplazamientos de la carga.
  await pagina.waitForTimeout(1500);
  const nav = await pagina.evaluate(() => {
    const n = performance.getEntriesByType('navigation')[0];
    const bloquean = performance.getEntriesByType('resource').filter((r) => r.renderBlockingStatus === 'blocking').map((r) => r.name.split('/Portal-Galivelop/')[1] || r.name);
    return { ttfb: n.responseStart, bloquean };
  });
  const imgs = await pagina.evaluate(imagenes, perfil.movil ? 2 : 1);
  // INP aproximada: clic en el menú (móvil) o en el primer botón de la cabecera (escritorio) y el mayor evento medido.
  let inp = null;
  const disparador = pagina.locator(perfil.movil ? '.boton-menu' : 'header button').first();
  if (await disparador.isVisible().catch(() => false)) {
    await pagina.evaluate(() => (window.__m.eventos.length = 0));
    await disparador.click().catch(() => {});
    await pagina.waitForTimeout(600);
  }
  const m = await pagina.evaluate(() => window.__m);
  if (m.eventos.length) inp = Math.round(Math.max(...m.eventos.map((e) => e[1])));
  // TBT: exceso sobre 50 ms de las tareas largas entre el FCP y el final de la carga (aproximado: sin TTI).
  const tbt = m.largas.filter(([t]) => t >= m.fcp).reduce((s, [, d]) => s + Math.max(0, d - 50), 0);
  await ctx.close();
  const mueve = [...new Set(m.mueve)].slice(0, 3);
  return { ruta, perfil: perfil.nombre, lcp: Math.round(m.lcp), lcpEl: m.lcpEl, cls: +m.cls.toFixed(3), mueve, fcp: Math.round(m.fcp), ttfb: Math.round(nav.ttfb), tbt: Math.round(tbt), inp, peticiones, bytes, bloquean: nav.bloquean, imgs };
}

const kb = (n) => (n / 1024).toFixed(0);
function estatico() {
  const dir = join(DIST, 'assets');
  const ficheros = readdirSync(dir).filter((f) => /\.(js|css)$/.test(f));
  console.log('\n== Estático: chunks (KB bruto / gzip / brotli) ==');
  const filas = ficheros.map((f) => {
    const b = readFileSync(join(dir, f));
    return [f, b.length, zlib.gzipSync(b, { level: 9 }).length, zlib.brotliCompressSync(b).length];
  }).sort((a, b) => b[1] - a[1]);
  for (const [f, a, g, br] of filas) console.log(`${f.padEnd(44)} ${kb(a).padStart(6)} ${kb(g).padStart(6)} ${kb(br).padStart(6)}${a > 500 * 1000 ? '  <-- >500 kB (aviso de Vite)' : ''}`);
  const html = readFileSync(join(DIST, 'index.html'), 'utf8');
  const iniciales = [...html.matchAll(/(?:src|href)="[^"]*\/assets\/([^"]+\.(?:js|css))"/g)].map((m) => m[1]);
  const peso = (f, i) => filas.find((x) => x[0] === f)?.[i] || 0;
  console.log(`\nJS+CSS inicial (index.html): ${iniciales.join(', ')}`);
  console.log(`  bruto ${kb(iniciales.reduce((s, f) => s + peso(f, 1), 0))} KB, gzip ${kb(iniciales.reduce((s, f) => s + peso(f, 2), 0))} KB, brotli ${kb(iniciales.reduce((s, f) => s + peso(f, 3), 0))} KB`);
  console.log('Cabecera de index.html:', [...html.matchAll(/<link rel="(preload|preconnect|modulepreload|dns-prefetch)"[^>]*>/g)].map((m) => m[0]).join(' ') || 'sin preload/preconnect');
  const fuentes = readdirSync(dir).filter((f) => f.endsWith('.woff2'));
  const css = readFileSync(join(dir, ficheros.find((f) => f.endsWith('.css'))), 'utf8');
  console.log(`\nFuentes: ${fuentes.length} woff2 (${kb(fuentes.reduce((s, f) => s + statSync(join(dir, f)).size, 0))} KB), @font-face ${(css.match(/@font-face/g) || []).length}, font-display: ${[...new Set(css.match(/font-display:[a-z]+/g))].join(',')}, preload de fuentes en index.html: ${/rel="preload"[^>]*font/.test(html) ? 'sí' : 'no'}`);
  console.log('Con hash en el nombre:', ficheros.every((f) => /-[\w-]{8}\.(js|css)$/.test(f)) ? 'todos los JS/CSS' : 'NO todos');
  const imgs = [];
  const recorre = (d) => readdirSync(d, { withFileTypes: true }).forEach((e) => (e.isDirectory() ? recorre(join(d, e.name)) : /\.(webp|png|jpe?g|svg)$/.test(e.name) && imgs.push([join(d, e.name), statSync(join(d, e.name)).size])));
  recorre(DIST);
  imgs.sort((a, b) => b[1] - a[1]);
  console.log(`\nImágenes: ${imgs.length} ficheros, ${(imgs.reduce((s, i) => s + i[1], 0) / 1e6).toFixed(1)} MB. Las 8 más pesadas:`);
  for (const [f, s] of imgs.slice(0, 8)) console.log(`  ${kb(s).padStart(5)} KB  ${f.replace(DIST + '/', '')}`);
}

(async () => {
  await servidor();
  const navegador = await chromium.launch();
  const todas = [];
  let fallos = 0;
  for (const perfil of PERFILES) {
    console.log(`\n== ${perfil.nombre} ==`);
    console.log('ruta\tLCP_ms\tCLS\tFCP_ms\tTTFB_ms\tTBT_ms\tINP~_ms\tpeticiones\tKB js/css/img/font\tbloquean\tLCP elemento\tmueve');
    for (const ruta of [...RUTAS, ...(process.argv.slice(2).length ? [] : [])]) {
      const r = await medir(navegador, perfil, ruta);
      todas.push(r);
      const b = r.bytes;
      console.log([`/${r.ruta}`, r.lcp, r.cls, r.fcp, r.ttfb, r.tbt, r.inp ?? '-', r.peticiones, [b.js, b.css, b.img, b.font].map(kb).join('/'), r.bloquean.length, r.lcpEl, r.mueve.join(' | ') || '-'].join('\t'));
      if (perfil.movil && (r.lcp > LIMITES.lcp || r.cls > LIMITES.cls || r.tbt > LIMITES.tbt)) {
        fallos++;
        console.log(`  ^ SUPERA el límite (LCP ${LIMITES.lcp} ms, CLS ${LIMITES.cls}, TBT ${LIMITES.tbt} ms)`);
      }
    }
    const im = todas.filter((r) => r.perfil === perfil.nombre).flatMap((r) => r.imgs.map((i) => `${i.src} ${i.nat}px para ${i.vis}px (x${i.ratio.toFixed(1)})`));
    console.log(`Imágenes sobredimensionadas (>1,5x): ${[...new Set(im)].slice(0, 8).join(' | ') || '-'}`);
    console.log(`Bloquean el render: ${[...new Set(todas.filter((r) => r.perfil === perfil.nombre).flatMap((r) => r.bloquean))].join(', ') || '-'}`);
  }
  await navegador.close();
  estatico();
  if (vista) parar(vista);
  process.exit(fallos ? 1 : 0);
})().catch((e) => {
  console.error(e);
  if (vista) parar(vista);
  process.exit(2);
});
