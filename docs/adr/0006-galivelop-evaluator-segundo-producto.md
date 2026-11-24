# 0006 · Galivelop Evaluator (GVE), segundo producto de Álvaro

- **Fecha:** 2026-11-24
- **Estado:** **aceptada** el 2026-11-24 (decisión de la persona en la conversación). Corrige el «único producto» de la
  [0005](0005-galivelopcode-unico-producto.md); el resto de la 0005 sigue.
- **Decide:** Álvaro García Graña (fundador)

## Contexto

La 0005 dejó Galivelop Developer (GalivelopCode) como único producto de la marca. Galivelop Evaluator (repo privado
`galivelop-evaluator`, `gve`) nació como herramienta interna para medir el RAG de uno de los proyectos del taller y la
skill `gw-portal` lo ignoraba (2026-11-14). Mide si un cambio en un sistema de IA lo mejora de verdad: guarda cada
prueba con su configuración y enseña qué sube y qué baja. La persona, 2026-11-24, quiere que sea un producto más,
también privado, junto a Developer.

## Decisión

1. **Galivelop Evaluator (alias GVE, slug `galivelop-evaluator`) es el segundo producto de la marca**, de Álvaro, como
   Developer. Privado para siempre: sin enlace al repositorio, sin precios, sin cifras ni nombres internos. Estado
   `proximamente`, sin versión.
2. **Tiene página propia**, `/productos/galivelop-evaluator` (es, gl y en), con el mismo formato que la de Developer,
   y su guion de lectura. Todo se habla por correo con Álvaro (el de la marca, con el producto en el asunto).
3. **El tipo de página se amplía** con campos opcionales (`problema`, `beneficios`, `paraQuien`, `estadoTexto`,
   `figuras`); `portada`, `esquema` y `tecnico.papeles` dejan de ser obligatorios. Los diagramas (`figuras`) sustituyen
   al esquema de rama, que se borra.
4. **La página de Developer se amplía** con ese tono más de marca: el flujo del taller conectado con agentes de IA
   locales, con el tercer papel («quien organiza») y sin prometer lo que aún no existe.
5. **`gw-portal` sigue ignorando el repo** `Zeldris/galivelop-evaluator` (`fuentes.json`), ahora con el motivo «producto
   privado de Álvaro (ADR 0006); su página se mantiene a mano».
6. Lo demás de la 0002–0005 sigue: sin precios, todo por correo, el producto se ve también en el perfil de su
   responsable. `/productos` deja de ser página de paso: es el índice de los productos (indexable, enlazado en gris
   desde la cabecera y con una banda en el inicio).

## Consecuencias

- Ruta nueva `/productos/galivelop-evaluator`: sitemap, `llms.txt` y página estática salen de los datos; test de rutas.
- Los textos que decían «único producto» (hero, README, «Mensaje» de `docs/desarrollo.md`, `GLOSSARY.md`, perfil de
  Álvaro y su guion) pasan a plural.
- Cada producto lleva su diagrama (figuras opcionales); Productos se ve en la cabecera, en una banda del inicio y en
  su índice `/productos`, con su JSON-LD `CollectionPage`.
