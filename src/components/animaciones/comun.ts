import { at, e, type Atomo } from './tipos';

/** Franja de git: pista, rótulo y tres commits con nombre y sha. Con `nuevo`, el tercero cae en el paso 4. */
export function git(nuevo: boolean): Atomo[] {
  const s = nuevo ? '4' : '1-4';
  return [
    at('L', '1-4', 'M60 450H900', 'M14 330H286', { c: 'gr' }),
    at('T', '1-4', [60, 424], [14, 398], { t: e('git-subido'), c: 'lb' }),
    at('D', '1-4', [180, 450, 9], [44, 330, 8], { c: 'cm' }),
    at('D', '1-4', [380, 450, 9], [144, 330, 8], { c: 'cm' }),
    at('T', '1-4', [180, 484], [44, 356], { t: e('bitacora'), c: 'tm', a: 'middle' }),
    at('T', '1-4', [180, 504], [44, 374], { t: '9e1b7d0', c: 'lb', a: 'middle' }),
    at('T', '1-4', [380, 484], [144, 356], { t: e('commit-arreglo'), c: 'tm', a: 'middle' }),
    at('T', '1-4', [380, 504], [144, 374], { t: 'c40a2f6', c: 'lb', a: 'middle' }),
    nuevo
      ? at('D', '4', [580, 450, 12], [244, 330, 10], { c: 'cm nuevo', cae: true })
      : at('D', '1-4', [580, 450, 9], [244, 330, 8], { c: 'cm' }),
    at('T', s, [580, 484], [244, 356], { t: 'Siguiente:', c: 'tm', a: 'middle', cae: nuevo }),
    at('T', s, [580, 504], [244, 374], { t: 'a1b2c3d', c: 'lb', a: 'middle', cae: nuevo }),
  ];
}

/** Cabecera de la sesión A con su medidor de contexto. */
export function cabecera(st: string, caja: string, niveles: Record<number, number>): Atomo[] {
  return [
    at('B', caja, [60, 60, 300, 150], [14, 14, 272, 92], { t: e('sesion-a'), ty: 0.44 }),
    at('M', st, [316, 80, 28, 110], [252, 24, 18, 52], { niveles }),
    at('T', st, [344, 199], [244, 40], { t: e('contexto'), c: 'lb', a: 'end' }),
  ];
}
