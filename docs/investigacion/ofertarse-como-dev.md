# Cómo dicen otros desarrolladores que están abiertos a trabajar para otros

Consulta: 2026-10-26. Pregunta: cómo dicen los desarrolladores independientes y los colectivos, en su web personal o su
portafolio, que están abiertos a hacer proyectos para otros sin sonar a venta agresiva, y qué de eso encaja en la
ficha de `/equipo` y en la futura página de detalle `/equipo/<persona>` del portal (ADR 0001, encargos por miembro).

## Límite de la consulta

Desde el entorno de la consulta solo se podía llegar a `github.com` y `raw.githubusercontent.com`: el resto de
anfitriones (las webs publicadas, `docs.github.com`, `nngroup.com`, `gov.uk`, `linkedin.com`…) rechazaban la conexión.
Por eso **las fuentes son el código fuente público de cada web en GitHub, leído en el commit que indica la tabla**, y
no la página desplegada hoy: la frase existía en ese commit, pero la web viva puede haberla cambiado. Cada frase de la
tabla está copiada del archivo indicado; nada se cita de memoria. Cuando la web es antigua o es una plantilla, se
dice.

## Fuentes

Repositorios en `github.com/<usuario>/<repo>`; la fecha es la del commit leído (último de la rama por defecto).

