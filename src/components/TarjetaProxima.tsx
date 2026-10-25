import type { CSSProperties } from 'react';
import type { Proximo } from '../data/proximamente';
import { useIdioma } from '../i18n/Idioma';
import { Icono } from './Icono';

/** Tarjeta atenuada y sin enlace de un proyecto que aún no tiene ficha. */
export function TarjetaProxima({ proximo: p }: { proximo: Proximo }) {
  const { t, tx } = useIdioma();
  const avance = Math.round((p.fases.hechas / p.fases.total) * 100);
  return (
    <article className="tarjeta-proxima" style={{ '--acento-proyecto': p.acento } as CSSProperties}>
      <div className="proxima-cabeza">
        <span className="proxima-icono">
          <Icono nombre={p.icono} tamano={20} />
        </span>
        <span className="proxima-etiqueta">{t('proximamente.titulo')}</span>
      </div>
      <h4>{p.nombre}</h4>
      <p className="proxima-lema">{tx(p.lema)}</p>
      <div className="tarjeta-fase">
        <span>{t('proximamente.fases', { hechas: p.fases.hechas, total: p.fases.total })}</span>
        <div
          className="barra"
          role="progressbar"
          aria-label={t('proyecto.avance')}
          aria-valuenow={avance}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span style={{ width: `${avance}%` }} />
        </div>
        <span>{t('proximamente.siguiente', { paso: tx(p.siguiente) })}</span>
      </div>
    </article>
  );
}
