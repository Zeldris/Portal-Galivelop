#!/usr/bin/env node
// Auditoría automática de accesibilidad (WCAG 2.2 AA) con axe-core más cinco comprobaciones que axe no hace bien.
// 1) axe-core (wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa y best-practice) en cada ruta de `dist/sitemap.xml`
//    (con el dominio cambiado por BASE) y en la 404, en tema claro y oscuro, a 1280x800 y a 390x844.
// 2) En inicio, una ficha, equipo y participa/proponer: reflow a 320 px (1.4.10), espaciado de texto (1.4.12), recorrido
//    con Tab (foco visible, orden, trampas: 2.4.3, 2.4.7, 2.1.2), movimiento reducido y colores forzados.
// Imprime un resumen en texto (por regla: impacto, nodos, páginas). Sale en 1 si hay violaciones serious o critical,
// en 2 si no puede arrancar. Pide Playwright (`npm i --no-save playwright`) y axe-core (devDependency), tras `npm run build`.
//   npm run auditar:a11y [ruta ...]        (rutas como `equipo`; por defecto, todas las del sitemap y la 404)
//   BASE=http://localhost:4174/Portal-Galivelop/ node tools/qa/auditar-accesibilidad.cjs
//   JSON=ruta.json  guarda además el detalle (selectores) de cada violación.
// Sin BASE, si no hay nada en el puerto 4174, arranca `vite preview` y lo para al acabar.
// El «Gali» del logotipo (.logo-gali) queda fuera de color-contrast: es logotipo, exento por WCAG 1.4.3
// (decidido en docs/records/auditoria-2026-11-14.md).
const { spawn } = require('node:child_process');
const { existsSync, readFileSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');
let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  console.error('auditar-accesibilidad: Playwright is not installed. Run: npm i --no-save playwright');
  process.exit(2);
}

const { normalizarRuta, normalizarBase } = require('./pagina-estatica.cjs');

const BASE = normalizarBase(process.env.BASE || 'http://localhost:4174/Portal-Galivelop/');
const RAIZ = join(__dirname, '..', '..');
const AXE = join(RAIZ, 'node_modules', 'axe-core', 'axe.min.js');
const ETIQUETAS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];
const VENTANAS = [
  ['escritorio', 1280, 800],
  ['movil', 390, 844],
];
const TEMAS = ['claro', 'oscuro'];
const EXTRA = ['', 'proyectos/tarkor', 'equipo', 'participa/proponer'];
const CLAVE_TEMA = 'galivelop.tema';

function rutas() {
  if (process.argv.slice(2).length) return process.argv.slice(2).map(normalizarRuta);
  const xml = readFileSync(join(RAIZ, 'dist', 'sitemap.xml'), 'utf8');
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const base = locs[0].replace(/^(https?:\/\/[^/]+\/[^/]*\/?).*$/, '$1').replace(/\/?$/, '/');
  return [...locs.map((l) => l.slice(base.length)), 'no-existe'];
}

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
  if (!existsSync(join(RAIZ, 'dist', 'index.html'))) {
    console.error('auditar-accesibilidad: dist/ is missing. Run: npm run build');
    process.exit(2);
  }
  const hijo = (vista = spawn('npx', ['vite', 'preview', '--port', '4174', '--strictPort'], { cwd: RAIZ, stdio: 'ignore', detached: true }));
  for (let i = 0; i < 60; i++) {
    if (await responde()) return;
    await new Promise((r) => setTimeout(r, 250));
  }
  parar(hijo);
  console.error('auditar-accesibilidad: vite preview did not start on port 4174');
  process.exit(2);
}
for (const senal of ['SIGINT', 'SIGTERM']) {
  process.on(senal, () => {
    if (vista) parar(vista);
    process.exit(130);
  });
}

async function abrir(navegador, ruta, tema, ancho, alto, opciones = {}) {
  const contexto = await navegador.newContext({ viewport: { width: ancho, height: alto }, ...opciones });
  await contexto.addInitScript(([k, v]) => localStorage.setItem(k, v), [CLAVE_TEMA, tema]);
  const pagina = await contexto.newPage();
  await pagina.goto(BASE + ruta, { waitUntil: 'networkidle' });
  // Los trozos cargados en diferido: espera a que haya contenido en <main> y a que el tema esté puesto.
  await pagina.waitForFunction((t) => document.documentElement.dataset.tema === t && document.querySelector('main')?.textContent.trim().length > 20, tema, { timeout: 8000 }).catch(() => {});
  await pagina.waitForTimeout(300);
  return { pagina, contexto };
}

async function axe(pagina) {
  await pagina.addScriptTag({ path: AXE });
  return pagina.evaluate(
    (tags) => window.axe.run(document, { runOnly: { type: 'tag', values: tags }, resultTypes: ['violations'] }).then((r) => r.violations.map((v) => (v.id === 'color-contrast' ? { ...v, nodes: v.nodes.filter((n) => !n.target.join(' ').includes('logo-gali')) } : v)).filter((v) => v.nodes.length).map((v) => ({ id: v.id, impact: v.impact, ayuda: v.help, tags: v.tags.filter((t) => /^wcag\d/.test(t)), nodos: v.nodes.map((n) => ({ sel: n.target.join(' '), html: n.html.slice(0, 140), resumen: (n.failureSummary || '').split('\n').slice(1, 3).join(' ').trim() })) }))),
    ETIQUETAS,
  );
}

