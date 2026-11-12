import { estiloAcento } from '../data/tonos';
import { Fragment, useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Link } from '../components/Enlace';
import { Separador } from '../components/Separador';
import { entradas } from '../data/novedades';
import { buscarProyecto, proyectos, ruta } from '../data/proyectos';
import { useIdioma } from '../i18n/Idioma';

/** Las que se ven al entrar; «Ver más» enseña otras tantas. */
export const POR_TANDA = 20;

/**
 * Novedades de todo el taller: las de cada ficha y las publicaciones del muro, lo más reciente primero, con filtro
 * por proyecto (?proyecto=<slug>), como el muro.
 */
export function Novedades() {
  const { t, tx, fecha } = useIdioma();
  const [parametros] = useSearchParams();
  const navegar = useNavigate();
  const { hash } = useLocation();
  const cuenta = (slug: string) => entradas.filter((e) => e.proyecto === slug).length;
  const conNovedades = proyectos.filter((p) => cuenta(p.slug) > 0);
  const pedido = parametros.get('proyecto');
  const filtro = conNovedades.some((p) => p.slug === pedido) ? pedido : null;
  const todas = entradas.filter((e) => !filtro || e.proyecto === filtro);
  const [visibles, setVisibles] = useState(POR_TANDA);
  useEffect(() => setVisibles(POR_TANDA), [filtro]);

  useEffect(() => {
    document.title = `${t('sec.novedades')} · Galivelop`;
    return () => {
      document.title = 'Galivelop';
    };
  }, [t]);

  /** Cambia el filtro sin llenar el historial; conserva el ancla para que la página no vuelva arriba (`Desplazamiento`). */
  const filtrar = (slug: string | null) =>
    navegar(
      { search: slug ? `?proyecto=${slug}` : '', hash },
      { replace: true, preventScrollReset: true },
    );

  return (
    <section className="seccion novedades-pagina">
      <div className="contenedor muro-contenedor">
        <header className="seccion-cabecera">
          <div>
            <h1>{t('sec.novedades')}</h1>
            <p>{t('novedades.intro')}</p>
          </div>
        </header>

        {conNovedades.length > 1 && (
          <div className="filtros" role="group" aria-label={t('muro.filtro')}>
            <button type="button" aria-pressed={!filtro} onClick={() => filtrar(null)}>
              {t('filtro.todos')}
              <span className="filtro-cuenta">{entradas.length}</span>
            </button>
            {conNovedades.map((p) => (
              <button
                key={p.slug}
                type="button"
                aria-pressed={filtro === p.slug}
                onClick={() => filtrar(p.slug)}
              >
                {p.nombre}
                <span className="filtro-cuenta">{cuenta(p.slug)}</span>
              </button>
            ))}
          </div>
        )}

        {todas.length > 0 ? (
          <>
            <ul className="novedades novedades-todas">
              {todas.slice(0, visibles).map((e, i, lista) => {
                const proyecto = buscarProyecto(e.proyecto);
                // Entre un mes y el anterior, el separador de la marca (fecha AAAA-MM-DD).
                const cambiaMes = i > 0 && lista[i - 1].fecha.slice(0, 7) !== e.fecha.slice(0, 7);
                return (
                  <Fragment key={`${e.proyecto}-${e.fecha}-${i}`}>
                    {cambiaMes && (
                      <li className="novedades-corte" aria-hidden="true">
                        <Separador />
                      </li>
                    )}
                    <li style={proyecto ? estiloAcento(proyecto.acento) : undefined}>
                      <time dateTime={e.fecha}>{fecha(e.fecha)}</time>
                      <div>
                        {proyecto && (
                          <Link to={`/proyectos/${proyecto.slug}`} className="novedad-proyecto">
                            {proyecto.icono && (
                              <img
                                className="novedad-icono"
                                src={ruta(proyecto.icono)}
                                alt=""
                                width={24}
                                height={24}
                                loading="lazy"
                              />
                            )}
                            {proyecto.nombre}
                          </Link>
                        )}
                        {e.tipo === 'novedad' ? (
                          <p>{tx(e.texto)}</p>
                        ) : (
                          <p>
                            <Link to={`/muro?proyecto=${e.proyecto}`}>
                              <strong>{tx(e.publicacion.titulo)}</strong>
                            </Link>{' '}
                            <span className="novedad-muro">· {t('novedades.muro')}</span>
                            <br />
                            {tx(e.publicacion.texto)}
                          </p>
                        )}
                      </div>
                    </li>
                  </Fragment>
                );
              })}
            </ul>
            {todas.length > visibles && (
              <button
                type="button"
                className="boton boton-secundario novedades-mas"
                onClick={() => setVisibles((v) => v + POR_TANDA)}
              >
                {t('novedades.verMas')}
              </button>
            )}
          </>
        ) : (
          <p className="vacio vacio-carta">{t('novedades.vacio')}</p>
        )}
      </div>
    </section>
  );
}
