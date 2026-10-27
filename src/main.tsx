import '@fontsource-variable/inter';
import '@fontsource-variable/sora';
import { StrictMode, useCallback, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import type { Idioma } from './data/tipos';
import './estilos/global.css';
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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Raiz />
  </StrictMode>,
);
