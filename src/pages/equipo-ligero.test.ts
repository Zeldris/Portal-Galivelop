import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// LCP de /equipo/ en móvil (2026-11-26): la página pintaba tarde porque su trozo arrastraba los 21 iconos de
// IconoMarca para usar uno y bajaba la cabecera de 1600 px en un móvil de 390.
const fuente = readFileSync('src/pages/Equipo.tsx', 'utf8');

describe('página Equipo, ligera en móvil', () => {
  it('no importa IconoMarca (los 21 iconos): solo el suyo, suelto', () => {
    expect(fuente).not.toMatch(/from '\.\.\/components\/IconoMarca'/);
    expect(fuente).toContain("from '../assets/iconos/ramas.svg?raw'");
  });

  it('la cabecera lleva srcset con su versión de 800 px, y el archivo existe', () => {
    expect(fuente).toContain(
      "srcSet={`${ruta('marca/cabecera-equipo-mini.webp')} 800w, ${ruta('marca/cabecera-equipo.webp')} 1600w`}",
    );
    expect(existsSync('public/marca/cabecera-equipo-mini.webp')).toBe(true);
  });
});
