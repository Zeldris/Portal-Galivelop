import { ArrowRight, MapPin } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from '../components/Enlace';
import { ListaRedes } from '../components/IconoRed';
import ramas from '../assets/iconos/ramas.svg?raw';
import { IconoSvg, trazadoSvg } from '../components/IconoSvg';
import { Retrato } from '../components/Retrato';
import { equipo } from '../data/equipo';
import { buscarProyecto, ruta } from '../data/proyectos';
import { useIdioma } from '../i18n/Idioma';

// Un solo icono de la marca: importarlo suelto evita cargar los 21 iconos juntos (~55 KB gzip) antes de pintar la
// página en móvil (LCP de /equipo/, 2026-11-26).
const RAMAS = trazadoSvg(ramas, 'ramas');

export function Equipo() {
  const { t, tx } = useIdioma();

  useEffect(() => {
    document.title = `${t('equipo.titulo')} · Galivelop`;
    return () => {
      document.title = 'Galivelop';
    };
  }, [t]);

  return (
    <section className="seccion equipo-pagina">
      <div className="contenedor">
        <img
          className="banda-cabecera"
          src={ruta('marca/cabecera-equipo.webp')}
          srcSet={`${ruta('marca/cabecera-equipo-mini.webp')} 800w, ${ruta('marca/cabecera-equipo.webp')} 1600w`}
          sizes="(max-width: 1200px) 100vw, 1200px"
          alt=""
          width={1600}
          height={500}
          fetchPriority="high"
        />
        <header className="seccion-cabecera" data-guion="cabecera">
          <div>
            <h1>{t('equipo.titulo')}</h1>
            <p>{t('equipo.intro')}</p>
          </div>
        </header>

        <ul className="personas">
          {equipo.map((p) => (
            <li key={p.id} id={p.id} className="persona">
              <div className="persona-cabecera">
                <Retrato nombre={p.nombre} foto={p.foto} clase="persona-foto" lado={88} />
                <div>
                  <h2>{p.nombre}</h2>
                  <p className="persona-rol">{tx(p.rol)}</p>
                  {p.perfil?.ubicacion && (
                    <p className="persona-ubicacion">
                      <MapPin size={14} aria-hidden="true" /> {tx(p.perfil.ubicacion)}
                    </p>
                  )}
                </div>
              </div>
              <p className="persona-bio">{tx(p.bio)}</p>
              {p.proyectos.length > 0 && (
                <div className="persona-proyectos">
                  <span>{t('equipo.proyectos')}:</span>
                  {p.proyectos.map((slug) => {
                    const proyecto = buscarProyecto(slug);
                    return proyecto ? (
                      <Link key={slug} to={`/proyectos/${slug}`} className="chip-enlace">
                        {proyecto.nombre}
                      </Link>
                    ) : null;
                  })}
                </div>
              )}
              <Link
                to={`/equipo/${p.id}`}
                className="boton boton-primario persona-ver"
                aria-label={t('equipo.verPerfilDe', { nombre: p.nombre })}
              >
                {t('equipo.ver')} <ArrowRight size={16} />
              </Link>
              {p.redes.length > 0 && (
                <ListaRedes redes={p.redes} nombre={p.nombre} clase="persona-redes" />
              )}
            </li>
          ))}

          <li className="persona persona-unete" data-guion="unete">
            <span className="retrato persona-foto" aria-hidden="true">
              <span className="persona-hueco">
                <IconoSvg icono={RAMAS} />
              </span>
            </span>
            <h2>{t('equipo.unete.titulo')}</h2>
            <p className="persona-bio">{t('equipo.unete.texto')}</p>
            <Link to="/participa/unirse" className="boton boton-primario">
              {t('unir.titulo')} <ArrowRight size={16} />
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
