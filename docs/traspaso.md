# Bitácora de traspaso

Se actualiza en cada commit. Reglas en [`CLAUDE.md`](../CLAUDE.md).

## Estado actual

| | |
|---|---|
| **Actualizado** | 2026-10-26 |
| **Rama de trabajo** | `claude/galivelop-dev-portal-1h89ci` (la que publica la tarea semanal); esta sesión, `ccr-47f8fddd-o5ek6p` |
| **Tarea en curso** | **Mejoras de la página de miembro** (petición de la persona, 2026-10-26, entra antes de ir a `main`): tecnologías siempre desplegadas y con icono (Simple Icons), trayectoria por empresa con logo, puesto y descripción, y cifras en la cabecera; hecho el código. Puestos con los **clientes** de cada consultoría (Orienteed: Luxottica, Ezpeleta, PLADUR, Mayoral; Plexus: Luckia; Servicio Móvil: Inditex, Sergas), etiqueta de negocio por empresa (Orienteed B2C/B2B, Plexus y Servicio Móvil B2C, ALUMAN B2B; campo `negocio`) y la formación como dos titulaciones sin centro (DAW y DAM, sin Chios, por petición de la persona). **Faltan de la persona**: confirmar la grafía Luckia/Luxottica y qué fechas van con cada titulación; la descripción de cada puesto y los logos de las empresas (la red del contenedor no llega a sus webs). Luego, su code-review. Antes: Encargos por miembro (ADR 0001), **implementado** en `ccr-47f8fddd-o5ek6p` y con confirmación de la persona para llevarlo a `main` («Aplícalo y llevémoslo a main», 2026-10-26): página `/equipo/<id>`, «Ver perfil» en `/equipo`, papeles por proyecto, cierre «¿Tienes un proyecto?» (dato `colabora`), banda «¿Tienes un proyecto propio?» en Participa, tercer párrafo de «Cómo trabajamos», páginas estáticas y docs. Prototipo: https://claude.ai/artifact/BtcUZZ6cdbK8b5apHEo1mx |
| **Siguiente paso** | Con los datos de la persona: poner `descripcion` y `logo` en las etapas de Álvaro (`public/equipo/empresas/`), code-review de los commits de la mejora y seguir con las fases. Encargos: fase 1 hecha (18 hallazgos: 10 arreglados más 2 leves; el resto en «Pendiente»). Sigue: (2) `opt-tokens` y retro, **presentadas a la persona**; (3) `revisado.sh`, push, CI en verde y push a `main` (con su apunte aquí); luego igualar `claude/galivelop-dev-portal-1h89ci` con `main`. Sigue pendiente de la persona pegar el bloque ```text de `docs/runbooks/tarea-semanal.md` en «Proyectos semanal» |
| **En `main`** | Todo publicado: revisión especial de los repos (fichas de Galivelop-workflow y Tarkor, 2026-10-25, confirmación de la persona); «Próximamente» en el inicio (2026-10-25, confirmación de la persona); muro (`/muro`, oculto hasta la primera publicación) (2026-10-25, confirmación de la persona); rediseño de la ficha («De un vistazo», barra de grupos, apartados en hoja) y del inicio, `npm run medir`, `leerAncla()` y plurales en plantilla (2026-10-25, confirmación de la persona). https://zeldris.github.io/Portal-Galivelop/ |
| **Tests** | `npm run check`: tsc 0 errores, vitest 59/59 y `tools/qa/tests/test-ganchos.sh` (ganchos y scripts del flujo, `.claude/gw.json` y 11 casos de la regla de `main`, 3 de ellos de la tarea semanal, más la clasificación código/contenido, el `pre-commit`, `content` fijado y nada del flujo en el `.gitignore`; pide bash, git y python3). `npm run build` correcto (27 páginas estáticas, con las de cada miembro en es/gl/en) |

### Para la próxima publicación

La web se publica los domingos a las 20:45 (hora de Madrid) con la tarea programada «Proyectos semanal» (ver `AGENTS.md`).
Aquí se apunta lo que está en la rama de trabajo y aún no en `main`.

## Hecho

- ✅ 2026-10-26 · Mejoras de la página de miembro (sin revisar ni publicar): `src/components/IconoTecnologia.tsx` con el logo de Simple Icons (`simple-icons` 16.35.0, CC0) o un monograma para las que no lo tienen (AngularJS, JSP, C#, ASP.NET, Magento, SoapUI, Oracle, SQL Server, SQL y Microsoft 365); los logos casi negros (contraste < 3:1) toman el color del texto en el tema oscuro y los muy claros en el claro. Tecnologías siempre desplegadas, también en móvil. Trayectoria y formación agrupadas por empresa o centro (`agruparPorLugar`), con logo (campo `logo` de la etapa; sin él, iniciales), puesto, fechas y `descripcion` opcional. Cabecera con cifras sacadas de los datos (años, empresas, proyectos). Tests en `src/data/equipo.test.ts` (iconos de todas las tecnologías, logos existentes, agrupación, años, tono). Documentado en `docs/desarrollo.md`. Capturas en escritorio y móvil, temas oscuro y claro.
- ✅ 2026-10-26 · Fase 1 de los encargos por miembro (`/code-review --max-findings all`, 18 hallazgos). Arreglados: regla de `AGENTS.md` (también «Cómo trabajamos» y README), papel de Raquel en toVeriAI y test que exige un papel por proyecto (rojo comprobado sin él), `useMovil` con respaldo `addListener` (Safari < 14), «Onde atopar {nombre}», cuerpo del ADR al día, asunto del correo con plantilla `{nombre}`, `aria-label` de «Ver perfil» con el nombre, README gl/en hablando del obradoiro/workshop, página estática de `/equipo` con enlace a cada miembro y la de miembro con la lista de proyectos, descripción de miembro «rol · resumen»; leves: doble línea en blanco del CSS y `.miembro-proyectos a > span`. Decidido: `og:image` de miembro sigue siendo la de la marca (la foto webp cuadrada no sirve de vista previa grande).
- ✅ 2026-10-26 · Encargos por miembro implementados (sin publicar aún): `src/pages/Miembro.tsx` en `/equipo/:id` (cabecera, «Sobre», «En Galivelop» con papel, trayectoria, formación, tecnologías, idiomas, fortalezas, redes y cierre `colabora`; en móvil lo largo va plegado), tarjetas de `/equipo` con «Ver perfil» (el anclaje `/equipo#<id>` sigue), «Ver en el equipo» de la ficha a la página del miembro, banda en Participa y `sobre.texto3`; textos es/gl/en; `papeles` y `colabora` en `src/data/equipo.json` con su test (rojo comprobado con un papel inválido); página estática por miembro con `ProfilePage`/`Person` y en el sitemap. Docs: `desarrollo.md`, ADR 0001 (publicada), `AGENTS.md`, `GLOSSARY.md` y README. Capturas en escritorio y móvil (Participa, `/equipo`, página de Álvaro) sin errores de consola.
- ✅ 2026-10-26 · Prototipo de encargos y página de detalle (skill `prototype`, rama de UI). Pregunta: cómo decir sin insistir que los miembros aceptan proyectos y cómo es la página de cada uno. Veredicto de la persona tras la investigación: fórmula **«colabora de vez en cuando en proyectos de otras personas, por su cuenta»** (sustituye a «proyectos de pago») y **sin distintivo** en `/equipo`. El lienzo propone: tarjeta corta con «Ver perfil» y el perfil ampliado movido a `/equipo/<persona>`; cierre «¿Tienes un proyecto?» solo si el miembro lo quiere (dato `colabora`); banda discreta «¿Tienes un proyecto propio?» en «Participa»; tercer párrafo en «Cómo trabajamos»; tabla de textos es/gl/en (el gallego, a revisar por un hablante). Falta que la persona valore la página de detalle.
- ✅ 2026-10-26 · Encargos por miembro, a petición de la persona y **sin publicar**: el taller sigue sin vender; cada miembro podrá aceptar proyectos de pago contratados con él directamente (factura el miembro). [ADR 0001](adr/0001-encargos-por-miembro.md), nota en el mensaje de la marca de `AGENTS.md` y término «Encargo» en `GLOSSARY.md`. Ningún texto visible cambia: los actuales («esta web no vende») hablan del taller y encajan.
- ✅ 2026-10-25 · Revisión especial de todos los repos y publicación (a petición de la persona, «ocasión especial»): Galivelop-workflow, novedad de la 0.4.0 en preparación (rama `ccr-6dfbc880-ddr41g`, sin publicar; cosecha al empezar cada versión, skills de contenido para redes y `wait-what`, ganchos más seguros, CI que no arranca) y detalle del hito 7; Tarkor, novedad de la enciclopedia revisada con el canon (las herramientas de voces e imágenes con IA local son internas, no salen); toVeriAI, «Próximamente» y muro sin cambios (ningún `web.md` listo). Las propuestas P1/P3/P4 del portal ya están aplicadas en esa rama del flujo. Publicado en `main` con confirmación de la persona; la rama de la tarea, igualada con `main`.
- ✅ 2026-10-25 · Comprobada la revisión semanal del mismo día (`b92a8a1`): cada proyecto cuadra con sus repos (Tarkor: la novedad sale de las tandas 22-27 del 10-23 y lo del 10-24 y 10-25 es interno; Galivelop-workflow sin etiqueta nueva tras la v0.3.0; toVeriAI sin novedades públicas desde el 07-17; «Próximamente» igual que los planes y bitácoras de cada repo; ningún `web.md` listo). CI «Comprobar» y «Publicar en GitHub Pages» en verde. Al recortar «Hecho» se perdió la comprobación manual de Discord: repuesta en «Pendiente».
- ✅ 2026-10-25 · Runbook de la tarea semanal (a petición de la persona): en el paso 2, antes de los `git log --since`, si el clon del proyecto es superficial, `git fetch --shallow-since=<un día antes de la fecha más antigua de N y F>` (o `--unshallow`), para que no salgan como nuevos commits o archivos antiguos. Publicado en `main` con confirmación de la persona (solo documentos); falta pegarlo en la conversación de la tarea.
- ✅ 2026-10-25 · Revisión semanal: Tarkor con una novedad (ronda de pruebas del mundo vivo cerrada, 2026-10-23); Galivelop-workflow (sigue en la v0.3.0), toVeriAI y «Próximamente» (2/6, 1/8, 1/6) sin cambios; muro sin publicaciones (ninguna pieza con `estado: "listo"`). Publicado en `main`.
- ✅ 2026-10-25 · «Próximamente» en el inicio: Galivelop Image Generator (2 de 6 fases), Voice Generator (1 de 8) y Developer (1 de 6), atenuados, sin enlace ni página propia; datos en `src/data/proximamente.json`, que pone al día la tarea semanal (bloque PRÓXIMAMENTE). Revisado (fase 1, 6 arreglos; 2 leves en «Pendiente»), retro `docs/registros/retro-2026-10-25-proximamente.md` aprobada entera (test `src/data/tarea-semanal.test.ts`, notas de gasto) y fase 3 sin hallazgos graves ni medios. Publicado en `main` con confirmación de la persona; la tarea semanal lo trae al fusionar `origin/main`.
- ✅ 2026-10-25 · Muro: página `/muro` con filtro por proyecto y ancla por publicación, las 3 últimas en cada ficha, página estática y `llms.txt`; se oculta sin publicaciones. Contrato de `docs/difusion/**/web.md` (`estado: "listo"`, bloque `muro`) en «El muro» de `docs/desarrollo.md` y paso 2b de la tarea semanal. Probado con piezas de ejemplo (escritorio y móvil, menú sin desbordes de 320 a 1400 px) que luego se quitaron. Revisado (fase 1, 9 arreglos); retro `docs/registros/retro-2026-10-25-muro.md` aplicada entera (`npm run medir` arranca su servidor, reglas del muro probadas con ejemplo); fase 3 con 4 arreglos en `medir` y en las reglas, 2 leves en «Pendiente». Publicado en `main` con confirmación de la persona; la rama de la tarea, igualada con `main`. El prompt de «Proyectos semanal» solo se cambia desde su propia conversación: falta que la persona pegue allí el bloque de `docs/runbooks/tarea-semanal.md`.
- ✅ 2026-10-25 · Tarea «Proyectos semanal» movida de las 22:46 a las 20:45 de los domingos (Europe/Madrid), a petición de la persona.
- ✅ 2026-10-25 · Rediseño de experiencia de usuario: ficha con «De un vistazo», barra fija de grupos y apartados en hoja; inicio en 3 columnas y más corto (móvil de 11,4 a 8,6 pantallas). Revisado (fase 1, 8 arreglos; fase 3, 7), retro aplicada y publicado en `main` con confirmación de la persona.
- ✅ Ficha de Galivelop-workflow: la cabecera ya no enmarca el primer diagrama (modo `cabecera: "color"`, nuevo) y los 7 diagramas van en la galería de debajo, como Tarkor.
- ✅ 2026-10-23 · Ficha ampliada de Álvaro en `/equipo` (trayectoria, formación, tecnologías, idiomas, fortalezas y foto) y versión breve en las tarjetas de equipo de cada proyecto; revisada (`/code-review`, arreglos en `d00b261`) y publicada en `main` con confirmación de la persona.

## Pendiente

- **Leves de la revisión de encargos por miembro** (2026-10-26, no se vuelven a revisar en ese cambio):
  `colabora.correo` repite el correo de la marca (decisión de la persona si un miembro quiere otro); `lastmod` de
  las páginas de miembro es la fecha del build; `h2` dentro de `summary` en los pliegues móviles (válido, pero
  algunos lectores de pantalla lo anuncian dos veces); la lista de redes está repetida en `Equipo.tsx` y
  `Miembro.tsx` (sacar un `ListaRedes`); ningún test comprueba que las claves dinámicas (`equipo.papel.*`) existan
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
