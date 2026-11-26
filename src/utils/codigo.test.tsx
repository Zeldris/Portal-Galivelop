import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { conCodigo } from './codigo';

const html = (texto: string) => renderToStaticMarkup(<p>{conCodigo(texto)}</p>);

describe('conCodigo', () => {
  it('pinta como <code> lo que va entre comillas invertidas', () => {
    expect(html('Corre `npm run check` antes de subir')).toBe(
      '<p>Corre <code>npm run check</code> antes de subir</p>',
    );
  });

  it('admite varios tramos y uno al principio o al final', () => {
    expect(html('`a` y `b`')).toBe('<p><code>a</code> y <code>b</code></p>');
  });

  it('un texto sin comillas queda igual y una comilla suelta no abre código', () => {
    expect(html('sin código')).toBe('<p>sin código</p>');
    expect(html('una ` suelta')).toBe('<p>una ` suelta</p>');
  });

  it('escapa el HTML de dentro del código', () => {
    expect(html('`<b>`')).toBe('<p><code>&lt;b&gt;</code></p>');
  });
});
