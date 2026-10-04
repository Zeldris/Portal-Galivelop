import type { EstadoProyecto } from '../data/tipos';
import { useIdioma } from '../i18n/Idioma';

export function EstadoEtiqueta({ estado }: { estado: EstadoProyecto }) {
  const { t } = useIdioma();
  return (
    <span className={`estado estado-${estado}`}>
      <span className="estado-punto" aria-hidden="true" />
      {t(`estado.${estado}`)}
    </span>
  );
}
