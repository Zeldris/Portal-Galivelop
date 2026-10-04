import { ArrowLeft, ArrowRight, Check, CircleDashed, ExternalLink, LoaderCircle, Lock, Mail, Sparkles, Users } from 'lucide-react';
import { useEffect, useState, type CSSProperties } from 'react';
import { Link, useParams } from 'react-router-dom';
import { EtiquetaColaboracion } from '../components/Colaboracion';
import { EstadoEtiqueta } from '../components/EstadoEtiqueta';
import { Galeria } from '../components/Galeria';
import { Icono } from '../components/Icono';
import { Plegable } from '../components/Plegable';
import { buscarPersona, iniciales } from '../data/equipo';
import type { Linea } from '../data/lineas';
import { buscarProyecto, progreso, proyectos, ruta } from '../data/proyectos';
import type { EstadoHito, Proyecto as TipoProyecto } from '../data/tipos';
import { useIdioma } from '../i18n/Idioma';
import { NoEncontrado } from './NoEncontrado';

const SECCIONES = ['descripcion', 'caracteristicas', 'ficha', 'hitos', 'aprendizajes', 'decisiones', 'novedades', 'equipo'] as const;
type Seccion = (typeof SECCIONES)[number];
const ABIERTAS_AL_ENTRAR: Seccion[] = ['descripcion', 'caracteristicas'];

const ICONO_HITO: Record<EstadoHito, typeof Check> = { hecho: Check, curso: LoaderCircle, pendiente: CircleDashed };

/** Secciones con contenido en este proyecto (las vacías no se muestran). */
function seccionesDe(p: TipoProyecto): Seccion[] {
  return SECCIONES.filter((s) => p[s].length > 0);
}

export function Proyecto() {
  const { slug } = useParams();
  const p = buscarProyecto(slug);
  if (!p) return <NoEncontrado />;
  return <FichaProyecto key={p.slug} p={p} />;
}

function FichaProyecto({ p }: { p: TipoProyecto }) {
  const { t, tx, fecha } = useIdioma();
  const secciones = seccionesDe(p);
  const [abiertas, setAbiertas] = useState<Set<Seccion>>(() => new Set(ABIERTAS_AL_ENTRAR));
  const todasAbiertas = secciones.every((s) => abiertas.has(s));
  const avance = progreso(p);
  const modoCabecera = p.cabecera ?? 'ilustracion';
  const indice = proyectos.findIndex((x) => x.slug === p.slug);
  const siguiente = proyectos.length > 1 ? proyectos[(indice + 1) % proyectos.length] : undefined;

  useEffect(() => {
    document.title = `${p.nombre} · Galivelop`;
    return () => {
      document.title = 'Galivelop';
    };
  }, [p.nombre]);

  const cambiar = (s: Seccion, abierta: boolean) =>
    setAbiertas((prev) => {
      const nuevo = new Set(prev);
      if (abierta) nuevo.add(s);
      else nuevo.delete(s);
      return nuevo;
    });

  const plegable = (s: Seccion, extra?: string) => ({
    id: s,
    titulo: t(`sec.${s}`),
    abierto: abiertas.has(s),
    alCambiar: (a: boolean) => cambiar(s, a),
    extra,
  });

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
        {p.cifras.length > 0 && (
          <ul className="cifras">
            {p.cifras.map((c) => (
              <li key={c.valor + tx(c.etiqueta)}>
                <strong>{c.valor}</strong>
                <span>{tx(c.etiqueta)}</span>
              </li>
            ))}
            <li className="cifras-avance">
              <strong>{avance} %</strong>
              <span>{t('proyecto.avance')}</span>
              <span className="barra" aria-hidden="true">
                <span style={{ width: `${avance}%` }} />
              </span>
            </li>
          </ul>
        )}

        <section aria-label={t('sec.galeria')} className="proyecto-galeria">
          <Galeria imagenes={p.galeria} />
        </section>

        <div className="plegables-barra">
          <button
            type="button"
            className="boton-texto"
            onClick={() => setAbiertas(todasAbiertas ? new Set() : new Set(secciones))}
          >
            {todasAbiertas ? t('proyecto.contraer') : t('proyecto.expandir')}
          </button>
        </div>

        <div className="plegables">
          {secciones.includes('descripcion') && (
            <Plegable {...plegable('descripcion')}>
              <div className="prosa">
                {p.descripcion.map((d, i) => (
                  <p key={i}>{tx(d)}</p>
                ))}
              </div>
              <p className="proyecto-lineas">
                <span>{t('lineas.titulo')}:</span>
                {p.lineas.map((l) => (
                  <Link key={l} to="/#lineas" className="chip-enlace">
                    {t(`linea.${l as Linea}.titulo`)}
                  </Link>
                ))}
              </p>
            </Plegable>
          )}

          {secciones.includes('caracteristicas') && (
            <Plegable {...plegable('caracteristicas', String(p.caracteristicas.length))}>
              <ul className="caracteristicas">
                {p.caracteristicas.map((c) => (
                  <li key={tx(c.titulo)}>
                    <span className="caracteristica-icono">
                      <Icono nombre={c.icono} />
                    </span>
                    <h3>{tx(c.titulo)}</h3>
                    <p>{tx(c.texto)}</p>
                  </li>
                ))}
              </ul>
            </Plegable>
          )}

          {secciones.includes('ficha') && (
            <Plegable {...plegable('ficha')}>
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
            </Plegable>
          )}

          {secciones.includes('hitos') && (
            <Plegable {...plegable('hitos', `${avance} %`)}>
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
            </Plegable>
          )}

          {secciones.includes('novedades') && (
            <Plegable {...plegable('novedades', fecha(p.novedades[0].fecha))}>
              <ul className="novedades">
                {p.novedades.map((n, i) => (
                  <li key={i}>
                    <time dateTime={n.fecha}>{fecha(n.fecha)}</time>
                    <p>{tx(n.texto)}</p>
                  </li>
                ))}
              </ul>
            </Plegable>
          )}

          {secciones.includes('aprendizajes') && (
            <Plegable {...plegable('aprendizajes')}>
              <ul className="aprendizajes">
                {p.aprendizajes.map((a) => (
                  <li key={tx(a)}>
                    <Sparkles size={18} aria-hidden="true" />
                    <span>{tx(a)}</span>
                  </li>
                ))}
              </ul>
            </Plegable>
          )}

          {secciones.includes('decisiones') && (
            <Plegable {...plegable('decisiones')}>
              <ul className="decisiones">
                {p.decisiones.map((d) => (
                  <li key={tx(d.titulo)}>
                    <h3>{tx(d.titulo)}</h3>
                    <p>{tx(d.texto)}</p>
                  </li>
                ))}
              </ul>
            </Plegable>
          )}

          {secciones.includes('equipo') && (
            <Plegable {...plegable('equipo')}>
              <ul className="equipo">
                {p.equipo.map((m) => {
                  const persona = buscarPersona(m.nombre);
                  const contenido = (
                    <>
                      <span className="avatar" aria-hidden="true">
                        {iniciales(m.nombre)}
                      </span>
                      <div>
                        <p className="equipo-nombre">{m.nombre}</p>
                        <p className="equipo-rol">{tx(m.rol)}</p>
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
            </Plegable>
          )}
        </div>

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