/** En el navegador: texto recortado o solapado con el espaciado de 1.4.12 puesto. */
function recortes() {
  const css = '*{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}p{margin-bottom:2em!important}';
  const estilo = document.createElement('style');
  estilo.textContent = css;
  document.head.append(estilo);
  const nombre = (el) => `${el.tagName.toLowerCase()}${typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/)[0] : ''} «${el.textContent.trim().replace(/\s+/g, ' ').slice(0, 24)}»`;
  const fallos = [];
  for (const el of document.querySelectorAll('body *')) {
    if (el.closest('svg') || !el.clientWidth || !el.textContent.trim()) continue;
    const e = getComputedStyle(el);
    if (e.visibility === 'hidden' || e.display === 'none') continue;
    const oculta = /hidden|clip/.test(e.overflowX + e.overflowY);
    if (oculta && (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1) && e.textOverflow !== 'ellipsis') fallos.push(`${nombre(el)} ${el.scrollWidth}x${el.scrollHeight}>${el.clientWidth}x${el.clientHeight}`);
  }
  estilo.remove();
  return [...new Set(fallos)].slice(0, 8);
}

/** En el navegador: animaciones o transiciones que siguen corriendo con movimiento reducido. */
function movimiento() {
  const activos = [];
  for (const el of document.querySelectorAll('*')) {
    const e = getComputedStyle(el);
    const anima = e.animationName !== 'none' && parseFloat(e.animationDuration) > 0.01 && e.animationPlayState === 'running';
    const trans = e.transitionProperty !== 'none' && e.transitionDuration.split(',').some((d) => parseFloat(d) > 0.01);
    if (anima || trans) activos.push(`${el.tagName.toLowerCase()}${typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/)[0] : ''} ${anima ? 'anim ' + e.animationName + ' ' + e.animationDuration : 'trans ' + e.transitionDuration}`);
  }
  return [...new Set(activos)].slice(0, 8);
}

/** En el navegador: enlaces y botones visibles sin borde, contorno ni fondo en colores forzados. */
function colores() {
  const sin = [];
  for (const el of document.querySelectorAll('button, a[href], input, select, textarea, summary')) {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    const e = getComputedStyle(el);
    const borde = ['Top', 'Right', 'Bottom', 'Left'].some((l) => parseFloat(e['border' + l + 'Width']) > 0 && e['border' + l + 'Style'] !== 'none');
    const esEnlace = el.tagName === 'A';
    // Un enlace se distingue por el subrayado; un botón o campo, por el borde.
    if (esEnlace ? !/underline/.test(e.textDecorationLine) && !borde : !borde && e.outlineStyle === 'none') sin.push(`${el.tagName.toLowerCase()}${typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/)[0] : ''} «${(el.textContent.trim() || el.getAttribute('aria-label') || '').replace(/\s+/g, ' ').slice(0, 20)}»`);
  }
  return [...new Set(sin)].slice(0, 10);
}

