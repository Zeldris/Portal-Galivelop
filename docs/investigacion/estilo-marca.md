# Referencias de estilo para la identidad de Galivelop

**Fecha de consulta:** 2026-11-08 (todas las fuentes).
**Dirección:** «cuaderno de taller» + «carta náutica atlántica».

## Límites de esta investigación

- `WebFetch` y `curl` solo resolvieron el registro de npm. Razer, Blizzard, EMODnet, GEBCO, IHM y las webs de referencia
  dieron `ENOTFOUND` o `connect_rejected` (hosts fuera de la red permitida de la sesión). **No se ha podido abrir
  ninguna web de referencia**: lo que sigue sale de `WebSearch` (títulos y extractos) y de npm.
- Cada fila lleva su estado: **[búsqueda]** = confirmado por un resultado de búsqueda; **[sin comprobar]** = la
  conozco pero hoy no he podido ver que exista ni cómo se ve. Hay que abrirlas a mano antes de decidir nada.
- Un resultado de búsqueda (cavac.at, página sobre IBM Plex) traía una instrucción incrustada ajena a la consulta. Se ignoró.

## 1. Webs de referencia

| # | Web | Qué tomar | Qué no | Estado |
|---|-----|-----------|--------|--------|
| 1 | [Oxide](https://oxide.computer) y su [caso en Pentagram](https://www.pentagram.com/work/oxide) | Identidad técnica con monoespaciada propia (GT America Mono a medida) usada en tipografía e ilustración; la mono como voz de marca, no solo para código | La fuente es comercial; el tono corporativo de hardware | Caso Pentagram [búsqueda]; web [sin comprobar] |
| 2 | [The Monospace Web](https://owickstrom.github.io/the-monospace-web) | Retícula de caracteres que alinea texto y diagramas; filetes ASCII | Cuerpo de prosa larga en mono (el propio autor lo desaconseja) | [búsqueda] |
| 3 | [Powell Studio](https://httpster.net/website/powell-studio) | La sangría de primera línea casa con las columnas de la retícula; web que «se aparta» ante el trabajo | Copiar su portfolio visual | Ficha en httpster [búsqueda]; web [sin comprobar] |
| 4 | [Stripe Press](https://press.stripe.com) | Cada libro con su color propio; catálogo tipo biblioteca | Fondo oscuro | Ficha en [Awwwards](https://www.awwwards.com/inspiration/stripe-press-ideas-for-progress-3) [búsqueda]; web [sin comprobar] |
| 5 | [MapTiler Ocean](https://www.maptiler.com/maps/ocean) | Cartografía náutica con batimetría, contornos y etiquetas vectoriales como textura y jerarquía | Mapa interactivo completo (peso) | [búsqueda] |
| 6 | [Bathymetric Contours of the Gulf of Mexico (Information is Beautiful Awards)](https://www.informationisbeautifulawards.com/projects/7570-bathymetric-contours-of-the-gulf-of-mexico) | Isobatas hechas con R de código abierto: método reproducible para generar el SVG | Su paleta de rampa de color | [búsqueda] |
| 7 | [Marginalia (galería Kombai)](https://kombai.com/gallery/inspirations/marginalia/) | Papel de cuaderno de laboratorio con retícula de 32 px muy tenue y notas al margen | Es una plantilla de galería, no una web viva | [búsqueda] |
| 8 | [Locomotive: Books of Design](https://locomotive.ca/en/work/books-of-design) | Editorial técnica con maquetación de libro | Efectos de scroll pesados | Caso [búsqueda]; resultado no detallado |
| 9 | [Distill](https://distill.pub) | Revista de investigación con marginalia y figuras limpias | — (archivada desde 2021) | [sin comprobar] |
| 10 | [Are.na](https://www.are.na) | Interfaz de fichas con filetes y poco color | Su neutralidad total: falta color propio | [sin comprobar] |
| 11 | [Berkeley Graphics / US Graphics](https://usgraphics.com) | Catálogo-ficha técnica con datos tabulados; mono como producto | Tipos comerciales | Catálogo de Berkeley Mono [búsqueda]; web [sin comprobar] |

Pendiente: no he encontrado, por esta vía, un estudio gallego ni un instituto oceanográfico con web notable; conviene
una pasada a mano por NOAA Ocean Explorer, Copernicus Marine y el IEO-CSIC.

## 2. Razer y Blizzard: qué es trasladable

Fuentes oficiales no abiertas; hechos de fuentes de terceros salvo el primero.

1. **Un solo color propio en grandes dosis.** Razer define su verde como Pantone 802C y habla de coherencia de color
   como eje de la marca ([Razer newsroom](https://www.razer.com/newsroom/product-news/razer-esports-green-collection)).
   Traslado: el celeste #1aa6df como bloque plano y grande, no como acento ni degradado.
2. **Negro y verde sin tercer color**: producto «dominantemente negro con líneas verde ácido»
   ([TechSpot](https://www.techspot.com/news/94072-peripheral-style-razer-hq-boasts-store-robotic-barista.html)).
   Traslado: papel claro y celeste con tinta oscura; dos colores y ya.
3. **Marca de palabra a medida, angular, en mayúsculas** ([madegooddesigns](https://madegooddesigns.com/razer-font/)).
   Traslado: una sola palabra de marca dibujada con chaflanes; el resto en fuentes libres.
4. **La marca llega a la arquitectura** (fachada negra con líneas verdes, [Yanko Design](https://www.yankodesign.com/2022/04/09/razer-singapore-hq-resembles-a-giant-razer-branded-gaming-accessory/amp/)).
   Traslado: los filetes y chaflanes se repiten en tarjetas, botones y cabeceras.
5. **Blizzard: azul y negro, rótulo propio, texto de interfaz en sans legible** ([madegooddesigns](https://madegooddesigns.com/blizzard-brand-guidelines/));
   el rediseño de Battle.net de 2021 cambió paleta y logos ([tracker.gg](https://tracker.gg/black-ops-4/articles/activision-blizzard-battle-net-rebrand-april-2021)).
   Traslado: título con carácter + texto sobrio.
6. **Cautela:** las fuentes de terceros no confirman un sistema «angular» en Blizzard (una describe el logo de
   Battle.net como circular) ni dan hex oficiales. No citar valores concretos de ninguna de las dos marcas.

## 3. Tipografías (@fontsource, comprobado en el registro npm el 2026-11-08)

Todas con licencia OFL-1.1 salvo indicación. Versión actual 5.3.x; fecha de publicación 2026-07-19 salvo Source Serif 4
(2026-10-11). Fuente: `https://registry.npmjs.org/@fontsource/<paquete>`; `npmjs.com` devolvió 403 a `WebFetch`, así que la
comprobación se hizo contra el registro, que es de donde sale la página.

Paquetes confirmados: `ibm-plex-mono`, `ibm-plex-sans`, `ibm-plex-serif`, `ibm-plex-sans-condensed`, `barlow`,
`barlow-condensed`, `big-shoulders-display`, `source-serif-4`, `literata`, `archivo`, `jetbrains-mono`, `space-mono`,
`chakra-petch`, `oxanium`, `rajdhani`, `saira-condensed`, `martian-mono`, `spline-sans-mono`, `zilla-slab`, `newsreader`.
Aparte: `roboto-slab` es Apache-2.0.

Licencia y origen: IBM Plex es OFL, con nombre reservado ([Wikipedia](https://en.wikipedia.org/wiki/IBM_Plex)); Big Shoulders
Display es OFL 1.1 y nació para la identidad de la ciudad de Chicago ([Font Squirrel](https://www.fontsquirrel.com/fonts/big-shoulders)).

### Combinaciones propuestas

| | Título | Texto | Mono | Carácter |
|---|--------|-------|------|----------|
| **A (recomendada)** | Barlow Condensed (600/700, mayúsculas) | Source Serif 4 | IBM Plex Mono | Señalética portuaria + serif sobria con remates firmes + datos de cuaderno |
| B | Big Shoulders Display | Literata | JetBrains Mono | Más rotunda y estrecha; Literata es más cálida |
| C | IBM Plex Sans Condensed | IBM Plex Serif | IBM Plex Mono | Una sola familia: máxima coherencia, menos contraste de carácter |

Notas: Barlow se inspira en la señalética de carreteras y tiene versión condensada y cuadrada de curvas; Chakra Petch,
Oxanium y Saira Condensed son más «gamer» (cercanas a Razer) y pueden resultar excesivas en un taller de código abierto.
Estas descripciones de forma son mías, no de una fuente; hay que verlas en pantalla.

### Fuentes muy vistas en webs generadas por IA (evitar)

- Inter y Space Grotesk: se señalan como valor por defecto de sitios hechos con IA; el combo Space Grotesk + Instrument
  Serif aparece en un análisis de Show HN ([aiproductivity](https://aiproductivity.ai/news/ai-design-slop-show-hn-analysis/)).
  Hay además una crítica al «monocultivo de sans geométricas» ([aismells](https://aismells.pages.dev/geometric-sans-monoculture.html)).
- Sora, Fraunces, Bricolage Grotesque: **no he encontrado fuente** que los señale. Se evitan por criterio del encargo, no por evidencia.
- Las tres combinaciones propuestas no usan ninguna de las anteriores.

## 4. Datos batimétricos de la costa gallega

| Fuente | Resolución | Licencia | Notas |
|--------|-----------|----------|-------|
| [EMODnet Bathymetry DTM 2024](https://emodnet.ec.europa.eu/en/emodnet-bathymetry-dtm-2024-release) | ~115 m (1/16 × 1/16 arcmin), con zonas de alta resolución | Productos bajo **CC BY 4.0**, reconocer a EMODnet ([documento de términos](https://core.ac.uk/download/482118516.pdf)); parte de los datos de origen no son abiertos | Descarga por MapViewer (teselas) o [ERDDAP](https://erddap.emodnet.eu/erddap/info/dtm_2020_v2_e0bf_e7e4_5b8f/index.html) (subconjunto, NetCDF). Aviso oficial: no usar para navegación ni seguridad en el mar |
| [GEBCO 2024 Grid](https://source.coop/alexgleith/gebco-2024) | 15 segundos de arco (~450 m) | Dominio público según [SPREP](https://tonga-data.sprep.org/resource/535) para versiones antiguas; GEBCO pide reconocer la fuente ([GEBCO 2021](https://gebco.net/data_and_products/gridded_bathymetry_data/gebco_2021)); una copia derivada figura como CC BY 4.0 | **Confirmar los términos vigentes en gebco.net** antes de redistribuir; no los he podido abrir |
| IEO-CSIC (sondas del Cornide de Saavedra 2011-13 y Ramón Margalef 2014) | Datos de sonda | [EMODnet CDI](https://emodnet.ec.europa.eu/geonetwork/static/api/records/a53ad03f-3939-9393-3937-000000099775): sin licencia abierta explícita en lo hallado | Solo como referencia; no usar sin confirmar |
| IHM (Instituto Hidrográfico de la Marina) | — | **No hallado**: la búsqueda no devolvió nada | Pendiente; sus cartas náuticas probablemente no sean reutilizables |

**Recomendación:** EMODnet DTM 2024 por ERDDAP (recorte de la costa gallega, NetCDF o GeoTIFF) y, con GDAL
(`gdal_contour -i <intervalo>`), curvas a intervalos fijos; simplificar y exportar a un SVG estático. Atribución en el
pie: «Batimetría: EMODnet Bathymetry, CC BY 4.0». La zona sin cubrir se rellena con GEBCO si hace falta.
Pendiente: verificar que el recorte baja desde ERDDAP con el proxy de la sesión (hoy `erddap.emodnet.eu` no se probó
por `curl`; solo se leyó por búsqueda).
