import { describe, expect, it } from 'vitest';
import { alClicSubmenu, debeEnfocarContenido, esRaton } from './interaccion';

describe('submenú de Proyectos', () => {
  it('con ratón, el clic tras abrir por hover no lo cierra', () => {
    expect(alClicSubmenu(true, 'mouse')).toBe(true);
    expect(alClicSubmenu(false, 'mouse')).toBe(true);
  });
  it('con toque o teclado, el clic alterna', () => {
    expect(alClicSubmenu(false, 'touch')).toBe(true);
    expect(alClicSubmenu(true, 'touch')).toBe(false);
    expect(alClicSubmenu(true, '')).toBe(false);
    expect(alClicSubmenu(false, '')).toBe(true);
  });
  it('solo el ratón abre y cierra al pasar por encima', () => {
    expect(esRaton('mouse')).toBe(true);
    expect(esRaton('touch')).toBe(false);
    expect(esRaton('pen')).toBe(false);
  });
});

describe('foco al cambiar de página', () => {
  it('cambia de página, con o sin ancla: se enfoca (el enlace pulsado ya no está)', () => {
    expect(debeEnfocarContenido('/', '/equipo')).toBe(true);
    expect(debeEnfocarContenido('/equipo', '/proyectos/tarkor')).toBe(true);
  });
  it('misma página (cambio de idioma o de ancla): no se enfoca', () => {
    expect(debeEnfocarContenido('/equipo', '/equipo')).toBe(false);
  });
});
