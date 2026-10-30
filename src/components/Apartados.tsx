import { ArrowLeft, ArrowRight, ChevronDown, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ruta } from '../data/proyectos';
import type { Apartado, Imagen } from '../data/tipos';
import { useIdioma } from '../i18n/Idioma';
import { leerAncla } from '../utils/ancla';
import { Galeria } from './Galeria';
import { ImagenAmpliable } from './ImagenAmpliable';

const anclaDe = (a: Apartado) => `ap-${a.id}`;
const portadaDe = (a: Apartado): Imagen | undefined =>
  a.items.find((i) => i.imagen)?.imagen ?? a.grupos?.[0]?.imagenes[0];
const imagenesDe = (a: Apartado) => a.grupos?.reduce((n, g) => n + g.imagenes.length, 0) ?? 0;

/** Cambia el #ancla sin pasar por el router: la ficha no se vuelve a montar ni sube arriba. */
function ponerAncla(ancla: string) {
  const url = `${window.location.pathname}${window.location.search}${ancla ? `#${ancla}` : ''}`;
  window.history.replaceState(window.history.state, '', url);
}

/**
 * Los apartados propios del proyecto, como mosaico: cada uno se abre en una hoja encima de la página, con flechas
 * para pasar al anterior o al siguiente sin cerrarla. Una dirección con #ap-<id> abre su hoja al entrar.
 */
export function Apartados({ apartados }: { apartados: Apartado[] }) {
  const { t, tx } = useIdioma();
  const hoja = useRef<HTMLDialogElement>(null);
  const cuerpo = useRef<HTMLDivElement>(null);
  const [actual, setActual] = useState<number | null>(null);

  const abrir = useCallback(
    (i: number) => {
      setActual(i);
      ponerAncla(anclaDe(apartados[i]));
      if (!hoja.current?.open) hoja.current?.showModal();
      cuerpo.current?.scrollTo(0, 0);
    },
    [apartados],
  );

  // Entrar con #ap-<id> (o cambiarlo desde un enlace) abre ese apartado.
  useEffect(() => {
    const desdeAncla = () => {
      const ancla = leerAncla(window.location.hash);
      const i = apartados.findIndex((a) => anclaDe(a) === ancla);
      if (i >= 0) abrir(i);
    };
    desdeAncla();
    window.addEventListener('hashchange', desdeAncla);
    return () => window.removeEventListener('hashchange', desdeAncla);
  }, [apartados, abrir]);

  const a = actual === null ? undefined : apartados[actual];
  const total = apartados.length;

  return (
    <>
      <ul className="mosaico">
        {apartados.map((ap, i) => {
          const portada = portadaDe(ap);
          const n = ap.items.length || imagenesDe(ap);
          return (
            <li key={ap.id} id={anclaDe(ap)}>
              <button
                type="button"
                className="mosaico-pieza"
                onClick={() => abrir(i)}
                aria-haspopup="dialog"
              >
                {portada ? (
                  <img
                    src={ruta(portada.mini)}
                    alt=""
                    loading="lazy"
                    width={portada.ancho}
                    height={portada.alto}
                  />
                ) : (
                  <span className="mosaico-inicial" aria-hidden="true">
                    {tx(ap.titulo).charAt(0)}
                  </span>
                )}
                <span className="mosaico-texto">
                  <strong>{tx(ap.titulo)}</strong>
                  {n > 0 && (
                    <span>
                      {t(ap.items.length ? 'afondo.elementos' : 'afondo.imagenes', { n })}
                    </span>
                  )}
                </span>
                <ArrowRight className="mosaico-flecha" size={18} aria-hidden="true" />
              </button>
            </li>
          );
        })}
      </ul>

      <dialog
        ref={hoja}
        className="hoja"
        aria-labelledby="hoja-titulo"
        onClose={(e) => {
          // React también pasa aquí el cierre de los diálogos de dentro (la imagen ampliada): esos no cierran la hoja.
          if (e.target !== e.currentTarget) return;
          setActual(null);
          ponerAncla('');
        }}
        onClick={(e) => e.target === hoja.current && hoja.current.close()}
      >
        {a && actual !== null && (
          <div className="hoja-caja">
            <header className="hoja-cabecera">
              <h2 id="hoja-titulo">{tx(a.titulo)}</h2>
              <span className="hoja-posicion">
                {actual + 1} / {total}
              </span>
              <div className="hoja-botones">
                <button
                  type="button"
                  className="boton-icono"
                  onClick={() => abrir((actual - 1 + total) % total)}
                  aria-label={t('apartado.anterior')}
                  title={t('apartado.anterior')}
                  disabled={total < 2}
                >
                  <ArrowLeft size={18} />
                </button>
                <button
                  type="button"
                  className="boton-icono"
                  onClick={() => abrir((actual + 1) % total)}
                  aria-label={t('apartado.siguiente')}
                  title={t('apartado.siguiente')}
                  disabled={total < 2}
                >
                  <ArrowRight size={18} />
                </button>
                <button
                  type="button"
                  className="boton-icono"
                  onClick={() => hoja.current?.close()}
                  aria-label={t('galeria.cerrar')}
                >
                  <X size={18} />
                </button>
              </div>
            </header>
            <div className="hoja-cuerpo" ref={cuerpo}>
              {a.intro && <p className="apartado-intro">{tx(a.intro)}</p>}
              {a.grupos && (
                <Galeria
                  key={a.id}
                  grupos={a.grupos.map((g) => ({
                    id: g.id,
                    etiqueta: tx(g.etiqueta),
                    imagenes: g.imagenes,
                  }))}
                  rotar={false}
                />
              )}
              {a.items.length > 0 && (
                // key: al pasar de un apartado a otro, sus elementos no heredan el estado (un «Ver el detalle» abierto).
                <ul key={a.id} className="apartado-items">
                  {a.items.map((item, i) => (
                    // Por posición: dos elementos pueden llamarse igual (dos «Parche de arreglos»).
                    <li key={i} className={item.imagen ? 'con-imagen' : undefined}>
                      {item.imagen && <ImagenAmpliable imagen={item.imagen} />}
                      <div className="apartado-cabecera">
                        <h3>{tx(item.nombre)}</h3>
                        {item.valor && <span className="apartado-valor">{item.valor}</span>}
                      </div>
                      <p>{tx(item.texto)}</p>
                      {item.detalle?.length ? (
                        <details className="apartado-detalle">
                          <summary>
                            {t('afondo.detalle')} <ChevronDown size={16} aria-hidden="true" />
                          </summary>
                          <ul>
                            {item.detalle.map((d, j) => (
                              <li key={j}>{tx(d)}</li>
                            ))}
                          </ul>
                        </details>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
              {total > 1 && (
                <button
                  type="button"
                  className="hoja-siguiente"
                  onClick={() => abrir((actual + 1) % total)}
                >
                  <span>{t('apartado.siguiente')}</span>
                  <strong>
                    {tx(apartados[(actual + 1) % total].titulo)}{' '}
                    <ArrowRight size={16} aria-hidden="true" />
                  </strong>
                </button>
              )}
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
