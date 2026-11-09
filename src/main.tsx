import '@fontsource-variable/big-shoulders-display';
import '@fontsource-variable/literata';
import '@fontsource-variable/jetbrains-mono';
import { StrictMode, useCallback, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import type { Idioma } from './data/tipos';
import './estilos/global.css';
import { precargarRuta } from './paginas';
import {
  baseDeIdioma,
  guardarIdioma,
  idiomaDeRuta,
  idiomaInicial,
  ProveedorIdioma,
} from './i18n/Idioma';

/**
 * Cada idioma tiene su dirección (castellano sin prefijo, /gl/… y /en/…) para que los buscadores
 * indexen los tres. Cambiar de idioma cambia el prefijo y mantiene la página.
 */
function Raiz() {
  const [idioma, setIdioma] = useState<Idioma>(() => {
    const inicial = idiomaInicial();
    // Sin prefijo pero con otro idioma elegido antes: se pasa a su dirección.
    if (!idiomaDeRuta(location.pathname) && inicial !== 'es') {
      const resto = location.pathname.slice(baseDeIdioma('es').length);
      history.replaceState(
        null,
        '',
        baseDeIdioma(inicial) + resto + location.search + location.hash,
      );
    }
    return inicial;
  });

  const cambiarIdioma = useCallback(
    (nuevo: Idioma) => {
      const resto = location.pathname.startsWith(baseDeIdioma(idioma))
        ? location.pathname.slice(baseDeIdioma(idioma).length)
        : '';
      history.pushState(null, '', baseDeIdioma(nuevo) + resto + location.search + location.hash);
      guardarIdioma(nuevo);
      setIdioma(nuevo);
    },
    [idioma],
  );

  // Al ir atrás o adelante entre idiomas, el idioma sigue a la dirección.
  window.onpopstate = () => setIdioma(idiomaDeRuta(location.pathname) ?? 'es');

  return (
    <BrowserRouter key={idioma} basename={baseDeIdioma(idioma)}>
      <ProveedorIdioma idioma={idioma} cambiarIdioma={cambiarIdioma}>
        <App />
      </ProveedorIdioma>
    </BrowserRouter>
  );
}

// Si un chunk ya no existe (se publicó otra versión) o la red falló, se recarga una vez para coger los hashes nuevos.
// La marca (con la hora) evita el bucle: sin sessionStorage o con otro fallo seguido, no se recarga.
window.addEventListener('vite:preloadError', (evento) => {
  try {
    const antes = Number(sessionStorage.getItem('galivelop.recarga')) || 0;
    if (Date.now() - antes < 10_000) return;
    sessionStorage.setItem('galivelop.recarga', String(Date.now()));
  } catch {
    return;
  }
  evento.preventDefault();
  location.reload();
});

// La página y la ficha que toca se esperan antes del primer render: así el HTML prerenderizado de #root no se
// sustituye por un hueco vacío mientras llegan (entrar directo a /proyectos/tarkor/).
void precargarRuta(location.pathname).then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Raiz />
    </StrictMode>,
  );
});
