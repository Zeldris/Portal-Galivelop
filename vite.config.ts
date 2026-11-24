/// <reference types="vitest/config" />
import { defineConfig, configDefaults } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resumenesProyectos } from './tools/vite/resumenes';

// GitHub Pages sirve el portal en https://zeldris.github.io/Portal-Galivelop/.
// Con un dominio propio, construir con BASE_PATH=/ .
export default defineConfig({
  base: process.env.BASE_PATH ?? '/Portal-Galivelop/',
  plugins: [react(), resumenesProyectos()],
  build: {
    rolldownOptions: {
      output: {
        // React y el router, cada uno en su trozo: cambian muy poco entre publicaciones (se quedan en la caché del
        // navegador) y el JS de la app, mucho más pequeño, se descarga y se analiza en paralelo con ellos.
        codeSplitting: {
          groups: [
            // Los logos de simple-icons (~250 kB) solo los usan el equipo y las fichas: sin esto caían en el trozo de la portada.
            { name: 'iconos', test: /node_modules[\\/]simple-icons[\\/]/, priority: 30 },
            { name: 'react', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/, priority: 20 },
            { name: 'router', test: /node_modules[\\/](react-router|react-router-dom|cookie|set-cookie-parser)[\\/]/, priority: 10 },
          ],
        },
      },
    },
  },
  // Los worktrees de subagentes (.claude/worktrees/) traen su propia copia de los tests: no se corren desde aquí.
  test: { exclude: [...configDefaults.exclude, '.claude/**', 'front/**'] },
});
