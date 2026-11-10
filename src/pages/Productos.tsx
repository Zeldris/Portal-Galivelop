import { Navigate } from 'react-router-dom';

/**
 * Página de paso (ADR 0004): los productos viven en el perfil de cada miembro, y /productos lleva al equipo para que
 * los enlaces ya compartidos no se rompan. Sin JS, la página estática hace lo mismo (noindex, fuera del sitemap).
 */
export function Productos() {
  return <Navigate to="/equipo/" replace />;
}
