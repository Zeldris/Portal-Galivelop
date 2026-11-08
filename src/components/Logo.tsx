/** Monograma GV (Galivelop): celeste plano con chaflán y trazo blanco, los colores de la bandera gallega. */
export function MarcaGV({ tamano = 36 }: { tamano?: number }) {
  return (
    <svg
      width={tamano}
      height={tamano}
      viewBox="0 0 128 128"
      aria-hidden="true"
      className="marca-gd"
    >
      <path d="M0 0H100L128 28V128H0Z" fill="#1AA6DF" />
      <g fill="none" stroke="#fff" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round">
        <path d="M55.4 45.6 A24 24 0 1 0 64 64" />
        <path d="M50 64 H80" />
        <path d="M71 40 L89.5 88 L108 40" />
      </g>
    </svg>
  );
}

export function Logo({ tamano = 36 }: { tamano?: number }) {
  return (
    <span className="logo">
      <MarcaGV tamano={tamano} />
      <span className="logo-texto">
        <span className="logo-gali">Gali</span>velop
      </span>
    </span>
  );
}
