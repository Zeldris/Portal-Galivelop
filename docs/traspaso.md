# Bitácora de traspaso

Se actualiza en cada commit. Reglas en [`CLAUDE.md`](../CLAUDE.md).

## Estado actual

| | |
|---|---|
| **Actualizado** | 2026-10-27 |
| **Rama de trabajo** | `claude/galivelop-dev-portal-1h89ci` (la que publica la tarea semanal); esta sesión, `ccr-47f8fddd-o5ek6p` |
| **Tarea en curso** | Ninguna: la segunda pasada de front está publicada en `main` (2026-10-27) |
| **Siguiente paso** | Cuando la persona quiera, los datos por pedir de los perfiles (logos de Raquel, descripciones y logos de Álvaro: ver «Pendiente») |
| **En `main`** | Todo publicado: segunda pasada de front (hojas de apartado cortadas en el móvil y `npm run medir` con menú, hojas y ampliaciones abiertas, 2026-10-27, confirmación de la persona); ronda de pruebas de front en móvil y `npm run medir` a 390/360/320 px con `cortes` y `tactiles` (2026-10-27, confirmación de la persona); caja «¿Tienes un proyecto?» (`colabora`) de Raquel y frase quitada de «Colabora» de Álvaro (2026-10-26, confirmación de la persona); porfolio de Raquel y logo de ArgaQuest (2026-10-26, con la confirmación del perfil); nombre completo, grado, web y logo de toVeriAI de Raquel (2026-10-26); perfil de Raquel y GitHub, Manfred, Reddit y correo en «Dónde encontrar a…» (2026-10-26, confirmación de la persona); nota del cierre «¿Tienes un proyecto?» de la página de miembro (2026-10-26, confirmación de la persona); revisión especial de los repos (fichas de Galivelop-workflow y Tarkor, 2026-10-25, confirmación de la persona); «Próximamente» en el inicio (2026-10-25, confirmación de la persona); muro (`/muro`, oculto hasta la primera publicación) (2026-10-25, confirmación de la persona); rediseño de la ficha («De un vistazo», barra de grupos, apartados en hoja) y del inicio, `npm run medir`, `leerAncla()` y plurales en plantilla (2026-10-25, confirmación de la persona). https://zeldris.github.io/Portal-Galivelop/ |
| **Tests** | `npm run check`: tsc 0 errores, vitest 60/60 y `tools/qa/tests/test-ganchos.sh` (ganchos y scripts del flujo, `.claude/gw.json` y 11 casos de la regla de `main`, 3 de ellos de la tarea semanal, más la clasificación código/contenido, el `pre-commit`, `content` fijado y nada del flujo en el `.gitignore`; pide bash, git y python3). `npm run build` correcto (27 páginas estáticas, con las de cada miembro en es/gl/en) |

### Para la próxima publicación

La web se publica los domingos a las 20:45 (hora de Madrid) con la tarea programada «Proyectos semanal» (ver `AGENTS.md`).
Aquí se apunta lo que está en la rama de trabajo y aún no en `main`.

- Ficha de Galivelop-workflow al día con la 0.4.1 en lo que la revisión semanal no tocó (rama `ccr-47f8fddd-o5ek6p`, fusionada en la de trabajo): diagramas «arquitectura» (0.4.1, 24 skills, gancho `commit-msg`, 1043 tests) y «versiones» (1043 tests) con sus webp; cifra de pruebas 461 → 1043; `commit-msg` en «Qué se impone y qué se aconseja» y en «Ganchos y scripts propios»; la novedad del 26-10 dice «la serie 0.4 es la última antes de la 1.0» (la 0.4.2 está en `main` del flujo sin etiqueta). Solo contenido.

## Hecho

