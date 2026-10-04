import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Cabecera } from './components/Cabecera';
import { Pie } from './components/Pie';
import { Inicio } from './pages/Inicio';
import { NoEncontrado } from './pages/NoEncontrado';
import { Proponer } from './pages/Proponer';
import { Proyecto } from './pages/Proyecto';
import { Unirse } from './pages/Unirse';

/** Al cambiar de página, sube arriba; si la ruta trae #ancla, baja hasta ella. */
function Desplazamiento() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
}

export function App() {
  return (
    <>
      <Desplazamiento />
      <Cabecera />
      <main id="contenido">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/proyectos/:slug" element={<Proyecto />} />
          <Route path="/participa/proponer" element={<Proponer />} />
          <Route path="/participa/unirse" element={<Unirse />} />
          <Route path="*" element={<NoEncontrado />} />
        </Routes>
      </main>
      <Pie />
    </>
  );
}
