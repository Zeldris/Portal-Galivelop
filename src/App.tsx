import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Cabecera } from './components/Cabecera';
import { Pie } from './components/Pie';
import { Equipo } from './pages/Equipo';
import { buscarLegal } from './data/legal';
import { Inicio } from './pages/Inicio';
import { Legal } from './pages/Legal';
import { Miembro } from './pages/Miembro';
import { Muro } from './pages/Muro';
import { NoEncontrado } from './pages/NoEncontrado';
import { Productos } from './pages/Productos';
import { Proponer } from './pages/Proponer';
import { Proyecto } from './pages/Proyecto';
import { Unirse } from './pages/Unirse';
import { leerAncla } from './utils/ancla';

/** Al cambiar de página, sube arriba; si la ruta trae #ancla, baja hasta ella. */
function Desplazamiento() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      document.getElementById(leerAncla(hash))?.scrollIntoView({ behavior: 'smooth' });
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
      </main>
      <Pie />
    </>
  );
}
