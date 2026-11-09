import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import type { Animacion } from '../data/tipos';
import { useIdioma } from '../i18n/Idioma';
import { GUIONES } from './animaciones';
import { componer, segun, type Atomo, type Rotulo } from './animaciones/tipos';

// Animaciones paso a paso de «Cómo funciona» (storyboard v3). Cada pestaña empieza quieta en su último paso, el
// reposo; Reproducir avanza una vez y se para. La narración va fuera del SVG, en un <p aria-live>, y el SVG la toma
// como nombre. Sin bibliotecas: cada átomo es un <g> que entra y sale con una transición de opacidad y posición.

/** Por debajo de este ancho de escena, el dibujo de móvil (más alto que ancho): así el texto no baja de 14 px. */
const ANCHO_ESCRITORIO = 896;
const DURACION = 5500;
const DURACION_REDUCIDA = 8000;

export interface Destino {
  id: string;
  paso: number;
  /** Cambia en cada petición, para que pedir dos veces el mismo paso también lleve hasta él. */
  n: number;
}

const reducido = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

function nivel(niveles: Record<number, number> | undefined, paso: number): number | null {
  if (!niveles) return null;
  let mejor: number | null = null;
  for (const [k, v] of Object.entries(niveles)) if (Number(k) <= paso) mejor = v;
  return mejor;
}

function Persona({ g }: { g: number[] }) {
  return (
    <g transform={`translate(${g[0]} ${g[1]}) scale(${g[2]})`}>
      <polygon className="pf" points="-4,-27 4,-27 10,-21 10,-15 4,-9 -4,-9 -10,-15 -10,-21" />
      <polygon className="pf" points="-16,24 -16,2 -8,-6 8,-6 16,2 16,24" />
    </g>
  );
}

function dibujo(
  a: Atomo,
  movil: boolean,
  texto: (r: Rotulo | null | undefined) => string,
  ids: string,
): ReactNode {
  const g = movil ? a.m : a.d;
  if (g == null) return null;
  if (a.k === 'L') {
    return (
      <path
        className={`ln ${segun(a.c, movil) ?? ''}`}
        d={g as string}
        markerEnd={a.flecha ? `url(#${ids}-mk-${a.flecha})` : undefined}
      />
    );
  }
  const n = g as number[];
  switch (a.k) {
    case 'B': {
      const [x, y, w, h] = n;
      const c = Math.min(movil ? 8 : 12, h / 3);
      const puntos = `${x},${y} ${x + w - c},${y} ${x + w},${y + c} ${x + w},${y + h} ${x},${y + h}`;
      const t = texto(segun(a.t, movil));
      const s = texto(segun(a.s, movil));
      const tx = x + (movil ? 12 : 16);
      const extra = a.tc ? ` ${a.tc}` : '';
      return (
        <>
          <polygon className={`bx ${segun(a.c, movil) ?? ''}`} points={puntos} />
          {s ? (
            <>
              <text className={(a.mono ? 'tm' : 'ti') + extra} x={tx} y={y + h * (a.ty ?? 0.44)}>
                {t}
              </text>
              <text className={'su' + extra} x={tx} y={y + h * 0.82}>
                {s}
              </text>
            </>
          ) : t ? (
            <text
              className={(a.plano || a.mono ? 'tm' : 'ti') + extra}
              x={tx}
              y={y + h / 2}
              dominantBaseline="central"
            >
              {t}
            </text>
          ) : null}
        </>
      );
    }
    case 'T':
      return (
        <text
          className={segun(a.c, movil)}
          x={n[0]}
          y={n[1]}
          textAnchor={segun(a.a, movil) ?? 'start'}
        >
          {texto(segun(a.t, movil))}
        </text>
      );
    case 'D':
      return <circle className={segun(a.c, movil)} cx={n[0]} cy={n[1]} r={n[2]} />;
    case 'M':
      return (
        <>
          <rect className="mo" x={n[0]} y={n[1]} width={n[2]} height={n[3]} />
          <rect className="mf" x={n[0]} y={n[1]} width={n[2]} height={n[3]} />
        </>
      );
    case 'R':
      return <rect className="mg" x={n[0]} y={n[1]} width={n[2]} height={n[3]} />;
    case 'P':
      return <Persona g={n} />;
  }
}

