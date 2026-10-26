import { ArrowLeft, ChevronDown, Mail, MapPin } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { IconoRed, nombreRed } from '../components/IconoRed';
import { IconoTecnologia } from '../components/IconoTecnologia';
import {
  agruparPorLugar,
  anosDesde,
  buscarPersonaPorId,
  iniciales,
  type Etapa,
  type Lugar,
  type Perfil,
  type Persona,
} from '../data/equipo';
import { buscarProyecto, ruta } from '../data/proyectos';
import { formatearMes, useIdioma } from '../i18n/Idioma';
import { NoEncontrado } from './NoEncontrado';

const MOVIL = '(max-width: 640px)';
/** Empresas de la trayectoria que se ven en móvil antes de «Ver más». */
const LUGARES_MOVIL = 2;

/** En móvil lo largo va plegado, para que el cierre de la página no quede a diez pantallas. */
function useMovil(): boolean {
  const [movil, setMovil] = useState(() => typeof window !== 'undefined' && !!window.matchMedia?.(MOVIL).matches);
  useEffect(() => {
    const mq = window.matchMedia?.(MOVIL);
    if (!mq) return;
    const cambio = () => setMovil(mq.matches);
    // Safari < 14 solo tiene addListener/removeListener.
    if (mq.addEventListener) {
      mq.addEventListener('change', cambio);
      return () => mq.removeEventListener('change', cambio);
    }
    mq.addListener(cambio);
    return () => mq.removeListener(cambio);
  }, []);
  return movil;
}

export function Miembro() {
  const { id } = useParams();
  const persona = buscarPersonaPorId(id);
  const { t } = useIdioma();

  useEffect(() => {
    if (!persona) return;
    document.title = `${persona.nombre} · ${t('equipo.titulo')} · Galivelop`;
    return () => {
      document.title = 'Galivelop';
    };
  }, [persona, t]);

  return persona ? <Ficha p={persona} /> : <NoEncontrado />;
}

function Ficha({ p }: { p: Persona }) {
  const { t, tx } = useIdioma();
  const movil = useMovil();
  const perfil = p.perfil;
  const nombre = p.nombre.split(' ')[0];

  return (
    <section className="seccion miembro-pagina">
      <div className="contenedor">
        <Link to="/equipo" className="volver miembro-volver">
          <ArrowLeft size={16} /> {t('equipo.volver')}
        </Link>

        <header className="miembro-cabecera">
          {p.foto ? (
            <img src={ruta(p.foto)} alt="" className="miembro-foto" width={128} height={128} />
          ) : (
            <span className="miembro-foto persona-iniciales" aria-hidden="true">
              {iniciales(p.nombre)}
            </span>
          )}
          <div>
            <p className="miembro-antetitulo">{t('equipo.titulo')}</p>
            <h1>{p.nombre}</h1>
            <p className="persona-rol">{tx(p.rol)}</p>
            {(perfil?.ubicacion || perfil?.resumen) && (
              <p className="miembro-datos">
                {perfil.ubicacion && (
                  <span>
                    <MapPin size={14} aria-hidden="true" /> {tx(perfil.ubicacion)}
                  </span>
                )}
                {perfil.resumen && <span>{tx(perfil.resumen)}</span>}
              </p>
            )}
            <Cifras p={p} />
          </div>
        </header>

        <div className="miembro-rejilla">
          <div className="miembro-columna">
            <section className="miembro-caja">
              <h2>{t('equipo.sobre', { nombre })}</h2>
              <p className="persona-bio">{tx(p.bio)}</p>
            </section>

            {p.proyectos.length > 0 && (
              <section className="miembro-caja">
                <h2>{t('equipo.enGalivelop')}</h2>
                <ul className="miembro-proyectos">
                  {p.proyectos.map((slug) => {
                    const proyecto = buscarProyecto(slug);
                    const papel = p.papeles?.[slug];
                    return proyecto ? (
                      <li key={slug}>
                        <Link to={`/proyectos/${slug}`}>
                          <strong>
                            {proyecto.nombre}
                            {papel && <span className="miembro-papel"> · {t(`equipo.papel.${papel}`)}</span>}
                          </strong>
                          <span>{tx(proyecto.lema)}</span>
                        </Link>
                      </li>
                    ) : null;
                  })}
                </ul>
              </section>
            )}

            {!!perfil?.trayectoria?.length && (
              <section className="miembro-caja">
                <h2>{t('equipo.trayectoria')}</h2>
                <Etapas etapas={perfil.trayectoria} visibles={movil ? LUGARES_MOVIL : undefined} />
              </section>
            )}

            {!!perfil?.formacion?.length && (
              <Pliegue titulo={t('equipo.formacion')} plegado={movil}>
                <Etapas etapas={perfil.formacion} />
              </Pliegue>
            )}
          </div>

          <aside className="miembro-columna">
            {(!!perfil?.destacadas?.length || !!perfil?.tecnologias?.length) && (
              <section className="miembro-caja">
                <h2>{t('equipo.tecnologias')}</h2>
                {!!perfil.destacadas?.length && (
                  <ul className="miembro-destacadas">
                    {perfil.destacadas.map((x) => (
                      <li key={x}>
                        <IconoTecnologia nombre={x} />
                        {x}
                      </li>
                    ))}
                  </ul>
                )}
                {!!perfil.tecnologias?.length && <Grupos grupos={perfil.tecnologias} />}
              </section>
            )}

            {!!perfil?.idiomas?.length && (
              <Pliegue titulo={t('equipo.idiomas')} plegado={movil}>
                <ul className="perfil-idiomas">
                  {perfil.idiomas.map((i) => (
                    <li key={i.idioma.es}>
                      <strong>{tx(i.idioma)}</strong> {tx(i.nivel)}
                    </li>
                  ))}
                </ul>
              </Pliegue>
            )}

            {!!perfil?.fortalezas?.length && (
              <Pliegue titulo={t('equipo.fortalezas')} plegado={movil}>
                <ul className="perfil-fortalezas">
                  {perfil.fortalezas.map((f) => (
                    <li key={f.es}>{tx(f)}</li>
                  ))}
                </ul>
              </Pliegue>
            )}

            {p.redes.length > 0 && (
              <section className="miembro-caja">
                <h2>{t('equipo.contacto', { nombre })}</h2>
                <ul className="persona-redes miembro-redes" aria-label={t('equipo.redes', { nombre: p.nombre })}>
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
              </section>
            )}
          </aside>
        </div>

        {p.colabora && (
          <aside className="miembro-colabora">
            <div>
              <h2>{t('equipo.colabora.titulo')}</h2>
              <p>{tx(p.colabora.texto)}</p>
              <p className="miembro-colabora-nota">{t('equipo.colabora.nota')}</p>
            </div>
            <a
              className="boton boton-secundario"
              href={`mailto:${p.colabora.correo}?subject=${encodeURIComponent(t('equipo.colabora.asunto', { nombre: p.nombre }))}`}
            >
              <Mail size={16} /> {t('equipo.colabora.boton', { nombre })}
            </a>
          </aside>
        )}
      </div>
    </section>
  );
}

