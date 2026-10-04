// Genera los PNG de la marca a partir de public/marca/gd-logo.svg:
//   gd-logo-512.png (icono) y galivelop-social.png (1200x630, vista previa en redes).
// Uso: npm i --no-save playwright && node tools/generar-marca.mjs
// (Chromium de Playwright; otra ruta con CHROMIUM_PATH=...)
import { readFileSync } from 'node:fs';
import { chromium } from 'playwright';

const svg = readFileSync('public/marca/gd-logo.svg', 'utf8');
const dataSvg = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
const navegador = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });

const icono = await navegador.newPage({ viewport: { width: 512, height: 512 } });
await icono.setContent(`<body style="margin:0;background:transparent"><img src="${dataSvg}" width="512" height="512"></body>`);
await icono.screenshot({ path: 'public/marca/gd-logo-512.png', omitBackground: true });

const social = await navegador.newPage({ viewport: { width: 1200, height: 630 } });
await social.setContent(`
<body style="margin:0;width:1200px;height:630px;display:flex;align-items:center;gap:56px;padding:0 96px;box-sizing:border-box;
  background:radial-gradient(70% 90% at 85% 20%, rgba(26,166,223,.35), transparent 70%), #06121c;font-family:system-ui,sans-serif;color:#eaf4fa">
  <img src="${dataSvg}" width="220" height="220" style="filter:drop-shadow(0 24px 40px rgba(0,131,193,.5))">
  <div>
    <div style="font-size:96px;font-weight:800;letter-spacing:-4px"><span style="color:#1aa6df">Gali</span>velop</div>
    <div style="font-size:30px;color:#9fb4c4;margin-top:8px">Taller de creación, investigación y aprendizaje</div>
  </div>
</body>`);
await social.screenshot({ path: 'public/marca/galivelop-social.png' });
await navegador.close();
