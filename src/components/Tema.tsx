import { useEffect, useState } from 'react';

type Tema = 'claro' | 'oscuro';
const CLAVE_GUARDADA = 'galivelop.tema';

function temaInicial(): Tema {
  try {
    const guardado = localStorage.getItem(CLAVE_GUARDADA);
    if (guardado === 'claro' || guardado === 'oscuro') return guardado;
  } catch {
    // Sin localStorage: se sigue la preferencia del sistema.
  }
  return matchMedia('(prefers-color-scheme: light)').matches ? 'claro' : 'oscuro';
}

export function useTema() {
  const [tema, setTema] = useState<Tema>(temaInicial);

  useEffect(() => {
    document.documentElement.dataset.tema = tema;
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
