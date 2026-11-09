import { at, dos, e, type Atomo, type Guion, type PorModo, type Rotulo } from './tipos';

// «Camino a main»: tres fases, la persona decide, el pre-push juzga el commit (el paso 7 es la rama del fallo)
// y el CI. Abajo (o a la izquierda en móvil), la pista de las cinco paradas.
const XS = [110, 290, 470, 650, 830];
const YM = [44, 102, 160, 218, 276];
const NOMBRES: PorModo<Rotulo | null>[] = [
  e('codigo'),
  // En móvil, el nombre va en la columna estrecha de la pista: «environment» no cabe.
  dos(e('entorno'), e('entorno-corto')),
  e('marca'),
  dos('pre-push', 'push'),
  'main',
];
const PIES: Rotulo[] = [e('arreglos'), 'retro.md', 'reviewed', 'exit 0', 'CI ✓'];
const HECHA = ['2-8', '3-8', '4-8', '6,8', '8'];
const PENDIENTE = ['1', '1-2', '1-3', '1-5', '1-7'];

const pista: Atomo[] = [
  at('L', '1-8', 'M90 470H870', 'M26 44V276', { c: 'gr' }),
  ...XS.flatMap((x, i) => [
    at('D', PENDIENTE[i], [x, 470, 17], [26, YM[i], 11], { c: 'so' }),
    at('D', HECHA[i], [x, 470, 17], [26, YM[i], 11], { c: 'sn' }),
    at('T', HECHA[i], [x, 477], [26, YM[i] + 5], { t: '✓', c: 'ck', a: 'middle' }),
    at('T', '1-8', [x, 500], [44, YM[i] + 4], {
      t: NOMBRES[i],
      c: 'su',
      a: dos('middle', 'start'),
    }),
    at('T', '8', [x, 522], null, { t: PIES[i], c: 'lb', a: 'middle' }),
  ]),
  at('D', '7', [650, 470, 17], [26, 218, 11], { c: 'pd' }),
  at('T', '7', [650, 477], [26, 223], { t: '✗', c: 'ck', a: 'middle' }),
];

// Las cinco comprobaciones del pre-push (pasos 6 y 7); la quinta, la marca, falla en el 7.
const PUERTAS: [Rotulo, Rotulo][] = [
  ['check', e('tests-tipos')],
  [e('restos'), e('conflictos')],
  [e('protegida'), e('es-main')],
  [e('codigo'), e('lo-hay')],
  [e('marca'), e('mismo-sha')],
];
const GX = [30, 215, 400, 585, 770];
const GY = [18, 76, 134, 192, 250];
const puertas: Atomo[] = PUERTAS.flatMap(([t, s], g) => {
  const dl = g * 0.14;
  const st = g < 4 ? '6-7' : '6';
  return [
    at('B', st, [GX[g], 100, 170, 76], [110, GY[g], 176, 52], { t, s, mono: true, dl }),
    at('T', st, [GX[g] + 134, 152], [252, GY[g] + 38], { t: '✓', c: 'ckb', dl: dl + 0.1 }),
  ];
});

