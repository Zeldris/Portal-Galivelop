# Auditorías nuevas del portal · 2026-11-17

Pedidas por la persona: «todas las auditorías posibles a la web… si ves que hay alguna más que sea interesante,
añádela y ejecútala», y después «otra auditoría para ver que estamos cumpliendo todo lo que está escrito». Rama
`ccr-8e0862c2-niq1xt`, sobre `main` 6eb3739. Las del 2026-11-14 (estilos, React, navegador a mano, responsive,
contenido y fichas; [informe](auditoria-2026-11-14.md)) y el SEO (`npm run seo`) no se repiten.

## Veredicto

**La web es segura, privada y accesible; lo flojo es la velocidad en móvil y lo que queda sin JavaScript.** No hay
terceros, cookies, secretos ni fallos graves de accesibilidad. En cambio, en móvil con 4G lento las fichas tardan
4,2-4,5 s en pintar su imagen principal, la página salta al montarse (CLS hasta 0,57) y todas las páginas cargan un
JS de 538 kB. Sin JavaScript no hay cabecera, menú ni pie, y la web no tiene estilos de impresión. La documentación
se ha quedado atrás en cinco sitios.

## Cinco auditorías

Las cuatro primeras son scripts nuevos que se pueden repetir, tras `npm run build`:

| Auditoría | Orden | Graves | Medios | Leves |
|---|---|---|---|---|
| Accesibilidad automática (axe-core, WCAG 2.2 AA) | `npm run auditar:a11y` | 0 | 1 | 2 |
| Rendimiento y Core Web Vitals | `npm run auditar:rendimiento` | 3 | 5 | 4 |
| Seguridad, privacidad y dependencias | `npm run auditar:seguridad` | 0 | 1 | 6 |
| HTML, datos estructurados, sin JS, impresión e idiomas | `npm run auditar:html` | 0 | 6 | 4 |
| Conformidad con lo escrito (32 requisitos) | a mano | 0 | 1 | 3 + 5 de doc |

Las cifras de rendimiento son de laboratorio en un contenedor (390×844, 4G lento, CPU ×4): orientativas, y el TTFB
es el de un servidor local, no el de GitHub Pages.

## Hallazgos

### Rendimiento

| | Hallazgo | Arreglo propuesto |
|---|---|---|
| Grave | **LCP de 4,2-4,5 s en las fichas** en móvil (toVeriAI 3,2 s): la portada se pide solo después de cargar el JS, el trozo de la página y el de datos. | `<link rel="preload">` de la portada (y del trozo de la ficha) en cada HTML de `scripts/paginas-estaticas.mjs`; portada móvil más pequeña. |
| Grave | **CLS de 0,12-0,57** en fichas, páginas legales y miembros (peor: /equipo/alvaro-garcia-grana, 0,57 en escritorio). Hipótesis sin confirmar: `createRoot` sustituye el HTML estático y el `Suspense` no reserva alto. | Probar `hydrateRoot` en `src/main.tsx` o un fallback con alto reservado en `src/App.tsx`. |
| Grave | **Un trozo de JS de 538 kB** (158 kB gzip) en todas las páginas; con él, TBT de 100-227 ms incluso en páginas de texto. | `manualChunks` en `vite.config.ts` (React aparte) y datos de las fichas por importación dinámica. |
| Medio | LCP del inicio 2,7 s (es, gl, en): `hero-fondo` llega tarde. | Preload en `index.html` y en el estático. |
| Medio | LCP de /participa/unirse 2,7 s: `formulario-ilustracion` sin prioridad ni medidas. | `fetchpriority` y `width`/`height` en `src/pages/Unirse.tsx`. |
| Medio | 15 woff2 (326 kB), sin preload; cada página baja 126 kB de fuentes, con subsets cirílico, griego y vietnamita que no se usan. | Importar solo el subset latino y precargar los dos woff2 principales. |
| Medio | Imágenes sin `srcset`, cuantificado: `portada-mini` de 720 px se pinta a 56 px (×12,9); Tarkor transfiere 1,08 MB de imágenes. | Miniaturas reales (ya en pendiente, ahora con cifra). |
| Leve | CSS de 85 kB (18 gzip) en un archivo; mapas de Tarkor de 300-340 kB (`lazy`); 45-49 peticiones en las fichas de IG y Tarkor. INP bien (56-112 ms). | Sin urgencia. |

