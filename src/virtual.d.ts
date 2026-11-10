declare module 'virtual:proyectos-resumen' {
  import type { ResumenProyecto } from './data/proyectos';
  const resumenes: ResumenProyecto[];
  export default resumenes;
}

declare module 'virtual:proyectos-novedades' {
  import type { NovedadDeProyecto } from './data/novedades';
  const novedades: NovedadDeProyecto[];
  export default novedades;
}
