# Animaciones del workflow: propuesta de diseño

**Fecha:** 2026-11-04 · **Estado:** propuesta, pendiente de decidir con la persona · **Ficha:**
`src/data/proyectos/galivelop-workflow.json` · **Storyboard:** viñetas y muestra animada en HTML (se entrega aparte,
fuera del repo).

Hoy la ficha enseña siete diagramas en inglés (`docs/diagramas/*.svg`, exportados a webp), dos veces: en la galería y
en el apartado «Cómo funciona, en diagramas». La idea es sustituir los que cuentan una secuencia por **dos
animaciones paso a paso**, en SVG dentro de la página y en los tres idiomas, y dejar como imagen solo lo que es mapa
o referencia.

## Qué se mantiene de la propuesta y qué cambia

- **Se mantiene:** dos animaciones («Una tarea, de principio a fin» y «Camino a main») y las imágenes de
  arquitectura y versiones como consulta.
- **Cambia 1, interacción:** no son vídeos ni bucles. Son **pasos con botones**, con «Reproducir» opcional que
  avanza una sola vez. Razones en «Interacción».
- **Cambia 2, móvil:** el móvil tiene **su propia composición vertical**, no la de escritorio encogida. Un diagrama
  de 1600 px a 358 px deja el texto de 22 px en unos 5 px: los webp de hoy ya no se leen en el móvil.
- **Cambia 3, curva de gasto:** va dentro de la animación 1 como **esquema sin números**. Datos medidos solo hay
  los de un piloto (157 llamadas, 191k de contexto medio, el 70 % del gasto), así que no se dibujan ejes con
  cifras.
- **Cambia 4, fotogramas de apoyo:** no son fotogramas sueltos de la animación. Son las dos piezas que la
  animación simplifica y que alguien querrá ver enteras: la cadena completa del pre-push y la escalera de modelos
  con el contenido de un encargo.

## Inventario

| Imagen | Qué cuenta | Destino | Por qué |
|---|---|---|---|
| `galivelop-workflow.svg` (portada, 1600×1000) | Mapa de una tarea, las tres fases y el ciclo de versiones | **Se queda** como portada de la galería y como imagen para compartir | Es el mapa del conjunto y la miniatura de la tarjeta. Una animación no la sustituye ahí. Pasarla a es/gl/en es otro paso (pregunta 5). |
| `gw-arquitectura.svg` | Seis capas, de lo que decide el agente a lo que impone un script | **Imagen de consulta** | No es una secuencia, así que animarla no añade nada. Más adelante, SVG en línea traducible (pregunta 4). |
| `gw-sesion.svg` | SessionStart, bitácora, compactación, `recover.py`, relevo | **Se retira**; pasa a la animación 1 (pasos 1, 6, 7 y 8) | Es justo la historia de la animación, contada en movimiento. |
| `gw-subagentes.svg` | Orquestador, encargo, resumen y escalera de modelos | **Animación 1 (paso 3) + fotograma de apoyo** | El reparto entra en la animación. La escalera (sonnet low → … → opus high, dos fallos y se para) y el contenido del encargo van como apoyo en el apartado `skills-propias`. |
| `gw-fases.svg` | Las tres fases antes de main y lo que deja cada una | **Se retira**; pasa a la animación 2 (pasos 2-5) | Es una secuencia con decisiones de la persona: se entiende mejor paso a paso. |
| `gw-pre-push.svg` | Las ocho comprobaciones del gancho y el rechazo | **Animación 2 (pasos 6-7) + fotograma de apoyo** | La animación lo resume en cinco compuertas. La cadena completa (refs, commit, config@sha, restos, check@sha en worktree, ¿protegida?, ¿código?, marca) va como apoyo en el apartado `garantias`. |
| `gw-versiones.svg` | Publicar, aplicar, recoger, versión nueva | **Imagen de apoyo** | Es otro bucle, entre proyectos y no dentro de una tarea. Ilustra el paso 8 de «Cómo funciona» («Devolver lo aprendido»). |

**El apartado `diagramas`** («Seis diagramas…») repite la galería. Con las animaciones sobra: se retira, y sus dos
imágenes de consulta quedan en la galería. Si la persona prefiere mantener un apartado de referencia, se queda solo
con arquitectura, versiones y los dos fotogramas de apoyo.

