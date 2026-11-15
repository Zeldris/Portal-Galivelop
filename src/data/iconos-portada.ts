import type { NombreIcono } from '../components/IconoMarca';
import type { Linea } from './lineas';

/** Icono de marca de cada línea de trabajo en la portada. */
export const NOMBRE_ICONO_LINEA: Record<Linea, NombreIcono> = {
  'ia-local': 'codigo',
  mundos: 'mundos',
  informacion: 'documento-check',
  producto: 'papel-ventana',
  metodo: 'compas',
};

/** Icono y texto de cada principio de la portada. */
export const ICONOS_PRINCIPIOS: readonly [
  NombreIcono,
  'valor1' | 'valor2' | 'valor3' | 'valor4',
][] = [
  ['candado', 'valor1'],
  ['mira', 'valor2'],
  ['historial', 'valor3'],
  ['ramas-unidas', 'valor4'],
];

/** Todos los iconos de marca que pinta la portada (los de sus líneas, principios y adornos), sin repetir. */
export const ICONOS_PORTADA: readonly NombreIcono[] = [
  ...new Set<NombreIcono>([
    'ramas',
    'bombilla',
    'terminal',
    'implantacion',
    ...Object.values(NOMBRE_ICONO_LINEA),
    ...ICONOS_PRINCIPIOS.map(([n]) => n),
  ]),
];
