# Auditoría de marca — 2026-11-24

Pedida por la persona el 2026-11-24 (ver «Auditoría de marca» en `docs/records/pending.md`). Tres partes, revisadas
por subagentes de solo lectura; nada aplicado hasta que la persona decida.

**Estado:** las tres partes recogidas; decisiones de la persona en `docs/questions.md` (auditoría de marca). La parte 2 solo cubrió lo nuevo (productos); lo anterior queda para una segunda pasada.

## 1. Hoja para pedir imágenes (GVE y GalivelopCode)

### Qué hay

- **Developer (GalivelopCode):** acento `#0E9A93`, hondo `#16827c` (`docs/marca.md:66`); portada del barco de papel
  (fila 15, `:180`, excepción náutica en `:230`); icono q947 (`:209`). Archivos: `public/proyectos/galivelop-developer/`
  (`portada.webp`, `portada-mini.webp`, `icono.svg`) y la figura `public/productos/galivelop-developer/gd-harness.webp`
  (y `-mini`). **Falta** su OG (`og.jpg`; `:211` la da «pendiente en el generador», q1146) y
  `tools/og/fuentes/galivelop-developer/`.
- **Evaluator (GVE):** la hoja solo lo nombra en `:211` como «en `ignorar`», cosa desfasada desde la ADR 0006. Su
  acento, `#C27A1A` (ámbar), está solo en `src/data/productos/galivelop-evaluator.json`. Tiene una única imagen, la figura
  `public/productos/galivelop-evaluator/gve-evaluacion.webp` (y `-mini`). **Le faltan** la portada, el icono propio (hoy
  usa `chart` de lucide), `og.jpg` y `tools/og/fuentes/galivelop-evaluator/`. Sin portada ni OG, su página **se comparte
  sin imagen** (`scripts/paginas-estaticas.mjs:201-211` usa `og.jpg` y, si no hay, la portada).
- **Figuras:** no salen del generador de imágenes: se dibujan con `scripts/diagramas/productos.py`, que crea
  `docs/diagramas/{gd-harness,gve-evaluacion}.svg`, y se pasan a webp con `node scripts/diagramas-webp.mjs`.

### Huecos y contradicciones

1. El acento de Evaluator no está en la hoja. El ámbar puro da 3,36:1 sobre el papel; el hondo y la variante oscura
   (de `estiloAcento`) no están anotados.
2. `:211` sigue diciendo que Evaluator está en `ignorar`.
3. La regla 11 (`:41`) pide diagramas solo con la paleta; las figuras no llevan el acento del producto. Hay que decidir
   si deben llevarlo.
4. Las figuras llevan texto en castellano dentro del dibujo. La regla «sin texto» (`:237`) es de imagen generada, pero
   choca con los tres idiomas; o se declara la excepción, o se piden `-gl` y `-en`.
5. Ninguna portada ni figura de producto tiene versión oscura (los SVG usan el fondo `#fbfcfd`).
6. Las rutas no son coherentes: la portada de Developer está en `proyectos/`, sus figuras en `productos/`.

### Propuesta para `docs/marca.md`

- (a) En «Acento de cada proyecto», tras `:75`: acentos de los productos, Developer `#0E9A93` (hondo `#16827c`) y
  Evaluator `#C27A1A`, con su hondo y variante oscura calculados con `tonos.test.ts`.
- (b) Sección nueva «G. Productos», tras la F (`:403`):

