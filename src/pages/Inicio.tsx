import { ArrowDown, ArrowRight, Check, Lock, Mail } from 'lucide-react';
import { useEffect, useState, type ComponentType, type CSSProperties } from 'react';
import { Link } from '../components/Enlace';
import { IconoDiscord } from '../components/IconoDiscord';
import { IconoGitHub } from '../components/IconoGitHub';
import { IconoSvg, iconoDe, trazadoSvg } from '../components/IconoSvg';
import { MarcaGV } from '../components/Logo';
import { Separador } from '../components/Separador';
import { TarjetaProxima } from '../components/TarjetaProxima';
import { TarjetaProyecto } from '../components/TarjetaProyecto';
import { LINEAS, type Linea } from '../data/lineas';
import { MARCA } from '../data/marca';
import { entradas } from '../data/diario';
import { productos } from '../data/productos';
import { proximos } from '../data/proximamente';
import { proyectos, ruta } from '../data/proyectos';
import type { EstadoProyecto } from '../data/tipos';
import { useIdioma } from '../i18n/Idioma';
import bombilla from '../assets/iconos/bombilla.svg?raw';
import candado from '../assets/iconos/candado.svg?raw';
import codigo from '../assets/iconos/codigo.svg?raw';
import compas from '../assets/iconos/compas.svg?raw';
import documentoCheck from '../assets/iconos/documento-check.svg?raw';
import historial from '../assets/iconos/historial.svg?raw';
import implantacion from '../assets/iconos/implantacion.svg?raw';
import mira from '../assets/iconos/mira.svg?raw';
import mundos from '../assets/iconos/mundos.svg?raw';
import papelVentana from '../assets/iconos/papel-ventana.svg?raw';
import ramasUnidas from '../assets/iconos/ramas-unidas.svg?raw';
import ramas from '../assets/iconos/ramas.svg?raw';
import terminal from '../assets/iconos/terminal.svg?raw';

const FILTROS: (EstadoProyecto | 'todos')[] = ['todos', 'publicado', 'desarrollo', 'diseno'];
/** Con pocos proyectos se ven todos de un vistazo y los filtros sobran. */
const FILTRAR_DESDE = 5;
/** Iconos propios de la marca, importados sueltos (no los 21 juntos). */
const ICONOS = {
  bombilla: trazadoSvg(bombilla, 'bombilla'),
  candado: trazadoSvg(candado, 'candado'),
  codigo: trazadoSvg(codigo, 'codigo'),
  compas: trazadoSvg(compas, 'compas'),
  'documento-check': trazadoSvg(documentoCheck, 'documento-check'),
  historial: trazadoSvg(historial, 'historial'),
  implantacion: trazadoSvg(implantacion, 'implantacion'),
  mira: trazadoSvg(mira, 'mira'),
  mundos: trazadoSvg(mundos, 'mundos'),
  'papel-ventana': trazadoSvg(papelVentana, 'papel-ventana'),
  'ramas-unidas': trazadoSvg(ramasUnidas, 'ramas-unidas'),
  ramas: trazadoSvg(ramas, 'ramas'),
  terminal: trazadoSvg(terminal, 'terminal'),
};
/** Iconos de lucide y propios de la marca (`iconoDe`) en el mismo hueco. */
type Icono = ComponentType<{ 'aria-hidden'?: 'true' }>;

const ICONO_LINEA: Record<Linea, Icono> = {
  'ia-local': iconoDe(ICONOS.codigo),
  mundos: iconoDe(ICONOS.mundos),
  informacion: iconoDe(ICONOS['documento-check']),
  producto: iconoDe(ICONOS['papel-ventana']),
  metodo: iconoDe(ICONOS.compas),
};
const PRINCIPIOS: [Icono, 'valor1' | 'valor2' | 'valor3' | 'valor4'][] = [
  [iconoDe(ICONOS.candado), 'valor1'],
  [iconoDe(ICONOS.mira), 'valor2'],
  [iconoDe(ICONOS.historial), 'valor3'],
  [iconoDe(ICONOS['ramas-unidas']), 'valor4'],
];

/** «A, B y C» en el idioma de la página; sin Intl.ListFormat (navegadores viejos), con comas. */
function listar(nombres: string[], idioma: string) {
  return typeof Intl.ListFormat === 'function'
    ? new Intl.ListFormat(idioma, { type: 'conjunction' }).format(nombres)
    : nombres.join(', ');
}

