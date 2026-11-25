/**
 * Fecha de la página que narra un guion frente a su `narra`: AVISO, nunca fallo (la publicación semanal no debe
 * romperse). `fechaPagina` es la fecha más nueva de los datos de la página, o `undefined` si no tiene (se omite).
 */
export type EstadoGuion = 'al-dia' | 'desfasado' | 'sin-fecha';

export function estadoGuion(narra: string, fechaPagina: string | undefined): EstadoGuion {
  if (!fechaPagina) return 'sin-fecha';
  return fechaPagina > narra ? 'desfasado' : 'al-dia';
}

/** La fecha ISO (AAAA-MM-DD) más nueva de la lista, o `undefined` si está vacía. */
export function fechaMasNueva(fechas: string[]): string | undefined {
  return fechas.reduce<string | undefined>((m, f) => (!m || f > m ? f : m), undefined);
}
