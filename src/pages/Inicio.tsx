import { ArrowDown, Compass, Layers, Mail, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { IconoGitHub } from '../components/IconoGitHub';
import { MarcaGD } from '../components/Logo';
import { TarjetaProyecto } from '../components/TarjetaProyecto';
import { MARCA } from '../data/marca';
import { proyectos, ruta } from '../data/proyectos';
import type { EstadoProyecto } from '../data/tipos';
import { useIdioma } from '../i18n/Idioma';

const FILTROS: (EstadoProyecto | 'todos')[] = ['todos', 'publicado', 'desarrollo', 'diseno'];

export function Inicio() {
  const { t } = useIdioma();
  const [filtro, setFiltro] = useState<EstadoProyecto | 'todos'>('todos');

  const conContacto = proyectos.filter((p) => p.contacto);
  const visibles = proyectos.filter((p) => filtro === 'todos' || p.estado === filtro);
  const cuenta = (e: EstadoProyecto) => proyectos.filter((p) => p.estado === e).length;
  // El collage de la portada toma una imagen de cada proyecto (hasta tres).
  const collage = proyectos.slice(0, 3).map((p) => ({ p, img: p.galeria[0] ?? p.portada }));

  return (
    <>
      <section className="hero">
        <div className="hero-fondo" aria-hidden="true" />
        <div className="contenedor hero-rejilla">
          <div className="hero-texto">
            <p className="antetitulo">{t('hero.antetitulo')}</p>
            <h1>
              {t('hero.titulo1')} <span className="destacado">{t('hero.titulo2')}</span>
            </h1>
            <p className="hero-parrafo">{t('hero.texto')}</p>
            <div className="hero-botones">
              <a href="#proyectos" className="boton boton-primario">
                {t('hero.cta.proyectos')} <ArrowDown size={18} />
              </a>
              <a href="#sobre" className="boton boton-secundario">
                {t('hero.cta.sobre')}
              </a>
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
            {collage.map(({ p, img }, i) => (
              <div key={p.slug} className={`collage-pieza collage-${i}`} style={{ borderColor: p.acento }}>
                <img src={ruta(img.mini)} alt="" />
                <span>{p.nombre}</span>
              </div>
            ))}
            <div className="collage-marca">
              <MarcaGD tamano={84} />
            </div>
          </div>
        </div>
      </section>

      <section id="proyectos" className="seccion">
        <div className="contenedor">
          <header className="seccion-cabecera">
            <div>
              <h2>{t('proyectos.titulo')}</h2>
              <p>{t('proyectos.texto')}</p>
            </div>
            <div className="filtros" role="group" aria-label={t('proyectos.titulo')}>
              {FILTROS.filter((f) => f === 'todos' || cuenta(f) > 0).map((f) => (
                <button key={f} type="button" aria-pressed={filtro === f} onClick={() => setFiltro(f)}>
                  {f === 'todos' ? t('filtro.todos') : t(`estado.${f}`)}
                  <span className="filtro-cuenta">{f === 'todos' ? proyectos.length : cuenta(f)}</span>
                </button>
              ))}
            </div>
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
        </div>
      </section>

      <section id="sobre" className="seccion seccion-alterna">
        <div className="contenedor sobre-rejilla">
          <div>
            <h2>{t('sobre.titulo')}</h2>
            <p className="sobre-nombre" aria-hidden="true">
              <span>Gali</span>cia + De<span>velop</span>
            </p>
            <p>{t('sobre.texto1')}</p>
            <p>{t('sobre.texto2')}</p>
          </div>
          <ul className="valores">
            <li>
              <Layers aria-hidden="true" />
              <h3>{t('valor1.titulo')}</h3>
              <p>{t('valor1.texto')}</p>
            </li>
            <li>
              <Sparkles aria-hidden="true" />
              <h3>{t('valor2.titulo')}</h3>
              <p>{t('valor2.texto')}</p>
            </li>
            <li>
              <Compass aria-hidden="true" />
              <h3>{t('valor3.titulo')}</h3>
              <p>{t('valor3.texto')}</p>
            </li>
          </ul>
        </div>
      </section>

      <section id="contacto" className="seccion">
        <div className="contenedor contacto">
          <MarcaGD tamano={56} />
          <h2>{t('contacto.titulo')}</h2>
          <p>{t('contacto.texto')}</p>
          <div className="contacto-botones">
            <a className="boton boton-primario" href={`mailto:${MARCA.correo}`}>
              <Mail size={18} /> {t('contacto.correo')}
            </a>
            <a className="boton boton-secundario" href={MARCA.github} target="_blank" rel="noreferrer">
              <IconoGitHub /> {t('contacto.github')}
            </a>
          </div>
          <a className="contacto-correo" href={`mailto:${MARCA.correo}`}>
            {MARCA.correo}
          </a>
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
    </>
  );
}
