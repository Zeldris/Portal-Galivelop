import { Suspense, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Cabecera } from './components/Cabecera';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Pie } from './components/Pie';
import { buscarLegal } from './data/legal';
import { Inicio } from './pages/Inicio';
import {
  Equipo,
  Legal,
  Miembro,
  Muro,
  NoEncontrado,
  Novedades,
  Productos,
  Proponer,
  Proyecto,
  Unirse,
} from './paginas';
import { leerAncla } from './utils/ancla';

/** Al cambiar de página, sube arriba; si la ruta trae #ancla, baja hasta ella. */
function Desplazamiento() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    const id = leerAncla(hash);
    const bajar = () => {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: 'smooth' });
      return el !== null;
    };
    if (bajar()) return;
    // La página (o su ficha) puede llegar después de la ruta: se espera a que aparezca el ancla, con un tope.
    const observador = new MutationObserver(() => {
      if (bajar()) observador.disconnect();
    });
    observador.observe(document.body, { childList: true, subtree: true });
    const tope = window.setTimeout(() => observador.disconnect(), 8000);
    return () => {
      observador.disconnect();
      window.clearTimeout(tope);
    };
  }, [pathname, hash]);
  return null;
}

function Rutas() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/proyectos/:slug" element={<Proyecto />} />
      <Route path="/novedades" element={<Novedades />} />
      <Route path="/muro" element={<Muro />} />
      <Route path="/equipo" element={<Equipo />} />
      <Route path="/equipo/:id" element={<Miembro />} />
      <Route path="/productos" element={<Productos />} />
      <Route path="/participa/proponer" element={<Proponer />} />
      <Route path="/participa/unirse" element={<Unirse />} />
      <Route path="/aviso-legal" element={<Legal documento={buscarLegal('aviso-legal')!} />} />
      <Route path="/privacidad" element={<Legal documento={buscarLegal('privacidad')!} />} />
      <Route path="/terminos" element={<Legal documento={buscarLegal('terminos')!} />} />
      <Route path="*" element={<NoEncontrado />} />
    </Routes>
  );
}

export function App() {
  return (
    <>
      <Desplazamiento />
      <Cabecera />
      <main id="contenido">
        <ErrorBoundary>
          <Suspense fallback={<div className="carga-pagina" aria-busy="true" />}>
            <Rutas />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Pie />
    </>
  );
}
