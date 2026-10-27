import { ArrowRight, Mail } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TarjetaProducto } from '../components/TarjetaProducto';
import { equipo, iniciales } from '../data/equipo';
import { MARCA } from '../data/marca';
import { productos } from '../data/productos';
import { ruta } from '../data/proyectos';
import { useIdioma } from '../i18n/Idioma';

/** Productos de la marca (ADR 0002): software de descarga local e integrantes promocionados. Sin precios. */
export function Productos() {
  const { t, tx } = useIdioma();
  const promocionados = equipo.filter((p) => p.promocionado);

  useEffect(() => {
    document.title = `${t('productos.titulo')} · Galivelop`;
    return () => {
      document.title = 'Galivelop';
    };
  }, [t]);

  return (
    <section className="seccion productos-pagina">
      <div className="contenedor">
        <header className="seccion-cabecera">
          <div>
            <h1>{t('productos.titulo')}</h1>
            <p>{t('productos.intro')}</p>
          </div>
        </header>

        <div className="rejilla-productos">
          {productos.map((p) => (
            <TarjetaProducto key={p.slug} producto={p} />
          ))}
        </div>

        {promocionados.length > 0 && (
          <section className="integrantes" aria-labelledby="integrantes-titulo">
            <header className="seccion-cabecera">
              <div>
                <h2 id="integrantes-titulo">{t('productos.integrantes.titulo')}</h2>
                <p>{t('productos.integrantes.texto')}</p>
              </div>
            </header>
            <ul className="personas">
              {promocionados.map((p) => (
                <li key={p.id} className="persona">
                  <div className="persona-cabecera">
                    {p.foto ? (
                      <img
                        src={ruta(p.foto)}
                        alt=""
                        className="persona-foto"
                        width={88}
                        height={88}
                      />
                    ) : (
                      <span className="persona-foto persona-iniciales" aria-hidden="true">
                        {iniciales(p.nombre)}
                      </span>
                    )}
                    <div>
                      <h3>{p.nombre}</h3>
                      <p className="persona-rol">{tx(p.rol)}</p>
                    </div>
                  </div>
                  {p.servicios && p.servicios.length > 0 && (
                    <ul className="persona-servicios">
                      {p.servicios.map((s, i) => (
                        <li key={i}>{tx(s)}</li>
                      ))}
                    </ul>
                  )}
                  <Link
                    to={`/equipo/${p.id}`}
                    className="boton boton-primario persona-ver"
                    aria-label={t('equipo.verPerfilDe', {
                      nombre: p.nombre,
                    })}
                  >
                    {t('equipo.ver')} <ArrowRight size={16} />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <aside className="productos-contacto">
          <div>
            <h2>{t('productos.contacto.titulo')}</h2>
            <p>{t('productos.contacto.texto')}</p>
          </div>
          <a
            className="boton boton-primario"
            href={`mailto:${MARCA.correo}?subject=${encodeURIComponent(t('productos.contacto.asunto'))}`}
          >
            <Mail size={16} /> {t('productos.contacto.boton')}
          </a>
        </aside>
      </div>
    </section>
  );
}