export const camino: Guion = {
  id: 'main',
  pasos: 8,
  atomos: [
    ...pista,
    // vía de git
    at('L', '1-8', 'M60 330H900', 'M130 164V350', { c: 'gr', ms: '1,4,8' }),
    at('T', '1-8', [60, 318], [140, 176], { t: 'main', c: 'tm', ms: '1,4,8' }),
    at('L', '1-8', 'M110 330L140 390H560', 'M130 190L200 224V334', { c: 'cel', ms: '1,4,8' }),
    at('D', '1-8', [170, 390, 9], [200, 254, 8], { c: 'cm', ms: '1,4,8' }),
    at('D', '1-8', [250, 390, 9], [200, 288, 8], { c: 'cm', ms: '1,4,8' }),
    at('D', '1-8', [330, 390, 9], [200, 322, 8], { c: 'cm', ms: '1,4,8' }),
    at('D', '1-8', [410, 390, 9], null, { c: 'cm', ms: '1,4,8' }),
    at('T', '1-8', [150, 424], [214, 238], {
      t: dos(e('rama-trabajo'), e('rama')),
      c: 'lb',
      ms: '1,8',
    }),
    at('T', '1-8', [420, 424], [200, 372], {
      t: 'check ✓',
      c: 'okt tm',
      a: dos('start', 'middle'),
      ms: '1,8',
    }),
    // 1 · rama lista
    at('T', '1', [30, 176], [110, 70], { t: e('todavia-nada'), c: 'nm' }),
    at('T', '1', [30, 234], [110, 102], { t: e('en-main'), c: 'nm' }),
    // 2 · fase 1, código
    at('B', '2', [30, 56, 300, 70], [110, 18, 176, 56], {
      t: '/code-review',
      s: '--max-findings all',
      mono: true,
    }),
    at('B', '2', [30, 138, 170, 38], [110, 82, 176, 32], { t: 'REVIEW.md', plano: true }),
    at('L', '2', 'M330 91H400M400 75V167M400 75H436M400 121H436M400 167H436', null, {
      c: 'cel fino',
    }),
    at('B', '2', [440, 56, 260, 38], [110, 126, 176, 32], {
      t: [e('grave'), ' → ', e('arreglo')],
      plano: true,
      c: 'cel',
      dl: 0.15,
    }),
    at('B', '2', [440, 102, 260, 38], [110, 164, 176, 32], {
      t: [e('medio'), ' → ', e('arreglo')],
      plano: true,
      c: 'cel',
      dl: 0.3,
    }),
    at('B', '2', [440, 148, 260, 38], [110, 202, 176, 32], {
      t: [e('leve'), ' → ', e('bitacora')],
      plano: true,
      dl: 0.45,
    }),
    // 3 · fase 2, entorno
    at('B', '3', [30, 56, 260, 50], [110, 18, 176, 40], { t: '/gw-opt-tokens', plano: true }),
    at('B', '3', [30, 116, 260, 50], [110, 64, 176, 40], { t: '/retro', plano: true, dl: 0.1 }),
    at('T', '3', [30, 196], [110, 124], {
      t: dos([e('opcional-1'), ' ', e('opcional-2')], e('opcional-1')),
      c: 'tm',
    }),
    at('T', '3', null, [110, 140], { t: e('opcional-2'), c: 'tm' }),
    ...(
      [
        [1, '✓', 'ok', 56, 148],
        [2, '✓', 'ok', 102, 184],
        [3, '✗', 'no', 148, 220],
      ] as const
    ).map(([n, marca, c, y, ym]) =>
      at('B', '3', [340, y, 220, 38], [110, ym, 96, 30], {
        t: dos([e('propuesta'), ` ${n} ${marca}`], [e('prop'), ` ${n} ${marca}`]),
        plano: true,
        c,
        dl: 0.1 + 0.1 * n,
      }),
    ),
    at('B', '3', [340, 202, 220, 38], [110, 258, 176, 32], {
      t: 'retro-*.md',
      plano: true,
      c: 'cel',
      dl: 0.5,
    }),
    at('P', '3', [740, 110, 1.8], [246, 192, 1]),
    at('T', '3', [740, 190], [246, 238], {
      t: dos(e('persona'), e('persona-corto')),
      c: 'su',
      a: 'middle',
    }),
    at('L', '3', 'M690 118H580', null, { c: 'no', flecha: 'no' }),
    // 4 · fase 3, marca
    at('B', '4', [30, 56, 210, 44], [110, 18, 176, 44], { t: 'reviewed.sh', plano: true }),
    at('B', '4', [300, 56, 260, 64], [110, 70, 176, 56], {
      t: 'reviewed.txt',
      s: e('sha-commit'),
      c: 'cel',
      dl: 0.2,
    }),
    at('L', '4', 'M240 78H296', null, { c: 'cel', flecha: 'cel' }),
    at('D', '4', [410, 390, 15], [200, 322, 14], { c: 'ring', dl: 0.3 }),
    at('L', '4', 'M440 122V345H410V372', 'M262 130V322H216', { c: 'no', flecha: 'no', dl: 0.3 }),
    at('T', '4', [458, 240], [200, 372], { t: e('mismo-sha'), c: 'tm', a: dos('start', 'middle') }),
    // 5 · la persona decide
    at('P', '5', [110, 150, 2.6], [150, 64, 1.5]),
    at('T', '5', [110, 246], [150, 118], { t: e('persona'), c: 'su', a: 'middle' }),
    at('B', '5', [250, 56, 280, 50], [110, 132, 176, 36], {
      t: e('subimos'),
      plano: true,
      c: 'cel',
    }),
    at('B', '5', [250, 124, 130, 44], [110, 176, 80, 32], {
      t: e('si'),
      plano: true,
      c: 'ok',
      dl: 0.3,
    }),
    at('L', '5', 'M380 146H560', 'M150 210V222', { c: 'cel', flecha: 'cel', dl: 0.5 }),
    at('B', '5', [564, 110, 330, 76], [110, 224, 176, 56], {
      t: 'handoff.md',
      s: dos(e('confirmacion-apuntada'), e('confirmacion')),
      dl: 0.6,
    }),
    // 6-7 · pre-push
    at('T', '6-7', [30, 76], null, { t: e('gancho-juzga'), c: 'tx' }),
    ...puertas,
    // 7 · si falta algo
    at('B', '7', [770, 100, 170, 76], [110, 250, 176, 52], {
      t: e('marca'),
      s: e('sin-marca'),
      mono: true,
      c: 'bad',
    }),
    at('T', '7', [904, 152], [252, 288], { t: '✗', c: 'xb', dl: 0.1 }),
    at('B', '7', [30, 200, 900, 84], [14, 318, 272, 72], {
      t: dos(['✗ ', e('rechazada'), ' · exit 1'], ['✗ ', e('rechazada')]),
      s: dos([e('orden'), ': bash .claude/gw/scripts/reviewed.sh'], 'exit 1 · reviewed.sh'),
      c: 'band',
      tc: 'sp',
      dl: 0.3,
    }),
    // 8 · CI y main
    at('B', '8', [30, 56, 210, 44], [110, 18, 176, 32], { t: 'CI Linux ✓', plano: true, c: 'ok' }),
    at('B', '8', [30, 112, 210, 44], [110, 58, 176, 32], {
      t: 'CI macOS ✓',
      plano: true,
      c: 'ok',
      dl: 0.15,
    }),
    at('B', '8', [620, 56, 310, 84], [110, 98, 176, 56], {
      t: ['main · ', e('publicado')],
      s: dos(e('web-o-version'), e('web-publicada')),
      c: 'cel',
      dl: 0.3,
    }),
    at('L', '8', 'M560 390C650 390 700 330 780 330', 'M200 322V336L130 350', { c: 'cel', dl: 0.3 }),
    at('L', '8', 'M780 330H900', 'M130 164V350', { c: 'cel', dl: 0.3 }),
    at('T', '8', [30, 190], [14, 392], {
      t: dos(e('ci-rojo'), e('ci-no-arranca')),
      c: dos('tx', 'tm'),
      dl: 0.4,
    }),
    at('T', '8', null, [14, 410], { t: e('cuenta-rojo'), c: 'tm', dl: 0.4 }),
    at('T', '8', [30, 260], null, { t: e('sin-revision'), c: 'nm' }),
    at('P', '8', [850, 215, 1.2], null),
    at('T', '8', [850, 266], null, { t: e('persona-confirma'), c: 'su', a: 'middle' }),
  ],
};
