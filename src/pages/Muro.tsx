import { useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Publicacion } from '../components/Publicacion';
import { publicaciones, publicacionesDe } from '../data/muro';
import { proyectos } from '../data/proyectos';
import { useIdioma } from '../i18n/Idioma';

/** El muro: lo que publica cada proyecto, lo más reciente primero, con filtro por proyecto (?proyecto=<slug>). */
export function Muro() {
  const { t } = useIdioma();
  const [parametros] = useSearchParams();
  const navegar = useNavigate();
  const { hash } = useLocation();
  const conPublicaciones = proyectos.filter((p) => publicacionesDe(p.slug).length > 0);
  const pedido = parametros.get('proyecto');
  const filtro = conPublicaciones.some((p) => p.slug === pedido) ? pedido : null;
  const visibles = publicaciones.filter((p) => !filtro || p.proyecto === filtro);

  useEffect(() => {
    document.title = `${t('muro.titulo')} · Galivelop`;
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
    <section className="seccion muro">
      <div className="contenedor muro-contenedor">
        <header className="seccion-cabecera">
          <div>
            <h1>{t('muro.titulo')}</h1>
            <p>{t('muro.intro')}</p>
          </div>
        </header>

        {conPublicaciones.length > 1 && (
          <div className="filtros" role="group" aria-label={t('muro.filtro')}>
            <button type="button" aria-pressed={!filtro} onClick={() => filtrar(null)}>
              {t('filtro.todos')}
              <span className="filtro-cuenta">{publicaciones.length}</span>
            </button>
            {conPublicaciones.map((p) => (
              <button
                key={p.slug}
                type="button"
                aria-pressed={filtro === p.slug}
                onClick={() => filtrar(p.slug)}
              >
                {p.nombre}
                <span className="filtro-cuenta">{publicacionesDe(p.slug).length}</span>
              </button>
            ))}
          </div>
        )}

        {visibles.length > 0 ? (
          <div className="muro-lista">
            {visibles.map((p) => (
              <Publicacion key={`${p.proyecto}/${p.pieza}`} p={p} />
            ))}
          </div>
        ) : (
          <p className="vacio">{t('muro.vacio')}</p>
        )}
      </div>
    </section>
  );
}
