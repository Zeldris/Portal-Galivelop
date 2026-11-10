import { describe, expect, it } from 'vitest';
import { guardarPosicion, leerPosicion } from './recuerdo';

function memoria() {
  const m = new Map<string, string>();
  return {
    getItem: (k: string) => m.get(k) ?? null,
    setItem: (k: string, v: string) => void m.set(k, v),
  };
}
const pasosDe = (id: string) => ({ trabajar: 4, relevo: 3 })[id];

describe('posición de la animación al recargar', () => {
  it('vuelve a la pestaña y el paso guardados', () => {
    const a = memoria();
    guardarPosicion({ id: 'relevo', paso: 2 }, a);
    expect(leerPosicion(pasosDe, a)).toEqual({ id: 'relevo', paso: 2 });
  });

  it('sin nada guardado no hay posición (se empieza por el paso 1)', () => {
    expect(leerPosicion(pasosDe, memoria())).toBeNull();
    expect(leerPosicion(pasosDe, null)).toBeNull();
  });

  it('descarta una animación que ya no existe o un valor roto', () => {
    const a = memoria();
    a.setItem('galivelop.flujo', '{"id":"vieja","paso":2}');
    expect(leerPosicion(pasosDe, a)).toBeNull();
    a.setItem('galivelop.flujo', 'no es json');
    expect(leerPosicion(pasosDe, a)).toBeNull();
    a.setItem('galivelop.flujo', '{"id":"relevo","paso":"2"}');
    expect(leerPosicion(pasosDe, a)).toBeNull();
  });

  it('ajusta un paso fuera de rango', () => {
    const a = memoria();
    guardarPosicion({ id: 'trabajar', paso: 9 }, a);
    expect(leerPosicion(pasosDe, a)).toEqual({ id: 'trabajar', paso: 4 });
  });

  it('un almacén que lanza no rompe la página', () => {
    const roto = {
      getItem: () => {
        throw new Error('bloqueado');
      },
      setItem: () => {
        throw new Error('bloqueado');
      },
    };
    expect(leerPosicion(pasosDe, roto)).toBeNull();
    expect(() => guardarPosicion({ id: 'relevo', paso: 1 }, roto)).not.toThrow();
  });
});
