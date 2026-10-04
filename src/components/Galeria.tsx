import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type TouchEvent } from 'react';
import { ruta } from '../data/proyectos';
import type { Imagen } from '../data/tipos';
import { useIdioma } from '../i18n/Idioma';

/** Carrusel con miniaturas, teclado, gesto de deslizar y vista ampliada a pantalla completa. */
export function Galeria({ imagenes }: { imagenes: Imagen[] }) {
  const { t, tx } = useIdioma();
  const [actual, setActual] = useState(0);
  const dialogo = useRef<HTMLDialogElement>(null);
  const miniaturas = useRef<HTMLDivElement>(null);
  const inicioToque = useRef<number | null>(null);
  const total = imagenes.length;

  const ir = useCallback((i: number) => setActual(((i % total) + total) % total), [total]);

  // Mantiene visible la miniatura activa.
  useEffect(() => {
    const activa = miniaturas.current?.children[actual] as HTMLElement | undefined;
    activa?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }, [actual]);

  if (total === 0) return null;
  const imagen = imagenes[actual];

  const teclado = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') ir(actual - 1);
    if (e.key === 'ArrowRight') ir(actual + 1);
  };
  const tocar = (e: TouchEvent) => {
    inicioToque.current = e.touches[0].clientX;
  };
  const soltar = (e: TouchEvent) => {
    if (inicioToque.current === null) return;
    const dx = e.changedTouches[0].clientX - inicioToque.current;
    if (Math.abs(dx) > 40) ir(actual + (dx < 0 ? 1 : -1));
    inicioToque.current = null;
  };

  const controles = (
    <>
      <button type="button" className="galeria-flecha izq" onClick={() => ir(actual - 1)} aria-label={t('galeria.anterior')}>
        <ChevronLeft size={22} />
      </button>
      <button type="button" className="galeria-flecha der" onClick={() => ir(actual + 1)} aria-label={t('galeria.siguiente')}>
        <ChevronRight size={22} />
      </button>
    </>
  );

  return (
    <div className="galeria" onKeyDown={teclado}>
      <div className="galeria-escenario" onTouchStart={tocar} onTouchEnd={soltar}>
        <img
          key={imagen.src}
          src={ruta(imagen.src)}
          alt={tx(imagen.alt)}
          width={imagen.ancho}
          height={imagen.alto}
          className="galeria-imagen"
        />
        {total > 1 && controles}
        <button
          type="button"
          className="galeria-ampliar"
          onClick={() => dialogo.current?.showModal()}
          aria-label={t('galeria.ampliar')}
        >
          <Maximize2 size={18} />
        </button>
      </div>
      <div className="galeria-pie">
        <p className="galeria-leyenda">{tx(imagen.alt)}</p>
        <p className="galeria-contador" aria-live="polite">
          {t('galeria.posicion', { n: actual + 1, total })}
        </p>
      </div>
      {total > 1 && (
        <div className="galeria-miniaturas" ref={miniaturas}>
          {imagenes.map((img, i) => (
            <button
              key={img.src}
              type="button"
              className="galeria-miniatura"
              aria-current={i === actual}
              aria-label={tx(img.alt)}
              onClick={() => ir(i)}
            >
              <img src={ruta(img.mini)} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}

      <dialog
        ref={dialogo}
        className="galeria-dialogo"
        onClick={(e) => e.target === dialogo.current && dialogo.current.close()}
        onTouchStart={tocar}
        onTouchEnd={soltar}
      >
        <figure>
          <img src={ruta(imagen.src)} alt={tx(imagen.alt)} />
          <figcaption>
            {tx(imagen.alt)} · {t('galeria.posicion', { n: actual + 1, total })}
          </figcaption>
        </figure>
        {total > 1 && controles}
        <button type="button" className="galeria-cerrar" onClick={() => dialogo.current?.close()} aria-label={t('galeria.cerrar')}>
          <X size={22} />
        </button>
      </dialog>
    </div>
  );
}
