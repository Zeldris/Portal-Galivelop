#!/usr/bin/env node
// Recorre la web construida y devuelve TEXTO (sin capturas): una línea por problema y un resumen final. Por cada
// página (las del sitemap de dist/, en es, /gl/ y /en/), ancho (320, 375, 768, 1024, 1100, 1280, 1920) y tema
// (claro y oscuro): errores de consola y de red, scroll horizontal, elementos visibles fuera de la pantalla y
// objetivos táctiles de menos de 24x24 px (WCAG 2.5.8; los enlaces dentro de un texto quedan exentos). Además, en
// 1280 px y por tema, el contraste del contorno de foco de lo que alcanza Tab (< 3:1 avisa) y, una vez, los
// enlaces internos que no dan 200. Sin problemas, solo imprime el resumen. Sale con 1 si hay alguno.
// Complementa a `npm run medir` (que mide en claro a 320 y 1280 consola y táctiles): no los repite ahí.
// Pide Playwright (no es dependencia): `npm i --no-save playwright` o NODE_PATH=$(npm root -g).
// Uso, tras `npm run build`:
//   node tools/qa/recorrido.cjs [--url http://localhost:4173/Portal-Galivelop/] [--anchos 320,768]
// Sin --url (ni BASE), usa el puerto 4173 o arranca `vite preview` y lo para al acabar.
const { spawn } = require('node:child_process');
const { existsSync, readFileSync } = require('node:fs');
const { join } = require('node:path');
let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  console.error('recorrido: Playwright is not installed. Run: npm i --no-save playwright');
  process.exit(2);
}

const { rutasDelSitemap } = require('./pagina-estatica.cjs');

const RAIZ = join(__dirname, '..', '..');
const arg = (nombre) => {
  const i = process.argv.indexOf(nombre);
  return i > -1 ? process.argv[i + 1] : undefined;
};
const BASE = (
  arg('--url') ||
  process.env.BASE ||
  'http://localhost:4173/Portal-Galivelop/'
).replace(/\/?$/, '/');
const ANCHOS = (arg('--anchos') || '320,375,768,1024,1100,1280,1920').split(',').map(Number);
const ANCHO_FOCO = 1280;
const TEMAS = ['claro', 'oscuro'];
const CLAVE_TEMA = 'galivelop.tema';

/** Rutas del sitemap de dist/ (sin el origen publicado); si no hay sitemap, una lista fija. */
function rutas() {
  const mapa = join(RAIZ, 'dist', 'sitemap.xml');
  const fija = ['', 'equipo/', 'novedades/', 'productos/', 'muro/', 'proyectos/tarkor/'];
  const lista = existsSync(mapa) ? rutasDelSitemap(readFileSync(mapa, 'utf8'), BASE) : fija;
  return [...new Set(lista)];
}

const responde = () =>
  fetch(BASE, { signal: AbortSignal.timeout(2000) }).then(
    (r) => r.ok,
    () => false,
  );
let vista = null;
const parar = () => {
  try {
    if (vista) process.kill(-vista.pid);
  } catch {
    // Ya había terminado.
  }
};
async function servidor() {
  if (arg('--url') || process.env.BASE || (await responde())) return;
  if (!existsSync(join(RAIZ, 'dist', 'index.html'))) {
    console.error('recorrido: dist/ is missing. Run: npm run build');
    process.exit(2);
  }
  vista = spawn('npx', ['vite', 'preview', '--port', '4173', '--strictPort'], {
    cwd: RAIZ,
    stdio: 'ignore',
    detached: true,
  });
  for (let i = 0; i < 60; i++) {
    if (await responde()) return;
    await new Promise((r) => setTimeout(r, 250));
  }
  parar();
  console.error('recorrido: vite preview did not start on port 4173.');
  process.exit(2);
}