**Galería resultante:** portada, arquitectura y versiones (3 imágenes en vez de 7).

## Animación 1 · «Una tarea, de principio a fin»

- **Objetivo:** que se entienda en conjunto **por qué git es la memoria**. La sesión es desechable y todo lo que
  importa ya está subido. La frase que lo resume, en el reposo: «lo que no está subido no existe».
- **Público:**
  - Quien llega a la ficha sin saber qué es un relevo entre sesiones.
  - Quien ya usa agentes y quiere ver dónde entra cada pieza: selector, subagentes, compactación.
- **Metáfora visual:** dos carriles.
  - Arriba, la **sesión**: tarjeta efímera con su medidor de contexto.
  - Abajo, el **carril de git**: commits verdes que nunca desaparecen.
  - Todo lo que pasa arriba puede perderse; lo que baja al carril, no.
- **Duración:** 8 pasos. Con «Reproducir», unos 5-6 s por paso: unos 45 s.
- **Se apoya en** los pasos 1-4 de «Cómo funciona» (Retomar, Elegir, Pensar si hace falta, Trabajar y subir).

| # | Paso | Qué se ve | Qué se mueve | Narración (es) |
|---|---|---|---|---|
| 1 | Retomar | Tarjeta «sesión A» con la ficha `SessionStart`; `handoff.md` al lado; carril de git con 4 commits | La bitácora sube del carril a la sesión; se encienden `fetch · commit ✓` y `check ✓` | «La sesión arranca y lee la bitácora del repositorio: rama, tarea, qué falta y siguiente paso. Comprueba que el último commit coincide y que el check está en verde.» |
| 2 | Elegir | `gw-selector` junto a la sesión; fichas «skill» y «modelo»; la persona en ámbar | Flecha de la sesión al selector; caen las dos fichas; la persona se ilumina solo en la rama «riesgo → espera» | «Antes de tocar nada, gw-selector dice qué skill y qué modelo pide la tarea. Si es de riesgo, se espera a la persona.» |
| 3 | Repartir | Sesión principal («planea, decide, revisa») y tres subagentes con su medidor casi vacío | Salen tres encargos (azul) y vuelven tres resúmenes (verde, discontinuo, «≤ 15 líneas»); el medidor principal apenas sube | «gw-orchestrate-dealer reparte lo mecánico a subagentes de contexto limpio, con el modelo más barato que lo haga bien. Cada uno vuelve con un resumen corto y la sesión principal lo revisa.» |
| 4 | Subir | Sesión con «trabajo + bitácora»; fichas `pre-commit`, `pre-push`; etiqueta «Siguiente: …» | Un commit cae al carril y se queda resaltado; las dos fichas se encienden en verde a su paso | «En cada punto estable, commit y push, con la bitácora en el mismo commit. Cada commit termina con «Siguiente:». Los ganchos pasan el check y buscan secretos antes de dejarlo salir.» |
| 5 | El contexto crece | Medidor casi lleno en ámbar; curva de coste por llamada con la línea del tope; rótulo «esquema, no medida» | El medidor sube y la curva se dibuja hasta el tope | «Cada llamada vuelve a leer toda la conversación: cuanto más larga, más cuesta. Por eso lo mecánico va a subagentes y la ventana tiene un tope.» |
| 6 | Compactar | `/compact` en la sesión; `recover.py --state` al lado | El medidor baja de golpe y queda el contorno discontinuo de lo que había; el estado sube del carril a `recover.py` y de ahí a la sesión | «Al llegar al tope, la conversación se compacta. Un gancho corre recover.py y devuelve el estado desde git: la sesión sigue por el mismo paso.» |
| 7 | Corte | «sesión A ✗» en rojo discontinuo: sin tokens · contenedor · otra cuenta | La sesión se apaga y se desvanece; el carril de git no se mueve; aparece «git sigue intacto» | «La sesión se acaba: sin tokens, con el contenedor reciclado o con el relevo de otra cuenta. Lo que solo estaba en la conversación se pierde; lo subido, no.» |
| 8 | Relevo | «sesión B» (verde) con medidor vacío; sombra de la A | Entra B; del último commit sube una flecha hasta ella | «Otra sesión, quizá con otra cuenta, arranca, lee la bitácora y sigue por «Siguiente:» sin preguntar por dónde iba.» |

**Fotograma de reposo:** el paso 8 con todo rotulado.

