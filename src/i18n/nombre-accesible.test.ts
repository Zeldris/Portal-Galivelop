import { describe, expect, it } from 'vitest';
import { textos } from './textos';

// WCAG 2.5.3 (etiqueta en el nombre): el nombre accesible del enlace «Ver perfil» tiene que empezar por su texto visible.
describe.each(['es', 'gl', 'en'] as const)(
  'equipo: nombre accesible del enlace de perfil (%s)',
  (idioma) => {
    it('empieza por el texto visible', () => {
      const visible = textos[idioma]['equipo.ver'];
      const accesible = textos[idioma]['equipo.verPerfilDe'].replace('{nombre}', 'Ana');
      expect(accesible.toLowerCase().startsWith(visible.toLowerCase())).toBe(true);
      expect(accesible).toContain('Ana');
    });
  },
);
