# Pedido de voces: Model Atlas y proyectos que pasen a ficha (2026-11-27)

Texto para que la persona lo pase al generador de voces. **Estado:** los siete trozos de abajo son, tal cual y en
castellano, los `es` del guion `src/data/guiones/galivelop-models.json` (`narra` 2026-11-27), cada uno con su nombre
`<nn>-<seccion>.wav` (`nn`: el orden del trozo desde `01`, como en `docs/desarrollo.md`, «Guiones de lectura»). Si el
guion cambia antes de grabar, se vuelve a copiar aquí. El guion entra con `"audio": []` hasta que lleguen los MP3.

```text
Pedido del Portal Galivelop del 2026-11-27: guion de lectura de la ficha de Model Atlas, en castellano, con la voz lectora-es (la misma de los audios ya aprobados del portal). Proyecto portal; cada trozo va a final/es/galivelop-models/<nn>-<seccion>.wav.

Pronunciación: «Galivelop» ga-li-ve-LOP; «Model Atlas» a la inglesa (módel átlas); «Steam Deck» a la inglesa (estim dek); «Linux» (línux); «Windows» a la inglesa (uíndous); «Python» a la inglesa (páizon); «Evaluator» a la inglesa (evaliuéitor); «hardware» a la inglesa (járdgüer). El guion no dice «gmod» ni «IA»: dice «inteligencia artificial».

1. galivelop-models/01-cabecera.wav
¿Qué modelo de inteligencia artificial cabe en tu equipo? Esa es la pregunta que quiere responder Model Atlas. Es un catálogo único de los modelos locales que usa el taller, y de las máquinas donde corren. Versionado, y que se puede comprobar.

2. galivelop-models/02-vistazo.wav
¿En qué punto está? Está en desarrollo, con el código abierto. La versión publicada es la cero punto uno. Trae el catálogo inicial, con trece modelos y dos máquinas, y la detección del hardware del equipo. Lo siguiente son los esquemas y el encaje, la versión cero punto dos. Y falta algo importante, y lo contamos igual: probar la detección de verdad en la Steam Deck y en Windows. Lo último que ha cambiado lo tienes en las novedades, más abajo.

3. galivelop-models/03-resumen.wav
Las herramientas del taller que usan inteligencia artificial local llevaban cada una su propia lista de modelos. Los mismos modelos, descritos varias veces, y no siempre igual. Model Atlas los reúne en un solo catálogo. De cada modelo dice con qué variante se descarga, de dónde sale y con qué licencia. Cada máquina es un perfil con nombre, y la Steam Deck es el mínimo de referencia. El atlas también lee el hardware de tu equipo, en Linux y en Windows. Todo se puede comprobar, porque cada origen queda fijado a una revisión concreta. Y está en camino el veredicto de si un modelo cabe o no cabe en una máquina. El atlas no descarga, no ejecuta y no mide modelos: eso sigue siendo cosa de cada herramienta.

4. galivelop-models/04-afondo.wav
Si quieres ir a fondo, hay tres apartados. El primero cuenta qué hay hoy en el catálogo: modelos de texto, de imagen y de voz, las máquinas, los orígenes y las licencias. El segundo es el vocabulario del atlas: modelo, variante, máquina, encaje, medida y recomendación. Y el tercero dice dónde acaba, lo que el atlas no hace.

5. galivelop-models/05-tecnica.wav
¿Y cómo está hecho? Cada herramienta trabajará con una copia del catálogo, con una huella que dice de qué versión sale. Sin red y sin servidor. El atlas no mide: las medidas las hace Galivelop Evaluator, y el atlas solo las cita. Una licencia sin confirmar no permite ningún uso, hasta que se confirme. Y cada origen apunta a una revisión concreta, para que lo que se descarga mañana sea lo mismo que hoy. Está escrito solo con la biblioteca estándar de Python. Por el camino aprendimos que antes de unificar hay que comparar. Y que el nombre con el que se descarga un modelo no dice todo lo que hay detrás.

6. galivelop-models/06-avance.wav
En el avance ves el camino. Ya están hechos el diseño y la primera versión, con el catálogo y la detección. Después vienen los esquemas y el encaje, que dirán si un modelo cabe. Luego, la exportación para cada herramienta, con la línea de órdenes. Y al final, las medidas reales. Debajo están las novedades, semana a semana.

7. galivelop-models/07-participar.wav
Model Atlas está abierto a colaboración, y el código es público. Si quieres aportar, aprender o simplemente saber más, escríbenos y te contamos cómo. Gracias por escuchar.

Al entregarlos, dime cuáles están aprobados para pasarlos a MP3 en el portal.
```

## Cuando Forge, Runtime y Worlds tengan página

Hoy son tarjetas «Próximamente» y no llevan guion ni audio. Cuando pasen a ficha hará falta, por cada uno:

- Un guion `src/data/guiones/<slug>.json` (`galivelop-forge`, `galivelop-runtime`, `galivelop-worlds`), en es, gl y en,
  con `"audio": []` hasta tener los MP3.
- Un pedido de voz como este, con la voz `lectora-es`, sus trozos `final/es/<slug>/<nn>-<seccion>.wav` y sus notas de
  pronunciación (`gforge`, `grun`, «Forge», «Runtime» y «Worlds» a la inglesa; a confirmar).
- Revisar el trozo de proyectos de `inicio.json` (`proyectos`): la tarjeta pasa de «Próximamente» a ficha y su audio se
  regraba.
- Los MP3 (`ffmpeg`, 48 kbps mono) los pasa la persona; este pedido no graba ni toca `.mp3`.
