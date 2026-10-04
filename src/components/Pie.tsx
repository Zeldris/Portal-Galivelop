import { Link } from 'react-router-dom';
import { MARCA } from '../data/marca';
import { proyectos } from '../data/proyectos';
import { useIdioma } from '../i18n/Idioma';
import { IconoDiscord } from './IconoDiscord';
import { IconoGitHub } from './IconoGitHub';
import { Logo } from './Logo';

export function Pie() {
  const { t } = useIdioma();
  return (
    <footer className="pie">
      <div className="contenedor pie-fila">
        <div className="pie-marca">
          <Logo tamano={30} />
          <p>{t('pie.hecho')}</p>
        </div>
        <nav className="pie-proyectos" aria-label={t('nav.proyectos')}>
          {proyectos.map((p) => (
            <Link key={p.slug} to={`/proyectos/${p.slug}`}>
              {p.nombre}
            </Link>
          ))}
        </nav>
        <div className="pie-redes">
          <a href={MARCA.discord} target="_blank" rel="noreferrer" aria-label="Discord" title="Discord">
            <IconoDiscord />
          </a>
          <a href={MARCA.github} target="_blank" rel="noreferrer" aria-label="GitHub" title="GitHub">
            <IconoGitHub />
          </a>
        </div>
        <p className="pie-derechos">
          © {new Date().getFullYear()} Galivelop. {t('pie.derechos')}
        </p>
      </div>
    </footer>
  );
}
