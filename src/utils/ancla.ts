/**
 * El id del #ancla de la URL, sin la almohadilla y decodificado. Un ancla cortada (p. ej. #%E0%A4%A) no se puede
 * decodificar: se devuelve tal cual en vez de tumbar la página.
 */
export function leerAncla(hash: string): string {
  const id = hash.replace(/^#/, '');
  try {
    return decodeURIComponent(id);
  } catch {
    return id;
  }
}
