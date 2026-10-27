import { ArrowRight, Mail } from 'lucide-react';
import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { buscarPersonaPorId } from '../data/equipo';
import { MARCA } from '../data/marca';
import type { Producto } from '../data/productos';
import { buscarProyecto } from '../data/proyectos';
import { useIdioma } from '../i18n/Idioma';
import { Icono } from './Icono';

/** Tarjeta de un producto. `compacta` (portada) omite servicios y personas; `titulo` sigue el esquema de títulos de la página; el botón queda siempre abajo, a la misma altura en toda la rejilla. */
export function TarjetaProducto({
  producto: p,
  compacta = false,
  titulo: Titulo = 'h2',
}: {
  producto: Producto;
  compacta?: boolean;
  titulo?: 'h2' | 'h3';
}) {
  const { t, tx } = useIdioma();
  const responsable = buscarPersonaPorId(p.responsable);
  const colaboradores = p.colaboradores.map(buscarPersonaPorId).filter((x) => x !== undefined);
  const proyecto = buscarProyecto(p.proyecto);
  return (
    <article
      className="tarjeta-producto"
      style={{ '--acento-proyecto': p.acento } as CSSProperties}
    >
      <div className="proxima-cabeza">
        <span className="proxima-icono">
          <Icono nombre={p.icono} tamano={22} />
        </span>
        {p.estado === 'proximamente' && (
          <span className="proxima-etiqueta">{t('proximamente.titulo')}</span>
        )}
      </div>
      <Titulo>{p.nombre}</Titulo>
      {p.version && (
        <p className="producto-version">{t('productos.version', { version: p.version })}</p>
      )}
      <p className="producto-texto">{tx(p.queOfrece)}</p>
      {proyecto && (
        <Link to={`/proyectos/${proyecto.slug}`} className="enlace-flecha producto-ficha">
          {t('productos.ficha')} <ArrowRight size={14} />
        </Link>
      )}
      {!compacta && p.servicios.length > 0 && (
        <div className="producto-servicios">
          <span>{t('productos.servicios')}:</span>
          <ul>
            {p.servicios.map((s, i) => (
              <li key={i}>{tx(s)}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="producto-pie">
        {!compacta && (
          <dl className="producto-personas">
            {responsable && (
              <>
                <dt>{t('productos.responsable')}</dt>
                <dd>
                  <Link to={`/equipo/${responsable.id}`} className="chip-enlace">
                    {responsable.nombre}
                  </Link>
                </dd>
              </>
            )}
            {colaboradores.length > 0 && (
              <>
                <dt>{t('productos.colaboradores')}</dt>
                <dd>
                  {colaboradores.map((c) => (
                    <Link key={c.id} to={`/equipo/${c.id}`} className="chip-enlace">
                      {c.nombre}
                    </Link>
                  ))}
                </dd>
              </>
            )}
          </dl>
        )}
        <div className="producto-acciones">
          <a
            className="boton boton-primario"
            href={`mailto:${MARCA.correo}?subject=${encodeURIComponent(t('productos.asunto', { producto: p.nombre }))}`}
          >
            <Mail size={16} /> {t('productos.interesa')}
          </a>
        </div>
      </div>
    </article>
  );
}
