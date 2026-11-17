import { Suspense, use, useEffect, useRef, type ComponentType } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Cabecera } from './components/Cabecera';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Pie } from './components/Pie';
import { buscarLegal } from './data/legal';
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
import { debeEnfocarContenido } from './utils/interaccion';

// La portada también va en su propio trozo: arrastra los iconos de la marca (unos 230 kB de SVG) que las demás páginas
// de texto no necesitan. Como en src/paginas.ts, el punto de entrada la espera antes del primer render (src/main.tsx) y,
// ya cargada, se pinta sin suspender.
let inicioCargado: ComponentType | undefined;
let inicioPromesa: Promise<ComponentType> | undefined;
export function cargarInicio(): Promise<ComponentType> {
  inicioPromesa ??= import('./pages/Inicio').then((m) => (inicioCargado = m.Inicio));
  return inicioPromesa;
}
function Inicio() {
  const Pagina = inicioCargado ?? use(cargarInicio());
  return <Pagina />;
}

/** Al cambiar de página, sube arriba y lleva el foco al contenido; si la ruta trae #ancla, baja hasta ella. */
function Desplazamiento() {
  const { pathname, hash } = useLocation();
  const anterior = useRef(pathname);
  useEffect(() => {
    // Gestión de foco de la SPA: sin esto, tras pulsar un enlace el foco se queda en un elemento que ya no está.
    // No en la primera carga, ni al cambiar solo de idioma o de ancla.
    if (debeEnfocarContenido(anterior.current, pathname)) {
      document.getElementById('contenido')?.focus({ preventScroll: true });
    }
    anterior.current = pathname;

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
      <main id="contenido" tabIndex={-1} style={{ outline: 'none' }}>
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