| Fuente | Fórmula o qué hace | Dónde lo pone | Qué tomamos |
|---|---|---|---|
| GitHub Docs, `github/docs` (02c25d1, 2026-10-23), `content/account-and-profile/how-tos/account-settings/set-your-hiring-status.md` y `reference/personal-account-reference.md` | «When you select **Available for hire**, you indicate that you're open to job opportunities.» El ajuste se llama «Jobs Profile» y en la API REST es el campo `hireable`. | Interruptor del perfil de GitHub | Es una señal de **búsqueda de empleo**, no de servicios: no sirve como modelo para un taller. No copiar «Available for hire» como insignia. |
| Brittany Chiang, `bchiang7/v4` (539cef0, 2023-04-25; versión antigua de su web), `src/components/sections/contact.js` | «What’s Next?» / «Get In Touch» / «Although I’m not currently looking for any new opportunities, my inbox is always open. Whether you have a question or just want to say hi, I’ll try my best to get back to you!» Botón «Say Hello». | Última sección de la página única; menú: About, Experience, Work, Contact | Buzón abierto sin oferta: se dice que no se busca nada y se invita igualmente a escribir. Botón con verbo de saludo, no de compra. |
| Kent C. Dodds, `kentcdodds/kentcdodds.com` (16d1b6f, 2026-10-20), `content/pages/transparency.mdx`, `app/routes/contact.tsx`, `content/pages/office-hours.mdx` | «Consulting … Occasionally someone will grab an hour of my paid time.» En contacto: «Send me an email.» / «Like in the old days.» Horas de oficina: «Once a week, Kent is available for an hour to answer any questions you have.» | Página de transparencia (de dónde salen sus ingresos), página de contacto, página de horas de oficina | «Ocasionalmente» y una unidad pequeña (una hora) rebajan el peso de lo pagado. Hablar de dinero en una página de transparencia, no en la portada. |
| Kent C. Dodds, `app/routes/about.tsx` (mismo commit) | Titulares «How I got where we are now.», «Here are some of the values I live by.», «Curious to know the stuff I use?» | Página «about» | Orden de una página de persona: trayectoria, valores, herramientas. |
| Lynn Fisher, `lynnandtonic/lynnandtonic.com` (214c8f7, 2026-04-04), `_pug/archive/2019/about.pug`, `_pug/archive/2011.pug`, `_pug/archive/2007/about.pug` | 2019: «I’m available for hire on a very limited basis for fun things like illustration, hard CSS bugs, and custom sugar cookies.» 2011: «I am available for fine art or design commissions and marathon discussions of Battlestar Galactica.» 2007: «I am available for fine art commissions, website design … artistic conversation, and to watch Project Runway.» | Línea final de la presentación (versiones archivadas de su web) | Humor y límite explícito («muy limitada») en la misma frase. La versión actual (`_pug/about.pug`) ya no lleva la línea; solo un enlace de correo en el pie. |
| Lynn Fisher, `_pug/archive/2020/hire-me.pug` (mismo commit) | Página «Hire me»: «I’m a web designer and developer looking for my next gig», con apartados «What I’m looking for», «Things I’m good at», «Some of my work», «Job history». | Página propia, archivada | Es una búsqueda de empleo, tono directo. Contraejemplo de lo que el portal no quiere; útil por su orden de apartados. |
| swyx, `swyxio/swyxdotio` (10776f5, 2026-10-25), `src/lib/about/copy.js` | «I’m not taking new advising inquiries.» Presentaciones en tres longitudes (corta, media, larga) para quien lo invita. «This site is my public notebook…» y «there’s a separate /now page.» | Página «about» | Decir lo que **no** se acepta zanja el asunto sin vender. Biografía en tres longitudes para reutilizar. |
| Zach Leatherman, `zachleat/zachleat.com` (af410f6, 2026-10-23), `about.md` y `web/speaking-inquiries.md` | `about.md`: «You’re Reading About Me», con lista de contacto y preferencia por canal: Mastodon «(preferred)», Bluesky «(preferred)», correo «(not preferred)». Charlas: «I Can Say Words Out Loud At Your Event», con pautas propias y cierre «Sound good? Great! Email me and we can get started!» | Lista de contacto en «about»; página aparte solo para charlas | Decir qué canal prefiere cada persona. Una página aparte para cada tipo de petición, con tono llano y pautas, en lugar de una oferta general. |
| Phil Hawksworth, `philhawksworth/hawksworx.com` (acc6f5d, 2025-11-13), `src/site/ask-me/index.njk` | «Ask me anything» / «You've got questions? I might have answers. You can but ask!» / «Ask me to speak at your event» / «If you'd like me to speak at your conference, meetup, company, university, or school, then please get in touch.» Botón «Ask Phil about speaking». | Página propia «ask-me» | Formular la petición como pregunta al miembro («pregúntale»), no como contratación. |
| Eric Bailey, `ericwbailey/ericwbailey.website` (42929c2, 2026-10-20), `source/office-hours.njk` y `source/_includes/homepage/contact.njk` | Horas de oficina: «I’d like to help give back to an industry that’s given me so much.» Dos apartados: «What I’m offering» (viernes para «bounce ideas off of», con temas) y «What I’m not offering» («I will not be giving out job or internship offers, or legally binding advice … I will also not do your work for you»). Contacto: «Here’s how to get in contact with me, or see what I've been up to:» más lista de enlaces. | Página propia en el menú principal («Office Hours»); contacto como sección de la portada | Estructura «qué ofrezco / qué no ofrezco» para alinear expectativas. Motivación declarada («devolver») antes de la oferta. |
| Max Stoiber, `mxstbr/mxstbr.com` (736abe6, 2026-10-08), `app/(public)/readme/page.mdx` | «A user guide for Max and how I think to help you work with me.» «If I sent you this, it's because we will work together and I want to set us up for success.» | Página `/readme`, que se envía a quien va a trabajar con él | «Cómo trabajar conmigo» como documento de colaboración, no como anuncio: se da cuando ya hay trato. |
| Sara Soueidan, `SaraSoueidan/SaraSoueidan` (4a045b3, 2021-01-07), README | «I'm an independent UI engineer helping brands build modern, resilient, and inclusive Web user interfaces and design systems, with a strong focus on responsive design, performance, and accessibility.» | Presentación en el README de su perfil | Describir lo que se hace («ayudando a…») en lugar de «disponible»; la oferta va implícita en el verbo. |
| Cassidy Williams, `cassidoo/cassidoo` (c48d22c, 2026-03-02), README | «Hello, nerds» / «I code on occasion, believe it or not.» Boletín, Patreon, «ask me anything» y lista de lo que ha hecho. Sin línea de contratación. | Presentación en el README de su perfil | Una persona puede estar abierta (preguntas, boletín) sin una sola palabra de encargo. |
| Tania Rascia, `taniarascia/taniarascia.com` (eb61b7f, 2026-08-17), `src/pages/index.js` | «Hey, I'm Tania!» / «Principal software engineer, writer, all-around nerd.» / «A brief timeline» con etapas 1998–2006, 2007–2014, 2014–2020, 2021–ahora. | Portada | Cronología breve como credencial: se enseña el recorrido, no se pide nada. |
| Carlos Azaustre, `carlosazaustre/carlosazaustre.es` (de890e4, 2021-04-05), `content/pages/videollamada/index.mdx` y `about/index.mdx` | «Se trata de una video-llamada de 30 minutos entre tu y yo, dónde te ayudaré a despejar dudas…» «Admito un máximo de 5 consultas al mes. Cuando se llena el calendario, se cierra.» Y «Si no te deja, es que no tengo huecos disponibles.» En «Sobre mi»: «…trabajar como *freelance*.» como un dato más de su recorrido. | Página propia `/videollamada`; el trabajo por cuenta propia aparece en la biografía | Un cupo mensual es una forma honesta y poco comercial de limitar la disponibilidad. Mencionar el trabajo freelance como pasado, dentro de la biografía. |
| midudev, `midudev/midu.dev` (6f6dd65, 2024-11-24), `layouts/page/mentoring.html` | Mentoring: «Videollamada de 1 hora donde te ayudaré con todas las dudas que puedas tener sobre tu proyecto, tu carrera, proyectos de empresa…» «puede venir tanta gente como quieras… puedes compartir los gastos con más gente». | Página propia `/mentoring` | La oferta pagada se presenta como ayuda concreta de una hora, en segunda persona y en castellano llano. |
| Paco Coursey, `pacocoursey/paco` (e011620, 2022-04-04; el README la llama «outdated personal site from 2020»), `pages/contact.js` | «Get in touch.» y una dirección de correo con asunto «Hello». Nada más. | Página `/contact` con atajo de teclado `g c` | El mínimo posible: una frase y un correo. |
| Chris Coyier, `chriscoyier/chriscoyier` (49bd42f, 2022-03-16), README | «I'm a web designer and developer. I'm the co-founder of CodePen…» y enlace a «spoken at events». | Presentación en el README | Lista de lo hecho, con la charla como enlace aparte. No hay oferta. |
| Coopdevs, `coopdevs/coopdevs.org` (7269171, 2020-08-14), `_i18n/es.yml` | «Desarrollamos software libre para proyectos de la Economía Social y Solidaria. ¿Necesitas ayuda?» con enlace «Contacta con nosotros →»; sección «Líneas de actuación»; pie «Contáctanos». | Portada, justo bajo el titular | Cooperativa: la oferta es una pregunta («¿Necesitas ayuda?») y un enlace, tras decir qué se hace y para quién. |
| Enspiral, `enspiral/handbook` (c83b515, 2026-08-14), `src/guides/manage-enspiral-website-profile.md` y `src/foundation/board.md` | Perfil mínimo: nombre público y descripción pública de menos de 80 palabras; «Everything else is optional!!!»; «Keep bios to around 80 words». Biografías cortas en primera persona, p. ej. «I’m a community catalyst, worldbuilder, and storyteller.» | Guía interna para los perfiles de miembros de la red | Biografía de unas 80 palabras, primera persona, todo lo demás opcional. Encaja con una ficha por miembro. (El archivo contiene una contraseña de un servicio: no se copia ni se enlaza.) |

