import { useEffect, useState } from 'react';
import resumenes from 'virtual:proyectos-resumen';
import type { EstadoHito, Proyecto } from './tipos';

/**
 * Lo que las listas (menú, pie, portada, tarjetas, muro, equipo, productos) necesitan de un proyecto. Sale de la
 * ficha en la compilación (tools/vite/resumenes.ts) y entra en el chunk inicial; la ficha entera se carga con
 * `cargarFicha` solo en la página del proyecto.
 */
export type ResumenProyecto = Pick<
  Proyecto,
  | 'slug'
  | 'nombre'
  | 'orden'
  | 'estado'
  | 'acento'
  | 'icono'
  | 'colaboracion'
  | 'contacto'
  | 'categoria'
  | 'lema'
  | 'resumen'
  | 'etiquetas'
  | 'portada'
  | 'presentacion'
  | 'fase'
  | 'lineas'
> & { hitos: { estado: EstadoHito }[] };

// Cualquier .json de src/data/proyectos/ entra solo en el portal; el último añadido (mayor `orden`), el primero.
export const proyectos: ResumenProyecto[] = [...resumenes].sort((a, b) => b.orden - a.orden);

export function buscarProyecto(slug: string | undefined): ResumenProyecto | undefined {
  return proyectos.find((p) => p.slug === slug);
}

// Una ficha entera por archivo, en su propio chunk: no se descarga hasta que se pide.
const fichas = import.meta.glob<{ default: Proyecto }>('./proyectos/*.json');
const cache = new Map<string, Promise<Proyecto | undefined>>();

/** La ficha entera de un proyecto (cacheada); `undefined` si no existe o no se pudo cargar. */
export function cargarFicha(slug: string | undefined): Promise<Proyecto | undefined> {
  if (!slug || !buscarProyecto(slug)) return Promise.resolve(undefined);
  let promesa = cache.get(slug);
  if (!promesa) {
    const carga = fichas[`./proyectos/${slug}.json`];
    promesa = (carga ? carga().then((m) => m.default) : Promise.resolve(undefined)).catch(() => {
      // Un fallo de red no se queda en la caché: el siguiente intento vuelve a pedirla.
      cache.delete(slug);
      return undefined;
    });
    cache.set(slug, promesa);
  }
  return promesa;
}

export type EstadoFicha =
  { estado: 'cargando' } | { estado: 'no-existe' } | { estado: 'listo'; ficha: Proyecto };

/** Distingue «cargando» de «no existe»: un slug sin resumen no existe al instante, sin esperar a ninguna carga. */
export function useFicha(slug: string | undefined): EstadoFicha {
  const existe = buscarProyecto(slug) !== undefined;
  const [cargada, setCargada] = useState<{ slug: string; ficha: Proyecto | undefined } | null>(
    null,
  );
  useEffect(() => {
    if (!existe || !slug) return;
    let vigente = true;
    void cargarFicha(slug).then((ficha) => {
      if (vigente) setCargada({ slug, ficha });
    });
    return () => {
      vigente = false;
    };
  }, [slug, existe]);
  if (!existe) return { estado: 'no-existe' };
  if (!cargada || cargada.slug !== slug) return { estado: 'cargando' };
  return cargada.ficha ? { estado: 'listo', ficha: cargada.ficha } : { estado: 'no-existe' };
}

const PESO: Record<EstadoHito, number> = { hecho: 1, curso: 0.5, pendiente: 0 };

/** Avance del proyecto (0-100) a partir de sus hitos: hecho cuenta 1, en curso 0,5. */
export function progreso(p: { hitos: { estado: EstadoHito }[] }): number {
  if (p.hitos.length === 0) return 0;
  const suma = p.hitos.reduce((acc, h) => acc + PESO[h.estado], 0);
  return Math.round((suma / p.hitos.length) * 100);
}

/** Ruta pública de un recurso de public/, respetando la base de Vite. */
export function ruta(src: string): string {
  return import.meta.env.BASE_URL + src.replace(/^\//, '');
}
