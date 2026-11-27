import { renderToString } from 'react-dom/server';
import { Route, Routes, StaticRouter } from 'react-router-dom';
import { beforeAll, describe, expect, it } from 'vitest';
import { Cabecera } from '../components/Cabecera';
import {
  buscarEntrada,
  entradas,
  minutosLectura,
  type EntradaDiario as Entrada,
} from '../data/diario';
import { buscarPersonaPorId } from '../data/equipo';
import flujo from '../data/proyectos/galivelop-workflow.json';
import type { Animacion } from '../data/tipos';
import AnimacionFlujo from '../components/AnimacionFlujo';
import { ProveedorIdioma } from '../i18n/Idioma';
import { cargarPagina } from '../paginas';
import { Diario, TarjetaEntrada } from './Diario';
import { EntradaDiario, VistaEntrada } from './EntradaDiario';
import { Inicio } from './Inicio';
import { NoEncontrado } from './NoEncontrado';

// La entrada con proyecto y animación: las demás no llevan ninguna de las dos cosas.
const entrada = entradas.find((x) => x.slug === 'railes-no-solo-instrucciones')!;
const autor = buscarPersonaPorId(entrada.autor)!;

const envolver = (pagina: React.ReactNode, ubicacion: string, idioma: 'es' | 'gl' | 'en' = 'es') =>
  renderToString(
    <StaticRouter location={ubicacion}>
      <ProveedorIdioma idioma={idioma} cambiarIdioma={() => {}}>
        {pagina}
      </ProveedorIdioma>
    </StaticRouter>,
  );

const entradaEn = (ubicacion: string, idioma: 'es' | 'gl' | 'en' = 'es') =>
  envolver(
    <Routes>
      <Route path="/diario/:slug" element={<EntradaDiario />} />
    </Routes>,
    ubicacion,
    idioma,
  );

describe('Diario (índice)', () => {
  it('lista cada entrada con su título enlazado, su autor y los minutos de lectura', () => {
    const html = envolver(<Diario />, '/diario');
    for (const e of entradas) {
      expect(html).toContain(`href="/diario/${e.slug}/"`);
      expect(html).toContain(e.titulo.es.replace(/&/g, '&amp;'));
    }
    expect(html).toContain(`href="/equipo/${autor.id}/"`);
    expect(html).toContain(`${minutosLectura(entrada, 'es')} min`);
  });
});

describe('EntradaDiario', () => {
  const html = entradaEn(`/diario/${entrada.slug}`);

  it('muestra el título en un h1 y la firma enlazada al perfil', () => {
    expect(html).toMatch(/<h1[^>]*>[^<]*<\/h1>/);
    expect(html).toContain(entrada.titulo.es.replace(/&/g, '&amp;'));
    expect(html).toContain(`href="/equipo/${autor.id}/"`);
    expect(html).toContain(autor.nombre);
  });

  it('calcula los minutos de lectura en el idioma de la página', () => {
    expect(html).toContain(`${minutosLectura(entrada, 'es')} min`);
    const en = entradaEn(`/diario/${entrada.slug}`, 'en');
    expect(en).toContain(`${minutosLectura(entrada, 'en')} min`);
    expect(en).toContain(entrada.titulo.en.replace(/&/g, '&amp;'));
  });

  it('lleva un h2 por sección y el recuadro de decisión', () => {
    expect(html.match(/<h2[ >]/g)?.length).toBe(entrada.secciones.length);
    expect(html).toContain('class="decision"');
  });

  it('la decisión es un recuadro del taller, no una cita atribuida: sin blockquote ni cite', () => {
    expect(html).not.toContain('<blockquote');
    expect(html).not.toContain('<cite');
  });

  it('la figura abre en el paso 1 aunque la ficha dejara guardado otro (no lee ni pisa su posición)', () => {
    const guardado = new Map([['galivelop.flujo', JSON.stringify({ id: 'relevo', paso: 3 })]]);
    const almacen = {
      getItem: (k: string) => guardado.get(k) ?? null,
      setItem: (k: string, v: string) => void guardado.set(k, v),
    };
    const g = globalThis as { window?: unknown; document?: unknown };
    const antes = { window: g.window, document: g.document };
    g.window = { sessionStorage: almacen };
    g.document = { documentElement: { clientWidth: 1280 } };
    try {
      const anim = (flujo.animaciones as unknown as Animacion[]).find((a) => a.id === 'relevo')!;
      const pinta = (recordar: boolean) =>
        envolver(<AnimacionFlujo animaciones={[anim]} recordar={recordar} />, '/');
      expect(pinta(false)).not.toBe(pinta(true));
      expect(pinta(false)).toBe(
        envolver(<AnimacionFlujo animaciones={[anim]} recordar={false} />, '/'),
      );
    } finally {
      if (antes.window === undefined) delete g.window;
      else g.window = antes.window;
      if (antes.document === undefined) delete g.document;
      else g.document = antes.document;
    }
    expect(guardado.get('galivelop.flujo')).toBe(JSON.stringify({ id: 'relevo', paso: 3 }));
  });

  it('enlaza en el pie a la ficha del proyecto relacionado', () => {
    expect(html).toContain(`href="/proyectos/${entrada.proyecto}/"`);
  });

  // NoEncontrado es una página perezosa: con su chunk ya cargado se pinta sin suspender.
  beforeAll(async () => {
    await cargarPagina('NoEncontrado');
  });

  it('un slug desconocido pinta NoEncontrado', () => {
    expect(buscarEntrada('no-existe')).toBeUndefined();
    const sinEntrada = entradaEn('/diario/no-existe');
    expect(sinEntrada).toBe(envolver(<NoEncontrado />, '/'));
    expect(sinEntrada).not.toContain('class="decision"');
  });
});

