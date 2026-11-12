# Marca Galivelop: hoja de estilos

**Estado:** aprobada por la persona y aplicada a la web (2026-11-08, tipografía B); los recursos de imagen, al día con
la hoja del generador (2026-11-11). Prototipo: https://claude.ai/artifact/UoLydvcktgu8jYwioKbygq. Referencias y fuentes:
[`investigacion/estilo-marca.md`](investigacion/estilo-marca.md). El mensaje (qué decimos) sigue en
[`desarrollo.md#mensaje`](desarrollo.md#mensaje); aquí va cómo se ve.

## Carácter

**Cuaderno de taller sobre carta náutica.** Un taller enseña cómo trabaja: papel claro, retícula fina, filetes, datos
en monoespaciada. El mar de Galicia entra como lo dibuja una carta: isobatas, coordenadas, escalas, numeración de
puerto; nunca como olas, gaviotas o degradados turquesa. El celeste de la marca se usa en bloques grandes y planos,
como hacen las marcas con un color propio (Razer con su verde), no como acento tímido.

Cinco adjetivos: **técnico, sereno, atlántico, artesano, abierto.**

## Reglas

Lo que nos separa de las webs genéricas hechas con IA. Cada regla pasa a comprobación en cuanto se rompa dos veces.

1. **Tema claro por defecto.** El oscuro existe y se cuida, pero el blanco es la mitad de la marca.
2. **Nada de resplandores, desenfoques ni degradados de fondo.** Ni `backdrop-filter`, ni resplandores (el antiguo
   `--brillo`; hoy `--tinte` es solo un plano de celeste translúcido), ni sombras difusas grandes. La profundidad se
   da con filetes y con planos de color.
3. **Esquinas rectas o con chaflán** (una esquina cortada a 45°), nunca redondeadas: casa con las letras cuadradas y
   con las etiquetas náuticas. Chaflán estándar: 14 px en fichas y botones, 28 px en bloques grandes.
4. **Líneas antes que sombras.** Borde de 1 px (`--filete`), filete de 2 px bajo cabeceras, filete discontinuo para
   separar metadatos. Una sola sombra permitida: la del panel desplegado sobre el contenido.
5. **Los datos, en monoespaciada y en mayúsculas pequeñas con tracking:** número de proyecto, estado, fechas,
   coordenadas, tipo. Lo que se lee de corrido va en la serif.
6. **El celeste en bloques.** Cabecera de portada, cabeceras de sección destacadas y el fondo de la ficha de proyecto
   cuando no hay captura: celeste hondo plano con isobatas en blanco al 20-50 %.
7. **La retícula se ve.** Fondo de papel con cuadrícula de 24 px muy tenue. Los márgenes y los tamaños se alinean a ella.
8. **Estructura con sentido:** la numeración («Nº 04») es el `orden` real del proyecto; las coordenadas son las de
   un sitio real (Santiago, 42°52′N 8°33′W). Nada numerado por adorno.
9. **Movimiento mínimo:** la curva y los 200 ms actuales se mantienen; solo desplazamiento de 2-3 px al pasar y
   cambios de color. Nada que se mueva solo, salvo la animación del flujo, con su reposo para `prefers-reduced-motion`.
10. **Contraste AA sobre el celeste:** sobre `--celeste-hondo` el texto va en blanco; sobre `--celeste` claro solo
    van etiquetas grandes o el granito.
11. **Los diagramas siguen la misma hoja** (`docs/diagramas/*.svg`, exportados con `scripts/diagramas-webp.mjs`): papel con
    retícula, cajas blancas con chaflán y filete, títulos en Big Shoulders Display, etiquetas en JetBrains Mono, solo
    colores de la paleta (celeste hondo, alga y tinta-2 para las categorías; celeste para lo que pasa, tinta para lo
    rechazado) y nada de degradados. Ningún número que cambie cada semana (la cifra de pruebas va en la ficha).

## Tokens

Los nombres actuales de `global.css` se conservan donde coinciden; los nuevos se añaden; `--brillo` pasó a ser
`--tinte` (un plano, no un resplandor) y `--sombra` queda solo para el panel.

| Token | Claro | Oscuro | Uso |
|---|---|---|---|
| `--celeste` | `#1aa6df` | `#1aa6df` | Marca, enlaces, estado «publicado» |
| `--celeste-hondo` | `#0072a8` | `#0b5e88` | Bloques grandes de color |
| `--papel` (`--fondo`) | `#fbfcfd` | `#0d171e` | Fondo de página |
| `--reticula` | `#e3edf3` | `#16242e` | Cuadrícula de 24 px |
| `--superficie` | `#ffffff` | `#111f29` | Fichas y paneles |
| `--filete` (`--borde`) | `#b9cbd6` | `#2b3d49` | Bordes y líneas |
| `--tinta` (`--texto`) | `#13212b` | `#e6eef3` | Texto; gris granito con sesgo azul |
| `--tinta-2` (`--texto-2`) | `#4a5c69` | `#9fb2bf` | Texto secundario y datos |
| `--alga` | `#5d7a6a` | `#8fb09e` | Acento secundario: «en desarrollo», avisos suaves |
| `--tinte` | celeste al 12 % | celeste al 18 % | Plano translúcido de celeste (fondos de hover y chips) |
| `--noche` | `#03090f` | igual | Fondo de los escenarios de imagen |
| `--velo` / `--velo-medio` / `--velo-denso` | tinta al 62 / 68 / 78 % | igual | Velo plano sobre fotos y botones sobre imagen |
| `--estado-publicado` / `--estado-desarrollo` | `--celeste` / alga aclarada | `--celeste-hondo` / alga oscurecida | Puntos de estado sobre la píldora de tinta; «en diseño» va hueco |
| `--peligro` / `--sobre-peligro` | `#a3135f` / `#ffffff` | `#f27ab0` / `#0d171e` | Fallo, rechazo o bloqueo (animaciones del flujo); siempre con ✗ y texto |
| `--peligro-tinte` | peligro al 10 % | peligro al 16 % | Fondo plano de una caja de fallo |
| `--ok-texto` | `#3f5a4b` | `#8fb09e` | Texto y ✓ de «hecho» sobre el papel |
| `--discord` | `#5865f2` | igual | Color de marca de Discord, solo en su botón |
| `--chaflan` / `--chaflan-grande` | `14px` / `28px` | igual | Esquina cortada |
| `--curva`, `--transicion`, escala `--z-*` | como ahora | | Sin cambios |

Chaflán en CSS: `clip-path: polygon(0 0, calc(100% - var(--chaflan)) 0, 100% var(--chaflan), 100% 100%, 0 100%)`.

### Tipografía

Tres papeles: **títulos** (condensada o cuadrada, mayúsculas, tracking corto), **texto** (serif sobria) y **datos**
(monoespaciada). Candidatas, todas con licencia OFL y paquete `@fontsource` (comprobado en npm el 2026-11-08):

| | Títulos | Texto | Datos |
|---|---|---|---|
| A | Barlow Condensed 600/700 | Source Serif 4 400/600 | IBM Plex Mono 400/500 |
| **B (elegida)** | Big Shoulders Display 700/800 | Literata 400/600 | JetBrains Mono 400/500 |
| C | IBM Plex Sans Condensed 500/700 | IBM Plex Serif 400/600 | IBM Plex Mono 400/500 |

Decisión de la persona: **B** (2026-11-08, «Tipografia b»); en el código, `--fuente-titulos`, `--fuente-texto` y
`--fuente-datos` de `src/estilos/global.css` (paquetes `@fontsource-variable/*`). Escala: texto 17 px / 1.6; datos 12 px con tracking `.04em`; h3 32 px, h2 36 px,
h1 `clamp(44px, 9vw, 96px)` con interlineado 1.02 (más apretado monta las cajas de color; visto en el prototipo).

## Recursos de imagen para el generador (Galivelop IG)

Se generan en local, así que la lista es larga a propósito; lo que manda es la calidad y que todo salga de la misma
familia. Mientras no existan, la web usa el sustituto de la columna «Hasta entonces». Cada recurso entregado se apunta
aquí con fecha y ruta.

### Dónde va cada recurso

Al recibir una imagen, se copia a su destino y se ejecuta la orden. Cada imagen del generador que entra en la web se nombra también en la ficha de Galivelop IG (`src/data/proyectos/galivelop-image-generator.json`, último párrafo de `descripcion`), que dice qué partes de la web salen de él (la persona, 2026-11-12). Los números son los de las tablas de abajo; los nombres de archivo que no fija otro sitio (`rosa-vientos.svg`, `sello.svg`, `gv-logo-negativo.svg`, los de `iconos/`) son la propuesta: se puede cambiar al recibirlos.

| # | Destino | Orden |
|---|---|---|
| 1 | `public/marca/gv-logo.svg` y `public/marca/gv-logo-512.png` (favicon 32 y `apple-touch-icon` 180 en `public/marca/`) | Vectorizar el PNG de 1024 px a SVG; exportar el PNG de 512 |
| 1b | `public/marca/gv-logo-negativo.svg` | Vectorizar |
| 2 | `public/marca/isobatas.svg` (sustituye a las provisionales de `scripts/isobatas-provisionales.py`) | Copiar; quitar o dejar de usar el script provisional |
| 3 | `public/marca/galivelop-portal.jpg` (1200×630, referenciada en `index.html`) | Copiar y comprobar la referencia de `og:image` |
| 4, 5 | `public/marca/rosa-vientos.svg`, `public/marca/sello.svg` | Vectorizar |
| 6 | `public/marca/portada-<estado>.webp`, una por estado | Convertir a WebP (1600×900); sin `-mini`: ninguna tarjeta la usa |
| 7, 8, 9 | `src/assets/iconos/<nombre>.svg`, pintados en línea por `IconoMarca.tsx` | Vectorizar la hoja y recortar cada icono; luego `node tools/marca/limpiar-iconos.cjs <icono.svg>...` (tinta a `currentColor`, recorte del `viewBox` y un contorno proporcional que acerca su grosor al de lucide a 24 px) y añadirlo a `ICONOS` de `IconoMarca.tsx` |
| 10, 11, 13, 16, 18, 19, 21, 22 | `public/marca/<nombre>.webp` (+ `-mini.webp`) | Convertir a WebP; el tema oscuro, aparte si va sobre papel |
| 12 | `public/marca/separador.webp` | Convertir a WebP con transparencia (`cwebp -q 90 -alpha_q 100`) |
| 17, 20 | `public/marca/<nombre>.svg` | Vectorizar |
| 15 | `public/proyectos/<slug>/proxima.webp` y su `imagen` en `src/data/proximamente.json` | Convertir a WebP (720×405) |
| 23 | `public/proyectos/<slug>/icono.png`, el `icono` de la ficha | Copiar a 512×512 |
| 24 | `tools/og/fuentes/<slug>/og-fuente.png` (fuera de `public/`, para que no salga en `dist/`) | `python3 tools/og/generar.py` genera el `og.jpg`; `src/data/og.test.ts` comprueba la huella |

La vista previa (`og`) de un proyecto es siempre `tools/og/fuentes/<slug>/og-fuente.png` + `python3 tools/og/generar.py`, nunca el `og.jpg` a mano.

### Entregados

| # | Fecha | Ruta | Dónde se ve |
|---|---|---|---|
| 10 | 2026-11-11 | `public/marca/como-funciona.webp` (1200×450) | Banda entre la entrada y el formulario de `/participa/unirse` |
| 13 | 2026-11-11 | `public/marca/cabecera-equipo.webp` (1600×500) | Arriba de `/equipo` (`/productos` ya redirige allí, ADR 0004) |
| 15 (voz) | 2026-11-11 | `public/proyectos/galivelop-voice-generator/proxima.webp` (720×405, recortado el margen de papel) | `imagen` de su entrada en `proximamente.json`; las entradas sin imagen muestran celeste plano con isobatas |
| 18 | 2026-11-11 | `public/marca/no-encontrado.webp` (900×600) | Página 404 (sustituye al monograma) |
| 19 | 2026-11-11 | `public/marca/enviado.webp` (480×360, el doble de lo que se muestra; barco de papel con mástil sobre papel, el que llegó para la 19) | «Mensaje preparado» de `/participa/proponer` y `/participa/unirse`. En 88354fb se cambió por un recorte del otro barco (el de mar con olas) y volvió el suyo el 2026-11-11 (la persona: son dos imágenes distintas) |
| 15 (Developer) | 2026-11-11 | `public/proyectos/galivelop-developer/proxima.webp` (720×405, del barco de papel sobre mar con olas, 1600×900, que llegó como `portada-desarrollo.webp`) | `imagen` de su entrada en `proximamente.json`. La persona (2026-11-11): ese barco es la portada de Developer; sustituye a la terminal con la rama y el anillo que pedía la hoja |
| 17 | 2026-11-11 | `public/marca/marco-retrato.webp` (400×400, máscara: blanco con transparencia, recortado al cuadro; del PNG q539, el trazador rompe sus marcas) | Alrededor de la foto o las iniciales en `/equipo` y en la página de cada miembro (`Retrato.tsx`); se pinta con `--texto`, así vale en los dos temas |
| 23 (workflow) | 2026-11-11 | `public/proyectos/galivelop-workflow/icono.svg` (SVG del generador, `viewBox` recortado al dibujo) | `icono` de su ficha: cabecera, tarjeta y muro |
| 7a, 8a, 8d, 9c | 2026-11-11 | `src/assets/iconos/codigo.svg`, `candado.svg`, `ramas-unidas.svg`, `terminal.svg` (SVG del generador pasados por `tools/marca/limpiar-iconos.cjs`) | Inicio, en lugar del icono de lucide (la persona, 2026-11-11: «aplícalos ya, aunque no estén todos»): 7a en la línea «Del prototipo al producto» (la hoja no le daba línea: es la que más se parece a una app; hay 5 líneas y la serie 7 es de 4), 8a en el valor 1, 8d en el valor 4 y 9c en la vía «Aprende con nosotros»; el resto de cada serie llegó el 2026-11-12 (filas siguientes). **7a, sin uso desde el 2026-11-12:** la 7b cuadrada ocupa su línea y `codigo.svg` se quitó de `src/assets/iconos/` (el original sigue en `src/img/`) |
| 6 | 2026-11-12 | `public/marca/portada-desarrollo.webp`, `portada-diseno.webp` y `portada-publicado.webp` (1600×900, `cwebp -q 80`). Los tres son un faro: en desarrollo, con andamios; en diseño, una plataforma de roca con un trípode; en publicado, el faro encendido de noche | Fondo velado de la cabecera de las fichas con `cabecera: "color"` (hoy Galivelop-workflow y Galivelop-image-generator), según el `estado` del proyecto (`Proyecto.tsx`, `.cabecera-velada`). Las tarjetas no la usan: esos proyectos llevan su propia portada. Sustituye al celeste con isobatas, que queda para un estado sin imagen |
| 12 | 2026-11-12 | `public/marca/separador.webp` (1200×100, de `12-separador-transparente.png`) | Inicio: antes de «Próximamente» (sección Proyectos) y antes de «Es para ti si…» (sección Participa), al ancho del contenedor; en el tema oscuro, invertido por CSS (`.separador`) |
| 7c, 7d, 7e | 2026-11-12 | `src/assets/iconos/documento-check.svg`, `compas.svg`, `mundos.svg` (pasados por `limpiar-iconos.cjs`) | Inicio, líneas de trabajo: «informacion» (documento con visto), «metodo» (compás) y «mundos»; «ia-local» sigue con lucide (`Cpu`) |
| 8b, 8c | 2026-11-12 | `src/assets/iconos/mira.svg`, `historial.svg` (la 8c, rehecha el mismo día con proporción casi cuadrada: la primera, tres nodos en vertical, se veía más fina que sus vecinas) | Inicio, valores 2 (mira) y 3 (historial) de «Cómo trabajamos» |
| 7b | 2026-11-12 | `src/assets/iconos/papel-ventana.svg` (rehecha cuadrada: la primera, hoja → flecha → ventana en fila, no cabía en el hueco) | Inicio, línea «Del prototipo al producto», en lugar de la 7a |
| 9a, 9b | 2026-11-12 | `src/assets/iconos/ramas.svg`, `bombilla.svg` | Inicio, «Participa»: la vía «Únete» (ramas) y la de «Propón» (bombilla) |
| 14 | 2026-11-12 | `src/assets/iconos/implantacion.svg` (salía de «sin uso»; caja cuya tapa se despliega en ventana) | Inicio, aviso «¿Tienes un proyecto propio?» (`proyecto-propio`), en lugar de `MessageSquare` |

Por CSS, sin imagen (cancelados en el generador, 2026-11-11): 11, 16, 20 y 21 (el pie, cerúleo liso); la 22 no sale de gimg y el fondo sigue en color plano. La 14 se rehízo y llegó el 2026-11-12.

Las imágenes llegan a `src/img/` (fuera de git) y se convierten aquí con `cwebp -q 80`. Las de papel (10, 18) aún no
tienen versión para el tema oscuro: se muestran enmarcadas tal cual.

### Cómo pedirlas

La fuente de cómo se piden es la hoja del Portal en el generador (`galivelop-image-generator`,
`docs/marcas/portal/hoja.md`, «Identidad vigente», y los pedidos de `examples/portal/orders/marca/`); lo de aquí es su
resumen, puesto al día el 2026-11-11 con esa hoja (`db9c364`). Si las dos dicen cosas distintas, se apunta en «Dudas»
y decide la persona.

- **El mar pone el dónde, la tecnología pone el qué** (la persona, 2026-11-11). El mar y la costa gallega se quedan
  como fondo, color y textura (isobatas, carta náutica, papel, cerúleo); lo que se dibuja como motivo es de software
  (ventana de editor, terminal, ramas, historial de commits, retícula, placa de circuito). Anclas, barcos, faros, remos,
  boyas, grúas, sextantes y nudos dejan de ser protagonistas. Excepciones: los barcos de papel de la 19 y de la 15 de Developer (la persona, 2026-11-11). La rosa de
  los vientos (4) es instrumento de carta y se queda.
- **Dos registros de dibujo:**
  - **Grabado a dos tintas** para las ilustraciones grandes (3, 6, 10, 11, 13, 15-21): mucho detalle, tramas finas y
    líneas de varios grosores, con el mar de líneas de ola y batimetría (aprobado por la persona en la 6, q310 y q311).
  - **Línea simple** para iconos y pictogramas (1, 1b, 4, 5, 7, 8, 9, 12, 14, 23): un solo grosor de trazo, sin trama
    ni relleno, legible a 24 px, una sola tinta; se vectorizan a SVG y se colorean con `currentColor`.
- **Sin texto** en ninguna imagen: el texto lo pone la web en los tres idiomas. Tampoco banderas, cruces de Santiago,
  personas, manos, robots, cerebros, cohetes, gráficas de crecimiento ni lugares reales reconocibles.
- **Cuatro tintas:** cerúleo `#0072a8` (en el prompt, «medium cerulean ocean blue»: «sky blue» da `#1aa6df`), papel
  `#fbfcfd`, gris tinta `#13212b` y un toque de verde alga `#5d7a6a`. Los grabados admiten tonos del cerúleo; los
  iconos, una sola tinta. Ningún nombre de color fuera de las tintas, ni como adjetivo («golden», «white»).
- **Zonas limpias:** el hueco para el texto de la web (o el centro de un marco) se describe en positivo y al principio
  («the lower third of the sheet is plain flat off-white paper, open and unmarked») y la trama se confina al resto;
  «filling the whole sheet to every edge» solo en piezas sin zona (18, 21).
- **Sin recuentos exactos:** el modelo no los cumple («exactly four nodes» dio siete). Si el número es el significado
  (los seis gajos de Tarkor, las ocho puntas de la rosa), el número se fija al vectorizar.
- **A sangre:** sin marco ni banda blanca; el chaflán del logo lo pone el SVG, no el modelo. El único marco permitido
  es el que es la pieza (17).
- **Transparencia:** el generador no la da. Lo que se recorta (logo, sello, rosa, marcos, iconos) se genera sobre croma
  plano `#00ff00` (`#ff00ff` si lleva verde alga) y se recorta y vectoriza en el generador (`gimg brand`); llega como
  `-alpha.png` y `.svg`.
- **Versión oscura:** líneas `#e6eef3` sobre `#0d171e`, cerúleo y alga iguales. Iconos y logos, por CSS
  (`currentColor`; el 1b es el 1 en negativo); los grabados, una segunda generación con la misma semilla y las tintas
  cambiadas (ver «Dudas», 3).
- **Formatos:** ilustraciones en WebP (`cwebp -q 80`), grande + `-mini` como en
  [`desarrollo.md`](desarrollo.md#añadir-o-actualizar-un-proyecto); iconos y marcos en SVG.
- **Pedir en serie:** los iconos como hoja de contactos (sobre papel, para revisar juntos), las portadas por estado con
  la misma semilla, y 2-4 candidatas por pedido para elegir.
- **Qué no pedir:** fotos del equipo (son reales), capturas o ilustraciones de un proyecto (viven en su repo y entran
  por su ficha), nada con degradado, resplandor o esquina redonda.

**Modelo:** `zimage-turbo-q6`, 8 pasos, cfg 1.0, euler. FLUX (`flux2-klein-4b-q8`) solo para bocetos (los del logo, la
rosa y el sello: q133, q142, q146); Qwen-Image solo para fotorrealismo, que el portal no usa. Con cfg 1.0 **no hay
prompt negativo**: las negaciones van en el cierre del propio prompt, y solo para cualidades globales (brillo, texto,
marco); lo que no se quiere en el sujeto no se nombra, se describe lo que sí.

**Orden del prompt** (120-200 palabras): sujeto con el motivo de software → zona limpia, si la hay → bloque del
registro → cierre → frase de paleta.

**Bloque de grabado:**
> Richly detailed engraved antique nautical chart style, like a fine sea chart printed in two inks: many layers of fine
> lines and hatching, line density increasing in the darker areas to give depth and tone, lines of several weights,
> crisp and sharp, intricate but calm, premium print quality, high detail, elegant.

**Bloque de línea simple:**
> Simple line icon style: one uniform stroke width, rounded caps and joins, no shading, no hatching, no fill, no
> texture, bold and clear enough to read at 24 pixels, generous empty margin around each icon, a single ink colour.

**Cierre:**
> No photographic rendering, no glow, no text, no letters, no numbers, no watermark, full-bleed edge to edge, no border,
> no frame.

**Frase de paleta (siempre la última):**
> Palette strictly limited to medium cerulean ocean blue #0072a8, off-white #fbfcfd, ink grey #13212b and a touch of
> seaweed green #5d7a6a.

**Perfiles del generador** (generado → entregado): `cuadrado` 1024² (iconos, logo), `icono` 1024 → 512, `fondo`
1024 → 1200, `social` 1344×704 → 1200×630, `portada` 1344×768 → 1600×900, `tarjeta` 1344×768 → 1200×675, `cabecera`
1664×512 → 1600×500, `muro` 1792×448 → 1600×400; el patrón del pie (21), repetible en los dos ejes.

**Dudas que decide la persona** (del generador, 2026-11-11; recomendación del generador entre paréntesis):

1. **Dos registros.** El grabado a dos tintas de las piezas grandes sustituye al «trazo blanco plano» que pedía esta
   hoja hasta hoy (mantener el grabado en las grandes y la línea simple en los iconos; es lo que ya recoge esta hoja).
2. **Acentos de producto.** En imagen generada, solo las cuatro tintas del portal; el acento de cada producto, solo en
   su logo, su interfaz y su `og` (24), en el lugar del verde alga.
3. **Versión oscura de los grabados.** Generar solo las que la web muestra a sangre en el tema oscuro (11, 16, 18, 19);
   la 10 y el 1b, por CSS.
4. ~~**El engranaje de la tarjeta de Developer (15).**~~ Resuelta (2026-11-11): la persona le da el barco de papel
   sobre mar con olas (ver § Entregados).

### A. Marca (prioridad 1)

El motivo de cada recurso es el del pedido del generador (`examples/portal/orders/marca/<n>-*.json`), que lleva el prompt
entero; aquí va resumido.

| # | Recurso | Medidas y forma | Dónde va | Hasta entonces | Motivo (registro) |
|---|---|---|---|---|---|
| 1 | **Logo** | Cuadrado; fondo cerúleo plano con chaflán de 28/128 en la esquina superior derecha (lo pone el SVG); monograma GV, trazo 12/128. Entregas: SVG, 512 PNG, favicon 32 y `apple-touch-icon` 180 | `public/marca/gv-logo.svg`, cabecera, favicon | Logo actual (prototipo) | Las letras G y V unidas por un trazo horizontal compartido, geométrico, sobre croma (línea simple) |
| 1b | **Logo en negativo** | El 1 en negativo, por CSS o SVG | Pie de página, tema oscuro, sellos | Ninguno | No se genera: sale del 1 |
| 2 | **Isobatas de la costa gallega** | SVG 2400×1200, solo líneas, 12-16 niveles, cada quinta más gruesa | Fondo del bloque de portada, fichas sin captura, pie | Isobatas provisionales (`scripts/isobatas-provisionales.py`) | **No es del generador:** datos EMODnet DTM (CC BY 4.0) + `gdal_contour` (`investigacion/estilo-marca.md` §4) |
| 3 | **Portada social del portal** (`og:image`) | 1200×630 (perfil `social`), centro limpio | `index.html` y sus `og-gl`/`og-en` | La actual | Carta batimétrica de la costa atlántica gallega con una rosa de los vientos pequeña en una esquina y el centro abierto (grabado) |
| 4 | **Rosa de los vientos** | SVG 256×256, ocho puntas (se fijan al vectorizar) | Pie de página, marca de agua del muro | Nada | Rosa de los vientos de trazo fino, sobre croma (línea simple) |
| 5 | **Sello del taller** | SVG 320×320, dos anillos con marcas de grados y el monograma en el centro, sin texto | Junto a «Cómo trabajamos», pie | Nada | Sello técnico redondo con marcas de grados, sobre croma (línea simple) |

### B. Portada y secciones (prioridad 2)

| # | Recurso | Medidas y forma | Dónde va | Hasta entonces | Motivo (registro) |
|---|---|---|---|---|---|
| 6 | **Portada de proyecto por estado** (3) | 1600×900 y `-mini` 720×405 (perfil `portada`) | Fichas y tarjetas con `cabecera: "color"` o sin imagen | Celeste plano con isobatas | Ventana de editor de código sobre el mar de la carta, a la izquierda, con el agua abierta a la derecha. «desarrollo»: código a medias y cursor; «diseno»: retícula y guías de maquetación; «publicado»: código acabado y una marca de visto en un círculo (grabado) |
| 7 | **Iconos de las 4 líneas de trabajo** | Hoja de contactos 2×2 (perfil `cuadrado`), luego SVG | Inicio, «Líneas de trabajo» (`lineas.ts`) | Iconos actuales de `Inicio.tsx` | Ventana de app con corchetes angulares · lupa sobre una lista con marca de visto · hoja de papel que se vuelve ventana · compás de dibujo sobre una retícula (línea simple) |
| 8 | **Iconos de los 4 valores** («Cómo trabajamos») | Igual que 7 | Inicio, `PRINCIPIOS` | Iconos actuales | Candado abierto · punto de mira en el borde de una retícula que sigue en puntos · historial de commits con nodos · dos ramas que se unen (línea simple) |
| 9 | **Iconos de las 3 vías de participación** | Hoja de contactos 1×3 | Inicio «Participa», `/unirse`, `/proponer` | Sin icono | Dos ramas que confluyen · bombilla dentro de una ventana · terminal con galón y cursor (línea simple) |
| 10 | **Ilustración «Cómo funciona»** | 1200×450 sobre papel | Banda de `/participa/unirse` | Lista sin imagen | Línea de historial de commits con unos pocos nodos sobre la carta (grabado). **Entregada** |
| 11 | **Fondo de «Es para ti si…»** | 1200×1200 sobre papel (perfil `fondo`), muy tenue (al 30 %) | Detrás de la lista de `/unirse` | Papel liso | Costa de una ría con sondas y curvas de nivel, muy tenue (grabado) |
| 12 | **Separador de sección** | 1200×100 sobre transparencia (WebP) | Entre bloques largos de la portada | Filete 1 px | Filete fino con puntos en los extremos y una rosa de ocho puntas grabada en el centro (la persona, 2026-11-12: «me gusta más la idea del que te pasé»; sustituye a la línea que se vuelve costa). **Entregada** |

### C. Páginas interiores (prioridad 3)

| # | Recurso | Medidas y forma | Dónde va | Hasta entonces | Motivo (registro) |
|---|---|---|---|---|---|
| 13 | **Cabecera de `/equipo`** (era la de Productos, que ya no tiene página: ADR 0004) | 1600×500 sobre cerúleo (perfil `cabecera`) | Arriba de `/equipo` | Bloque celeste con isobatas | Pistas de placa de circuito dibujadas como curvas de nivel (grabado). **Entregada** |
| 14 | **Icono «implantación y servicio»** | SVG, `src/assets/iconos/implantacion.svg` | Aviso «¿Tienes un proyecto propio?» del inicio (ya no hay tarjetas de producto, ADR 0004) | `MessageSquare` de lucide | Caja cuya tapa se despliega en ventana (línea simple). **Entregada** |
| 15 | **Tarjetas «Próximamente»** (2) | 1200×675 y `-mini` (perfil `tarjeta`), tercio inferior limpio | `TarjetaProxima` (Voice Generator y Developer) | Celeste plano con isobatas | Voz: onda de sonido como perfil del fondo marino (**entregada**); Developer: barco de papel sobre el mar con olas (**entregada**, la persona, 2026-11-11; antes, terminal con la rama que vuelve por un anillo) |
| 16 | **Cabecera del Muro** | 1600×400 sobre papel (perfil `muro`) | Arriba de `/muro` | Sin cabecera | Tablero de tareas de tres columnas con tarjetas en blanco (grabado) |
| 17 | **Marco de retrato del equipo** | SVG 400×400; la foto va dentro | `/equipo` y página de cada miembro | Borde 1 px | Marco con marcas de grados y chaflán, centro limpio, sobre croma (grabado) |
| 18 | **Ilustración de la página 404** | 900×600 sobre papel | `NoEncontrado.tsx` | Solo texto | Ruta discontinua que acaba en un eslabón roto que se enrosca como un signo de interrogación (grabado). **Entregada** |
| 19 | **Estado «enviado» de los formularios** | 480×360 sobre papel | `form.listo` en `/proponer` y `/unirse` | Solo texto | Barco de papel que sale del muelle (grabado; excepción náutica, como la 15 de Developer). **Entregada** |
| 20 | **Cabecera de páginas legales** | SVG 1200×80 sobre papel | `/aviso-legal`, `/privacidad`, `/terminos` | Nada | Borde de cajetín de plano con reglas interiores y marcas de esquina (grabado) |
| 21 | **Patrón de fondo del pie** | 1200×300 repetible en los dos ejes, cerúleo | `Pie.tsx` | Celeste plano | Curvas de nivel sin costuras sobre cerúleo (grabado) |
| 22 | **Textura de papel** (opcional) | 512×512 repetible, grano casi invisible | Fondo de página bajo la retícula | Color plano | Grano de papel finísimo, casi blanco (sin pedido aún) |

### D. Por proyecto (cuando se toque su ficha)

| # | Recurso | Medidas y forma | Dónde va | Hasta entonces | Motivo (registro) |
|---|---|---|---|---|---|
| 23 | **Icono de proyecto** para los que no tienen (Tarkor, Galivelop-workflow) | 512×512 (perfil `icono`), cuadrado con chaflán | `icono` de la ficha, `MenuProyectos` | Inicial del nombre | Tarkor: anillo tallado con cuatro puntas y una piedra partida en seis gajos (el seis se fija al vectorizar) · Workflow: tres nodos encadenados, el último con marca de visto (línea simple) |
| 24 | **`og.jpg` por proyecto** en el mismo estilo | 1200×630, tercio izquierdo con hueco para el icono | `tools/og/fuentes/<slug>/og-fuente.png` | Los actuales | Como la 3 con el motivo del proyecto; el acento del producto, en el lugar del verde alga (ver «Dudas», 2) |

Orden de trabajo: lo que más se ve primero: 7-9 (iconos de la portada), 6 «diseno» y «publicado», la 15 de Developer y
las versiones oscuras; luego A y el resto de C según se vaya aplicando la hoja.

## Pasos para aplicarlo

1. Elegir la tipografía (persona). Instalar los tres paquetes `@fontsource` y quitar Inter y Sora.
2. Reescribir `:root` de `global.css` con los tokens de arriba y el claro por defecto; sustituir `border-radius` por
   chaflán donde proceda; retirar los resplandores, degradados y `backdrop-filter`.
3. Generar las isobatas reales (recurso 2) y el logo (recurso 1).
4. Revisar en móvil y escritorio, con capturas antes/después; `npm run check` y `npm run build`.
5. Cambio grande: fase 1 (`/code-review`), fase 2 (`gw-opt-tokens`, `retro`, `gw-seo` por la `og:image`) y fase 3 antes
   de que la tarea semanal lo publique.
