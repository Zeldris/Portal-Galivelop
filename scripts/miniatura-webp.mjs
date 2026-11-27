#!/usr/bin/env node
// Deja <nombre>-movil.webp (960 de ancho, la versión que elige el móvil con pantalla de doble densidad) junto a cada WebP
// que se le pase, con la misma receta que scripts/diagramas-webp.mjs (PIL, LANCZOS, calidad 82). No toca el original.
// Uso: node scripts/miniatura-webp.mjs public/proyectos/tarkor/portada.webp [otra.webp …]
// Con --cuadrada deja además <nombre>-cuadrada.webp: el centro cuadrado a 540 × 540, la que eligen los teléfonos
// (hasta 480 px de ancho) en la cabecera de la ficha si la portada lleva `"cuadrada": true` (src/data/marca.ts).
import { execFileSync } from 'node:child_process';

const ANCHO = 960;
const LADO_CUADRADA = 540;
const cuadrada = process.argv.includes('--cuadrada');
const archivos = process.argv.slice(2).filter((a) => a !== '--cuadrada');
if (!archivos.length) {
  console.error('Uso: node scripts/miniatura-webp.mjs [--cuadrada] <imagen.webp> [...]');
  process.exit(2);
}
for (const f of archivos) {
  if (cuadrada) {
    const salida = f.replace(/\.webp$/, '-cuadrada.webp');
    execFileSync('python3', [
      '-c',
      `import sys
from PIL import Image
im=Image.open(sys.argv[1]).convert('RGB')
l=min(im.size);x=(im.width-l)//2;y=(im.height-l)//2
im.crop((x,y,x+l,y+l)).resize((${LADO_CUADRADA},${LADO_CUADRADA}),Image.LANCZOS).save(sys.argv[2],quality=82,method=6)`,
      f,
      salida,
    ]);
    console.log(`${salida} (${LADO_CUADRADA} × ${LADO_CUADRADA})`);
  }
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
