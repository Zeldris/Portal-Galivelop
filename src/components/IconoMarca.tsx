import { useEffect, useState, type ComponentType } from 'react';

/** Iconos propios de la marca (recursos 7, 8, 9, 14, 25 y 26 de `docs/marca.md`), en un solo trazado con `currentColor`. */
const NOMBRES = [
  'a-fondo',
  'avance',
  'bombilla',
  'candado',
  'codigo',
  'como-esta-hecho',
  'compas',
  'documento-check',
  'galeria',
  'historial',
  'hito-curso',
  'hito-hecho',
  'hito-pendiente',
  'implantacion',
  'mira',
  'mundos',
  'papel-ventana',
  'ramas',
  'ramas-unidas',
  'resumen',
  'terminal',
] as const;
export type NombreIcono = (typeof NOMBRES)[number];

type Icono = { viewBox: string; trazado: string };

// Un chunk por icono: solo se descarga el que se pinta.
const FUENTES = import.meta.glob<string>('../assets/iconos/*.svg', {
  query: '?raw',
  import: 'default',
});

const resueltos = new Map<NombreIcono, Icono>();
const pendientes = new Map<NombreIcono, Promise<Icono>>();

/** `viewBox` y contenido de un SVG; pide el archivo una sola vez. */
function cargarIcono(nombre: NombreIcono): Promise<Icono> {
  let promesa = pendientes.get(nombre);
  if (!promesa) {
    const cargar = FUENTES[`../assets/iconos/${nombre}.svg`];
    if (!cargar) return Promise.reject(new Error(`IconoMarca: falta ${nombre}.svg`));
    promesa = cargar().then((svg) => {
      const m = /<svg\b[^>]*\sviewBox="([^"]+)"[^>]*>([\s\S]*)<\/svg>/.exec(svg);
      if (!m) throw new Error(`IconoMarca: ${nombre}.svg sin <svg viewBox> legible`);
      const icono = { viewBox: m[1], trazado: m[2] };
      resueltos.set(nombre, icono);
      return icono;
    });
    // Un fallo se olvida para que un reintento (otra ruta, recarga del límite de error) vuelva a pedirlo.
    promesa.catch(() => pendientes.delete(nombre));
    pendientes.set(nombre, promesa);
  }
  return promesa;
}

/** Pide los iconos con antelación (p. ej. los de una página mientras llega su chunk). Nunca rechaza. */
export function precargarIconos(nombres: readonly NombreIcono[]): Promise<unknown> {
  return Promise.all(nombres.map((n) => cargarIcono(n).catch(() => undefined)));
}

/** Se pinta en línea (no con `<img>`) para que tome el color del texto y casen las reglas de `svg` del CSS. */
export function IconoMarca({ nombre }: { nombre: NombreIcono }) {
  const [, forzar] = useState(0);
  const icono = resueltos.get(nombre);
  useEffect(() => {
    if (resueltos.has(nombre)) return;
    let vivo = true;
    cargarIcono(nombre).then(
      () => vivo && forzar((n) => n + 1),
      (error: unknown) => {
        // Se relanza en el render para que lo recoja el límite de error, como antes con el SVG ilegible.
        if (vivo)
          forzar(() => {
            throw error;
          });
      },
    );
    return () => {
      vivo = false;
    };
  }, [nombre]);
  // Sin el SVG todavía: mismo contenedor vacío (el tamaño lo fija el CSS) y un viewBox cuadrado.
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={icono?.viewBox ?? '0 0 24 24'}
      aria-hidden="true"
      focusable="false"
      dangerouslySetInnerHTML={{ __html: icono?.trazado ?? '' }}
    />
  );
}

/** El icono como componente, para ponerlo en los mismos huecos que un icono de lucide (siempre decorativo). */
export const iconoMarca = (nombre: NombreIcono): ComponentType<{ 'aria-hidden'?: 'true' }> =>
  function Icono() {
    return <IconoMarca nombre={nombre} />;
  };