/** En el navegador: fuera de pantalla, objetivos táctiles pequeños y scroll horizontal. */
function medir() {
  const ancho = window.innerWidth;
  const corto = (e) => {
    const id = e.id ? '#' + e.id : '';
    const cl =
      typeof e.className === 'string' && e.className.trim()
        ? '.' + e.className.trim().split(/\s+/)[0]
        : '';
    const txt = (e.getAttribute('aria-label') || e.textContent || e.getAttribute('href') || '')
      .trim()
      .replace(/\s+/g, ' ')
      .slice(0, 24);
    return `${e.tagName.toLowerCase()}${id}${cl}${txt ? ` «${txt}»` : ''}`;
  };
  const visible = (e) => {
    const cs = getComputedStyle(e);
    const r = e.getBoundingClientRect();
    return (
      cs.display !== 'none' &&
      cs.visibility !== 'hidden' &&
      r.width > 0 &&
      r.height > 0 &&
      cs.opacity !== '0'
    );
  };
  const recortado = (e) => {
    for (let a = e.parentElement; a && a !== document.documentElement; a = a.parentElement) {
      const o = getComputedStyle(a).overflowX;
      if (o !== 'visible') {
        const r = a.getBoundingClientRect();
        if (r.left >= -1 && r.right <= ancho + 1) return true;
      }
    }
    return false;
  };
  const fuera = new Set();
  const pequenos = new Set();
  for (const e of document.body.querySelectorAll('*')) {
    if (!visible(e)) continue;
    const r = e.getBoundingClientRect();
    if (
      (r.right > ancho + 1 || r.left < -1) &&
      !recortado(e) &&
      getComputedStyle(e).position !== 'fixed'
    )
      fuera.add(corto(e));
  }
  const objetivos =
    'a[href], button, input:not([type=hidden]), select, textarea, summary, [role=button], [tabindex]:not([tabindex="-1"])';
  for (const e of document.querySelectorAll(objetivos)) {
    if (!visible(e) || e.disabled) continue;
    const r = e.getBoundingClientRect();
    if (r.width >= 23.5 && r.height >= 23.5) continue; // tolerancia de subpíxel
    if (e.tagName === 'A' && getComputedStyle(e).display === 'inline') continue; // enlace dentro de un texto
    if (r.bottom < 0 || r.top > document.documentElement.scrollHeight) continue;
    pequenos.add(`${corto(e)} ${Math.round(r.width)}x${Math.round(r.height)}`);
  }
  return {
    scroll:
      document.documentElement.scrollWidth > ancho
        ? `${document.documentElement.scrollWidth} > ${ancho}`
        : null,
    fuera: [...fuera],
    pequenos: [...pequenos],
    enlaces: [...document.querySelectorAll('a[href]')].map((a) => a.href),
  };
}

