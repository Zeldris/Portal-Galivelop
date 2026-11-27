import { lazy, Suspense, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Link } from '../components/Enlace';
import {
  buscarEntrada,
  entradas,
  minutosLectura,
  tipoDe,
  type Bloque,
  type EntradaDiario as Entrada,
  type ImagenDiario,
} from '../data/diario';
import { buscarPersonaPorId } from '../data/equipo';
import { buscarProyecto, ruta, useFicha } from '../data/proyectos';
import { useIdioma } from '../i18n/Idioma';
import { leerAncla } from '../utils/ancla';
import { conCodigo } from '../utils/codigo';
import { NoEncontrado } from '../paginas';

/** Las animaciones paso a paso van en su propio trozo, fuera del resto de la página (como en la ficha). */
const AnimacionFlujo = lazy(() => import('../components/AnimacionFlujo'));

/** Una animación de una ficha, quieta en su paso 1: reproducirla es opcional (Q-40). */
function Animacion({ bloque }: { bloque: Extract<Bloque, { tipo: 'animacion' }> }) {
  const { t, tx } = useIdioma();
  const estado = useFicha(bloque.proyecto);
  const animacion =
    estado.estado === 'listo'
      ? estado.ficha.animaciones?.find((a) => a.id === bloque.id)
      : undefined;
  return (
    <figure className="diario-figura">
      {animacion ? (
        <ErrorBoundary reserva={null}>
          <Suspense
            fallback={
              <p className="flujo-cargando" role="status">
                {t('flujo.cargando')}
              </p>
            }
          >
            <AnimacionFlujo animaciones={[animacion]} recordar={false} />
          </Suspense>
        </ErrorBoundary>
      ) : estado.estado === 'cargando' ? (
        <p className="flujo-cargando" role="status">
          {t('flujo.cargando')}
        </p>
      ) : null}
      <figcaption>{tx(bloque.pie)}</figcaption>
    </figure>
  );
}

/** Una imagen del diario con su pie opcional. `width`/`height` reservan el hueco (sin salto de maquetación). */
function Figura({ imagen, clase }: { imagen: ImagenDiario; clase: string }) {
  const { tx } = useIdioma();
  return (
    <figure className={clase}>
      <img
        src={ruta(imagen.src)}
        width={imagen.ancho}
        height={imagen.alto}
        alt={tx(imagen.alt)}
        loading="lazy"
        decoding="async"
      />
      {imagen.pie && <figcaption>{tx(imagen.pie)}</figcaption>}
    </figure>
  );
}

function BloqueDiario({ bloque }: { bloque: Bloque }) {
  const { t, tx } = useIdioma();
  switch (bloque.tipo) {
    case 'parrafo':
      return <p>{conCodigo(tx(bloque.texto))}</p>;
    case 'decision':
      return (
        <div className="decision">
          <p className="diario-etiqueta">{t('diario.decision')}</p>
          <p>{conCodigo(tx(bloque.texto))}</p>
          <p className="decision-fuente">{tx(bloque.cita)}</p>
        </div>
      );
    case 'lista':
      return (
        <div className="cambio">
          <p className="diario-etiqueta">{tx(bloque.titulo)}</p>
          <ul>
            {bloque.items.map((item) => (
              <li key={tx(item)}>{conCodigo(tx(item))}</li>
            ))}
          </ul>
        </div>
      );
    case 'animacion':
      return <Animacion bloque={bloque} />;
    case 'imagen':
      return <Figura imagen={bloque} clase="diario-imagen" />;
    case 'galeria':
      return (
        <div className="diario-galeria">
          {bloque.imagenes.map((g) => (
            <Figura key={g.src} imagen={g} clase="diario-galeria-figura" />
          ))}
        </div>
      );
  }
}

/** Una entrada del diario, `/diario/<slug>`: cabecera celeste con metadatos, artículo por secciones y pie. */
export function EntradaDiario() {
  const { slug } = useParams();
  const entrada = buscarEntrada(slug ? leerAncla(slug) : undefined);
  return entrada ? <VistaEntrada entrada={entrada} /> : <NoEncontrado />;
}

