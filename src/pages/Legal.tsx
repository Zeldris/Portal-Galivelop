import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { documentosLegales, type DocumentoLegal } from '../data/legal';
import { useIdioma } from '../i18n/Idioma';

/** Página de un texto legal (aviso legal, privacidad o términos), con enlaces a los otros dos al final. */
export function Legal({ documento: d }: { documento: DocumentoLegal }) {
  const { t, tx, fecha } = useIdioma();

  useEffect(() => {
    document.title = `${tx(d.titulo)} · Galivelop`;
    return () => {
      document.title = 'Galivelop';
    };
  }, [d, tx]);

  const otros = documentosLegales.filter((o) => o.slug !== d.slug);

  return (
    <section className="seccion legal">
      <div className="contenedor legal-contenedor">
        <header className="legal-cabecera">
          <h1>{tx(d.titulo)}</h1>
          <p className="legal-fecha">
            {t('legal.actualizado')} · <time dateTime={d.actualizado}>{fecha(d.actualizado)}</time>
          </p>
        </header>

        {d.secciones.map((s) => (
          <section key={s.titulo.es} className="legal-seccion">
            <h2>{tx(s.titulo)}</h2>
            {s.parrafos?.map((p) => (
              <p key={p.es}>{tx(p)}</p>
            ))}
            {s.datos && (
              <dl className="legal-datos">
                {s.datos.map((x) => (
                  <div key={x.etiqueta.es}>
                    <dt>{tx(x.etiqueta)}</dt>
                    <dd>{x.enlace ? <a href={x.enlace}>{tx(x.valor)}</a> : tx(x.valor)}</dd>
                  </div>
                ))}
              </dl>
            )}
            {s.lista && (
              <ul>
                {s.lista.map((x) => (
                  <li key={x.es}>{tx(x)}</li>
                ))}
              </ul>
            )}
            {s.enlaces && (
              <ul className="legal-enlaces">
                {s.enlaces.map((e) => (
                  <li key={e.url}>
                    <a href={e.url} target="_blank" rel="noreferrer">
                      {tx(e.etiqueta)}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <nav className="legal-otros" aria-label={t('legal.otros')}>
          <span>{t('legal.otros')}:</span>
          {otros.map((o) => (
            <Link key={o.slug} to={`/${o.slug}`}>
              {tx(o.titulo)}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
