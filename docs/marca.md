# Marca Galivelop: hoja de estilos

**Estado:** borrador aprobado en dirección por la persona (2026-11-08), pendiente de elegir tipografía y de aplicarlo a
`src/estilos/global.css`. Prototipo: https://claude.ai/artifact/UoLydvcktgu8jYwioKbygq. Referencias y fuentes:
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
2. **Nada de resplandores, desenfoques ni degradados de fondo.** Ni `backdrop-filter`, ni `--brillo`, ni sombras
   difusas grandes. La profundidad se da con filetes y con planos de color.
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

## Tokens

Los nombres actuales de `global.css` se conservan donde coinciden; los nuevos se añaden; `--brillo` y `--sombra`
desaparecen (la segunda queda solo para el panel).

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
| `--chaflan` / `--chaflan-grande` | `14px` / `28px` | igual | Esquina cortada |
| `--curva`, `--transicion`, escala `--z-*` | como ahora | | Sin cambios |

Chaflán en CSS: `clip-path: polygon(0 0, calc(100% - var(--chaflan)) 0, 100% var(--chaflan), 100% 100%, 0 100%)`.

### Tipografía

Tres papeles: **títulos** (condensada o cuadrada, mayúsculas, tracking corto), **texto** (serif sobria) y **datos**
(monoespaciada). Candidatas, todas con licencia OFL y paquete `@fontsource` (comprobado en npm el 2026-11-08):

| | Títulos | Texto | Datos |
|---|---|---|---|
| **A (recomendada)** | Barlow Condensed 600/700 | Source Serif 4 400/600 | IBM Plex Mono 400/500 |
| B | Big Shoulders Display 600/800 | Literata 400/600 | JetBrains Mono 400/500 |
| C | IBM Plex Sans Condensed 500/700 | IBM Plex Serif 400/600 | IBM Plex Mono 400/500 |

Decisión de la persona: **pendiente**. Escala: texto 17 px / 1.6; datos 12 px con tracking `.04em`; h3 32 px, h2 36 px,
h1 `clamp(44px, 9vw, 96px)` con interlineado 1.02 (más apretado monta las cajas de color; visto en el prototipo).

## Recursos de imagen para el generador (Galivelop IG)

Mientras no existan, la web usa los sustitutos de la columna «Hasta entonces». Todo en WebP salvo el logo (SVG y PNG);
cada imagen grande con su `-mini` según [`desarrollo.md`](desarrollo.md#añadir-o-actualizar-un-proyecto). Las imágenes
no llevan texto (el texto lo pone la web en los tres idiomas). Prompts en inglés porque es lo que mejor entiende el
generador; cada uno termina con el mismo bloque de estilo.

**Bloque de estilo común (añadir al final de cada prompt):**
> Flat vector style, nautical chart aesthetic, thin white contour lines on solid sky-blue (#0072a8) or on off-white
> paper (#fbfcfd), ink grey (#13212b) details, no gradients, no glow, no text, no watermarks, sharp 45-degree cut
> corners instead of rounded corners, minimal, technical, serene.

| # | Recurso | Medidas y forma | Dónde va | Hasta entonces | Prompt |
|---|---|---|---|---|---|
| 1 | **Logo** | SVG cuadrado, versión 512×512 PNG y 32×32 favicon; fondo celeste plano con chaflán de 28/128 en la esquina superior derecha; monograma GV en blanco, trazo 12/128 | `public/marca/gv-logo.svg`, favicon, cabecera | El logo actual con fondo plano y chaflán (hecho a mano en el prototipo) | "Monogram logo with the letters G and V joined by a shared horizontal stroke, white strokes of even width on a solid sky-blue square with one corner cut at 45 degrees, geometric, inspired by port signage" + bloque |
| 2 | **Isobatas de la costa gallega** | SVG, 2400×1200, solo líneas (sin relleno), 12-16 niveles, cada quinta más gruesa | Fondo del bloque de portada y de las fichas sin captura | Isobatas generadas con ruido (prototipo) | No es para el generador: se produce con datos reales de EMODnet DTM (CC BY 4.0) y `gdal_contour`; apuntado en `investigacion/estilo-marca.md` §4 |
| 3 | **Portada social** (`og:image`) | 1200×630 JPG/WebP, zona segura central 1000×500 | `index.html`, `public/marca/galivelop-portal.jpg` | La actual | "Wide banner: a bathymetric chart of the Galician Atlantic coast, white depth contours on solid sky-blue, a small ink-grey compass rose in one corner, empty space in the centre for a title" + bloque |
| 4 | **Portada de proyecto sin captura** (una por `estado`) | 1600×900 y `-mini` 720×405 | Fichas y tarjetas con `cabecera` sin imagen | Celeste hondo con isobatas | «desarrollo»: "A workbench seen from above on grid paper: calipers, a pencil, a half-drawn blueprint of a sea chart" + bloque. «diseno»: "A blank sea chart with only the coordinate grid, a ruler and a compass" + bloque. «publicado»: "A lighthouse beam drawn as thin concentric contour arcs over the sea" + bloque |
| 5 | **Iconos de los cuatro valores** y de apartados | SVG 48×48, trazo 2 px ink grey, sin relleno, cuadrados con chaflán | «Cómo trabajamos», cabeceras de sección | Sin icono (solo el número en mono) | "Set of line icons, 2px even stroke, square grid, 45-degree cut corners: lighthouse, sextant, logbook, mooring knot, anchor, buoy" + bloque; se pide como hoja y se recorta |
| 6 | **Textura de papel** (opcional) | 512×512 WebP, repetible, grano muy suave | Fondo de página, debajo de la retícula | Color plano | "Seamless tileable fine paper grain texture, almost white, extremely subtle, no visible pattern" + bloque (sin la parte azul) |
| 7 | **Separador de sección** | SVG 1200×24, una línea de costa estilizada | Entre secciones largas de la portada | Filete de 1 px | "A single thin horizontal line that becomes a stylised Galician coastline with rías for a short stretch, ink grey on transparent" + bloque |
| 8 | **Retrato de miembro** (marco, no la foto) | Marco SVG con chaflán y escala de carta en el borde | Página de cada miembro | Borde de 1 px | "Square picture frame drawn like the border of a nautical chart: tick marks with degrees, 45-degree cut corner, ink grey on transparent" + bloque |

Prioridad: 1, 2 y 3 (marca y portada social); después 4 y 5; 6, 7 y 8 solo si el diseño los pide al aplicarlo.
Cada recurso entregado se apunta aquí con fecha y ruta, y sustituye su «Hasta entonces».

## Pasos para aplicarlo

1. Elegir la tipografía (persona). Instalar los tres paquetes `@fontsource` y quitar Inter y Sora.
2. Reescribir `:root` de `global.css` con los tokens de arriba y el claro por defecto; sustituir `border-radius` por
   chaflán donde proceda; retirar `--brillo`, degradados y `backdrop-filter`.
3. Generar las isobatas reales (recurso 2) y el logo (recurso 1).
4. Revisar en móvil y escritorio, con capturas antes/después; `npm run check` y `npm run build`.
5. Cambio grande: fase 1 (`/code-review`), fase 2 (`gw-opt-tokens`, `retro`, `gw-seo` por la `og:image`) y fase 3 antes
   de que la tarea semanal lo publique.