/** El contenido de una entrada ya encontrada (aparte para poder pintar una de prueba en los tests). */
export function VistaEntrada({ entrada }: { entrada: Entrada }) {
  const { t, tx, idioma, fecha } = useIdioma();
  const titulo = tx(entrada.titulo);

  useEffect(() => {
    document.title = `${titulo} · Galivelop`;
    return () => {
      document.title = 'Galivelop';
    };
  }, [titulo]);

  const autor = buscarPersonaPorId(entrada.autor);
  const proyecto = buscarProyecto(entrada.proyecto);
  const i = entradas.findIndex((e) => e.slug === entrada.slug);
  // `entradas` va de la más nueva a la más vieja: la anterior es la siguiente en la lista.
  const anterior = entradas[i + 1];
  const siguiente = entradas[i - 1];

  return (
    <section className="seccion diario-pagina">
      <div className="contenedor diario-columna">
        <nav className="migas" aria-label={t('productos.migas')}>
          <ol>
            <li>
              <Link to="/">{t('diario.inicio')}</Link>
            </li>
            <li>
              <Link to="/diario">{t('diario.titulo')}</Link>
            </li>
            <li aria-current="page">{titulo}</li>
          </ol>
        </nav>
        <header className="diario-cabecera" data-guion="cabecera">
          <p className="diario-etiqueta">{t('diario.titulo')}</p>
          <h1>{titulo}</h1>
          <p className="diario-bajada">{tx(entrada.bajada)}</p>
          <dl className="diario-meta">
            <div>
              <dt className="diario-etiqueta">{t('diario.fecha')}</dt>
              <dd>
                <time dateTime={entrada.fecha}>{fecha(entrada.fecha)}</time>{' '}
                <span className="diario-tipo">{t(`diario.tipo.${tipoDe(entrada)}`)}</span>
              </dd>
            </div>
            {autor && (
              <div>
                <dt className="diario-etiqueta">{t('diario.escribe')}</dt>
                <dd>
                  <Link to={`/equipo/${autor.id}`}>{autor.nombre}</Link>
                </dd>
              </div>
            )}
            <div>
              <dt className="diario-etiqueta">{t('diario.lectura')}</dt>
              <dd>{t('diario.lecturaMin', { min: minutosLectura(entrada, idioma) })}</dd>
            </div>
            {proyecto && (
              <div>
                <dt className="diario-etiqueta">{t('diario.proyecto')}</dt>
                <dd>
                  <Link to={`/proyectos/${proyecto.slug}`}>{proyecto.nombre}</Link>
                </dd>
              </div>
            )}
          </dl>
        </header>
        {entrada.portada && (
          <figure className="diario-portada">
            {/* Es la imagen más grande de la página (LCP): sin lazy y con prioridad alta. */}
            <img
              src={ruta(entrada.portada.src)}
              width={entrada.portada.ancho}
              height={entrada.portada.alto}
              alt={tx(entrada.portada.alt)}
              fetchPriority="high"
              decoding="async"
            />
          </figure>
        )}
        <article className="diario-articulo">
          {entrada.secciones.map((s) => (
            <section key={tx(s.titulo)}>
              <h2>
                <span className="diario-etiqueta">{tx(s.etiqueta)}</span>
                {tx(s.titulo)}
              </h2>
              {s.bloques.map((b, n) => (
                <BloqueDiario key={n} bloque={b} />
              ))}
            </section>
          ))}
        </article>
        <nav className="diario-pie" aria-label={t('diario.masEntradas')}>
          {anterior && (
            <Link to={`/diario/${anterior.slug}`} className="diario-pie-anterior">
              <span className="diario-etiqueta">{t('diario.anterior')}</span>
              {tx(anterior.titulo)}
            </Link>
          )}
          {siguiente && (
            <Link to={`/diario/${siguiente.slug}`} className="diario-pie-siguiente">
              <span className="diario-etiqueta">{t('diario.siguiente')}</span>
              {tx(siguiente.titulo)}
            </Link>
          )}
          {proyecto && (
            <Link to={`/proyectos/${proyecto.slug}`} className="diario-pie-ficha">
              <span className="diario-etiqueta">{t('diario.relacionado')}</span>
              {t('diario.verFicha', { proyecto: proyecto.nombre })}
            </Link>
          )}
        </nav>
      </div>
    </section>
  );
}