| # | Recurso | Medidas | Dónde va | Hasta entonces | Motivo (registro) |
|---|---|---|---|---|---|
| 33 | Portada de Evaluator | 1600×900 y `-mini` 720×405, tercio inferior de agua tranquila, acento `#C27A1A` | `public/productos/galivelop-evaluator/portada.webp` y `-mini`; `portada` del JSON con `alt` es/gl/en | Ninguna | Balanza de dos brazos en el agua, con dos boyas a distinta altura y la banderola en el acento sobre la que mejora (grabado). Sin texto ni números |
| 34 | OG de Evaluator | 1200×630, tercio izquierdo de agua tranquila | `tools/og/fuentes/galivelop-evaluator/og-base.png` y `traducir.mjs galivelop-evaluator --es` | La portada | La misma balanza a la derecha (grabado) |
| 35 | OG de Developer (q1146) | Igual que la 34 | `tools/og/fuentes/galivelop-developer/og-base.png` | La portada | El barco de papel de su portada, a la derecha, con banderín `#0E9A93` (grabado) |
| 36 | Icono de Evaluator | SVG 512, línea simple, `#C27A1A` | `public/productos/galivelop-evaluator/icono.svg` | `chart` de lucide | Dos barras de distinta altura con una marca de visto en la mayor |
| 37 | Figuras de producto | SVG de 1600 de ancho, a mano | `docs/diagramas/<nombre>.svg` → `scripts/diagramas-webp.mjs` → `public/productos/<slug>/<nombre>.webp` y `-mini` | Las actuales | Regla 11; excepción a «sin texto» (alt en es/gl/en); acento solo en el rótulo; versión oscura por decidir |

- (c) Convención: los `alt` van en `src/data/productos/<slug>.json`; los archivos de producto, en `public/productos/<slug>/`.
- (d) En `:211`, cambiar la frase de Developer y Evaluator por una referencia a la sección G.

## 2. Diseños

**Cobertura:** `docs/marca.md`, CSS de producto, `/productos`, banda del inicio, `scripts/diagramas/productos.py` y
`src/pages/Producto.tsx`; capturas en claro de `/productos` y de Evaluator. **Sin revisar:** tema oscuro en captura y
las páginas anteriores (inicio, fichas, equipo, unirse, proponer, novedades, 404).

En general cumple: sin `border-radius` salvo `.estado-punto`, sin `backdrop-filter` ni degradados fuera de los
permitidos, `--sombra` solo en panel, hoja y lector, y chaflanes de producto según la hoja.

| # | Gravedad | Dónde | Qué pasa | Arreglo propuesto |
|---|---|---|---|---|
| D1 | medio | figuras `gd-harness` y `gve-evaluacion`; `src/pages/Producto.tsx:169` | Una sola imagen, en claro: en tema oscuro sale un recuadro de papel `#fbfcfd` sobre la noche (marca: «El oscuro existe y se cuida», `:21`, y versiones oscuras sin papel claro, `:217`) | Variante oscura en `productos.py` (parametrizar papel, tinta y filete) y servirla con `ImagenTema` |
| D2 | leve | `scripts/diagramas/productos.py:13` | Retícula `#e3edf3` en vez de `--reticula` `#eef3f6` | Usar el token, o anotar la excepción |
| D3 | leve | `productos.py:82-83` y nodo «+» de `gve()` | Nodos circulares; la hoja solo admite redondo en `.estado-punto` (`:25`) | Nodos cuadrados o rombos, o anotar la excepción de nodos de historial |
| D4 | leve | `global.css` (`.producto-paso-num`, `.producto-copiar`) | Borde de 1,5 px; la hoja pide 1 px (`:27`) | 1 px |
| D5 | leve | `global.css` (`.producto-copiar`) | Botón sin chaflán de 10 px (`:26`) | `clip-path` con `--chaflan-pequeno` y filete en el pseudoelemento, como `.boton` |
| D6 | leve | `global.css` (`.producto-plegable summary::after`, `.producto-datos code`) | `1.5rem` y `0.9em` fuera de la escala `--letra-*` | Tokens de la escala |
| D7 | leve | `global.css` (`.producto-figura`) | Marco recto, cuando las garantías llevan chaflán | Chaflán de 14 px |
| D8 | leve | `global.css` (`.proxima-icono`) | `filter: saturate(0.7)` no está en la hoja | Quitarlo o anotarlo |
| D9 | leve | `global.css` (`.lector`) | Sombra en el lector flotante; la hoja dice «única sombra: la del panel» (`:28`) | Añadir «o flotante» a la regla 4 |

La página de Evaluator no tiene portada (ver parte 1); la de Developer sí la tiene.

