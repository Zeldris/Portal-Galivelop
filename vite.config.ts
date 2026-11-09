/// <reference types="vitest/config" />
import { defineConfig, configDefaults } from 'vitest/config';
import react from '@vitejs/plugin-react';

// GitHub Pages sirve el portal en https://zeldris.github.io/Portal-Galivelop/.
// Con un dominio propio, construir con BASE_PATH=/ .
export default defineConfig({
  base: process.env.BASE_PATH ?? '/Portal-Galivelop/',
  plugins: [react()],
  // Los worktrees de subagentes (.claude/worktrees/) traen su propia copia de los tests: no se corren desde aquí.
  test: { exclude: [...configDefaults.exclude, '.claude/**'] },
});
