import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useIdioma } from '../i18n/Idioma';
import {
  buscarSeccion,
  claveDeGuion,
  enfoqueEn,
  gestoPausa,
  rutaAudio,
  rutaNormal,
  teclaPausa,
  type Guion,
} from '../utils/guion';
import { Icono } from './Icono';
import { ChevronLeft, ChevronRight, Pause, Play, X } from 'lucide-react';

const BASE = import.meta.env.BASE_URL;
const RESALTADO = 'guion-activo';
const ENFOCADO = 'guion-enfoque';
const guiones = import.meta.glob<{ default: Guion }>('../data/guiones/*.json');

function quitarResaltado() {
  document
    .querySelectorAll(`.${RESALTADO}, .${ENFOCADO}`)
    .forEach((e) => e.classList.remove(RESALTADO, ENFOCADO));
}

const sinMovimiento = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Centra el elemento en la ventana; si es más alto que ella, deja visible su inicio. */
function mostrar(el: HTMLElement, centrar: boolean) {
  const cabe = el.getBoundingClientRect().height <= window.innerHeight * 0.9;
  el.scrollIntoView({
    behavior: sinMovimiento() ? 'auto' : 'smooth',
    block: centrar && cabe ? 'center' : 'start',
  });
}

/**
 * Lector de la página: recorre las secciones del guion (como una presentación), baja hasta cada una, la resalta y
 * reproduce su audio pregrabado. Solo se monta con un guion que tenga audio en el idioma activo.
 */
