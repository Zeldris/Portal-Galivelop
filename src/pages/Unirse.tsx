import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Campo, componerCorreo, PaginaFormulario } from '../components/Formulario';
import { MARCA } from '../data/marca';
import { proyectos } from '../data/proyectos';
import { useIdioma } from '../i18n/Idioma';
import { textos } from '../i18n/textos';

const AREAS = ['codigo', 'diseno', 'ia', 'contenido', 'pruebas', 'investigacion', 'aprender'] as const;

export function Unirse() {
  const { t, idioma } = useIdioma();
  const [params] = useSearchParams();
  // Solo se puede pedir unirse a proyectos abiertos.
  const abiertos = proyectos.filter((p) => p.colaboracion === 'abierta');
  const proyectoInicial = abiertos.some((p) => p.slug === params.get('proyecto')) ? params.get('proyecto')! : 'cualquiera';
  const aprender = params.get('modo') === 'aprender';

  useEffect(() => {
    document.title = `${t('unir.titulo')} · Galivelop`;
    return () => {
      document.title = 'Galivelop';
    };
  }, [t]);

  const nombreOpcion = (valor: string) =>
    valor === 'cualquiera'
      ? textos.es['unir.proyecto.cualquiera']
      : valor === 'nuevos'
        ? textos.es['unir.proyecto.nuevos']
        : (proyectos.find((p) => p.slug === valor)?.nombre ?? valor);

  return (
    <PaginaFormulario
      titulo={t('unir.titulo')}
      intro={t('unir.intro')}
      componer={(d) => {
        // El correo lo lee el taller: siempre en castellano, con etiquetas cortas.
        const v = (k: string) => String(d.get(k) ?? '');
        const areas = d.getAll('areas').map((a) => textos.es[`unir.area.${a as (typeof AREAS)[number]}`]);
        return componerCorreo(MARCA.correo, `[Galivelop] Unirse al taller: ${v('nombre')}`, [
          ['Nombre', v('nombre')],
          ['Correo', v('correo')],
          ['Quiere participar en', nombreOpcion(v('proyecto'))],
          ['Cómo quiere aportar', areas.join(', ')],
          ['Sobre la persona', v('sobreti')],
          ['Disponibilidad', v('disponibilidad')],
          ['Portfolio, GitHub o LinkedIn', v('enlace')],
          ['Idioma de la web', idioma],
        ]);
      }}
    >
      <Campo etiqueta={t('unir.proyecto')}>
        <select name="proyecto" defaultValue={proyectoInicial}>
          <option value="cualquiera">{t('unir.proyecto.cualquiera')}</option>
          {abiertos.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.nombre}
            </option>
          ))}
          <option value="nuevos">{t('unir.proyecto.nuevos')}</option>
        </select>
      </Campo>
      <fieldset className="campo">
        <legend className="campo-etiqueta">{t('unir.areas')}</legend>
        <div className="opciones">
          {AREAS.map((a) => (
            <label key={a} className="opcion">
              <input type="checkbox" name="areas" value={a} defaultChecked={aprender && a === 'aprender'} />
              {t(`unir.area.${a}`)}
            </label>
          ))}
        </div>
      </fieldset>
      <Campo etiqueta={t('unir.sobreti')} ayuda={t('unir.sobreti.ayuda')}>
        <textarea name="sobreti" rows={6} required />
      </Campo>
      <div className="campos-fila">
        <Campo etiqueta={t('unir.disponibilidad')} ayuda={t('unir.disponibilidad.ayuda')} opcional>
          <input name="disponibilidad" />
        </Campo>
        <Campo etiqueta={t('unir.enlace')} opcional>
          <input name="enlace" type="url" placeholder="https://" />
        </Campo>
      </div>
    </PaginaFormulario>
  );
}
