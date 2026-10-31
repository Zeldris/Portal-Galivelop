import { Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { documentosLegales } from '../data/legal';
import { MARCA } from '../data/marca';
import { publicaciones } from '../data/muro';
import { proyectos } from '../data/proyectos';
import { useIdioma } from '../i18n/Idioma';
import { IconoDiscord } from './IconoDiscord';
import { IconoGitHub } from './IconoGitHub';
import { Logo } from './Logo';

/** Pie en columnas: marca y redes, taller, Galivelop, Participa y Legal; debajo, titular y licencias. */
export function Pie() {
  const { t, tx } = useIdioma();
  return (
    <footer className="pie">
      <div className="contenedor pie-rejilla">
        <div className="pie-marca">
          <Logo tamano={30} />
          <p>{t('pie.hecho')}</p>
          <div className="pie-redes">
            <a
              href={MARCA.discord}
              target="_blank"
              rel="noreferrer"
              aria-label="Discord"
              title="Discord"
            >
              <IconoDiscord />
            </a>
            <a
              href={MARCA.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              title="GitHub"
            >
              <IconoGitHub />
            </a>
            <a href={`mailto:${MARCA.correo}`} aria-label={MARCA.correo} title={MARCA.correo}>
              <Mail size={18} />
            </a>
          </div>
        </div>

        <nav className="pie-columna" aria-labelledby="pie-taller">
          <h2 id="pie-taller">{t('nav.taller')}</h2>
          <ul>
            {proyectos.map((p) => (
              <li key={p.slug}>
                <Link to={`/proyectos/${p.slug}`}>{p.nombre}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="pie-columna" aria-labelledby="pie-galivelop">
          <h2 id="pie-galivelop">Galivelop</h2>
          <ul>
            <li>
              <Link to="/productos">{t('nav.productos')}</Link>
            </li>
            <li>
              <Link to="/equipo">{t('nav.equipo')}</Link>
            </li>
            <li>
              <Link to="/#sobre">{t('nav.sobre')}</Link>
            </li>
            {publicaciones.length > 0 && (
              <li>
                <Link to="/muro">{t('nav.muro')}</Link>
              </li>
            )}
          </ul>
        </nav>

        <nav className="pie-columna" aria-labelledby="pie-participa">
          <h2 id="pie-participa">{t('nav.contacto')}</h2>
          <ul>
            <li>
              <Link to="/participa/proponer">{t('prop.titulo')}</Link>
            </li>
            <li>
              <Link to="/participa/unirse">{t('unir.titulo')}</Link>
            </li>
          </ul>
        </nav>

        <nav className="pie-columna" aria-labelledby="pie-legal">
          <h2 id="pie-legal">{t('pie.legal')}</h2>
          <ul>
            {documentosLegales.map((d) => (
              <li key={d.slug}>
                <Link to={`/${d.slug}`}>{tx(d.titulo)}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="contenedor pie-base">
        <p>
          © {new Date().getFullYear()} Galivelop · {MARCA.titular}
        </p>
        <p>
          {t('pie.codigo')}:{' '}
          <a href={`${MARCA.repositorio}/blob/main/LICENSE`} target="_blank" rel="noreferrer">
            MIT
          </a>{' '}
          · {t('pie.contenido')}:{' '}
          <a href={MARCA.licenciaContenido} target="_blank" rel="noreferrer">
            CC BY 4.0
          </a>
        </p>
      </div>
    </footer>
  );
}