export function Lector() {
  const { idioma, t } = useIdioma();
  const { pathname } = useLocation();
  const clave = claveDeGuion(pathname);
  const [guion, setGuion] = useState<Guion | null>(null);
  const [abierto, setAbierto] = useState(false);
  const [indice, setIndice] = useState(0);
  const [sonando, setSonando] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);
  const precarga = useRef<HTMLAudioElement | null>(null);
  const hayGuion = guion !== null;
  const trozos = guion?.trozos ?? [];

  // El guion de esta ruta; solo vale si su `pagina` coincide y tiene audio en el idioma activo.
  useEffect(() => {
    setGuion(null);
    const carga = guiones[`../data/guiones/${clave}.json`];
    if (!carga) return;
    let vigente = true;
    carga().then(
      (m) => {
        const g = m.default;
        if (
          vigente &&
          rutaNormal(g.pagina) === rutaNormal(pathname) &&
          g.audio?.includes(idioma) &&
          g.trozos.length > 0
        )
          setGuion(g);
      },
      () => undefined,
    );
    return () => {
      vigente = false;
    };
  }, [clave, idioma, pathname]);

  const liberar = useCallback(() => {
    if (precarga.current) {
      precarga.current.removeAttribute('src');
      precarga.current.load();
    }
  }, []);

  const parar = useCallback(() => {
    audio.current?.pause();
    quitarResaltado();
    setSonando(false);
  }, []);

  const cerrar = useCallback(() => {
    parar();
    liberar();
    setAbierto(false);
    setIndice(0);
  }, [parar, liberar]);

  // Cambiar de página o de idioma cierra el lector.
  useEffect(() => cerrar, [pathname, idioma, cerrar]);

  // Qué trozo suena y a qué elemento está enfocado (para no repetir el scroll en cada `timeupdate`).
  const enCurso = useRef<{ i: number; ver: string | null }>({ i: 0, ver: null });
  // Coloca la vista según el instante del trozo `i` (fracción del audio): el elemento del enfoque que toca, centrado.
  const colocar = useCallback(
    (i: number, fraccion: number): boolean => {
      const trozo = trozos[i];
      if (!trozo) return false;
      const enfoque = enfoqueEn(trozo.es, trozo.enfoques, fraccion);
      if (!enfoque) return false;
      if (enCurso.current.i === i && enCurso.current.ver === enfoque.ver) return true;
      enCurso.current = { i, ver: enfoque.ver };
      document.querySelectorAll('.' + ENFOCADO).forEach((e) => e.classList.remove(ENFOCADO));
      const el = buscarSeccion(enfoque.ver);
      if (!el) return false;
      el.classList.add(ENFOCADO);
      mostrar(el, true);
      return true;
    },
    [trozos],
  );
  const colocarAhora = () => {
    const a = audio.current;
    if (a && Number.isFinite(a.duration) && a.duration > 0)
      colocar(enCurso.current.i, a.currentTime / a.duration);
  };
  const alActualizar = useRef<() => void>(() => undefined);
  alActualizar.current = colocarAhora;

  const reproducir = useCallback(
    (i: number) => {
      const trozo = trozos[i];
      if (!trozo) return;
      quitarResaltado();
      const el = buscarSeccion(trozo.seccion);
      el?.classList.add(RESALTADO);
      enCurso.current = { i, ver: null };
      if (!colocar(i, 0) && el) mostrar(el, false);
      const a = (audio.current ??= new Audio());
      a.src = rutaAudio(BASE, idioma, clave, i, trozo.seccion);
      void a.play().then(
        () => setSonando(true),
        () => setSonando(false),
      );
      // Solo el siguiente MP3 se precarga.
      const sig = trozos[i + 1];
      if (sig) {
        const p = (precarga.current ??= new Audio());
        p.preload = 'auto';
        p.src = rutaAudio(BASE, idioma, clave, i + 1, sig.seccion);
      }
      setIndice(i);
    },
    [trozos, idioma, clave, colocar],
  );

  // Al acabar un trozo, el siguiente; tras el último, se cierra solo.
  const alAcabar = useRef<() => void>(() => undefined);
  alAcabar.current = () => (indice + 1 < trozos.length ? reproducir(indice + 1) : cerrar());
  useEffect(() => {
    const a = (audio.current ??= new Audio());
    const fin = () => alAcabar.current();
    const avance = () => alActualizar.current();
    a.addEventListener('ended', fin);
    a.addEventListener('error', fin);
    a.addEventListener('timeupdate', avance);
    return () => {
      a.removeEventListener('ended', fin);
      a.removeEventListener('error', fin);
      a.removeEventListener('timeupdate', avance);
      a.pause();
      a.removeAttribute('src');
      a.load();
      if (precarga.current) {
        precarga.current.removeAttribute('src');
        precarga.current.load();
      }
    };
  }, []);

  // Un gesto de scroll de la persona pausa la lectura (el scroll del propio lector no cuenta: no es un gesto).
  useEffect(() => {
    if (!abierto || !sonando) return;
    const pausar = () => {
      audio.current?.pause();
      setSonando(false);
    };
    const gesto = (e: Event) => {
      if (gestoPausa(e.target as Element | null)) pausar();
    };
    const tecla = (e: KeyboardEvent) => {
      if (teclaPausa(e.key, e.target as Element | null)) pausar();
    };
    window.addEventListener('wheel', gesto, { passive: true });
    window.addEventListener('touchmove', gesto, { passive: true });
    window.addEventListener('keydown', tecla);
    return () => {
      window.removeEventListener('wheel', gesto);
      window.removeEventListener('touchmove', gesto);
      window.removeEventListener('keydown', tecla);
    };
  }, [abierto, sonando]);

  if (!hayGuion) return null;

  const abrir = () => {
    setAbierto(true);
    reproducir(0);
  };
  const alternar = () => {
    if (sonando) {
      audio.current?.pause();
      setSonando(false);
    } else if (audio.current?.src && !audio.current.ended) {
      // Al reanudar se vuelve al enfoque (o a la sección) que toca en este instante.
      const trozo = trozos[indice];
      const a = audio.current;
      const fraccion =
        Number.isFinite(a.duration) && a.duration > 0 ? a.currentTime / a.duration : 0;
      const enfoque = enfoqueEn(trozo.es, trozo.enfoques, fraccion);
      const el = buscarSeccion(enfoque?.ver ?? trozo.seccion);
      if (el) mostrar(el, !!enfoque);
      void a.play().then(
        () => setSonando(true),
        () => setSonando(false),
      );
    } else reproducir(indice);
  };
  const ir = (i: number) => i >= 0 && i < trozos.length && reproducir(i);
  const posicion = t('lector.seccion', { n: indice + 1, total: trozos.length });

  if (!abierto) {
    return (
      <button type="button" className="lector-boton" onClick={abrir} aria-label={t('lector.abrir')}>
        <Play size={22} strokeWidth={1.75} aria-hidden="true" />
      </button>
    );
  }
  return (
    <div className="lector" role="region" aria-label={t('lector.region')}>
      <button
        type="button"
        onClick={() => ir(indice - 1)}
        disabled={indice === 0}
        aria-label={t('lector.anterior')}
      >
        <ChevronLeft size={20} aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={alternar}
        aria-label={sonando ? t('lector.pausar') : t('lector.reanudar')}
      >
        {sonando ? <Pause size={20} aria-hidden="true" /> : <Play size={20} aria-hidden="true" />}
      </button>
      <button
        type="button"
        onClick={() => ir(indice + 1)}
        disabled={indice + 1 >= trozos.length}
        aria-label={t('lector.siguiente')}
      >
        <ChevronRight size={20} aria-hidden="true" />
      </button>
      <p className="lector-posicion" aria-live="polite" aria-label={posicion}>
        <Icono nombre="audio" tamano={16} /> {indice + 1}/{trozos.length}
      </p>
      <button type="button" onClick={cerrar} aria-label={t('lector.cerrar')}>
        <X size={20} aria-hidden="true" />
      </button>
    </div>
  );
}
