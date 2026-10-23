import { ArrowRight, MapPin, Users } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IconoRed, nombreRed } from '../components/IconoRed';
import { equipo, iniciales, tienePerfilAmpliado, type Etapa, type Perfil } from '../data/equipo';
import { buscarProyecto, ruta } from '../data/proyectos';
import { formatearMes, useIdioma } from '../i18n/Idioma';

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
            <li key={p.id} id={p.id} className={tienePerfilAmpliado(p) ? 'persona persona-amplia' : 'persona'}>
              <div className="persona-cabecera">
                {p.foto ? (
                  <img src={ruta(p.foto)} alt="" className="persona-foto" width={88} height={88} />
                ) : (
                  <span className="persona-foto persona-iniciales" aria-hidden="true">
                    {iniciales(p.nombre)}
                  </span>
                )}
                <div>
                  <h2>{p.nombre}</h2>
                  <p className="persona-rol">{tx(p.rol)}</p>
                  {p.perfil?.ubicacion && (
                    <p className="persona-ubicacion">
                      <MapPin size={14} aria-hidden="true" /> {tx(p.perfil.ubicacion)}
                    </p>
                  )}
                </div>
              </div>
              <p className="persona-bio">{tx(p.bio)}</p>
              {p.perfil && tienePerfilAmpliado(p) && <PerfilAmpliado perfil={p.perfil} />}
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

function PerfilAmpliado({ perfil }: { perfil: Perfil }) {
  const { t, tx } = useIdioma();
  return (
    <div className="perfil">
      <div className="perfil-columna">
        {!!perfil.trayectoria?.length && <Etapas titulo={t('equipo.trayectoria')} etapas={perfil.trayectoria} />}
        {!!perfil.formacion?.length && <Etapas titulo={t('equipo.formacion')} etapas={perfil.formacion} />}
      </div>
      <div className="perfil-columna">
        {!!perfil.tecnologias?.length && (
          <section>
            <h3>{t('equipo.tecnologias')}</h3>
            <dl className="perfil-tecnologias">
              {perfil.tecnologias.map((g) => (
                <div key={g.grupo.es}>
                  <dt>{tx(g.grupo)}</dt>
                  <dd>
                    <ul>
                      {g.lista.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}
        {!!perfil.idiomas?.length && (
          <section>
            <h3>{t('equipo.idiomas')}</h3>
            <ul className="perfil-idiomas">
              {perfil.idiomas.map((i) => (
                <li key={i.idioma.es}>
                  <strong>{tx(i.idioma)}</strong> {tx(i.nivel)}
                </li>
              ))}
            </ul>
          </section>
        )}
        {!!perfil.fortalezas?.length && (
          <section>
            <h3>{t('equipo.fortalezas')}</h3>
            <ul className="perfil-fortalezas">
              {perfil.fortalezas.map((f) => (
                <li key={f.es}>{tx(f)}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}

function Etapas({ titulo, etapas }: { titulo: string; etapas: Etapa[] }) {
  const { t, tx, idioma } = useIdioma();
  return (
    <section>
      <h3>{titulo}</h3>
      <ol className="perfil-etapas">
        {etapas.map((e) => (
          <li key={`${e.lugar}-${e.desde}`} className={e.hasta ? undefined : 'perfil-etapa-actual'}>
            <strong>{tx(e.titulo)}</strong>
            <span>{e.lugar}</span>
            <span className="perfil-fechas">
              {formatearMes(e.desde, idioma)} – {e.hasta ? formatearMes(e.hasta, idioma) : t('equipo.actualidad')}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
