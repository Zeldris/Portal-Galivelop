# Instrucciones para Claude en este repositorio

Portal público de la marca **Galivelop** (Galicia + Develop), publicado en GitHub Pages. Cómo
funciona, cómo añadir un proyecto y cómo se publica: [`README.md`](README.md).

## Al empezar cualquier sesión

1. Lee [`docs/traspaso.md`](docs/traspaso.md): estado, pendientes y siguiente paso.
2. `git fetch` de la rama de trabajo y comprueba que el último commit coincide con la bitácora.
3. `npm ci && npm run check` en verde antes de tocar nada.

## Reglas

- **Lo que no está subido no existe**: commit + push en cada punto estable, con la bitácora
  actualizada en el mismo commit.
- Commits en español: primera línea con qué cambia, cuerpo con qué queda y estado de los tests,
  última línea `Siguiente: <paso>`.
- A `main` solo se sube con confirmación expresa (y `main` es lo que se publica).
- Todo texto visible, en **castellano, gallego e inglés**. `npm run check` lo comprueba.
- No se enlaza el código de los proyectos (sus repos son privados): solo su versión pública.
- Marca: azul celeste y blanco de la bandera gallega, sin copiar su composición.
- Al sacar información de otro repo (Tarkor, toVeriAI…), solo se lee: nunca se modifica desde aquí.
