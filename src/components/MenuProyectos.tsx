import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { proyectos, ruta } from '../data/proyectos';
import { useIdioma } from '../i18n/Idioma';
import { EstadoEtiqueta } from './EstadoEtiqueta';

/**
 * «Proyectos» con submenú: un enlace a la página de cada proyecto y otro a la lista completa.
 * En escritorio se despliega al pasar el ratón o al pulsar; en el menú móvil se muestra abierto.
 */
export function MenuProyectos({ alNavegar }: { alNavegar: () => void }) {
  const { t, tx } = useIdioma();
  const [abierto, setAbierto] = useState(false);
  const caja = useRef<HTMLDivElement>(null);
  const { pathname, hash } = useLocation();

  useEffect(() => setAbierto(false), [pathname, hash]);

  // Se cierra al pulsar fuera o con Escape.
  useEffect(() => {
    if (!abierto) return;
    const fuera = (e: MouseEvent) => {
      if (!caja.current?.contains(e.target as Node)) setAbierto(false);
    };
    const tecla = (e: KeyboardEvent) => e.key === 'Escape' && setAbierto(false);
    document.addEventListener('mousedown', fuera);
    document.addEventListener('keydown', tecla);
    return () => {
      document.removeEventListener('mousedown', fuera);
      document.removeEventListener('keydown', tecla);
    };
  }, [abierto]);

  const navegar = () => {
    setAbierto(false);
    alNavegar();
  };
  const actual = pathname.startsWith('/proyectos/');

  return (
    <div
      ref={caja}
      className={`submenu${abierto ? ' abierto' : ''}`}
      onMouseEnter={() => setAbierto(true)}
      onMouseLeave={() => setAbierto(false)}
    >
      <button
        type="button"
        className={`submenu-boton${actual ? ' actual' : ''}`}
        aria-expanded={abierto}
        aria-controls="submenu-proyectos"
        onClick={() => setAbierto((a) => !a)}
      >
        {t('nav.proyectos')} <ChevronDown size={15} aria-hidden="true" />
      </button>
      <div id="submenu-proyectos" className="submenu-panel">
        <ul>
          {proyectos.map((p) => (
            <li key={p.slug}>
              <Link
                to={`/proyectos/${p.slug}`}
                onClick={navegar}
                className="submenu-proyecto"
                aria-current={pathname === `/proyectos/${p.slug}` ? 'page' : undefined}
              >
                <img src={ruta(p.portada.mini)} alt="" />
                <span className="submenu-texto">
                  <strong>{p.nombre}</strong>
                  <span>{tx(p.categoria)}</span>
                </span>
                <EstadoEtiqueta estado={p.estado} />
              </Link>
            </li>
          ))}
        </ul>
        <Link to="/#proyectos" onClick={navegar} className="submenu-todos">
          {t('nav.proyectos.todos')}
        </Link>
      </div>
    </div>
  );
}
