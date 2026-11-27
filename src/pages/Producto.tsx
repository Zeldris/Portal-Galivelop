import { ArrowDown, Check, Copy, Mail } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { buscarPersonaPorId } from '../data/equipo';
import { MARCA, SIZES_PORTADA_PRODUCTO, srcsetPortadaProducto } from '../data/marca';
import {
  buscarProducto,
  correoDeProducto,
  type PaginaProducto,
  type Producto as TipoProducto,
} from '../data/productos';
import { ImagenTema } from '../components/ImagenTema';
import { ruta } from '../data/proyectos';
import { estiloAcento } from '../data/tonos';
import { useIdioma } from '../i18n/Idioma';
import { NoEncontrado } from './NoEncontrado';

/** Página de un producto, `/productos/<slug>` (ADR 0005). Un producto sin `pagina` solo sale en el perfil: aquí es un 404. */
export function Producto() {
  const { slug } = useParams();
  const producto = buscarProducto(slug);
  const pagina = producto?.pagina;
  const { tx } = useIdioma();

  useEffect(() => {
    if (!producto || !pagina) return;
    const alias = producto.alias ? ` (${producto.alias})` : '';
    document.title = `${producto.nombre}${alias} · ${tx(pagina.seo.titulo)} · Galivelop`;
    return () => {
      document.title = 'Galivelop';
    };
  }, [producto, pagina, tx]);

  return producto && pagina ? <Pagina p={producto} pagina={pagina} /> : <NoEncontrado />;
}

