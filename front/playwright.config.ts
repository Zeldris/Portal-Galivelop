// galivelop-workflow v0.9.0, adaptado al portal: la web se construye y se sirve con `vite preview` desde la raíz del
// repo (la copia temporal de `front.py run` solo trae lo que git sigue, así que instala y construye ella misma).
import { gwConfig } from './gw-config';

const port = Number(process.env.GW_PORTAL_PORT ?? 4173);
const base = '/Portal-Galivelop/';

export default gwConfig({
  testDir: 'tests',
  use: { baseURL: `http://127.0.0.1:${port}${base}` },
  webServer: {
    command: `npm ci --no-audit --no-fund && npm run build && npx vite preview --host 127.0.0.1 --port ${port} --strictPort`,
    cwd: '..',
    url: `http://127.0.0.1:${port}${base}`,
    reuseExistingServer: false,
    timeout: 600_000,
    stdout: 'ignore',
  },
});
