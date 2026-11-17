import { useEffect, useState, type ComponentType } from 'react';
import { useLocation } from 'react-router-dom';
import { useIdioma } from '../i18n/Idioma';
import { claveDeGuion, lectorDisponible } from '../utils/guion';

// Solo el campo `audio` de cada guion (no su texto): el JS inicial no crece.
const audios = import.meta.glob<string[] | undefined>('../data/guiones/*.json', {
  eager: true,
  import: 'audio',
});

/**
 * Trae el lector (su propio chunk, con los guiones) solo si el guion de la página tiene audio en el idioma activo (`audio` del guion) y tras el primer pintado: no pesa en el JS
 * inicial. Un fallo de red no rompe la página: simplemente no hay lector.
 */
export function LectorCarga() {
  const { idioma } = useIdioma();
  const { pathname } = useLocation();
  const hay = lectorDisponible(audios[`../data/guiones/${claveDeGuion(pathname)}.json`], idioma);
  const [Lector, setLector] = useState<ComponentType | null>(null);
  useEffect(() => {
    if (!hay || Lector) return;
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
  }, [hay, Lector]);
  return hay && Lector ? <Lector /> : null;
}
