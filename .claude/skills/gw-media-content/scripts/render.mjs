#!/usr/bin/env node
// gw-media-content: turns the sources of a piece's media into the files that get published.
//
//   node render.mjs <piece-folder | date-folder> [source...]
//   node render.mjs --plan <piece-folder | date-folder> [source...]    (print what would be rendered, as JSON)
//
// A piece folder is <dir>/AAAA-MM-DD/NN-<topic>/; a date folder holds several pieces and every one with a
// medios/fuente/ is rendered. Sources live in <piece>/medios/fuente/:
//   *.html, *.svg   rendered with Playwright's Chromium at the size they declare, <meta name="gw-size"
//                   content="1200x675"> (an SVG declares it in a comment: <!-- gw-size: 1200x675 -->; default
//                   1200x675; a gw-size that cannot be read is an error), with the network blocked, to medios/<name>.webp (1600 px wide at most), medios/<name>-mini.webp (720 px) and
//                   medios/<name>.png (the same size as the .webp: LinkedIn takes JPG, PNG and GIF, not WebP)
//   carrusel*.html  a document carousel: each <section class="slide"> becomes a page of medios/<name>.pdf, whose
//                   page size is the gw-size (the render fails if the pages are not the number of slides)
//   *.png, *.jpg    screenshots: converted as they are to medios/<name>.webp, <name>-mini.webp and <name>.png
// Without [source...] every source is rendered; with them, only those (file names inside medios/fuente/).
//
// Needs, and fails closed without them:
//   Playwright, resolved from the current folder, then from the folder in the env var GW_PLAYWRIGHT_DIR
//     (install: npm i -D playwright && npx playwright install chromium)
//   ImageMagick with WebP support (`magick`, or `convert` in version 6) for the WebP and PNG files
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, readFileSync, realpathSync, rmSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { basename, extname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const USO = 'usage: node render.mjs [--plan] <piece-folder | date-folder> [source...]';
const PAGINAS = new Set(['.html', '.svg']);
const CAPTURAS = new Set(['.png', '.jpg', '.jpeg']);
const TAMANO_POR_DEFECTO = { width: 1200, height: 675 };
const ANCHO_MAX = 1600;
const ANCHO_MINI = 720;
const CALIDAD = { '': 82, '-mini': 78 };

class Fallo extends Error {}

export function parsearArgumentos(argv) {
  const resto = [];
  let plan = false;
  let ayuda = false;
  for (const a of argv) {
    if (a === '--plan') plan = true;
    else if (a === '--help' || a === '-h') ayuda = true;
    else if (a.startsWith('--')) throw new Fallo(`unknown option ${a}. ${USO}`);
    else resto.push(a);
  }
  if (ayuda) return { ayuda: true };
  if (!resto.length) throw new Fallo(USO);
  return { carpeta: resto[0], pedidas: resto.slice(1).map((p) => basename(p)), plan };
}

const ETIQUETA_TAMANO = 'write it as <meta name="gw-size" content="1200x675"> (an SVG: <!-- gw-size: 1200x675 -->)';

function leerTamano(valor) {
  const m = /^\s*(\d+)\s*[x\u00d7]\s*(\d+)\s*$/i.exec(valor ?? '');
  if (!m) throw new Fallo(`gw-size "${String(valor ?? '').trim()}" cannot be read as WIDTHxHEIGHT; ${ETIQUETA_TAMANO}`);
  const tamano = { width: Number(m[1]), height: Number(m[2]) };
  if (tamano.width < 100 || tamano.height < 100 || tamano.width > 4000 || tamano.height > 4000) {
    throw new Fallo(`gw-size ${m[1]}x${m[2]} is out of range (100 to 4000 px on each side); fix the size in the source`);
  }
  return tamano;
}

export function parsearTamano(texto) {
  const sinComentarios = texto.replace(/<!--[\s\S]*?-->/g, '');
  for (const [etiqueta] of sinComentarios.matchAll(/<meta\b[^>]*>/gi)) {
    if (!/\bname\s*=\s*["']?\s*gw-size\b/i.test(etiqueta)) continue;
    const c = /\bcontent\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i.exec(etiqueta);
    return leerTamano(c ? (c[1] ?? c[2] ?? c[3]) : '');
  }
  const comentario = /<!--\s*gw-size\s*:([\s\S]*?)-->/i.exec(texto);
  if (comentario) return leerTamano(comentario[1]);
  return { ...TAMANO_POR_DEFECTO };
}

const esFuente = (f) => PAGINAS.has(extname(f).toLowerCase()) || CAPTURAS.has(extname(f).toLowerCase());
const esCarrusel = (f) => extname(f).toLowerCase() === '.html' && /^carrusel/i.test(basename(f, extname(f)));

export function piezasDe(carpeta) {
  const base = resolve(carpeta);
  if (!existsSync(base) || !statSync(base).isDirectory()) throw new Fallo(`${base} is not a folder; pass a piece folder (<dir>/AAAA-MM-DD/NN-<topic>)`);
  if (existsSync(join(base, 'medios', 'fuente'))) return [base];
  const hijas = readdirSync(base, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(base, d.name, 'medios', 'fuente')))
    .map((d) => join(base, d.name))
    .sort();
  if (!hijas.length) throw new Fallo(`no medios/fuente/ in ${base} or in any folder below it; the sources of the media go in <piece>/medios/fuente/`);
  return hijas;
}

export function planDe(pieza, pedidas) {
  const fuenteDir = join(pieza, 'medios', 'fuente');
  const todas = readdirSync(fuenteDir).filter(esFuente).sort();
  const porNombre = new Map();
  for (const f of todas) {
    const nombre = basename(f, extname(f));
    if (porNombre.has(nombre)) throw new Fallo(`${porNombre.get(nombre)} and ${f} would both give medios/${nombre}.*; rename one of them (${fuenteDir})`);
    porNombre.set(nombre, f);
  }
  for (const p of pedidas) if (!todas.includes(p)) throw new Fallo(`${p} is not a source (.html, .svg, .png, .jpg) in ${fuenteDir}`);
  const elegidas = pedidas.length ? todas.filter((f) => pedidas.includes(f)) : todas;
  if (!elegidas.length) throw new Fallo(`no source (.html, .svg, .png or .jpg) in ${fuenteDir}`);
  const salida = join(pieza, 'medios');
  return elegidas.map((f) => {
    const nombre = basename(f, extname(f));
    const ruta = join(fuenteDir, f);
    const captura = CAPTURAS.has(extname(f).toLowerCase());
    const pdf = esCarrusel(f);
    const tamano = captura ? null : parsearTamano(readFileSync(ruta, 'utf8'));
    return {
      fuente: f,
      ruta,
      nombre,
      tipo: captura ? 'captura' : pdf ? 'pdf' : 'pagina',
      tamano,
      salidas: pdf ? [join(salida, `${nombre}.pdf`)] : [join(salida, `${nombre}.webp`), join(salida, `${nombre}-mini.webp`), join(salida, `${nombre}.png`)],
    };
  });
}

function resolverPlaywright() {
  const bases = [process.cwd()];
  if (process.env.GW_PLAYWRIGHT_DIR) bases.push(resolve(process.env.GW_PLAYWRIGHT_DIR));
  for (const base of bases) {
    const req = createRequire(join(base, 'noop.js'));
    for (const nombre of ['playwright', join(base, 'playwright')]) {
      try {
        return req.resolve(nombre);
      } catch {}
    }
  }
  return null;
}

function imagemagick() {
  for (const orden of ['magick', 'convert']) {
    try {
      const formatos = execFileSync(orden, ['-list', 'format'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
      if (/\bWEBP\b/.test(formatos)) return orden;
    } catch {}
  }
  return null;
}

const FALTA_PLAYWRIGHT =
  'ERROR: Playwright not found (looked from the current folder and from GW_PLAYWRIGHT_DIR). ' +
  'Install it in the project and run again from its folder: npm i -D playwright && npx playwright install chromium';
const FALTA_IMAGEMAGICK =
  'ERROR: ImageMagick with WebP support not found (tried `magick` and `convert`). ' +
  'Install it: apt install imagemagick webp (Debian/Ubuntu) or brew install imagemagick webp (macOS)';

function aImagenes(im, entrada, nombre, salidaDir) {
  for (const [sufijo, extension] of [['', 'webp'], ['-mini', 'webp'], ['', 'png']]) {
    const destino = join(salidaDir, `${nombre}${sufijo}.${extension}`);
    const ancho = sufijo ? ANCHO_MINI : ANCHO_MAX;
    const calidad = extension === 'webp' ? ['-quality', String(CALIDAD[sufijo])] : [];
    execFileSync(im, [entrada, '-auto-orient', '-resize', `${ancho}x>`, '-strip', ...calidad, destino]);
    console.log(`${destino} (${Math.round(statSync(destino).size / 1024)} KB)`);
  }
}

// Runs in the page. Returns the places where the content does not fit: an element that scrolls (non-visible
// overflow with more content than room), or an element or a line of text outside the content box (padding
// excluded) of the body, or of the .slide when the page has slides.
function buscarDesbordes([w, h]) {
  const raiz = document.documentElement;
  const cuerpo = document.body;
  const fuera = [];
  const nombre = (el) => el.tagName.toLowerCase() + (el.id ? `#${el.id}` : '') + (typeof el.className === 'string' && el.className.trim() ? `.${el.className.trim().split(/\s+/).join('.')}` : '');
  const conSlides = !!document.querySelector('section.slide'); // a carousel is taller than one page
  if (raiz.scrollWidth > w + 1 || (!conSlides && raiz.scrollHeight > h + 1)) fuera.push(`the document scrolls (${raiz.scrollWidth}x${raiz.scrollHeight})`);
  if (!cuerpo) return fuera;
  for (const el of cuerpo.querySelectorAll('*')) {
    const e = getComputedStyle(el);
    if (e.overflowX === 'visible' && e.overflowY === 'visible') continue;
    if (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1) {
      fuera.push(`${nombre(el)} has more content than room (${el.scrollWidth}x${el.scrollHeight} in ${el.clientWidth}x${el.clientHeight})`);
    }
  }
  const slides = [...document.querySelectorAll('section.slide')];
  for (const contenedor of slides.length ? slides : [cuerpo]) {
    const cs = getComputedStyle(contenedor);
    const r = contenedor.getBoundingClientRect();
    const caja = {
      left: r.left + contenedor.clientLeft + parseFloat(cs.paddingLeft),
      top: r.top + contenedor.clientTop + parseFloat(cs.paddingTop),
      right: r.left + contenedor.clientLeft + contenedor.clientWidth - parseFloat(cs.paddingRight),
      bottom: r.top + contenedor.clientTop + contenedor.clientHeight - parseFloat(cs.paddingBottom),
    };
    const total = { left: r.left, top: r.top, right: r.right, bottom: r.bottom };
    // vertical slack: the glyph box of a text with a tight line-height is taller than its line
    const sale = (c, k, v = 1) => c.left < k.left - 1 || c.top < k.top - v || c.right > k.right + 1 || c.bottom > k.bottom + v;
    // placed on purpose (a page number in the padding): it, and what is inside it, only has to stay inside the container
    const colocadoEn = (el) => {
      for (let x = el; x && x !== contenedor; x = x.parentElement) {
        const p = getComputedStyle(x).position;
        if (p === 'absolute' || p === 'fixed') return true;
      }
      return false;
    };
    for (const el of contenedor.querySelectorAll('*')) {
      if (['SCRIPT', 'STYLE', 'TEMPLATE', 'NOSCRIPT'].includes(el.tagName)) continue;
      const e = getComputedStyle(el);
      if (e.display === 'none' || e.display === 'contents' || e.visibility === 'hidden') continue;
      const c = el.getBoundingClientRect();
      if (!c.width && !c.height) continue;
      const colocado = colocadoEn(el);
      if (sale(c, colocado ? total : caja)) fuera.push(`${nombre(el)} leaves the ${colocado ? 'box' : 'content box'} of ${nombre(contenedor)}`);
    }
    const paseo = document.createTreeWalker(contenedor, NodeFilter.SHOW_TEXT);
    for (let t = paseo.nextNode(); t; t = paseo.nextNode()) {
      if (!t.data.trim() || ['SCRIPT', 'STYLE'].includes(t.parentElement?.tagName)) continue;
      const rango = document.createRange();
      rango.selectNodeContents(t);
      const c = rango.getBoundingClientRect();
      const colocado = colocadoEn(t.parentElement);
      const holgura = Math.max(1, 0.25 * parseFloat(getComputedStyle(t.parentElement).fontSize));
      if ((c.width || c.height) && sale(c, colocado ? total : caja, holgura)) fuera.push(`text "${t.data.trim().slice(0, 30)}" leaves the content box of ${nombre(contenedor)}`);
    }
  }
  return [...new Set(fuera)];
}

async function prepararPagina(navegador, entrada, mensajeTamano) {
  const contexto = await navegador.newContext({ viewport: entrada.tamano, deviceScaleFactor: 1 });
  try {
    // the network is blocked: a source has to be self-contained, and a request that is aborted is a resource that does not load
    await contexto.route(/^https?:/, (r) => r.abort());
    const pagina = await contexto.newPage();
    const errores = [];
    const peticiones = [];
    pagina.on('pageerror', (err) => errores.push(String(err?.message ?? err).split('\n')[0]));
    pagina.on('requestfailed', (p) => {
      const url = p.url();
      if (!url.startsWith('data:')) peticiones.push(url);
    });
    await pagina.goto(pathToFileURL(entrada.ruta).href, { waitUntil: 'load' });
    const rotas = await pagina.evaluate(async () => {
      await document.fonts.ready;
      const fallan = [];
      for (const i of document.images ?? []) {
        try {
          await i.decode();
        } catch {
          fallan.push(i.getAttribute('src') || '(empty src)');
        }
      }
      return fallan;
    });
    const otras = [...new Set(peticiones)].filter((u) => !rotas.some((r) => u.endsWith(r) || decodeURI(u).endsWith(r)));
    if (rotas.length || otras.length) {
      const partes = [];
      if (rotas.length) partes.push(`image(s) that do not load: ${rotas.join(', ')}`);
      if (otras.length) partes.push(`resource(s) that do not load: ${otras.join(', ')}`);
      throw new Fallo(`${entrada.fuente}: ${partes.join('; ')}; fix the path (relative to medios/fuente/); the network is blocked, so everything the source uses has to be a file next to it`);
    }
    if (errores.length) throw new Fallo(`${entrada.fuente}: the page's script fails: ${errores.join(' | ')}; fix the script in the source`);
    const huecos = await pagina.evaluate(() => {
      const raiz = document.body ?? document.documentElement;
      return (raiz.innerText ?? raiz.textContent ?? '').includes('{{');
    });
    if (huecos) throw new Fallo(`fill the gaps in ${entrada.fuente}: it still has text between double braces ({{…}}); replace each one with the real text`);
    const { width, height } = entrada.tamano;
    const desborda = await pagina.evaluate(buscarDesbordes, [width, height]);
    if (desborda.length) {
      const lista = desborda.slice(0, 5).join('; ') + (desborda.length > 5 ? `; and ${desborda.length - 5} more` : '');
      throw new Fallo(`${entrada.fuente}: the content overflows ${width}x${height} (${lista}); ${mensajeTamano}`);
    }
    return { pagina, contexto };
  } catch (err) {
    await contexto.close();
    throw err;
  }
}

function contarPaginasPdf(datos) {
  return (datos.toString('latin1').match(/\/Type\s*\/Page(?![A-Za-z])/g) ?? []).length;
}

async function ejecutar(entradas, salidaDir) {
  const necesitaNavegador = entradas.some((e) => e.tipo !== 'captura');
  const necesitaIm = entradas.some((e) => e.tipo !== 'pdf');
  let playwrightRuta = null;
  if (necesitaNavegador) {
    playwrightRuta = resolverPlaywright();
    if (!playwrightRuta) throw new Fallo(FALTA_PLAYWRIGHT);
  }
  const im = necesitaIm ? imagemagick() : null;
  if (necesitaIm && !im) throw new Fallo(FALTA_IMAGEMAGICK);

  const tmp = mkdtempSync(join(tmpdir(), 'gw-media-'));
  let navegador;
  let fallos = 0;
  try {
    if (necesitaNavegador) {
      const { chromium } = createRequire(import.meta.url)(playwrightRuta);
      try {
        navegador = await chromium.launch();
      } catch (err) {
        throw new Fallo(`Playwright cannot start Chromium (${String(err.message).split('\n')[0]}); run: npx playwright install chromium`);
      }
    }
    for (const e of entradas) {
      let contexto;
      try {
        if (e.tipo === 'captura') {
          aImagenes(im, e.ruta, e.nombre, salidaDir);
          continue;
        }
        if (e.tipo === 'pdf') {
          let pagina;
          ({ pagina, contexto } = await prepararPagina(navegador, e, 'shorten the text of the slide or split it in two'));
          const n = await pagina.locator('section.slide').count();
          if (!n) throw new Fallo(`${e.fuente}: no <section class="slide"> in the carousel; each slide is one <section class="slide">`);
          const { width, height } = e.tamano;
          // the page size is the gw-size and nothing else (no preferCSSPageSize: an @page size in the source would override it)
          await pagina.pdf({
            path: e.salidas[0],
            width: `${width}px`,
            height: `${height}px`,
            printBackground: true,
            margin: { top: '0', right: '0', bottom: '0', left: '0' },
          });
          const paginas = contarPaginasPdf(readFileSync(e.salidas[0]));
          if (paginas !== n) {
            rmSync(e.salidas[0], { force: true });
            throw new Fallo(`${e.fuente}: the PDF has ${paginas} page(s) and the carousel ${n} slide(s); a slide taller than ${height}px or a stray element after the last slide splits the pages: fix the slides in the source`);
          }
          console.log(`${e.salidas[0]} (${n} pages, ${Math.round(statSync(e.salidas[0]).size / 1024)} KB)`);
        } else {
          let pagina;
          ({ pagina, contexto } = await prepararPagina(navegador, e, 'shorten the text or lower the font size'));
          const png = join(tmp, `${e.nombre}.png`);
          await pagina.screenshot({ path: png, clip: { x: 0, y: 0, ...e.tamano } });
          aImagenes(im, png, e.nombre, salidaDir);
        }
      } catch (err) {
        console.error(err instanceof Fallo ? `ERROR: ${err.message.replace(/^ERROR: /, '')}` : `ERROR: ${e.fuente}: ${err.message}`);
        fallos++;
      } finally {
        await contexto?.close();
      }
    }
  } finally {
    await navegador?.close();
    rmSync(tmp, { recursive: true, force: true });
  }
  return fallos;
}

async function main() {
  const args = parsearArgumentos(process.argv.slice(2));
  if (args.ayuda) {
    console.log(USO);
    return 0;
  }
  const piezas = piezasDe(args.carpeta).map((p) => ({ pieza: p, entradas: planDe(p, args.pedidas) }));
  if (args.plan) {
    console.log(JSON.stringify(piezas.map((p) => ({ pieza: p.pieza, fuentes: p.entradas.map(({ ruta, nombre, ...resto }) => resto) })), null, 2));
    return 0;
  }
  let fallos = 0;
  for (const p of piezas) fallos += await ejecutar(p.entradas, join(p.pieza, 'medios'));
  return fallos ? 1 : 0;
}

// Run as a program, also through a symlink (npx, a link in node_modules/.bin): both paths are resolved first
function esPrincipal() {
  try {
    return realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url));
  } catch {
    return false;
  }
}

if (esPrincipal()) {
  try {
    process.exitCode = await main();
  } catch (err) {
    if (!(err instanceof Fallo)) throw err;
    console.error(err.message.startsWith('ERROR') || err.message.startsWith('usage') ? err.message : `ERROR: ${err.message}`);
    process.exitCode = err.message.includes('usage:') ? 2 : 1;
  }
}
