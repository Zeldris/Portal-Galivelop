/**
 * Rellena una plantilla de `textos.ts`: `{n}` pone el valor de `n` y `{n:singular|plural}` elige la forma según
 * `n` sea 1 o no. Una variable que falta se deja escrita, para que se vea en la página.
 */
export function rellenar(plantilla: string, vars?: Record<string, string | number>): string {
  return plantilla.replace(
    /\{(\w+)(?::([^|}]*)\|([^}]*))?\}/g,
    (marca, v: string, uno?: string, varios?: string) => {
      const valor = vars?.[v];
      if (valor === undefined) return marca;
      if (uno === undefined) return String(valor);
      return Number(valor) === 1 ? uno : (varios ?? '');
    },
  );
}