- ✅ 2026-10-27 · Comprobación de la revisión semanal (petición de la persona): versión, skills, hito y novedades bien; desfasados los diagramas «arquitectura» y «versiones», la cifra de pruebas y el gancho `commit-msg` en dos apartados. Arreglado (ver «Para la próxima publicación»). Causa: el bloque del flujo en `docs/runbooks/tarea-semanal.md` solo pedía versión y novedad. El bloque ahora recalcula la cifra de pruebas en la etiqueta, recoge ganchos nuevos y vigila versión y tests de los diagramas (con la orden que regenera sus webp); **la persona tiene que pegarlo en la conversación de «Proyectos semanal»**.
- ✅ 2026-10-27 · Revisión semanal (tarea «Proyectos semanal»), publicada en `main`: Galivelop-workflow a la 0.4.1 (fase, descripción, hito 7, once skills propias y trece de Matt Pocock con sus fichas de `gw-media-content`, `gw-media-content-now` y `wait-what`, novedad del 26-10) y sin el número repetido en los títulos de «Cómo funciona» (pendiente de la ronda de móvil); Tarkor, dos novedades del 26-10 (conversaciones; caza y progreso). toVeriAI, muro y Próximamente sin cambios. Solo contenido.
- ✅ 2026-10-27 · `claude/galivelop-dev-portal-1h89ci` igualada con `main` (avance rápido de 959e26f a d4c1ce6, 27 commits, ninguno propio por detrás; petición de la persona, «Hazlo»). El bloque de `docs/runbooks/tarea-semanal.md` ya está pegado en «Proyectos semanal» (lo hizo la persona).
- ✅ 2026-10-27 · **Publicado en `main`** (3b3d804 y esta entrada) con confirmación de la persona («Si»): la segunda pasada de front, con la fase 1 (`/code-review` y sus arreglos medios), sin fase 2 (cambio pequeño, `requireRetro: false`) y la marca de 6f2fdf4. CI «Comprobar» en verde en 3b3d804 y `pre-push` en verde.
- ✅ 2026-10-27 · Segunda pasada de front, paso 1 (petición de la persona, con captura): en el móvil las hojas de apartado salían cortadas por la derecha (texto, pestañas y diagrama). Causa: la rejilla de `.hoja-caja` no tenía columnas y la implícita crecía hasta el título en una línea (`nowrap`), más ancho que la pantalla; arreglo, `grid-template-columns: minmax(0, 1fr)`. Pasaba en 8 de las 9 hojas de Galivelop-workflow, 3 de Tarkor y 1 de toVeriAI. También: la etiqueta de valor larga de una tarjeta («orchestrate-dealer») se salía a 320 px; la cabecera de la tarjeta baja ya la etiqueta a su línea. `npm run medir` abre en el móvil el menú, el submenú y cada hoja y los mide como la página (sin animaciones y con el ratón apartado, que el `:hover` daba cortes falsos); rojo comprobado sin el arreglo (marca `div.hoja-caja 408>390`). Las tiras de miniaturas se desplazan (`overflow-x: auto`), no cortan. `npm run check` 60/60, build con 27 páginas y `npm run medir` sin avisos (1 min 30 s).
- ✅ 2026-10-27 · **Publicado en `main`** (9f6c5af) con confirmación de la persona («Si llevalo»): la ronda de pruebas de front en móvil, con sus tres fases (revisión, `/opt-tokens` y `/retro` aprobadas, revisión de la fase 3 y marca de 11b1803). CI «Comprobar» en verde en la rama y `pre-push` en verde.
- ✅ 2026-10-27 · Fase 3 de la ronda de móvil: `/code-review --max-findings all` del commit de la fase 2 (12 hallazgos). Arreglados: `npm run medir` mide cada ruta también en gl y en (100 medidas, 57 s); avisa de un `::after` que agranda la zona táctil sobre un control sin `position` (sería una capa sobre la cabecera; rojo comprobado quitando `.idiomas button` de la lista) y solo suma ese `::after` si recibe toques; el nombre de un botón de solo icono usa su `aria-label`; el móvil se reconoce por el nombre de la ventana; el comentario de `global.css` dice que el script solo avisa por debajo de 24 px. Leves, a «Pendiente». `npm run check` 60/60, build con 27 páginas y `npm run medir` sin avisos.
- ✅ 2026-10-27 · Fase 2 de la ronda de móvil (`/opt-tokens` y `/retro`, presentadas a la persona y aprobadas enteras; `docs/registros/retro-2026-10-27-movil.md`). P1: `npm run medir` mide el móvil a 390, 360 y 320 px y da `cortes` (texto que se sale de su caja) y `tactiles` (controles por debajo de 24×24 px); encontró y se arreglaron en `global.css` los botones de idioma de 28 px (ahora con la zona táctil de los enlaces sueltos) y el mosaico que cortaba «configuración» a 360 px (una columna por debajo de 380 px, `23.6875em`); rojo comprobado sin cada arreglo. P2: notas de capturas y git corto en `.claude/gw/opt-tokens.md`. G1 (aviso al lanzar un subagente sin `model`), al flujo en la retro. `npm run check` 60/60, build con 27 páginas y `npm run medir` sin avisos.
- ✅ 2026-10-26 · Fase 1 de la ronda de móvil (`/code-review --max-findings all` contra `origin/main`, 9 hallazgos). Arreglados: el degradado de la barra de grupos quedaba 12 px por dentro del borde en el móvil (el relleno de la barra pasa a margen de las pestañas de los extremos); `NavFicha` mide una vez por fotograma y solo escribe `data-mas` si cambia; en la hoja de ruta el estado (`nowrap`) arrastraba la última palabra del título a otra línea (espacio antes del estado); el corte del mosaico, a `22.4375em` (por debajo de 360 px, medido: a 360 no se parte ninguna palabra con dos columnas, a 320 sí); la letra pequeña del logo, solo en la cabecera (no en el pie); la versión en línea, solo en `.hito-titulo` (no en «De un vistazo»); fuera el `margin: 0` repetido de `.tarjeta-proxima h4`, y comprobadas con captura las tarjetas de decisiones y características sin el margen del navegador. Leve, a «Pendiente»: la lista de selectores de la zona táctil. `npm run check` 60/60 y build con 27 páginas.
- ✅ 2026-10-26 · Ronda de pruebas de front, sobre todo en móvil (petición de la persona; sin revisar ni publicar). Barrido con Playwright de las 11 rutas a 320, 360, 390, 414, 430 y 1280 px (desbordes, zonas táctiles, letra diminuta, recortes, errores de consola), en claro y oscuro, con capturas antes/después. Arreglos en `src/estilos/global.css`, `src/pages/Inicio.tsx` y `src/pages/Proyecto.tsx`: la cabecera ya cabe hasta 430 px (antes se apretaba de 381 a 430); el estado de las tarjetas con imagen del inicio baja a la esquina inferior y no tapa el título de la captura; `h4` sin margen del navegador (los títulos de «Cómo funciona» y las características quedaban más bajos que su número o icono); en la hoja de ruta la versión va en línea con el título (antes quedaba sola en su línea); la línea de contacto del inicio sin los puntos sueltos al final de línea en el móvil; «Próximamente» y el negocio del perfil, de 0,72 a 0,75 rem; cifras y mosaico parten palabras largas (a 320 px se cortaban) y el mosaico pasa a una columna por debajo de 360 px; los enlaces de texto sueltos («Volver», «Siguiente», «Ver más», pliegues del miembro, pie y contacto) tienen ~44 px de zona táctil sin mover el diseño; la barra de grupos de la ficha marca con un degradado el lado con pestañas ocultas (`data-mas`, lo pone `NavFicha`). `npm run check` 60/60 y build con 27 páginas.
- ✅ 2026-10-26 · Página de Raquel: caja «¿Tienes un proyecto?» (`colabora`, ADR 0001), como la de Álvaro: desarrollo full stack con Java, Spring Boot y React, y «Escribir a Raquel» a raquel.ccarrera@gmail.com (es/gl/en). Texto aceptado por la persona. Solo contenido. Publicado en `main` con confirmación de la persona.