## Sin verificar

No se pudieron abrir (los anfitriones no eran accesibles) y por tanto no se citan como fuente:

- Las webs publicadas de todos los anteriores (solo se leyó su código en GitHub, en el commit indicado).
- Documentación oficial de LinkedIn sobre «Open to Work» y «Providing services»: solo aparecieron noticias de
  terceros en el buscador, que no son fuente primaria.
- `docs.github.com` en su dirección pública: la ruta del enlace se deduce de la ruta del archivo
  (`docs.github.com/account-and-profile/how-tos/account-settings/set-your-hiring-status`), no se abrió.
- Páginas `/now` (`nownownow.com/about`, `sive.rs/now2`, `sive.rs/now3`, de Derek Sivers): solo se vieron en resúmenes
  del buscador; no se afirma nada de ellas. El `/now` de swyx se menciona porque su `copy.js` lo cita, pero su
  contenido tampoco se leyó.
- Guías de tono y de páginas de equipo: NN/g (Nielsen Norman Group) sobre «About» y páginas de personas, y GOV.UK
  (diseño de contenidos). No se encontraron ni abrieron; **las observaciones sobre tono de este documento son
  conclusión propia a partir de las frases de la tabla, no de esas guías.**
- Sitios que se intentaron y no aportaron texto utilizable: `leerob/site` (ahora una plantilla genérica),
  `wesbos/website` (repositorio de 2019 sin la web actual), `jensimmons.com` (texto de relleno), `joshwcomeau`
  (no leído), `lengstorf.com` (solo un `index.html` mínimo), `jason.energy` (no leído),
  `thinkdobecreate` (2018, sin texto), `gaearon`, `tomitrescak` (no leídos).
