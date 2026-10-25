import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';
import { IDIOMAS, type Idioma, type Texto } from '../data/tipos';
import { rellenar } from './rellenar';
import { textos, type Clave } from './textos';

const CLAVE_GUARDADA = 'galivelop.idioma';

const BASE = import.meta.env.BASE_URL;

/** Idioma que marca la dirección: /gl/… y /en/…; sin prefijo, castellano. */
export function idiomaDeRuta(pathname: string): Idioma | null {
  const resto = pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname.replace(/^\//, '');
  const prefijo = resto.split('/')[0];
  return prefijo === 'gl' || prefijo === 'en' ? prefijo : null;
}

/** Base del router para un idioma (el castellano va sin prefijo). */
export function baseDeIdioma(i: Idioma): string {
  return i === 'es' ? BASE : `${BASE}${i}/`;
}

/** Idioma al entrar: el de la dirección; sin prefijo, el elegido antes por la persona o castellano. */
export function idiomaInicial(): Idioma {
  const deRuta = idiomaDeRuta(location.pathname);
  if (deRuta) return deRuta;
  try {
    const guardado = localStorage.getItem(CLAVE_GUARDADA);
    if (guardado && (IDIOMAS as readonly string[]).includes(guardado)) return guardado as Idioma;
  } catch {
    // Sin acceso a localStorage (modo privado, etc.).
  }
  return 'es';
}

export function guardarIdioma(i: Idioma) {
  try {
    localStorage.setItem(CLAVE_GUARDADA, i);
  } catch {
    // Se mantiene solo durante la visita.
  }
}

// Meses a mano: no todos los navegadores traen los datos de Intl para el gallego.
const MESES: Record<Idioma, string[]> = {
  es: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  gl: ['xaneiro', 'febreiro', 'marzo', 'abril', 'maio', 'xuño', 'xullo', 'agosto', 'setembro', 'outubro', 'novembro', 'decembro'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};

export function formatearFecha(iso: string, idioma: Idioma): string {
  const [a, m, d] = iso.split('-').map(Number);
  const mes = MESES[idioma][m - 1];
  return idioma === 'en' ? `${d} ${mes} ${a}` : `${d} de ${mes} de ${a}`;
}

/** Mes AAAA-MM con el mes abreviado si es largo («mar. 2021», «Mar 2021», «maio 2020»). */
export function formatearMes(iso: string, idioma: Idioma): string {
  const [a, m] = iso.split('-').map(Number);
  const mes = MESES[idioma][m - 1];
  if (!mes) return iso;
  if (mes.length <= 4) return `${mes} ${a}`;
  return `${mes.slice(0, 3)}${idioma === 'en' ? '' : '.'} ${a}`;
}

interface ContextoIdioma {
  idioma: Idioma;
  cambiarIdioma: (i: Idioma) => void;
  /** Texto de la interfaz, con sustitución de {variables}. */
  t: (clave: Clave, vars?: Record<string, string | number>) => string;
  /** Texto de un proyecto en el idioma actual. */
  tx: (texto: Texto) => string;
  /** Fecha AAAA-MM-DD en formato largo del idioma actual. */
  fecha: (iso: string) => string;
}

const Contexto = createContext<ContextoIdioma | null>(null);

export function ProveedorIdioma({
  idioma,
  cambiarIdioma,
  children,
}: {
  idioma: Idioma;
  cambiarIdioma: (i: Idioma) => void;
  children: ReactNode;
}) {
  useEffect(() => {
    document.documentElement.lang = idioma;
  }, [idioma]);

  const valor = useMemo<ContextoIdioma>(() => {
    return {
      idioma,
      cambiarIdioma,
      t: (clave, vars) => rellenar(textos[idioma][clave], vars),
      tx: (texto) => texto[idioma],
      fecha: (iso) => formatearFecha(iso, idioma),
    };
  }, [idioma, cambiarIdioma]);

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useIdioma(): ContextoIdioma {
  const c = useContext(Contexto);
  if (!c) throw new Error('useIdioma fuera de ProveedorIdioma');
  return c;
}
