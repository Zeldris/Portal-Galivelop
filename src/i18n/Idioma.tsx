import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { IDIOMAS, type Idioma, type Texto } from '../data/tipos';
import { textos, type Clave } from './textos';

const CLAVE_GUARDADA = 'galivelop.idioma';

function idiomaInicial(): Idioma {
  try {
    const guardado = localStorage.getItem(CLAVE_GUARDADA);
    if (guardado && (IDIOMAS as readonly string[]).includes(guardado)) return guardado as Idioma;
  } catch {
    // Sin acceso a localStorage (modo privado, etc.): se usa el idioma del navegador.
  }
  for (const preferido of navigator.languages ?? [navigator.language]) {
    const base = preferido.slice(0, 2).toLowerCase();
    if (base === 'gl' || base === 'es') return base;
    if (base === 'en') return 'en';
  }
  return 'es';
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

export function ProveedorIdioma({ children }: { children: ReactNode }) {
  const [idioma, setIdioma] = useState<Idioma>(idiomaInicial);

  useEffect(() => {
    document.documentElement.lang = idioma;
  }, [idioma]);

  const cambiarIdioma = useCallback((i: Idioma) => {
    setIdioma(i);
    try {
      localStorage.setItem(CLAVE_GUARDADA, i);
    } catch {
      // Se mantiene solo durante la visita.
    }
  }, []);

  const valor = useMemo<ContextoIdioma>(() => {
    const locale = { es: 'es-ES', gl: 'gl-ES', en: 'en-GB' }[idioma];
    const formato = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
    return {
      idioma,
      cambiarIdioma,
      t: (clave, vars) =>
        textos[idioma][clave].replace(/\{(\w+)\}/g, (_, v: string) => String(vars?.[v] ?? `{${v}}`)),
      tx: (texto) => texto[idioma],
      fecha: (iso) => formato.format(new Date(`${iso}T00:00:00Z`)),
    };
  }, [idioma, cambiarIdioma]);

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useIdioma(): ContextoIdioma {
  const c = useContext(Contexto);
  if (!c) throw new Error('useIdioma fuera de ProveedorIdioma');
  return c;
}
