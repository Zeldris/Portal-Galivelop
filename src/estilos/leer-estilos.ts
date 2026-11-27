import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));

/** Las hojas de un índice (sus `@import`, con comillas simples o dobles), en el orden de la cascada. */
export function hojasDeIndice(indice: string, hojasEnDisco: string[]): string[] {
  const hojas = [...indice.matchAll(/^@import\s+(['"])\.\/([\w-]+\.css)\1[^;]*;/gm)].map(
    (m) => m[2],
  );
  if (hojas.length === 0)
    throw new Error('global.css no importa ninguna hoja: el regex de @import no casa');
  const sueltas = hojasEnDisco.filter((h) => h !== 'global.css' && !hojas.includes(h));
  if (sueltas.length > 0)
    throw new Error(`hojas de src/estilos/ sin @import en global.css: ${sueltas.join(', ')}`);
  return hojas;
}

/** Hojas de `global.css` (sus `@import`), en el orden de la cascada. */
export function hojasDeEstilos(): string[] {
  const indice = readFileSync(join(AQUI, 'global.css'), 'utf8');
  return hojasDeIndice(
    indice,
    readdirSync(AQUI).filter((f) => f.endsWith('.css')),
  );
}

/** El CSS de todo el portal: las hojas de `global.css` concatenadas en orden, para los tests que leen reglas. */
export function leerEstilos(): string {
  return hojasDeEstilos()
    .map((h) => readFileSync(join(AQUI, h), 'utf8'))
    .join('\n');
}
