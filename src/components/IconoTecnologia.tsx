import type { CSSProperties } from 'react';
import {
  siAngular,
  siApachegroovy,
  siApachemaven,
  siBootstrap,
  siClaude,
  siCss,
  siDocker,
  siDotnet,
  siGit,
  siGraphql,
  siHibernate,
  siHtml5,
  siJavascript,
  siJquery,
  siLinux,
  siMongodb,
  siMysql,
  siNodedotjs,
  siOllama,
  siOpencode,
  siOpenjdk,
  siPhp,
  siPostgresql,
  siPython,
  siReact,
  siSpring,
  siTypescript,
  siVuedotjs,
  siXml,
  type SimpleIcon,
} from 'simple-icons';

// Logos de Simple Icons (CC0) por tecnología, con el nombre tal como se escribe en equipo.json.
const ICONOS: Record<string, SimpleIcon> = {
  React: siReact,
  'Angular 2+': siAngular,
  Vue: siVuedotjs,
  TypeScript: siTypescript,
  JavaScript: siJavascript,
  HTML: siHtml5,
  CSS: siCss,
  Bootstrap: siBootstrap,
  jQuery: siJquery,
  Java: siOpenjdk,
  Spring: siSpring,
  Hibernate: siHibernate,
  Maven: siApachemaven,
  Groovy: siApachegroovy,
  '.NET': siDotnet,
  'Node.js': siNodedotjs,
  PHP: siPhp,
  Python: siPython,
  GraphQL: siGraphql,
  XML: siXml,
  PostgreSQL: siPostgresql,
  MySQL: siMysql,
  MongoDB: siMongodb,
  'Claude Code': siClaude,
  OpenCode: siOpencode,
  Ollama: siOllama,
  Git: siGit,
  Docker: siDocker,
  Linux: siLinux,
};

/** Sin logo en Simple Icons (marcas que lo retiraron o nunca lo tuvieron): van con un monograma. */
const MONOGRAMAS: Record<string, string> = {
  AngularJS: 'A',
  JSP: 'J',
  'C#': 'C#',
  'ASP.NET': 'A',
  Magento: 'M',
  SoapUI: 'S',
  Oracle: 'O',
  'SQL Server': 'S',
  SQL: 'S',
  'Microsoft 365': 'M',
};

export function tieneIcono(nombre: string): boolean {
  return nombre in ICONOS || nombre in MONOGRAMAS;
}

/** Luminancia relativa (WCAG) de un color `RRGGBB`. */
export function luminancia(hex: string): number {
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Los logos casi negros no se ven en el tema oscuro, ni los muy claros en el claro: esos toman el color del texto.
 * Umbrales: en el oscuro, contraste por debajo de 3:1 (WCAG para gráficos) con el fondo; en el claro, por debajo
 * de ~2,3:1, que deja con su color de marca los verdes y celestes medios (Spring, Groovy).
 */
export function tonoIcono(hex: string): 'oscuro' | 'claro' | undefined {
  const l = luminancia(hex);
  if (l < 0.13) return 'oscuro';
  if (l > 0.4) return 'claro';
  return undefined;
}

export function IconoTecnologia({ nombre }: { nombre: string }) {
  const icono = ICONOS[nombre];
  if (!icono) {
    const monograma = MONOGRAMAS[nombre];
    return monograma ? (
      <span className="icono-tec icono-tec-monograma" aria-hidden="true">
        {monograma}
      </span>
    ) : null;
  }
  const tono = tonoIcono(icono.hex);
  return (
    <svg
      className={tono ? `icono-tec icono-tec-${tono}` : 'icono-tec'}
      style={{ '--marca': `#${icono.hex}` } as CSSProperties}
      viewBox="0 0 24 24"
      width={14}
      height={14}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d={icono.path} />
    </svg>
  );
}