async function extras(navegador, ruta, tema, informe) {
  const etiqueta = `/${ruta} (${tema})`;
  // Reflow a 320 px: un zoom del 400 % sobre 1280 px.
  let { pagina, contexto } = await abrir(navegador, ruta, tema, 320, 256);
  const ancho = await pagina.evaluate(() => document.documentElement.scrollWidth);
  if (ancho > 321) informe.push({ ruta: etiqueta, prueba: 'reflow 320px (1.4.10)', detalle: `scrollWidth ${ancho}` });
  await contexto.close();
  // Espaciado de texto.
  ({ pagina, contexto } = await abrir(navegador, ruta, tema, 390, 844));
  const cortes = await pagina.evaluate(recortes);
  if (cortes.length) informe.push({ ruta: etiqueta, prueba: 'espaciado de texto (1.4.12)', detalle: cortes.join(' | ') });
  // Recorrido con Tab (escritorio).
  await contexto.close();
  ({ pagina, contexto } = await abrir(navegador, ruta, tema, 1280, 800));
  const vistos = new Set();
  const sinFoco = [];
  let anterior = '';
  let repetido = 0;
  let saltos = 0;
  let ultimoY = -1;
  for (let i = 0; i < 150; i++) {
    await pagina.keyboard.press('Tab');
    const f = await pagina.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const e = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const visible = (e.outlineStyle !== 'none' && parseFloat(e.outlineWidth) > 0) || (e.boxShadow !== 'none' && e.boxShadow !== '') || e.textDecorationLine.includes('underline') !== el.matches('a:not(:focus)');
      return { id: `${el.tagName.toLowerCase()}${typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/)[0] : ''} «${(el.textContent.trim() || el.getAttribute('aria-label') || '').replace(/\s+/g, ' ').slice(0, 20)}»`, visible, y: r.top + scrollY, dentroDialogo: !!el.closest('dialog'), enlace: el.tagName === 'A' };
    });
    if (!f) continue;
    if (f.id === anterior) repetido++;
    else repetido = 0;
    anterior = f.id;
    if (repetido >= 2) {
      informe.push({ ruta: etiqueta, prueba: 'trampa de teclado (2.1.2)', detalle: f.id });
      break;
    }
    if (vistos.has(f.id) && vistos.size > 5 && !f.dentroDialogo) {
      // Dio la vuelta: fin del recorrido.
      if (vistos.has(f.id)) break;
    }
    vistos.add(f.id);
    if (!f.visible) sinFoco.push(f.id);
    if (ultimoY >= 0 && f.y < ultimoY - 400) saltos++;
    ultimoY = f.y;
  }
  if (sinFoco.length) informe.push({ ruta: etiqueta, prueba: 'foco sin contorno ni sombra (2.4.7)', detalle: [...new Set(sinFoco)].slice(0, 8).join(' | ') });
  if (saltos > 1) informe.push({ ruta: etiqueta, prueba: 'orden del foco (2.4.3)', detalle: `${saltos} saltos hacia arriba de más de 400 px` });
  informe.push({ ruta: etiqueta, prueba: 'info: elementos enfocables recorridos', detalle: String(vistos.size) });
  await contexto.close();
  // Movimiento reducido.
  ({ pagina, contexto } = await abrir(navegador, ruta, tema, 1280, 800, { reducedMotion: 'reduce' }));
  const mov = await pagina.evaluate(movimiento);
  if (mov.length) informe.push({ ruta: etiqueta, prueba: 'movimiento reducido (2.3.3)', detalle: mov.join(' | ') });
  await contexto.close();
  // Colores forzados.
  ({ pagina, contexto } = await abrir(navegador, ruta, tema, 1280, 800, { forcedColors: 'active' }));
  const col = await pagina.evaluate(colores);
  if (col.length) informe.push({ ruta: etiqueta, prueba: 'colores forzados (1.4.11)', detalle: col.join(' | ') });
  await contexto.close();
}

(async () => {
  await servidor();
  if (!existsSync(AXE)) {
    console.error('auditar-accesibilidad: axe-core is missing. Run: npm ci');
    if (vista) parar(vista);
    process.exit(2);
  }
  const navegador = await chromium.launch();
  const lista = rutas();
  const reglas = new Map();
  const detalle = [];
  for (const tema of TEMAS) {
    for (const [nombre, ancho, alto] of VENTANAS) {
      for (const ruta of lista) {
        const { pagina, contexto } = await abrir(navegador, ruta, tema, ancho, alto);
        const vs = await axe(pagina);
        await contexto.close();
        for (const v of vs) {
          const r = reglas.get(v.id) ?? { impacto: v.impact, ayuda: v.ayuda, wcag: v.tags.join(','), nodos: 0, paginas: new Set() };
          r.nodos += v.nodos.length;
          r.paginas.add(`/${ruta}`);
          reglas.set(v.id, r);
          detalle.push({ regla: v.id, impacto: v.impact, ruta: `/${ruta}`, tema, ventana: nombre, nodos: v.nodos });
        }
      }
    }
    process.stderr.write(`axe: tema ${tema} hecho\n`);
  }
  console.log(`== axe-core: ${lista.length} rutas x ${TEMAS.length} temas x ${VENTANAS.length} ventanas ==`);
  console.log('regla\timpacto\tnodos\tpáginas\tWCAG\tejemplos');
  const orden = { critical: 0, serious: 1, moderate: 2, minor: 3 };
  for (const [id, r] of [...reglas].sort((a, b) => orden[a[1].impacto] - orden[b[1].impacto])) {
    const ej = [...new Set(detalle.filter((d) => d.regla === id).flatMap((d) => d.nodos.map((n) => n.sel)))].slice(0, 3).join(' ; ');
    console.log([id, r.impacto, r.nodos, r.paginas.size, r.wcag, ej].join('\t'));
  }
  if (!reglas.size) console.log('(sin violaciones)');
  const informe = [];
  const paraExtras = process.argv.slice(2).length ? lista : EXTRA;
  for (const tema of TEMAS) for (const ruta of paraExtras) await extras(navegador, ruta, tema, informe).catch((e) => informe.push({ ruta, prueba: 'error', detalle: e.message }));
  console.log('\n== comprobaciones extra ==');
  console.log('ruta\tprueba\tdetalle');
  for (const i of informe) console.log([i.ruta, i.prueba, i.detalle].join('\t'));
  if (process.env.JSON) writeFileSync(process.env.JSON, JSON.stringify({ detalle, extras: informe }, null, 1));
  await navegador.close();
  if (vista) parar(vista);
  const grave = [...reglas.values()].some((r) => r.impacto === 'serious' || r.impacto === 'critical');
  process.exit(grave ? 1 : 0);
})().catch((e) => {
  console.error(e);
  if (vista) parar(vista);
  process.exit(2);
});
