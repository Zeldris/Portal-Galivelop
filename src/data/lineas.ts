// Líneas de trabajo del taller. Cada proyecto indica las suyas en su .json (campo "lineas");
// los textos van en src/i18n/textos.ts como linea.<id>.titulo y linea.<id>.texto.
export const LINEAS = ['ia-local', 'mundos', 'informacion', 'producto'] as const;
export type Linea = (typeof LINEAS)[number];