## Pendiente

- **Leves de la revisión de la segunda pasada de front** (2026-10-27, no se vuelven a revisar en este cambio): `npm run medir` hace clic con ratón y no emula un teléfono (`isMobile`/`hasTouch`), así que `(pointer: coarse)` no se cumple y los `:hover` se apartan moviendo el ratón a (0,0) antes de cada medida de capa; en cada hoja solo amplía la primera imagen de tarjeta (un pie largo en otra no se mediría).
- **Leves de la revisión de `npm run medir`** (fase 3 de la ronda de móvil, 2026-10-27, no se vuelven a revisar en este cambio): se salta todo control dentro de un `<p>` (WCAG solo exime los que van en una frase) y no los de un `<li>` o `<dd>`; no aplica la excepción de espacio de WCAG 2.5.8 (un icono aislado de 20 px fallaría); `visible()` no mira la opacidad de los padres y trata `pointer-events: none` como invisible también en `cortes`; un campo dentro de `label` suma el `::after` del campo al tamaño de la etiqueta; una caja que recorta a propósito (`overflow: hidden` con algo que sale del borde) saldría en `cortes`; el texto agrandado no se mide (de 380 a 389 px se midió a mano una vez, sin cortes en los tres idiomas).
- **Leves de la ronda de móvil** (2026-10-26): en escritorio, `hero-collage` y `proyecto-cabecera-contenido` desbordan 4-5 px su caja (no se ve; ya estaba antes); la zona táctil ampliada es un `::after` invisible, así que las medidas con `getBoundingClientRect` siguen dando 23 px; la lista de selectores con esa zona táctil está escrita a mano en `global.css` (un enlace de texto suelto nuevo no la recibe: mejor una clase o un test).
- **Por pedir a la persona en otro momento: logos de la trayectoria y la formación de Raquel** (2026-10-26; la persona lo deja así por ahora, no se le vuelve a pedir en esta tarea): faltan Seidor, IES Fernando Wirtz (formación), Tokio School y la UDC, que salen con su inicial. No están en el repo de toVeriAI (solo tiene los suyos) y sus webs no se pueden bajar desde la nube: la política de red del entorno las bloquea (403 en seidor.com, tokioschool.com, udc.es, edu.xunta.gal, commons.wikimedia.org) y argaquest.fernandowirtz.com no resuelve. Que la persona mande las imágenes o abra esos dominios en la red del entorno; van a `public/equipo/empresas/<nombre>.webp` (88×88) y al campo `logo` de cada entrada.
- **Leves de la revisión del porfolio de Raquel** (2026-10-26, no se vuelven a revisar en este cambio): «Porfolio» y «Web» (toveriai.com) juntos pueden no distinguirse (la persona decide dejarlo así, 2026-10-26), y toveriai.com entra en el `sameAs` de la persona en `scripts/paginas-estaticas.mjs` (es la web de un proyecto, no de ella); la cadena de `if` de `IconoRed` crece con cada red con icono de lucide (`web`, `correo`, `manfred`, `portfolio`): una tabla como `MARCAS` lo haría dato.
- **Leves de la revisión del perfil de Raquel y las redes** (2026-10-26, no se vuelven a revisar en este cambio): en `IconoRed.tsx`, cada red sin logo en `MARCAS` es un `if` más (`manfred`) y una red nueva sin icono cae en `Link2` sin aviso (una tabla `Record<Red, …>` completa lo haría obligatorio); `MARCAS` mezcla trazados copiados a mano con `siReddit.path`, y GitHub sale con dos logos distintos (el de la píldora de tecnología y el de la red): tomar de `simple-icons` todas las que tiene; `IconoRed.tsx` importa ahora del paquete entero de `simple-icons` (en producción Vite lo recorta; ver el leve de `IconoTecnologia.tsx`); monogramas repetidos («M» de Mockito, Magento y Microsoft 365; «D»…), que no distinguen la tecnología (el nombre va al lado).
- **Leves de la revisión de la nota de «¿Tienes un proyecto?»** (2026-10-26, no se vuelven a revisar en este cambio): ya no se dice junto al botón que el trato es con el miembro y no con Galivelop (queda «por su cuenta» en el texto del miembro; ADR 0001); la nota abre hablando del taller en un bloque que es del miembro; repite la llamada de `colabora.texto` («cuéntaselo» / «get in touch») y el botón; con texto de invitación, la clase `miembro-colabora-nota` (letra pequeña y tenue) ya no encaja; si un segundo miembro pone `colabora`, la invitación queda repartida entre `equipo.json` y `textos.ts`; «proyecto real» puede echar atrás a quien solo tiene una idea.
- **Por pedir a la persona en otro momento: datos de Álvaro y siguiente versión de la página de miembro** (la persona lo deja para después, 2026-10-26; se le recuerda junto con los logos de Raquel): la `descripcion` de cada puesto de Álvaro (Orienteed, Plexus Tech, Servicio Móvil y Grupo ALUMAN: qué hizo y en qué puesto; la persona la da en castellano y la sesión hace gl y en) y los logos de las empresas en `public/equipo/empresas/` (la red del contenedor no llega a sus webs: los pasa la persona). Opcional: apartados «Qué hago» y «Cómo trabajo», al estilo de eberna.tech, con textos de la persona.
- **Leves de la revisión de la página de miembro** (`d35d0f1..17ebf95`, no se vuelven a revisar en este PR): `anosTrabajados` no cuenta el mes de `hasta` (una etapa aislada de junio a septiembre suma 3 meses; dejar escrita la convención o sumar uno); las claves compuestas de React en `Miembro.tsx` sobran (basta el índice).
- Leve (revisión de la página de miembro, 2026-10-26): `IconoTecnologia.tsx` importa de `simple-icons`, que carga el paquete entero (5 MB) en vitest y en `npm run dev`; en producción Vite lo recorta. Si molesta, copiar `path` y `hex` de los ~30 logos a un módulo local.

