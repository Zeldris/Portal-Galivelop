import { Link } from 'react-router-dom';
import { MarcaGV } from '../components/Logo';
import { useIdioma } from '../i18n/Idioma';

export function NoEncontrado() {
  const { t } = useIdioma();
  return (
    <section className="seccion no-encontrado">
      <div className="contenedor">
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
