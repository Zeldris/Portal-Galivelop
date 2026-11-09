import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Plugin } from 'vite';

// Módulo virtual `virtual:proyectos-resumen`: la lista ligera de proyectos (los campos que usan el menú, el pie, la
// portada, las tarjetas, el muro, el equipo y los productos). Las fichas enteras (tarkor.json pesa 168 KB) no entran
// en el chunk inicial: la página Proyecto las carga bajo demanda (src/data/proyectos.ts). Los campos de aquí tienen
// que coincidir con `ResumenProyecto` (lo comprueba src/data/proyectos.test.ts).
export const CAMPOS_RESUMEN = [
  'slug',
  'nombre',
  'orden',
  'estado',
  'acento',
  'icono',
  'colaboracion',
  'contacto',
  'categoria',
  'lema',
  'resumen',
  'etiquetas',
  'portada',
  'presentacion',
  'fase',
  'lineas',
] as const;

const ID = 'virtual:proyectos-resumen';
const RESUELTO = '\0' + ID;

export function resumenesProyectos(dir = 'src/data/proyectos'): Plugin {
  let carpeta = dir;
  return {
    name: 'galivelop-resumenes-proyectos',
    configResolved(config) {
      carpeta = join(config.root, dir);
    },
    resolveId(id) {
      return id === ID ? RESUELTO : undefined;
    },
    load(id) {
      if (id !== RESUELTO) return undefined;
      const resumenes = readdirSync(carpeta)
        .filter((f) => f.endsWith('.json'))
        .sort()
        .map((f) => {
          const ficha = JSON.parse(readFileSync(join(carpeta, f), 'utf8')) as Record<string, unknown>;
          const r: Record<string, unknown> = {};
          for (const c of CAMPOS_RESUMEN) if (ficha[c] !== undefined) r[c] = ficha[c];
          // Para el avance solo hace falta el estado de cada hito.
          r.hitos = (ficha.hitos as { estado: string }[]).map((h) => ({ estado: h.estado }));
          return r;
        });
      return `export default ${JSON.stringify(resumenes)};`;
    },
    // Al editar una ficha con el servidor de desarrollo en marcha, el resumen se recalcula.
    configureServer(server) {
      server.watcher.add(carpeta);
      server.watcher.on('change', (f) => {
        if (!f.startsWith(carpeta)) return;
        const m = server.moduleGraph.getModuleById(RESUELTO);
        if (m) server.moduleGraph.invalidateModule(m);
      });
    },
  };
}
