import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Plugin } from 'vite';

// Módulo virtual `virtual:proyectos-resumen`: la lista ligera de proyectos (los campos que usan el menú, el pie, la
// portada, las tarjetas, el muro, el equipo y los productos). Las fichas enteras (tarkor.json pesa 168 KB) no entran
// en el chunk inicial: la página Proyecto las carga bajo demanda (src/data/proyectos.ts). `ResumenProyecto` sale de
// esta lista (solo tipos), así que un campo nuevo se añade aquí y en ningún otro sitio.
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
          const archivo = join(carpeta, f);
          let ficha: Record<string, unknown>;
          try {
            ficha = JSON.parse(readFileSync(archivo, 'utf8')) as Record<string, unknown>;
          } catch (error) {
            throw new Error(`${archivo}: no se puede analizar el JSON (${String(error)})`);
          }
          if (!Array.isArray(ficha.hitos)) {
            throw new Error(`${archivo}: «hitos» tiene que ser una lista`);
          }
          const r: Record<string, unknown> = {};
          for (const c of CAMPOS_RESUMEN) if (ficha[c] !== undefined) r[c] = ficha[c];
          // Para el avance solo hace falta el estado de cada hito.
          r.hitos = (ficha.hitos as { estado: string }[]).map((h) => ({ estado: h.estado }));
          return r;
        });
      return `export default ${JSON.stringify(resumenes)};`;
    },
    // Al editar, añadir o quitar una ficha con el servidor de desarrollo en marcha, el resumen se recalcula.
    configureServer(server) {
      server.watcher.add(carpeta);
      const alCambiar = (f: string) => {
        if (!f.startsWith(carpeta) || !f.endsWith('.json')) return;
        const m = server.moduleGraph.getModuleById(RESUELTO);
        if (m) server.moduleGraph.invalidateModule(m);
        // Las fichas entran por import.meta.glob en otros módulos: se recarga la página entera.
        server.ws.send({ type: 'full-reload' });
      };
      for (const evento of ['add', 'change', 'unlink'] as const)
        server.watcher.on(evento, alCambiar);
    },
  };
}
