#!/usr/bin/env node
// Auditoría de seguridad, privacidad y cadena de suministro del portal, en tres partes:
//   a) en el navegador (Playwright): por cada página de dist/sitemap.xml, peticiones a orígenes que no son el propio,
//      cookies y claves de localStorage/sessionStorage (y si su valor parece un dato personal);
//   b) en el HTML estático de dist/: target=_blank sin noopener/noreferrer, enlaces http://, scripts y estilos
//      externos sin integrity, CSP y referrer por meta, iframes, scripts/estilos inline (¿es viable un CSP por meta?)
//      y mailto: expuestos;
//   c) secretos y datos que no deberían publicarse, en dist/ y en los archivos rastreados por git: claves, tokens,
//      correos que no sean los publicados a propósito, rutas locales, comentarios de depuración y source maps.
// Sale con 1 si hay terceros no esperados, noopener ausente, http:// o secretos. El resto (CSP, inline, correos)
// solo se informa. Pide Playwright (no es dependencia del portal: `npm i --no-save playwright`). Uso, tras
// `npm run build`:
//   npm run auditar:seguridad
//   BASE=http://localhost:4176/Portal-Galivelop/ node tools/qa/auditar-seguridad.cjs
// Sin BASE, arranca `vite preview --port 4176 --strictPort` si el puerto está libre y lo para al acabar.
const { spawn, execFileSync } = require('node:child_process');
const { existsSync, readFileSync, readdirSync, statSync } = require('node:fs');
const { join, extname } = require('node:path');
const { esCodigoDeSrc } = require('./pagina-estatica.cjs');

const RAIZ = join(__dirname, '..', '..');
const DIST = join(RAIZ, 'dist');
const BASE = (process.env.BASE || 'http://localhost:4176/Portal-Galivelop/').replace(/\/?$/, '/');
const DOMINIO = 'https://zeldris.github.io/Portal-Galivelop/';
// Terceros que el portal declara usar (ninguno: su /privacidad dice que no carga nada de otros sitios).
const TERCEROS_ESPERADOS = [];
// Correos publicados a propósito (aviso legal, privacidad, equipo, marca): se leen de src/data para no duplicarlos.
const errores = [];
const avisos = [];
const info = [];
const falla = (m) => errores.push(m);
const avisa = (m) => avisos.push(m);

function archivos(dir, filtro) {
  const fuera = [];
  for (const nombre of readdirSync(dir)) {
    const ruta = join(dir, nombre);
    if (statSync(ruta).isDirectory()) fuera.push(...archivos(ruta, filtro));
    else if (!filtro || filtro(ruta)) fuera.push(ruta);
  }
  return fuera;
}
const rel = (ruta) => ruta.replace(RAIZ + '/', '');

function correosPublicados() {
  const set = new Set();
  const dirs = [join(RAIZ, 'src', 'data')];
  for (const d of dirs) {
    for (const f of archivos(d, (r) => /\.(json|ts)$/.test(r))) {
      for (const m of readFileSync(f, 'utf8').matchAll(/[\w.+-]+@[\w-]+\.[\w.-]+/g)) set.add(m[0].toLowerCase());
    }
  }
  return set;
}

function paginasDelSitemap() {
  const xml = readFileSync(join(DIST, 'sitemap.xml'), 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(DOMINIO, BASE));
}

