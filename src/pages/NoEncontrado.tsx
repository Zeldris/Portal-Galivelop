import { useEffect } from 'react';
import { Link } from '../components/Enlace';
import { MarcaGV } from '../components/Logo';
import { ruta } from '../data/proyectos';
import { useIdioma } from '../i18n/Idioma';

export function NoEncontrado() {
  const { t } = useIdioma();

  // 404.html llega con título propio y noindex (scripts/paginas-estaticas.mjs); al salir hacia otra página sin
  // recargar, se vuelve al título de la marca y se quita el noindex, como hacen las demás páginas con su título.
  useEffect(() => {
    document.title = `${t('error.titulo')} · Galivelop`;
    return () => {
      document.title = 'Galivelop';
      document.querySelector('meta[name="robots"][content="noindex"]')?.remove();
    };
  }, [t]);

  return (
    <section className="seccion no-encontrado">
      <div className="contenedor">
        <img
          className="no-encontrado-imagen"
          src={ruta('marca/no-encontrado.webp')}
          alt=""
          width={900}
          height={600}
        />
        <MarcaGV tamano={64} />
        <h1>{t('error.titulo')}</h1>
        <p>{t('error.texto')}</p>
        <Link to="/" className="boton boton-primario">
          {t('error.volver')}
        </Link>
      </div>
    </section>
  );
}
