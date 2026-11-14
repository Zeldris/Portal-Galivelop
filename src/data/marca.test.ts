import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { MARCA, PORTADA_ESTADO } from './marca';

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

describe('portadas por estado', () => {
  it('cada estado tiene su portada en public/', () => {
    for (const [estado, archivo] of Object.entries(PORTADA_ESTADO)) {
      expect(
        existsSync(new URL(`../../public/${archivo}`, import.meta.url)),
        `${estado}: ${archivo}`,
      ).toBe(true);
    }
  });
});

describe('imágenes de la marca en los componentes', () => {
  it('cada ruta marca/*.webp escrita en src/**/*.tsx existe en public/ (también las versiones oscuras)', () => {
    const tsx = readdirSync(new URL('../', import.meta.url), { recursive: true })
      .map(String)
      .filter((f) => f.endsWith('.tsx'));
    const rutas = new Set(
      tsx.flatMap((f) => leer(`src/${f}`).match(/marca\/[a-z0-9-]+\.webp/g) ?? []),
    );
    expect(rutas.size).toBeGreaterThan(0);
    expect(
      [...rutas].filter((r) => !existsSync(new URL(`../../public/${r}`, import.meta.url))),
    ).toEqual([]);
  });
});
