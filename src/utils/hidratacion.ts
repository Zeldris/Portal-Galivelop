import { useSyncExternalStore } from 'react';

const sinCambios = () => () => {};

/**
 * `false` al generar el HTML prerenderizado y al hidratarlo; `true` en el resto de renders del cliente (también en el
 * primero sin hidratación, con `createRoot`). Lo que solo sabe el navegador (ancho, lo guardado en la pestaña) se lee con esto:
 * el primer render del cliente tiene que dar el mismo HTML que el servidor.
 */
export function useHidratado(): boolean {
  return useSyncExternalStore(
    sinCambios,
    () => true,
    () => false,
  );
}
