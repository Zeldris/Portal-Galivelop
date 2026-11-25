#!/usr/bin/env node
// Deja <nombre>-movil.webp (960 de ancho, la versión que elige el móvil con pantalla de doble densidad) junto a cada WebP
// que se le pase, con la misma receta que scripts/diagramas-webp.mjs (PIL, LANCZOS, calidad 82). No toca el original.
// Uso: node scripts/miniatura-webp.mjs public/proyectos/tarkor/portada.webp [otra.webp …]
import { execFileSync } from 'node:child_process';

const ANCHO = 960;
const archivos = process.argv.slice(2);
if (!archivos.length) {
  console.error('Uso: node scripts/miniatura-webp.mjs <imagen.webp> [...]');
  process.exit(2);
}
for (const f of archivos) {
  const salida = f.replace(/\.webp$/, '-movil.webp');
  execFileSync('python3', [
    '-c',
    `import sys
from PIL import Image
im=Image.open(sys.argv[1]).convert('RGB')
im.resize((${ANCHO},round(im.height*${ANCHO}/im.width)),Image.LANCZOS).save(sys.argv[2],quality=82,method=6)`,
    f,
    salida,
  ]);
  console.log(`${salida} (${ANCHO} de ancho)`);
}
