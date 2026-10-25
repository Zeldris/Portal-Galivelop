import { ArrowLeft, ArrowRight, Check, CircleDashed, ExternalLink, LoaderCircle, Lock, Mail, Sparkles, Users } from 'lucide-react';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Apartados } from '../components/Apartados';
import { EtiquetaColaboracion } from '../components/Colaboracion';
import { EstadoEtiqueta } from '../components/EstadoEtiqueta';
import { Galeria } from '../components/Galeria';
import { Icono } from '../components/Icono';
import { buscarPersona, iniciales } from '../data/equipo';
import type { Linea } from '../data/lineas';
import { buscarProyecto, progreso, proyectos, ruta } from '../data/proyectos';
import type { EstadoHito, Proyecto as TipoProyecto } from '../data/tipos';
import { useIdioma } from '../i18n/Idioma';
import { NoEncontrado } from './NoEncontrado';

// La ficha se lee de arriba abajo en cinco grupos, como un caso de estudio: qué es y qué lo hace distinto
// (resumen), cómo se ve (galería), su mundo o su metodología (a fondo, los apartados propios), cómo está hecho y en
// qué punto está. Arriba, «De un vistazo» adelanta lo que más se busca: la fase, el avance y lo último.
type Grupo = 'resumen' | 'galeria' | 'afondo' | 'tecnica' | 'avance';
const NOVEDADES_VISIBLES = 3;

const ICONO_HITO: Record<EstadoHito, typeof Check> = { hecho: Check, curso: LoaderCircle, pendiente: CircleDashed };

/** Grupos con contenido en este proyecto (los vacíos no se muestran). */
function gruposDe(p: TipoProyecto): Grupo[] {
  const hay: Record<Grupo, boolean> = {
    resumen: true,
    galeria: p.capturas.length + p.galeria.length > 0,
    afondo: p.apartados.length > 0,
    tecnica: p.ficha.length + p.aprendizajes.length + p.decisiones.length > 0,
    avance: p.hitos.length + p.novedades.length + p.equipo.length > 0,
  };
  return (Object.keys(hay) as Grupo[]).filter((g) => hay[g]);
}

/** Barra fija con los grupos de la ficha; marca el que se está leyendo. */
function NavFicha({ grupos }: { grupos: { id: Grupo; titulo: string }[] }) {
  const { t } = useIdioma();
  const [activo, setActivo] = useState<Grupo>(grupos[0].id);
  const barra = useRef<HTMLElement>(null);

  useEffect(() => {
    // Activo: el último grupo cuyo inicio ya ha pasado la franja de arriba de la pantalla.
    const actualizar = () => {
      const limite = 160;
      let elegido = grupos[0].id;
      for (const g of grupos) {
        const el = document.getElementById(g.id);
        if (el && el.getBoundingClientRect().top <= limite) elegido = g.id;
      }
      setActivo(elegido);
    };
    actualizar();
    window.addEventListener('scroll', actualizar, { passive: true });
    window.addEventListener('resize', actualizar);
    return () => {
      window.removeEventListener('scroll', actualizar);
      window.removeEventListener('resize', actualizar);
    };
  }, [grupos]);

  // En móvil la barra se desliza de lado: el grupo activo queda siempre a la vista.
  useEffect(() => {
    const caja = barra.current;
    const boton = caja?.querySelector<HTMLElement>('[aria-current="true"]');
    if (caja && boton) caja.scrollTo({ left: boton.offsetLeft - 16, behavior: 'smooth' });
  }, [activo]);

  return (
    <nav className="nav-ficha" aria-label={t('proyecto.indice')} ref={barra}>
      {grupos.map((g) => (
        <a key={g.id} href={`#${g.id}`} aria-current={activo === g.id ? 'true' : undefined}>
          {g.titulo}
        </a>
      ))}
    </nav>
  );
}

export function Proyecto() {
  const { slug } = useParams();
  const p = buscarProyecto(slug);
  if (!p) return <NoEncontrado />;
  return <FichaProyecto key={p.slug} p={p} />;
}

