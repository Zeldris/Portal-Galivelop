# Bitácora de traspaso

Se actualiza en cada commit. Reglas en [`CLAUDE.md`](../CLAUDE.md).

## Estado actual

| | |
|---|---|
| **Actualizado** | 2026-10-04 |
| **Rama de trabajo** | `claude/galivelop-dev-portal-1h89ci` |
| **En `main`** | Portal completo, subido el 2026-10-04 con confirmación expresa. Pages con Source «GitHub Actions»: https://zeldris.github.io/Portal-Galivelop/ |
| **Tests** | `npm run check`: tsc 0 errores, vitest 12/12. `npm run build` correcto |

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
- ✅ Equipo confirmado (Tarkor: solo Álvaro; toVeriAI: Raquel C. y Álvaro) y contacto:
  cordproinf@gmail.com (marca; sustituye al personal desde 2026-10-04) y web.admin.toveriai@gmail.com (toVeriAI).
- ✅ Nuevo mensaje de marca (2026-10-04): Galivelop como taller abierto (crear, investigar,
  innovar, aprender), «El taller», «Participa», y colaboración por proyecto (Tarkor abierto,
  toVeriAI privado). En la rama; pendiente de confirmar el paso a `main`.
- ✅ Formularios «Propón un proyecto» y «Únete al taller» (correo preparado con mailto, en
  castellano, a cordproinf@gmail.com). Correo personal retirado de la web. En la rama; pendiente
  de confirmar el paso a `main`.
- ✅ Workflows: `pages.yml` (publica al subir a `main`) y `comprobar.yml` (ramas y PR).

## Pendiente

1. Revisar el resto de textos de las fichas de proyecto con el nuevo enfoque de taller, si se quiere.
2. Cuando el instalador de Tarkor sea público: añadirlo en `enlaces` de `tarkor.json` y pasar
   el estado si procede.
3. Capturas reales de partida de Tarkor (la interfaz del juego solo tiene la del mapa de zona).

## Comprobar el estado

```bash
npm ci && npm run check && npm run build
```
