#!/usr/bin/env node
// Captura una página (o una sección) en escritorio (1366x900) y móvil (390x844) y da en texto lo que una captura
// no enseña bien: alto, pantallas, desbordamiento y cortes, con la medida de medir-paginas.cjs. Así la captura se
// abre una vez, para juzgar el aspecto, y no se vuelve a leer para medir. Uso, tras `npm run build`:
//   npm run capturas -- <ruta> [selector]     (`npm run capturas -- productos`, `npm run capturas -- '' '#productos'`)
//   npm run capturas -- '' --menu              (el menú del móvil abierto)
// Deja los PNG en `capturas/` (ignorado por git; otra carpeta con CAPTURAS=<carpeta>) y escribe sus rutas.
const { mkdirSync } = require('node:fs');
const { join, resolve } = require('node:path');
const { chromium } = require('playwright');
const { BASE, TACTIL, servidor, parar, medirPagina } = require('./medir-paginas.cjs');

const ruta = (process.argv[2] ?? '').replace(/^\//, '');
const seccion = process.argv[3] && process.argv[3] !== '--menu' ? process.argv[3] : null;
const menu = process.argv.includes('--menu');
const carpeta = resolve(process.env.CAPTURAS || join(__dirname, '..', '..', 'capturas'));
const nombre = [ruta.replace(/\//g, '-') || 'inicio', seccion?.replace(/[^\w-]/g, ''), menu && 'menu']
  .filter(Boolean)
  .join('-');

(async () => {
  const vista = await servidor();
  mkdirSync(carpeta, { recursive: true });
  const navegador = await chromium.launch();
  for (const [ventana, width, height] of [['escritorio', 1366, 900], ['movil', 390, 844]]) {
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
    const lista = (xs) => (xs.length ? xs.join(' | ') : '-');
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
  process.exit(2);
});
