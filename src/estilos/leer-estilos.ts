import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));

/** Hojas de `global.css` (sus `@import`), en el orden de la cascada. */
export function hojasDeEstilos(): string[] {
  const indice = readFileSync(join(AQUI, 'global.css'), 'utf8');
  return [...indice.matchAll(/^@import\s+'\.\/([\w-]+\.css)';/gm)].map((m) => m[1]);
}

/** El CSS de todo el portal: las hojas de `global.css` concatenadas en orden, para los tests que leen reglas. */
export function leerEstilos(): string {
  return hojasDeEstilos()
    .map((h) => readFileSync(join(AQUI, h), 'utf8'))
    .join('\n');
}
