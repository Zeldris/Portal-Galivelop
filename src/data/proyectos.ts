import { useEffect, useState } from 'react';
import resumenes from 'virtual:proyectos-resumen';
import type { EstadoHito, Proyecto } from './tipos';

import type { CAMPOS_RESUMEN } from '../../tools/vite/resumenes';

/**
 * Lo que las listas (menú, pie, portada, tarjetas, muro, equipo, productos) necesitan de un proyecto. Sale de la
 * ficha en la compilación (tools/vite/resumenes.ts, que fija los campos en `CAMPOS_RESUMEN`) y entra en el chunk
 * inicial; la ficha entera se carga con `cargarFicha` solo en la página del proyecto.
 */
export type ResumenProyecto = Pick<Proyecto, (typeof CAMPOS_RESUMEN)[number]> & {
  hitos: { estado: EstadoHito }[];
};

// Cualquier .json de src/data/proyectos/ entra solo en el portal; el último añadido (mayor `orden`), el primero.
export const proyectos: ResumenProyecto[] = [...resumenes].sort((a, b) => b.orden - a.orden);

export function buscarProyecto(slug: string | undefined): ResumenProyecto | undefined {
  return proyectos.find((p) => p.slug === slug);
}

// Una ficha entera por archivo, en su propio chunk: no se descarga hasta que se pide.
const fichas = import.meta.glob<{ default: Proyecto }>('./proyectos/*.json');
const cache = new Map<string, Promise<Proyecto | undefined>>();
// Las ya resueltas, para leerlas de forma síncrona durante el render (sin pasar por 'cargando').
const resueltas = new Map<string, Proyecto>();

/**
 * La ficha entera de un proyecto (cacheada). Da `undefined` si no existe y rechaza si la carga falla (red, hashes
 * viejos): el fallo no se queda en la caché, así que volver a llamar lo reintenta.
 */
export function cargarFicha(slug: string | undefined): Promise<Proyecto | undefined> {
  if (!slug || !buscarProyecto(slug)) return Promise.resolve(undefined);
  let promesa = cache.get(slug);
  if (!promesa) {
    const carga = fichas[`./proyectos/${slug}.json`];
    promesa = carga
      ? carga().then(
          (m) => {
            resueltas.set(slug, m.default);
            return m.default;
          },
          (error: unknown) => {
            cache.delete(slug);
            throw error;
          },
        )
      : Promise.resolve(undefined);
    cache.set(slug, promesa);
  }
  return promesa;
}

export type EstadoFicha =
  | { estado: 'cargando' }
  | { estado: 'no-existe' }
  | { estado: 'error'; reintentar: () => void }
  | { estado: 'listo'; ficha: Proyecto };

type Resultado = { slug: string; intento: number; fallo: boolean };

/**
 * «Cargando», «no existe», «error» (la carga falló: se puede reintentar) o «listo». Un slug sin resumen no existe al
 * instante, y una ficha ya cargada se pinta en el primer render.
 */
export function useFicha(slug: string | undefined): EstadoFicha {
  const existe = buscarProyecto(slug) !== undefined;
  const [intento, setIntento] = useState(0);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const guardada = slug ? resueltas.get(slug) : undefined;
  useEffect(() => {
    if (!existe || !slug || resueltas.has(slug)) return;
    let vigente = true;
    cargarFicha(slug).then(
      () => vigente && setResultado({ slug, intento, fallo: false }),
      () => {
        // El navegador recuerda un import() fallido hasta recargar: si el reintento también falla, solo recargar sirve.
        if (intento > 0) location.reload();
        else if (vigente) setResultado({ slug, intento, fallo: true });
      },
    );
    return () => {
      vigente = false;
    };
  }, [slug, existe, intento]);
  if (!existe) return { estado: 'no-existe' };
  if (guardada) return { estado: 'listo', ficha: guardada };
  if (!resultado || resultado.slug !== slug || resultado.intento !== intento) {
    return { estado: 'cargando' };
  }
  if (resultado.fallo) {
    return {
      estado: 'error',
      reintentar: () => {
        setResultado(null);
        setIntento((i) => i + 1);
      },
    };
  }
  return { estado: 'no-existe' };
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
