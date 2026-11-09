import { forwardRef } from 'react';
import { Link as LinkRouter, type LinkProps, type To } from 'react-router-dom';

/**
 * Añade `/` al final del pathname de una ruta interna (`/muro?x=1#a` → `/muro/?x=1#a`), porque GitHub Pages
 * responde 301 a la versión con barra. Se deja igual lo que no empieza por `/` (`#hash`, `?q`, relativos).
 */
export function conBarraFinal(to: string): string {
  if (!to.startsWith('/')) return to;
  const corte = to.search(/[?#]/);
  const pathname = corte === -1 ? to : to.slice(0, corte);
  const resto = corte === -1 ? '' : to.slice(corte);
  // Un archivo (/llms.txt, /sitemap.xml) no lleva barra: GitHub Pages lo serviría con 404.
  if (pathname.split('/').pop()!.includes('.')) return to;
  return pathname.endsWith('/') ? to : `${pathname}/${resto}`;
}

function normalizar(to: To): To {
  if (typeof to === 'string') return conBarraFinal(to);
  if (to.pathname) return { ...to, pathname: conBarraFinal(to.pathname) };
  return to;
}

/** `Link` de react-router-dom con la barra final en las rutas internas. */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link({ to, ...props }, ref) {
  return <LinkRouter ref={ref} to={normalizar(to)} {...props} />;
});