- Estudios pequeños y cooperativas distintos de Coopdevs y Enspiral (thoughtbot, Igalia, Happy Bear Software…): no
  accesibles. La evidencia sobre colectivos se reduce a esas dos fuentes.

## Fórmulas que se repiten

1. **Buzón abierto sin oferta** (Brittany Chiang, Paco, Eric Bailey, Zach, Cassidy): contacto como invitación a
   hablar, no a comprar.
2. **Disponibilidad ocasional o limitada** (Kent «occasionally», Lynn «very limited basis», Carlos «máximo 5
   consultas al mes»): la apertura viene con un límite a la vista.
3. **Una página aparte por tipo de petición** (Phil y Zach para charlas, Eric para horas de oficina, Carlos y midudev
   para videollamadas, Max para colaborar): la portada no ofrece nada, la página específica lo explica.
4. **Decir lo que no se hace** (swyx «not taking new advising inquiries», Eric «What I’m not offering», Brittany «not
   currently looking»): alinea expectativas y baja la presión.
5. **La oferta como pregunta o como verbo, no como estado** (Coopdevs «¿Necesitas ayuda?», Phil «Ask me», Sara
   «helping brands…»): no hay etiqueta de «disponible».

Ninguna de las fuentes leídas usa una insignia de «disponible para contratar» en la ficha de la persona; el único caso
de esa etiqueta es el interruptor de GitHub, que se refiere a empleo.

## Propuestas para el portal

Alternativas a «Álvaro acepta proyectos de pago por su cuenta» y a la insignia «Acepta encargos», de menos a más
directa. Todas respetan el ADR 0001 (el taller no vende; cada miembro puede aceptar encargos contratados con él) y no
se publican hasta que la persona lo anuncie.

1. **Buzón abierto, sin mencionar dinero.** Inspira: Brittany Chiang (contacto), Paco.
   - es: «Si tienes una idea o un proyecto en el que Álvaro pueda echar una mano, escríbele.»
   - gl: «Se tes unha idea ou un proxecto no que Álvaro poida botar unha man, escríbelle.»
   - en: «If you have an idea or a project where Álvaro could lend a hand, drop him a line.»
2. **Colaboración ocasional.** Inspira: Kent C. Dodds («Occasionally…»), Lynn Fisher («very limited basis»).
   - es: «Álvaro colabora de vez en cuando en proyectos de otras personas. Si tienes uno, cuéntaselo.»
   - gl: «Álvaro colabora de cando en vez en proxectos doutras persoas. Se tes un, cóntallo.»
   - en: «Álvaro occasionally works on other people’s projects. If you have one, tell him about it.»
3. **Cómo colaborar con él.** Inspira: Max Stoiber (`/readme`), Zach Leatherman (pautas propias).
   - es: «Cómo colaborar con Álvaro: qué le interesa, cómo trabaja y por dónde escribirle.»
   - gl: «Como colaborar con Álvaro: que lle interesa, como traballa e por onde escribirlle.»
   - en: «Working with Álvaro: what he likes, how he works and the best way to reach him.»
