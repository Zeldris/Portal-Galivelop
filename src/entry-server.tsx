import { StrictMode } from 'react';
import { prerenderToNodeStream } from 'react-dom/static';
import { StaticRouter } from 'react-router-dom';
import { App } from './App';
import { baseDeIdioma, idiomaDeRuta, ProveedorIdioma } from './i18n/Idioma';
import { precargarRuta } from './paginas';

const sinCambio = () => {};

/**
 * HTML de #root para una dirección (con la base de Vite: `/Portal-Galivelop/gl/proyectos/tarkor/`), con el mismo árbol
 * que `Raiz` de src/main.tsx: el cliente lo hidrata sin volver a pintarlo. Lo usa scripts/paginas-estaticas.mjs tras
 * `vite build --ssr`. Espera a todo lo perezoso (página, ficha, animaciones): no queda ningún «cargando».
 */
export async function renderizar(pathname: string): Promise<string> {
  await precargarRuta(pathname);
  const idioma = idiomaDeRuta(pathname) ?? 'es';
  const { prelude } = await prerenderToNodeStream(
    <StrictMode>
      <StaticRouter basename={baseDeIdioma(idioma)} location={pathname}>
        <ProveedorIdioma idioma={idioma} cambiarIdioma={sinCambio}>
          <App />
        </ProveedorIdioma>
      </StaticRouter>
    </StrictMode>,
    // Sin trocear: con su tamaño por defecto, React manda aparte (con un <script> que lo coloca) el contenido de un
    // Suspense grande, y #root saldría con el «cargando» en su sitio para quien no ejecuta JS.
    { progressiveChunkSize: Number.POSITIVE_INFINITY },
  );
  // Por bytes: un carácter de varios bytes puede quedar partido entre dos trozos.
  const lector = new TextDecoder();
  let html = '';
  for await (const trozo of prelude as AsyncIterable<Uint8Array | string>) {
    html += typeof trozo === 'string' ? trozo : lector.decode(trozo, { stream: true });
  }
  return html + lector.decode();
}