- Se ve la sombra de la sesión A, la sesión B leyendo del último commit y tres subagentes en pequeño.
- La frase «lo que no está subido no existe» aparece en ámbar.
- Se entiende sin moverse. Es lo que se ve con `prefers-reduced-motion` antes de tocar nada y lo que se ve sin JS
  (con la lista de pasos debajo).

**Etiquetas cortas** (las que se traducen; los nombres técnicos no):

- sesión A/B
- contexto
- tarea
- planea · decide · revisa
- subagente
- riesgo → espera
- trabajo + bitácora
- coste por llamada
- tope
- esquema, no medida
- mismo paso
- sin tokens · contenedor · otra cuenta
- git sigue intacto
- lo que no está subido no existe

Unas 20 cadenas con las narraciones.

## Animación 2 · «Camino a main»

- **Objetivo:** que se vea que **a la rama publicada no se llega sin revisión**: tres fases, la persona decide y
  los ganchos lo hacen cumplir aunque alguien (o un agente) se lo salte.
- **Público:**
  - Quien quiere saber qué garantías hay.
  - Quien evalúa adoptar el flujo en su proyecto.
- **Metáfora visual:** una **vía con cinco estaciones** abajo (1 · 2 · 3 · ⇡ pre-push · main), que se encienden en
  verde según avanza. Arriba, lo que pasa en cada estación.
- **Duración:** 8 pasos, unos 40 s. El 7 es una **rama del guion** («si falta algo»): «Reproducir» lo enseña y
  vuelve al camino verde, para que el final sea el éxito y no el rechazo.
- **Se apoya en** los pasos 5-7 de «Cómo funciona» (Revisar el código, Mejorar el entorno, Publicar).

| # | Paso | Qué se ve | Qué se mueve | Narración (es) |
|---|---|---|---|---|
| 1 | Rama lista | Línea `main` gris y la rama de trabajo con commits verdes, «check ✓»; estaciones apagadas | La rama se dibuja paralela a main | «El trabajo está en la rama de trabajo, subido y con el check en verde. Todavía no ha llegado nada a main.» |
| 2 | Fase 1 · código | `/code-review --max-findings all` con `REVIEW.md`; hallazgos de colores | Salen los hallazgos: grave y medio → commits de arreglo; leve → bitácora. Se enciende la estación 1 | «Se revisa todo el diff contra main con el criterio escrito del proyecto. Lo grave o medio se arregla y se sube; lo leve se apunta en la bitácora.» |
| 3 | Fase 2 · entorno | `/gw-opt-tokens` y `/retro`; tres propuestas; la persona | La persona marca ✓ ✓ ✗; aparece `retro-*.md`. Nota: «en cambios pequeños puede saltarse» | «gw-opt-tokens mide en qué se fue el gasto y la retro propone cambios. Las propuestas se presentan a la persona y solo se aplica lo que confirma.» |
| 4 | Fase 3 · marca | `reviewed.sh` → `reviewed.txt` con un sha | Línea discontinua del sha al commit revisado: «mismo sha» | «Un script deja escrito en el repositorio qué commit se revisó. Sin esa marca, los ganchos no dejan publicar.» |
| 5 | La persona decide | La persona grande; bocadillo «¿subimos a main?» → «sí» | La confirmación baja a la bitácora | «A main solo se sube con la confirmación de la persona, y queda apuntado en la bitácora.» |
| 6 | pre-push | Cinco compuertas: check, restos, protegida, código, marca | Se encienden en verde de izquierda a derecha | «Al subir, el gancho pre-push juzga el commit que sale, no la carpeta de trabajo: pasa el check, busca restos de conflictos y, si es la rama protegida y trae código, exige la marca de ese mismo commit.» |
| 7 | Si falta algo | La compuerta «marca» en rojo; banda «✗ subida rechazada · exit 1» con la orden que lo arregla | La compuerta pasa a rojo y la banda entra desde abajo | «Si una comprobación falla, la subida se rechaza y la última línea dice la orden que lo arregla. Ningún commit puede desproteger la rama que lo juzga.» |
| 8 | CI y main | `CI Linux ✓`, `CI macOS ✓`; tarjeta «main · publicado»; todas las estaciones en verde | La rama se funde con main, que se ilumina. Nota: «un CI que no arranca cuenta como rojo» | «El CI corre la misma comprobación en Linux y macOS. Con todo en verde, el cambio llega a main: la web o la versión publicada.» |