function Pagina({ p, pagina }: { p: TipoProducto; pagina: PaginaProducto }) {
  const { t, tx } = useIdioma();
  const [copiado, setCopiado] = useState(false);
  const [falloCopia, setFalloCopia] = useState(false);
  // Hasta que el observador diga otra cosa, el botón de la cabecera está a la vista.
  const [botonALaVista, setBotonALaVista] = useState(true);
  const botones = useRef<HTMLDivElement>(null);
  const contacto = useRef<HTMLElement>(null);
  const responsable = buscarPersonaPorId(p.responsable);
  const correo = correoDeProducto(MARCA.correo, t('productos.asunto', { producto: p.nombre }));

  // El botón fijo del móvil sobra mientras haya otro igual en pantalla: el de la cabecera o el del bloque de contacto.
  useEffect(() => {
    const vigilados = [botones.current, contacto.current].filter((e) => e !== null);
    if (vigilados.length === 0 || typeof IntersectionObserver === 'undefined') return;
    const visibles = new Set<Element>();
    const ojo = new IntersectionObserver((entradas) => {
      for (const e of entradas) {
        if (e.isIntersecting) visibles.add(e.target);
        else visibles.delete(e.target);
      }
      setBotonALaVista(visibles.size > 0);
    });
    for (const e of vigilados) ojo.observe(e);
    return () => ojo.disconnect();
  }, []);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(MARCA.correo);
      setCopiado(true);
      setFalloCopia(false);
    } catch {
      setCopiado(false);
      setFalloCopia(true);
    }
  };

  const botonContacto = (
    <a className="boton boton-primario" href={correo}>
      <Mail size={16} /> {t('producto.interesa')}
    </a>
  );

  return (
    <div className="producto-pagina" style={estiloAcento(p.acento)}>
      <section
        className={`contenedor producto-cabeza${pagina.portada ? '' : ' producto-cabeza-sola'}`}
        data-guion="cabecera"
      >
        <div className="producto-cabeza-texto">
          <p className="antetitulo">
            {t('producto.etiqueta')}
            {p.estado === 'proximamente' && <> · {t('proximamente.titulo')}</>}
          </p>
          <h1>{p.nombre}</h1>
          {p.alias && (
            <p className="producto-alias">
              <span>{t('producto.alias')}</span> {p.alias}
            </p>
          )}
          <p className="producto-lema">
            {pagina.lema.map((renglon, i) => (
              <span key={i} className="destacado">
                {tx(renglon)}
              </span>
            ))}
          </p>
          <p className="producto-entrada">{tx(pagina.entrada)}</p>
          <div className="producto-botones" ref={botones}>
            {botonContacto}
            <a className="enlace-flecha" href="#como">
              {t('producto.como')} <ArrowDown size={14} />
            </a>
          </div>
        </div>
        {pagina.portada && (
          <img
            className="producto-portada"
            src={ruta(pagina.portada.src)}
            srcSet={srcsetPortadaProducto(pagina.portada, ruta)}
            sizes={SIZES_PORTADA_PRODUCTO}
            width={pagina.portada.ancho}
            height={pagina.portada.alto}
            alt={tx(pagina.portada.alt)}
            fetchPriority="high"
          />
        )}
      </section>

      {pagina.problema && (
        <section className="contenedor producto-bloque" data-guion="problema">
          <div className="producto-problema">
            <h2 className="producto-titulo">{tx(pagina.problema.titulo)}</h2>
            <p>{tx(pagina.problema.texto)}</p>
          </div>
        </section>
      )}

      {pagina.beneficios && (
        <section className="seccion-alterna producto-franja" data-guion="beneficios">
          <div className="contenedor">
            <h2 className="producto-titulo">{tx(pagina.beneficios.titulo)}</h2>
            <div className="producto-beneficios">
              {pagina.beneficios.items.map((b, i) => (
                <article key={i} className="producto-garantia" data-guion={`beneficio-${i + 1}`}>
                  <h3>{tx(b.titulo)}</h3>
                  <p>{tx(b.texto)}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="contenedor producto-bloque" id="como">
        <h2 className="producto-titulo">{tx(pagina.pasosTitulo)}</h2>
        <ol className="producto-pasos">
          {pagina.pasos.map((paso, i) => (
            <li key={i} data-guion={`paso-${i + 1}`}>
              <span className="producto-paso-num" aria-hidden="true">
                {i + 1}
              </span>
              <div>
                <strong>{tx(paso.titulo)}</strong>
                <span>{tx(paso.texto)}</span>
              </div>
            </li>
          ))}
        </ol>
        {pagina.figuras && pagina.figuras.length > 0 && (
          <div className="producto-figuras">
            {pagina.figuras.map((f, i) => (
              <figure key={i} className="producto-figura">
                <ImagenTema
                  className="producto-figura-imagen"
                  claro={f.src}
                  oscuro={f.srcOscuro}
                  srcSets={{
                    claro: `${ruta(f.mini)} 720w, ${ruta(f.src)} ${f.ancho}w`,
                    oscuro: `${ruta(f.miniOscuro)} 720w, ${ruta(f.srcOscuro)} ${f.ancho}w`,
                  }}
                  sizes="(min-width: 1100px) 1100px, 100vw"
                  width={f.ancho}
                  height={f.alto}
                  alt={tx(f.alt)}
                />
                {f.pie && <figcaption>{tx(f.pie)}</figcaption>}
              </figure>
            ))}
          </div>
        )}
      </section>

      <section className="seccion-alterna producto-franja" data-guion="fiarse">
        <div className="contenedor">
          <h2 className="producto-titulo">{tx(pagina.garantiasTitulo)}</h2>
          <div className="producto-garantias">
            {pagina.garantias.map((g, i) => (
              <article key={i} className="producto-garantia" data-guion={`garantia-${i + 1}`}>
                <h3>{tx(g.titulo)}</h3>
                <p>{tx(g.texto)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {pagina.paraQuien && (
        <section className="contenedor producto-bloque" data-guion="para-quien">
          <h2 className="producto-titulo">{tx(pagina.paraQuien.titulo)}</h2>
          <ul className="producto-paraquien">
            {pagina.paraQuien.items.map((item, i) => (
              <li key={i}>{tx(item)}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="hero producto-contacto" data-guion="contacto" ref={contacto}>
        <img className="hero-fondo" src={ruta('/marca/isobatas.svg')} alt="" aria-hidden="true" />
        <div className="contenedor producto-contacto-dentro">
          <h2>{tx(pagina.contacto.titulo)}</h2>
          {pagina.estadoTexto && <p className="producto-estado">{tx(pagina.estadoTexto)}</p>}
          <p className="producto-contacto-texto">{tx(pagina.contacto.texto)}</p>
          {botonContacto}
          <p className="producto-correo">
            <span className="producto-correo-rotulo">
              {t('producto.correo', { nombre: (responsable?.nombre ?? 'Galivelop').split(' ')[0] })}
            </span>
            <span className="producto-correo-direccion">{MARCA.correo}</span>
            <button type="button" className="producto-copiar" onClick={copiar}>
              {copiado ? <Check size={13} /> : <Copy size={13} />}{' '}
              {copiado ? t('form.copiado') : t('producto.copiar')}
            </button>
          </p>
          <p className="producto-copia-fallo" role="status">
            {falloCopia ? t('producto.copiarError') : ''}
          </p>
        </div>
      </section>

      <section className="contenedor producto-bloque producto-estrecho">
        {pagina.requisitos.items.length > 0 && (
          <details className="producto-plegable" data-guion="requisitos">
            <summary>
              <span className="producto-plegable-ante">{t('producto.requisitos.ante')}</span>
              <span className="producto-plegable-titulo">{t('producto.requisitos.titulo')}</span>
            </summary>
            <div className="producto-plegable-cuerpo">
              {pagina.requisitos.intro && (
                <p className="producto-papeles-texto">{tx(pagina.requisitos.intro)}</p>
              )}
              <dl className="producto-datos">
                {pagina.requisitos.items.map((d, i) => (
                  <div key={i}>
                    <dt>{tx(d.etiqueta)}</dt>
                    <dd>{d.codigo ? <code>{tx(d.valor)}</code> : tx(d.valor)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </details>
        )}
        <details className="producto-plegable" data-guion="tecnico">
          <summary>
            <span className="producto-plegable-ante">{t('producto.tecnico.ante')}</span>
            <span className="producto-plegable-titulo">{t('producto.tecnico.titulo')}</span>
          </summary>
          <div className="producto-plegable-cuerpo">
            {pagina.tecnico.papeles && pagina.tecnico.papeles.length > 0 && (
              <>
                <h3>{t('producto.papeles')}</h3>
                <ul className="producto-papeles">
                  {pagina.tecnico.papeles.map((papel, i) => (
                    <li key={i}>
                      <span>
                        {t('producto.papel')} {i + 1}
                      </span>
                      <strong>{tx(papel)}</strong>
                    </li>
                  ))}
                </ul>
                {pagina.tecnico.papelesTexto && (
                  <p className="producto-papeles-texto">{tx(pagina.tecnico.papelesTexto)}</p>
                )}
              </>
            )}
            <dl className="producto-datos">
              {pagina.tecnico.datos.map((d, i) => (
                <div key={i}>
                  <dt>{tx(d.etiqueta)}</dt>
                  <dd>{d.codigo ? <code>{tx(d.valor)}</code> : tx(d.valor)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </details>
      </section>

      <div className="producto-fijo" hidden={botonALaVista}>
        {botonContacto}
      </div>
    </div>
  );
}