export function Inicio() {
  const { t, tx, idioma } = useIdioma();
  const ultimaEntrada = entradas[0];
  const [filtro, setFiltro] = useState<EstadoProyecto | 'todos'>('todos');

  const conContacto = proyectos.filter((p) => p.contacto);
  const privados = proyectos.filter((p) => p.colaboracion === 'privada');
  const visibles = proyectos.filter((p) => filtro === 'todos' || p.estado === filtro);
  const cuenta = (e: EstadoProyecto) => proyectos.filter((p) => p.estado === e).length;
  // El collage de la portada tiene tres piezas por las que pasan todos los proyectos: cada pocos segundos las imágenes
  // avanzan una posición con un fundido (quieto si el sistema pide menos movimiento o la pestaña no se ve). Cada pieza
  // enseña la imagen de presentación del proyecto o, si no tiene, su portada.
  const [giro, setGiro] = useState(0);
  const total = proyectos.length;
  useEffect(() => {
    if (total <= 3 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => {
      if (!document.hidden) setGiro((g) => (g + 1) % total);
    }, 5000);
    return () => window.clearInterval(id);
  }, [total]);
  // Mismo título que la página estática (los pares «: » de la frase pasan a «, »).
  useEffect(() => {
    document.title = `Galivelop · ${t('hero.antetitulo').replace(':', ',')}`;
  }, [t]);
  const piezas = [0, 1, 2].map((i) => proyectos[(giro + i) % total]).filter(Boolean);

  return (
    <>
      <section className="hero" data-guion="cabecera">
        <img className="hero-fondo" src={ruta('/marca/isobatas.svg')} alt="" aria-hidden="true" />
        <div className="contenedor hero-rejilla">
          <div className="hero-texto">
            <p className="antetitulo">{t('hero.antetitulo')}</p>
            <h1>
              {t('hero.titulo1')} <span className="destacado">{t('hero.titulo2')}</span>
            </h1>
            <p className="hero-parrafo">{t('hero.texto')}</p>
            <div className="hero-botones">
              <a href="#proyectos" className="boton boton-primario">
                {t('hero.cta.taller')} <ArrowDown size={18} />
              </a>
              <Link to="/novedades" className="boton boton-secundario">
                {t('hero.cta.novedades')} <ArrowRight size={16} />
              </Link>
            </div>
            <dl className="hero-resumen">
              <div>
                <dt>{t('hero.resumen.proyectos')}</dt>
                <dd>{proyectos.length}</dd>
              </div>
              <div>
                <dt>{t('hero.resumen.publicados')}</dt>
                <dd>{cuenta('publicado')}</dd>
              </div>
              <div>
                <dt>{t('hero.resumen.desarrollo')}</dt>
                <dd>{cuenta('desarrollo') + cuenta('diseno')}</dd>
              </div>
            </dl>
          </div>
          <div className="hero-collage" aria-hidden="true">
            {piezas.map((activo, i) => (
              <div
                key={i}
                className={`collage-pieza collage-${i}`}
                style={{ borderColor: activo.acento }}
              >
                {proyectos.map((p) => (
                  <img
                    key={p.slug}
                    src={ruta((p.presentacion ?? p.portada).mini)}
                    alt=""
                    className={p === activo ? 'activa' : undefined}
                    loading={p === activo ? undefined : 'lazy'}
                  />
                ))}
                <span key={activo.slug}>{activo.nombre}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="proyectos" className="seccion seccion-taller">
        <div className="contenedor">
          <header className="seccion-cabecera">
            <div>
              <p className="antetitulo antetitulo-taller">{t('inicio.taller.antetitulo')}</p>
              <h2>{t('proyectos.titulo')}</h2>
              <p className="seccion-nota">{t('inicio.taller.texto')}</p>
              <p>{t('proyectos.texto')}</p>
            </div>
            {proyectos.length >= FILTRAR_DESDE && (
              <div className="filtros" role="group" aria-label={t('proyectos.titulo')}>
                {FILTROS.filter((f) => f === 'todos' || cuenta(f) > 0).map((f) => (
                  <button
                    key={f}
                    type="button"
                    aria-pressed={filtro === f}
                    onClick={() => setFiltro(f)}
                  >
                    {f === 'todos' ? t('filtro.todos') : t(`estado.${f}`)}
                    <span className="filtro-cuenta">
                      {f === 'todos' ? proyectos.length : cuenta(f)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </header>
          {visibles.length > 0 ? (
            <div className="rejilla-proyectos">
              {visibles.map((p) => (
                <TarjetaProyecto key={p.slug} proyecto={p} />
              ))}
            </div>
          ) : (
            <p className="vacio">{t('filtro.vacio')}</p>
          )}
          {filtro === 'todos' && proximos.length > 0 && (
            <>
              <Separador />
              <section
                className="proximamente"
                data-guion="proximamente"
                aria-labelledby="proximamente-titulo"
              >
                <header>
                  <h3 id="proximamente-titulo">{t('proximamente.titulo')}</h3>
                  <p>{t('proximamente.texto')}</p>
                </header>
                <div className="rejilla-proximos">
                  {proximos.map((p) => (
                    <TarjetaProxima key={p.slug} proximo={p} />
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </section>

      <section id="lineas" className="seccion seccion-alterna">
        <div className="contenedor">
          <header className="seccion-cabecera">
            <div>
              <h2>{t('lineas.titulo')}</h2>
              <p>{t('lineas.texto')}</p>
            </div>
          </header>
          <ul className="lineas" style={{ '--lineas': LINEAS.length } as CSSProperties}>
            {LINEAS.map((l) => {
              const IconoLinea = ICONO_LINEA[l];
              const suyos = proyectos.filter((p) => p.lineas.includes(l));
              return (
                <li key={l} data-guion={`linea-${l}`}>
                  <IconoLinea aria-hidden="true" />
                  <h3>{t(`linea.${l}.titulo`)}</h3>
                  <p>{t(`linea.${l}.texto`)}</p>
                  <ul className="lineas-proyectos">
                    {suyos.map((p) => (
                      <li key={p.slug}>
                        <Link to={`/proyectos/${p.slug}`}>{p.nombre}</Link>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section id="sobre" className="seccion">
        <div className="contenedor sobre-rejilla">
          <div>
            <h2>{t('sobre.titulo')}</h2>
            <p>{t('sobre.texto1')}</p>
            <p>{t('sobre.texto2')}</p>
            <p>
              {t('sobre.texto3')} <Link to="/equipo">{t('sobre.verEquipo')} →</Link>
            </p>
            <p className="sobre-nombre">
              {/* Sello del taller (recurso 5), como firma junto al nombre. */}
              <img
                className="sobre-sello"
                src={ruta('marca/sello.webp')}
                alt=""
                width={144}
                height={144}
                loading="lazy"
              />
              <span className="sobre-marca" aria-hidden="true">
                <b>Gali</b>cia + De<b>velop</b>
              </span>
              {t('sobre.nombre')}
            </p>
          </div>
          <ol className="valores">
            {PRINCIPIOS.map(([IconoPrincipio, v]) => (
              <li key={v} data-guion={`principio-${v}`}>
                <IconoPrincipio aria-hidden="true" />
                <h3>{t(`${v}.titulo`)}</h3>
                <p>{t(`${v}.texto`)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="participa" className="seccion seccion-alterna">
        <div className="contenedor contacto">
          <MarcaGV tamano={56} />
          <h2>{t('contacto.titulo')}</h2>
          <p>{t('contacto.texto')}</p>
          <ul className="vias">
            <li data-guion="via-unirse">
              <Link to="/participa/unirse" className="via">
                <IconoSvg icono={ICONOS.ramas} />
                <h3>{t('via1.titulo')}</h3>
                <p>{t('via1.texto')}</p>
                <span className="via-ir">
                  {t('form.ir')} <ArrowRight size={16} />
                </span>
              </Link>
            </li>
            <li data-guion="via-proponer">
              <Link to="/participa/proponer" className="via">
                <IconoSvg icono={ICONOS.bombilla} />
                <h3>{t('via2.titulo')}</h3>
                <p>{t('via2.texto')}</p>
                <span className="via-ir">
                  {t('form.ir')} <ArrowRight size={16} />
                </span>
              </Link>
            </li>
            <li data-guion="via-aprender">
              <Link to="/participa/unirse?modo=aprender" className="via">
                <IconoSvg icono={ICONOS.terminal} />
                <h3>{t('via3.titulo')}</h3>
                <p>{t('via3.texto')}</p>
                <span className="via-ir">
                  {t('form.ir')} <ArrowRight size={16} />
                </span>
              </Link>
            </li>
          </ul>
          <aside className="proyecto-propio" data-guion="proyecto-propio">
            <span className="proyecto-propio-icono" aria-hidden="true">
              <IconoSvg icono={ICONOS.implantacion} />
            </span>
            <div>
              <h3>{t('proyectoPropio.titulo')}</h3>
              <p>{t('proyectoPropio.texto')}</p>
            </div>
            <Link to="/equipo" className="boton boton-secundario">
              {t('proyectoPropio.boton')} <ArrowRight size={16} />
            </Link>
          </aside>
          <Separador />
          <div className="participa-guia" data-guion="como-funciona">
            <div>
              <h3>{t('paraquien.titulo')}</h3>
              <ul className="lista-check">
                {(['paraquien.1', 'paraquien.2', 'paraquien.3', 'paraquien.4'] as const).map(
                  (k) => (
                    <li key={k}>
                      <Check size={18} aria-hidden="true" /> {t(k)}
                    </li>
                  ),
                )}
              </ul>
            </div>
            <div>
              <h3>{t('pasos.titulo')}</h3>
              <ol className="pasos">
                {(['paso.1', 'paso.2', 'paso.3', 'paso.4'] as const).map((k) => (
                  <li key={k}>{t(k)}</li>
                ))}
              </ol>
            </div>
          </div>
          <a
            className="discord"
            data-guion="discord"
            href={MARCA.discord}
            target="_blank"
            rel="noreferrer"
          >
            <span className="discord-icono">
              <IconoDiscord tamano={28} />
            </span>
            <span className="discord-texto">
              <strong>{t('discord.titulo')}</strong>
              <span>{t('discord.texto')}</span>
            </span>
            <span className="boton boton-discord">{t('discord.boton')}</span>
          </a>
          {privados.length > 0 && (
            <p className="nota-privado">
              <Lock size={16} aria-hidden="true" />{' '}
              {privados.length === 1
                ? t('participa.privado', { nombre: privados[0].nombre })
                : t('participa.privados', {
                    nombres: listar(
                      privados.map((p) => p.nombre),
                      idioma,
                    ),
                  })}
            </p>
          )}
          <p className="contacto-otros">
            <span>{t('contacto.otros')}</span>
            <a href={`mailto:${MARCA.correo}`}>
              <Mail size={15} /> {MARCA.correo}
            </a>
            <span className="contacto-sep" aria-hidden="true">
              ·
            </span>
            <a href={MARCA.discord} target="_blank" rel="noreferrer">
              <IconoDiscord tamano={15} /> Discord
            </a>
            <span className="contacto-sep" aria-hidden="true">
              ·
            </span>
            <a href={MARCA.github} target="_blank" rel="noreferrer">
              <IconoGitHub tamano={15} /> GitHub
            </a>
          </p>
          {conContacto.length > 0 && (
            <div className="contacto-proyectos">
              <h3>{t('contacto.porProyecto')}</h3>
              <ul>
                {conContacto.map((p) => (
                  <li key={p.slug}>
                    <span>{p.nombre}</span>
                    <a href={`mailto:${p.contacto}`}>{p.contacto}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {productos.length > 0 && (
        <section className="banda-productos">
          <div className="contenedor banda-productos-fila">
            <div>
              <h2>{t('productos.banda.titulo')}</h2>
              <p>{t('productos.banda.texto')}</p>
            </div>
            <ul className="banda-productos-nombres">
              {productos.map((p) => (
                <li key={p.slug}>{p.alias ?? p.nombre}</li>
              ))}
            </ul>
            <Link to="/productos" className="enlace-flecha">
              {t('productos.banda.ver')} <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      )}

      {ultimaEntrada && (
        <section className="banda-diario" data-guion="diario">
          <div className="contenedor banda-diario-fila">
            <div>
              <p className="banda-diario-etiqueta">{t('diario.titulo')}</p>
              <h2>{t('diario.banda.titulo')}</h2>
              <p>
                {t('diario.banda.texto')}{' '}
                <Link to={`/diario/${ultimaEntrada.slug}`}>{tx(ultimaEntrada.titulo)}</Link>
              </p>
              <p className="banda-diario-bajada">{tx(ultimaEntrada.bajada)}</p>
            </div>
            <Link to="/diario" className="enlace-flecha">
              {t('diario.banda.ver')} <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
