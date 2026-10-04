import { ArrowUpRight } from 'lucide-react';
import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { progreso, ruta } from '../data/proyectos';
import type { Proyecto } from '../data/tipos';
import { useIdioma } from '../i18n/Idioma';
import { EstadoEtiqueta } from './EstadoEtiqueta';

export function TarjetaProyecto({ proyecto: p }: { proyecto: Proyecto }) {
  const { t, tx } = useIdioma();
  const avance = progreso(p);
  return (
    <article className="tarjeta" style={{ '--acento-proyecto': p.acento } as CSSProperties}>
      <div className="tarjeta-imagen">
        <img src={ruta(p.portada.mini)} alt={tx(p.portada.alt)} loading="lazy" width={p.portada.ancho} height={p.portada.alto} />
        <EstadoEtiqueta estado={p.estado} />
      </div>
      <div className="tarjeta-cuerpo">
        <p className="tarjeta-categoria">{tx(p.categoria)}</p>
        <h3>
          <Link to={`/proyectos/${p.slug}`} className="tarjeta-enlace">
            {p.icono && <img src={ruta(p.icono)} alt="" className="tarjeta-icono" />}
            {p.nombre}
          </Link>
        </h3>
        <p className="tarjeta-resumen">{tx(p.resumen)}</p>
        <ul className="chips" aria-label={t('sec.ficha')}>
          {p.etiquetas.slice(0, 5).map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
        <div className="tarjeta-pie">
          <div className="tarjeta-fase">
            <span>{tx(p.fase)}</span>
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
          </div>
          <span className="tarjeta-ver" aria-hidden="true">
            {t('tarjeta.ver')} <ArrowUpRight size={16} />
          </span>
        </div>
      </div>
    </article>
  );
}