/** En el navegador: contraste del contorno del elemento enfocado contra su fondo efectivo (null si no se puede). */
function contrasteFoco() {
  const e = document.activeElement;
  if (!e || e === document.body) return null;
  const lienzo = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
  const rgba = (c) => {
    lienzo.clearRect(0, 0, 1, 1);
    lienzo.fillStyle = '#000';
    lienzo.fillStyle = c;
    lienzo.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = lienzo.getImageData(0, 0, 1, 1).data;
    return [r, g, b, a / 255];
  };
  const sobre = (f, d) => f.slice(0, 3).map((v, i) => v * f[3] + d[i] * (1 - f[3]));
  const lum = (c) => {
    const [r, g, b] = c.map((v) =>
      (v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4,
    );
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const cs = getComputedStyle(e);
  const desc = `${e.tagName.toLowerCase()}${typeof e.className === 'string' && e.className.trim() ? '.' + e.className.trim().split(/\s+/)[0] : ''} «${(e.getAttribute('aria-label') || e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 24)}»`;
  const tiene = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0;
  if (!tiene) return { desc, sinContorno: cs.boxShadow === 'none' };
  // Fondo: capas de los ascendientes (y del propio elemento si el contorno cae dentro), sobre blanco.
  let capas = [];
  for (let a = parseFloat(cs.outlineOffset) < 0 ? e : e.parentElement; a; a = a.parentElement)
    capas.push(rgba(getComputedStyle(a).backgroundColor));
  let fondo = [255, 255, 255];
  for (const c of capas.reverse()) fondo = sobre(c, fondo);
  const contorno = sobre(rgba(cs.outlineColor), fondo);
  const [a, b] = [lum(contorno), lum(fondo)];
  return { desc, ratio: (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05) };
}

(async () => {
  await servidor();
  const inicio = Date.now();
  const paginas = rutas();
  const browser = await chromium.launch();
  const problemas = [];
  const cuenta = {};
  const anotar = (tipo, linea) => {
    problemas.push(linea);
    cuenta[tipo] = (cuenta[tipo] || 0) + 1;
  };
  const internos = new Map(); // url -> primera página donde aparece
  for (const tema of TEMAS) {
    for (const ancho of ANCHOS) {
      const ctx = await browser.newContext({ viewport: { width: ancho, height: 900 } });
      await ctx.addInitScript(([k, v]) => localStorage.setItem(k, v), [CLAVE_TEMA, tema]);
      const page = await ctx.newPage();
      let donde = '';
      // `npm run medir` ya cubre consola y táctiles en claro a 320 y 1280: aquí no se repiten.
      const repetido = tema === 'claro' && [320, 1280].includes(ancho);
      page.on(
        'console',
        (m) =>
          !repetido &&
          ['error', 'warning'].includes(m.type()) &&
          anotar('consola', `${donde} consola.${m.type()}: ${m.text().slice(0, 160)}`),
      );
      page.on(
        'pageerror',
        (e) => !repetido && anotar('consola', `${donde} pageerror: ${e.message.slice(0, 160)}`),
      );
      for (const ruta of paginas) {
        donde = `[${tema} ${ancho} /${ruta}]`;
        try {
          await page.goto(BASE + ruta, { waitUntil: 'networkidle' });
        } catch (e) {
          anotar('carga', `${donde} no carga: ${e.message.split('\n')[0]}`);
          continue;
        }
        const m = await page.evaluate(medir);
        if (m.scroll) anotar('scroll-horizontal', `${donde} scroll horizontal ${m.scroll}`);
        for (const f of m.fuera) anotar('fuera-de-pantalla', `${donde} fuera de pantalla: ${f}`);
        for (const p of repetido ? [] : m.pequenos)
          anotar('tactil<24', `${donde} objetivo táctil pequeño: ${p}`);
        for (const u of m.enlaces) {
          const url = new URL(u);
          if (url.origin === new URL(BASE).origin && /^https?:$/.test(url.protocol)) {
            url.hash = '';
            if (!internos.has(url.href)) internos.set(url.href, `/${ruta}`);
          }
        }
        if (
          ancho === ANCHO_FOCO ||
          (!ANCHOS.includes(ANCHO_FOCO) && ancho === ANCHOS[ANCHOS.length - 1])
        ) {
          await page.evaluate(() => document.activeElement?.blur());
          const vistos = new Set();
          for (let i = 0; i < 80; i++) {
            await page.keyboard.press('Tab');
            const c = await page.evaluate(contrasteFoco);
            if (!c || vistos.has(c.desc)) {
              if (!c) break;
              continue;
            }
            vistos.add(c.desc);
            if (c.sinContorno) anotar('foco', `${donde} foco sin contorno ni sombra: ${c.desc}`);
            else if (c.ratio !== undefined && c.ratio < 3)
              anotar('foco', `${donde} contorno de foco ${c.ratio.toFixed(2)}:1 < 3:1: ${c.desc}`);
          }
        }
      }
      await ctx.close();
    }
  }
  const ctx = await browser.newContext();
  for (const [url, origen] of internos) {
    const r = await ctx.request.get(url).catch((e) => ({ status: () => e.message.split('\n')[0] }));
    if (r.status() !== 200)
      anotar('enlace-roto', `[enlace] ${r.status()} ${url} (desde ${origen})`);
  }
  await browser.close();
  parar();
  console.log(problemas.join('\n') + (problemas.length ? '\n' : ''));
  const detalle = Object.entries(cuenta)
    .map(([k, v]) => `${k} ${v}`)
    .join(', ');
  console.log(
    `recorrido: ${paginas.length} páginas x ${ANCHOS.length} anchos x ${TEMAS.length} temas, ${internos.size} enlaces internos, ${problemas.length} problemas${detalle ? ` (${detalle})` : ''}, ${Math.round((Date.now() - inicio) / 1000)} s`,
  );
  process.exit(problemas.length ? 1 : 0);
})().catch((e) => {
  parar();
  console.error(e);
  process.exit(2);
});