- **Leves de la revisión de encargos por miembro** (2026-10-26, no se vuelven a revisar en ese cambio):
  `colabora.correo` repite el correo de la marca (decisión de la persona si un miembro quiere otro); `lastmod` de
  las páginas de miembro es la fecha del build; `h2` dentro de `summary` en los pliegues móviles (válido, pero
  algunos lectores de pantalla lo anuncian dos veces); la lista de redes está repetida en `Equipo.tsx` y
  `Miembro.tsx` (el enlace ya es `EnlaceRed`; queda la lista `ul`); ningún test comprueba que las claves dinámicas (`equipo.papel.*`) existan
  en los tres idiomas; la foto de `/equipo` se pinta a 64 px con atributos 88×88.
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

- Leve, de la revisión de fase 3 del muro (2026-10-25): `npm run medir` reutiliza cualquier servidor que ya responda
  en 4173 sin comprobar que sirve el `dist/` actual; parar el servidor con `process.kill(-pid)` y lanzar `npx` sin
  shell no valen en Windows (sin probar allí; lo comprobaría la persona en su equipo si lo usa).

- Leve, de la revisión del muro (2026-10-25): `scripts/paginas-estaticas.mjs` repite a mano el título y la
  entradilla del muro de `src/i18n/textos.ts` y la lectura y el orden de `src/data/muro.ts` (sin test que los ate);
  su HTML estático no enlaza la ficha ni las imágenes de cada publicación y `/muro` lleva el JSON-LD genérico del
  sitio (sin `Blog`/`ItemList` ni fechas).

