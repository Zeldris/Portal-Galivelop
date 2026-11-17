import { useEffect, useState, type ComponentType } from 'react';
import { useIdioma } from '../i18n/Idioma';

/**
 * Trae el lector (su propio chunk, con los guiones) solo en castellano y tras el primer pintado: no pesa en el JS
 * inicial. Un fallo de red no rompe la página: simplemente no hay lector.
 */
export function LectorCarga() {
  const { idioma } = useIdioma();
  const [Lector, setLector] = useState<ComponentType | null>(null);
  useEffect(() => {
    if (idioma !== 'es' || Lector) return;
    let vigente = true;
    const cargar = () =>
      import('./Lector').then(
        (m) => vigente && setLector(() => m.Lector),
        () => undefined,
      );
    const id = window.setTimeout(cargar, 1500);
    return () => {
      vigente = false;
      window.clearTimeout(id);
    };
  }, [idioma, Lector]);
  return idioma === 'es' && Lector ? <Lector /> : null;
}
