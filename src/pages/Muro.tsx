import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Publicacion } from '../components/Publicacion';
import { publicaciones } from '../data/muro';
import { proyectos } from '../data/proyectos';
import { useIdioma } from '../i18n/Idioma';

/** El muro: lo que publica cada proyecto, lo más reciente primero, con filtro por proyecto (?proyecto=<slug>). */
export function Muro() {
  const { t } = useIdioma();
  const [parametros, setParametros] = useSearchParams();
  const conPublicaciones = proyectos.filter((p) => publicaciones.some((x) => x.proyecto === p.slug));
  const pedido = parametros.get('proyecto');
  const filtro = conPublicaciones.some((p) => p.slug === pedido) ? pedido : null;
  const visibles = publicaciones.filter((p) => !filtro || p.proyecto === filtro);
  const cuenta = (slug: string) => publicaciones.filter((p) => p.proyecto === slug).length;

  useEffect(() => {
    document.title = `${t('muro.titulo')} · Galivelop`;
    return () => {
      document.title = 'Galivelop';
    };
  }, [t]);

  /** Cambia el filtro sin perder el resto de la dirección ni llenar el historial. */
  const filtrar = (slug: string | null) =>
    setParametros(slug ? { proyecto: slug } : {}, { replace: true, preventScrollReset: true });

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
              <button key={p.slug} type="button" aria-pressed={filtro === p.slug} onClick={() => filtrar(p.slug)}>
                {p.nombre}
                <span className="filtro-cuenta">{cuenta(p.slug)}</span>
              </button>
            ))}
          </div>
        )}

        {visibles.length > 0 ? (
          <div className="muro-lista">
            {visibles.map((p) => <Publicacion key={`${p.proyecto}/${p.pieza}`} p={p} />)}
          </div>
        ) : (
          <p className="vacio">{t('muro.vacio')}</p>
        )}
      </div>
    </section>
  );
}
