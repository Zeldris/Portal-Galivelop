import { execFileSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';

// scripts/paginas-estaticas.mjs sobre un dist/ mínimo y con 2 publicaciones de prueba (fixture en un directorio
// temporal: src/data/muro/ real no se toca). Umbral por defecto (3): oculto; MURO_UMBRAL=2, solo bajo vitest: visible.
const RAIZ = resolve(__dirname, '..');
const tmps: string[] = [];
const texto = (t: string) => ({ es: t, gl: t, en: t });
const PUBS = ['a', 'b'].map((x, i) => ({
  proyecto: 'tarkor',
  pieza: `2026-01-0${i + 1}-${x}`,
  fecha: `2026-01-0${i + 1}`,
  titulo: texto(`Titulo ${x}`),
  texto: texto(`Texto ${x}`),
}));

function generar(env: Record<string, string>) {
  const tmp = mkdtempSync(join(tmpdir(), 'estatico-muro-'));
  tmps.push(tmp);
  for (const d of ['public', 'tools']) symlinkSync(join(RAIZ, d), join(tmp, d));
  // src real con enlaces a todo salvo data/muro, que lleva las publicaciones de prueba.
  mkdirSync(join(tmp, 'src/data/muro/tarkor'), { recursive: true });
  for (const f of readdirSync(join(RAIZ, 'src')))
    if (f !== 'data') symlinkSync(join(RAIZ, 'src', f), join(tmp, 'src', f));
  for (const f of readdirSync(join(RAIZ, 'src/data')))
    if (f !== 'muro') symlinkSync(join(RAIZ, 'src/data', f), join(tmp, 'src/data', f));
  for (const p of PUBS)
    writeFileSync(join(tmp, `src/data/muro/tarkor/${p.pieza}.json`), JSON.stringify(p));
  mkdirSync(join(tmp, 'dist/assets'), { recursive: true });
  const base = readFileSync(join(RAIZ, 'index.html'), 'utf8').replaceAll(
    '%BASE_URL%',
    '/Portal-Galivelop/',
  );
  writeFileSync(join(tmp, 'dist/index.html'), base);
  writeFileSync(join(tmp, 'dist/404.html'), base);
  for (const f of ['Proyecto-AbCd1234.js', 'tarkor-AbCd1234.js', 'Muro-AbCd1234.js'])
    writeFileSync(join(tmp, 'dist/assets', f), '');
  const limpio = { ...process.env };
  delete limpio.MURO_UMBRAL;
  execFileSync('node', [join(RAIZ, 'scripts/paginas-estaticas.mjs')], {
    cwd: tmp,
    stdio: 'pipe',
    env: { ...limpio, ...env },
  });
  const leer = (r: string) => readFileSync(join(tmp, 'dist', r), 'utf8');
  return { tmp, leer };
}

afterAll(() => tmps.forEach((t) => rmSync(t, { recursive: true, force: true })));

describe('muro en las páginas estáticas', () => {
  it('por debajo del umbral: sin página, sin sitemap, sin llms.txt y sin enlaces; novedades apunta a la ficha', () => {
    const { tmp, leer } = generar({});
    expect(existsSync(join(tmp, 'dist/muro/index.html'))).toBe(false);
    expect(leer('sitemap.xml')).not.toContain('/muro');
    expect(leer('llms.txt')).not.toContain('/muro');
    expect(leer('equipo/index.html')).not.toContain('/muro');
    const novedades = leer('novedades/index.html');
    expect(novedades).toContain('Titulo a');
    expect(novedades).not.toContain('/muro');
  });

  it('en el umbral: página, sitemap, llms.txt, enlace desde el pie y novedades al muro', () => {
    const { tmp, leer } = generar({ MURO_UMBRAL: '2' });
    expect(existsSync(join(tmp, 'dist/muro/index.html'))).toBe(true);
    expect(leer('sitemap.xml')).toContain('/muro/');
    expect(leer('llms.txt')).toContain('/muro/');
    expect(leer('equipo/index.html')).toContain('/Portal-Galivelop/muro/');
    expect(leer('novedades/index.html')).toContain('muro/?proyecto=tarkor');
  });

  it.each(['', 'abc', '0', '-1', '1.5'])(
    'un MURO_UMBRAL inválido (%j) se ignora: el muro sigue oculto',
    (valor) => {
      const { tmp } = generar({ MURO_UMBRAL: valor });
      expect(existsSync(join(tmp, 'dist/muro/index.html'))).toBe(false);
    },
  );

  it('fuera de vitest, MURO_UMBRAL no cambia nada', () => {
    const { tmp } = generar({ MURO_UMBRAL: '2', VITEST: '' });
    expect(existsSync(join(tmp, 'dist/muro/index.html'))).toBe(false);
  });
});