### HTML, sin JavaScript, impresión e idiomas

| | Hallazgo | Arreglo propuesto |
|---|---|---|
| Medio | **Sin estilos de impresión** (`@media print`: 0 en `src/`): se imprimen cabecera, menú, 53 botones de la ficha de Tarkor y, en tema oscuro, el fondo oscuro. | Bloque `@media print` en `src/estilos/global.css`. |
| Medio | **Sin JavaScript no hay cabecera, menú, pie ni selector de idioma** en las 42 páginas estáticas: solo `<main>`. El inicio enseña el 7 % de su texto. | Cabecera y pie estáticos en `scripts/paginas-estaticas.mjs`. |
| Medio | El `h1` estático no coincide con el de la app en inicio, equipo, proponer y unirse («Equipo · Galivelop» frente a «Equipo»). | Igualarlos en `scripts/paginas-estaticas.mjs`. |
| Medio | JSON-LD: `publisher` (Organization) sin `url` en 24 páginas. | `scripts/paginas-estaticas.mjs`. |
| Medio | Frases idénticas en castellano y gallego en `tarkor.json` (9), `toveriai.json` (2) y `galivelop-workflow.json` (1), y en el título de dos páginas de miembro en gallego. Parte son correctas en gallego (p. ej. «Ave corredora de caza menor. Inofensiva.»): **a revisar una por una**, no se dan por fallo. | Revisión de un hablante. |
| Leve | Sin `<noscript>`; sin `BreadcrumbList`; `SoftwareApplication` sin `offers` ni `applicationCategory` (9 fichas); el JSON-LD repite el correo publicado. | Opcional. |

Sin fallos: ids únicos, `lang` según la ruta, `canonical` y `hreflang` recíprocos con `x-default`, un solo `h1`,
títulos y descripciones únicos, JSON-LD válido, mismos apartados, enlaces e imágenes en los tres idiomas, y enlaces
internos con `href` real.

### Accesibilidad

| | Hallazgo | Arreglo propuesto |
|---|---|---|
| Medio | **WCAG 2.5.3 (Label in Name)** en /equipo (es, gl, en): `.persona-ver` se ve «Ver perfil» y su `aria-label` es «Ver el perfil de …», que no empieza por el texto visible (quien usa control por voz dice «Ver perfil» y no funciona). | `aria-label` que empiece por «Ver perfil» (p. ej. «Ver perfil de …») en `src/pages/Equipo.tsx` y `src/i18n/`. |
| Leve | 1.4.12: `p.tarjeta-resumen` (inicio) y `p.vistazo-texto` (Tarkor) se cortan con `line-clamp` al ampliar el espaciado; el texto completo está en la ficha. | Aceptar y apuntar como decidido, o quitar el `line-clamp` con espaciado amplio. |
| Leve | Colores forzados: botones, selector de idioma, tarjetas y pestañas sin borde propio; la heurística no es concluyente. | Ya en pendiente; mirar a mano. |

Sin fallos: el resto de reglas de axe (best-practice incluidas) en 43 rutas × 2 temas × 2 ventanas, reflow a 320 px,
foco visible y orden de Tab sin trampas, y `prefers-reduced-motion` sin animaciones. El «Gali» del logotipo queda
fuera de `color-contrast` en el script (exento, decidido el 2026-11-14).

### Seguridad y privacidad

| | Hallazgo | Arreglo propuesto |
|---|---|---|
| Medio | `npm audit`: vite 8.3.0-8.3.2 con avisos altos (GHSA-9jrq-w75r-8gcw y otros). **Solo el servidor de desarrollo y `preview`**, no la web publicada. | `npm audit fix` (vite 8.3.8) y check. |
| Leve | Sin CSP ni `referrer` por `<meta>` (Pages no deja cabeceras). Es viable: solo 2 scripts inline (tema e idioma). | `script-src 'self'` con los hashes de esos dos, generados por `paginas-estaticas.mjs`. Beneficio modesto. |
| Leve | Sin atribución de la licencia OFL de las fuentes ni nota de marcas de simple-icons. | Apartado «Créditos» en /aviso-legal. |
| Leve | Dependencias desfasadas sin CVE en producción (react 19.3.1, react-router-dom 7.18.5…). | `npm update` y check. |
| Leve | Acciones de los workflows por etiqueta, no por SHA; `Swatinem/rust-cache` aunque el portal no usa Rust. | Viene de la plantilla del flujo (`check.yml` es `ownedFiles`): proponerlo a Galivelop-workflow. |
| Leve | Sin `security.txt` ni `SECURITY.md`. Los dos correos publicados a propósito invitan al spam (el dominio propio ya está en pendiente). | Opcional. |

