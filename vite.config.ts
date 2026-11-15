/// <reference types="vitest/config" />
import { defineConfig, configDefaults } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resumenesProyectos } from './tools/vite/resumenes';

// GitHub Pages sirve el portal en https://zeldris.github.io/Portal-Galivelop/.
// Con un dominio propio, construir con BASE_PATH=/ .
export default defineConfig({
  base: process.env.BASE_PATH ?? '/Portal-Galivelop/',
  plugins: [react(), resumenesProyectos()],
  // scripts/paginas-estaticas.mjs lee dist/.vite/manifest.json para precargar los chunks de cada ruta.
  build: { manifest: true },
  // Los worktrees de subagentes (.claude/worktrees/) traen su propia copia de los tests: no se corren desde aquí.
  test: { exclude: [...configDefaults.exclude, '.claude/**'] },
});
