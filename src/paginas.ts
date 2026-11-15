import { createElement, use, type ComponentType } from 'react';
import { precargarIconos } from './components/IconoMarca';
import { cargarFicha } from './data/proyectos';
import { leerAncla } from './utils/ancla';

// Todas las páginas menos la portada van en su propio chunk. Los import() viven aquí, en un mapa compartido, para que
// el punto de entrada pueda esperarlos antes del primer render (src/main.tsx) y la página reutilice la misma carga.
const CARGADORES = {
  Equipo: () => import('./pages/Equipo').then((m) => m.Equipo),
  Legal: () => import('./pages/Legal').then((m) => m.Legal),
  Miembro: () => import('./pages/Miembro').then((m) => m.Miembro),
  Muro: () => import('./pages/Muro').then((m) => m.Muro),
  NoEncontrado: () => import('./pages/NoEncontrado').then((m) => m.NoEncontrado),
  Novedades: () => import('./pages/Novedades').then((m) => m.Novedades),
  Productos: () => import('./pages/Productos').then((m) => m.Productos),
  Proponer: () => import('./pages/Proponer').then((m) => m.Proponer),
  Proyecto: () => import('./pages/Proyecto').then((m) => m.Proyecto),
  Unirse: () => import('./pages/Unirse').then((m) => m.Unirse),
} satisfies Record<string, () => Promise<ComponentType<any>>>;

export type NombrePagina = keyof typeof CARGADORES;

type Componente<N extends NombrePagina> = Awaited<ReturnType<(typeof CARGADORES)[N]>>;
type ComponenteDe<N extends NombrePagina> =
  Componente<N> extends ComponentType<infer P> ? P : never;

const promesas = new Map<NombrePagina, Promise<unknown>>();
const resueltas = new Map<NombrePagina, unknown>();

const fallidas = new Set<NombrePagina>();

/**
 * Carga el chunk de una página una sola vez. Un fallo se queda guardado (si se borrase enseguida, cada reintento de
 * React tras suspender pediría otro import y el aviso de error no llegaría nunca) hasta `olvidarFallos`.
 */
export function cargarPagina(nombre: NombrePagina): Promise<unknown> {
  let promesa = promesas.get(nombre);
  if (!promesa) {
    promesa = CARGADORES[nombre]().then(
      (componente) => {
        resueltas.set(nombre, componente);
        return componente;
      },
      (error: unknown) => {
        fallidas.add(nombre);
        throw error;
      },
    );
    promesas.set(nombre, promesa);
  }
  return promesa;
}

/** Lo llama el límite de error al reiniciarse (otra ruta u otro idioma): el siguiente render pide de nuevo el chunk. */
export function olvidarFallos(): void {
  for (const nombre of fallidas) promesas.delete(nombre);
  fallidas.clear();
}

function perezosa<N extends NombrePagina>(nombre: N) {
  // No es `React.lazy`: éste guarda el rechazo para siempre. Aquí el fallo se olvida cuando el límite de error se
  // reinicia (al cambiar de ruta o de idioma) y se vuelve a importar. Ojo: Chromium guarda el import fallido de esa
  // URL y no lo repite sin recargar (comprobado el 2026-11-14); por eso el aviso ofrece «Recargar».
  function Pagina(props: object) {
    // Ficha y chunk de Proyecto a la vez, no uno detrás del otro.
    if (nombre === 'Proyecto' && !resueltas.has(nombre))
      void cargarFicha(slugDeRuta(location.pathname)).catch(() => undefined);
    // Ya cargada: se pinta sin suspender ni un instante.
    const Componente = (resueltas.get(nombre) ??
      use(cargarPagina(nombre))) as ComponentType<object>;
    return createElement(Componente, props);
  }
  return Pagina as unknown as ComponentType<ComponenteDe<N>>;
}

export const Equipo = perezosa('Equipo');
export const Legal = perezosa('Legal');
export const Miembro = perezosa('Miembro');
export const Muro = perezosa('Muro');
export const NoEncontrado = perezosa('NoEncontrado');
export const Novedades = perezosa('Novedades');
export const Productos = perezosa('Productos');
export const Proponer = perezosa('Proponer');
export const Proyecto = perezosa('Proyecto');
export const Unirse = perezosa('Unirse');

/** Partes de la ruta sin la base de Vite ni el prefijo de idioma (`/gl`, `/en`). */
function partesDeRuta(pathname: string): string[] {
  const base = import.meta.env.BASE_URL;
  const resto = pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
  const partes = resto.split('/').filter(Boolean);
  if (partes[0] === 'gl' || partes[0] === 'en') partes.shift();
  return partes;
}

function slugDeRuta(pathname: string): string | undefined {
  const [primera, slug] = partesDeRuta(pathname);
  if (primera !== 'proyectos' || !slug) return undefined;
  // `leerAncla` decodifica sin lanzar URIError con una dirección cortada (%E0%A4%A).
  return leerAncla(slug);
}

const PAGINA_DE_PRIMER_SEGMENTO: Record<string, NombrePagina> = {
  muro: 'Muro',
  novedades: 'Novedades',
  equipo: 'Equipo',
  productos: 'Productos',
  'aviso-legal': 'Legal',
  privacidad: 'Legal',
  terminos: 'Legal',
};

/** Página (si no es la portada) que toca para una ruta; refleja las `<Route>` de src/App.tsx. */
export function paginaDeRuta(pathname: string): NombrePagina | undefined {
  const partes = partesDeRuta(pathname);
  const [primera, segunda, ...mas] = partes;
  if (partes.length === 0) return undefined;
  if (primera === 'proyectos' && segunda && mas.length === 0) return 'Proyecto';
  if (primera === 'equipo' && segunda && mas.length === 0) return 'Miembro';
  if (primera === 'participa' && mas.length === 0) {
    if (segunda === 'proponer') return 'Proponer';
    if (segunda === 'unirse') return 'Unirse';
  }
  if (partes.length === 1 && primera in PAGINA_DE_PRIMER_SEGMENTO) {
    return PAGINA_DE_PRIMER_SEGMENTO[primera];
  }
  return 'NoEncontrado';
}

/**
 * Antes del primer render: espera, en paralelo, el chunk de la página que toca y, en /proyectos/:slug, la ficha.
 * Así el HTML prerenderizado de #root no se cambia por un hueco vacío mientras llegan. Un fallo no lo impide:
 * la página volverá a pedirlo y ahí se mostrará el aviso.
 */
export async function precargarRuta(pathname: string): Promise<void> {
  const pagina = paginaDeRuta(pathname);
  const esperas: Promise<unknown>[] = [];
  if (pagina) esperas.push(cargarPagina(pagina));
  // Portada: sus iconos llegan en paralelo, sin retrasar el primer render (se pintan vacíos hasta entonces).
  else if (paginaDeRuta(pathname) === undefined)
    void precargarIconos([
      'ramas',
      'bombilla',
      'terminal',
      'implantacion',
      'codigo',
      'mundos',
      'documento-check',
      'papel-ventana',
    ]);
  if (pagina === 'Proyecto') esperas.push(cargarFicha(slugDeRuta(pathname)));
  await Promise.allSettled(esperas);
}
