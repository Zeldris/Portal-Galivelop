# Bitácora de traspaso

Se actualiza en cada commit. Reglas en [`CLAUDE.md`](../CLAUDE.md).

## Estado actual

| | |
|---|---|
| **Actualizado** | 2026-10-04 |
| **Rama de trabajo** | `claude/galivelop-dev-portal-1h89ci` |
| **Push** | ⚠️ Bloqueado (403): la app de Claude para GitHub no tiene acceso de escritura a `Zeldris/Portal-Galivelop`. Los commits están solo en local hasta que se dé acceso |
| **En `main`** | Solo el commit inicial. El portal está en la rama de trabajo, pendiente de confirmar el paso a `main` |
| **Tests** | `npm run check`: tsc 0 errores, vitest 11/11. `npm run build` correcto |

## Hecho

- ✅ Análisis de los repos (World-Maker-Fantasy, Instalador-WMF-Tarkor, VeriNews_AI).
- ✅ Logo GD (azul celeste y blanco), favicon, PNG 512 e imagen para redes.
- ✅ Portal en React + Vite: portada, fichas con galería y secciones plegables, tres idiomas,
  tema claro/oscuro, 404 para rutas en Pages.
- ✅ Fichas de **Tarkor** (juego + instalador como un solo proyecto; 17 imágenes: ilustraciones
  de `backend/uploads`, captura del mapa de zona y del asistente del instalador) y **toVeriAI**
  (9 capturas sacadas del frontend en local; el resultado de análisis usa datos de ejemplo).
- ✅ Revisión móvil (360, 390 y 768 px, claro/oscuro, tres idiomas): sin desbordes; menú
  desplegable bajo 760 px, cifras y tarjetas compactas, galería ampliada opaca y con deslizar.
- ✅ Workflows: `pages.yml` (publica al subir a `main`) y `comprobar.yml` (ramas y PR).

## Pendiente

1. Activar Pages: Settings → Pages → Source → **GitHub Actions** (una vez, en GitHub).
2. Confirmar paso a `main` (eso publica el portal).
3. Revisar con quien lleva la marca: equipo y roles de cada proyecto, y un correo de
   contacto (ahora solo hay enlace a GitHub).
4. Cuando el instalador de Tarkor sea público: añadirlo en `enlaces` de `tarkor.json` y pasar
   el estado si procede.
5. Capturas reales de partida de Tarkor (la interfaz del juego solo tiene la del mapa de zona).

## Comprobar el estado

```bash
npm ci && npm run check && npm run build
```
