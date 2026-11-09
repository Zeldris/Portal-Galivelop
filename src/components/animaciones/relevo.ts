import { cabecera, git } from './comun';
import { at, dos, e, type Guion } from './tipos';

// «Relevo»: el contexto crece, se compacta, la sesión se corta y otra sigue desde git.
export const relevo: Guion = {
  id: 'relevo',
  pasos: 4,
  atomos: [
    ...git(false),
    ...cabecera('1-3', '1-2', { 1: 0.92, 2: 0.22, 3: 0.22 }),
    at('T', '1', [76, 183], [26, 89], { t: e('pesa-mas'), c: 'su' }),
    at('T', '2', [76, 183], [26, 89], { t: e('compactada'), c: 'su' }),
    at('B', '3', [60, 60, 300, 150], [14, 14, 272, 92], {
      t: [e('sesion-a'), ' ✗'],
      s: e('se-apaga'),
      ty: 0.44,
      c: 'no',
    }),
    at('B', '4', [60, 60, 300, 150], [14, 14, 272, 56], {
      t: [e('sesion-a'), ' ✗ ', e('cortada')],
      c: 'gh',
    }),
    // 1 · el contexto crece (esquema del coste, sin cifras)
    at('T', '1', [440, 58], [30, 134], { t: e('coste-llamada'), c: 'tm' }),
    at('L', '1', 'M440 70V220H880', 'M30 148V244H282', { c: '' }),
    at('L', '1', 'M440 100H880', 'M30 166H282', { c: 'no fino' }),
    at('T', '1', [880, 92], [282, 160], { t: e('tope'), c: 'su', a: 'end' }),
    at('L', '1', 'M440 212Q700 205 800 104', 'M30 238Q180 230 262 172', { c: 'cel' }),
    at('T', '1', [880, 244], [282, 268], { t: [e('llamadas'), ' →'], c: 'su', a: 'end' }),
    at('B', '1', [440, 262, 280, 40], [14, 280, 210, 28], {
      t: e('esquema'),
      plano: true,
      c: 'cel',
    }),
    // 2 · compactar
    at('B', '2', [400, 64, 150, 40], [40, 124, 246, 32], { t: '/compact', plano: true }),
    at('B', '2', [400, 116, 300, 40], [40, 164, 246, 32], {
      t: 'recover.py --state',
      plano: true,
      dl: 0.2,
    }),
    at('R', '2', [316, 88.8, 28, 101.2], [252, 28.2, 18, 47.8]),
    at('L', '2', 'M380 441V136H396', 'M22 330V180H36', { c: 'cel', flecha: 'cel', dl: 0.2 }),
    at('T', '2', [60, 238], [40, 232], { t: e('mismo-paso'), c: 'tm' }),
    // 3 · corte
    at('T', '3', [400, 96], [40, 140], {
      t: dos(
        [e('sin-tokens'), ' · ', e('contenedor'), ' · ', e('otra-cuenta')],
        [e('sin-tokens'), ' · ', e('contenedor')],
      ),
      c: 'tm',
    }),
    at('T', '3', null, [40, 160], { t: ['· ', e('otra-cuenta')], c: 'tm' }),
    at('B', '3', [400, 380, 270, 40], [40, 248, 200, 32], {
      t: [e('git-intacto'), ' ✓'],
      plano: true,
      c: 'ok',
      dl: 0.2,
    }),
    // 4 · relevo
    at('B', '4', [600, 60, 300, 150], [14, 82, 272, 60], {
      t: [e('sesion-b'), ' ✓'],
      s: e('sigue-siguiente'),
      ty: 0.44,
      c: 'ok',
    }),
    at('M', '4', [856, 80, 28, 110], [252, 90, 18, 44], { niveles: { 4: 0.05 } }),
    at('L', '4', 'M580 441V136H596', 'M22 330V146', { c: 'cel', flecha: 'cel' }),
    at('B', '4', [392, 70, 180, 84], [40, 156, 246, 52], {
      t: e('tres-subagentes'),
      s: e('contexto-limpio'),
      dl: 0.2,
    }),
    at('T', '4', [60, 308], [40, 250], { t: e('no-subido-1'), c: 'nm' }),
    at('T', '4', [60, 366], [40, 280], { t: e('no-subido-2'), c: 'nm' }),
  ],
};
