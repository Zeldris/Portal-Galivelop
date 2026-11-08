import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const RAIZ = join(__dirname, '../..');
const leer = (ruta: string) => readFileSync(join(RAIZ, ruta), 'utf8');

/** Valor de `--superficie` dentro del bloque cuyo selector casa con `selector`. */
function superficieDe(css: string, selector: RegExp, tema: string): string {
  const bloque = new RegExp(`${selector.source}\\s*\\{([^}]*)\\}`).exec(css);
  const valor = bloque && /--superficie:\s*(#[0-9a-fA-F]{3,8})\s*;/.exec(bloque[1]);
  if (!valor)
    throw new Error(`No se encontró --superficie del tema ${tema} en src/estilos/global.css`);
  return valor[1].toLowerCase();
}

const css = leer('src/estilos/global.css');
const claro = superficieDe(css, /:root,\s*:root\[data-tema='claro'\]/, 'claro');
const oscuro = superficieDe(css, /:root\[data-tema='oscuro'\]/, 'oscuro');

describe('theme-color del navegador y tokens de la hoja de estilos', () => {
  const html = leer('index.html');
  const tsx = leer('src/components/Tema.tsx');

  it('la meta theme-color de index.html lleva --superficie del tema claro', () => {
    const meta = /<meta\s+name="theme-color"\s+content="([^"]+)"/.exec(html);
    expect(meta, 'index.html no tiene la meta theme-color').not.toBeNull();
    expect(
      meta![1].toLowerCase(),
      `meta theme-color: se esperaba ${claro} y había ${meta![1]}`,
    ).toBe(claro);
  });

  it('el guion de index.html lleva los colores de oscuro y de claro', () => {
    const guion = /content\s*=\s*t === 'oscuro' \? '([^']+)' : '([^']+)'/.exec(html);
    expect(guion, 'index.html no tiene el guion que pone el theme-color').not.toBeNull();
    expect(
      guion![1].toLowerCase(),
      `guion, oscuro: se esperaba ${oscuro} y había ${guion![1]}`,
    ).toBe(oscuro);
    expect(guion![2].toLowerCase(), `guion, claro: se esperaba ${claro} y había ${guion![2]}`).toBe(
      claro,
    );
  });

  it('Tema.tsx lleva los mismos colores en COLOR_BARRA', () => {
    const barra = /COLOR_BARRA[^=]*=\s*\{\s*claro:\s*'([^']+)',\s*oscuro:\s*'([^']+)'/.exec(tsx);
    expect(barra, 'Tema.tsx no tiene COLOR_BARRA con claro y oscuro').not.toBeNull();
    expect(
      barra![1].toLowerCase(),
      `COLOR_BARRA claro: se esperaba ${claro} y había ${barra![1]}`,
    ).toBe(claro);
    expect(
      barra![2].toLowerCase(),
      `COLOR_BARRA oscuro: se esperaba ${oscuro} y había ${barra![2]}`,
    ).toBe(oscuro);
  });
});