**Huecos de la hoja** (la web los hace de forma coherente y la hoja no los recoge): la página de producto (cabecera,
título con filete de 2 px, filete superior de 3 px en el acento, `.producto-franja`, bloque de contacto sobre celeste
hondo con isobatas); el uso de `--acento-proyecto` en producto; las convenciones de los diagramas (✓ y ✗ en cuadrados
de 46 px, discontinuo para «opcional», caja oscura para la decisión humana, etiquetas en mono mayúsculas); `.migas`,
`.nav-productos` y `.productos-nota`; la banda `banda-productos`.

## 3. Guiones de voz

Leídos enteros: productos, galivelop-developer, galivelop-evaluator, equipo, alvaro-garcia-grana, galivelop-workflow,
galivelop-image-generator e inicio (es). Los demás, barrido de siglas, cifras, marca y fechas. Ningún gl ni en es
igual al es. Ninguno presenta Workflow, IG o Voice como productos (ADR 0005); las versiones van en palabras.

**Audio grabado (es):** equipo, galivelop-image-generator, galivelop-workflow, inicio, novedades, proponer, tarkor,
toveriai y unirse; cambiarlos obliga a regrabar. **Sin audio:** productos, galivelop-developer, galivelop-evaluator,
alvaro-garcia-grana y raquel-c. gl y en no tienen audio en ninguno.

### Hallazgos

| # | Gravedad | Guion · trozo | Qué pasa | Propuesta (es; gl y en igual) | Audio |
|---|---|---|---|---|---|
| G1 | medio | galivelop-image-generator · `vistazo` | Dice 0.6 publicada y la hoja de marca «con la 0.7»; la ficha da 0.7 hecha y 0.8 «Pieza de marca» en curso | «Está en desarrollo, en la versión cero punto siete publicada, con el código abierto. La hoja de marca como datos ya está hecha. Ahora trabaja en la pieza de marca, la versión cero punto ocho.» Repasar `avance` | regrabar `02-vistazo` |
| G2 | medio | inicio · (nuevo) | La banda de productos del inicio no se narra | Trozo nuevo: «Del taller salen también dos productos de Álvaro: Galivelop Developer y Galivelop Evaluator. Los ves en la página de productos.»; la banda necesita `data-guion` o `id` | grabar el trozo |
| G3 | leve-medio | galivelop-workflow y galivelop-image-generator · `participar` | No dicen que se implantan (ADR 0003 y 0005; la ficha sí) | «Y si quieres que lo implantemos en tu proyecto, escríbenos.» | regrabar `participar` |
| G4 | leve | galivelop-workflow · `avance` | Falta una coma; «front» es jerga; «Management Center» sin contexto | «…la medida del gasto, las preguntas con otros agentes y, la última, la interfaz…»; «un panel local, el Management Center, para consultar y configurar» | regrabar `avance` |
| G5 | leve | productos · `producto-*` | «Pulsa Ver producto»; el botón dice «Ver el producto» | «Pulsa Ver el producto para conocerlo» (con el rótulo real en gl y en) | no |
| G6 | leve | productos · `cabecera` | No dice que son privados (ADR 0006) | Añadir «Los dos son privados y su código no se publica.» | no |
| G7 | leve | galivelop-developer · `fiarse` | «API» sin expandir | «sin depender de un servicio de pago por uso» | no |
| G8 | leve | galivelop-developer y galivelop-evaluator · `contacto` | Narradora en tercera persona que dice «Cuéntanos» | «Sin precios en la web ni formulario: se habla por correo. Cuéntale qué…» (gl «Cóntalle», en «Tell him») | no |
| G9 | leve | galivelop-developer · `como` | «aparte, en una copia separada» se repite (en: «separately, in a separate copy») | «lo hace en una copia separada, sin tocar la versión buena» | no |
| G10 | leve, opcional | galivelop-developer · `cabecera` | No dice que nace del workflow (ADR 0005) | «Nace del flujo de trabajo del taller, Galivelop-workflow.» | no |
| G11 | leve | alvaro-garcia-grana | `narra` 2026-11-17 con el trozo de productos nuevo; años en cifras; «full stack», «Sergas» | `narra` a 2026-11-24; «dos mil diecisiete», «dos mil veintiuno»; nota de pronunciación | no |
| G12 | leve, opcional | equipo | Álvaro sin sus dos productos (ADR 0004) | «…y lleva dos productos.», solo si se regraba | regrabar |
| G13 | leve | toveriai · `vistazo` | «toca pulir: el móvil…», cuando el 2026-11-21 el móvil ya va cómodo | Confirmar y subir `narra` | quizá regrabar |
| G14 | leve | raquel-c, galivelop-image-generator | «IBM», «Steam Deck», «World-Maker-Fantasy» sin nota de pronunciación | Añadir notas | no |

