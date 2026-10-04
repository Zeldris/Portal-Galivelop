import { Link } from 'react-router-dom';
import { MarcaGD } from '../components/Logo';
import { useIdioma } from '../i18n/Idioma';

export function NoEncontrado() {
  const { t } = useIdioma();
  return (
    <section className="seccion no-encontrado">
      <div className="contenedor">
        <MarcaGD tamano={64} />
        <h1>{t('error.titulo')}</h1>
        <p>{t('error.texto')}</p>
        <Link to="/" className="boton boton-primario">
          {t('error.volver')}
        </Link>
      </div>
    </section>
  );
}
