import { Menu, Moon, Sun, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IDIOMAS } from '../data/tipos';
import { useIdioma } from '../i18n/Idioma';
import { Logo } from './Logo';
import { useTema } from './Tema';

export function Cabecera() {
  const { t, idioma, cambiarIdioma } = useIdioma();
  const { tema, alternar } = useTema();
  const { pathname, hash } = useLocation();
  // Menú desplegable en móvil: se cierra al navegar.
  const [menuAbierto, setMenuAbierto] = useState(false);
  useEffect(() => setMenuAbierto(false), [pathname, hash]);

  return (
    <header className="cabecera">
      <a className="saltar" href="#contenido">
        {t('nav.saltar')}
      </a>
      <div className="contenedor cabecera-fila">
        <Link to="/" className="cabecera-logo" aria-label="Galivelop">
          <Logo />
        </Link>
        <nav id="menu-principal" className={`cabecera-nav${menuAbierto ? ' abierta' : ''}`} aria-label={t('nav.menu')}>
          <Link to="/#proyectos" onClick={() => setMenuAbierto(false)}>{t('nav.proyectos')}</Link>
          <Link to="/#sobre" onClick={() => setMenuAbierto(false)}>{t('nav.sobre')}</Link>
          <Link to="/#contacto" onClick={() => setMenuAbierto(false)}>{t('nav.contacto')}</Link>
        </nav>
        <div className="cabecera-ajustes">
          <div className="idiomas" role="group" aria-label={t('idioma.etiqueta')}>
            {IDIOMAS.map((i) => (
              <button
                key={i}
                type="button"
                lang={i}
                aria-pressed={idioma === i}
                onClick={() => cambiarIdioma(i)}
              >
                {i.toUpperCase()}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="boton-icono"
            onClick={alternar}
            aria-label={tema === 'oscuro' ? t('tema.claro') : t('tema.oscuro')}
            title={tema === 'oscuro' ? t('tema.claro') : t('tema.oscuro')}
          >
            {tema === 'oscuro' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            type="button"
            className="boton-icono boton-menu"
            onClick={() => setMenuAbierto((a) => !a)}
            aria-expanded={menuAbierto}
            aria-controls="menu-principal"
            aria-label={t('nav.menu')}
          >
            {menuAbierto ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}
