# 0002 · Galivelop, marca que contiene el taller y la oferta de productos e integrantes

- **Fecha:** 2026-10-27
- **Estado:** **aceptada** el 2026-10-27; **fase 2 en la rama de trabajo** (2026-10-27, decisión de la persona:
  «vamos a aplicarlo ya en la web»): `/productos` con los cuatro productos como «próximamente», la franja del inicio
  y el enlace de la cabecera. Sin publicar en `main` hasta que la persona lo vea y confirme. Sustituye en parte a
  la 0001.
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

## Diseño (ajustado con las decisiones de abajo)

### Vocabulario

- **Marca**: Galivelop. Contiene el taller y la oferta.
- **Taller**: lo de hoy. No vende.
- **Producto**: algo de la marca que alguien puede usar o contratar (software con versión usable, o un servicio
  asociado, como el soporte del flujo). Un producto nace de un proyecto del taller cuando llega a una versión
  usable; el proyecto no desaparece: la ficha del taller cuenta cómo se hace, la de producto para qué sirve y cómo
  conseguirlo.
- **Servicio**: oferta que presta una persona (soporte, implantación, un encargo). Siempre tiene un miembro
  responsable, que es quien factura.
- **Integrante promocionado**: miembro del taller que Álvaro propone para Productos y que acepta. Sustituye a
  «colabora de vez en cuando» de la 0001 en Productos; en el taller, la 0001 sigue igual.

### Estructura de la web

- Cabecera con dos bloques: **Taller** (Proyectos, Muro, Equipo, Participa) y **Productos** (catálogo, integrantes).
- Inicio: el hero presenta la marca con las dos puertas; debajo, lo de hoy (taller) y una franja «Productos».
- Rutas nuevas: `/productos` (catálogo) y `/productos/<slug>` (ficha de producto). Los integrantes promocionados
  salen en el catálogo (con la información relevante y siempre un enlace a su página de miembro) y en su página con
  un apartado «Servicios»; `/equipo` sigue siendo del taller.
- Contacto único: el correo de Galivelop (Álvaro). Sin precios ni formularios; lo legal y lo financiero, por correo.
- Las rutas actuales no cambian (riesgo alto: ya están indexadas y enlazadas).
- Todo en es, gl y en, como el resto.

### Datos

- `src/data/productos/<slug>.json` (`src/data/productos.ts`): `slug`, `nombre`, `orden`, `acento`, `icono`,
  `proyecto` (slug de la ficha del taller) o `proximo` (slug de la fila «Próximamente»; uno de los dos),
  `estado` (`disponible` o `proximamente`), `version` (la que se ofrece, si la hay), `queOfrece` (texto),
  `servicios` (lista de textos), `responsable` (id de miembro, el creador), `colaboradores` (ids). Sin campo de
  precio ni de cómo conseguirlo: todo por correo («Me interesa»).
- `src/data/equipo.json`: `promocionado: true` y `servicios` (lista de lo que ofrece) en quien entre en Productos;
  `colabora` se queda para el taller (0001).
- Un producto que aún no se puede descargar entra con `estado: proximamente`: se oferta igual (tarjeta, «Me
  interesa»), con una etiqueta y sin explicar en la web cómo va (decisión de la persona, 2026-10-27).

### Qué cambia de la ADR 0001

- Se mantiene: el taller no vende; cada miembro factura por su cuenta; Galivelop no intermedia.
- Cambia: ya **se dice** que la marca ofrece productos y que hay integrantes contratables, en su sitio (Productos),
  sin mezclarlo con el taller. «Sin "de pago" ni distintivos» queda solo para el taller.
- El mensaje de la marca en `AGENTS.md` («sin ánimo de vender en la web») se reescribe: el taller no vende, la marca
  ofrece.

### Fases propuestas

1. **Decisión** (hecha el 2026-10-27): esta ADR, la 0001, `GLOSSARY.md` y el mensaje de la marca en `AGENTS.md`.
2. **Catálogo** (en la rama, 2026-10-27): tipos y datos de producto, `/productos` con productos e integrantes,
   enlace «Productos» en la cabecera (separado del taller) y franja «Productos» en el inicio. Sin prototipo aparte:
   se enseña el build con capturas.
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
   se anuncia como descarga. **Revisado el mismo día:** la persona pide aplicarlo ya en la web y ofertar los cuatro
   productos como «próximamente», limpio, sin contar en la web cómo va cada uno.

### Cerrado el 2026-10-27

- (6) Un integrante promocionado muestra la información relevante que decida la sesión (nombre, foto, lo que
  ofrece, correo de contacto de Galivelop; sin tarifa ni disponibilidad) y **siempre un acceso a su perfil**
  (`/equipo/<id>`).
- (7) Primero se confirmó no crear `/productos` hasta el primer producto con forma; después, el mismo día, la
  persona decidió crearla ya con los cuatro productos como «próximamente» (sin paréntesis ni explicaciones de
  estado en los textos). La fila «Próximamente» del inicio (taller) se queda como está.

### Cómo se dice (2026-10-27, decisión de la persona: «Me valen todas, adelante»)

Tras revisar con otra IA cómo lee la web un posible cliente («no son proveedores»), el modelo no cambia (el taller no
vende, cada miembro trabaja por su cuenta, Galivelop no intermedia), pero **la web lo dice en positivo**: sin
frases que niegan («aquí no se vende», «no nos mueve el beneficio económico», «el taller no vende»), con «algunos
miembros aceptan encargos, cada uno por su cuenta» como camino para quien quiere contratar, y «código privado» en
vez de «proyecto privado / no abierto a colaboración». No se afirma nada que no sea cierto (ni clientes, ni casos,
ni testimonios), y se mantiene «por su cuenta y no a través de Galivelop». Dominio y correo propios: descartados
por ahora.

## Consecuencias (si se acepta)

- La ADR 0001 queda parcialmente sustituida por esta (se anota en ella).
- Código nuevo (tipos, páginas, cabecera): pasa por las tres fases antes de `main`, con `/opt-tokens` y `/retro`
  (cambio grande).
- La tarea semanal también revisa las fichas de producto.
