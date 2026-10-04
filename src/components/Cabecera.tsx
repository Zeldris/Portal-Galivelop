import { Moon, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { IDIOMAS } from '../data/tipos';
import { useIdioma } from '../i18n/Idioma';
import { Logo } from './Logo';
import { useTema } from './Tema';

export function Cabecera() {
  const { t, idioma, cambiarIdioma } = useIdioma();
  const { tema, alternar } = useTema();

  return (
    <header className="cabecera">
      <a className="saltar" href="#contenido">
        {t('nav.saltar')}
      </a>
      <div className="contenedor cabecera-fila">
        <Link to="/" className="cabecera-logo" aria-label="Galivelop">
          <Logo />
        </Link>
        <nav className="cabecera-nav" aria-label={t('nav.menu')}>
          <Link to="/#proyectos">{t('nav.proyectos')}</Link>
          <Link to="/#sobre">{t('nav.sobre')}</Link>
          <Link to="/#contacto">{t('nav.contacto')}</Link>
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
        </div>
      </div>
    </header>
  );
}