Limpio: ningún tercero, cookie, iframe, `http://`, secreto, ruta local ni source map, ni en `dist/` ni en los 919
archivos del repo; `localStorage` solo guarda el tema y `sessionStorage` dos claves de navegación, sin datos
personales (art. 22.2 LSSI-CE: no hace falta aviso de cookies); /privacidad describe lo que hace la web; los
formularios solo usan `mailto:` y copiar; licencias compatibles con MIT; workflows con permisos mínimos;
`npm audit --omit=dev` en 0.

### Conformidad con lo escrito

32 requisitos de `AGENTS.md`, `docs/desarrollo.md`, las ADR, `docs/marca.md`, `GLOSSARY.md`, `REVIEW.md` y las reglas
de fichas: **27 cumplen**, 2 parciales, 1 contradice, 1 no aplica y 1 no comprobable (CI y otros navegadores).
Cumplen, entre otros: tres idiomas, repos privados sin enlazar, tema claro por defecto, solo las tres tipografías de
la marca, sin degradados ni desenfoques, colores solo de tokens, /productos como paso `noindex` fuera del sitemap y
el muro vacío sin enlace.

| | Hallazgo | Arreglo propuesto |
|---|---|---|
| Medio | `docs/marca.md` (regla 3) pide chaflán de 14 px en las fichas con el token `--chaflan`; el CSS tiene `--chaflan-grande` (28) y `--chaflan-pequeno` (10), y ninguna tarjeta lo lleva (solo `.boton`, `.collage-0` y `.retrato`). | **Decisión de la persona**: aplicarlo a las tarjetas o corregir la doc. |
| Leve | Regla 6 de `docs/marca.md`: cabeceras de sección en celeste plano; /equipo y /novedades usan ilustraciones. | Decidir y ajustar la doc o la web. |
| Leve | `galivelop-workflow.json` tiene 9 novedades; las reglas de fichas fijan un máximo de 8. | Quitar la más antigua en la próxima semanal. |
| Leve | Contraste AA del texto sobre bloques celestes, sin medir. | Medirlo (test propuesto abajo). |

**Documentación que se ha quedado vieja:** (1) `docs/desarrollo.md` da `#0083C1` como «celeste intenso»: el código
usa `--celeste-hondo` (`#0072a8` claro, `#1aa6df` oscuro); (2) `gw-portal/proyectos.md` dice «no enlaces cada versión
a su release», pero desde el 2026-11-14 la persona pidió el enlace de la última versión publicada; (3) la tabla de
tokens de `docs/marca.md` lista `--chaflan` y omite `--celeste-intenso` y `--blanco`, y `global.css:24` nombra una
clase `.chaflan` que no existe; (4) las tablas de recursos de `docs/marca.md` dan como pedidos recursos ya cancelados
o provisionales (isobatas, 20-22); (5) la ADR 0002 y `docs/desarrollo.md` siguen hablando de `/productos/<slug>` y del
catálogo, que sustituyó la ADR 0004.

**Tests propuestos** (lo comprobable lo hace un script): fichas frente a sus reglas (máximo 8 novedades, `actualizado`
igual a la primera novedad, `enlaces` solo a repos públicos); tabla de tokens de `docs/marca.md` frente a `:root`
(habría cazado `--chaflan` y `#0083C1`); contraste de los pares de tokens; que existan los archivos de la tabla
«Entregados»; y en el render, solo las tres familias, sin `border-radius` salvo `.estado-punto` y sin
`backdrop-filter`.

## No comprobado

Safari, Firefox y un dispositivo real; las cifras de rendimiento en GitHub Pages (solo laboratorio); la configuración
del repo en GitHub (rama protegida, Dependabot); los enlaces externos (el proxy del entorno los bloquea).
