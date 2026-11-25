import { execFileSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';

// scripts/paginas-estaticas.mjs sobre un dist/ mínimo: sin muro por debajo del umbral (src/data/muro-umbral.ts) y con
// él en el umbral. MURO_UMBRAL=0 simula «en el umbral» sin añadir publicaciones falsas.
const RAIZ = resolve(__dirname, '..');
const tmps: string[] = [];

function generar(env: Record<string, string>) {
  delete process.env.MURO_UMBRAL;
  const tmp = mkdtempSync(join(tmpdir(), 'estatico-muro-'));
  tmps.push(tmp);
  for (const d of ['public', 'src', 'tools']) symlinkSync(join(RAIZ, d), join(tmp, d));
  mkdirSync(join(tmp, 'dist/assets'), { recursive: true });
  const base = readFileSync(join(RAIZ, 'index.html'), 'utf8').replaceAll(
    '%BASE_URL%',
    '/Portal-Galivelop/',
  );
  writeFileSync(join(tmp, 'dist/index.html'), base);
  writeFileSync(join(tmp, 'dist/404.html'), base);
  for (const f of ['Proyecto-AbCd1234.js', 'tarkor-AbCd1234.js', 'Muro-AbCd1234.js'])
    writeFileSync(join(tmp, 'dist/assets', f), '');
  execFileSync('node', [join(RAIZ, 'scripts/paginas-estaticas.mjs')], {
    cwd: tmp,
    stdio: 'pipe',
    env: { ...process.env, ...env },
  });
  const leer = (r: string) => readFileSync(join(tmp, 'dist', r), 'utf8');
  return { tmp, leer };
}

afterAll(() => tmps.forEach((t) => rmSync(t, { recursive: true, force: true })));

describe('muro en las páginas estáticas', () => {
  it('por debajo del umbral: sin página, sin sitemap, sin llms.txt y sin enlaces desde el pie', () => {
    const { tmp, leer } = generar({});
    expect(existsSync(join(tmp, 'dist/muro/index.html'))).toBe(false);
    expect(leer('sitemap.xml')).not.toContain('/muro');
    expect(leer('llms.txt')).not.toContain('/muro');
    expect(leer('equipo/index.html')).not.toContain('/muro');
    expect(leer('novedades/index.html')).not.toContain('/muro');
  });

  it('en el umbral: página, sitemap, llms.txt y enlace desde el pie', () => {
    const { tmp, leer } = generar({ MURO_UMBRAL: '0' });
    expect(existsSync(join(tmp, 'dist/muro/index.html'))).toBe(true);
    expect(leer('sitemap.xml')).toContain('/muro/');
    expect(leer('llms.txt')).toContain('/muro/');
    expect(leer('equipo/index.html')).toContain('/Portal-Galivelop/muro/');
  });
});
