#!/usr/bin/env node
// Mide en texto lo que ocupa cada página, para no gastar capturas en eso: alto en px, «pantallas» (alto / alto de
// la ventana), desbordamiento horizontal y errores de consola, en escritorio (1280x800) y en móvil a 390, 360 y
// 320 px. En móvil, además, el texto cortado dentro de una caja y los controles con zona táctil pequeña, también
// dentro de lo que solo se ve al tocar: el menú y su submenú, cada hoja de apartado de las fichas y la vista
// ampliada de una imagen (la de la galería de la ficha y, en cada hoja, la de su galería y su primera tarjeta). Por
// defecto mide cada ruta en castellano, gallego e inglés (un texto puede caber en uno y cortarse en otro).
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
const PAGINAS = ['', 'proyectos/tarkor', 'proyectos/toveriai', 'proyectos/galivelop-workflow', 'equipo', 'participa/proponer', 'participa/unirse', 'muro'];
const RUTAS = (
  process.argv.slice(2).length
    ? process.argv.slice(2)
    : [...PAGINAS, ...['gl/', 'en/'].flatMap((idioma) => PAGINAS.map((r) => idioma + r)), 'no-existe']
).map((r) => r.replace(/^\//, ''));
const VENTANAS = [
  ['escritorio', 1280, 800],
  ['movil', 390, 844],
  ['movil-360', 360, 780],
  ['movil-320', 320, 700],
];
// El mínimo de WCAG 2.5.8 (AA). El portal busca unos 44 px de alto donde cabe (enlaces sueltos, iconos de 38): eso
// es diseño y se juzga en la captura; esto avisa de lo que queda por debajo del mínimo.
const TACTIL = { alto: 24, ancho: 24 };

const responde = () => fetch(BASE, { signal: AbortSignal.timeout(2000) }).then((r) => r.ok, () => false);

/** Arranca `vite preview` si hace falta; devuelve el proceso para pararlo al final (o null si ya había servidor). */
async function servidor() {
  if (process.env.BASE || (await responde())) return null;
  if (!existsSync(join(RAIZ, 'dist', 'index.html'))) {
    console.error('medir-paginas: dist/ is missing. Run: npm run build');
    process.exit(2);
  }
  // `vista` se guarda ya aquí para que Ctrl+C lo pare también mientras arranca.
  const hijo = (vista = spawn('npx', ['vite', 'preview', '--port', '4173', '--strictPort'], {
    cwd: RAIZ,
    stdio: ['ignore', 'ignore', 'pipe'],
    detached: true,
  }));
  let salida = '';
  hijo.stderr.on('data', (d) => (salida += d));
  let fallo = null;
  hijo.on('error', (e) => (fallo = e.message));
  hijo.on('exit', (codigo) => (fallo ??= `exited with code ${codigo}`));
  for (let i = 0; i < 60 && !fallo; i++) {
    if (await responde()) return hijo;
    await new Promise((r) => setTimeout(r, 250));
  }
  parar(hijo);
  console.error(`medir-paginas: vite preview did not start on port 4173 (${fallo ?? 'timeout'}). ${salida.trim()}`);
  console.error('Free port 4173 or run: npx vite preview --port 4173');
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

/**
 * Corre en la página. En móvil busca el texto que no cabe en su caja (scrollWidth > clientWidth, salvo las cajas que
 * se desplazan a propósito) y los controles visibles con zona táctil por debajo de `tactil`; la zona cuenta el
 * `::after` absoluto con que `global.css` agranda los enlaces sueltos. Los enlaces dentro de un párrafo no cuentan
 * (WCAG 2.5.8 los exime). Devuelve como mucho 5 de cada, con un nombre corto para encontrarlos. Con `raiz` (un
 * selector), mide solo esa caja y lo que tiene dentro: una capa abierta, como la hoja de un apartado.
 */
function medirPagina({ movil, tactil, raiz }) {
  const caja = raiz ? document.querySelector(raiz) : document.body;
  // La propia capa cuenta: una hoja con `overflow: hidden` más estrecha que lo de dentro lo corta sin desbordar.
  const todos = raiz ? [caja, ...caja.querySelectorAll('*')] : [...caja.querySelectorAll('*')];
  const nombre = (el) => {
    const clase = typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/)[0] : '';
    const texto = (el.textContent.trim() || el.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 24);
    return `${el.tagName.toLowerCase()}${clase}${texto ? ` «${texto}»` : ''}`;
  };
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    const e = getComputedStyle(el);
    // El enlace de salto está ahí, pero transparente y sin recibir toques hasta que tiene el foco.
    return r.width > 0 && r.height > 0 && e.visibility !== 'hidden' && e.opacity !== '0' && e.pointerEvents !== 'none';
  };
  const cortes = [];
  const tactiles = [];
  if (movil) {
    const desplaza = (el) => /auto|scroll/.test(getComputedStyle(el).overflowX);
    const desbordan = todos.filter((el) => {
      if (el.scrollWidth <= el.clientWidth + 1 || !el.clientWidth || !visible(el)) return false;
      if (desplaza(el) || getComputedStyle(el).textOverflow === 'ellipsis') return false;
      // Una barra que se desplaza y sale a propósito hasta el borde (las pestañas de la ficha) no corta nada.
      const r = el.getBoundingClientRect();
      const fuera = [...el.children].filter((h) => {
        const rh = h.getBoundingClientRect();
        return rh.right > r.right + 1 || rh.left < r.left - 1;
      });
      return !(fuera.length && fuera.every(desplaza));
    });
    // Solo la caja más interna: las de fuera heredan el desborde (el texto suele ir en un elemento en línea, sin
    // clientWidth, dentro de ella).
    for (const el of desbordan) {
      if (cortes.length >= 5) break;
      if (!desbordan.some((otro) => otro !== el && el.contains(otro))) cortes.push(`${nombre(el)} ${el.scrollWidth}>${el.clientWidth}`);
    }
    for (const el of caja.querySelectorAll('a[href], button, summary, input, select, textarea, [role="button"]')) {
      if (tactiles.length >= 5) break;
      if (!visible(el) || el.closest('p')) continue;
      // Un control con etiqueta se toca también por la etiqueta.
      const r = (el.closest('label') ?? el).getBoundingClientRect();
      let alto = r.height;
      let ancho = r.width;
      // Un `::after` absoluto con márgenes negativos agranda la zona que se toca, pero solo si se mide contra el
      // propio control (que tiene `position`); si no, es una capa sobre otra caja (la cabecera entera) y se avisa.
      const tras = getComputedStyle(el, '::after');
      const lados = ['top', 'bottom', 'left', 'right'].map((lado) => Math.min(0, parseFloat(tras[lado]) || 0));
      if (tras.content !== 'none' && tras.position === 'absolute' && tras.display !== 'none' && lados.some((d) => d < 0)) {
        if (getComputedStyle(el).position === 'static') {
          tactiles.push(`${nombre(el)} ::after sin position en el control`);
          continue;
        }
        if (tras.pointerEvents !== 'none') {
          alto -= lados[0] + lados[1];
          ancho -= lados[2] + lados[3];
        }
      }
      if (alto < tactil.alto || ancho < tactil.ancho) tactiles.push(`${nombre(el)} ${Math.round(ancho)}x${Math.round(alto)}`);
    }
  }
  return { alto: document.documentElement.scrollHeight, ancho: document.documentElement.scrollWidth, cortes, tactiles };
}

/**
 * En móvil, abre lo que la página esconde hasta que se toca (el menú y su submenú, cada hoja de apartado, la vista
 * ampliada de una imagen) y lo mide como la página. Devuelve los cortes y los controles pequeños con la capa delante, para saber dónde mirar.
 */
async function medirCapas(pagina) {
  const cortes = [];
  const tactiles = [];
  const medir = async (capa, raiz) => {
    // El ratón que se queda tras el clic activa los `:hover` (la imagen que crece un 4 %) y daría cortes que no hay.
    await pagina.mouse.move(0, 0);
    const m = await pagina.evaluate(medirPagina, { movil: true, tactil: TACTIL, raiz });
    cortes.push(...m.cortes.map((c) => `[${capa}] ${c}`));
    tactiles.push(...m.tactiles.map((c) => `[${capa}] ${c}`));
  };
  const menu = pagina.locator('.boton-menu');
  if (await menu.isVisible()) {
    await menu.click();
    await medir('menú', '#menu-principal');
    const sub = pagina.locator('#menu-principal .submenu-boton');
    if (await sub.isVisible()) {
      await sub.click();
      await medir('submenú', '#menu-principal');
    }
    await menu.click();
  }
  // La vista ampliada pide pantalla completa: se cierra a mano (con Esc saldría solo de la pantalla completa).
  const ampliar = async (boton, capa) => {
    if (!(await boton.count())) return;
    await boton.first().click();
    await pagina.locator('dialog.galeria-dialogo[open]').waitFor();
    await medir(capa, 'dialog.galeria-dialogo[open]');
    await pagina.evaluate(async () => {
      if (document.fullscreenElement) await document.exitFullscreen();
      document.querySelector('dialog.galeria-dialogo[open]')?.close();
    });
  };
  await ampliar(pagina.locator('main .galeria-ampliar:visible'), 'galería ampliada');
  const piezas = pagina.locator('.mosaico-pieza');
  for (let i = 0, n = await piezas.count(); i < n; i++) {
    await piezas.nth(i).click();
    const hoja = pagina.locator('dialog.hoja[open]');
    await hoja.waitFor();
    await medir(`hoja ${i + 1}`, 'dialog.hoja[open]');
    await ampliar(hoja.locator('.galeria-ampliar'), `hoja ${i + 1}, galería ampliada`);
    await ampliar(hoja.locator('.tarjeta-imagen'), `hoja ${i + 1}, imagen ampliada`);
    await pagina.keyboard.press('Escape');
    await hoja.waitFor({ state: 'detached' });
  }
  return { cortes, tactiles };
}

let vista = null;
for (const senal of ['SIGINT', 'SIGTERM']) {
  process.on(senal, () => {
    if (vista) parar(vista);
    process.exit(130);
  });
}
(async () => {
  await servidor();
  const navegador = await chromium.launch();
  let fallos = 0;
  console.log('ruta\tventana\talto_px\tpantallas\tdesborda_x\tcortes\ttactiles\terrores');
  for (const [nombre, ancho, alto] of VENTANAS) {
    // Sin animaciones (`global.css` las anula con movimiento reducido): una capa recién abierta se mide ya quieta.
    const pagina = await navegador.newPage({ viewport: { width: ancho, height: alto }, reducedMotion: 'reduce' });
    for (const ruta of RUTAS) {
      const errores = [];
      const alError = (m) => m.type() === 'error' && errores.push(m.text());
      const alFallo = (e) => errores.push(e.message);
      pagina.on('console', alError);
      pagina.on('pageerror', alFallo);
      await pagina.goto(BASE + ruta, { waitUntil: 'networkidle' });
      const movil = nombre.startsWith('movil');
      const m = await pagina.evaluate(medirPagina, { movil, tactil: TACTIL });
      if (movil) {
        const capas = await medirCapas(pagina);
        m.cortes.push(...capas.cortes);
        m.tactiles.push(...capas.tactiles);
      }
      pagina.off('console', alError);
      pagina.off('pageerror', alFallo);
      const desborda = m.ancho > ancho;
      if (desborda || errores.length || m.cortes.length || m.tactiles.length) fallos++;
      const lista = (xs) => (xs.length ? xs.join(' | ') : '-');
      console.log(
        [`/${ruta}`, nombre, m.alto, (m.alto / alto).toFixed(1), desborda ? `sí (${m.ancho}px)` : 'no', lista(m.cortes), lista(m.tactiles), lista(errores)].join('\t'),
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
