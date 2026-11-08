#!/usr/bin/env node
// Captura una página (o una sección) en escritorio y móvil (las dos primeras ventanas de medir-paginas.cjs) y da en texto lo que una captura
// no enseña bien: alto, pantallas, desbordamiento y cortes, con la medida de medir-paginas.cjs. Así la captura se
// abre una vez, para juzgar el aspecto, y no se vuelve a leer para medir. Uso, tras `npm run build`:
//   npm run capturas -- <ruta> [selector]     (`npm run capturas -- productos`, `npm run capturas -- '' '#productos'`)
//   npm run capturas -- '' --menu              (el menú del móvil abierto; con --menu no se admite selector)
//   npm run capturas -- --hoja <ruta> [<ruta>…] (una sola imagen `hoja.png`: una fila por página y, en miniatura,
//     escritorio y móvil en claro y oscuro, cada una con su rótulo; revisar N páginas cuesta una imagen, no N)
// Deja los PNG en `capturas/` (ignorado por git; otra carpeta con CAPTURAS=<carpeta>) y escribe sus rutas.
const { mkdirSync } = require('node:fs');
const { join, resolve } = require('node:path');
// Si Playwright no está en el proyecto, se busca en /opt/node-tools (medir-paginas.cjs lo carga con el mismo `require`).
try {
  require('playwright');
} catch {
  process.env.NODE_PATH = [process.env.NODE_PATH, '/opt/node-tools/node_modules'].filter(Boolean).join(':');
  require('node:module')._initPaths();
}
const { chromium } = require('playwright');
const { BASE, TACTIL, VENTANAS, lista, servidor, parar, medirPagina } = require('./medir-paginas.cjs');

const HOJA = process.argv[2] === '--hoja';
const ANCHO_MINIATURA = { escritorio: 360, movil: 160 };
const ALTO_MAX = 900;
const escapar = (t) => t.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// Hoja de contacto: cada página en las cuatro variantes (escritorio/móvil x claro/oscuro), fullPage reducida a un
// ancho fijo y recortada a ALTO_MAX; se compone con HTML en el propio Playwright, sin dependencias nuevas.
async function hoja(navegador, rutas, carpeta) {
  const variantes = [];
  for (const [ventana, width, height] of VENTANAS.slice(0, 2)) {
    for (const tema of ['claro', 'oscuro']) variantes.push({ ventana, tema, width, height });
  }
  const filas = [];
  for (const r of rutas) {
    const celdas = [];
    for (const v of variantes) {
      const contexto = await navegador.newContext({ viewport: { width: v.width, height: v.height } });
      await contexto.addInitScript((t) => localStorage.setItem('galivelop.tema', t), v.tema);
      const pagina = await contexto.newPage();
      await pagina.goto(BASE + r, { waitUntil: 'networkidle' });
      await pagina.mouse.move(0, 0);
      await pagina.waitForTimeout(300);
      const escala = ANCHO_MINIATURA[v.ventana] / v.width;
      const alto = await pagina.evaluate(() => document.documentElement.scrollHeight);
      const recorte = Math.min(alto, Math.round(ALTO_MAX / escala));
      const png = await pagina.screenshot({ fullPage: true, clip: { x: 0, y: 0, width: v.width, height: recorte } });
      celdas.push({ ...v, ancho: ANCHO_MINIATURA[v.ventana], alto: Math.round(recorte * escala), png: png.toString('base64'), rotulo: `/${r} · ${v.ventana === "movil" ? "mov" : "esc"} ${v.tema}` });
      await contexto.close();
    }
    filas.push(celdas);
  }
  const html =
    `<body style="margin:0;padding:12px;background:#888;font:11px sans-serif;color:#fff">` +
    filas
      .map(
        (celdas) =>
          `<div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:16px">` +
          celdas
            .map(
              (c) =>
                `<div style="width:${c.ancho}px"><div style="margin-bottom:3px;white-space:nowrap;overflow:hidden">${escapar(c.rotulo)}</div>` +
                `<img src="data:image/png;base64,${c.png}" style="display:block;width:${c.ancho}px;height:${c.alto}px;border:1px solid #000"></div>`,
            )
            .join('') +
          `</div>`,
      )
      .join('') +
    `</body>`;
  const lienzo = await navegador.newPage({ viewport: { width: 360 * 2 + 160 * 2 + 12 * 5, height: 400 } });
  await lienzo.setContent(html, { waitUntil: 'load' });
  const archivo = join(carpeta, 'hoja.png');
  await lienzo.screenshot({ path: archivo, fullPage: true });
  await lienzo.close();
  console.log(archivo);
}

const ruta = (process.argv[2] ?? '').replace(/^\//, '');
const menu = process.argv[3] === '--menu';
const seccion = !menu && process.argv[3] ? process.argv[3] : null;
if (HOJA ? process.argv.length < 4 : process.argv.length > 4) {
  console.error('Uso: npm run capturas -- <ruta> [selector | --menu]  |  --hoja <ruta> [<ruta>…]');
  process.exit(1);
}
const carpeta = resolve(process.env.CAPTURAS || join(__dirname, '..', '..', 'capturas'));
const nombre = [ruta.replace(/\//g, '-') || 'inicio', seccion?.replace(/[^\w-]/g, ''), menu && 'menu']
  .filter(Boolean)
  .join('-');

let vista = null;
(async () => {
  vista = await servidor();
  mkdirSync(carpeta, { recursive: true });
  const navegador = await chromium.launch();
  if (HOJA) {
    await hoja(navegador, process.argv.slice(3).map((r) => r.replace(/^\//, '')), carpeta);
    await navegador.close();
    if (vista) parar(vista);
    return;
  }
  for (const [ventana, width, height] of VENTANAS.slice(0, 2)) {
    if (menu && ventana !== 'movil') continue;
    const pagina = await navegador.newPage({ viewport: { width, height } });
    await pagina.goto(BASE + ruta, { waitUntil: 'networkidle' });
    if (menu) await pagina.locator('.boton-menu').click();
    const objetivo = seccion ? pagina.locator(seccion).first() : pagina;
    if (seccion) await objetivo.scrollIntoViewIfNeeded();
    await pagina.mouse.move(0, 0);
    await pagina.waitForTimeout(300);
    const archivo = join(carpeta, `${nombre}-${ventana}.png`);
    await objetivo.screenshot({ path: archivo, fullPage: !seccion });
    const raiz = menu ? '#menu-principal' : seccion;
    const m = await pagina.evaluate(medirPagina, { movil: ventana === 'movil', tactil: TACTIL, raiz });
    // Con sección, el alto es el de la sección (la medida da el de la página entera).
    const alto = raiz ? Math.round((await pagina.locator(raiz).first().boundingBox())?.height ?? 0) : m.alto;
    console.log(
      `${archivo}\n  ${ventana}: alto ${alto}px (${(alto / height).toFixed(1)} pantallas), ` +
        `desborda ${m.ancho > width ? `sí (${m.ancho}px)` : 'no'}, cortes ${lista(m.cortes)}, táctiles ${lista(m.tactiles)}`,
    );
    await pagina.close();
  }
  await navegador.close();
  if (vista) parar(vista);
})().catch((e) => {
  console.error(e);
  if (vista) parar(vista);
  process.exit(2);
});
