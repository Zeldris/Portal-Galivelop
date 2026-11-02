# Ficha: <tema> (AAAA-MM-DD)

La fuente de todo lo que se publica de esta pieza. Lo que no esté aquí, con su fuente, no sale en los canales.
Carpeta de la pieza: `<dir>/AAAA-MM-DD/NN-<tema>/` (NN = número de la pieza del día).

Idiomas: es, en

## Canales

- x
- reddit
- linkedin
- discord

## Qué se cuenta

- **En una frase (quien lo usa):** {{…}}
- **En una frase (técnico):** {{…}}
- **Estado:** {{publicado en la versión X / fusionado el AAAA-MM-DD / en desarrollo}}

## Hechos comprobados

| Dato | Fuente |
|---|---|
| {{dato}} | {{archivo, PR, CHANGELOG o enlace donde se comprueba}} |

## Reddit

Solo si `reddit` está en `## Canales`. Por cada subreddit, una línea `Subreddit:` y, debajo, un apartado
`### Normas de r/<nombre>` con las normas pegadas tal cual (200 caracteres como mínimo). Lee las normas y apunta el día:
`Normas leídas:` no puede estar en el futuro ni tener más de 90 días (contados desde la carpeta de fecha de la pieza).
Las tres líneas de campos van antes del primer `###`, y el texto pegado no puede llevar títulos con `#` (pégalos como
líneas normales): un título corta el bloque.

- **Subreddit:** r/{{subreddit}}
- **Normas leídas:** AAAA-MM-DD
- **Autopromoción:** {{lo que dicen las normas sobre promocionar lo propio, y cómo lo cumple esta pieza}}

### Normas de r/{{subreddit}}

{{pega aquí las normas del subreddit, tal cual}}

## Imágenes

Una fila por cada archivo de `medios/` que se usa (`.webp` para X y Discord, `.png` para LinkedIn, `.pdf` para un
carrusel de LinkedIn). El texto alternativo describe lo que se ve de la pieza, con el formato `es: texto / en: text`.
El primer idioma de `Idiomas:` usa `medios/<n>.webp`; otro idioma puede tener su propia imagen
`medios/<n>.<idioma>.webp` (fuente `<n>.<idioma>.html`), con su fila y el texto alternativo en ese idioma.

| Imagen | Texto alternativo | Canales |
|---|---|---|
| `medios/tarjeta.webp` | es: {{qué se ve}} / en: {{what is shown}} | x, discord |
| `medios/tarjeta.png` | es: {{qué se ve}} / en: {{what is shown}} | linkedin |

## Uso interno

Lo que sirve al equipo y no se publica: ids de tareas, ramas, PRs y notas. Nada de esto va en los canales.

- {{…}}

## Publicado

| Canal | Idioma | Fecha | Enlace |
|---|---|---|---|
