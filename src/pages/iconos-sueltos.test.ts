import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// Los 21 iconos juntos (IconoMarca) pesaban ~55 KB gzip en la portada y las fichas: cada página importa los suyos sueltos.
function archivos(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory()
      ? archivos(join(dir, e.name))
      : /\.(tsx?|css)$/.test(e.name)
        ? [join(dir, e.name)]
        : [],
  );
}
const fuentes = archivos('src').filter((f) => !f.endsWith('iconos-sueltos.test.ts'));

describe('iconos sueltos', () => {
  it('ningún archivo de src/ importa components/IconoMarca', () => {
    const malos = fuentes.filter((f) =>
      /components\/IconoMarca|from '\.\/IconoMarca'/.test(readFileSync(f, 'utf8')),
    );
    expect(malos).toEqual([]);
    expect(existsSync('src/components/IconoMarca.tsx')).toBe(false);
  });

  it('cada ?raw de assets/iconos/ existe', () => {
    const importados = fuentes.flatMap((f) =>
      [
        ...readFileSync(f, 'utf8').matchAll(
          /from '((?:\.\.?\/)+assets\/iconos\/[^']+\.svg)\?raw'/g,
        ),
      ].map((m) => join(f, '..', m[1])),
    );
    expect(importados.length).toBeGreaterThan(0);
    expect(importados.filter((r) => !existsSync(r))).toEqual([]);
  });
});
