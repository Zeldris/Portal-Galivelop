---
name: selector
description: Elegir skill y modelo para la tarea que empieza en el portal Galivelop. Usar al empezar cada tarea, al recibir un fallo o una petición de diseño, y cuando el usuario pregunte qué flujo o modelo conviene.
---

# Selector de skill y modelo

Al empezar una tarea, clasifícala con la tabla y actúa según su fila. Flujo completo, guía y motivos:
[`docs/runbooks/skills-y-modelos.md`](../../../docs/runbooks/skills-y-modelos.md).

| Caso | Skill | Modelo de la sesión | Subagentes |
|---|---|---|---|
| Diseño nuevo o decisión abierta (sección nueva, estructura de una ficha, marca, algo que pide decidir al usuario) | `grilling` + `domain-modeling` (o `/grill-with-docs` si lo lanza el usuario); `prototype` si hay que ver variantes de pantalla | grande (Opus) | búsquedas con `Explore` en ligero (Haiku) |
| Fallo visible (se ve mal en móvil, un error en consola, un test rojo) | `diagnosing-bugs` | grande si no es obvio; medio (Sonnet) si la causa se ve a la primera | — |
| Cambio de varios componentes, rutas, build o SEO (`scripts/paginas-estaticas.mjs`, `main.tsx`, `Idioma.tsx`) | — | grande | ligero para buscar usos |
| Contenido de un proyecto (textos, imágenes, novedades) a partir de su repo | — | medio | ligero para leer el repo del proyecto y devolver un resumen |
| Traer algo de otro repo (un flujo, skills, documentos) | `orchestrate-dealer` | grande para decidir qué se adapta | ligero (`Explore`) que lea el otro repo y devuelva un resumen con rutas; la principal no lee los archivos enteros |
| Cambio acotado (un componente, un estilo, un texto en tres idiomas) | — | medio | — |
| Cambio mecánico (docs, bitácora, renombrar, convertir imágenes) | — | medio o ligero | ligero |
| Revisar lo que va a `main` | `/code-review` (de serie) y `pr` para el resumen | grande | — |
| Cierre de un bloque grande de trabajo | `retro` (la lanza Claude; las propuestas las confirma el usuario); de vez en cuando, `/improve-codebase-architecture` | grande | — |
| Escribir `CLAUDE.md`, skills o documentos para agentes | `writing-for-agents` | medio | — |

Reglas:

- El modelo de la sesión lo elige el usuario (`/model`); no se puede cambiar desde dentro. Si la fila pide otro
  distinto del actual, dilo en **una línea** al empezar y sigue; no esperes respuesta salvo riesgo alto (borrar
  contenido publicado, cambiar rutas que ya están indexadas).
- A un subagente se le pone el modelo de la columna «Subagentes» con el parámetro `model`. Solo se delegan
  búsquedas, lecturas largas o tareas mecánicas; el diseño y las decisiones se quedan en la sesión principal.
- Con el plan cerrado y escrito, la implementación acotada puede ir a un subagente `sonnet`; la sesión principal
  revisa su diff antes del commit.
- **Escalera de subagentes:** `sonnet` con esfuerzo `low` → `sonnet` `medium` → `opus` `medium` → `opus` `high`.
  Se empieza por el peldaño más bajo que encaje y, si el subagente no cierra el encargo, el siguiente intento sube
  uno. Dos fallos del mismo encargo: se para y se le cuenta al usuario.
- **Sesión directora:** una tarea de varios pasos con lecturas largas (repasar el repo de un proyecto, un banco de
  imágenes) se lleva con `orchestrate-dealer`.
- En la duda entre dos filas, la de más riesgo.
