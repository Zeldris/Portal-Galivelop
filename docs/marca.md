# Marca Galivelop: hoja de estilos

**Estado:** aprobada por la persona y aplicada a la web (2026-11-08, tipografía B); los recursos de imagen, al día con
la hoja del generador (2026-11-11), y puesta al día con su entrega del 2026-11-12 (`2a9af6f`, rama `hojas-repos`). Prototipo: https://claude.ai/artifact/UoLydvcktgu8jYwioKbygq. Referencias y fuentes:
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
   con las etiquetas náuticas. Chaflán estándar: 14 px en fichas, 10 px en botones (`--chaflan-pequeno`) y 28 px en bloques grandes.
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
10. **Contraste AA sobre el celeste:** sobre `--celeste-hondo` el texto va en blanco; sobre `--celeste` solo va la
    tinta (5,91:1; el blanco encima da 2,78:1, por debajo del 3:1 del texto grande; hoja del generador, 2026-11-12).
11. **Los diagramas siguen la misma hoja** (`docs/diagramas/*.svg`, exportados con `scripts/diagramas-webp.mjs`): papel con
    retícula, cajas blancas con chaflán y filete, títulos en Big Shoulders Display, etiquetas en JetBrains Mono, solo
    colores de la paleta (celeste hondo, alga y tinta-2 para las categorías; celeste para lo que pasa, tinta para lo
    rechazado) y nada de degradados. Ningún número que cambie cada semana (la cifra de pruebas va en la ficha).

## Alcance

**Toda la web va con esta hoja** (la persona, 2026-11-12): inicio, equipo, perfiles, muro, novedades, legales,
formularios, avisos, estados vacíos y de error, y **también la página de cada proyecto** (Tarkor, toVeriAI y los
`galivelop-*`). Una imagen que no casa con los tokens no se pone: se pide otra.

**Única excepción: lo que enseña cada proyecto** dentro de su página (galerías, capturas, vídeos, su propio arte), dentro
de su contenedor y con `/* marca: permitido, contenido del proyecto */` en el CSS. El marco que lo rodea (cabecera,
menús, fichas, textos, botones, pie, iconos, estados, separadores) sigue esta hoja.

**Cómo se comprueba:** `src/estilos/marca.test.ts` recorre todas las hojas `.css` de `src/`: reglas 2 y 3 (sin
desenfoques, degradados, sombras difusas ni esquinas redondeadas) y colores solo de los tokens (fuera de una
definición `--token:`, solo blanco, negro y la noche con transparencia).

### Acento de cada proyecto

Del proyecto, en el marco, solo entra **su acento, donde el Portal usa el alga**: nunca su paleta entera (hoja del
generador, «Familia Galivelop», decisiones 1-3, 2026-11-12). El hex de la ficha (`acento`) es el **vivo**; el **hondo**
(tema claro) y la **variante oscura** se calculan en OKLCH, no a ojo: con el tono y el croma fijos, se baja (o sube) la
luminosidad en pasos de 0,005 hasta el primer hex con 4,5:1 sobre el papel (`#fbfcfd` o `#0d171e`); si el vivo ya
cumple, se queda. Lo hace `src/data/tonos.ts` (`estiloAcento`, con su test, que da los hex de las hojas de producto:
voice `#D9467A` → hondo `#ce3c71`, oscura `#db487b`; developer `#0E9A93` → hondo `#16827c`).

- El **vivo** (`--acento-proyecto`): filetes, bordes al pasar, puntos, barras de progreso y tinte al 14-16 %.
- El **texto de acento** e iconos (`--acento-texto`): el hondo en claro, la variante oscura en oscuro.
- Los **bloques con texto blanco** (`--acento-bloque`: pestaña activa del índice de la ficha, grupo de galería
  elegido): el hondo, en los dos temas.
- Sin proyecto, `--acento-texto` es `--enlace` y `--acento-bloque` es `--celeste-hondo`.

Acentos de producto (`src/data/productos/*.json`, la persona, 2026-11-12): workflow manda `#3D6FD9` (el de su ficha de
proyecto; el `#1AA6DF` era el celeste del Portal) y voice pasa a `#D9467A` (también en `proximamente.json`).

## Tokens

Los nombres actuales de `global.css` se conservan donde coinciden; los nuevos se añaden; `--brillo` pasó a ser
`--tinte` (un plano, no un resplandor) y `--sombra` queda solo para el panel.

