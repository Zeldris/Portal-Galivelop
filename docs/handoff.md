# Bitácora de traspaso

Se actualiza en cada commit. Reglas en [`CLAUDE.md`](../CLAUDE.md).

## Estado actual

| | |
|---|---|
| **Actualizado** | 2026-11-14 (flujo Galivelop-workflow al día: 0.5.0 → 0.6.0, en `ccr-5c066d81-ndsd13`) |
| **Rama de trabajo** | `claude/galivelop-dev-portal-1h89ci` (la que publica la tarea semanal); esta sesión, `ccr-5c066d81-ndsd13` (al día con `main`, 37e957b, 2026-11-14) |
| **Tarea en curso** | Ninguna |
| **Siguiente paso** | Nada pendiente en esta rama. En cola en el generador: portada 31 de workflow (q974-976), icono 23 de Voice en contorno (sustituirá a q926) e icono 23 **provisional** de Tarkor (anillo, `#E0703A`, q971-973). En `src/img/`, `sin-uso/` pasa a llamarse `aprobadas/` (aprobado sin sitio en la web) |
| **En `main`** | **Retícula más tenue y flujo Galivelop-workflow 0.6.0** (2026-11-14, la persona: «Si sube a main»; fase 1 sin hallazgos y fase 3, sin retro por ser cambio pequeño; bitácora archivada a mano en `docs/records/handoff-archive.md`). Antes, **Rosa 04b, «Cómo funciona» 10b, portada de Voice y «enviado» oscuro** (fd7929a, 2026-11-14, la persona: «las aplicas ya y así lo vemos en main»; fase 1 y 3, sin retro por ser cambio pequeño; CI en verde en d0d4d68). Antes, **Iconos de grupo (25), marcadores del avance (26), banda 29 clara y oscura, cabecera 30, rosa y sello** (f7ce483, 2026-11-13, la persona: «llévalo a main»; fase 1 y 3, sin retro por ser cambio pequeño; CI en verde en edbdd74). Lo anterior, en «Hecho» y en `git log origin/main`. https://zeldris.github.io/Portal-Galivelop/ |
| **Tests** | `npm run check`: tsc 0 errores, `prettier --check` de `src/`, vitest 205/205 (23 archivos) y `tools/qa/tests/test-ganchos.sh`. `npm run build` correcto (42 páginas estáticas, sitemap, robots y llms) |

### Para la próxima publicación

La web se publica los domingos a las 20:45 (hora de Madrid) con la tarea programada «Proyectos semanal» (ver `AGENTS.md`).
Aquí se apunta lo que está en la rama de trabajo y aún no en `main`.

- Lo anterior está en `main` (37e957b, 2026-11-14).
- **Retícula del papel más tenue** (2026-11-12, `ccr-5c066d81-ndsd13`): `--reticula` pasa a `#eef3f6` (claro) y `#121e27` (oscuro), y `docs/marca.md` lo recoge. La persona eligió esta opción entre tres (la actual, más tenue y puntos en los cruces) porque las líneas cortaban el texto. Las isobatas del hero se quedan como estaban (la persona: «en la portada estaba bien»). No afecta al generador. Revisado (2026-11-14, sin hallazgos); falta la marca antes de `main`.
- **Flujo Galivelop-workflow 0.6.0** (2026-11-14, `ccr-5c066d81-ndsd13`, `/gw-update`; la persona: «Sí, aplica»): scripts, skills y ganchos al día (ninguno tenía ediciones locales), 11 scripts nuevos, skill `gw-metrics`, subagente `gw-worker`, `settings.json` con el aviso de lectura entera, el libro de tokens en el `Stop` y `worktree.baseRef`. Fusionados a mano `AGENTS.md` (el `pre-push` de una rama corre solo los tests relacionados, trailers `Findings:`/`Retries:`, revisión por bloques; las reglas del portal, intactas), `CLAUDE.md` (solo la marca), `check.yml` (plantilla nueva con Node 22, caché de npm y el build del portal) y `REVIEW.md` (tres reglas: `while read` con `< /dev/null`, scripts que hacen commits probados con los ganchos, prueba de humo contra lo real). Revisado (2026-11-14, fase 1 en la sesión con `review-scope.py --workflow` contra la v0.6.0: 70 de 88 archivos copiados tal cual, fuera; 7 de código y 90 líneas, sin hallazgos); falta la marca antes de `main`.

## Hecho

