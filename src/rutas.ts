// Qué página (y qué chunk de src/paginas.ts) toca a cada ruta. Sin imports ni `import.meta`: lo usan la app
// (src/paginas.ts) y el generador de páginas estáticas en Node (scripts/paginas-estaticas.mjs, para su
// `modulepreload`), así una página nueva no se queda sin precarga en silencio.

export type PaginaDeRuta =
  | 'Inicio'
  | 'Proyecto'
  | 'Miembro'
  | 'Proponer'
  | 'Unirse'
  | 'Muro'
  | 'Novedades'
  | 'Equipo'
  | 'Productos'
  | 'Producto'
  | 'Legal'
  | 'NoEncontrado';

const PAGINA_DE_PRIMER_SEGMENTO: Record<string, PaginaDeRuta> = {
  muro: 'Muro',
  novedades: 'Novedades',
  equipo: 'Equipo',
  productos: 'Productos',
  'aviso-legal': 'Legal',
  privacidad: 'Legal',
  terminos: 'Legal',
};

/** Página de una ruta ya partida (sin base ni prefijo de idioma); refleja las `<Route>` de src/App.tsx. */
export function paginaDeSegmentos(partes: readonly string[]): PaginaDeRuta {
  const [primera, segunda, ...mas] = partes;
  if (partes.length === 0) return 'Inicio';
  if (primera === 'proyectos' && segunda && mas.length === 0) return 'Proyecto';
  if (primera === 'equipo' && segunda && mas.length === 0) return 'Miembro';
  // `/productos` sigue de paso a `/equipo` (ADR 0004); la página es la de cada producto (ADR 0005).
  if (primera === 'productos' && segunda && mas.length === 0) return 'Producto';
  if (primera === 'participa' && mas.length === 0) {
    if (segunda === 'proponer') return 'Proponer';
    if (segunda === 'unirse') return 'Unirse';
  }
  if (partes.length === 1 && Object.hasOwn(PAGINA_DE_PRIMER_SEGMENTO, primera)) {
    return PAGINA_DE_PRIMER_SEGMENTO[primera];
  }
  return 'NoEncontrado';
}
