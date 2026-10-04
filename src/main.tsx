import '@fontsource-variable/inter';
import '@fontsource-variable/sora';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import './estilos/global.css';
import { ProveedorIdioma } from './i18n/Idioma';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ProveedorIdioma>
        <App />
      </ProveedorIdioma>
    </BrowserRouter>
  </StrictMode>,
);
