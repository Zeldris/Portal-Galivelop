import type { Proyecto } from './tipos';

// Solo para los tests: todas las fichas enteras a la vez. La web no importa este archivo (sacaría las fichas grandes
// del chunk de cada proyecto y las metería en el inicial); allí van bajo demanda (src/data/proyectos.ts).
const modulos = import.meta.glob<{ default: Proyecto }>('./proyectos/*.json', { eager: true });

export const fichasCompletas: Proyecto[] = Object.values(modulos)
  .map((m) => m.default)
  .sort((a, b) => b.orden - a.orden);
