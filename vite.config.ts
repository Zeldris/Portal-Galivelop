import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages sirve el portal en https://zeldris.github.io/Portal-Galivelop/.
// Con un dominio propio, construir con BASE_PATH=/ .
export default defineConfig({
  base: process.env.BASE_PATH ?? '/Portal-Galivelop/',
  plugins: [react()],
});
