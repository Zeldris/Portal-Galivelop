import { ChevronLeft, ChevronRight, Maximize2, Pause, Play, X } from 'lucide-react';
import { Fragment, useCallback, useEffect, useRef, useState, type KeyboardEvent, type TouchEvent } from 'react';
import { ruta } from '../data/proyectos';
import type { Imagen } from '../data/tipos';
import { useIdioma } from '../i18n/Idioma';

/** Un bloque de la galería (p. ej. capturas del juego o ilustraciones). */
export interface GrupoGaleria {
  id: string;
  etiqueta: string;
  imagenes: Imagen[];
}

/** Tiempo que se ve cada imagen en la rotación automática. */
const INTERVALO = 6000;
/** Tras usar la galería a mano, la rotación vuelve sola pasado este tiempo sin tocarla. */
const PAUSA_POR_USO = 3 * 60 * 1000;

const prefiereMenosMovimiento = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * Carrusel con miniaturas, teclado, gesto de deslizar y vista ampliada a pantalla completa.
 * Con varios grupos, todas las imágenes forman una sola lista y las pestañas marcan en qué grupo
 * está la imagen actual (pulsarlas salta al principio del grupo). Rota sola en bucle; al usarla a
 * mano se para y vuelve a rotar tras PAUSA_POR_USO sin tocarla. El botón de pausa la para del todo.
 */