/** Una caja con título; en móvil, plegada (el título abre y cierra). */
function Pliegue({ titulo, plegado, children }: { titulo: string; plegado: boolean; children: ReactNode }) {
  if (!plegado) {
    return (
      <section className="miembro-caja">
        <h2>{titulo}</h2>
        {children}
      </section>
    );
  }
  return (
    <details className="miembro-caja miembro-pliegue">
      <summary>
        <h2>{titulo}</h2>
        <ChevronDown size={18} aria-hidden="true" />
      </summary>
      {children}
    </details>
  );
}

function Grupos({ grupos }: { grupos: NonNullable<Perfil['tecnologias']> }) {
  const { tx } = useIdioma();
  return (
    <dl className="perfil-tecnologias">
      {grupos.map((g) => (
        <div key={g.grupo.es}>
          <dt>{tx(g.grupo)}</dt>
          <dd>
            <ul>
              {g.lista.map((x) => (
                <li key={x}>
                  <IconoTecnologia nombre={x} />
                  {x}
                </li>
              ))}
            </ul>
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Unas cifras de un vistazo, sacadas de los datos: solo las que pasan de uno. */
function Cifras({ p }: { p: Persona }) {
  const { t } = useIdioma();
  const trayectoria = p.perfil?.trayectoria ?? [];
  const cifras = [
    { n: anosDesde(trayectoria), clave: 'equipo.cifra.anos' as const },
    { n: new Set(trayectoria.map((e) => e.lugar)).size, clave: 'equipo.cifra.empresas' as const },
    { n: p.proyectos.length, clave: 'equipo.cifra.proyectos' as const },
  ].filter((c) => c.n > 1);
  if (!cifras.length) return null;
  return (
    <ul className="miembro-cifras">
      {cifras.map((c) => (
        <li key={c.clave}>
          <strong>{c.n}</strong> {t(c.clave)}
        </li>
      ))}
    </ul>
  );
}

/** Trayectoria o formación por empresa o centro; con `visibles`, el resto queda tras «Ver {n} más». */
function Etapas({ etapas, visibles }: { etapas: Etapa[]; visibles?: number }) {
  const lugares = agruparPorLugar(etapas);
  const corte = visibles !== undefined && lugares.length > visibles + 1 ? visibles : lugares.length;
  const { t } = useIdioma();
  const resto = lugares.slice(corte);
  return (
    <>
      <ListaLugares lugares={lugares.slice(0, corte)} />
      {resto.length > 0 && (
        <details className="miembro-mas">
          <summary>
            {t('equipo.verMas', { n: resto.length })} <ChevronDown size={16} aria-hidden="true" />
          </summary>
          <ListaLugares lugares={resto} />
        </details>
      )}
    </>
  );
}

function ListaLugares({ lugares }: { lugares: Lugar[] }) {
  const { t, tx, idioma } = useIdioma();
  return (
    <ol className="perfil-lugares">
      {lugares.map((l) => (
        <li
          key={`${l.lugar}-${l.etapas[0].desde}`}
          className={l.etapas.some((e) => !e.hasta) ? 'perfil-lugar-actual' : undefined}
        >
          {l.logo ? (
            <img src={ruta(l.logo)} alt="" className="perfil-logo" width={44} height={44} loading="lazy" />
          ) : (
            <span className="perfil-logo" aria-hidden="true">
              {iniciales(l.lugar)}
            </span>
          )}
          <div>
            <h3>{l.lugar}</h3>
            <ol className={l.etapas.length > 1 ? 'perfil-etapas perfil-etapas-varias' : 'perfil-etapas'}>
              {l.etapas.map((e) => (
                <li key={e.desde} className={e.hasta ? undefined : 'perfil-etapa-actual'}>
                  <strong>{tx(e.titulo)}</strong>
                  <span className="perfil-fechas">
                    {formatearMes(e.desde, idioma)} –{' '}
                    {e.hasta ? formatearMes(e.hasta, idioma) : t('equipo.actualidad')}
                  </span>
                  {e.descripcion && <p>{tx(e.descripcion)}</p>}
                </li>
              ))}
            </ol>
          </div>
        </li>
      ))}
    </ol>
  );
}
