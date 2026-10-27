# 0002 · Galivelop, marca que contiene el taller y la oferta de productos e integrantes

- **Fecha:** 2026-10-27
- **Estado:** **aceptada** el 2026-10-27 como diseño; **nada implementado ni publicado**: Productos se crea en la web
  solo cuando haya un primer producto con forma. Sustituye en parte a la 0001.
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

## Decisiones de la persona (2026-10-27)

1. **Nombre y lugar:** «Productos», dentro del portal, `/productos`, cabecera partida en Taller | Productos.
2. **Precio:** no se publica ningún precio. Todo lo legal o financiero se resuelve por correo con Álvaro (un solo
   correo de contacto en Productos; no hay otro canal de momento).
3. **Responsable:** uno por producto, el creador del proyecto; la ficha indica los colaboradores, si los hay.
4. **Galivelop-workflow:** el plugin público se queda con todo lo cerrado antes de la v1.0.0. La **v1.0.0 es el
   producto**: se descarga en local, trae muchas más skills, ganchos, etc., y el rodaje de todos los proyectos de
   la marca. Soporte: por decidir con el producto (no se anuncia antes). **Orden obligatorio** (la persona,
   2026-10-27): primero sale la versión pública anterior a la 1.0.0 y rueda un tiempo, hasta ganarse la fama; solo
   entonces se habla de la 1.0.0 como producto. No se vende lo que nadie ha probado.
5. **galivelop-developer:** agente de código local, en fase 0.
6. **Integrantes:** cada integrante es autónomo. Galivelop solo promociona el talento que sale del taller y que
   Álvaro decide que entre en Productos, tras hablarlo con esa persona y con su acuerdo. El taller es para
   aprender; Productos, para promocionar.
7. **Salida:** nunca se publica nada que no tenga forma o no siga el flujo de versiones. Un proyecto en formación
   se puede como mucho **mencionar** como «próximamente» (sin ficha ni oferta). La v1.0.0 del flujo está lejos: no
   se anuncia. **Hoy no hay ningún producto con forma, así que Productos no se publica todavía**: esta ADR fija el
   diseño para cuando llegue el primero (confirmado por la persona).

### Cerrado el 2026-10-27

- (6) Un integrante promocionado muestra la información relevante que decida la sesión (nombre, foto, lo que
  ofrece, correo de contacto de Galivelop; sin tarifa ni disponibilidad) y **siempre un acceso a su perfil**
  (`/equipo/<id>`).
- (7) Confirmado: Productos se crea en la web solo cuando haya un producto con forma; mientras, los proyectos en
  formación salen solo como mención «próximamente» dentro del taller (la fila «Próximamente» del inicio) y no se
  crea `/productos`. Hasta entonces, esta ADR solo cambia documentación (0001, `GLOSSARY.md`, `AGENTS.md`).

## Consecuencias (si se acepta)

- La ADR 0001 queda parcialmente sustituida por esta (se anota en ella).
- Código nuevo (tipos, páginas, cabecera): pasa por las tres fases antes de `main`, con `/opt-tokens` y `/retro`
  (cambio grande).
- La tarea semanal también revisa las fichas de producto.
