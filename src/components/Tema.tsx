import { useSyncExternalStore } from 'react';

type Tema = 'claro' | 'oscuro';
const CLAVE_GUARDADA = 'galivelop.tema';
/** Color de la barra del navegador: el de la cabecera (`--superficie`) en cada tema. Mismos valores que en index.html. */
const COLOR_BARRA: Record<Tema, string> = { claro: '#ffffff', oscuro: '#111f29' };

// El tema vive en `data-tema` de <html>, fuera de #root: lo pone el guion de index.html antes de pintar (con el
// guardado, o claro por defecto: regla 1 de docs/marca.md) y aquí solo se lee y se cambia. El HTML prerenderizado sale
// siempre con el claro (`() => 'claro'` del servidor) y, al hidratar, React pasa al de la página sin aviso de diferencias.
const avisos = new Set<() => void>();
const suscribir = (aviso: () => void) => {
  avisos.add(aviso);
  return () => {
    avisos.delete(aviso);
  };
};
const leer = (): Tema => (document.documentElement.dataset.tema === 'oscuro' ? 'oscuro' : 'claro');

export function useTema() {
  const tema = useSyncExternalStore(suscribir, leer, (): Tema => 'claro');

  const alternar = () => {
    const nuevo: Tema = leer() === 'oscuro' ? 'claro' : 'oscuro';
    document.documentElement.dataset.tema = nuevo;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', COLOR_BARRA[nuevo]);
    try {
      localStorage.setItem(CLAVE_GUARDADA, nuevo);
    } catch {
      // Se mantiene solo durante la visita.
    }
    for (const aviso of avisos) aviso();
  };

  return { tema, alternar };
}
