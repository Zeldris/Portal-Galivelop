/**
 * Clic en el botón del submenú. Con ratón, el puntero ya lo abrió al entrar: el clic lo deja abierto (se cierra al salir,
 * con Escape o al pulsar fuera). Con toque o teclado no hay «entrar», así que el clic alterna.
 */
export function alClicSubmenu(abierto: boolean, pointerType: string): boolean {
  return pointerType === 'mouse' ? true : !abierto;
}

/** Solo el ratón abre y cierra el submenú al pasar por encima; el toque dispara un «enter» falso antes del clic. */
export function esRaton(pointerType: string): boolean {
  return pointerType === 'mouse';
}

/** Al cambiar de página (no solo de idioma ni de ancla) el foco pasa al contenido principal. */
export function debeEnfocarContenido(rutaAntes: string, rutaAhora: string, hash: string): boolean {
  return rutaAntes !== rutaAhora && hash === '';
}