function FichaProyecto({ p }: { p: TipoProyecto }) {
  const { t, tx, fecha } = useIdioma();
  const grupos = gruposDe(p);
  const [todasNovedades, setTodasNovedades] = useState(false);
  const avance = progreso(p);
  const hechos = p.hitos.filter((h) => h.estado === 'hecho').length;
  const proximo = p.hitos.find((h) => h.estado === 'curso') ?? p.hitos.find((h) => h.estado === 'pendiente');
  const ultima = p.novedades[0];
  const modoCabecera = p.cabecera ?? 'ilustracion';
  const indice = proyectos.findIndex((x) => x.slug === p.slug);
  const siguiente = proyectos.length > 1 ? proyectos[(indice + 1) % proyectos.length] : undefined;

  useEffect(() => {
    document.title = `${p.nombre} · Galivelop`;
    return () => {
      document.title = 'Galivelop';
    };
  }, [p.nombre]);

  /** «Ver las N novedades»: las despliega todas antes de bajar hasta ellas. */
  const verNovedades = () => setTodasNovedades(true);

  return (
    <article className="proyecto" style={{ '--acento-proyecto': p.acento } as CSSProperties}>
      <header className={`proyecto-cabecera cabecera-${modoCabecera}`}>
        {modoCabecera === 'ilustracion' && <img className="proyecto-fondo" src={ruta(p.portada.src)} alt="" />}
        <div className="contenedor proyecto-cabecera-contenido">
          <div className="proyecto-cabecera-texto">
            <Link to="/#proyectos" className="volver">
              <ArrowLeft size={16} /> {t('proyecto.volver')}
            </Link>
            <p className="tarjeta-categoria">{tx(p.categoria)}</p>
            <h1>
              {p.icono && <img src={ruta(p.icono)} alt="" className="proyecto-icono" />}
              {p.nombre}
            </h1>
            <p className="proyecto-lema">{tx(p.lema)}</p>
            <div className="proyecto-meta">
              <EstadoEtiqueta estado={p.estado} />
              <EtiquetaColaboracion colaboracion={p.colaboracion} />
              <span className="proyecto-fase">{tx(p.fase)}</span>
            </div>
            <div className="proyecto-acciones">
              {p.enlaces.length > 0 ? (
                p.enlaces.map((e) => (
                  <a key={e.url} className="boton boton-primario" href={e.url} target="_blank" rel="noreferrer">
                    {tx(e.etiqueta)} <ExternalLink size={16} />
                  </a>
                ))
              ) : (
                <span className="sin-enlace">
                  <Lock size={16} /> {t('proyecto.sinEnlace')}
                </span>
              )}
              {p.contacto && (
                <a className="boton boton-cristal" href={`mailto:${p.contacto}`}>
                  <Mail size={16} /> {t('proyecto.contactar')}
                </a>
              )}
            </div>
          </div>
          {modoCabecera === 'captura' && (
            <figure className="ventana" aria-hidden="true">
              <span className="ventana-barra">
                <i />
                <i />
                <i />
              </span>
              <img src={ruta(p.portada.src)} alt="" />
            </figure>
          )}
        </div>
      </header>

      <div className="contenedor proyecto-cuerpo">
        <section className="vistazo" aria-label={t('vistazo.titulo')}>
          <div className="vistazo-ahora">
            <p className="vistazo-etiqueta">{t('vistazo.ahora')}</p>
            <p className="vistazo-fase">{tx(p.fase)}</p>
            <div className="vistazo-avance">
              <span
                className="barra"
                role="progressbar"
                aria-label={t('proyecto.avance')}
                aria-valuenow={avance}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <span style={{ width: `${avance}%` }} />
              </span>
              <strong>{avance} %</strong>
            </div>
            {p.hitos.length > 0 && (
              <p className="vistazo-nota">{t('vistazo.hitos', { hechos: hechos, total: p.hitos.length })}</p>
            )}
            {proximo && (
              <p className="vistazo-proximo">
                <span>{t('vistazo.siguiente')}</span>
                <strong>
                  {proximo.version && <span className="hito-version">{proximo.version}</span>}
                  {tx(proximo.nombre)}
                </strong>
              </p>
            )}
          </div>
          {ultima && (
            <div className="vistazo-novedad">
              <p className="vistazo-etiqueta">
                {t('vistazo.ultima')} · <time dateTime={ultima.fecha}>{fecha(ultima.fecha)}</time>
              </p>
              <p className="vistazo-texto">{tx(ultima.texto)}</p>
              {p.novedades.length > 1 && (
                <a href="#novedades" className="vistazo-mas" onClick={verNovedades}>
                  {t('novedades.todas', { n: p.novedades.length })} <ArrowRight size={15} aria-hidden="true" />
                </a>
              )}
            </div>
          )}
          {p.cifras.length > 0 && (
            <ul className="cifras">
              {p.cifras.map((c) => (
                <li key={c.valor + tx(c.etiqueta)}>
                  <strong>{c.valor}</strong>
                  <span>{tx(c.etiqueta)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <NavFicha grupos={grupos.map((g) => ({ id: g, titulo: g === 'galeria' ? t('sec.galeria') : t(`grupo.${g}`) }))} />

        <section id="resumen" className="grupo" aria-labelledby="titulo-resumen">
          <h2 id="titulo-resumen" className="grupo-titulo">{t('grupo.resumen')}</h2>
          {p.descripcion.length > 0 && (
            <div id="descripcion" className="bloque">
              <div className="prosa">
                {p.descripcion.map((d, i) => (
                  <p key={i}>{tx(d)}</p>
                ))}
              </div>
              {p.lineas.length > 0 && (
                <p className="proyecto-lineas">
                  <span>{t('lineas.titulo')}:</span>
                  {p.lineas.map((l) => (
                    <Link key={l} to="/#lineas" className="chip-enlace">
                      {t(`linea.${l as Linea}.titulo`)}
                    </Link>
                  ))}
                </p>
              )}
            </div>
          )}
          {p.caracteristicas.length > 0 && (
            <div id="caracteristicas" className="bloque">
              <h3 className="bloque-titulo">{t('sec.caracteristicas')}</h3>
              <ul className="caracteristicas">
                {p.caracteristicas.map((c) => (
                  <li key={tx(c.titulo)}>
                    <span className="caracteristica-icono">
                      <Icono nombre={c.icono} />
                    </span>
                    <h4>{tx(c.titulo)}</h4>
                    <p>{tx(c.texto)}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {p.pasos.length > 0 && (
            <div id="pasos" className="bloque">
              <h3 className="bloque-titulo">{t('sec.pasos')}</h3>
              <ol className="pasos-ficha">
                {p.pasos.map((paso) => (
                  <li key={tx(paso.titulo)}>
                    <h4>{tx(paso.titulo)}</h4>
                    <p>{tx(paso.texto)}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </section>

        {grupos.includes('galeria') && (
          <section id="galeria" className="grupo" aria-labelledby="titulo-galeria">
            <h2 id="titulo-galeria" className="grupo-titulo">{t('sec.galeria')}</h2>
            <Galeria
              grupos={[
                { id: 'capturas', etiqueta: t('galeria.grupo.capturas'), imagenes: p.capturas },
                { id: 'arte', etiqueta: t('galeria.grupo.arte'), imagenes: p.galeria },
              ]}
            />
          </section>
        )}

        {grupos.includes('afondo') && (
          <section id="afondo" className="grupo" aria-labelledby="titulo-afondo">
            <h2 id="titulo-afondo" className="grupo-titulo">{t('grupo.afondo')}</h2>
            <p className="grupo-texto">{t('afondo.texto')}</p>
            <Apartados apartados={p.apartados} />
          </section>
        )}

        {grupos.includes('tecnica') && (
          <section id="tecnica" className="grupo" aria-labelledby="titulo-tecnica">
            <h2 id="titulo-tecnica" className="grupo-titulo">{t('grupo.tecnica')}</h2>
            <div className="grupo-columnas">
              {p.ficha.length > 0 && (
                <div id="ficha" className="bloque">
                  <h3 className="bloque-titulo">{t('sec.ficha')}</h3>
                  <dl className="ficha">
                    {p.ficha.map((f) => (
                      <div key={tx(f.capa)}>
                        <dt>{tx(f.capa)}</dt>
                        <dd>
                          <ul className="chips">
                            {f.tecnologias.map((tec) => (
                              <li key={tec}>{tec}</li>
                            ))}
                          </ul>
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
              {p.aprendizajes.length > 0 && (
                <div id="aprendizajes" className="bloque">
                  <h3 className="bloque-titulo">{t('sec.aprendizajes')}</h3>
                  <ul className="aprendizajes">
                    {p.aprendizajes.map((a) => (
                      <li key={tx(a)}>
                        <Sparkles size={18} aria-hidden="true" />
                        <span>{tx(a)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {p.decisiones.length > 0 && (
              <div id="decisiones" className="bloque">
                <h3 className="bloque-titulo">{t('sec.decisiones')}</h3>
                <ul className="decisiones">
                  {p.decisiones.map((d) => (
                    <li key={tx(d.titulo)}>
                      <h4>{tx(d.titulo)}</h4>
                      <p>{tx(d.texto)}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {grupos.includes('avance') && (
          <section id="avance" className="grupo" aria-labelledby="titulo-avance">
            <h2 id="titulo-avance" className="grupo-titulo">{t('grupo.avance')}</h2>
            <div className="grupo-columnas">
              {p.hitos.length > 0 && (
                <div id="hitos" className="bloque">
                  <h3 className="bloque-titulo">
                    {t('sec.hitos')} <span className="bloque-extra">{avance} %</span>
                  </h3>
                  <ol className="hitos">
                    {p.hitos.map((h) => {
                      const IconoHito = ICONO_HITO[h.estado];
                      return (
                        <li key={(h.version ?? '') + tx(h.nombre)} className={`hito hito-${h.estado}`}>
                          <span className="hito-marca" aria-hidden="true">
                            <IconoHito size={16} />
                          </span>
                          <div>
                            <p className="hito-titulo">
                              {h.version && <span className="hito-version">{h.version}</span>}
                              {tx(h.nombre)}
                              <span className="hito-estado">{t(`hito.${h.estado}`)}</span>
                            </p>
                            {h.detalle && <p className="hito-detalle">{tx(h.detalle)}</p>}
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              )}
              {p.novedades.length > 0 && (
                <div id="novedades" className="bloque">
                  <h3 className="bloque-titulo">{t('sec.novedades')}</h3>
                  <ul className="novedades">
                    {(todasNovedades ? p.novedades : p.novedades.slice(0, NOVEDADES_VISIBLES)).map((n, i) => (
                      <li key={i}>
                        <time dateTime={n.fecha}>{fecha(n.fecha)}</time>
                        <p>{tx(n.texto)}</p>
                      </li>
                    ))}
                  </ul>
                  {p.novedades.length > NOVEDADES_VISIBLES && (
                    <button type="button" className="boton-texto" aria-expanded={todasNovedades} onClick={() => setTodasNovedades((v) => !v)}>
                      {todasNovedades ? t('novedades.menos') : t('novedades.todas', { n: p.novedades.length })}
                    </button>
                  )}
                </div>
              )}
            </div>
            {p.equipo.length > 0 && (
              <div id="equipo" className="bloque">
                <h3 className="bloque-titulo">{t('sec.equipo')}</h3>
                <ul className="equipo">
                  {p.equipo.map((m) => {
                    const persona = buscarPersona(m.nombre);
                    const perfil = persona?.perfil;
                    const contenido = (
                      <>
                        {persona?.foto ? (
                          <img src={ruta(persona.foto)} alt="" className="avatar" width={44} height={44} loading="lazy" />
                        ) : (
                          <span className="avatar" aria-hidden="true">
                            {iniciales(m.nombre)}
                          </span>
                        )}
                        <div>
                          <p className="equipo-nombre">{m.nombre}</p>
                          <p className="equipo-rol">{tx(m.rol)}</p>
                          {perfil?.resumen && <p className="equipo-resumen">{tx(perfil.resumen)}</p>}
                          {!!perfil?.destacadas?.length && (
                            <ul className="equipo-destacadas">
                              {perfil.destacadas.map((x) => (
                                <li key={x}>{x}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </>
                    );
                    return (
                      <li key={m.nombre}>
                        {persona ? (
                          <Link to={`/equipo#${persona.id}`} className="equipo-enlace" title={t('equipo.ver')}>
                            {contenido}
                          </Link>
                        ) : (
                          contenido
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </section>
        )}

        <aside className={`participar participar-${p.colaboracion}`}>
          <span className="participar-icono" aria-hidden="true">
            {p.colaboracion === 'abierta' ? <Users size={24} /> : <Lock size={24} />}
          </span>
          <div>
            <h2>{t(`participa.${p.colaboracion}.titulo`, { nombre: p.nombre })}</h2>
            <p>{t(`participa.${p.colaboracion}.texto`)}</p>
          </div>
          <Link
            className="boton boton-primario"
            to={p.colaboracion === 'abierta' ? `/participa/unirse?proyecto=${p.slug}` : '/participa/proponer'}
          >
            <Mail size={16} /> {t(`participa.${p.colaboracion}.boton`)}
          </Link>
        </aside>

        <footer className="proyecto-pie">
          <p>
            {t('proyecto.actualizado')} <time dateTime={p.actualizado}>{fecha(p.actualizado)}</time>
          </p>
          {siguiente && (
            <Link to={`/proyectos/${siguiente.slug}`} className="siguiente">
              {siguiente.nombre} <ArrowRight size={16} />
            </Link>
          )}
        </footer>
      </div>
    </article>
  );
}