| Token | Claro | Oscuro | Uso |
|---|---|---|---|
| `--celeste` | `#1aa6df` | `#1aa6df` | Marca, foco, estado «publicado»; nunca texto sobre papel claro ni con blanco encima |
| `--celeste-hondo` | `#0072a8` | `#0b5e88` | Bloques grandes de color |
| `--papel` (`--fondo`) | `#fbfcfd` | `#0d171e` | Fondo de página |
| `--fondo-alterno` | `#f1f6f9` | `#111f29` | Bandas alternas de página |
| `--reticula` | `#e3edf3` | `#16242e` | Cuadrícula de 24 px |
| `--superficie` | `#ffffff` | `#111f29` | Fichas y paneles |
| `--superficie-2` | `#f1f6f9` | `#16242e` | Superficie en segundo plano (dentro de una ficha) |
| `--filete` (`--borde`) | `#b9cbd6` | `#2b3d49` | Bordes y líneas |
| `--tinta` (`--texto`) | `#13212b` | `#e6eef3` | Texto; gris granito con sesgo azul |
| `--tinta-2` (`--texto-2`) | `#4a5c69` | `#9fb2bf` | Texto secundario y datos |
| `--texto-3` | `#5a6d7a` | `#7d919e` | Texto terciario (5,24:1 y 5,54:1) |
| `--enlace` | `--celeste-hondo` | `#5cc8f2` | Enlaces y texto de acento sin proyecto |
| `--alga` | `#5d7a6a` | `#8fb09e` | Acento secundario: «en desarrollo», avisos suaves |
| `--tinte` | celeste al 12 % | celeste al 18 % | Plano translúcido de celeste (fondos de hover y chips) |
| `--noche` | `#03090f` | igual | Fondo de los escenarios de imagen |
| `--velo` / `--velo-medio` / `--velo-denso` | tinta al 62 / 68 / 78 % | igual | Velo plano sobre fotos y botones sobre imagen |
| `--estado-publicado` / `--estado-desarrollo` | `--celeste` / alga aclarada | `--celeste-hondo` / alga oscurecida | Puntos de estado sobre la píldora de tinta; «en diseño» va hueco |
| `--peligro` / `--sobre-peligro` | `#a3135f` / `#ffffff` | `#f27ab0` / `#0d171e` | Fallo, rechazo o bloqueo (animaciones del flujo); siempre con ✗ y texto |
| `--peligro-tinte` | peligro al 10 % | peligro al 16 % | Fondo plano de una caja de fallo |
| `--ok-texto` | `#3f5a4b` | `#8fb09e` | Texto y ✓ de «hecho» sobre el papel |
| `--discord` | `#5865f2` | igual | Color de marca de Discord, solo en su botón |
| `--chaflan` / `--chaflan-grande` / `--chaflan-pequeno` | `14px` / `28px` / `10px` | igual | Esquina cortada: fichas / bloques grandes / botones |
| `--reticula-paso` | `24px` | igual | Paso de la cuadrícula |
| `--datos` / `--datos-espaciado` | JetBrains Mono 500 a 12 px / `0.06em` | igual | Tipografía de los datos y su tracking |
| `--sombra` | `0 12px 32px -18px` tinta al 35 % | negro al 70 % | La única sombra: el panel desplegado |
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
`--fuente-datos` de `src/estilos/global.css` (paquetes `@fontsource-variable/*`). Escala: texto 17 px / 1.6; datos 12 px con tracking `.06em` (`--datos-espaciado`; manda el código); h3 32 px, h2 36 px,
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
| 31, 32 | `public/proyectos/<slug>/portada.webp` y `portada-mini.webp`, la `portada` de la ficha (y de su tarjeta); la imagen que había pasa a la galería | Convertir a WebP (1600×900 y 720×405) y poner `ancho`, `alto` y `alt` en los tres idiomas |
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
| 7a, 8a, 8d, 9c | 2026-11-11 | `src/assets/iconos/codigo.svg`, `candado.svg`, `ramas-unidas.svg`, `terminal.svg` (SVG del generador pasados por `tools/marca/limpiar-iconos.cjs`) | Inicio, en lugar del icono de lucide (la persona, 2026-11-11: «aplícalos ya, aunque no estén todos»): 7a en la línea «Del prototipo al producto» (la hoja no le daba línea: es la que más se parece a una app; hay 5 líneas y la serie 7 es de 4), 8a en el valor 1, 8d en el valor 4 y 9c en la vía «Aprende con nosotros»; el resto de cada serie llegó el 2026-11-12 (filas siguientes). **7a, sin uso desde el 2026-11-12:** la 7b cuadrada ocupa su línea y `codigo.svg` se quitó de `src/assets/iconos/` (el original sigue en `src/img/portal/svg/`); vuelve el mismo día en «ia-local» (fila «7a (vuelve)») |
| 6 | 2026-11-12 | `public/marca/portada-desarrollo.webp`, `portada-diseno.webp` y `portada-publicado.webp` (1600×900, `cwebp -q 80`). Los tres son un faro: en desarrollo, con andamios; en diseño, una plataforma de roca con un trípode; en publicado, el faro encendido de noche | Fondo velado de la cabecera de las fichas con `cabecera: "color"` (hoy Galivelop-workflow y Galivelop-image-generator), según el `estado` del proyecto (`PORTADA_ESTADO` de `src/data/marca.ts`, con su test; `.cabecera-velada`). Las tarjetas no la usan: esos proyectos llevan su propia portada. Sustituye al celeste con isobatas, que queda solo para `cabecera: "captura"`. **Faro, fuera de la regla «el mar pone el dónde»:** el generador entregó faros en vez de la ventana de editor pedida; **provisionales** (la persona, 2026-11-12: «por ahora publicamos lo que tenemos y le pido la corrección al generador»); se pidieron rehechas como en la fila 6 de la tabla B (faro en obra, boya y barco de papel); llegaron el mismo día (fila «6 (rehechas)») |
| 12 | 2026-11-12 | `public/marca/separador.webp` (1200×100, de `12-separador-transparente.png`) | Inicio: antes de «Próximamente» (sección Proyectos) y antes de «Es para ti si…» (sección Participa), al ancho del contenedor; en el tema oscuro, invertido por CSS (`.separador`) |
| 7c, 7d, 7e | 2026-11-12 | `src/assets/iconos/documento-check.svg`, `compas.svg`, `mundos.svg` (pasados por `limpiar-iconos.cjs`) | Inicio, líneas de trabajo: «informacion» (documento con visto), «metodo» (compás) y «mundos» |
| 8d (rehecha) | 2026-11-12 | `src/assets/iconos/ramas-unidas.svg` (la 8d de la víspera se sustituye por una más ancha, dos ramas que se unen en un nodo: la anterior se veía más fina que sus vecinas) | Inicio, valor 4 de «Cómo trabajamos» |
| 8b, 8c | 2026-11-12 | `src/assets/iconos/mira.svg`, `historial.svg` (la 8c, rehecha el mismo día con proporción casi cuadrada: la primera, tres nodos en vertical, se veía más fina que sus vecinas) | Inicio, valores 2 (mira) y 3 (historial) de «Cómo trabajamos» |
| 7b | 2026-11-12 | `src/assets/iconos/papel-ventana.svg` (rehecha cuadrada: la primera, hoja → flecha → ventana en fila, no cabía en el hueco) | Inicio, línea «Del prototipo al producto», en lugar de la 7a |
| 7a (vuelve) | 2026-11-12 | `src/assets/iconos/codigo.svg` (recuperado de d3cf1c8^) | Inicio, línea «ia-local», en lugar de `Cpu` de lucide: una serie se usa entera (hoja del generador). La hoja pedía la 7b, pero esta ya ocupa «Del prototipo al producto»; la 7a, sin uso, completa la serie sin repetir |
| 9a, 9b | 2026-11-12 | `src/assets/iconos/ramas.svg`, `bombilla.svg` | Inicio, «Participa»: la vía «Únete» (ramas) y la de «Propón» (bombilla) |
| 14 | 2026-11-12 | `src/assets/iconos/implantacion.svg` (salía de «sin uso»; caja cuya tapa se despliega en ventana) | Inicio, aviso «¿Tienes un proyecto propio?» (`proyecto-propio`), en lugar de `MessageSquare` |
| 6 (rehechas) | 2026-11-12 | `public/marca/portada-desarrollo.webp`, `portada-diseno.webp` y `portada-publicado.webp` (1600×900, `cwebp -q 80`): faro en obra con andamios (desarrollo), boya con su fondeo (diseño) y barco de papel con banderín alga (publicado) | Las mismas cabeceras veladas de la fila 6; sustituyen a los tres faros provisionales (los originales, en `src/img/portal/sin-uso/`) |
| 27 | 2026-11-12 | `public/marca/estado-vacio.webp` (480×360, se muestra a 240) | Aviso vacío del muro y de novedades (`AvisoVacio.tsx`), en lugar de las isobatas tenues de `.vacio-carta` |
| 28 | 2026-11-12 | `public/marca/aviso-error.webp` (480×360, se muestra a 240) | `AvisoError.tsx` (fallo de carga de la ficha o de una página), en lugar del monograma |
| 25 | 2026-11-13 | `src/assets/iconos/resumen.svg`, `galeria.svg`, `a-fondo.svg`, `como-esta-hecho.svg` y `avance.svg` (pasados por `limpiar-iconos.cjs`) | Ficha de proyecto: título de cada grupo (en el color del acento) y su enlace del índice (`ICONO_GRUPO` de `Proyecto.tsx`) |
| 26 | 2026-11-13 | `src/assets/iconos/hito-hecho.svg`, `hito-curso.svg` y `hito-pendiente.svg` (pasados por `limpiar-iconos.cjs`; los PNG de 64 px, con papel crema, no se usan) | Hitos de «Avance» (`ICONO_HITO`), en lugar de `Check`, `LoaderCircle` y `CircleDashed` de lucide dentro de un cuadro: el aro, del color del estado. 26a y 26b rehechas (2026-11-13): el aro de 26c con un visto del mismo grosor y con tres puntos macizos; el generador las entrega en dos capas (aro y `<svg>` anidado) que se juntan en un trazado antes de `limpiar-iconos.cjs` |
| 29 | 2026-11-13 | `public/marca/banda-participar.webp` (1600×400) y `-mini.webp` (800), con el papel crema blanqueado al convertir (`ffmpeg colorlevels`) para que case con `--superficie` | Fondo del aviso «¿Quieres participar?» de la ficha (`.participar-banda`), **solo en el tema claro**: en escritorio, a 4:1 con el texto en la mitad izquierda; en el móvil, encima del texto (120 px, recorta papel de la izquierda). En el oscuro, su versión `banda-participar-oscura.webp` (y `-mini`), con el fondo noche subido a `--superficie` (#111f29) con `ffmpeg colorlevels=romin=0.0165:gomin=0.0427:bomin=0.0614` para que no se vea el recuadro (la persona, 2026-11-13). Solo con la colaboración abierta; hasta 900 px, encima del texto |
| 30 | 2026-11-13 | `public/marca/cabecera-novedades.webp` (1600×400) y `-mini.webp` (800) | Arriba de `/novedades`, como la del equipo (clase común `.banda-cabecera`) |
| 4, 5 | 2026-11-13 | `public/marca/rosa-vientos.webp` y `sello.webp` (rosa a 280 px y sello a 144 px, con transparencia; no son los `.svg` que proponía la tabla de arriba) | Rosa: marca de agua al 12 % en la esquina inferior derecha del pie (`.pie-rosa`). Sello (05b con el monograma GV, 2026-11-13, de su SVG de una tinta a 144 px con transparencia): a 72 px junto a «Galicia + Develop» de «Cómo trabajamos» del inicio (`.sobre-sello`). En el tema oscuro, en negativo por CSS. Sitios elegidos por la persona (2026-11-13: «me vale»). **Provisional la rosa:** el generador la rechazó y la dibujará geométrica |
| 4 (geométrica) | 2026-11-13 | `public/marca/rosa-vientos.webp` (280 px, `cwebp -q 90 -alpha_q 100`, desde `04b-rosa-vientos.png`, 1024 px con transparencia; dibujada por código con `gimg brand rose`, ocho puntas, un solo grosor) | El mismo sitio que la fila anterior (`.pie-rosa`); sustituye a la rosa provisional |

Por CSS, sin imagen (cancelados en el generador, 2026-11-11): 11, 16, 20 y 21 (el pie, cerúleo liso); la 22 no sale de gimg y el fondo sigue en color plano. La 14 se rehízo y llegó el 2026-11-12.

Las imágenes llegan a `src/img/<slug>/` (fuera de git; `portal` para las de la marca), con sus SVG en `svg/` y lo descartado en `sin-uso/`, y se convierten aquí con `cwebp -q 80`. **En espera, serie incompleta** (una serie se usa entera): 25a, 25b, 25c y 25e (falta 25d, «Cómo está hecho») y 26a (faltan 26b y 26c; el visto de la 26a es más grueso que su círculo, pedir un solo grosor). Las de papel (10, 18) aún no
tienen versión para el tema oscuro: se muestran enmarcadas tal cual. Las versiones oscuras de 10, 18, 19, 27 y 28 están
en cola en el generador: fondo transparente o sobre el `--celeste-hondo` oscuro (`#0b5e88`), nunca sobre el papel claro.

### Cómo pedirlas

La fuente de cómo se piden es la hoja del Portal en el generador (`galivelop-image-generator`,
`docs/marcas/portal/hoja.md`, «Identidad vigente», y los pedidos de `examples/portal/orders/marca/`); lo de aquí es su
resumen, puesto al día el 2026-11-12 con esa hoja (`2a9af6f`, rama `hojas-repos`) y el 2026-11-13 con su cambio de
«Zonas limpias», «Motivo» y la plantilla del prompt de mar (tras las 31 y 32 fallidas). Si las dos dicen cosas distintas, se apunta en «Dudas»
y decide la persona.

- **El mar pone el dónde, la tecnología pone el qué** (la persona, 2026-11-11). El mar y la costa gallega se quedan
  como fondo, color y textura (isobatas, carta náutica, papel, cerúleo); lo que se dibuja como motivo es de software
  (ventana de editor, terminal, ramas, historial de commits, retícula, placa de circuito). Anclas, barcos, faros, remos,
  boyas, grúas, sextantes y nudos dejan de ser protagonistas. Excepciones: los barcos de papel de la 19 y de la 15 de Developer (la persona, 2026-11-11) y las tres portadas 6, un motivo por estado: faro en obra, boya y barco de papel (la persona, 2026-11-12: «1 barco, 1 faro, uno de cada cosa»). La rosa de
  los vientos (4) es instrumento de carta y se queda.
- **Dos registros de dibujo:**
  - **Grabado a dos tintas** para las ilustraciones grandes (3, 6, 10, 11, 13, 15-21, 27-32): mucho detalle, tramas finas y
    líneas de varios grosores, con el mar de líneas de ola y batimetría (aprobado por la persona en la 6, q310 y q311).
  - **Línea simple** para iconos y pictogramas (1, 1b, 4, 5, 7, 8, 9, 14, 23; el separador 12, filete simple con una rosa grabada, a petición de la persona): un solo grosor de trazo, sin trama
    ni relleno, legible a 24 px, una sola tinta; se vectorizan a SVG y se colorean con `currentColor`.
- **Sin texto** en ninguna imagen: el texto lo pone la web en los tres idiomas. Tampoco banderas, cruces de Santiago,
  personas, manos, robots, cerebros, cohetes, gráficas de crecimiento ni lugares reales reconocibles.
- **Cuatro tintas:** cerúleo `#0072a8` (en el prompt, «medium cerulean ocean blue»: «sky blue» da `#1aa6df`), papel
  `#fbfcfd`, gris tinta `#13212b` y un toque de verde alga `#5d7a6a`. Los grabados admiten tonos del cerúleo; los
  iconos, una sola tinta. Ningún nombre de color fuera de las tintas, ni como adjetivo («golden», «white»).
- **Motivo** (generador, 2026-11-13): el motivo de software se dibuja como un **objeto físico dentro del agua**,
  grabado con el mismo trazo que el mar, como el barco de papel de la 6 y la 15 o la onda de Voice. Nunca piezas de
  interfaz planas (ventanas de editor, tarjetas, capturas) puestas encima del mar: salen como pegatinas y con
  pseudotexto. Ejemplos: los commits, boyas unidas por un cabo; una galería, hojas de papel con marco flotando. En
  las piezas sobre papel (10/10b, 27, 28) la ventana de editor sigue valiendo.
- **Zonas limpias** (generador, 2026-11-13), dos casos:
  - **Piezas de mar** (portadas, `og`/social, cabeceras, tarjetas «próximamente»): el mar va a sangre en todo el
    cuadro y la zona del texto es **agua tranquila**, no papel: «the lower third is calm open water: sparse, thin,
    light wave lines, lighter tone, no objects». Nunca «plain flat off-white paper» en una pieza de mar: el modelo
    pega un bloque blanco con borde ondulado y añade un marco. Si el agua tranquila no deja leer el titular, el
    Portal pone el texto sobre un velo por CSS; la imagen no se reintenta por eso.
  - **Piezas sobre papel** (10/10b, 17, 19, 27, 28): el hueco (o el centro del marco) se describe en positivo y al
    principio («the lower third of the sheet is plain flat off-white paper, open and unmarked») y la trama se confina
    al resto.
  - «filling the whole sheet to every edge», solo en piezas sin zona (18, 21).
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

**Plantilla de las piezas de mar** (generador, 2026-11-13): se parte del prompt de la q795 (6 «publicado»,
aprobada) y se cambian solo el sujeto, su tercio y el color del acento (en el sitio del verde alga). El bloque de
estilo, el cierre de mar y la frase de paleta se conservan literales. Cuando la zona tranquila va abajo, se invierte
la densidad de la q795: «line density highest in the deep water at the top and thinning steadily downwards, tonal
bands from deep cerulean at the top to lighter cerulean at the bottom». La rosa de los vientos y las sondas van
arriba («compass rose in the top left corner», «soundings in the upper water»), nunca en la zona del titular.

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

En las piezas de mar, el cierre de la q795 termina en «no horizon, no sky, no clouds, full-bleed edge to edge, no
border, no frame».

**Frase de paleta (siempre la última):**
> Palette strictly limited to medium cerulean ocean blue #0072a8, off-white #fbfcfd, ink grey #13212b and a touch of
> seaweed green #5d7a6a.

**Perfiles del generador** (generado → entregado): `cuadrado` 1024² (iconos, logo), `icono` 1024 → 512, `fondo`
1024 → 1200, `social` 1344×704 → 1200×630, `portada` 1344×768 → 1600×900, `tarjeta` 1344×768 → 1200×675, `cabecera`
1664×512 → 1600×500, `muro` 1792×448 → 1600×400; el patrón del pie (21), repetible en los dos ejes.

**Reglas de imagen para todas las piezas** (2026-11-12): ninguna imagen lleva texto; iconos de una línea, trazo
uniforme, sin relleno, legibles a 24 px, una tinta, cuadrados, en SVG; ilustraciones en grabado a dos tintas (cerúleo y
tinta sobre papel, toque de alga); el mar y la carta solo de fondo, el motivo principal es de software.

**Dudas que decidió la persona** (del generador, 2026-11-11; estado al 2026-11-12):

1. **Dos registros.** *Aplicada.* El grabado a dos tintas de las piezas grandes sustituye al «trazo blanco plano» que pedía esta
   hoja hasta hoy (mantener el grabado en las grandes y la línea simple en los iconos; es lo que ya recoge esta hoja).
2. **Acentos de producto.** *Cerrada (la persona, 2026-11-12):* el acento del producto va donde el Portal usa el alga
   (ver «Acento de cada proyecto»); papel, tinta y tipografías no cambian. Antes decía: en imagen generada, solo las cuatro tintas del portal; el acento de cada producto, solo en
   su logo, su interfaz y su `og` (24), en el lugar del verde alga.
3. **Versión oscura de los grabados.** *Reducida (2026-11-12):* 11 y 16 van por CSS; las de 10, 18, 19, 27 y 28, en
   cola en el generador. Antes decía: generar solo las que la web muestra a sangre en el tema oscuro (11, 16, 18, 19);
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
| 6 | **Portada de proyecto por estado** (3) | 1600×900 (perfil `portada`; sin `-mini`: ninguna tarjeta la usa) | Cabecera de las fichas con `cabecera: "color"` | Celeste plano con isobatas | Un motivo distinto por estado, nunca tres iguales (la persona, 2026-11-12): «desarrollo», faro en obra con andamio; «diseno», boya con ruta discontinua; «publicado», barco de papel con banderín de alga. Sin ventana de editor (grabado). **En cola**; las publicadas, tres faros provisionales |
| 7 | **Iconos de las 4 líneas de trabajo** | Hoja de contactos 2×2 (perfil `cuadrado`), luego SVG | Inicio, «Líneas de trabajo» (`lineas.ts`) | Iconos actuales de `Inicio.tsx` | Ventana de app con corchetes angulares · lupa sobre una lista con marca de visto · hoja de papel que se vuelve ventana · compás de dibujo sobre una retícula (línea simple) |
| 8 | **Iconos de los 4 valores** («Cómo trabajamos») | Igual que 7 | Inicio, `PRINCIPIOS` | Iconos actuales | Candado abierto · punto de mira en el borde de una retícula que sigue en puntos · historial de commits con nodos · dos ramas que se unen (línea simple) |
| 9 | **Iconos de las 3 vías de participación** | Hoja de contactos 1×3 | Inicio «Participa», `/unirse`, `/proponer` | Sin icono | Dos ramas que confluyen · bombilla dentro de una ventana · terminal con galón y cursor (línea simple) |
| 10 | **Ilustración «Cómo funciona»** | 1200×450 sobre papel | Banda de `/participa/unirse` | Lista sin imagen | Línea de historial de commits con unos pocos nodos sobre la carta (grabado). **Entregada**; **se rehace** (10b, en cola): cuatro nodos sobre una línea de historial, cada uno con su dibujo (sobre, dos bocadillos vacíos, casilla con visto, rama que crece) |
| 11 | **Fondo de «Es para ti si…»** | 1200×1200 sobre papel (perfil `fondo`), muy tenue (al 30 %) | Detrás de la lista de `/unirse` | Papel liso | Costa de una ría con sondas y curvas de nivel, muy tenue (grabado). **Cancelada: por CSS** (confirmado por la persona el 2026-11-12) |
| 12 | **Separador de sección** | 1200×100 sobre transparencia (WebP) | Entre bloques largos de la portada | Filete 1 px | Filete fino con puntos en los extremos y una rosa de ocho puntas grabada en el centro (la persona, 2026-11-12: «me gusta más la idea del que te pasé»; sustituye a la línea que se vuelve costa; en el generador, q564 «con estrella», versión transparente). **Entregada**, con su componente `Separador` |

### C. Páginas interiores (prioridad 3)

| # | Recurso | Medidas y forma | Dónde va | Hasta entonces | Motivo (registro) |
|---|---|---|---|---|---|
| 13 | **Cabecera de `/equipo`** (era la de Productos, que ya no tiene página: ADR 0004) | 1600×500 sobre cerúleo (perfil `cabecera`) | Arriba de `/equipo` | Bloque celeste con isobatas | Pistas de placa de circuito dibujadas como curvas de nivel (grabado). **Entregada** |
| 14 | **Icono «implantación y servicio»** | SVG, `src/assets/iconos/implantacion.svg` | Aviso «¿Tienes un proyecto propio?» del inicio (ya no hay tarjetas de producto, ADR 0004) | `MessageSquare` de lucide | Caja cuya tapa se despliega en ventana (línea simple). **Entregada** |
| 15 | **Tarjetas «Próximamente»** (2) | 1200×675 y `-mini` (perfil `tarjeta`), tercio inferior limpio | `TarjetaProxima` (Voice Generator y Developer) | Celeste plano con isobatas | Voz: onda de sonido como perfil del fondo marino (**entregada**); Developer: barco de papel sobre el mar con olas (**entregada**, la persona, 2026-11-11; antes, terminal con la rama que vuelve por un anillo) |
| 16 | **Cabecera del Muro** | 1600×400 sobre papel (perfil `muro`) | Arriba de `/muro` | Sin cabecera | Tablero de tareas de tres columnas con tarjetas en blanco (grabado). **Cancelada: por CSS** (2026-11-12) |
| 17 | **Marco de retrato del equipo** | SVG 400×400; la foto va dentro | `/equipo` y página de cada miembro | Borde 1 px | Marco con marcas de grados y chaflán, centro limpio, sobre croma (grabado) |
| 18 | **Ilustración de la página 404** | 900×600 sobre papel | `NoEncontrado.tsx` | Solo texto | Ruta discontinua que acaba en un eslabón roto que se enrosca como un signo de interrogación (grabado). **Entregada** |
| 19 | **Estado «enviado» de los formularios** | 480×360 sobre papel | `form.listo` en `/proponer` y `/unirse` | Solo texto | Barco de papel que sale del muelle (grabado; excepción náutica, como la 15 de Developer). **Entregada** |
| 20 | **Cabecera de páginas legales** | SVG 1200×80 sobre papel | `/aviso-legal`, `/privacidad`, `/terminos` | Nada | Borde de cajetín de plano con reglas interiores y marcas de esquina (grabado). **Cancelada: por CSS** (2026-11-12) |
| 21 | **Patrón de fondo del pie** | 1200×300 repetible en los dos ejes, cerúleo | `Pie.tsx` | Celeste plano | Curvas de nivel sin costuras sobre cerúleo (grabado). **Cancelado: por CSS**, cerúleo liso (2026-11-12) |
| 22 | **Textura de papel** (opcional) | 512×512 repetible, grano casi invisible | Fondo de página bajo la retícula | Color plano | Grano de papel finísimo, casi blanco (sin pedido aún) |

### D. Por proyecto (cuando se toque su ficha)

| # | Recurso | Medidas y forma | Dónde va | Hasta entonces | Motivo (registro) |
|---|---|---|---|---|---|
| 23 | **Icono de proyecto** para los que no tienen (Tarkor, Galivelop-workflow) | 512×512 (perfil `icono`), cuadrado con chaflán | `icono` de la ficha, `MenuProyectos` | Inicial del nombre | Tarkor: anillo tallado con cuatro puntas y una piedra partida en seis gajos (el seis se fija al vectorizar) · Workflow: tres nodos encadenados, el último con marca de visto (línea simple) |
| 24 | **`og.jpg` por proyecto** en el mismo estilo | 1200×630, tercio izquierdo de agua tranquila para el icono («left third calm open water») | `tools/og/fuentes/<slug>/og-fuente.png` | Los actuales | Como la 3 con el motivo del proyecto, como objeto dentro del agua (ver «Motivo»); el acento del producto, en el lugar del verde alga (ver «Dudas», 2) |

### E. Pedidos del Portal del 2026-11-12 (en cola en el generador)

| # | Recurso | Medidas y forma | Dónde va (propuesta) | Hasta entonces | Motivo (registro) |
|---|---|---|---|---|---|
| 25 | **Iconos de las secciones de la ficha** (5) | SVG, `src/assets/iconos/` | Índice y títulos de la ficha de proyecto | Sin icono | Resumen (hoja con líneas), Galería (dos marcos superpuestos), A fondo (capas apiladas), Cómo está hecho (llave cruzada con corchete angular), Avance (camino de nodos con bandera) (línea simple) |
| 26 | **Marcadores del avance** (3) | 64×64 | Hitos de «Avance» | Punto de estado | Hecho (nodo con visto), en curso (nodo medio relleno), pendiente (nodo discontinuo) (línea simple) |
| 27 | **Estado vacío** | 480×360, con versión oscura | Avisos vacíos del muro y de novedades | Isobatas tenues (`.vacio-carta`) | Ventana de editor en blanco con el cursor sobre la carta muy tenue (grabado) |
| 28 | **Aviso de error** | 480×360, con versión oscura | Errores de carga | Solo texto | Ventana de editor con los dos extremos de un cable desconectados (grabado) |
| 29 | **Banda «Participar»** | 1200×240, muy tenue, dos tercios de la izquierda limpios | «¿Quieres participar en…?» de la ficha | Filete con el acento | Dos ramas de commits que confluyen a la derecha (grabado) |
| 30 | **Cabecera de Novedades** | 1600×400 | Arriba de `/novedades` | Sin cabecera | Historial largo de commits con ramas y nodos de distinto tamaño (grabado) |

### F. Pedidos del Portal del 2026-11-13 (en cola en el generador)

Todo proyecto Galivelop lleva una portada propia en grabado, como el barco de papel de Developer y las ondas de Voice
(15); faltaban Workflow y GVIG (la persona, 2026-11-13). El acento del producto va donde el Portal usa el alga.
**Se reescriben** (generador, 2026-11-13): la primera entrega salió mucho peor que q331, q311 y q795 por pedir un
tercio de papel limpio y ventanas de editor sobre el mar; van con la plantilla de mar, agua tranquila y el motivo
como objeto en el agua.
Modelo `zimage-turbo-q6` (8 pasos, cfg 1.0, euler), perfil `portada` (1344×768 → 1600×900), 2-4 candidatas por
pedido. Llegan a `src/img/galivelop-workflow/31-portada-workflow.png` y
`src/img/galivelop-image-generator/32-portada-gvig.png`.

| # | Recurso | Medidas y forma | Dónde va (propuesta) | Hasta entonces | Motivo (registro) |
|---|---|---|---|---|---|
| 31 | **Portada de Galivelop-workflow** | 1600×900 y `-mini` 720×405 (perfil `portada`), tercio inferior de agua tranquila; acento `#3D6FD9` | Tarjeta del proyecto y portada de su ficha; el esquema del flujo pasa a la galería | El esquema del flujo | El relevo: el historial de commits como una fila de boyas unidas por un cabo que cruza el agua; la última, con un banderín en el acento (grabado) |
| 32 | **Portada de Galivelop IG** | Igual que la 31; acento `#7C5CD6` | Tarjeta del proyecto y portada de su ficha; el banner actual pasa a la galería | El banner de producto de la persona | «Pide, prueba, elige»: hojas de papel con marco, en blanco, flotando en abanico sobre el agua; una, con el borde más grueso en el acento (grabado) |

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