export function Galeria({ grupos }: { grupos: GrupoGaleria[] }) {
  const { t, tx } = useIdioma();
  const conImagenes = grupos.filter((g) => g.imagenes.length > 0);
  const lista = conImagenes.flatMap((g, gi) => g.imagenes.map((imagen) => ({ imagen, grupo: gi })));
  const inicios = conImagenes.map((_, gi) => lista.findIndex((e) => e.grupo === gi));
  const total = lista.length;

  const [actual, setActual] = useState(0);
  // Pausa pedida con el botón: no se reanuda sola.
  const [pausada, setPausada] = useState(prefiereMenosMovimiento);
  // Pausa por uso a mano: hasta esta marca de tiempo.
  const [usoHasta, setUsoHasta] = useState(0);
  const [visible, setVisible] = useState(true);
  const [encima, setEncima] = useState(false);
  const [ampliada, setAmpliada] = useState(false);

  const raiz = useRef<HTMLDivElement>(null);
  const dialogo = useRef<HTMLDialogElement>(null);
  const miniaturas = useRef<HTMLDivElement>(null);
  const inicioToque = useRef<number | null>(null);

  const usarAMano = useCallback(() => setUsoHasta(Date.now() + PAUSA_POR_USO), []);
  const ir = useCallback((i: number) => setActual(((i % total) + total) % total), [total]);
  const irAMano = (i: number) => {
    usarAMano();
    ir(i);
  };

  // Solo rota cuando la galería está a la vista y la pestaña del navegador activa.
  useEffect(() => {
    const el = raiz.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const [pestanaActiva, setPestanaActiva] = useState(() => typeof document === 'undefined' || !document.hidden);
  useEffect(() => {
    const cambio = () => setPestanaActiva(!document.hidden);
    document.addEventListener('visibilitychange', cambio);
    return () => document.removeEventListener('visibilitychange', cambio);
  }, []);

  // Fin de la pausa por uso: vuelve a renderizar cuando toca reanudar.
  const [, setReloj] = useState(0);
  useEffect(() => {
    const falta = usoHasta - Date.now();
    if (falta <= 0) return;
    const id = window.setTimeout(() => setReloj((n) => n + 1), falta + 50);
    return () => window.clearTimeout(id);
  }, [usoHasta]);

  const enUso = usoHasta > Date.now();
  const rotando = total > 1 && !pausada && !enUso && visible && pestanaActiva && !encima && !ampliada;

  useEffect(() => {
    if (!rotando) return;
    const id = window.setTimeout(() => ir(actual + 1), INTERVALO);
    return () => window.clearTimeout(id);
  }, [rotando, actual, ir]);

  // Mantiene visible la miniatura activa (solo se desplaza la tira, nunca la página).
  useEffect(() => {
    const tira = miniaturas.current;
    const activa = tira?.querySelector<HTMLElement>(`[data-i="${actual}"]`);
    if (tira && activa) {
      tira.scrollTo({ left: activa.offsetLeft - (tira.clientWidth - activa.clientWidth) / 2, behavior: 'smooth' });
    }
  }, [actual]);

  if (total === 0) return null;
  const { imagen, grupo } = lista[actual];

  const teclado = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') irAMano(actual - 1);
    if (e.key === 'ArrowRight') irAMano(actual + 1);
  };
  const tocar = (e: TouchEvent) => {
    inicioToque.current = e.touches[0].clientX;
  };
  const soltar = (e: TouchEvent) => {
    if (inicioToque.current === null) return;
    const dx = e.changedTouches[0].clientX - inicioToque.current;
    if (Math.abs(dx) > 40) irAMano(actual + (dx < 0 ? 1 : -1));
    inicioToque.current = null;
  };
  const alternarPausa = () => {
    if (pausada || enUso) {
      setPausada(false);
      setUsoHasta(0);
    } else {
      setPausada(true);
    }
  };

  const controles = (
    <>
      <button type="button" className="galeria-flecha izq" onClick={() => irAMano(actual - 1)} aria-label={t('galeria.anterior')}>
        <ChevronLeft size={22} />
      </button>
      <button type="button" className="galeria-flecha der" onClick={() => irAMano(actual + 1)} aria-label={t('galeria.siguiente')}>
        <ChevronRight size={22} />
      </button>
    </>
  );

  return (
    <div className="galeria" ref={raiz} onKeyDown={teclado}>
      {conImagenes.length > 1 && (
        <div className="galeria-grupos" role="group" aria-label={t('sec.galeria')}>
          {conImagenes.map((g, gi) => (
            <button
              key={g.id}
              type="button"
              className="galeria-grupo"
              aria-pressed={gi === grupo}
              onClick={() => irAMano(inicios[gi])}
            >
              {g.etiqueta}
              <span className="galeria-grupo-total">{g.imagenes.length}</span>
            </button>
          ))}
        </div>
      )}

      <div
        className="galeria-escenario"
        onTouchStart={tocar}
        onTouchEnd={soltar}
        onPointerEnter={(e) => e.pointerType === 'mouse' && setEncima(true)}
        onPointerLeave={() => setEncima(false)}
      >
        <img key={`fondo-${imagen.src}`} src={ruta(imagen.mini)} alt="" className="galeria-fondo" aria-hidden="true" />
        <img
          key={imagen.src}
          src={ruta(imagen.src)}
          alt={tx(imagen.alt)}
          width={imagen.ancho}
          height={imagen.alto}
          className="galeria-imagen"
        />
        {total > 1 && controles}
        {total > 1 && (
          <button
            type="button"
            className="galeria-pausa"
            onClick={alternarPausa}
            aria-label={pausada || enUso ? t('galeria.reanudar') : t('galeria.pausar')}
          >
            {pausada || enUso ? <Play size={16} /> : <Pause size={16} />}
          </button>
        )}
        <button
          type="button"
          className="galeria-ampliar"
          onClick={() => {
            usarAMano();
            setAmpliada(true);
            dialogo.current?.showModal();
          }}
          aria-label={t('galeria.ampliar')}
        >
          <Maximize2 size={18} />
        </button>
        {rotando && (
          <span className="galeria-progreso" aria-hidden="true">
            <span key={actual} style={{ animationDuration: `${INTERVALO}ms` }} />
          </span>
        )}
      </div>
      <div className="galeria-pie">
        <p className="galeria-leyenda">{tx(imagen.alt)}</p>
        <p className="galeria-contador" aria-live={rotando ? 'off' : 'polite'}>
          {t('galeria.posicion', { n: actual + 1, total })}
        </p>
      </div>
      {total > 1 && (
        <div className="galeria-miniaturas" ref={miniaturas}>
          {lista.map((e, i) => (
            <Fragment key={e.imagen.src}>
              {i > 0 && e.grupo !== lista[i - 1].grupo && <span className="galeria-separador" aria-hidden="true" />}
              <button
                type="button"
                className="galeria-miniatura"
                data-i={i}
                aria-current={i === actual}
                aria-label={tx(e.imagen.alt)}
                onClick={() => irAMano(i)}
              >
                <img src={ruta(e.imagen.mini)} alt="" loading="lazy" />
              </button>
            </Fragment>
          ))}
        </div>
      )}

      <dialog
        ref={dialogo}
        className="galeria-dialogo"
        onClose={() => {
          setAmpliada(false);
          usarAMano();
        }}
        onClick={(e) => e.target === dialogo.current && dialogo.current.close()}
        onTouchStart={tocar}
        onTouchEnd={soltar}
      >
        <figure>
          <img src={ruta(imagen.src)} alt={tx(imagen.alt)} />
          <figcaption>
            {tx(imagen.alt)} · {t('galeria.posicion', { n: actual + 1, total })}
          </figcaption>
        </figure>
        {total > 1 && controles}
        <button type="button" className="galeria-cerrar" onClick={() => dialogo.current?.close()} aria-label={t('galeria.cerrar')}>
          <X size={22} />
        </button>
      </dialog>
    </div>
  );
}
