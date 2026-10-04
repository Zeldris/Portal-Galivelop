import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { proyectos } from './proyectos';
import { IDIOMAS } from './tipos';
import { textos } from '../i18n/textos';
import { NOMBRES_ICONOS } from '../components/Icono';

const PUBLIC = join(__dirname, '../../public');

/** Recorre un valor y devuelve las rutas de todo objeto con forma de Texto incompleto. */
function textosIncompletos(valor: unknown, camino = ''): string[] {
  if (Array.isArray(valor)) return valor.flatMap((v, i) => textosIncompletos(v, `${camino}[${i}]`));
  if (valor && typeof valor === 'object') {
    const o = valor as Record<string, unknown>;
    if ('es' in o || 'gl' in o || 'en' in o) {
      return IDIOMAS.filter((l) => typeof o[l] !== 'string' || !(o[l] as string).trim()).map((l) => `${camino}.${l}`);
    }
    return Object.entries(o).flatMap(([k, v]) => textosIncompletos(v, `${camino}.${k}`));
  }
  return [];
}

describe('proyectos', () => {
  it('hay al menos un proyecto y los slugs no se repiten', () => {
    expect(proyectos.length).toBeGreaterThan(0);
    expect(new Set(proyectos.map((p) => p.slug)).size).toBe(proyectos.length);
  });

  for (const p of proyectos) {
    describe(p.slug, () => {
      it('tiene todos los textos en castellano, gallego e inglés', () => {
        expect(textosIncompletos(p, p.slug)).toEqual([]);
      });

      it('todas sus imágenes existen en public/', () => {
        const imagenes = [p.portada, ...p.galeria].flatMap((i) => [i.src, i.mini]);
        if (p.icono) imagenes.push(p.icono);
        expect(imagenes.filter((src) => !existsSync(join(PUBLIC, src)))).toEqual([]);
      });

      it('solo usa iconos que existen en components/Icono.tsx', () => {
        expect(p.caracteristicas.map((c) => c.icono).filter((i) => !NOMBRES_ICONOS.includes(i))).toEqual([]);
      });

      it('usa un estado y fechas válidos', () => {
        expect(['publicado', 'desarrollo', 'diseno']).toContain(p.estado);
        expect(['abierta', 'privada']).toContain(p.colaboracion);
        for (const f of [p.actualizado, ...p.novedades.map((n) => n.fecha)]) {
          expect(f).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        }
        for (const h of p.hitos) expect(['hecho', 'curso', 'pendiente']).toContain(h.estado);
      });
    });
  }
});

describe('textos de la interfaz', () => {
  it('los tres idiomas tienen las mismas claves', () => {
    const claves = Object.keys(textos.es).sort();
    expect(Object.keys(textos.gl).sort()).toEqual(claves);
    expect(Object.keys(textos.en).sort()).toEqual(claves);
  });
});

describe('fechas', () => {
  it('se escriben en el idioma elegido sin depender de Intl', async () => {
    const { formatearFecha } = await import('../i18n/Idioma');
    expect(formatearFecha('2026-07-16', 'gl')).toBe('16 de xullo de 2026');
    expect(formatearFecha('2026-10-04', 'es')).toBe('4 de octubre de 2026');
    expect(formatearFecha('2026-10-04', 'en')).toBe('4 October 2026');
  });
});

describe('formularios', () => {
  it('componen el correo solo con los campos rellenos y codificado para mailto', async () => {
    const { componerCorreo } = await import('../components/Formulario');
    const c = componerCorreo('taller@ejemplo.com', '[Galivelop] Propuesta: Faro', [
      ['Nombre', 'Ana'],
      ['Enlace', '  '],
      ['Descripción', 'Una idea\ncon dos líneas'],
    ]);
    expect(c.cuerpo).toBe('Nombre: Ana\n\nDescripción:\nUna idea\ncon dos líneas');
    expect(c.mailto.startsWith('mailto:taller@ejemplo.com?subject=%5BGalivelop%5D%20Propuesta')).toBe(true);
    expect(decodeURIComponent(c.mailto.split('&body=')[1])).toBe(c.cuerpo);
  });
});