4. **Qué sí y qué no.** Inspira: Eric Bailey («What I’m offering / What I’m not offering»), swyx.
   - es: «Qué hace con gusto: [lista]. Qué no hace: [lista]. Aquí no se vende nada; si encaja, hablamos.»
   - gl: «Que fai con gusto: [lista]. Que non fai: [lista]. Aquí non se vende nada; se encaixa, falamos.»
   - en: «What he is glad to do: [list]. What he doesn’t do: [list]. Nothing is sold here; if it fits, we talk.»
5. **Hueco limitado, a la vista.** Inspira: Carlos Azaustre («máximo 5 consultas al mes»), Lynn Fisher.
   - es: «Álvaro puede atender pocos encargos al año. Si tiene hueco, te lo dirá.»
   - gl: «Álvaro pode atender poucos encargos ao ano. Se ten oco, dirocho.»
   - en: «Álvaro can take on only a few commissions a year. If he has room, he will tell you.»
6. **Pregunta directa.** Inspira: Coopdevs («¿Necesitas ayuda?»), Phil Hawksworth («Ask me…»).
   - es: «¿Necesitas ayuda con un proyecto? Álvaro acepta encargos; escríbele y lo hablamos.»
   - gl: «Precisas axuda cun proxecto? Álvaro acepta encargos; escríbelle e falámolo.»
   - en: «Need a hand with a project? Álvaro takes on commissions; write to him and we’ll talk.»

Sobre la insignia: sustituirla por nada (opciones 1 a 3), o por una etiqueta de actividad y no de estado, como «Abre
conversación» / «Abre conversa» / «Open to a chat». «Disponible para contratar» (`Available for hire`) mezcla dos
cosas que la fuente oficial separa: en GitHub es una búsqueda de empleo. Las fuentes leídas no tienen insignias
equivalentes; esta etiqueta es una propuesta propia.

### Dónde ponerlo

- **Ficha en `/equipo`:** nada, o a lo sumo la opción 1 en una línea. Las fuentes ponen la oferta fuera de la
  presentación (Cassidy, Tania, Chris Coyier no la tienen).
- **Página de detalle `/equipo/<persona>`:** al final, como cierre de la ficha, con las opciones 2 a 5 según lo que
  quiera cada miembro (Brittany: última sección; Zach: contacto dentro del «about»; Max: documento aparte).
- **Banda de «Participa»:** una frase general del taller («Si quieres colaborar con el taller…») con enlace a las
  personas, sin precios; es el lugar para decir lo que el taller no vende. Coopdevs pone su pregunta justo bajo el
  titular, pero es una cooperativa que sí vende; el taller no, así que aquí se queda en la banda.
- **Página propia por tipo de petición** (opción 3 o 4): solo si un miembro la pide, y con enlace desde su detalle,
  nunca desde el menú principal (Phil, Zach, Carlos lo tienen aparte; Eric la pone en su menú, pero es su decisión).

### Estructura propuesta de la página de detalle, en orden

Sale de Kent (trayectoria, valores, herramientas), Tania (cronología), Enspiral (biografía de unas 80 palabras),
swyx (varias longitudes) y Zach (canal preferido).

1. Nombre, foto y una línea de rol («Desarrollador, …»).
2. Biografía corta en primera persona, unas 80 palabras (Enspiral); opcionalmente una versión larga plegada (swyx).
3. En qué trabaja dentro de Galivelop: enlaces a sus proyectos y líneas de trabajo del portal.
4. Recorrido: cronología breve (Tania) o «cómo llegué hasta aquí» (Kent).
5. Cómo trabaja y qué valora (Kent, Max); herramientas si aporta.
6. Dónde encontrarle, indicando el canal preferido (Zach).
7. Cierre opcional de colaboración: una de las opciones 1 a 5, o ninguna.

El apartado 7 va el último y es opcional por persona; si el miembro no quiere decir nada, la página se sostiene sin él.

### Notas para quien aplique esto

- Todo texto nuevo es visible en castellano, gallego e inglés (`visibleLanguages`); las tres versiones de arriba son
  borradores, el gallego conviene que lo revise un hablante.
- Las fuentes son una muestra de desarrolladores de habla inglesa y tres de habla hispana; solo Coopdevs y Enspiral
  son colectivos. No se ha encontrado un estudio con evidencia de qué fórmula convierte mejor; el criterio de «suave»
  es el de los textos leídos, no una medida.