- Propuesta para el flujo (próxima recogida), del muro (2026-10-25): la skill `gw-media-content` debería dejar en
  cada pieza un `web.md` con el bloque JSON de «El muro» de `docs/desarrollo.md`, **con `estado`** (hoy el de
  Tarkor no lo trae y la tarea no publicaría nada); y unificar la carpeta de las piezas (Tarkor usa
  `AAAA-MM-DD-tema/`, la skill `AAAA-MM-DD/NN-tema/`; el portal acepta las dos).

- Leve, de la revisión del rediseño (2026-10-25): abrir un apartado cambia el `#ap-…` con `replaceState`, así que el botón Atrás del móvil sale de la ficha en vez de cerrar la hoja (valorar `pushState` y cerrar con `popstate`); el límite de 160 px de la barra de grupos (`NavFicha`) está fijo y no sigue a la altura real de la cabecera y la barra.

- Leve, de la revisión de la ficha de Álvaro: `formatearMes` abrevia «septiembre» como «sep.» (la RAE da «sept.»); las dos etapas de formación de Chios salen iguales hasta saber qué ciclo es cada una (y los enlaces de GitHub y demás, cuando la persona los pase).

- Propuesta para el flujo (próxima recogida): `aplicar.py --update` sustituyó `comprobar.yml` como «copia anterior»
  y se llevó el build y Node 22 del portal sin avisar; se repusieron a mano. **Pasó otra vez en la 0.3.0**: el
  simulacro lo dio como «update» y no como «propose», aunque tenía cambios locales. Un sitio en el CI para los pasos propios
  del proyecto evitaría perderlos en cada actualización.