**Fotograma de reposo:** las cinco estaciones en verde, cada una con lo que deja.

- código → arreglos
- entorno → `retro.md`
- marca → `reviewed`
- pre-push → `exit 0`
- main → `CI ✓`

Encima, «nada llega a main sin revisión»; debajo, la persona que confirma. Equivale a `gw-fases` pero se lee en el
móvil y en tres idiomas.

**Variante por pull request:** con `pushToProtected: pr`, el gancho que pide la marca es otro (PreToolUse, antes de
crear o fusionar el PR) y además exige el CI en verde. No se cuenta en la animación, para no duplicar pasos: basta
una línea en el texto del paso 7 de «Cómo funciona» o en `garantias` (pregunta 8).

## Interacción: pasos con botones, no bucle ni scroll

**Recomendación:** un **stepper**.

- Botones «Anterior» y «Siguiente», más la lista de pasos pulsable con `aria-current="step"`.
- Un botón **«Reproducir»** que avanza solo una vez, con una barra de progreso fina, y **se para al final**.
- Empieza **quieto en el fotograma de reposo** (el último paso). «Reproducir» arranca desde el paso 1.

**Contra el bucle automático:**

- Cambia el texto mientras se lee.
- Obliga a un control de pausa (WCAG 2.2.2, *Pause, Stop, Hide*).
- En una ficha larga consume batería y atención aunque nadie lo mire.
- La galería actual ya tiene esta lógica (rota, se pausa 3 min tras usarla, solo rota si se ve) y es más complicada
  de lo que merece una explicación.

**Contra el scroll-linked:**

- En el móvil es frágil: inercia, barra del navegador que aparece y desaparece.
- Choca con la barra fija `NavFicha` y con los diálogos `hoja`.
- Obliga a «secuestrar» el scroll, que molesta a quien solo quiere bajar.
- Con `prefers-reduced-motion` hay que rehacerlo igual como pasos.

**Por qué el stepper:**

- Cada paso tiene su narración completa.
- Se puede citar y enlazar.
- Es accesible sin trucos.

**Teclado y lectores de pantalla:**

- El componente es una región (`<section aria-labelledby>`) con su título.
- Flechas ← → cambian de paso cuando el foco está dentro.
- Los botones son `<button>` de al menos 44 px de alto.
- La **narración vive fuera del SVG**, en un `<p aria-live>`:
  - `polite` cuando el cambio lo provoca la persona.
  - `off` durante «Reproducir», como hace `Galeria.tsx`.
- El SVG es `role="img"` y su nombre es la narración del paso actual (`aria-labelledby`).
- Los estados se marcan con ✓/✗ y texto, **nunca solo con color**.
- Sin JavaScript, la página prerenderizada lleva el fotograma de reposo y la lista ordenada (`<ol>`) con los ocho
  pasos y sus narraciones.

**`prefers-reduced-motion`:**

- Los botones funcionan igual, pero el paso cambia **sin transición** (la regla global de `global.css` ya pone las
  duraciones a 0 ms).
- «Reproducir» alarga cada paso a unos 8 s.
- Se empieza en el reposo, que se entiende solo.

## Composición

**Escritorio (≥ 760 px de ancho del componente):**

- Escenario horizontal de unos 16:9 (`viewBox` 960×540), a todo el ancho de la columna de la ficha.
- Debajo, en dos columnas: a la izquierda la narración (tamaño de texto normal) y a la derecha los controles con la
  lista de pasos.
- Texto del SVG ≥ 14 px a tamaño real.

**Móvil (< 760 px): composición propia en vertical**, no la de escritorio escalada.

- `viewBox` de unos 340×420, para que los rótulos queden en 12-14 px reales.
- **Git es una columna a la izquierda**, como un `git log --graph`, y la sesión, los subagentes o las fases van a
  la derecha. En el storyboard hay una muestra de tres pasos en esta disposición.
- El escenario ocupa como mucho ~55 vh. Debajo van la narración y, al final, los controles, dentro del componente,
  para que no se tape con `NavFicha`.
- La animación 2 en móvil pone las estaciones en vertical a la izquierda y lo de cada fase a la derecha.
- Márgenes: los de la ficha (16 px), sin scroll horizontal. La lista de pasos se parte en varias líneas
  (`flex-wrap`) en vez de deslizar.

