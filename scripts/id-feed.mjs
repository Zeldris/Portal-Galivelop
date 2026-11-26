import { createHash } from 'node:crypto';

// Identificadores del feed Atom de /novedades. Salen del contenido de cada novedad (muro o ficha, proyecto, fecha y
// un resumen del texto en castellano), no de su posición: meter una novedad nueva delante, o reordenar las del mismo
// día, no cambia el id de ninguna. Dos novedades idénticas del mismo proyecto y día se distinguen con un contador.
export function idsFeed(novedades) {
  const vistas = new Map();
  return novedades.map((x) => {
    const huella = createHash('sha1').update(x.texto.es).digest('hex').slice(0, 8);
    const clave = `${x.muro ? 'muro' : 'novedad'}/${x.proyecto}/${x.fecha}/${huella}`;
    const k = vistas.get(clave) ?? 0;
    vistas.set(clave, k + 1);
    return k ? `${clave}-${k}` : clave;
  });
}
