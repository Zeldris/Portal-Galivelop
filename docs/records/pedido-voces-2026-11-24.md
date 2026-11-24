# Pedido de voces: tanda de grabación de la auditoría de marca (2026-11-24)

Texto para que la persona lo pase al generador de voces. G2 (trozos 6 y 7 de abajo) entra en `src/data/guiones/inicio.json`, con `data-guion="productos"` en `.banda-productos` de `src/pages/Inicio.tsx`, **cuando llegue su audio**: el test de `guiones.test.ts` exige el MP3 de cada trozo. G13 (toVeriAI, `vistazo`) queda fuera hasta confirmar el móvil.

```text
Pedido del Portal Galivelop del 2026-11-24: regrabación de guiones de lectura, en castellano, con la voz lectora-es (la misma de los audios ya aprobados del portal). Proyecto portal; cada trozo va a final/es/<página>/<nn>-<seccion>.wav. Sustituye al WAV que haya con ese nombre.

Pronunciación: «Galivelop» ga-li-ve-LOP; «IG» letra a letra, «i-ge»; «workflow» a la inglesa (uórk-flou); «Developer» y «Evaluator» a la inglesa (diveloper, ivaliueitor); «Steam Deck» a la inglesa (estim dek); «World-Maker-Fantasy» a la inglesa (uérld méiker fántasi); «Management Center» a la inglesa (mánach-ment cénter); «Discord» a la inglesa.

1. galivelop-image-generator/02-vistazo.wav
¿En qué punto está? Está en desarrollo, con el código abierto. La última versión publicada es la cero punto seis, y la cero punto siete, con la hoja de marca como datos, ya está terminada y a falta de publicarse. Ahora trabaja en la pieza de marca, la versión cero punto ocho. Y faltan cosas importantes, y lo contamos igual: comprobar a mano en la Steam Deck el recorrido completo de la interfaz, y probar el servicio con el juego World-Maker-Fantasy. Lo último que ha cambiado lo tienes en las novedades, más abajo.

2. galivelop-image-generator/08-participar.wav
Galivelop IG está abierto a colaboración, y el código es público. Si quieres aportar, aprender o simplemente saber más, escríbenos y te contamos cómo. Y si quieres que lo implantemos en tu proyecto, cuéntanoslo también. Gracias por escuchar.

3. galivelop-workflow/07-avance.wav
En el avance ves el camino. Las primeras versiones y los pilotos ya están hechos, y también las que añadieron la base, la medida del gasto, las preguntas con otros agentes y, la última, la interfaz, con idiomas configurables, perfiles de instalación y pruebas de interfaz. Lo que falta: la versión cero punto diez, una versión estable, con un repaso de la documentación y la seguridad. Y la uno punto cero llegará con un panel local, el Management Center, para consultar y configurar. Debajo están las novedades, semana a semana.

4. galivelop-workflow/08-participar.wav
Galivelop-workflow está abierto a colaboración, y el código es público. Si quieres aportar, aprender o simplemente saber más, escríbenos y te contamos cómo. Y si quieres que lo implantemos en tu proyecto, cuéntanoslo también. Gracias por escuchar.

5. equipo/02-alvaro-garcia-grana.wav
Empezamos por Álvaro García Graña, fundador del taller. Es arquitecto de software e ingeniero de sistemas de inteligencia artificial, y le interesa sobre todo la infraestructura que funciona en local. Creó Tarkor, Galivelop-workflow y Galivelop IG, y forma parte del equipo de toVeriAI. Además, lleva dos productos del taller: Galivelop Developer y Galivelop Evaluator. Pulsa Ver perfil para conocer más de él.

6. inicio/05-participa.wav (se regraba: ya no acaba en «Gracias por escuchar»)
Para terminar, una pregunta: ¿creamos juntos? Galivelop crece con las personas que se suman. No pedimos experiencia: pedimos ganas de construir, de aprender y de hacerlo en equipo. Hay tres caminos. Puedes colaborar en un proyecto abierto, con código, arte, textos, pruebas o investigación. Puedes proponernos ese proyecto que parece imposible. O puedes venir a aprender, que el mejor sitio para hacerlo es un proyecto de verdad. Funciona así: nos escribes, hablamos para ver dónde encajas, empiezas con una tarea pequeña y, desde ahí, creces a tu ritmo. Si tienes un proyecto propio, algunos miembros del equipo aceptan encargos, cada uno por su cuenta: en su perfil ves su trabajo y cómo escribirle. Y si quieres conocernos antes, o solo lanzar una idea, te esperamos en Discord.

7. inicio/06-productos.wav (trozo nuevo)
Y antes de irte, una cosa más: del taller salen también dos productos de Álvaro, Galivelop Developer y Galivelop Evaluator. Los ves en la página de productos. Gracias por escuchar.

Al entregarlos, dime cuáles están aprobados para pasarlos a MP3 en el portal.
```
