<!-- galivelop-workflow v0.3.0 -->
# Glosario del portal

Vocabulario del portal Galivelop. Los términos de cada proyecto (Tarkor, toVeriAI) viven en su repositorio.

- **Taller**: Galivelop. Crea, investiga, innova y aprende; expone sus proyectos, no los vende.
- **Encargo**: proyecto de pago que alguien contrata directamente con un miembro del taller, no con Galivelop
  ([ADR 0001](docs/adr/0001-encargos-por-miembro.md); aún no se cuenta en la web).
- **Proyecto**: un desarrollo del taller con su ficha. Datos en `src/data/proyectos/<slug>.json`.
- **Ficha**: la página de un proyecto (`/proyectos/<slug>/`).
- **Apartado**: sección propia de una ficha (mundo, bestiario…), con elementos (`items`) y, opcionalmente, una
  galería por pestañas (`grupos`).
- **Línea de trabajo**: área en la que encaja un proyecto (`src/data/lineas.ts`).
- **Galería**: el carrusel de la ficha. Junta `capturas` (de la interfaz) e ilustraciones (`galeria`) con una
  pestaña por grupo.
- **Colaboración abierta / privada**: si se puede participar en el desarrollo de un proyecto.
- **Tarea semanal**: la tarea programada «Proyectos semanal», que cada domingo actualiza las fichas de todos los proyectos y la
  publica.
- **Bitácora**: `docs/traspaso.md`, el estado del trabajo para la siguiente sesión.