- 2026-11-12 · **Portadas 06 rehechas, 27 y 28, a `main`** (704b662): portadas 06 rehechas (faro en obra, boya, barco de papel; sustituyen a los tres faros), 27 en el aviso vacío del muro y de novedades (`AvisoVacio.tsx`, sustituye a `.vacio-carta`) y 28 en `AvisoError.tsx` (sustituye al monograma). 25 y 26 en espera: series incompletas (ver `docs/marca.md`).
- 2026-11-12 · En `main` (c19d6af): hoja del generador del 2026-11-12 (`galivelop-image-generator`, rama `hojas-repos`, `2a9af6f`; nota `docs/propuestas/portal/entrega-hoja-2026-11-12.md`), aplicada en `ccr-47f8fddd-o5ek6p` (la persona: «aplicar la idea tal cual, con lo que acabamos de decidir a mayores»): `docs/marca.md` al día (puntos 1-8, 10 y 17: «Alcance», «Acento de cada proyecto», tokens que faltaban, chaflán de botones, regla 10, tracking 0,06 em, excepciones náuticas con las portadas 6, dudas cerradas, 11/16/20/21 por CSS, pedidos 25-30 en cola); acento de workflow `#3D6FD9` y de voice `#D9467A` (11, 14); tono hondo y oscuro de cada acento calculados en OKLCH (`src/data/tonos.ts`, `estiloAcento`) para texto y bloques con blanco (13, 15); `marca.test.ts` recorre todas las hojas `.css` y prohíbe colores fuera de los tokens (16); «IA local» con la 7a (`codigo.svg`) y no `Cpu` (9: la hoja pedía la 7b, que ya está en «Del prototipo al producto»).
- 2026-11-12 · En `main` (c19d6af): reutilizar lo ya generado (2026-11-12, `ccr-47f8fddd-o5ek6p`): componente `Separador` (también en el inicio) en ficha, novedades (entre meses) y páginas legales; ramas en «¿Quieres participar en…?»; marco del retrato en el hueco de Equipo y en el equipo de la ficha (cierra el leve de `.avatar`); icono de cada proyecto en Novedades; isobatas tenues en el aviso vacío del muro y de novedades. Aprobado por la persona salvo el icono de los formularios (quitado).
- 2026-11-12 · imágenes del generador del 2026-11-12 en main (rama ccr-47f8fddd-o5ek6p, 87940a6; la persona: «por ahora publicamos lo que tenemos»). 2026-11-11: iconos propios 7a, 8a, 8d y 9c en el inicio (fe3c6d5); marco del retrato (17) e icono de Galivelop-workflow (23) (d1d5ede); imágenes del generador 06, 10, 13, 15, 18 y 19 (PR #2, 6f44c27).
- 2026-11-11 · **Rama de la otra sesión (`ccr-47a38edd-v566du`) y novedad de Tarkor, a `main`** (48827b1; la persona: «Y apruebo todo, lleva a main»): vistas previas en redes por idioma (imágenes `-gl`/`-en` del portal y de las fichas, páginas de paso con la tarjeta de `/equipo/` en su idioma, herramientas de `tools/og/` y `og.test.ts`), avance por versiones de Galivelop-workflow e Image Generator según sus hojas de ruta, toVeriAI al día (novedad del 2026-11-09, hito 1.13) y novedad de Tarkor del 2026-11-10 (generador de mapas por capas, viajes con horas y jornadas, 25 zonas al canon; escrita desde el contraste, el texto del informe no llegó al repo). Tras publicar, refrescar las tarjetas ya compartidas (Sharing Debugger, Post Inspector, `@WebpageBot`).
- Lo anterior (41 entradas, hasta el 2026-11-11), en [`docs/records/handoff-archive.md`](records/handoff-archive.md#2026-11-14); y en `git log origin/main`.
- 🚧 2026-11-03 · **Skill `gw-portal`** (la persona: «tiene que empezar por gw-»). `SKILL.md` con modos informe, aplicar y semanal; `fuentes.json` (repos del titular, VeriNews_AI de extra, destino ficha, próximamente o ignorar); `scripts/recoger.py` (lista de repos, clones, fechas F y N de cada ficha, commits sin ruido, etiquetas, bitácoras y planes, rutas vigiladas, difusión lista, enlaces según ADR 0003, repos nuevos y perdidos) con 5 tests que corre `test-ganchos.sh` (también el «escaparate»: imágenes y diagramas del proyecto en el portal con su fecha, y los archivos públicos que lo nombran, contenido o código); `proyectos.md` con las reglas por proyecto sacadas del texto de la tarea semanal, más la regla de la persona (2026-11-03): con commits, siempre una novedad que cuente por encima lo trabajado o probado, y repaso del escaparate entero (ficha, imágenes, diagramas y páginas que lo nombran). Nada del portal se actualiza hasta la 0.5 del flujo. `docs/runbooks/tarea-semanal.md` lleva ya el texto corto (pendiente de pegar) y `src/data/tarea-semanal.test.ts` exige sección en `proyectos.md` y repo en `fuentes.json` para cada ficha y entrada de próximamente. Fila nueva en `selector.cases`.













## Pendiente

- **Decisiones del `/gw-update` 0.6.0** (2026-11-14): `check.yml` pasa a `ownedFiles` en `.claude/gw.json` (la persona: «En este caso sí», 2026-11-14): lleva pasos propios del portal (Node 22, caché de npm, build) y `apply.py --check` sale ya en 0; para no perder los cambios de la plantilla del CI, `.claude/gw/gw-update.md` pide compararla a mano en cada `/gw-update`. El libro de tokens (`docs/metrics/ledger.jsonl`, lo escribe el gancho `Stop`) ya lleva `merge=union` en `.gitattributes` (la persona: «Sí, añádelo», 2026-11-14; el flujo lo traerá a los proyectos en la 0.7, B32). `doctor.py` avisa (WARN): `AGENTS.md` con 194 líneas (aviso desde 150), tests de `gw-media-content`, `gw-opt-tokens`, `gw-portal` y `gw-seo` que el check no corre, y `gw-seo` sin versión. `apply.py` lista nombres viejos (`recoger.py`, `docs/traspaso.md`, `docs/registros`, `docs/difusion`) en `gw-portal`, `docs/desarrollo.md`, `src/data/tipos.ts` y la ficha de workflow: parte puede ser a propósito (`gw-portal` lee repos que pueden seguir con esos nombres).

- **Ficha de Galivelop Developer, cuando se cree** (2026-11-11): su portada es el barco de papel sobre mar con olas, ya en `public/proyectos/galivelop-developer/portada.webp` y `portada-mini.webp`; esa imagen es solo de Developer (ver `docs/marca.md`, fila 15 Developer).

- **Leves de la revisión de la segunda tanda del 2026-11-14** (no se vuelven a revisar en este cambio): `TarjetaProducto` no mira `iconoPropio` (Voice saldría con su icono de lucide si pasa a producto); el icono de Voice lleva sus colores fijos y no sigue el tema (aceptado hasta que llegue el de contorno).

- **Leves de la revisión de la entrega del 2026-11-14** (no se vuelven a revisar en este cambio): la banda 29 de `Proyecto.tsx` sigue con su propio par de imágenes y sus selectores en vez de `ImagenTema` (2026-11-14: ya lo usan formularios, 404 y avisos; a la banda le falta el `srcSet`); ningún test comprueba que se vea una sola imagen por tema (que existan, sí: `marca.test.ts`, 2026-11-14).

- **Leves de la revisión de 25, 26, 29, 30, rosa y sello** (2026-11-13, no se vuelven a revisar en este cambio): los SVG de 25 y 26 pesan 4-20 KB y se repiten en línea por cada hito y grupo (unos 250 KB en el HTML de la ficha de workflow; un `<symbol>` con `<use>` o trazados simplificados lo evitan, junto con el pendiente de `limpiar-iconos.cjs`); `FUENTES` de `IconoMarca.tsx` perdió el orden alfabético; la rosa queda a 280 px sin versión 2x (marca de agua al 12 %).

- **Leves de la revisión de 06 rehechas, 27 y 28** (2026-11-12, no se vuelven a revisar en este cambio): el `<img>` de ilustración enmarcada (ruta, `alt=""`, 480×360) está copiado en `AvisoVacio`, `AvisoError` y `NoEncontrado` (sacar un componente cuando lleguen las versiones oscuras); 27 y 28 se ven claras en el tema oscuro hasta que lleguen sus versiones (como 10 y 18).

- **Leves de la revisión de la hoja del generador y de «reutilizar lo generado»** (2026-11-12, no se vuelven a revisar en este cambio): `IconoTecnologia.tsx` repite la luminancia WCAG de `src/data/tonos.ts` (con el umbral viejo 0,03928; usar `contraste`); los tonos del acento cuelgan del selector `[style*='--acento-proyecto']` de `global.css`, que depende de cómo React escribe el `style` (una clase `con-acento` puesta por `estiloAcento` sería más firme); `marca.test.ts` no detecta colores con nombre (`red`, `teal`…).

- **Leves de la revisión de las imágenes del 2026-11-12** (no se vuelven a revisar en este cambio): el `<img className="separador">` está copiado dos veces en `Inicio.tsx` (sacar un `Separador`); los SVG de los iconos nuevos son trazos en escalera de 6-15 KB cada uno, unos 100 KB en el bundle del inicio (simplificar los trazados en `tools/marca/limpiar-iconos.cjs`); la portada por estado (190-220 KB) se carga entera en el móvil, sin `-mini` ni `srcset`; los 6 commits de `ccr-47f8fddd-o5ek6p` llevan `Co-Authored-By: Claude` contra la preferencia de la persona (no se reescribe historia subida; desde af0807f, sin esa línea).

- **Leves de la revisión de los iconos propios** (2026-11-11, no se vuelven a revisar en este cambio): el commit ac80cf8 deja `Siguiente:` separado de las líneas de atribución por una línea en blanco (no se reescribe historia subida); el grosor de los iconos propios se acerca al de lucide a ojo (lado / 28), sin medida que lo compruebe.

- **Leves de la revisión de las imágenes nuevas (17, 23)** (2026-11-11, no se vuelven a revisar en este cambio): los avatares del equipo en la ficha de proyecto (`.avatar` de `Proyecto.tsx`) no usan `Retrato` (sin marco y la lógica foto/iniciales repetida); `inset: 6%` y el chaflán 90/10 % del retrato dependen del margen de `marco-retrato.webp` sin nada que los ate; la celda «En `main`» ya no nombra e02460c (está en «Hecho»).

- **Leves de la revisión del barco a la 19** (2026-11-11, no se vuelven a revisar en este cambio): `portada-desarrollo.webp` se borra aunque estuvo publicada unas horas (solo era fondo de cabecera, no una ruta); sin capturas antes/después del cambio de cabecera de IG y workflow (vuelven a la cabecera de color que ya tenían antes de la PR #2).

- **Leves de la revisión de las imágenes del generador** (2026-11-11, no se vuelven a revisar en este cambio): `cabecera-equipo.webp` no tiene `-mini` con `srcset` para el móvil; el celeste con isobatas de las tarjetas próximas repite reglas de `.proyecto-isobatas`; las ilustraciones sobre papel (10, 18) no tienen versión oscura.

- **Leves de la revisión de las vistas previas por idioma** (2026-11-11, no se vuelven a revisar en este cambio): nada ata la og-fuente en castellano a su `og-base.png` ni a las traducidas (si cambia la de castellano, gl/en quedan viejas sin error); `traducir.mjs` copia por cuarta vez la carga de Playwright (ya apuntado: un `tools/qa/playwright.cjs` común); las páginas de paso (`DE_PASO`) escriben su tarjeta a mano en vez de partir de `index.html` y no llevan `og:locale:alternate`; `ALT_PORTAL.es` repite el alt de `index.html` y `tools/og/portal.html` los textos del hero de `textos.ts`, sin test que los ate; los `<slug>-og.html` leen `URLSearchParams` dos veces y tienen un texto `es` que nunca se pinta; `vistaDe` lee y calcula el hash del mismo `og.jpg` una vez por idioma (memorizar `imagenDe`); el commit 4550358 no acaba en `Siguiente:` (no se reescribe historia subida).

- **Leves de la revisión de novedades y productos al perfil** (2026-11-10, no se vuelven a revisar en este cambio):
  `rutas.test.ts` da por buena `productos` porque `DE_PASO` cae en el tramo de `FIJAS` que lee la regex (comprobar
  `DE_PASO` aparte); el módulo `virtual:proyectos-novedades` exige `novedades` y la página estática no (`?? []`);
  el `ResizeObserver` del índice de la ficha recalcula en cada imagen que carga (va por fotograma); el JSDoc de
  `MenuProyectos` quedó encima de `MOVIL`, y su `matchMedia` repite el `useMovil` de `Miembro.tsx` y el corte del CSS
  (sacar un hook); `TarjetaProducto` conserva `compacta` y `titulo='h2'` sin uso; `TITULO_PRODUCTOS` y `nombre(slug)`
  repetidos en `paginas-estaticas.mjs`; `cuenta(slug)` de `Novedades.tsx` se recalcula en cada render; la cabecera
  usa `sec.novedades` en vez de una clave `nav.*`; `tools/qa/medir-paginas.cjs` sigue midiendo `productos` (ahora de
  paso) y `.rejilla-productos`. Muro sale de la cabecera (Novedades lo incluye; sigue en el pie): confirmado por la
  persona (2026-11-10).

- **Repaso de toda la web** (2026-11-11), sin arreglar: (a) el antetítulo «Marca de software: taller y Productos», la descripción de la portada (`index.html`, `FIJAS['']`) y el README siguen nombrando Productos como mitad de la marca, aunque ya no hay sección; decide la persona; (b) `npm run medir` da 23 px de alto al enlace del título de las tarjetas de proyecto en el inicio, pero su `::after` hace clicable la tarjeta entera: falso positivo de la medida, a enseñarle a ignorarlo; (c) `npm run seo` da error y avisos en `/productos` (sin descripción, h1 ni Open Graph): es la página de paso `noindex` a `/equipo`, a propósito; los títulos iguales en es y gl («Equipo», «Aviso legal») también.
- **Leves de la revisión de las animaciones** (2026-11-09, no se vuelven a revisar en este cambio; R2 de su retro, aprobada: sacar `reducido()` a un util en la próxima tarea de código): `reducido()` está repetido en `AnimacionFlujo.tsx`, `Galeria.tsx:51` e `Inicio.tsx:76` (sacarlo a un util); el test «cada rótulo cabe» no mira solapes con otros átomos (el medidor dentro de «sesión A») ni el alto; los commits de la rama dejan `Siguiente:` en un párrafo aparte de las líneas de atribución (desde ahora, en el mismo bloque, sin línea en blanco).
- **Identidad visual propia** (la persona, 2026-11-08): **hecha y en `main`** (2026-11-08). Dirección «cuaderno de taller + carta náutica atlántica», tema claro por defecto, tipografía B; las reglas y tokens, en `docs/marca.md`; lo decidido y lo aplicado, en `docs/records/retro-2026-11-08-identidad-visual.md` y en `git log` (la versión larga de este párrafo, en el historial de `docs/handoff.md` hasta 94d5a90). **Queda:** las imágenes de la lista de recursos de `docs/marca.md` (isobatas reales, recurso 2; `og:image` del portal, recurso 3), que se generan con Galivelop IG.
- **Decisiones de la auditoría del 2026-11-09**, lo que queda (la persona, 2026-11-09): (4) **no** se quitan `fases`/`siguiente` de `proximamente.json` (decidido, 2026-11-09); (5) **verificado** contra los repos (2026-11-09): Galivelop IG pasa a 0.4.1 (etiqueta `v0.4.1`, CHANGELOG 2026-11-06; botón, enlace y texto de estado) y el workflow a **1914** pruebas (regla CIFRA DE PRUEBAS sobre `v0.5.1`); Tarkor se deja con sus tres hitos en `curso` (su bitácora `docs/records/traspaso.md`: 0.1 y 0.2 abiertos solo por lo que espera a Álvaro, 0.3 con fases D-E a medias aunque no es el frente actual); **toVeriAI verificado** (2026-11-10, con el repo en la sesión): son 5 proveedores en rotación y la lista de la ficha tiene esos 5; no había lista de 6. Queda para la persona: el hito 1.12 se llama en la ficha «Capturas estables y VeriAI» y en el roadmap «Datos de entrenamiento»; (6) y (8) **aprobados** por la persona («Apruebo todo, sobre la 8 hay que seguir lo que dice la marca», 2026-11-09). (6) **hecho**: `src/components/Enlace.tsx` con un `Link` que añade la barra final y un test que impide importar `Link`/`NavLink` de react-router-dom (e68a9c0). (8) **hecho**: carga por ruta (ver «JS inicial recortado» en «Para la próxima publicación»; leve: si falla la red al pedir una ficha se ve «no encontrado» en vez de un error); formas según la regla 3 (foto de miembro cuadrada con chaflán, icono de próximamente, puntos de la barra de ventana y de etapas rectos; solo `.estado-punto` sigue circular) y rejillas «A fondo»/características de 12 subcolumnas sin celdas huérfanas (ff04f12); el bloque Equipo ya usaba las fotos. Leve: el filete celeste de la foto de miembro no sigue la diagonal del chaflán. El 404 en gallego e inglés no se ha mirado en captura.
- **Avisos de `npm run medir` que ya estaban en `main`** (2026-11-09, vistos al probar las columnas de R1; comprobado con un build de `origin/main`): en la portada en móvil, los enlaces del nombre de la tarjeta de proyecto (`a.tarjeta-enlace`) miden 23 px de alto, uno menos que el mínimo de 24; y en gallego a 320 px el antetítulo «Marca de software: obradoiro e Produtos» se corta (309>288 px).
- **Leves de la fase 1 de la carga por partes** (2026-11-09, `/code-review high origin/main --max-findings all`, 15 hallazgos; arreglados 11 en 7100926: ErrorBoundary y recarga única en `vite:preloadError` (clave `galivelop.recarga`, añadida a la política de privacidad en los tres idiomas), mosaico móvil a dos columnas otra vez, página y ficha esperadas antes del primer render (sin fogonazo en blanco, `src/paginas.ts`), ficha en caché síncrona, «error» distinto de «no existe» con reintentar, test nombre de archivo = `slug`, `ResumenProyecto` derivado de `CAMPOS_RESUMEN`, plugin con errores que nombran el archivo y recarga en dev, `conBarraFinal` sin barra en archivos, test de imports de `react-router`, prettier sobre `tools/vite`; no se vuelven a revisar en este cambio): el `MutationObserver` de `Desplazamiento` vigila `body` hasta 8 s y puede saltar a un ancla que aparece por una acción posterior; el filete celeste de `.miembro-foto` no sigue la diagonal del chaflán.
- **Leves de la fase 1 de la segunda tanda de la auditoría** (2026-11-09, no se vuelven a revisar en este cambio): `tools/generar-marca.mjs` vuelve a cargar Playwright a su manera (ya apuntado: un `tools/qa/playwright.cjs` común) y renderiza `tools/og/portal.html` por su cuenta: si se cambia la portada y solo se corre `node tools/og/portal.mjs`, `galivelop-social.png` queda vieja (que `portal.mjs` escriba las dos); `galivelop-social.png` solo la usa el README pero sigue en `public/` (150 KB en cada despliegue): moverla exige tocar el README y una URL ya publicada.
- **Leve de la fase 1 de la auditoría** (2026-11-09, no se vuelve a revisar en este cambio): la cifra huérfana que ocupa la fila en móvil lleva la misma sombra de 1 px a la derecha que las demás celdas; el `overflow: hidden` de `.cifras` la recorta, pero conviene mirarlo en una captura móvil del tema oscuro de toVeriAI al publicar.
- **Leves de la revisión de la identidad visual** (2026-11-08, no se vuelven a revisar en este cambio): ~~el token `--brillo`~~ renombrado a `--tinte` el 2026-11-09; `.proxima-icono` queda circular (marcado como permitido), la insignia más dudosa de la regla 3; el trío `font: var(--datos); letter-spacing; text-transform` se repite en una veintena de reglas de `global.css` (agruparlas o volver a una utilidad cuando se toque); `FONDO_PILDORA.claro` de `IconoTecnologia.tsx` es una constante a mano y el icono de Vue queda a 2,01:1 del umbral 2:1 (calcularla desde los tokens). De la fase 3 (2026-11-08): `capturas.cjs`, `medir-paginas.cjs` y `diagramas-webp.mjs` cargan Playwright de tres maneras distintas (un `tools/qa/playwright.cjs` común); el modo `--hoja` de `capturas.cjs` comparte el análisis de argumentos del modo normal; `Tema.test.ts` solo entiende `--superficie` como literal hexadecimal.
- **Leves y propuestas al flujo anteriores al 2026-11-08** (27 puntos, no se vuelven a revisar): en [`docs/records/handoff-archive.md`](records/handoff-archive.md#2026-11-14).
- **Contraste de avances** (2026-11-10, `gw-portal` modo informe, solo lectura): **Tarkor** tiene 96 commits en `main` desde su última novedad (2026-11-05): generador de mapas propio por capas (MAP-1…19), 25 zonas a canon y viajes con horas y jornadas (PR #88-#90, hasta el 10-11); la línea de «Hecho» del 2026-11-10 que lo daba «sin cambios» era errónea. Novedad del 2026-11-10 aprobada y publicada el 2026-11-11. Hitos y fase de Tarkor, vigentes. Dudosos, sin cambiar: tests de Galivelop IG (ficha 1280, recuento propio 1291; el repo no da cifra) y de Tarkor («+4.700»; recuento estático ≈4.830). Workflow, Galivelop IG, voice y developer, al día. **toVeriAI no se ha podido contrastar** esta vez (su repo privado no se pudo añadir a la sesión).
- **Leve de las vistas previas por idioma** (2026-11-10): `presentacion.webp` (el collage de la portada) sigue con el texto en castellano en las tres lenguas; `tools/generar-marca.mjs` sigue sacando `galivelop-social.png` (README) solo en castellano.
- **toVeriAI: la frase de los modelos que leen imágenes** (la persona, 2026-11-04): fuera hasta que Raquel confirme que está en producción.
- **Diagramas y animación del workflow** (la persona, 2026-11-04, tras el paso a `main`): el relevo entre sesiones (también animado: SVG con reposo para `prefers-reduced-motion`, que es código), las tres fases antes de `main`, la curva de gasto y el selector. Prototipo de variantes primero; guion y animación con el modelo grande, dibujo con el barato. **Diseño hecho** (2026-11-04): dos animaciones paso a paso (relevo y camino a `main`), galería de 7 a 3 imágenes; espera la decisión de la persona. **Storyboard con la marca** (2026-11-09, pedido por la persona): republicado en https://claude.ai/artifact/SEz8PBgLLi8g2YaUF459Km con tokens, fuentes y formas de `docs/marca.md`, steppers reales (pestañas, Reproducir una vez, reposo al final), composición móvil propia y las recomendaciones de las 10 preguntas aplicadas. Respuestas de la persona (2026-11-09): figura en celeste hondo, sí; `--ok-texto` se oficializa; fase 2 «opcional en cambios pequeños» y curva sin cifras, sí; el fallo sin rojo no se leía, así que se usa un token nuevo `--peligro` (magenta de los peligros de las cartas náuticas: claro `#a3135f`, oscuro `#f27ab0`, ≥6,5:1); `--peligro` y `--ok-texto` van a la tabla de `docs/marca.md` al implementarlo. Versión 3, tras ver cortes en el móvil: margen interior en móvil, ninguna línea cruza texto, commits de git rotulados, la animación 1 partida en «Trabajar» (4 pasos) y «Relevo» (4), tres pestañas (**aprobado por la persona** el 2026-11-09: «Me convence… lo aplicas», con pestañas). Comprobado con Pixel 5, iPhone SE y 320 px y la viewport de móvil real.
- **La persona: `CLAUDE_CODE_AUTO_COMPACT_WINDOW=200000` en las variables del entorno de la nube** (T1 de la retro del 2026-10-31): hoy no estaba y el contexto medio fue de 225k.
- **Ideas de `elayadesign/ai-design-skills` y `redesign-skill`** (aprobadas el 2026-10-30; aplicadas el mismo día en
  la rama `ccr-83ea043c-r1gbyp`): hechas las palabras de relleno (`src/i18n/relleno.test.ts`), `text-wrap`, respuesta
  al pulsar, `--curva` a 200 ms, escala `--z-*`, radios anidados y mensajes del sistema en `REVIEW.md` y
  `designReferences`. **Quedan:** (a) ~~aviso legal o privacidad en el pie~~ hecho el 2026-10-31 (ver «Hecho»); queda la consulta
  de la LSSI-CE de más abajo (fase 5 de la ADR 0002); (b) la FAQ con JSON-LD **no se hace**: Google retiró ese
  resultado enriquecido (ver `docs/investigacion/seo-indexacion-previews.md`); (c) prototipo de la frase que se
  ilumina al hacer scroll, si la persona lo quiere; (d) mirar caso por caso los 7 `uppercase` y que los botones de
  Productos y Próximamente queden alineados abajo con textos largos en gl y en.
- **SEO, a mano (la persona)** (2026-10-30, `docs/investigacion/seo-indexacion-previews.md`): en Search Console, enviar
  `sitemap.xml` e inspeccionar la portada y las fichas nuevas tras cada publicación importante; dar de alta el sitio
  en Bing Webmaster Tools importándolo desde Search Console; tras cambiar una tarjeta, refrescarla en el Sharing
  Debugger de Facebook, el Post Inspector de LinkedIn y `@WebpageBot` de Telegram. **Decisiones suyas:** dominio
  propio (cambia todas las URL: cuanto antes, mejor), política de rastreadores de IA en `robots.txt`, y página y feed
  por pieza del muro cuando haya publicaciones.
- **Abrir la sesión desde la carpeta del repo y en un entorno solo con el portal** (P1 de la retro de SEO, 2026-10-30, aprobada): la del 2026-10-30 se abrió en `/home/user` con cuatro repos, sin `.claude/settings.json` (sin tope de compactación: contexto medio de 194k y techo de 340k). Lo hace la persona al crear la sesión.
- **Próxima sesión nueva: sin `add_repo` en la principal** (T1 de la retro de Productos, 2026-10-27): los repos hermanos en `/home/user` suben el suelo unos 15k y el arranque de cada subagente de 35k a 75k; otro repo se lee con un subagente que lo clona en el scratchpad.
- **Productos, tras `main`** (2026-10-27): los dos `servicios` de Álvaro en `equipo.json` (soporte del flujo y desarrollo full stack) son **texto provisional** de la sesión, por confirmar con él; el gallego de los textos nuevos, a revisar por un hablante; fases 3 (ficha `/productos/<slug>`), 4 (apartado «Servicios» en la página de miembro) y 5 (aviso legal) de la ADR 0002 siguen sin hacer.
- **Por pedir a la persona en otro momento: logos de la trayectoria y la formación de Raquel** (2026-10-26; la persona lo deja así por ahora, no se le vuelve a pedir en esta tarea): faltan Seidor, IES Fernando Wirtz (formación), Tokio School y la UDC, que salen con su inicial. No están en el repo de toVeriAI (solo tiene los suyos) y sus webs no se pueden bajar desde la nube: la política de red del entorno las bloquea (403 en seidor.com, tokioschool.com, udc.es, edu.xunta.gal, commons.wikimedia.org) y argaquest.fernandowirtz.com no resuelve. Que la persona mande las imágenes o abra esos dominios en la red del entorno; van a `public/equipo/empresas/<nombre>.webp` (88×88) y al campo `logo` de cada entrada.
- **Por pedir a la persona en otro momento: datos de Álvaro y siguiente versión de la página de miembro** (la persona lo deja para después, 2026-10-26; se le recuerda junto con los logos de Raquel): la `descripcion` de cada puesto de Álvaro (Orienteed, Plexus Tech, Servicio Móvil y Grupo ALUMAN: qué hizo y en qué puesto; la persona la da en castellano y la sesión hace gl y en) y los logos de las empresas en `public/equipo/empresas/` (la red del contenedor no llega a sus webs: los pasa la persona). Opcional: apartados «Qué hago» y «Cómo trabajo», al estilo de eberna.tech, con textos de la persona.

- **Encargos por miembro, aviso legal** (2026-10-26, la persona): comprobar con fuentes primarias si la LSSI-CE
  pide algo a una web que dice que un miembro colabora por su cuenta (Galivelop no cobra ni intermedia). No se ha
  investigado; no bloquea la publicación, pero queda abierto. El gallego de los textos nuevos, a revisar por un
  hablante.
- **Vista previa en redes, comprobar a mano** (de 2026-10-22; la persona, en Discord): un mensaje nuevo con el enlace
  del portal muestra el diagrama nuevo de Galivelop-workflow (el ya enviado no se actualiza). Se perdió de la vista al
  recortar «Hecho» en la revisión semanal del 2026-10-25.
- **«Próximamente», leves de la revisión** (2026-10-25): (a) la fila se oculta con un filtro de línea activo (los filtros
  solo salen con 5 fichas o más); (b) la barra de avance está repetida en `TarjetaProyecto`, `Proyecto.tsx` y
  `TarjetaProxima`: pasarla a un componente `<Barra>`.
- **Carpeta nueva de difusión** (2026-10-25): `gw-media-content` del flujo 0.4.0 guarda las piezas en
  `docs/difusion/AAAA-MM-DD/NN-tema/` (imágenes en `medios/`) en vez de `docs/difusion/AAAA-MM-DD-tema/`. **El portal no
  necesita cambios:** el `git grep … -- 'docs/difusion/**/web.md'` del paso 2b encuentra las dos formas (probado en un
  repo de prueba); la `pieza` sale `2026-10-25-01-mapa-del-mundo`, que acepta `src/data/muro.test.ts` (ya ordena
  `NN` del mismo día); `archivo` relativo a la pieza (`medios/…`) con su `-mini` al lado, como genera `render.mjs`
  (también `<nombre>.en-mini.webp`). Las piezas planas siguen igual. Pendiente **fuera del portal**: que
  Galivelop-workflow cree `web.md` con el bloque JSON (en curso; en la rama `ccr-6dfbc880-ddr41g` la plantilla aún no
  lo trae). El paso 2b ya está en el prompt de «Proyectos semanal» (lo usó la ejecución del 2026-10-25). Con el flujo cerrado, comprobar aquí que una pieza nueva llega al muro.

- **Repos nuevos como proyectos** (2026-10-25, a petición de la persona): evaluados `Zeldris/galivelop-image-generator`
  (18 commits; plan F0-F5 con D1-D27 y F0 «esqueleto» hecha: esquemas, textos es/en y tests; aún no genera imágenes;
  servicio local con stable-diffusion.cpp, Steam Deck de referencia, piloto con WMF), `Zeldris/galivelop-developer`
  y `Zeldris/galivelop-voice-generator` (solo el flujo instalado, README vacío). Recomendación dada: ficha de
  image-generator al llegar a F2 (genera de verdad) y las otras dos cuando tengan código propio. La persona avisará
  (está trabajando en ellos) y decide entonces; una ficha nueva lleva código, revisión y su bloque en
  `docs/runbooks/tarea-semanal.md`. Fuera, por decisión de la persona: `Zeldris/Zeldris` (README de perfil) y
  `raquelccarreraA/Labs-Log-Detective`.
  **Revisión de las 20:05 del 2026-10-25** (antes de la tarea semanal): image-generator con **F1 (núcleo) en `main`**:
  proyectos, pedidos, cola, entrega y CLI `python3 -m gimg`, pero solo con motor de prueba (`FakeEngine`), sin generar
  imágenes todavía (F2); developer con **F0 cerrada en `main`** (CLI `gdev` con subcomandos vacíos, esquemas, plan
  D1-D23); voice-generator con **diseño (D1-D17, F0-F7) y F0 esqueleto en `main`**. Ninguno tiene aún algo que un
  visitante pueda ver o probar, y ninguno tiene la skill de contenido para redes: **hoy no se añade ninguna ficha**. Se
  mantiene la recomendación (image-generator al cerrar F2; developer y voice-generator con su primera función real).






- «About» del repo en GitHub (descripción, web y topics): lo pone el usuario (el proxy no deja cambiar ajustes del
  repo; pendiente desde el SEO del 2026-10-14).
1. Equipo: redes sociales que se vayan pasando (en `src/data/equipo.json`).
2. Cuando el instalador de Tarkor sea público: añadirlo en `enlaces` de `tarkor.json` y pasar
   el estado si procede.

## Comprobar el estado

```bash
npm ci && npm run check && npm run build
```
