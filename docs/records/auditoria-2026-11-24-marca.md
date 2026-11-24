# Auditoría de marca — 2026-11-24

Pedida por la persona el 2026-11-24 (ver «Auditoría de marca» en `docs/records/pending.md`). Tres partes, revisadas
por subagentes de solo lectura; nada aplicado hasta que la persona decida.

**Estado:** parte 1 recogida; partes 2 y 3 en curso.

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
