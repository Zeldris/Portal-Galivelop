import { ArrowRight, Users } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IconoRed, nombreRed } from '../components/IconoRed';
import { equipo, iniciales } from '../data/equipo';
import { buscarProyecto, ruta } from '../data/proyectos';
import { useIdioma } from '../i18n/Idioma';

export function Equipo() {
  const { t, tx } = useIdioma();

  useEffect(() => {
    document.title = `${t('equipo.titulo')} · Galivelop`;
    return () => {
      document.title = 'Galivelop';
    };
  }, [t]);

  return (
    <section className="seccion equipo-pagina">
      <div className="contenedor">
        <header className="seccion-cabecera">
          <div>
            <h1>{t('equipo.titulo')}</h1>
            <p>{t('equipo.intro')}</p>
          </div>
        </header>

        <ul className="personas">
          {equipo.map((p) => (
            <li key={p.id} id={p.id} className="persona">
              <div className="persona-cabecera">
                {p.foto ? (
                  <img src={ruta(p.foto)} alt="" className="persona-foto" />
                ) : (
                  <span className="persona-foto persona-iniciales" aria-hidden="true">
                    {iniciales(p.nombre)}
                  </span>
                )}
                <div>
                  <h2>{p.nombre}</h2>
                  <p className="persona-rol">{tx(p.rol)}</p>
                </div>
              </div>
              <p className="persona-bio">{tx(p.bio)}</p>
              {p.proyectos.length > 0 && (
                <div className="persona-proyectos">
                  <span>{t('equipo.proyectos')}:</span>
                  {p.proyectos.map((slug) => {
                    const proyecto = buscarProyecto(slug);
                    return proyecto ? (
                      <Link key={slug} to={`/proyectos/${slug}`} className="chip-enlace">
                        {proyecto.nombre}
                      </Link>
                    ) : null;
                  })}
                </div>
              )}
              {p.redes.length > 0 && (
                <ul className="persona-redes" aria-label={t('equipo.redes', { nombre: p.nombre })}>
                  {p.redes.map((r) => (
                    <li key={r.url}>
                      <a
                        href={r.tipo === 'correo' ? `mailto:${r.url}` : r.url}
                        target="_blank"
                        rel="noreferrer"
                        title={nombreRed(r.tipo)}
                      >
                        <IconoRed red={r.tipo} />
                        <span>{nombreRed(r.tipo)}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}

          <li className="persona persona-unete">
            <span className="persona-foto persona-hueco" aria-hidden="true">
              <Users size={26} />
            </span>
            <h2>{t('equipo.unete.titulo')}</h2>
            <p className="persona-bio">{t('equipo.unete.texto')}</p>
            <Link to="/participa/unirse" className="boton boton-primario">
              {t('unir.titulo')} <ArrowRight size={16} />
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
