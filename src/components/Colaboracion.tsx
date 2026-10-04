import { Lock, Users } from 'lucide-react';
import type { Proyecto } from '../data/tipos';
import { useIdioma } from '../i18n/Idioma';

export function EtiquetaColaboracion({ colaboracion }: { colaboracion: Proyecto['colaboracion'] }) {
  const { t } = useIdioma();
  const abierta = colaboracion === 'abierta';
  return (
    <span className={`colab colab-${colaboracion}`}>
      {abierta ? <Users size={14} aria-hidden="true" /> : <Lock size={14} aria-hidden="true" />}
      {abierta ? t('colab.abierta') : t('colab.privada')}
    </span>
  );
}
