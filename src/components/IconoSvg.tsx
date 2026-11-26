/** `viewBox` y contenido de un SVG en texto (`import x from '….svg?raw'`); lanza si no tiene `<svg viewBox>`. */
export function trazadoSvg(svg: string, nombre: string): { viewBox: string; trazado: string } {
  const m = /<svg\b[^>]*\sviewBox="([^"]+)"[^>]*>([\s\S]*)<\/svg>/.exec(svg);
  if (!m) throw new Error(`IconoMarca: ${nombre}.svg sin <svg viewBox> legible`);
  return { viewBox: m[1], trazado: m[2] };
}

/**
 * Un icono de la marca pintado en línea (no con `<img>`) para que tome el color del texto y casen las reglas de `svg`
 * del CSS. Para una página que usa uno o dos iconos sin cargar los 21 de `IconoMarca` (ver `Equipo.tsx`).
 */
export function IconoSvg({ icono }: { icono: { viewBox: string; trazado: string } }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={icono.viewBox}
      aria-hidden="true"
      focusable="false"
      dangerouslySetInnerHTML={{ __html: icono.trazado }}
    />
  );
}
