#!/usr/bin/env node
// Prueba el lector de voz sin la persona (retro 2026-11-17, P1). Abre cada página con audio en escritorio y móvil,
// pulsa play y, para cada trozo y cada enfoque, salta el audio al instante en que el lector debe mover la vista,
// espera a que el scroll se pare y mide lo que queda en pantalla: si el elemento resaltado cabe entre la cabecera fija
// y la barra del lector, si alguna de las dos lo tapa y si el lector lo ha dejado fuera. Guarda una captura por paso
// en `capturas/lector/` y escribe una línea por paso; los que fallan llevan «✗». Uso, tras `npm run build`:
//   npm run probar:lector [-- <ruta>…]       (sin rutas: las de los guiones que tienen audio en castellano)
// No entra en `npm run check`: pide Playwright y un navegador.
const { mkdirSync, readdirSync, readFileSync } = require('node:fs');
const { join, resolve } = require('node:path');
try {
  require('playwright');
} catch {
  process.env.NODE_PATH = [process.env.NODE_PATH, '/opt/node-tools/node_modules']
    .filter(Boolean)
    .join(':');
  require('node:module')._initPaths();
}
const { chromium, devices } = require('playwright');
const { BASE, VENTANAS, servidor, parar } = require('./medir-paginas.cjs');

const RAIZ = join(__dirname, '..', '..');
const DIR_GUIONES = join(RAIZ, 'src', 'data', 'guiones');
const guiones = readdirSync(DIR_GUIONES)
  .filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(readFileSync(join(DIR_GUIONES, f), 'utf8')))
  .filter((g) => g.audio?.includes('es'));
const pedidas = process.argv.slice(2).map((r) => '/' + r.replace(/^\/|\/$/g, ''));
const elegidos = pedidas.length
  ? guiones.filter((g) => pedidas.includes(g.pagina.replace(/\/$/, '') || '/'))
  : guiones;
const carpeta = resolve(process.env.CAPTURAS || join(RAIZ, 'capturas'), 'lector');
// El adelanto del enfoque, leído del código del lector para saltar al mismo instante que él.
const ADELANTO = Number(
  readFileSync(join(RAIZ, 'src/utils/guion.ts'), 'utf8').match(
    /ADELANTO_ENFOQUE = ([\d.]+)/,
  )?.[1] ?? 0,
);

// En la página: espera a que el scroll lleve 400 ms quieto y mide el elemento resaltado frente a la zona libre.
function medir() {
  return new Promise((listo) => {
    let ultimo = -1;
    let quieto = 0;
    const paso = () => {
      if (window.scrollY === ultimo) quieto += 50;
      else quieto = 0;
      ultimo = window.scrollY;
      if (quieto < 400) return setTimeout(paso, 50);
      const el =
        document.querySelector('.guion-enfoque') ?? document.querySelector('.guion-activo');
      if (!el) return listo(null);
      const r = el.getBoundingClientRect();
      // Las barras fijas de arriba: la cabecera y, si el elemento va tras ella, la de grupos de la ficha.
      let arriba = document.querySelector('.cabecera')?.getBoundingClientRect().bottom ?? 0;
      const nav = document.querySelector('.nav-ficha');
      if (nav && nav.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING)
        arriba = Math.max(arriba, nav.getBoundingClientRect().bottom);
      const abajo = document.querySelector('.lector')?.getBoundingClientRect().top ?? innerHeight;
      listo({
        ver: el.id || el.getAttribute('data-guion') || el.tagName,
        enfoque: el.classList.contains('guion-enfoque'),
        top: Math.round(r.top),
        bottom: Math.round(r.bottom),
        alto: Math.round(r.height),
        arriba: Math.round(arriba),
        abajo: Math.round(abajo),
        ventana: innerHeight,
      });
    };
    setTimeout(paso, 50);
  });
}