export default function AnimacionFlujo({
  animaciones,
  destino,
}: {
  animaciones: Animacion[];
  destino?: Destino | null;
}) {
  const { t, tx } = useIdioma();
  const ids = 'flujo' + useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const lista = animaciones.filter((a) => GUIONES[a.id]);
  const [actual, setActual] = useState(() => {
    const i = destino ? lista.findIndex((a) => a.id === destino.id) : -1;
    return Math.max(0, i);
  });
  const anim = lista[actual];
  const total = anim?.pasos.length ?? 0;
  const [paso, setPaso] = useState(() =>
    destino && lista[actual]?.id === destino.id ? destino.paso : total,
  );
  const [reproduciendo, setReproduciendo] = useState(false);
  const [movil, setMovil] = useState(
    () =>
      typeof window !== 'undefined' && document.documentElement.clientWidth < ANCHO_ESCRITORIO + 40,
  );
  const escena = useRef<HTMLDivElement>(null);
  const pieza = useRef<HTMLDivElement>(null);
  const pestanas = useRef<(HTMLButtonElement | null)[]>([]);
  const raiz = useRef<HTMLDivElement>(null);

  // Modo según el ancho real de la escena, no el de la ventana.
  useEffect(() => {
    const el = escena.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => setMovil(el.clientWidth < ANCHO_ESCRITORIO));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Reproducir: un paso cada 5,5 s (8 s con movimiento reducido) y se para en el último.
  useEffect(() => {
    if (!reproduciendo) return;
    const id = window.setTimeout(
      () => {
        if (paso >= total) setReproduciendo(false);
        else setPaso(paso + 1);
      },
      reducido() ? DURACION_REDUCIDA : DURACION,
    );
    return () => window.clearTimeout(id);
  }, [reproduciendo, paso, total]);

  // Un enlace de «Cómo funciona» pide una pestaña y un paso: se abre y se lleva la vista hasta aquí.
  const ultimoDestino = useRef(destino?.n);
  useEffect(() => {
    if (!destino || destino.n === ultimoDestino.current) return;
    ultimoDestino.current = destino.n;
    const i = lista.findIndex((a) => a.id === destino.id);
    if (i < 0) return;
    setReproduciendo(false);
    setActual(i);
    setPaso(Math.min(Math.max(1, destino.paso), lista[i].pasos.length));
    raiz.current?.scrollIntoView({ block: 'start', behavior: reducido() ? 'auto' : 'smooth' });
    pieza.current?.focus({ preventScroll: true });
  }, [destino, lista]);

  if (!anim) return null;
  const guion = GUIONES[anim.id];
  const etiqueta = (id: string) => (anim.etiquetas[id] ? tx(anim.etiquetas[id]) : id);
  const texto = (r: Rotulo | null | undefined) => componer(r, etiqueta);
  const actual1 = Math.min(Math.max(1, paso), total);
  const pasoActual = anim.pasos[actual1 - 1];

  const ir = (n: number) => {
    setReproduciendo(false);
    setPaso(Math.min(Math.max(1, n), total));
  };
  const elegir = (i: number, foco = false) => {
    setReproduciendo(false);
    setActual(i);
    setPaso(lista[i].pasos.length);
    if (foco) pestanas.current[i]?.focus();
  };
  const reproducir = () => {
    if (reproduciendo) {
      setReproduciendo(false);
      return;
    }
    // Desde el paso en el que está; desde el último (el reposo), vuelve a empezar.
    setPaso((p) => (p >= total ? 1 : p));
    setReproduciendo(true);
  };
  const teclaPestanas = (ev: KeyboardEvent) => {
    const n = lista.length;
    const k = ev.key;
    if (k !== 'ArrowRight' && k !== 'ArrowLeft' && k !== 'Home' && k !== 'End') return;
    ev.preventDefault();
    const j =
      k === 'Home' ? 0 : k === 'End' ? n - 1 : (actual + (k === 'ArrowRight' ? 1 : n - 1)) % n;
    elegir(j, true);
  };
  const teclaPieza = (ev: KeyboardEvent) => {
    if (ev.key === 'ArrowRight') {
      ev.preventDefault();
      ir(actual1 + 1);
    } else if (ev.key === 'ArrowLeft') {
      ev.preventDefault();
      ir(actual1 - 1);
    }
  };

  const W = movil ? 300 : 960;
  const H = movil ? 428 : 540;

  return (
    <div className="flujo" ref={raiz}>
      <div
        className="flujo-pestanas"
        role="tablist"
        aria-label={t('flujo.pestanas')}
        onKeyDown={teclaPestanas}
      >
        {lista.map((a, i) => (
          <button
            key={a.id}
            ref={(el) => {
              pestanas.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${ids}-tab-${a.id}`}
            aria-controls={`${ids}-panel`}
            aria-selected={i === actual}
            tabIndex={i === actual ? 0 : -1}
            className="flujo-pestana"
            onClick={() => elegir(i)}
          >
            <b>{tx(a.titulo)}</b>
            <span>{t('flujo.pasos', { n: a.pasos.length })}</span>
          </button>
        ))}
      </div>

      <div
        id={`${ids}-panel`}
        role="tabpanel"
        aria-labelledby={`${ids}-tab-${anim.id}`}
        className="flujo-pieza"
        ref={pieza}
        tabIndex={-1}
        onKeyDown={teclaPieza}
      >
        <div className="flujo-escena" ref={escena}>
          <svg
            key={`${anim.id}-${movil ? 'm' : 'd'}`}
            className="flujo-svg"
            data-modo={movil ? 'm' : 'd'}
            data-paso={actual1}
            viewBox={`0 0 ${W} ${H}`}
            role="img"
            aria-labelledby={`${ids}-pt ${ids}-narr`}
          >
            <defs>
              <pattern id={`${ids}-ret`} width="24" height="24" patternUnits="userSpaceOnUse">
                <path className="ret" d="M24 0H0V24" />
              </pattern>
              {(['cel', 'al', 'no'] as const).map((m) => (
                <marker
                  key={m}
                  id={`${ids}-mk-${m}`}
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                  markerUnits="userSpaceOnUse"
                >
                  <path className={`mk-${m}`} d="M0 0L10 5L0 10z" />
                </marker>
              ))}
            </defs>
            <rect className="fondo" width={W} height={H} />
            <rect width={W} height={H} fill={`url(#${ids}-ret)`} />
            {guion.atomos.map((a, i) => {
              const cuerpo = dibujo(a, movil, texto, ids);
              if (cuerpo == null) return null;
              const visibles = (movil && a.pasosMovil) || a.pasos;
              const on = visibles.has(actual1);
              const l = a.k === 'M' ? nivel(a.niveles, actual1) : null;
              return (
                <g
                  key={i}
                  className={`a${a.cae ? ' cae' : ''}${on ? ' on' : ''}`}
                  style={
                    {
                      '--d': `${a.dl ?? 0}s`,
                      ...(l != null ? { '--nivel': l } : {}),
                    } as CSSProperties
                  }
                >
                  {cuerpo}
                </g>
              );
            })}
          </svg>
        </div>

        <div className="flujo-debajo">
          <div className="flujo-lectura">
            <p className="flujo-posicion">{t('flujo.posicion', { n: actual1, total })}</p>
            <h4 className="flujo-paso-titulo" id={`${ids}-pt`}>
              {tx(pasoActual.titulo)}
            </h4>
            <p
              className="flujo-narracion"
              id={`${ids}-narr`}
              aria-live={reproduciendo ? 'off' : 'polite'}
            >
              {tx(pasoActual.narracion)}
            </p>
          </div>
          <div className="flujo-controles">
            <div className="flujo-botones">
              <button
                type="button"
                className="flujo-boton"
                onClick={() => ir(actual1 - 1)}
                disabled={actual1 <= 1}
              >
                {t('flujo.anterior')}
              </button>
              <button
                type="button"
                className="flujo-boton"
                onClick={() => ir(actual1 + 1)}
                disabled={actual1 >= total}
              >
                {t('flujo.siguiente')}
              </button>
              <button
                type="button"
                className="flujo-boton flujo-boton-primario"
                onClick={reproducir}
              >
                {reproduciendo ? t('flujo.parar') : t('flujo.reproducir')}
              </button>
            </div>
            <div className="flujo-progreso" aria-hidden="true">
              <i style={{ transform: `scaleX(${actual1 / total})` }} />
            </div>
            <ol className="flujo-lista" aria-label={t('flujo.lista')}>
              {anim.pasos.map((p, i) => (
                <li key={i}>
                  <button
                    type="button"
                    aria-current={i + 1 === actual1 ? 'step' : undefined}
                    onClick={() => ir(i + 1)}
                  >
                    <b>{i + 1}</b>
                    <span>{tx(p.titulo)}</span>
                  </button>
                </li>
              ))}
            </ol>
            <p className="flujo-ayuda">{t('flujo.ayuda')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