- Propuesta para el flujo, hallazgos de la revisión del 2026-10-23 en sus scripts (aquí no se editan):
  `pre-push` y `revision-antes-de-main.sh` leen la política de la punta de `main` y, si esa config está rota, ni el
  arreglo puede subir; los dos dejan pasar sin comprobar la marca si no pueden traer la punta remota (deberían fallar
  cerrados); los cambios del `pre-push` 0.2.0 no traen caso en el test del proyecto; `recuperar.py` solo espera 1 s
  la entrada del gancho y puede tomar el transcript de otra sesión.
- Propuesta para el flujo: en la plantilla de `CLAUDE.md` 0.3.0, «El modelo de la sesión la elige la persona»
  debería ser «lo elige».
- Revisión del flujo 0.3.0 (2026-10-23, `/code-review --max-findings all`): nada grave o medio en el portal. Leves:
  `test_medir.py` (llega con la skill `opt-tokens`) no lo corre `npm run check`; `AGENTS.md` cita `opt-ai`, opcional
  y no instalada (solo aplica con medidas de IA local). Propuestas para el flujo (código suyo, no se edita aquí):
  `bitacora.py closed` ya no cuenta `- [x] **ID**` ni viñetas simples; `pre-push` con `worktreeDir` dentro del
  repo, `checkWrapper` que limpia el entorno, entrecomillado del wrapper repetido en `pre-push`/`fusionar.sh`/`config.py`
  y worktrees huérfanos con pid reutilizado; `revision-antes-de-main.sh` sondea `gh api` en cada llamada y bloquea
  cambios de título o base en PR cerrados; `enlaces-md.py` con symlinks hacia fuera; `config.py` acepta `cwd` fuera
  del repo en `relatedTests`; `doctor.py` duplica avisos del glosario por mayúsculas y da por bueno `npm run check`
  citado en un comentario; `session-start.sh` deja vivo el watchdog del `setup`.
- «About» del repo en GitHub (descripción, web y topics): lo pone el usuario (el proxy no deja cambiar ajustes del
  repo; pendiente desde el SEO del 2026-10-14).
1. Equipo: redes sociales que se vayan pasando (en `src/data/equipo.json`).
2. Cuando el instalador de Tarkor sea público: añadirlo en `enlaces` de `tarkor.json` y pasar
   el estado si procede.

## Comprobar el estado

```bash
npm ci && npm run check && npm run build
```