Orden recomendado: G1; luego los de sin audio (G5-G11 y G14), que no cuestan grabación; y G2, G3, G4 y G12 juntos
en una sola tanda de regrabación.

## 4. Diseños, segunda pasada

**Cobertura:** inicio, fichas de Tarkor, toVeriAI, workflow e image-generator, fichas de producto (Developer y
Evaluator), `/equipo` y la página de Álvaro, `/participa/unirse`, `/participa/proponer`, `/novedades` y el 404, en
escritorio y móvil, claro y oscuro (hojas de captura), más una captura de `.producto-figura` de Evaluator; cruzado con
`src/estilos/global.css` y `docs/marca.md`. **Sin revisar:** contraste medido con herramienta (solo a ojo en hoja),
páginas legales, `/muro`, el resto de estados (menú abierto, foco, galería ampliada).

En general cumple en oscuro: sin papel claro en cabeceras, tarjetas, formularios, diagramas de producto ni 404; las
capturas blancas de toVeriAI y Tarkor son la excepción de «lo que enseña cada proyecto» (`docs/marca.md:51`).

**Causa del filo de `.producto-figura`** (`global.css:6791-6798`): el marco es `--superficie` con 12 px de
`padding`, y el SVG pinta su propio fondo `--papel` (`productos.py:18`). En oscuro el marco `#111f29` es más claro que
la figura `#0d171e`, así que rodea la figura una banda más clara; en claro es `#fff` frente a `#fbfcfd` y apenas se
nota. Arreglo: D10.

| # | Gravedad | Dónde | Qué pasa | Arreglo propuesto |
|---|---|---|---|---|
| D10 | medio | `global.css:6791-6798` (`.producto-figura`); `/productos/galivelop-evaluator` y `-developer`, oscuro (y claro, leve) | Marco `--superficie` y figura `--papel`: banda de 12 px más clara alrededor del dibujo; el borde de 1 px (`marca.md:27`) queda lejos de la figura | `background: var(--papel)` en `.producto-figura` (el filete del marco ya la delimita); o `--superficie` en `PAPEL` del SVG |
| D11 | leve | `global.css:1224` y `:2831` (`.separador`) | Imagen oscura por `filter: invert(1) hue-rotate(180deg)` en vez de variante propia; no está en la hoja (`marca.md:217`: versiones oscuras propias) | Anotar la excepción en la hoja o servir variante con `ImagenTema` |
| D12 | leve | `global.css:754`, `:4440`, `:3686` | Bordes de 1,5 px y 2 px (`.estado-diseno .estado-punto`, caja del flujo, punto de línea); la hoja pide 1 px (`marca.md:27`) salvo el filete de 2 px bajo cabeceras | 1 px, o anotar los puntos y marcadores como excepción (como D4) |
| D13 | leve | `global.css:6706` (`.producto-datos code`, `0.9em`) | Restos de D6: `em` fuera de la escala `--letra-*` (el `0.8em` de `:6166` es de impresión y vale) | Token `--letra-*` |

Sin hallazgos en `/equipo`, miembro, `/unirse`, `/proponer`, `/novedades` ni 404 en oscuro (ni en móvil): formas,
bordes y tokens según la hoja.

**Hojas de captura** (en el scratchpad):
`/tmp/claude-0/-home-user-Portal-Galivelop/afa10dbc-8543-473b-a20b-5a9500b80083/scratchpad/capturas/hoja.png`
(inicio, Tarkor, toVeriAI), `.../capturas/h2/hoja.png` (equipo, Álvaro, unirse, proponer, novedades, 404) y
`.../capturas/h3/hoja.png` (workflow, image-generator, Developer, Evaluator); detalle:
`.../capturas/h4/productos-galivelop-evaluator-producto-figura-escritorio.png`.
