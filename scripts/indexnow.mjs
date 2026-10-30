// Tras publicar: avisa por IndexNow (Bing, Yandex, Seznam, Naver…; Google no lo usa) de las páginas del sitemap
// publicado cuyo lastmod es de los últimos DIAS días. Lo corre el workflow de Pages después de desplegar.
// Uso: node scripts/indexnow.mjs [--probar]   (--probar solo dice qué enviaría)
import { INDEXNOW_CLAVE, SITIO } from './sitio.mjs';

const DIAS = 8;
const probar = process.argv.includes('--probar');

const sitemap = await (await fetch(`${SITIO}/sitemap.xml`, { cache: 'no-store' })).text();
const desde = new Date(Date.now() - DIAS * 864e5).toISOString().slice(0, 10);
const urls = [...sitemap.matchAll(/<url><loc>([^<]+)<\/loc>(?:<lastmod>([^<]+)<\/lastmod>)?<\/url>/g)]
  .filter(([, , lastmod]) => lastmod && lastmod >= desde)
  .map(([, loc]) => loc);

if (urls.length === 0) {
  console.log(`IndexNow: ninguna página cambiada desde ${desde}; no se avisa.`);
  process.exit(0);
}
const cuerpo = { host: new URL(SITIO).host, key: INDEXNOW_CLAVE, keyLocation: `${SITIO}/${INDEXNOW_CLAVE}.txt`, urlList: urls };
if (probar) {
  console.log(JSON.stringify(cuerpo, null, 2));
  process.exit(0);
}
const r = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(cuerpo),
});
// 200 y 202 son recibido; 403 clave no encontrada; 422 URL fuera del sitio de la clave; 429 demasiadas peticiones.
console.log(`IndexNow: ${urls.length} URL desde ${desde} → HTTP ${r.status}`);
process.exit(r.ok ? 0 : 1);