**Un componente, dos mapas de posiciones:**

- Cada elemento tiene coordenadas para «ancho» y «estrecho».
- Se elige por el ancho del contenedor (`ResizeObserver` o *container query*), no de la ventana, porque la ficha
  puede cambiar de columna.

## Dónde va en la ficha y cómo se relaciona con los textos

- **En «Cómo funciona» (grupo `resumen` de `Proyecto.tsx`), justo debajo de las tarjetas de `pasos`.** Las 8
  tarjetas hacen de **índice de capítulos**:
  - Pulsar «Retomar» o «Trabajar y subir» abre la animación 1 en ese paso.
  - Pulsar «Revisar el código», «Mejorar el entorno» o «Publicar» abre la animación 2.
  - «Pensar si hace falta» lleva al paso 2 (Elegir).
  - «Devolver lo aprendido» lleva a la imagen de versiones de la galería.
- **Las tarjetas no cambian de texto.** La narración amplía lo que dice cada tarjeta, sin repetirlo palabra por
  palabra.
- Las dos animaciones van una tras otra con su título (h3) o con dos pestañas («Una tarea» / «Camino a main»).
  Pestañas ahorran altura en el móvil; una tras otra se encuentran mejor al hacer scroll (pregunta 1).
- **Fotogramas de apoyo, dentro de los apartados** que ya explican esa pieza, como `imagen` de un `item`:
  - La cadena completa del pre-push, en `garantias`.
  - La escalera de modelos y el contenido del encargo, en `skills-propias` (item de `gw-orchestrate-dealer`).
- **Textos:** respetan el «Mensaje» de `docs/desarrollo.md`. Tono llano y concreto, nada de venta, y honestidad con
  lo que es estimación (la curva lleva «esquema, no medida»). No se nombran cifras que la semanal tendría que
  perseguir: las versiones y el número de tests siguen en `cifras` y en `versiones-publicadas`.

## Enfoque técnico

- **Componente `src/components/AnimacionFlujo.tsx`** (nuevo), con el SVG en JSX.
  - El único estado de JS es el **índice de paso** (más «reproduciendo»).
  - El paso se escribe como `data-paso` en la raíz, y **CSS** decide qué se ve: `opacity` y `transform` con
    `--curva` y unos 500 ms. Sin librerías de animación.
  - Se carga con `React.lazy` solo en esta ficha, para no pesar en el resto del portal.
- **Guiones como datos, no como código:**
  - Cada animación es un módulo pequeño (`src/components/animaciones/tarea.tsx`, `main.tsx`) que exporta sus
    piezas (tarjetas, carriles) y, por paso, qué piezas están visibles o resaltadas.
  - Añadir un paso es tocar una tabla, no reescribir el componente.
- **Traducciones en el JSON de la ficha**, con un campo opcional nuevo en `Proyecto` (`src/data/tipos.ts`):
  ```ts
  animaciones?: {
    id: 'tarea' | 'main'
    titulo: Texto
    pasos: { titulo: Texto; narracion: Texto }[]
    etiquetas: Record<string, Texto>   // rótulos cortos del SVG
  }[]
  ```
  - Así el test de `src/data/proyectos.test.ts` (`textosIncompletos`) exige es/gl/en a cada cadena sin escribir
    nada nuevo.
  - Los nombres técnicos (`handoff.md`, `gw-selector`, `reviewed.sh`, `pre-push`) van en el SVG tal cual, sin
    traducir.
  - Un test nuevo comprueba que el número de pasos del JSON coincide con el del guion.
  - Otro test pone un **tope de largo** a cada etiqueta (el gallego y el inglés suelen ser más largos), para que no
    se salga de su tarjeta.
- **Tipografía:**
  - Inter (ya cargada) para rótulos.
  - Para lo técnico, `ui-monospace, Menlo, monospace`: DejaVu, la de los diagramas, no se carga en la web.
- **Prerender:** `scripts/paginas-estaticas.mjs` ya prerenderiza la ficha. El reposo y el `<ol>` de pasos salen en
  el HTML estático.
- **Peso estimado:**
  - Unos 8-12 KB por animación sin comprimir (3-4 KB con gzip), con los textos de los tres idiomas.
  - Frente a eso, hoy se sirven unos 360 KB de webp grandes y 135 KB de miniaturas. Se retiran 4 de 7.
