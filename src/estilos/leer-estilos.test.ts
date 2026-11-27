import { describe, expect, it } from 'vitest';
import { hojasDeEstilos, hojasDeIndice } from './leer-estilos';

describe('hojasDeIndice (R-7)', () => {
  it('acepta @import con comillas simples y dobles, en orden', () => {
    const indice = `@import './a.css';\n@import "./b-c.css";\n`;
    expect(hojasDeIndice(indice, ['a.css', 'b-c.css', 'global.css'])).toEqual(['a.css', 'b-c.css']);
  });

  it('falla con 0 hojas, diciendo el motivo', () => {
    expect(() => hojasDeIndice('/* vacío */', [])).toThrow(/no importa ninguna hoja/);
  });

  it('falla si una hoja del directorio no está en global.css, nombrándola', () => {
    expect(() =>
      hojasDeIndice(`@import './a.css';`, ['a.css', 'huerfana.css', 'global.css']),
    ).toThrow(/sin @import en global\.css: huerfana\.css/);
  });

  it('las hojas reales de global.css cuadran con el directorio', () => {
    expect(hojasDeEstilos().length).toBeGreaterThan(10);
  });
});
