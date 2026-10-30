// Avisa por IndexNow (Bing, Yandex, Seznam, Naver…; Google no lo usa) de las páginas que cambian en una publicación.
// Dos pasos del workflow de Pages:
//   node scripts/indexnow.mjs cambios   tras `npm run build` y ANTES de desplegar: compara dist/sitemap.xml con el
//                                        publicado y escribe `urls=<JSON>` (páginas nuevas o con otro lastmod)
//   node scripts/indexnow.mjs avisar    tras desplegar: manda la lista de $URLS (la salida del paso anterior)
// En local, `node scripts/indexnow.mjs cambios` solo enseña la lista.
import { readFileSync } from 'node:fs';
import { INDEXNOW_CLAVE, SITIO } from './sitio.mjs';

const lastmods = (xml) =>
  new Map([...xml.matchAll(/<url><loc>([^<]+)<\/loc>(?:<lastmod>([^<]+)<\/lastmod>)?<\/url>/g)].map(([, loc, lm]) => [loc, lm]));

const paso = process.argv[2];
if (paso === 'cambios') {
  const r = await fetch(`${SITIO}/sitemap.xml`, { cache: 'no-store' });
  if (!r.ok) throw new Error(`No se pudo leer el sitemap publicado: HTTP ${r.status}`);
  const antes = lastmods(await r.text());
  const ahora = lastmods(readFileSync('dist/sitemap.xml', 'utf8'));
  // Una página sin lastmod no se manda: no se sabe si cambió.
  const urls = [...ahora].filter(([loc, lm]) => lm && antes.get(loc) !== lm).map(([loc]) => loc);
  console.log(`urls=${JSON.stringify(urls)}`);
} else if (paso === 'avisar') {
  const urls = JSON.parse(process.env.URLS || '[]');
  if (urls.length === 0) {
    console.log('IndexNow: ninguna página cambiada; no se avisa.');
    process.exit(0);
  }
  const r = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: new URL(SITIO).host, key: INDEXNOW_CLAVE, keyLocation: `${SITIO}/${INDEXNOW_CLAVE}.txt`, urlList: urls }),
  });
  // 200 y 202 son recibido; 403 clave no encontrada; 422 URL fuera del sitio de la clave; 429 demasiadas peticiones.
  console.log(`IndexNow: ${urls.length} URL → HTTP ${r.status}`);
  process.exit(r.ok ? 0 : 1);
} else {
  console.error('Uso: node scripts/indexnow.mjs cambios | avisar');
  process.exit(2);
}
