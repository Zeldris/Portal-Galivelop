import { IDIOMAS } from './tipos';

/** Recorre un valor y devuelve las rutas de todo objeto con forma de Texto incompleto (lo usan los tests de datos). */
export function textosIncompletos(valor: unknown, camino = ''): string[] {
  if (Array.isArray(valor)) return valor.flatMap((v, i) => textosIncompletos(v, `${camino}[${i}]`));
  if (valor && typeof valor === 'object') {
    const o = valor as Record<string, unknown>;
    if ('es' in o || 'gl' in o || 'en' in o) {
      return IDIOMAS.filter((l) => typeof o[l] !== 'string' || !(o[l] as string).trim()).map(
        (l) => `${camino}.${l}`,
      );
    }
    return Object.entries(o).flatMap(([k, v]) => textosIncompletos(v, `${camino}.${k}`));
  }
  return [];
}
