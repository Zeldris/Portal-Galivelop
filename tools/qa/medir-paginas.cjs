#!/usr/bin/env node
// Mide en texto lo que ocupa cada página, para no gastar capturas en eso: alto en px, «pantallas» (alto / alto de
// la ventana), desbordamiento horizontal y errores de consola, en escritorio (1280x800) y móvil (390x844).
// Pide Playwright, que no es dependencia del portal: en la nube ya está; en local, `npm i --no-save playwright`
// (como tools/generar-marca.mjs). Uso, tras `npm run build`:
//   npm run medir [ruta ...]        (rutas como `equipo` o `/equipo`; por defecto, todas las de abajo)
//   BASE=http://localhost:4173/Portal-Galivelop/ node tools/qa/medir-paginas.cjs
// Sin BASE, si no hay nada en el puerto 4173, arranca `vite preview` y lo para al acabar (no hace falta lanzarlo ni
// matarlo a mano, y un `pkill -f` en la misma orden que lo nombra mata también el shell).
const { spawn } = require('node:child_process');
const { existsSync } = require('node:fs');
const { join } = require('node:path');
// Las capturas siguen haciendo falta para juzgar el aspecto; esto solo da las medidas.
let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  console.error('medir-paginas: Playwright is not installed. Run: npm i --no-save playwright');
  process.exit(2);
}

const BASE = process.env.BASE || 'http://localhost:4173/Portal-Galivelop/';
const RAIZ = join(__dirname, '..', '..');
const RUTAS = (
  process.argv.slice(2).length
    ? process.argv.slice(2)
    : ['', 'proyectos/tarkor', 'proyectos/toveriai', 'proyectos/galivelop-workflow', 'equipo', 'participa/proponer', 'participa/unirse', 'muro', 'no-existe']
).map((r) => r.replace(/^\//, ''));
const VENTANAS = [
  ['escritorio', 1280, 800],
  ['movil', 390, 844],
];

const responde = () => fetch(BASE).then((r) => r.ok, () => false);

/** Arranca `vite preview` si hace falta; devuelve el proceso para pararlo al final (o null si ya había servidor). */
async function servidor() {
  if (process.env.BASE || (await responde())) return null;
  if (!existsSync(join(RAIZ, 'dist', 'index.html'))) {
    console.error('medir-paginas: dist/ is missing. Run: npm run build');
    process.exit(2);
  }
  const hijo = spawn('npx', ['vite', 'preview', '--port', '4173', '--strictPort'], { cwd: RAIZ, stdio: 'ignore', detached: true });
  for (let i = 0; i < 60; i++) {
    if (await responde()) return hijo;
    await new Promise((r) => setTimeout(r, 250));
  }
  parar(hijo);
  console.error('medir-paginas: vite preview did not start on port 4173. Run: npx vite preview --port 4173');
  process.exit(2);
}

/** Para `npx` y el `vite` que lanza (matar solo `npx` deja vivo el servidor). */
const parar = (hijo) => {
  try {
    process.kill(-hijo.pid);
  } catch {
    // Ya había terminado.
  }
};

let vista = null;
(async () => {
  vista = await servidor();
  const navegador = await chromium.launch();
  let fallos = 0;
  console.log('ruta\tventana\talto_px\tpantallas\tdesborda_x\terrores');
  for (const [nombre, ancho, alto] of VENTANAS) {
    const pagina = await navegador.newPage({ viewport: { width: ancho, height: alto } });
    for (const ruta of RUTAS) {
      const errores = [];
      const alError = (m) => m.type() === 'error' && errores.push(m.text());
      const alFallo = (e) => errores.push(e.message);
      pagina.on('console', alError);
      pagina.on('pageerror', alFallo);
      await pagina.goto(BASE + ruta, { waitUntil: 'networkidle' });
      const m = await pagina.evaluate(() => ({
        alto: document.documentElement.scrollHeight,
        ancho: document.documentElement.scrollWidth,
      }));
      pagina.off('console', alError);
      pagina.off('pageerror', alFallo);
      const desborda = m.ancho > ancho;
      if (desborda || errores.length) fallos++;
      console.log(
        [`/${ruta}`, nombre, m.alto, (m.alto / alto).toFixed(1), desborda ? `sí (${m.ancho}px)` : 'no', errores.length ? errores.join(' | ') : '-'].join('\t'),
      );
    }
    await pagina.close();
  }
  await navegador.close();
  if (vista) parar(vista);
  process.exit(fallos ? 1 : 0);
})().catch((e) => {
  console.error(e);
  if (vista) parar(vista);
  process.exit(2);
});
