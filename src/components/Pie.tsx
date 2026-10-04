import { Link } from 'react-router-dom';
import { proyectos } from '../data/proyectos';
import { useIdioma } from '../i18n/Idioma';
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
        <p className="pie-derechos">
          © {new Date().getFullYear()} Galivelop. {t('pie.derechos')}
        </p>
      </div>
    </footer>
  );
}
