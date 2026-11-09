import { cabecera, git } from './comun';
import { at, dos, e, type Guion } from './tipos';

// «Trabajar»: retomar desde git, elegir skill y modelo, repartir a subagentes y subir con la bitácora.
export const trabajar: Guion = {
  id: 'trabajar',
  pasos: 4,
  atomos: [
    ...git(true),
    ...cabecera('1-4', '1-4', { 1: 0.12, 2: 0.16, 3: 0.2, 4: 0.3 }),
    at('T', '1-2', [76, 183], [26, 89], { t: 'SessionStart', c: 'su' }),
    at('T', '3', [60, 238], [26, 89], { t: e('planea'), c: 'tm' }),
    at('T', '4', [76, 183], [26, 89], { t: 'commit + push', c: 'su' }),
    // 1 · retomar
    at('B', '1', [400, 70, 230, 40], [40, 164, 246, 32], {
      t: 'fetch · commit ✓',
      plano: true,
      c: 'ok',
    }),
    at('B', '1', [400, 122, 150, 40], [40, 204, 246, 32], { t: 'check ✓', plano: true, c: 'ok' }),
    at('B', '1', [520, 290, 170, 40], [40, 124, 246, 32], { t: 'handoff.md', plano: true }),
    at('L', '1', 'M380 441V196H364', 'M22 330V110', { c: 'cel', flecha: 'cel' }),
    // 2 · elegir
    at('B', '2', [420, 64, 220, 76], [40, 124, 246, 56], {
      t: 'gw-selector',
      s: dos(e('que-skill'), e('skill-modelo')),
      mono: true,
    }),
    at('L', '2', 'M360 100H416', 'M163 182V198', { c: 'cel', flecha: 'cel' }),
    at('B', '2', [420, 160, 130, 36], [40, 200, 118, 32], {
      t: 'skill',
      plano: true,
      c: 'cel',
      dl: 0.15,
    }),
    at('B', '2', [570, 160, 130, 36], [168, 200, 118, 32], {
      t: e('modelo'),
      plano: true,
      c: 'cel',
      dl: 0.3,
    }),
    at('L', '2', 'M640 102H780', 'M166 258H224', { c: 'no', flecha: 'no' }),
    at('T', '2', [650, 92], [40, 262], { t: e('riesgo'), c: 'tm' }),
    at('P', '2', [830, 110, 1.7], [246, 262, 0.9]),
    at('T', '2', [830, 190], [246, 300], { t: e('persona'), c: 'su', a: 'middle' }),
    // 3 · repartir
    ...[1, 2, 3].map((n) =>
      at('B', '3', [440, 56 * n, 200, 46], [14 + 94 * (n - 1), 150, 84, 60], {
        t: dos(e('subagente'), `sub ${n}`),
        s: dos(null, e('limpio')),
        dl: 0.1 * n,
      }),
    ),
    ...[66, 122, 178].map((y) => at('M', '3', [606, y, 12, 26], null, { niveles: { 3: 0.08 } })),
    at('L', '3', 'M362 71H436', 'M48 108V148', { c: 'cel', flecha: 'cel' }),
    at('L', '3', 'M362 127H436', 'M142 108V148', { c: 'cel', flecha: 'cel' }),
    at('L', '3', 'M362 183H436', 'M236 108V148', { c: 'cel', flecha: 'cel' }),
    at('L', '3', 'M436 87H362', 'M64 148V110', { c: 'al', flecha: 'al', dl: 0.3 }),
    at('L', '3', 'M436 143H362', 'M158 148V110', { c: 'al', flecha: 'al', dl: 0.3 }),
    at('L', '3', 'M436 199H362', 'M252 148V110', { c: 'al', flecha: 'al', dl: 0.3 }),
    at('T', '3', [440, 248], [14, 246], {
      t: dos(['→ ', e('encargo'), '   ← ', e('resumen-15')], ['↓ ', e('encargo')]),
      c: 'tm',
    }),
    at('T', '3', null, [14, 264], { t: ['↑ ', e('resumen-15')], c: 'tm' }),
    // 4 · subir
    at('B', '4', [400, 64, 250, 40], [40, 124, 246, 32], { t: e('trabajo-bitacora'), plano: true }),
    at('B', '4', [400, 116, 170, 40], [40, 164, 122, 32], {
      t: 'pre-commit ✓',
      plano: true,
      c: 'ok',
      dl: 0.15,
    }),
    at('B', '4', [590, 116, 170, 40], [164, 164, 122, 32], {
      t: 'pre-push ✓',
      plano: true,
      c: 'ok',
      dl: 0.3,
    }),
    at('B', '4', [400, 168, 250, 40], [40, 204, 246, 32], {
      t: 'Siguiente: …',
      plano: true,
      c: 'cel',
    }),
    at('L', '4', 'M675 160V330H580V432', 'M244 238V312', { c: 'cel', flecha: 'cel', dl: 0.3 }),
  ],
};
