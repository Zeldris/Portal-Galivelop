import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { MARCA } from './marca';

// Los enlaces de la marca viven en marca.ts; las páginas estáticas (JSON-LD) y el README los repiten a mano. Un cambio
// de invitación de Discord tocó los tres sitios (2026-10-31): este test avisa si alguno se queda atrás.
const leer = (ruta: string) => readFileSync(new URL(`../../${ruta}`, import.meta.url), 'utf8');

describe('enlaces de la marca', () => {
  it('la invitación de Discord es un enlace discord.gg', () => {
    expect(MARCA.discord).toMatch(/^https:\/\/discord\.gg\/[A-Za-z0-9-]+$/);
  });

  it('el JSON-LD de las páginas estáticas usa los de marca.ts', () => {
    const org = leer('scripts/paginas-estaticas.mjs').match(/^const ORG = .*$/m)?.[0] ?? '';
    expect(org, 'const ORG en paginas-estaticas.mjs').not.toBe('');
    expect(org).toContain(`'${MARCA.discord}'`);
    expect(org).toContain(`'${MARCA.github}'`);
    expect(org).toContain(`'${MARCA.correo}'`);
  });

  it('el README enlaza la misma invitación de Discord', () => {
    const readme = leer('README.md');
    const invitaciones = [...new Set(readme.match(/https:\/\/discord\.gg\/[A-Za-z0-9-]+/g) ?? [])];
    expect(invitaciones).toEqual([MARCA.discord]);
  });
});
