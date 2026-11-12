import { useEffect } from 'react';
import { Campo, componerCorreo, PaginaFormulario } from '../components/Formulario';
import { MARCA } from '../data/marca';
import { useIdioma } from '../i18n/Idioma';
import { textos } from '../i18n/textos';

const FASES = ['idea', 'diseno', 'prototipo', 'marcha'] as const;

export function Proponer() {
  const { t, idioma } = useIdioma();
  useEffect(() => {
    document.title = `${t('prop.titulo')} · Galivelop`;
    return () => {
      document.title = 'Galivelop';
    };
  }, [t]);

  return (
    <PaginaFormulario
      titulo={t('prop.titulo')}
      intro={t('prop.intro')}
      componer={(d) => {
        // El correo lo lee el taller: siempre en castellano, con etiquetas cortas.
        const v = (k: string) => String(d.get(k) ?? '');
        const fase = v('fase') as (typeof FASES)[number] | '';
        return componerCorreo(MARCA.correo, `[Galivelop] Propuesta: ${v('proyecto')}`, [
          ['Nombre', v('nombre')],
          ['Correo', v('correo')],
          ['Proyecto', v('proyecto')],
          ['Punto en que está', fase ? textos.es[`prop.fase.${fase}`] : ''],
          ['Descripción', v('descripcion')],
          ['Papel que quiere tener', v('papel')],
          ['Enlace', v('enlace')],
          ['Idioma de la web', idioma],
        ]);
      }}
    >
      <Campo etiqueta={t('prop.proyecto')}>
        <input name="proyecto" required />
      </Campo>
      <Campo etiqueta={t('prop.descripcion')} ayuda={t('prop.descripcion.ayuda')}>
        <textarea name="descripcion" rows={6} required />
      </Campo>
      <fieldset className="campo">
        <legend className="campo-etiqueta">{t('prop.fase')}</legend>
        <div className="opciones">
          {FASES.map((f, i) => (
            <label key={f} className="opcion">
              <input type="radio" name="fase" value={f} defaultChecked={i === 0} />
              {t(`prop.fase.${f}`)}
            </label>
          ))}
        </div>
      </fieldset>
      <Campo etiqueta={t('prop.papel')} ayuda={t('prop.papel.ayuda')} opcional>
        <textarea name="papel" rows={3} />
      </Campo>
      <Campo etiqueta={t('prop.enlace')} ayuda={t('prop.enlace.ayuda')} opcional>
        <input name="enlace" type="url" placeholder="https://" />
      </Campo>
    </PaginaFormulario>
  );
}
