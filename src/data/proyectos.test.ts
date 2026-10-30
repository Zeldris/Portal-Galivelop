import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { proyectos } from './proyectos';
import { textosIncompletos } from './textosIncompletos';
import { textos } from '../i18n/textos';
import { NOMBRES_ICONOS } from '../components/Icono';
import { LINEAS } from './lineas';

const PUBLIC = join(__dirname, '../../public');

describe('proyectos', () => {
  it('hay al menos un proyecto y los slugs no se repiten', () => {
    expect(proyectos.length).toBeGreaterThan(0);
    expect(new Set(proyectos.map((p) => p.slug)).size).toBe(proyectos.length);
  });

  it('el último añadido (mayor orden) sale el primero y los órdenes no se repiten', () => {
    const ordenes = proyectos.map((p) => p.orden);
    expect(new Set(ordenes).size).toBe(ordenes.length);
    expect(ordenes).toEqual([...ordenes].sort((a, b) => b - a));
  });

  for (const p of proyectos) {
    describe(p.slug, () => {
      it('tiene todos los textos en castellano, gallego e inglés', () => {
        expect(textosIncompletos(p, p.slug)).toEqual([]);
      });

      it('todas sus imágenes existen en public/', () => {
        const deApartados = p.apartados.flatMap((a) => [
          ...a.items.flatMap((i) => (i.imagen ? [i.imagen] : [])),
          ...(a.grupos ?? []).flatMap((g) => g.imagenes),
        ]);
        const imagenes = [p.portada, ...p.galeria, ...p.capturas, ...deApartados].flatMap((i) => [
          i.src,
          i.mini,
        ]);
        if (p.icono) imagenes.push(p.icono);
        expect(imagenes.filter((src) => !existsSync(join(PUBLIC, src)))).toEqual([]);
      });

      it('solo usa iconos que existen en components/Icono.tsx', () => {
        expect(
          p.caracteristicas.map((c) => c.icono).filter((i) => !NOMBRES_ICONOS.includes(i)),
        ).toEqual([]);
      });

      it('sus apartados tienen ids únicos y elementos', () => {
        expect(new Set(p.apartados.map((a) => a.id)).size).toBe(p.apartados.length);
        for (const a of p.apartados)
          expect(a.items.length + (a.grupos ?? []).length).toBeGreaterThan(0);
        // `valor` es un dato corto igual en todos los idiomas: si fuera un objeto, React no lo puede pintar.
        for (const a of p.apartados)
          for (const i of a.items) if (i.valor !== undefined) expect(typeof i.valor).toBe('string');
        // `detalle` es una lista no vacía de textos en los tres idiomas (lo escribe la tarea semanal sin revisión).
        for (const a of p.apartados)
          for (const i of a.items)
            if (i.detalle !== undefined) {
              expect(Array.isArray(i.detalle) && i.detalle.length > 0, `${a.id}: detalle`).toBe(
                true,
              );
              for (const d of i.detalle)
                expect(
                  (['es', 'gl', 'en'] as const).every(
                    (k) => typeof d?.[k] === 'string' && d[k] !== '',
                  ),
                  `${a.id}: ${JSON.stringify(d)}`,
                ).toBe(true);
            }
      });

      it('pertenece a líneas de trabajo que existen', () => {
        expect(p.lineas.length).toBeGreaterThan(0);
        expect(p.lineas.filter((l) => !(LINEAS as readonly string[]).includes(l))).toEqual([]);
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

  it('los meses de la trayectoria se abrevian solo si son largos', async () => {
    const { formatearMes } = await import('../i18n/Idioma');
    expect(formatearMes('2021-03', 'es')).toBe('mar. 2021');
    expect(formatearMes('2017-07', 'gl')).toBe('xul. 2017');
    expect(formatearMes('2019-10', 'en')).toBe('Oct 2019');
    expect(formatearMes('2019-05', 'en')).toBe('May 2019');
    expect(formatearMes('2020-05', 'gl')).toBe('maio 2020');
    // Un mes mal escrito no rompe la página: se muestra tal cual.
    expect(formatearMes('2021-13', 'es')).toBe('2021-13');
    expect(formatearMes('2023', 'es')).toBe('2023');
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
    expect(
      c.mailto.startsWith('mailto:taller@ejemplo.com?subject=%5BGalivelop%5D%20Propuesta'),
    ).toBe(true);
    expect(decodeURIComponent(c.mailto.split('&body=')[1])).toBe(c.cuerpo);
  });
});

describe('equipo', () => {
  it('cada persona tiene textos en los tres idiomas, proyectos existentes y redes válidas', async () => {
    const { equipo, REDES } = await import('./equipo');
    expect(equipo.length).toBeGreaterThan(0);
    expect(new Set(equipo.map((p) => p.id)).size).toBe(equipo.length);
    for (const p of equipo) {
      expect(
        textosIncompletos({ rol: p.rol, bio: p.bio, perfil: p.perfil, colabora: p.colabora }, p.id),
      ).toEqual([]);
      for (const etapa of [...(p.perfil?.trayectoria ?? []), ...(p.perfil?.formacion ?? [])]) {
        const mes = /^\d{4}-(0[1-9]|1[0-2])$/;
        expect(etapa.desde).toMatch(mes);
        if (etapa.logo) expect(existsSync(join(PUBLIC, etapa.logo))).toBe(true);
        if (etapa.hasta !== undefined) {
          expect(etapa.hasta).toMatch(mes);
          expect(etapa.hasta >= etapa.desde).toBe(true);
        }
      }
      const todas = (p.perfil?.tecnologias ?? []).flatMap((g) => g.lista);
      expect((p.perfil?.destacadas ?? []).filter((x) => !todas.includes(x))).toEqual([]);
      expect(p.proyectos.filter((s) => !proyectos.some((x) => x.slug === s))).toEqual([]);
      for (const r of p.redes) {
        expect(REDES).toContain(r.tipo);
        if (r.tipo !== 'correo') expect(r.url).toMatch(/^https:\/\//);
      }
      if (p.foto) expect(existsSync(join(PUBLIC, p.foto))).toBe(true);
    }
  });

  it('cada persona tiene una ruta válida, un papel por cada uno de sus proyectos y un correo para colaborar', async () => {
    const { equipo, PAPELES } = await import('./equipo');
    for (const p of equipo) {
      expect(p.id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      for (const [slug, papel] of Object.entries(p.papeles ?? {})) {
        expect(p.proyectos).toContain(slug);
        expect(PAPELES).toContain(papel);
      }
      expect(Object.keys(p.papeles ?? {}).sort()).toEqual([...p.proyectos].sort());
      if (p.colabora) expect(p.colabora.correo).toMatch(/^[^@\s]+@[^@\s]+\.[a-z]+$/);
    }
  });
});