describe('enlaces al diario', () => {
  it('la cabecera lleva el enlace «Diario» tras «Productos»', () => {
    const html = envolver(<Cabecera />, '/');
    const productos = html.indexOf('href="/productos/"');
    const diario = html.indexOf('href="/diario/"');
    expect(productos).toBeGreaterThan(-1);
    expect(diario).toBeGreaterThan(productos);
    expect(html).toMatch(/class="nav-diario"[^>]*>Diario</);
  });

  it('la banda del inicio enlaza a la última entrada y al índice', () => {
    const html = envolver(<Inicio />, '/');
    expect(html).toContain('class="banda-diario"');
    expect(html).toContain(`href="/diario/${entradas[0].slug}/"`);
    expect(html).toContain('href="/diario/"');
  });
});

describe('imágenes, portada y tipo', () => {
  const t = (es: string, gl = es, en = es) => ({ es, gl, en });
  const prueba: Entrada = {
    slug: 'entrada-de-prueba',
    fecha: '2026-01-02',
    autor: entrada.autor,
    tipo: 'relato',
    titulo: t('Título de prueba'),
    bajada: t('Bajada de prueba'),
    descripcion: t('Descripción de prueba'),
    portada: {
      src: 'proyectos/p/portada.webp',
      alt: t('Alt de la portada', 'Alt da portada', 'Cover alt'),
    },
    secciones: [
      {
        etiqueta: t('Uno'),
        titulo: t('Sección de prueba'),
        bloques: [
          {
            tipo: 'imagen',
            src: 'proyectos/p/una.webp',
            alt: t('Alt de la imagen'),
            pie: t('Pie de la imagen'),
          },
          {
            tipo: 'galeria',
            imagenes: [
              { src: 'proyectos/p/g1.webp', alt: t('Alt g1'), pie: t('Pie g1') },
              { src: 'proyectos/p/g2.webp', alt: t('Alt g2') },
            ],
          },
        ],
      },
    ],
  };
  const vista = envolver(<VistaEntrada entrada={prueba} />, '/diario/entrada-de-prueba');

  it('la entrada pinta la portada con su alt, bajo la cabecera', () => {
    expect(vista).toContain('class="diario-portada"');
    expect(vista).toContain('src="/proyectos/p/portada.webp"');
    expect(vista).toContain('alt="Alt de la portada"');
    expect(vista.indexOf('diario-portada')).toBeGreaterThan(vista.indexOf('diario-cabecera'));
  });

  it('el bloque imagen es un figure con img perezosa y figcaption', () => {
    expect(vista).toMatch(
      /<figure class="diario-imagen"><img src="\/proyectos\/p\/una\.webp" alt="Alt de la imagen" loading="lazy" decoding="async"\/><figcaption>Pie de la imagen<\/figcaption><\/figure>/,
    );
  });

  it('la galería pinta cada imagen, con pie solo si lo tiene', () => {
    expect(vista).toContain('class="diario-galeria"');
    expect(vista).toContain('src="/proyectos/p/g1.webp"');
    expect(vista).toContain('src="/proyectos/p/g2.webp"');
    expect(vista).toContain('<figcaption>Pie g1</figcaption>');
    expect(vista.match(/diario-galeria-figura/g)?.length).toBe(2);
    expect(vista.match(/<figcaption>/g)?.length).toBe(2);
  });

  it('la etiqueta de tipo sale en los tres idiomas; sin tipo, «Taller»', () => {
    expect(vista).toContain('<span class="diario-tipo">Relato</span>');
    const gl = envolver(<VistaEntrada entrada={{ ...prueba, tipo: 'taller' }} />, '/', 'gl');
    expect(gl).toContain('>Obradoiro<');
    const en = envolver(<VistaEntrada entrada={{ ...prueba, tipo: 'proyecto' }} />, '/', 'en');
    expect(en).toContain('>Project<');
    const sin = envolver(<VistaEntrada entrada={{ ...prueba, tipo: undefined }} />, '/');
    expect(sin).toContain('<span class="diario-tipo">Taller</span>');
  });

  it('sin portada no hay figura de portada', () => {
    const sin = envolver(<VistaEntrada entrada={{ ...prueba, portada: undefined }} />, '/');
    expect(sin).not.toContain('diario-portada');
  });

  it('la tarjeta del índice lleva la miniatura -mini.webp, el alt y la etiqueta', () => {
    const html = envolver(<TarjetaEntrada e={prueba} />, '/diario');
    expect(html).toContain('src="/proyectos/p/portada-mini.webp"');
    expect(html).toContain('alt="Alt de la portada"');
    expect(html).toContain('<span class="diario-tipo">Relato</span>');
    expect(
      envolver(<TarjetaEntrada e={{ ...prueba, portada: undefined }} />, '/diario'),
    ).not.toContain('<img');
  });
});
