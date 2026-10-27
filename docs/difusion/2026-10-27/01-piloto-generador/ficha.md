# Ficha: piloto-generador (2026-10-27)

La fuente de todo lo que se publica de esta pieza. Lo que no esté aquí, con su fuente, no sale en los canales.
Carpeta de la pieza: `docs/difusion/2026-10-27/01-piloto-generador/` (01 = número de la pieza del día).

Idiomas: es, en

## Canales

- x
- linkedin

## Qué se cuenta

- **En una frase (quien lo usa):** En la ficha del generador de imágenes del portal se ve, ronda a ronda, cómo mejora una misma imagen durante el piloto: del primer fondo a la pieza terminada.
- **En una frase (técnico):** Piloto de contenido de seis rondas con stable-diffusion.cpp sobre Vulkan y FLUX.2 klein 4B en una Steam Deck; la galería compara las rondas 1, 3 y 5 del Portal y de Tarkor.
- **Estado:** publicado en la web el 2026-10-27 (ficha del portal); el generador sigue en desarrollo (fase 2 de 6) y aún no se puede descargar.

## Hechos comprobados

| Dato | Fuente |
|---|---|
| Galivelop Image Generator es un servicio local de generación de imágenes con IA, uno por máquina y compartido por los proyectos del taller: recibe pedidos, genera intentos, deja elegir uno y lo entrega con su manifiesto; nada sale del equipo | `src/data/proyectos/galivelop-image-generator.json`, `resumen` |
| El piloto fueron seis rondas del 26 al 27 de octubre de 2026, en una Steam Deck con stable-diffusion.cpp sobre Vulkan y el modelo FLUX.2 klein 4B | mismo archivo, apartado `piloto`, `intro` |
| La ronda 1 hizo fondos de imagen social para siete proyectos | apartado `piloto`, «Ronda 1 · Fondos sociales» |
| En la ronda 3, el borrador pequeño cuesta en torno a una quinta parte y sirve para descartar pronto | apartado `piloto`, «Ronda 3 · Borrador y definitivo» |
| La ronda 5 hizo piezas cuadrada, vertical, cabecera y avatar para todos los proyectos | apartado `piloto`, «Ronda 5 · Piezas por formato» |
| La galería enseña las rondas 1, 3 y 5 del Portal y de Tarkor | apartado `piloto`, `grupos` (commit a5d2316) |
| Portal: en la ronda 1, una esfera de luz difusa que no se lee como un portal; en la 3, con el estilo elegido, una puerta de luz; en la 5, la cabecera con logo y lema | pies de `grupos[portal]` del apartado `piloto` |
| Tarkor: de columnas ante un atardecer genérico (ronda 1) a las agujas de roca del juego con luz natural (ronda 3) | pies de `grupos[tarkor]` del apartado `piloto` |
| En desarrollo: fase 2 de 6 (motor real); aún no se puede descargar | `fase`, `hitos` y `cifras` («2 / 6») del mismo archivo |
| La ficha está en https://zeldris.github.io/Portal-Galivelop/proyectos/galivelop-image-generator/ | respuesta 200 comprobada el 2026-10-27 |

## Imágenes

| Imagen | Texto alternativo | Canales |
|---|---|---|
| `medios/evolucion.webp` | es: Tres versiones de la misma imagen del Portal: en la ronda 1, una esfera de luz difusa; en la ronda 3, una puerta de luz con anillos en el suelo; en la ronda 5, la cabecera terminada con logo y lema. / en: Three versions of the same Portal image: in round 1, a diffuse sphere of light; in round 3, a doorway of light with rings on the floor; in round 5, the finished header with logo and tagline. | x |
| `medios/evolucion.png` | es: Tres versiones de la misma imagen del Portal: en la ronda 1, una esfera de luz difusa; en la ronda 3, una puerta de luz con anillos en el suelo; en la ronda 5, la cabecera terminada con logo y lema. / en: Three versions of the same Portal image: in round 1, a diffuse sphere of light; in round 3, a doorway of light with rings on the floor; in round 5, the finished header with logo and tagline. | linkedin |
| `medios/evolucion.en.webp` | en: Three versions of the same Portal image: in round 1, a diffuse sphere of light; in round 3, a doorway of light with rings on the floor; in round 5, the finished header with logo and tagline. | x |
| `medios/evolucion.en.png` | en: Three versions of the same Portal image: in round 1, a diffuse sphere of light; in round 3, a doorway of light with rings on the floor; in round 5, the finished header with logo and tagline. | linkedin |

## Uso interno

- Pieza hecha con la skill `gw-media-content-now` de Galivelop-workflow v0.4.2, leída del repo del flujo (el portal va en la 0.3.0 y no la tiene). Imágenes de la rama `piloto-imagenes` del generador.
- La imagen `evolucion` es la plantilla `antes-despues.html` adaptada a tres paneles; las fuentes `portal-r*.webp` son copia de `public/proyectos/galivelop-image-generator/piloto/`.
- Reddit: pendiente de que la persona elija subreddit y pegue sus normas.

## Publicado

| Canal | Idioma | Fecha | Enlace |
|---|---|---|---|