// Qué falla en una medida: lo que el lector promete es que se ve el inicio del elemento y, si cabe, entero.
function fallos(m) {
  if (!m) return ['nada resaltado'];
  // El lector deja 8 px sobre la barra: lo que no cabe con ellos se muestra desde su inicio.
  const libre = m.abajo - m.arriba;
  const f = [];
  if (m.bottom <= m.arriba || m.top >= m.abajo) return ['fuera de la vista'];
  if (m.top < m.arriba - 2) f.push(`la cabecera tapa ${m.arriba - m.top}px`);
  if (m.alto <= libre - 8 && m.bottom > m.abajo + 2) f.push(`la barra tapa ${m.bottom - m.abajo}px`);
  if (m.alto > libre && m.top > m.arriba + libre * 0.25)
    f.push(`empieza a ${m.top - m.arriba}px de la cabecera`);
  return f;
}

async function probar(navegador, guion, ventana, width, height) {
  const contexto = await navegador.newContext(
    ventana === 'escritorio'
      ? { viewport: { width, height } }
      : { ...devices['iPhone 13'], viewport: { width, height } },
  );
  // Guarda cada <audio> que cree el lector, para poder saltar a un instante.
  await contexto.addInitScript(() => {
    const Original = window.Audio;
    window.__audios = [];
    window.Audio = function (...a) {
      const x = new Original(...a);
      window.__audios.push(x);
      return x;
    };
  });
  const pagina = await contexto.newPage();
  const ruta = guion.pagina.replace(/^\//, '');
  await pagina.goto(BASE + ruta, { waitUntil: 'networkidle' });
  await pagina.locator('.lector-boton').click();
  const nombre = (ruta.replace(/\//g, '-') || 'inicio') + '-' + ventana;
  let malos = 0;
  for (const [i, trozo] of guion.trozos.entries()) {
    if (i > 0) await pagina.locator('.lector button').nth(2).click();
    // El primer <audio> es el que suena; se espera su duración y se pausa para saltar a mano.
    const dur = await pagina.evaluate(async () => {
      const a = window.__audios[0];
      for (let n = 0; n < 100 && !(a.duration > 0); n++)
        await new Promise((r) => setTimeout(r, 50));
      a.pause();
      return a.duration;
    });
    const instantes = [{ ver: trozo.seccion, t: 0 }];
    for (const e of trozo.enfoques ?? []) {
      const p = trozo.es.indexOf(e.frase) / trozo.es.length;
      instantes.push({ ver: e.ver, t: Math.max(0, (p - ADELANTO) * dur + 0.05) });
    }
    for (const [j, { ver, t }] of instantes.entries()) {
      if (j > 0) await pagina.evaluate((t) => (window.__audios[0].currentTime = t), t);
      const real = await pagina.evaluate(medir);
      const f = fallos(real);
      const esperado = j === 0 && (trozo.enfoques ?? []).length ? null : ver;
      if (esperado && real && real.ver !== esperado) f.push(`resalta ${real.ver}`);
      const archivo = join(carpeta, `${nombre}-${String(i + 1).padStart(2, '0')}-${j}-${ver}.png`);
      await pagina.screenshot({ path: archivo });
      if (f.length) malos++;
      console.log(
        `${f.length ? '✗' : '✓'} ${nombre} ${i + 1}.${j} ${ver.padEnd(36)} ${real ? `[${real.top},${real.bottom}] libre [${real.arriba},${real.abajo}]` : ''} ${f.join('; ')}`,
      );
    }
  }
  await contexto.close();
  return malos;
}

let vista = null;
(async () => {
  vista = await servidor();
  mkdirSync(carpeta, { recursive: true });
  const navegador = await chromium.launch();
  let malos = 0;
  for (const g of elegidos)
    for (const [ventana, width, height] of VENTANAS.slice(0, 2))
      malos += await probar(navegador, g, ventana, width, height);
  await navegador.close();
  if (vista) parar(vista);
  console.log(`\n${malos} pasos con fallos; capturas en ${carpeta}`);
  process.exit(malos ? 1 : 0);
})().catch((e) => {
  console.error(e);
  if (vista) parar(vista);
  process.exit(2);
});
