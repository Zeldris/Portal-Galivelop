import { ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from '../components/Enlace';
import { entradas, minutosLectura, rutaMini, tipoDe, type EntradaDiario } from '../data/diario';
import { buscarPersonaPorId } from '../data/equipo';
import { useIdioma } from '../i18n/Idioma';

/** Tarjeta de una entrada en el índice: miniatura de la portada (si la tiene; la de la primera tarjeta no es lazy, es la que se ve al abrir), datos, título y bajada. */
export function TarjetaEntrada({ e, primera = false }: { e: EntradaDiario; primera?: boolean }) {
  const { t, tx, idioma, fecha } = useIdioma();
  const autor = buscarPersonaPorId(e.autor);
  return (
    <article className="diario-tarjeta" data-guion={`entrada-${e.slug}`}>
      {e.portada && (
        <img
          className="diario-miniatura"
          src={rutaMini(e.portada.src)}
          alt={tx(e.portada.alt)}
          loading={primera ? undefined : 'lazy'}
          decoding="async"
        />
      )}
      <p className="diario-datos">
        <time dateTime={e.fecha}>{fecha(e.fecha)}</time>
        <span className="diario-tipo">{t(`diario.tipo.${tipoDe(e)}`)}</span>
        {autor && (
          <span>
            {t('diario.escribe')}: <Link to={`/equipo/${autor.id}`}>{autor.nombre}</Link>
          </span>
        )}
        <span>
          {t('diario.lectura')}: {t('diario.lecturaMin', { min: minutosLectura(e, idioma) })}
        </span>
      </p>
      <h2>
        <Link to={`/diario/${e.slug}`}>{tx(e.titulo)}</Link>
      </h2>
      <p>{tx(e.bajada)}</p>
      <Link to={`/diario/${e.slug}`} className="enlace-flecha">
        {t('diario.leer')} <ArrowRight size={14} />
      </Link>
    </article>
  );
}

/** Índice del diario del taller, `/diario`: una tarjeta por entrada, de la más nueva a la más vieja. */
export function Diario() {
  const { t } = useIdioma();

  useEffect(() => {
    document.title = `${t('diario.titulo')} · Galivelop`;
    return () => {
      document.title = 'Galivelop';
    };
  }, [t]);

  return (
    <section className="seccion diario-pagina">
      <div className="contenedor">
        <nav className="migas" aria-label={t('productos.migas')}>
          <ol>
            <li>
              <Link to="/">{t('diario.inicio')}</Link>
            </li>
            <li aria-current="page">{t('diario.titulo')}</li>
          </ol>
        </nav>
        <header className="seccion-cabecera" data-guion="cabecera">
          <div>
            <h1>{t('diario.titulo')}</h1>
            <p>{t('diario.intro')}</p>
          </div>
        </header>
        {entradas.length === 0 ? (
          <p>{t('diario.vacio')}</p>
        ) : (
          <ul className="diario-indice">
            {entradas.map((e, n) => (
              <li key={e.slug}>
                <TarjetaEntrada e={e} primera={n === 0} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
