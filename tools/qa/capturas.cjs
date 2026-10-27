#!/usr/bin/env node
// Captura una página (o una sección) en escritorio y móvil (las dos primeras ventanas de medir-paginas.cjs) y da en texto lo que una captura
// no enseña bien: alto, pantallas, desbordamiento y cortes, con la medida de medir-paginas.cjs. Así la captura se
// abre una vez, para juzgar el aspecto, y no se vuelve a leer para medir. Uso, tras `npm run build`:
//   npm run capturas -- <ruta> [selector]     (`npm run capturas -- productos`, `npm run capturas -- '' '#productos'`)
//   npm run capturas -- '' --menu              (el menú del móvil abierto; con --menu no se admite selector)
// Deja los PNG en `capturas/` (ignorado por git; otra carpeta con CAPTURAS=<carpeta>) y escribe sus rutas.
const { mkdirSync } = require('node:fs');
const { join, resolve } = require('node:path');
const { chromium } = require('playwright');
const { BASE, TACTIL, VENTANAS, lista, servidor, parar, medirPagina } = require('./medir-paginas.cjs');

const ruta = (process.argv[2] ?? '').replace(/^\//, '');
const menu = process.argv[3] === '--menu';
const seccion = !menu && process.argv[3] ? process.argv[3] : null;
if (process.argv.length > 4) {
  console.error('Uso: npm run capturas -- <ruta> [selector | --menu]');
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