- **Fotogramas de apoyo:** dos opciones (pregunta 6).
  - **a)** SVG en línea, con un campo `figura` en `ItemApartado` que nombra un componente (es código).
  - **b)** webp por idioma, exportados con el mismo comando de siempre (`.claude/skills/gw-portal/proyectos.md`).
    Es contenido, pero son 3 archivos por figura y la semanal tendría que regenerarlos.
- **Reparto del trabajo** (bitácora, «Pendiente»): guion y animación con el modelo grande; dibujo de piezas y
  traducciones con el barato.
  - Antes de escribir código, prototipo de variantes del relevo (paso 7-8) con la skill `prototype`, publicado como
    Artifact para verlo en el móvil.

## Riesgos

- **Es código, no contenido.**
  - El campo en `tipos.ts`, el componente y los cambios en `Proyecto.tsx` necesitan `/code-review` y la marca antes
    del domingo, porque la rama de trabajo tiene que estar siempre publicable.
  - La tarea semanal no puede tocarlos.
  - Conviene hacerlo en su propia rama `claude/animaciones-workflow` y fusionarla solo terminada.
- **La regla de DIAGRAMAS de la skill `gw-portal`** (`.claude/skills/gw-portal/proyectos.md`) busca la versión y el
  número de tests dentro de los SVG y regenera los webp. Al retirar cuatro diagramas, esa regla se queda con tres.
  - La skill es copia del flujo y no se edita aquí. La nota va en `AGENTS.md` («Notas del portal para las skills»)
    o en `.claude/gw/gw-opt-tokens.md`, y la propuesta general a la retro.
- **Simplificar sin falsear.** La curva es un esquema; el ahorro de ~30 % es una estimación y no se dibuja; solo hay
  un piloto medido. Cada rótulo se revisa contra los scripts reales:
  - El pre-push tiene ocho comprobaciones y la animación enseña cinco. Lo dice el fotograma de apoyo.
  - La fase 2 es opcional en cambios pequeños del portal (`requireRetro: false`), pero no en el flujo general.
- **La animación 1 puede pecar de cargada** (8 pasos, 4 ideas). Lo mitigan los capítulos desde `pasos` y que cada
  paso tenga una sola cosa que se mueva. Si en la prueba con gente se pierde, se parte en dos: «Trabajar» (1-4) y
  «Relevo» (5-8).
- **Largo de los textos** en gallego e inglés: el test de largo y revisar los tres idiomas en móvil antes de cerrar.
- **Móviles modestos:** solo `opacity` y `transform`, nada de filtros ni `path` animados. Si va lento, se quita la
  transición y quedan los pasos.
- **SEO y enlaces:** no cambia ninguna ruta. Retirar imágenes de la galería no rompe enlaces externos (los webp no
  se borran del repo hasta confirmarlo). La imagen para compartir (`og.jpg`) no cambia.
- **Portada en inglés:** queda incoherente con el resto en tres idiomas hasta que se traduzca (pregunta 5).

## Preguntas abiertas para la persona

1. **¿Las animaciones en «Cómo funciona», debajo de los pasos, o en un apartado propio?** Recomiendo «Cómo
   funciona». Y dentro de él, ¿una tras otra o con pestañas?
2. **¿Stepper con «Reproducir» opcional, o que arranque solo la primera vez que se ve?** Recomiendo que no arranque
   solo.
3. **¿Curva de gasto como esquema dentro de la animación**, o un gráfico aparte con los datos reales de los pilotos
   cuando haya más de uno?
4. **¿Arquitectura y versiones a SVG en línea traducible ya, o se quedan en webp inglés de momento?**
5. **¿Vale la portada y la imagen para compartir en inglés,** o se hacen en es/gl/en?
6. **¿Los fotogramas de apoyo como SVG en línea (código) o como webp por idioma (contenido)?**
7. **¿Se enseña la fase 2 como «opcional en cambios pequeños»** (la regla del portal) o como la regla general del
   flujo (siempre)?
8. **¿Se menciona la variante por pull request** en la animación 2, o basta una línea en el texto?
9. **¿La persona aparece como una figura** (ámbar) o como un rótulo («la persona decide»)?
10. **¿Se retira el apartado `diagramas`**, o se deja con las imágenes de consulta y los dos fotogramas de apoyo?
