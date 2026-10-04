import { ArrowLeft, Check, Copy, Mail, Send } from 'lucide-react';
import { useState, type FormEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { MARCA } from '../data/marca';
import { useIdioma } from '../i18n/Idioma';

export interface Correo {
  asunto: string;
  cuerpo: string;
  mailto: string;
}

/**
 * Compone el correo de un formulario: una línea por campo con contenido («Etiqueta: valor»;
 * los textos largos van debajo de su etiqueta). La web es estática, así que el envío lo hace
 * la aplicación de correo de quien rellena el formulario.
 */
export function componerCorreo(destino: string, asunto: string, campos: [string, string][]): Correo {
  const cuerpo = campos
    .filter(([, valor]) => valor.trim())
    .map(([etiqueta, valor]) => (valor.includes('\n') || valor.length > 80 ? `${etiqueta}:\n${valor.trim()}` : `${etiqueta}: ${valor.trim()}`))
    .join('\n\n');
  const mailto = `mailto:${destino}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
  return { asunto, cuerpo, mailto };
}

interface Props {
  titulo: string;
  intro: string;
  /** Devuelve el correo a partir de los datos del formulario. */
  componer: (datos: FormData) => Correo;
  children: ReactNode;
}

/** Página de formulario: prepara el correo, lo abre y ofrece copiarlo si no se abre. */
export function PaginaFormulario({ titulo, intro, componer, children }: Props) {
  const { t } = useIdioma();
  const [correo, setCorreo] = useState<Correo | null>(null);
  const [copiado, setCopiado] = useState(false);

  const enviar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const c = componer(new FormData(e.currentTarget));
    setCorreo(c);
    setCopiado(false);
    window.location.href = c.mailto;
  };

  const copiar = async () => {
    if (!correo) return;
    try {
      await navigator.clipboard.writeText(`${MARCA.correo}\n${correo.asunto}\n\n${correo.cuerpo}`);
      setCopiado(true);
    } catch {
      setCopiado(false);
    }
  };

  return (
    <section className="seccion formulario-pagina">
      <div className="contenedor formulario-contenedor">
        <Link to="/#participa" className="volver volver-oscuro">
          <ArrowLeft size={16} /> {t('form.volver')}
        </Link>
        <h1>{titulo}</h1>
        <p className="formulario-intro">{intro}</p>

        <form className="formulario" onSubmit={enviar}>
          <div className="campos-fila">
            <Campo etiqueta={t('form.nombre')}>
              <input name="nombre" required autoComplete="name" />
            </Campo>
            <Campo etiqueta={t('form.correo')}>
              <input name="correo" type="email" required autoComplete="email" />
            </Campo>
          </div>
          {children}
          <p className="formulario-nota">{t('form.nota', { correo: MARCA.correo })}</p>
          <button type="submit" className="boton boton-primario">
            <Send size={16} /> {t('form.enviar')}
          </button>
        </form>

        {correo && (
          <div className="formulario-listo" role="status">
            <h2>
              <Check size={20} /> {t('form.listo.titulo')}
            </h2>
            <p>{t('form.listo.texto', { correo: MARCA.correo })}</p>
            <pre>{`${correo.asunto}\n\n${correo.cuerpo}`}</pre>
            <div className="formulario-listo-botones">
              <button type="button" className="boton boton-secundario" onClick={copiar}>
                {copiado ? <Check size={16} /> : <Copy size={16} />} {copiado ? t('form.copiado') : t('form.copiar')}
              </button>
              <a className="boton boton-secundario" href={correo.mailto}>
                <Mail size={16} /> {t('form.abrir')}
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export function Campo({
  etiqueta,
  ayuda,
  opcional,
  children,
}: {
  etiqueta: string;
  ayuda?: string;
  opcional?: boolean;
  children: ReactNode;
}) {
  const { t } = useIdioma();
  return (
    <label className="campo">
      <span className="campo-etiqueta">
        {etiqueta}
        {opcional && <span className="campo-opcional"> ({t('form.opcional')})</span>}
      </span>
      {children}
      {ayuda && <span className="campo-ayuda">{ayuda}</span>}
    </label>
  );
}
