# 0002 · Galivelop, marca que contiene el taller y la oferta de productos e integrantes

- **Fecha:** 2026-10-27
- **Estado:** **propuesta, en discusión** (nada publicado ni implementado). Se ajusta con la persona antes de tocar
  código; cuando se acepte, se actualiza esta ADR, la 0001 y `GLOSSARY.md`.
- **Decide:** Álvaro García Graña (fundador)

## Contexto

Hasta hoy Galivelop es solo el taller (ADR 0001): crea, investiga y aprende, expone sus proyectos y no vende; los
encargos de pago son de cada miembro y se dicen sin «de pago». Varios proyectos están llegando a un punto en el que
alguien puede usarlos o contratarlos, y se quiere dar el paso: **Galivelop pasa a ser la marca** que contiene dos
cosas distintas:

1. **El taller**, como hasta ahora (proyectos, líneas, muro, equipo, participa). Sigue sin vender.
2. **La oferta**: productos y servicios de la marca, y los integrantes que se pueden contratar. A futuro será «la
   empresa», pero cada miembro es autónomo y factura por su cuenta; Galivelop es la marca común, no una sociedad.

Productos de arranque (lo que dijo la persona el 2026-10-27):

| Producto | Qué se ofrece | Estado hoy |
|---|---|---|
| Galivelop-workflow | Aplicarlo o usarlo a partir de la **v1.0.0**, con un servicio de **soporte** | 0.4.x, en desarrollo |
| galivelop-voice-generator | Generador de voces | Solo el flujo instalado |
| galivelop-image-generator | Generador de imágenes (local, stable-diffusion.cpp) | F0 hecha, aún no genera |
| galivelop-developer | (por definir qué se ofrece) | Solo el flujo instalado |

Más **los integrantes**: cada miembro que quiera puede ofertarse (lo que hoy es `colabora` en su página).

## Propuesta de diseño (para ajustar)

### Vocabulario

- **Marca**: Galivelop. Contiene el taller y la oferta.
- **Taller**: lo de hoy. No vende.
- **Producto**: algo de la marca que alguien puede usar o contratar (software con versión usable, o un servicio
  asociado, como el soporte del flujo). Un producto nace de un proyecto del taller cuando llega a una versión
  usable; el proyecto no desaparece: la ficha del taller cuenta cómo se hace, la de producto para qué sirve y cómo
  conseguirlo.
- **Servicio**: oferta que presta una persona (soporte, implantación, un encargo). Siempre tiene un miembro
  responsable, que es quien factura.
- **Integrante ofertado**: miembro que se puede contratar; sustituye a «colabora de vez en cuando» de la 0001.

### Estructura de la web

- Cabecera con dos bloques: **Taller** (Proyectos, Muro, Equipo, Participa) y **Productos** (catálogo, integrantes).
- Inicio: el hero presenta la marca con las dos puertas; debajo, lo de hoy (taller) y una franja «Productos».
- Rutas nuevas: `/productos` (catálogo) y `/productos/<slug>` (ficha de producto). Los integrantes ofertados salen en
  el catálogo y en su página de miembro con un apartado «Servicios»; `/equipo` sigue siendo del taller.
- Las rutas actuales no cambian (riesgo alto: ya están indexadas y enlazadas).
- Todo en es, gl y en, como el resto.

### Datos

- `src/data/productos/<slug>.json`: `proyecto` (slug de la ficha del taller, si lo hay), `estado` (`disponible` |
  `proximamente`), `versionMinima` (p. ej. `1.0.0`), `queOfrece` (texto), `comoConseguirlo` (enlaces: instalar,
  descargar, pedir), `servicios` (lista: nombre, `responsable` = id de miembro, cómo contactar), `precio`
  (`a-consultar` | texto; por decidir si se publica).
- `src/data/equipo.json`: `colabora` pasa a `servicios` (lista de lo que ofrece cada miembro) y una marca
  `ofertado: true`.
- Un producto en `proximamente` sale en el catálogo sin enlace de compra: «se abre con la v1.0.0».

### Qué cambia de la ADR 0001

- Se mantiene: el taller no vende; cada miembro factura por su cuenta; Galivelop no intermedia.
- Cambia: ya **se dice** que la marca ofrece productos y que hay integrantes contratables, en su sitio (Productos),
  sin mezclarlo con el taller. «Sin "de pago" ni distintivos» queda solo para el taller.
- El mensaje de la marca en `AGENTS.md` («sin ánimo de vender en la web») se reescribe: el taller no vende, la marca
  ofrece.

### Fases propuestas

1. **Decisión**: cerrar esta ADR con la persona (preguntas de abajo), actualizar la 0001, `GLOSSARY.md` y el mensaje
   de la marca en `AGENTS.md`.
2. **Catálogo**: tipos y datos de producto, `/productos` con las cuatro tarjetas (todas «próximamente» salvo lo que ya
   se pueda usar), cabecera con los dos bloques, hero del inicio. Prototipo de UI con `prototype` antes de codificar.
3. **Ficha de producto** `/productos/<slug>` y enlace cruzado con la ficha del taller.
4. **Integrantes**: apartado «Servicios» en la página de miembro y su sitio en el catálogo.
5. **Legal**: aviso legal y privacidad (LSSI-CE; ya pendiente desde la 0001 y ahora necesario: la web oferta).
6. Tarea semanal: bloque para las fichas de producto en `docs/runbooks/tarea-semanal.md`.

## Preguntas abiertas (para la persona)

1. **Nombre y lugar**: ¿«Productos», «Servicios» o «Productos y servicios»? ¿Dentro del portal (`/productos`) o un
   sitio aparte? Propuesta: dentro, `/productos`, con la cabecera partida en Taller | Productos.
2. **Precio**: ¿se publica algo (desde X €, suscripción de soporte) o siempre «a consultar»? Propuesta de arranque:
   «a consultar» y un correo por producto.
3. **Quién factura cada producto**: cada producto con un miembro responsable (hoy, Álvaro en todos). ¿Un producto
   puede tener varios?
4. **Workflow v1.0.0+**: ¿qué se vende exactamente? El plugin es público; ¿la oferta es el soporte, la implantación
   en el proyecto del cliente, o también una versión con más cosas? ¿Qué incluye «soporte» (canal, tiempo de
   respuesta)?
5. **galivelop-developer**: ¿qué producto es?
6. **Integrantes**: ¿se ofrecen solo los que lo pidan (`ofertado`), con qué datos (servicios, disponibilidad,
   tarifa)? Hoy sería Álvaro; Raquel tiene `colabora` sin tarifa.
7. **Orden de salida**: ¿se publica el catálogo con todo «próximamente» (anuncia) o solo cuando haya un producto
   disponible (el flujo en 1.0.0)?
8. **Nombre legal**: la web dice «cada miembro factura por su cuenta». ¿Quieres que lo diga en Productos, o basta en
   el aviso legal?

## Consecuencias (si se acepta)

- La ADR 0001 queda parcialmente sustituida por esta (se anota en ella).
- Código nuevo (tipos, páginas, cabecera): pasa por las tres fases antes de `main`, con `/opt-tokens` y `/retro`
  (cambio grande).
- La tarea semanal también revisa las fichas de producto.
