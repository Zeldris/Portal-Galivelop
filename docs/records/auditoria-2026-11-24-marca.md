# Auditoría de marca — 2026-11-24

Pedida por la persona el 2026-11-24 (ver «Auditoría de marca» en `docs/records/pending.md`). Tres partes, revisadas
por subagentes de solo lectura; nada aplicado hasta que la persona decida.

**Estado:** partes 1 y 3 recogidas; parte 2 (diseños) en curso.

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
