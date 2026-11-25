import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useLocation } from 'react-router-dom';
import { alClicSubmenu, esRaton } from '../utils/interaccion';
import { Link } from './Enlace';
import { proyectos, ruta } from '../data/proyectos';
import { useIdioma } from '../i18n/Idioma';
import { EstadoEtiqueta } from './EstadoEtiqueta';

/**
 * «Proyectos» con submenú: un enlace a la página de cada proyecto y otro a la lista completa.
 * En escritorio se despliega al pasar el ratón o al pulsar; en el menú móvil se muestra abierto.
 */
/** El ancho del menú móvil (el mismo `@media` de global.css): ahí el submenú va siempre abierto. */
const MOVIL = '(max-width: 68.75em)'; // 1100 px
const suscribir = (aviso: () => void) => {
  const m = window.matchMedia(MOVIL);
  m.addEventListener('change', aviso);
  return () => m.removeEventListener('change', aviso);
};
const esMovil = () => window.matchMedia(MOVIL).matches;

export function MenuProyectos({ alNavegar }: { alNavegar: () => void }) {
  const { t, tx } = useIdioma();
  const [abierto, setAbierto] = useState(false);
  const caja = useRef<HTMLDivElement>(null);
  const { pathname, hash } = useLocation();
  const movil = useSyncExternalStore(suscribir, esMovil, () => false);

  useEffect(() => setAbierto(false), [pathname, hash]);

  // Se cierra al pulsar fuera o con Escape.
  useEffect(() => {
    if (!abierto) return;
    const fuera = (e: MouseEvent) => {
      if (!caja.current?.contains(e.target as Node)) setAbierto(false);
    };
    const tecla = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      // Con el foco dentro del panel, al cerrarlo el foco vuelve al botón (si no, se perdería en un panel oculto).
      if (caja.current?.contains(document.activeElement)) {
        caja.current.querySelector<HTMLElement>('button.submenu-boton')?.focus();
      }
      setAbierto(false);
    };
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
  const puntero = useRef('');
  const actual = pathname.startsWith('/proyectos/');

  return (
    <div
      ref={caja}
      className={`submenu${abierto ? ' abierto' : ''}`}
      onPointerEnter={(e) => esRaton(e.pointerType) && setAbierto(true)}
      onPointerLeave={(e) => esRaton(e.pointerType) && setAbierto(false)}
      // Tab fuera del menú lo cierra.
      onBlur={(e) => {
        if (e.relatedTarget && !e.currentTarget.contains(e.relatedTarget as Node))
          setAbierto(false);
      }}
    >
      <button
        type="button"
        className={`submenu-boton${actual ? ' actual' : ''}`}
        aria-expanded={movil || abierto}
        aria-controls="submenu-proyectos"
        // El tipo de puntero sale del pointerdown: en algunos WebKit el click no es un PointerEvent. Sin pointerdown
        // (teclado), queda vacío y el clic alterna.
        onPointerDown={(e) => (puntero.current = e.pointerType)}
        onClick={() => {
          const tipo = puntero.current;
          puntero.current = '';
          setAbierto((a) => alClicSubmenu(a, tipo));
        }}
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
                aria-current={
                  pathname.replace(/\/$/, '') === `/proyectos/${p.slug}` ? 'page' : undefined
                }
              >
                {/* 56×40: la caja de la miniatura en global.css (.submenu-proyecto img), no las medidas de la imagen. */}
                <img
                  src={ruta(p.portada.mini)}
                  width={56}
                  height={40}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
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
