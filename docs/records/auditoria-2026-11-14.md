# Auditoría completa del portal · 2026-11-14

Pedida por la persona: «auditoría completa de toda la web, de la hoja de estilos y de todo», más una de responsive y
adaptativa con la web probada a mano y otra del contenido de la web y de cada proyecto. Rama `ccr-5c066d81-ndsd13`.

## Veredicto

**La web está bien en lo básico.** No hay errores de consola, enlaces rotos (171 destinos internos, todos 200), imágenes
sin `alt`, saltos de encabezado, scroll horizontal (320–1920 px, en los dos temas) ni repos privados enlazados. Las
cifras coinciden en es, gl y en.

Los problemas reales estaban en tres sitios: la **accesibilidad del foco y el contraste**, el **menú entre 861 y
1100 px** y algunos **datos de las fichas que se habían quedado atrás** respecto a sus repos. Todo lo grave y lo medio
está arreglado en tres commits; lo leve que queda está abajo y en «Pendiente» de la bitácora.

## Siete auditorías

| Auditoría | Graves | Medios | Leves |
|---|---|---|---|
| Hoja de estilos (`global.css`) | 2 | 3 | 6 |
| Código React | 0 | 2 | 9 |
| Navegador, probada a mano (Chromium) | 0 | 3 | 4 |
| Responsive y adaptativa | 3 | 3 | 6 |
| Contenido de la web | 0 | 1 | 5 |
| Fichas A (Tarkor, toVeriAI) | 0 | 4 | 5 |
| Fichas B (IG, flujo, Próximamente, equipo) | 0 | 4 | 4 |

Varios hallazgos se repiten entre auditorías (el cambio de idioma, el submenú, el contraste de `.sobre-marca b`).

## Arreglado

**Estilos (f134b44)**
- Foco visible en `.boton` (el `clip-path` recortaba el contorno) y token `--foco` por tema y por fondo: contraste del
  foco de 2,78 a 5,15:1 (WCAG 1.4.11).
- Bordes de los campos: de 1,6 a 3,7:1 (claro) y 4,8:1 (oscuro). `.saltar` en oscuro, de 2,78 a 6,53:1.
  `.sobre-marca b`, de 2,70 a 5,15:1.
- El menú pasa a hamburguesa por debajo de 1100 px: la cabecera ya no se sale entre 861 y 1040 px, y en tablet el
  submenú no depende del hover.
- Menú móvil con scroll cuando la pantalla es baja; barras pegajosas sueltas en horizontal (menos de 520 px de alto).
- Objetivos táctiles de al menos 24 px (WCAG 2.5.8). Limpieza de reglas duplicadas y variables sin uso.

**Contenido (a28a6a1)**
- toVeriAI: peso de la transparencia (~19 %, era un dato falso), nombre del hito 1.12, novedad del 2026-11-02, base de
  datos (MySQL 8 · TiDB Cloud) y sin «Cloudflare» en Despliegue.
- Galivelop IG: versión 0.5.0 y «4 / 8» fases. Flujo: la 0.7 como próxima, no en marcha; fecha de la 0.4.3.
- Tarkor: «+4.200» tests, con su fuente. README: «taller independiente». Gallego: «obradoiro», «Escribirlle a».

**Componentes (8235148)**
- Cambiar de idioma ya no remonta la app: se conservan el foco, lo escrito en los formularios y la galería.
- Submenú «Proyectos»: hover solo con ratón, el clic tras el hover no lo cierra, Escape devuelve el foco al botón y se
  cierra cuando el foco sale con Tab. Escape cierra también el menú móvil.
- Tras navegar, el foco pasa al contenido. Un trozo de página que falla al cargar se reintenta. El 404 toma el idioma
  solo del primer segmento. «Copiar» avisa si falla. Inicio con título; `aria-current="location"`; el `alt` de las
  imágenes ampliables llega al lector de pantalla.

## Decidido no tocar

- **El avance de «Próximamente»** (fases y siguiente paso): la persona, «Dejarlo como está» (igual que el 2026-11-09).
- **El «Gali» del logotipo** en celeste (2,78:1): es logotipo, exento por WCAG 1.4.3.
- **/productos sin `h1`**: es una página puente que redirige a /equipo.

## Pendiente (leve)

- Imágenes sin `srcset`: el móvil descarga lo mismo que el escritorio.
- El tema no sigue `prefers-color-scheme` sin tema guardado; sin CSS para `forced-colors` ni `prefers-contrast`.
- Celdas huérfanas en rejillas, collage del hero descentrado a 768 px y safe areas.
- /muro sin página estática mientras no haya publicaciones.
- Nombres de zona de Tarkor en gallego: contrastar con el glosario del juego.
- Contar de verdad los tests de Tarkor (pide su base de datos) y los de IG.
- Al cambiar de idioma, el scroll se conserva aproximado, no al píxel.
- Sin medir: el foco sobre las fotos de la galería y el visor, y el submenú con toque real en tablet.
- Los tests nuevos de accesibilidad no se pasaron por `red-without-fix.sh`.
- Solo se probó Chromium: falta Safari y Firefox, y un dispositivo real (lo comprueba la persona).

## No comprobado

Los enlaces externos (GitHub, toveriai.com) no se pudieron abrir: el proxy del entorno devuelve 403.
