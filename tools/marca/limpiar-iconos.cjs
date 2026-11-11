// Pasa iconos SVG del generador (tinta #13212b sobre papel #fbfcfd) a src/assets/iconos/: un solo trazado con
// currentColor, el papel de debajo fuera (es fondo) y el de encima restado (son huecos, como los nodos de las ramas),
// un contorno proporcional al dibujo que acerca su grosor al de lucide a 24 px y el viewBox recortado al dibujo.
// Uso: node tools/marca/limpiar-iconos.cjs <icono.svg>...   (el nombre del archivo es el del icono)
// Pide Playwright, que no es dependencia del portal: en la nube ya está; en local, `npm i --no-save playwright`.
const fs = require('node:fs');
const path = require('node:path');

const TINTA = '#13212b';
const PAPEL = '#fbfcfd';
const DESTINO = path.join(__dirname, '../../src/assets/iconos');
/** Contorno = lado del dibujo / 28: con las líneas del generador a 24 px suma ~0,85 px, cerca de los 2 px de lucide. */
const CONTORNO = 1 / 28;

let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  console.error('limpiar-iconos: Playwright is not installed. Run: npm i --no-save playwright');
  process.exit(2);
}

const atributo = (etiqueta, nombre) => new RegExp(`\\s${nombre}="([^"]*)"`, 'i').exec(etiqueta)?.[1];

/** Los trazados del SVG en orden; falla si trae otras formas u otros colores que tinta y papel. */
function trazados(f, s) {
  const otras = /<(polygon|polyline|rect|circle|ellipse|line|g)\b/i.exec(s);
  if (otras) throw new Error(`${f}: trae <${otras[1]}>; solo se aceptan <path>`);
  return [...s.matchAll(/<path\b[^>]*>/gi)].map(([etiqueta]) => {
    const color = (atributo(etiqueta, 'fill') ?? '').toLowerCase();
    const d = atributo(etiqueta, 'd');
    if (![TINTA, PAPEL].includes(color) || !d) throw new Error(`${f}: trazado con fill «${color}» o sin d`);
    return { color, d };
  });
}

(async () => {
  const archivos = process.argv.slice(2);
  if (!archivos.length) throw new Error('Uso: node tools/marca/limpiar-iconos.cjs <icono.svg>...');
  const b = await chromium.launch();
  try {
    const p = await b.newPage();
    for (const f of archivos) {
      const todos = trazados(f, fs.readFileSync(f, 'utf8'));
      const tinta = todos.findIndex((x) => x.color === TINTA);
      if (tinta < 0) throw new Error(`${f}: sin trazado de tinta ${TINTA}`);
      if (todos.slice(tinta + 1).some((x) => x.color === TINTA)) throw new Error(`${f}: más de un trazado de tinta`);
      const d = todos
        .slice(tinta)
        .map((x) => x.d)
        .join(' ');
      await p.setContent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path id="p" d="${d}"/></svg>`);
      const r = await p.evaluate(() => {
        const c = document.getElementById('p').getBBox();
        return { x: c.x, y: c.y, w: c.width, h: c.height };
      });
      const dibujo = Math.max(r.w, r.h);
      const contorno = Math.round(dibujo * CONTORNO);
      // El contorno sobresale la mitad por cada lado; más un 2 % de aire y uno de redondeo.
      const lado = Math.ceil(dibujo * 1.04 + contorno + 2);
      const x = Math.floor(r.x + r.w / 2 - lado / 2);
      const y = Math.floor(r.y + r.h / 2 - lado / 2);
      const destino = path.join(DESTINO, path.basename(f));
      fs.writeFileSync(
        destino,
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${lado} ${lado}"><path fill="currentColor" fill-rule="evenodd" stroke="currentColor" stroke-width="${contorno}" stroke-linejoin="round" d="${d}"/></svg>\n`,
      );
      console.log(`${path.relative(process.cwd(), destino)}: viewBox ${x} ${y} ${lado} ${lado}, contorno ${contorno}`);
    }
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(`limpiar-iconos: ${e.message}`);
  process.exit(1);
});
