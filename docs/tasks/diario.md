# Diario del taller (Q-32, Q-37 a Q-42)

**Estado:** en curso (2026-11-26). Prototipo aprobado: https://claude.ai/artifact/QHa1FGPtHzvaZZd9AY32Pz (copia del
HTML en `docs/tasks/diario-prototipo.html`).

Artículos largos sobre cómo se construye lo del taller. Decidido por la persona (docs/questions.md, Q-37 a Q-42):

- **Q-37** `/diario` (índice) y `/diario/<slug>` (entrada), con enlace discreto en la cabecera tras «Productos» (mismo
  estilo que `nav-productos`, también en el menú móvil y en la cabecera estática) y una banda al final del inicio,
  tras la de productos, con la última entrada.
- **Q-38** Cabecera de la entrada en bloque celeste hondo con chaflán (esquina inferior derecha), migas encima;
  metadatos en mono: fecha, «Escribe», lectura en minutos **calculada** (palabras del idioma / 200, hacia arriba,
  mínimo 1) y proyecto relacionado.
- **Q-39** Firma enlazada a `/equipo/<id>`; puede firmar cualquier miembro de `equipo.json`.
- **Q-40** Figura fija (en reposo); animación solo opcional.
- **Q-41** Cada entrada en es, gl y en (regla de los tres idiomas, sin excepción).

## Plan cerrado

**Datos** — `src/data/diario/<slug>.json`, cargados por `src/data/diario.ts` (`import.meta.glob`, como
`productos.ts`): `entradas` de la más nueva a la más vieja, `buscarEntrada(slug)`, `minutosLectura(entrada, idioma)`.

```ts
interface EntradaDiario {
  slug: string;
  fecha: string;            // AAAA-MM-DD: fecha de la entrada, `lastmod` del sitemap y `datePublished`
  autor: string;            // id de equipo.json
  proyecto?: string;        // slug de una ficha de src/data/proyectos/
  titulo: Texto;
  bajada: Texto;            // entradilla bajo el título
  descripcion: Texto;       // buscadores y redes, ≤ 160 caracteres
  secciones: { etiqueta: Texto; titulo: Texto; bloques: Bloque[] }[];
}
type Bloque =
  | { tipo: 'parrafo'; texto: Texto }                              // `código` entre comillas invertidas → <code>
  | { tipo: 'decision'; texto: Texto; cita: Texto }               // recuadro «Decisión» con borde celeste
  | { tipo: 'lista'; titulo: Texto; items: Texto[] }              // recuadro «Qué cambió», «Qué aprendimos»
  | { tipo: 'animacion'; proyecto: string; id: string; pie: Texto }; // una animación de una ficha, en reposo
```

`animacion` pinta `AnimacionFlujo` (cargado con `lazy`, como en `Proyecto.tsx`) solo con esa animación de la ficha:
empieza quieta y «Reproducir» es opcional (Q-40). En el HTML estático, su `<ol>` de pasos como en la ficha.

**Primera entrada** — `como-dibujamos-el-relevo`, fecha 2026-11-26, autor `alvaro-garcia-grana` (el id que tenga en
`equipo.json`), proyecto `galivelop-workflow`, figura `animacion` `relevo`. Texto: el del prototipo, **corregido con
las fuentes** (`docs/records/retro-2026-11-09-animaciones-workflow.md`, `docs/records/handoff-archive.md`,
`git log`): la implementación fue entera al modelo grande y partirla (lógica al grande, datos y textos al barato) es
lo que se aprendió en la retro (T-a), no lo que se decidió antes; la galería pasó de 7 a 3 imágenes y la explicación
la llevan las animaciones. Una frase entre comillas atribuida a la persona solo si está literal en el repo; si no,
sin comillas. Mensaje de la marca: `docs/desarrollo.md#mensaje`.

**Páginas** — `Diario` (índice: migas, título, intro, una tarjeta por entrada con fecha, título enlazado, bajada,
autor y lectura) y `EntradaDiario` (prototipo: migas, cabecera, artículo con `h2` y su etiqueta en mono, bloques, pie
con anterior / siguiente y ficha del proyecto; slug desconocido → `NoEncontrado`). `src/rutas.ts`,
`src/paginas.ts`, `src/App.tsx`. Estilos en `src/estilos/diario.css` (importada desde `global.css`), con los tokens
existentes y su tema oscuro; nada de colores sueltos. Textos visibles en `src/i18n/textos.ts` (`diario.*`), es/gl/en.

**Estáticas y SEO** — `scripts/paginas-estaticas.mjs`: `diario` en `FIJAS` y una página por entrada e idioma;
`cuerpo()` en HTML simple; JSON-LD `Blog` (índice, con `blogPost`) y `BlogPosting` (entrada: `headline`,
`datePublished`, `author` `Person` con su url de perfil, `inLanguage`, `publisher`); `og:type` `article` en la
entrada; sitemap con `lastmod` = `fecha`; sección «Diario» en `llms.txt`; enlace en la cabecera estática. Imagen OG,
la del portal. `npm run seo` sin errores. **Cambio de rutas: afecta al SEO** (rutas nuevas, ninguna cambia).

**Documentación** — `docs/desarrollo.md` («Diario del taller»: qué es y cómo añadir una entrada) y `GLOSSARY.md`
(«diario», «entrada»).

## Trozos

1. Datos, primera entrada (es/gl/en), `diario.ts`, tests de datos (autor y proyecto existen, tres idiomas en cada
   texto, slugs únicos, `minutosLectura`), textos `diario.*`.
2. Páginas, rutas, cabecera, banda del inicio, estilos, guion si los tests lo piden, tests de rutas y páginas.
3. Generador estático, SEO, `llms.txt`, sitemap, documentación y glosario.

## Hecho

- Trozo 1 (2026-11-26): `src/data/diario.ts` (`entradas`, `buscarEntrada`, `textosDe`, `minutosLectura`), primera entrada
  `src/data/diario/como-dibujamos-el-relevo.json` en es/gl/en (corregida con la retro de 2026-11-09 y `git log`: sin
  citas atribuidas a la persona, porque ninguna está literal en el repo), `src/data/diario.test.ts` y claves `diario.*` y
  `nav.diario` en `src/i18n/textos.ts`. Para las migas, la página reutiliza `productos.migas`; para el antetítulo de la
  banda, `diario.titulo` (`textos.test.ts` rechaza claves con el mismo texto en los tres idiomas).

## Falta

- Los trozos 2 y 3; luego la revisión del bloque (`/code-review`) antes del domingo.
