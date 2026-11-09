import { useEffect, useState } from 'react';

type Tema = 'claro' | 'oscuro';
const CLAVE_GUARDADA = 'galivelop.tema';
/** Color de la barra del navegador: el de la cabecera (`--superficie`) en cada tema. Mismos valores que en index.html. */
const COLOR_BARRA: Record<Tema, string> = { claro: '#ffffff', oscuro: '#111f29' };

function temaInicial(): Tema {
  try {
    const guardado = localStorage.getItem(CLAVE_GUARDADA);
    if (guardado === 'oscuro') return guardado;
  } catch {
    // Sin localStorage: claro.
  }
  // Claro por defecto (regla 1 de docs/marca.md), también si el sistema pide oscuro.
  return 'claro';
}

export function useTema() {
  const [tema, setTema] = useState<Tema>(temaInicial);

  useEffect(() => {
    document.documentElement.dataset.tema = tema;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', COLOR_BARRA[tema]);
  }, [tema]);

  const alternar = () => {
    const nuevo = tema === 'oscuro' ? 'claro' : 'oscuro';
    setTema(nuevo);
    try {
      localStorage.setItem(CLAVE_GUARDADA, nuevo);
    } catch {
      // Se mantiene solo durante la visita.
    }
  };

  return { tema, alternar };
}
