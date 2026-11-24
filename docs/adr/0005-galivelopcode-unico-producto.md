# 0005 · GalivelopCode, el único producto: privado y con página propia

- **Fecha:** 2026-11-22
- **Estado:** **aceptada** el 2026-11-22 (decisión de la persona en la conversación). Sustituye en parte a la
  [0002](0002-marca-taller-y-productos.md), la [0003](0003-codigo-abierto-e-implantacion.md) y la
  [0004](0004-productos-en-el-perfil.md). La [0006](0006-galivelop-evaluator-segundo-producto.md) corrige el «único
  producto»: son dos.
- **Decide:** Álvaro García Graña (fundador)

## Contexto

Desde la 0003, Productos ofrecía implantación y servicio de lo que el taller ya tenía en abierto (Galivelop-workflow,
Galivelop IG) y, como «próximamente», Galivelop Voice Generator y Galivelop Developer. La persona, 2026-11-22:
«Galivelop Developer va a pasar a ser un proyecto privado permanente y tendré de sobrenombre también el alias
GalivelopCode. Pasará a ser el producto del workflow y no entrará dentro de los proyectos. […] actualmente diría que
es el único producto real ya que el resto es open-source».

## Decisión

1. **Galivelop Developer (alias GalivelopCode) es el único producto de la marca.** Es privado para siempre: su código
   no se enlaza ni se cuenta en la web; solo lo que la persona decida enseñar. Es el producto que nace de
   Galivelop-workflow.
2. **Workflow, Galivelop IG y Galivelop Voice Generator dejan de ser productos** y quedan solo como proyectos de código
   abierto del taller. Sus datos de `src/data/productos/` se borran; en `/equipo/<id>` deja de salir su tarjeta.
3. **La implantación sigue**, ahora como frase en la ficha de cada proyecto abierto que la ofrezca (Workflow e IG):
   «también lo implantamos en tu proyecto», con el correo de la marca.
4. **El producto tiene página propia**, `/productos/<slug>` (la 0004 la había quitado), con una interfaz distinta de la
   ficha de proyecto: una explicación que entienda cualquiera, un apartado técnico breve para quien quiera detalle y
   una llamada clara a escribir para saber más. Lectura corta.
5. **GalivelopCode sale de «Próximamente»** del inicio (que es del taller) y la skill `gw-portal` deja de tratar su
   repo como fuente pública (`ignorar` en `fuentes.json`). El producto se mantiene a mano.
6. **Nombre visible:** «Galivelop Developer»; «GalivelopCode» es su alias y sale junto al nombre. El slug
   `galivelop-developer` no cambia.
7. Lo demás de la 0002-0004 sigue: sin precios, todo por correo con Álvaro, el producto se ve también en el perfil de su
   responsable y `/productos` sigue como página de paso.

## Consecuencias

- Riesgo alto aceptado por la persona (2026-11-22, «7. ok»): desaparecen las tarjetas de producto de Workflow, IG y
  Voice en el perfil. Las rutas de sus fichas de proyecto no cambian.
- Ruta nueva `/productos/galivelop-developer` (es, gl y en): `src/rutas.ts`, `App.tsx`, `FIJAS` y `cuerpo()` de
  `scripts/paginas-estaticas.mjs`, sitemap y `llms.txt`; con su guion de lectura.
- `GLOSSARY.md`, el «Mensaje» de `docs/desarrollo.md` y `docs/runbooks/tarea-semanal.md` se ponen al día.