// ---------- b) HTML estático ----------
function auditarHtml() {
  const htmls = archivos(DIST, (r) => r.endsWith('.html'));
  let inlineScripts = 0, inlineStyles = 0, atributosStyle = 0, iframes = 0;
  const mailtos = new Set();
  const scriptsInline = new Set();
  for (const f of htmls) {
    const html = readFileSync(f, 'utf8');
    const r = rel(f);
    for (const m of html.matchAll(/<a\b[^>]*>/gi)) {
      const t = m[0];
      if (/target\s*=\s*["']?_blank/i.test(t) && !/rel\s*=\s*["'][^"']*(noopener|noreferrer)/i.test(t)) {
        falla(`${r}: target=_blank sin noopener/noreferrer: ${t.slice(0, 120)}`);
      }
      const mm = t.match(/href\s*=\s*["']mailto:([^"'?]+)/i);
      if (mm) mailtos.add(mm[1].toLowerCase());
    }
    for (const m of html.matchAll(/\b(?:href|src|action|srcset)\s*=\s*["']\s*(http:\/\/[^"']+)/gi)) {
      if (/^http:\/\/www\.w3\.org\//.test(m[1])) continue; // espacio de nombres SVG, no una petición
      falla(`${r}: enlace o recurso http://: ${m[1].slice(0, 100)}`);
    }
    for (const m of html.matchAll(/<(script|link)\b[^>]*>/gi)) {
      const t = m[0];
      const url = (t.match(/\b(?:src|href)\s*=\s*["']([^"']+)/i) || [])[1] || '';
      const externo = /^(https?:)?\/\//.test(url) && !url.startsWith(DOMINIO);
      const hoja = /rel\s*=\s*["']?(stylesheet|modulepreload|preload)/i.test(t) || m[1].toLowerCase() === 'script';
      if (externo && hoja && !/\bintegrity\s*=/i.test(t)) falla(`${r}: recurso externo sin integrity: ${url}`);
    }
    if (/<meta[^>]+http-equiv\s*=\s*["']?content-security-policy/i.test(html)) info.push(`${r}: tiene CSP por meta`);
    iframes += (html.match(/<iframe\b/gi) || []).length;
    for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
      if (!/\bsrc\s*=/.test(m[1]) && m[2].trim() && !/application\/(ld\+)?json/i.test(m[1])) {
        inlineScripts++;
        scriptsInline.add(m[2].trim().replace(/\s+/g, ' ').slice(0, 60));
      }
    }
    inlineStyles += (html.match(/<style\b/gi) || []).length;
    atributosStyle += (html.match(/\sstyle\s*=\s*["']/gi) || []).length;
  }
  const algunaMeta = htmls.some((f) => /<meta[^>]+name\s*=\s*["']referrer/i.test(readFileSync(f, 'utf8')));
  const algunCsp = htmls.some((f) => /http-equiv\s*=\s*["']?content-security-policy/i.test(readFileSync(f, 'utf8')));
  if (!algunCsp) avisa('Sin CSP por meta en ningún HTML (GitHub Pages no permite cabeceras).');
  if (!algunaMeta) avisa('Sin <meta name="referrer"> (GitHub Pages manda strict-origin-when-cross-origin por defecto del navegador).');
  info.push(`HTML estático: ${htmls.length} archivos; scripts inline (distintos): ${scriptsInline.size} [${[...scriptsInline].join(' | ')}]; <style> inline: ${inlineStyles}; atributos style=: ${atributosStyle}; iframes: ${iframes}`);
  info.push(`CSP por meta: script-src 'self' + hash del script inline del tema es viable; style-src necesitaría 'unsafe-inline' si hay style= (${atributosStyle} en el HTML estático; React además pone style en el DOM)`);
  const publicados = correosPublicados();
  for (const c of mailtos) {
    if (!publicados.has(c)) falla(`mailto no publicado a propósito (no está en src/data): ${c}`);
  }
  info.push(`mailto: expuestos en el HTML: ${[...mailtos].join(', ') || 'ninguno'}`);
  if (iframes) avisa(`${iframes} iframes en el HTML estático`);
}

// ---------- c) secretos ----------
const PATRONES = [
  ['clave de API/token', /\b(?:AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{35}|gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}|sk-[A-Za-z0-9]{20,}|xox[baprs]-[A-Za-z0-9-]{10,}|eyJ[A-Za-z0-9_-]{15,}\.eyJ[A-Za-z0-9_-]{15,}\.)/],
  ['clave privada', /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ['asignación de secreto', /\b(?:api[_-]?key|secret|passwd|password|token)\b\s*[:=]\s*["'][A-Za-z0-9_\-/+=]{16,}["']/i],
  ['ruta local', /(?:\/home\/[a-z][\w.-]*\/|\/Users\/[A-Za-z][\w.-]*\/|C:\\+Users\\+[\w.-]+)/],
  ['depuración', /\b(?:debugger;|console\.(?:log|debug)\()/],
  ['comentario TODO/FIXME/XXX', /(?:\/\/|\/\*|<!--)\s*(?:TODO|FIXME|XXX|HACK)\b/],
];
const TEXTO = /\.(html|js|mjs|cjs|css|json|txt|xml|svg|md|ts|tsx|yml|yaml|sh|py|webmanifest)$/;
/** `soloSecretos` es un booleano o una función de fichero: así `src/` se recorre una sola vez. */
function buscar(ficheros, etiqueta, soloSecretos) {
  const publicados = correosPublicados();
  const correos = new Map();
  const soloSecretosDe = typeof soloSecretos === 'function' ? soloSecretos : () => soloSecretos;
  for (const f of ficheros) {
    if (!TEXTO.test(f) || statSync(f).size > 3_000_000) continue;
    const txt = readFileSync(f, 'utf8');
    for (const [nombre, re] of PATRONES) {
      const soloSecreto = nombre.includes('clave') || nombre.includes('secreto');
      if (soloSecretosDe(f) && !soloSecreto && nombre !== 'ruta local') continue;
      const g = new RegExp(re.source, re.flags.replace('g', '') + 'g');
      for (const m of txt.matchAll(g)) {
        const linea = txt.slice(0, m.index).split('\n').length;
        const msg = `${etiqueta} ${rel(f)}:${linea}: ${nombre}: ${m[0].slice(0, 60)}`;
        // Las rutas, depuración y TODO son informativas fuera de dist; en dist, un secreto o una ruta local fallan.
        if (nombre === 'ruta local' && /(?:\.claude\/|docs\/|tools\/|\.githooks\/|test|CLAUDE|AGENTS|README)/.test(rel(f))) continue;
        if (soloSecreto || (etiqueta === 'dist' && nombre === 'ruta local')) falla(msg);
        else avisa(msg);
      }
    }
    for (const m of txt.matchAll(/[\w.+-]+@[\w-]+\.[a-z]{2,}/gi)) {
      const c = m[0].toLowerCase();
      if (/\.(png|webp|jpg|jpeg|svg|avif|gif|woff2?)$/.test(c) || /^[\w.-]+@\d/.test(c)) continue; // 2x@... etc.
      if (!publicados.has(c) && !/^(noreply|no-reply|git)@|@(example|users\.noreply\.github)\./.test(c)) {
        correos.set(c, (correos.get(c) || new Set()).add(rel(f)));
      }
    }
  }
  for (const [c, fs] of correos) {
    const msg = `${etiqueta}: correo no publicado a propósito: ${c} (${[...fs].slice(0, 3).join(', ')})`;
    etiqueta === 'dist' ? falla(msg) : avisa(msg);
  }
}
function auditarSecretos() {
  const dist = archivos(DIST);
  const mapas = dist.filter((f) => f.endsWith('.map'));
  for (const m of mapas) falla(`source map publicado: ${rel(m)}`);
  for (const f of dist.filter((f) => /\.js$/.test(f))) {
    if (/\/\/# sourceMappingURL=/.test(readFileSync(f, 'utf8'))) avisa(`${rel(f)}: referencia a sourceMappingURL`);
  }
  buscar(dist, 'dist', false);
  let rastreados = [];
  try {
    rastreados = execFileSync('git', ['ls-files'], { cwd: RAIZ, encoding: 'utf8' }).split('\n').filter(Boolean).map((f) => join(RAIZ, f)).filter((f) => existsSync(f));
  } catch {
    avisa('git ls-files no disponible: repo sin revisar');
  }
  // Secretos en cualquier archivo rastreado; el resto (depuración, TODO) solo en src/.
  buscar(rastreados, 'repo', (f) => !esCodigoDeSrc(f));
  for (const f of rastreados) {
    if (/(^|\/)\.env(\.|$)|\.(pem|key|p12|pfx)$|id_rsa/.test(f)) falla(`archivo sensible rastreado: ${rel(f)}`);
  }
  info.push(`dist: ${dist.length} archivos, ${mapas.length} source maps; repo rastreado: ${rastreados.length} archivos`);
}

// ---------- a) navegador ----------
function puertoLibre(url) {
  return fetch(url).then(() => false, () => true);
}
async function auditarNavegador() {
  let chromium;
  try {
    ({ chromium } = require('playwright'));
  } catch {
    console.error('auditar-seguridad: Playwright is not installed. Run: npm i --no-save playwright');
    process.exit(2);
  }
  let servidor = null;
  if (!process.env.BASE && (await puertoLibre(BASE))) {
    servidor = spawn('npx', ['vite', 'preview', '--port', '4176', '--strictPort'], { cwd: RAIZ, stdio: 'ignore', detached: true });
    for (let i = 0; i < 60 && (await puertoLibre(BASE)); i++) await new Promise((r) => setTimeout(r, 500));
    if (await puertoLibre(BASE)) {
      pararServidor(servidor);
      console.error('auditar-seguridad: vite preview did not start on port 4176');
      process.exit(2);
    }
  }
  const propio = new URL(BASE).origin;
  const terceros = new Map();
  const claves = new Map();
  const cookies = new Set();
  const paginas = paginasDelSitemap();
  const navegador = await chromium.launch();
  try {
    for (const idioma of ['es', 'en']) {
      const ctx = await navegador.newContext({ locale: idioma });
      const pag = await ctx.newPage();
      pag.on('request', (req) => {
        const u = new URL(req.url());
        if (u.protocol === 'data:' || u.protocol === 'blob:') return;
        if (u.origin !== propio) {
          const k = `${u.origin} (${req.resourceType()})`;
          if (!terceros.has(k)) terceros.set(k, new Set());
          terceros.get(k).add(pag.url());
        }
      });
      for (const url of paginas) {
        if (idioma === 'en' && !/\/(en|gl)\//.test(url) && url !== BASE) continue; // el segundo pase solo repasa el resto
        try {
          await pag.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
          // Interacciones que escriben en el almacenamiento: cambiar el tema y el idioma.
          if (url === BASE) {
            for (const sel of ['button[aria-label*="tema" i], button[aria-label*="theme" i]', 'button[aria-label*="idioma" i], button[aria-label*="language" i]']) {
              const b = await pag.$(sel);
              if (b) await b.click().catch(() => {});
            }
          }
          const alm = await pag.evaluate(() => {
            const volcar = (s) => {
              try {
                return Object.keys(s).map((k) => [k, String(s.getItem(k)).slice(0, 80)]);
              } catch {
                return [];
              }
            };
            return { local: volcar(localStorage), sesion: volcar(sessionStorage) };
          });
          for (const [tipo, lista] of [['localStorage', alm.local], ['sessionStorage', alm.sesion]]) {
            for (const [k, v] of lista) claves.set(`${tipo}:${k}`, v);
          }
        } catch (e) {
          falla(`no carga ${url}: ${e.message.split('\n')[0]}`);
        }
      }
      for (const c of await ctx.cookies()) cookies.add(`${c.name}@${c.domain}`);
      await ctx.close();
    }
  } finally {
    await navegador.close();
    if (servidor) pararServidor(servidor);
  }
  info.push(`Páginas cargadas del sitemap: ${paginas.length}`);
  for (const [k, pags] of terceros) {
    const origen = k.split(' ')[0];
    const msg = `tercero: ${k} desde ${[...pags].slice(0, 2).join(', ')}`;
    TERCEROS_ESPERADOS.includes(origen) ? info.push(msg + ' (esperado)') : falla(msg);
  }
  if (!terceros.size) info.push('Peticiones a terceros: ninguna');
  info.push(`Cookies: ${cookies.size ? [...cookies].join(', ') : 'ninguna'}`);
  if (cookies.size) falla(`cookies puestas: ${[...cookies].join(', ')}`);
  const personal = /[\w.+-]+@[\w-]+\.\w+|\b\d{8,}\b|nombre|name/i;
  for (const [k, v] of claves) {
    info.push(`Almacenamiento: ${k} = ${v}`);
    if (personal.test(v)) falla(`posible dato personal en ${k}: ${v}`);
  }
}

function pararServidor(hijo) {
  try {
    process.kill(-hijo.pid);
  } catch {
    // Ya había terminado.
  }
}

(async () => {
  if (!existsSync(join(DIST, 'sitemap.xml'))) {
    console.error('auditar-seguridad: no hay dist/. Ejecuta `npm run build`.');
    process.exit(2);
  }
  auditarHtml();
  auditarSecretos();
  await auditarNavegador();
  console.log('== Información');
  info.forEach((m) => console.log('  ' + m));
  console.log(`== Avisos (${avisos.length})`);
  avisos.slice(0, 60).forEach((m) => console.log('  ' + m));
  if (avisos.length > 60) console.log(`  ... y ${avisos.length - 60} más`);
  console.log(`== Errores (${errores.length})`);
  errores.slice(0, 100).forEach((m) => console.log('  ' + m));
  process.exit(errores.length ? 1 : 0);
})();
