// Pasa iconos SVG del generador (tinta #13212b sobre papel #fbfcfd) a src/assets/iconos/: un solo trazado con
// currentColor, el papel de debajo fuera (es fondo) y el de encima restado (son huecos, como los nodos de las ramas),
// un contorno de 24 unidades para igualar el grosor de lucide a 24 px y el viewBox recortado al dibujo.
// Uso: node tools/marca/limpiar-iconos.cjs <icono.svg>...   (el nombre del archivo es el del icono)
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const archivos = process.argv.slice(2);
  if (!archivos.length) throw new Error('Uso: node tools/marca/limpiar-iconos.cjs <icono.svg>...');
  const b = await chromium.launch();
  const p = await b.newPage();
  for (const f of archivos) {
    const s = fs.readFileSync(f, 'utf8');
    const trazos = [...s.matchAll(/<path fill="(#[0-9a-f]+)"[^>]*\sd="([^"]+)"/g)].map((m) => ({ color: m[1], d: m[2] }));
    const tinta = trazos.findIndex((x) => x.color === '#13212b');
    if (tinta < 0) throw new Error(`${f}: sin trazado de tinta #13212b`);
    const d = trazos.filter((x, i) => i >= tinta).map((x) => x.d).join(' ');
    await p.setContent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path id="p" d="${d}"/></svg>`);
    const r = await p.evaluate(() => {
      const c = document.getElementById('p').getBBox();
      return { x: c.x, y: c.y, w: c.width, h: c.height };
    });
    const lado = Math.ceil(Math.max(r.w, r.h) * 1.04);
    const x = Math.round(r.x + r.w / 2 - lado / 2);
    const y = Math.round(r.y + r.h / 2 - lado / 2);
    const destino = path.join('src/assets/iconos', path.basename(f));
    fs.writeFileSync(
      destino,
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${lado} ${lado}"><path fill="currentColor" fill-rule="evenodd" stroke="currentColor" stroke-width="24" stroke-linejoin="round" d="${d}"/></svg>\n`,
    );
    console.log(`${destino}: viewBox ${x} ${y} ${lado} ${lado}`);
  }
  await b.close();
})();
