import type { CSSProperties } from 'react';

// Tonos del acento de un proyecto o producto («Familia Galivelop», decisión 1, de la hoja del generador; resumen en
// docs/marca.md, «Acento de cada proyecto»). El hex de la ficha es el vivo; el hondo (tema claro) y la variante
// oscura se calculan en OKLCH, no se eligen a ojo.

/** Papel claro y papel oscuro del Portal (`--papel` de global.css). */
export const PAPEL_CLARO = '#fbfcfd';
export const PAPEL_OSCURO = '#0d171e';
const MINIMO = 4.5;
const PASO = 0.005;

type Rgb = [number, number, number];

const lineal = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const gamma = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

function deHex(hex: string): Rgb {
  const h = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as Rgb;
}

function aHex(rgb: Rgb): string {
  return (
    '#' +
    rgb
      .map((c) =>
        Math.round(c * 255)
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
  );
}

/** Contraste WCAG 2.x entre dos hex. */
export function contraste(a: string, b: string): number {
  const lum = (hex: string) => {
    const [r, g, bl] = deHex(hex).map(lineal);
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

/** sRGB → OKLCH (OKLab de Björn Ottosson, D65). */
function aOklch(hex: string): [number, number, number] {
  const [r, g, b] = deHex(hex).map(lineal);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return [L, Math.hypot(A, B), Math.atan2(B, A)];
}

/** OKLCH → sRGB en [0, 1], o `null` si cae fuera de sRGB. */
function deOklch(L: number, C: number, h: number): Rgb | null {
  const A = C * Math.cos(h);
  const B = C * Math.sin(h);
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  const rgb = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  if (rgb.some((c) => c < -1e-6 || c > 1 + 1e-6)) return null;
  return rgb.map((c) => gamma(Math.min(1, Math.max(0, c)))) as Rgb;
}

/** Primer hex desde el vivo, con `L` en pasos de 0,005 hacia `sentido`, que da ≥ 4,5:1 sobre `papel`. */
function buscar(vivo: string, papel: string, sentido: 1 | -1): string {
  if (contraste(vivo, papel) >= MINIMO) return vivo.toLowerCase();
  const [L0, C0, h] = aOklch(vivo);
  for (let L = L0 + sentido * PASO; L >= 0 && L <= 1; L += sentido * PASO) {
    // Fuera de sRGB, se baja el croma sin tocar el tono.
    let C = C0;
    let rgb = deOklch(L, C, h);
    while (!rgb && C > 0) {
      C = Math.max(0, C - PASO);
      rgb = deOklch(L, C, h);
    }
    if (!rgb) continue;
    const hex = aHex(rgb);
    if (contraste(hex, papel) >= MINIMO) return hex;
  }
  return sentido < 0 ? '#000000' : '#ffffff';
}

export interface Tonos {
  /** Foco, puntos, filetes y tinte. */
  vivo: string;
  /** Texto de acento y bloques con texto blanco (también en oscuro). */
  hondo: string;
  /** Texto de acento sobre el papel oscuro. */
  oscuro: string;
}

export function tonosAcento(vivo: string): Tonos {
  return {
    vivo: vivo.toLowerCase(),
    hondo: buscar(vivo, PAPEL_CLARO, -1),
    oscuro: buscar(vivo, PAPEL_OSCURO, 1),
  };
}

/** Variables CSS del acento de un proyecto para su `style` (las usa global.css: `--acento-proyecto*`). */
export function estiloAcento(vivo: string): CSSProperties {
  const t = tonosAcento(vivo);
  return {
    '--acento-proyecto': t.vivo,
    '--acento-proyecto-hondo': t.hondo,
    '--acento-proyecto-oscuro': t.oscuro,
  } as CSSProperties;
}
