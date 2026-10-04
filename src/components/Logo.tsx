import { useId } from 'react';

/** Monograma GD: azul celeste y blanco, los colores de la bandera gallega. */
export function MarcaGD({ tamano = 36 }: { tamano?: number }) {
  const id = useId();
  return (
    <svg width={tamano} height={tamano} viewBox="0 0 128 128" aria-hidden="true" className="marca-gd">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2BB3EA" />
          <stop offset="1" stopColor="#0083C1" />
        </linearGradient>
      </defs>
      <rect width="128" height="128" rx="30" fill={`url(#${id})`} />
      <g fill="none" stroke="#fff" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round">
        <path d="M55.4 45.6 A24 24 0 1 0 64 64" />
        <path d="M50 64 H78" />
        <path d="M78 40 V88 M78 40 H86 A24 24 0 0 1 86 88 H78" />
      </g>
    </svg>
  );
}

export function Logo({ tamano = 36 }: { tamano?: number }) {
  return (
    <span className="logo">
      <MarcaGD tamano={tamano} />
      <span className="logo-texto">
        <span className="logo-gali">Gali</span>velop
      </span>
    </span>
  );
}
