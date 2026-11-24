import { ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from '../components/Enlace';
import { Icono } from '../components/Icono';
import { buscarPersonaPorId } from '../data/equipo';
import { productos } from '../data/productos';
import { estiloAcento } from '../data/tonos';
import { useIdioma } from '../i18n/Idioma';

/**
 * Índice de los productos, `/productos`: una tarjeta por producto, atribuido a su responsable (ADR 0002 y 0004: son de
 * cada miembro, no del taller). Sin precios; el contacto está en la página de cada producto.
 */
export function Productos() {
  const { t, tx } = useIdioma();

  useEffect(() => {
    document.title = `${t('productos.titulo')} · Galivelop`;
    return () => {
      document.title = 'Galivelop';
    };
  }, [t]);

  return (
    <section className="seccion productos-pagina">
      <div className="contenedor">
        <nav className="migas" aria-label={t('productos.migas')}>
          <ol>
            <li>
              <Link to="/">{t('productos.inicio')}</Link>
            </li>
            <li aria-current="page">{t('productos.titulo')}</li>
          </ol>
        </nav>
        <header className="seccion-cabecera" data-guion="cabecera">
          <div>
            <h1>{t('productos.titulo')}</h1>
            <p>{t('productos.intro')}</p>
          </div>
        </header>
        <ul className="rejilla-productos productos-indice">
          {productos.map((p) => {
            const responsable = buscarPersonaPorId(p.responsable);
            return (
              <li key={p.slug}>
                <article
                  className="tarjeta-producto"
                  data-guion={`producto-${p.slug}`}
                  style={estiloAcento(p.acento)}
                >
                  <div className="proxima-cabeza">
                    <span className="proxima-icono">
                      <Icono nombre={p.icono} tamano={22} />
                    </span>
                    {p.estado === 'proximamente' && (
                      <span className="proxima-etiqueta">{t('proximamente.titulo')}</span>
                    )}
                  </div>
                  <h2>{p.alias ? `${p.nombre} · ${p.alias}` : p.nombre}</h2>
                  <p className="producto-texto">{tx(p.queOfrece)}</p>
                  {responsable && (
                    <p className="producto-responsable">
                      {t('productos.responsable')}:{' '}
                      <Link to={`/equipo/${responsable.id}`} className="chip-enlace">
                        {responsable.nombre}
                      </Link>
                    </p>
                  )}
                  {p.pagina && (
                    <div className="producto-acciones">
                      <Link to={`/productos/${p.slug}`} className="boton boton-secundario">
                        {t('productos.verProducto')} <ArrowRight size={16} />
                      </Link>
                    </div>
                  )}
                </article>
              </li>
            );
          })}
        </ul>
        <p className="productos-nota">{t('productos.nota')}</p>
      </div>
    </section>
  );
}
