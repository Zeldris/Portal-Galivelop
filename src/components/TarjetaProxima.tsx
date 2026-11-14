import { estiloAcento } from '../data/tonos';
import type { Proximo } from '../data/proximamente';
import { ruta } from '../data/proyectos';
import { useIdioma } from '../i18n/Idioma';
import { Icono } from './Icono';

/** Tarjeta atenuada y sin enlace de un proyecto que aún no tiene ficha. */
export function TarjetaProxima({ proximo: p }: { proximo: Proximo }) {
  const { t, tx } = useIdioma();
  const avance = Math.round((p.fases.hechas / p.fases.total) * 100);
  const fases = t('proximamente.fases', { hechas: p.fases.hechas, total: p.fases.total });
  return (
    <article className="tarjeta-proxima" style={estiloAcento(p.acento)}>
      {p.imagen ? (
        <img
          className="proxima-imagen"
          src={ruta(p.imagen)}
          alt=""
          width={720}
          height={405}
          loading="lazy"
        />
      ) : (
        // Hasta que llegue su ilustración, celeste plano con isobatas (docs/marca.md, recurso 15).
        <span className="proxima-imagen proxima-imagen-vacia" aria-hidden="true">
          <img src={ruta('marca/isobatas.svg')} alt="" loading="lazy" />
        </span>
      )}
      <div className="proxima-cabeza">
        <span className="proxima-icono">
          {p.iconoPropio ? (
            <img src={ruta(p.iconoPropio)} alt="" width={24} height={24} />
          ) : (
            <Icono nombre={p.icono} tamano={20} />
          )}
        </span>
        <span className="proxima-etiqueta">{t('proximamente.titulo')}</span>
      </div>
      <h4>{p.nombre}</h4>
      <p className="proxima-lema">{tx(p.lema)}</p>
      <div className="tarjeta-fase">
        <span>{fases}</span>
        <div
          className="barra"
          role="progressbar"
          aria-label={`${t('proyecto.avance')} · ${p.nombre}`}
          aria-valuenow={avance}
          aria-valuetext={fases}
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
