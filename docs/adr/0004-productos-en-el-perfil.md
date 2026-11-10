# 0004 · Productos, dentro del perfil de cada miembro

- **Fecha:** 2026-11-10
- **Estado:** **aceptada** el 2026-11-10 (la persona: «la sección de productos la vamos a quitar del menú y de la
  página principal y la vamos a poner dentro del perfil de cada miembro, siempre que ese miembro tenga algún producto
  en desarrollo»). Sustituye en parte a la [0002](0002-marca-taller-y-productos.md) y a la
  [0003](0003-codigo-abierto-e-implantacion.md): cambia **dónde** se ven los productos, no qué se ofrece ni cómo.
- **Decide:** Álvaro García Graña (fundador)

## Contexto

Desde la 0002, los productos tenían página propia (`/productos`), enlace en la cabecera y el pie, y una franja en la
portada. La persona quiere que la portada y el menú sean del taller y que cada producto se vea junto a quien lo hace.

## Decisión

- **Fuera:** el enlace de la cabecera y del pie, la franja de la portada y su botón del inicio. En su sitio del menú y
  del inicio entra **Novedades** (`/novedades`), con lo último de todas las fichas y del muro.
- **Dentro del perfil** (`/equipo/<id>`): una sección «Productos» con **todos** los productos en que el miembro es
  responsable o colaborador, disponibles y próximamente. Si no tiene ninguno, la sección no sale. La tarjeta no repite
  al propio miembro entre las personas.
- **`/productos` queda como página de paso** a `/equipo`: ya está compartida e indexada, así que no da 404. Su página
  estática es `noindex`, con la canónica y un `meta refresh` a `/equipo` en su idioma; sale del sitemap. Con JS, un
  `<Navigate>`.
- Lo demás de la 0002 y la 0003 sigue: código abierto para lo maduro, implantación y servicio de Álvaro, sin precios,
  «Me interesa» por correo, «próximamente» sin explicar cómo va.

## Consecuencias

- Los campos `promocionado` y `servicios` de `equipo.json` ya no los usa la web (eran para la lista de integrantes de
  `/productos`). Se dejan hasta decidir si se borran.
- La tarea semanal y la skill `gw-portal` siguen manteniendo `src/data/productos/` igual; solo cambia dónde se ven.
