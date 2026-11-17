import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useIdioma } from '../i18n/Idioma';
import { buscarSeccion, claveDeGuion, rutaAudio, type Guion } from '../utils/guion';
import { Icono } from './Icono';
import { ChevronLeft, ChevronRight, Pause, Play, X } from 'lucide-react';

const BASE = import.meta.env.BASE_URL;
const RESALTADO = 'guion-activo';
const guiones = import.meta.glob<{ default: Guion }>('../data/guiones/*.json');

/** Teclas con las que la persona recorre la página por su cuenta: la lectura se pausa. */
const TECLAS_SCROLL = new Set([' ', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End']);

function quitarResaltado() {
  document.querySelectorAll('.' + RESALTADO).forEach((e) => e.classList.remove(RESALTADO));
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
        if (vigente && g.audio?.includes(idioma) && g.trozos.length > 0) setGuion(g);
      },
      () => undefined,
    );
    return () => {
      vigente = false;
    };
  }, [clave, idioma]);

  const parar = useCallback(() => {
    audio.current?.pause();
    quitarResaltado();
    setSonando(false);
  }, []);

  const cerrar = useCallback(() => {
    parar();
    setAbierto(false);
    setIndice(0);
  }, [parar]);

  // Cambiar de página o de idioma cierra el lector.
  useEffect(() => cerrar, [pathname, idioma, cerrar]);

  const reproducir = useCallback(
    (i: number) => {
      const trozo = trozos[i];
      if (!trozo) return;
      quitarResaltado();
      const el = buscarSeccion(trozo.seccion);
      if (el) {
        el.classList.add(RESALTADO);
        const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        el.scrollIntoView({ behavior: quieto ? 'auto' : 'smooth', block: 'start' });
      }
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
    [trozos, idioma, clave],
  );

  // Al acabar un trozo, el siguiente; tras el último, se cierra solo.
  const alAcabar = useRef<() => void>(() => undefined);
  alAcabar.current = () => (indice + 1 < trozos.length ? reproducir(indice + 1) : cerrar());
  useEffect(() => {
    const a = (audio.current ??= new Audio());
    const fin = () => alAcabar.current();
    a.addEventListener('ended', fin);
    return () => {
      a.removeEventListener('ended', fin);
      a.pause();
    };
  }, []);

  // Un gesto de scroll de la persona pausa la lectura (el scroll del propio lector no cuenta: no es un gesto).
  useEffect(() => {
    if (!abierto || !sonando) return;
    const pausar = () => {
      audio.current?.pause();
      setSonando(false);
    };
    const tecla = (e: KeyboardEvent) => {
      if (TECLAS_SCROLL.has(e.key) && !(e.target as HTMLElement).closest('.lector')) pausar();
    };
    window.addEventListener('wheel', pausar, { passive: true });
    window.addEventListener('touchmove', pausar, { passive: true });
    window.addEventListener('keydown', tecla);
    return () => {
      window.removeEventListener('wheel', pausar);
      window.removeEventListener('touchmove', pausar);
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
      const el = buscarSeccion(trozos[indice].seccion);
      el?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      });
      void audio.current.play().then(() => setSonando(true));
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
