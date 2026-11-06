# Tarea semanal «Proyectos semanal»

## Reglas

Traídas de `AGENTS.md` (retro 2026-11-02), que solo guarda lo esencial y apunta aquí.

**Publicación semanal** (decisión y consentimiento del usuario, 2026-10-13): la web se actualiza los **domingos por
la noche**. La tarea programada «Proyectos semanal» revisa el avance de **cada proyecto** (Tarkor, toVeriAI,
Galivelop-workflow y los que se añadan), actualiza sus fichas y sube la rama de trabajo
(`claude/galivelop-dev-portal-1h89ci`) a `main` **sin pedir confirmación** (autorizado para esa tarea; desde el
2026-10-23, con la ficha de Galivelop-workflow ya en la 0.3.0, por decisión del usuario, las fichas las pone al
día ella y no las sesiones). Gasta los mínimos tokens:
de cada proyecto lee solo su bitácora o su CHANGELOG y los commits desde la última fecha de `actualizado`.
Lo hace con la skill [`gw-portal`](../../.claude/skills/gw-portal/SKILL.md) en modo semanal: qué se mira de cada
proyecto está en su [`proyectos.md`](../../.claude/skills/gw-portal/proyectos.md) y qué repos en su
[`fuentes.json`](../../.claude/skills/gw-portal/fuentes.json). Un proyecto nuevo se añade a mano (código y ficha, con
su revisión) junto con su sección en `proyectos.md` y su entrada en `fuentes.json`; desde ahí lo mantiene la tarea, sin
volver a pegar su texto.
Solo toca contenido (los `.json` de `src/data/`, imágenes `webp|png|jpg|svg|ico` de `public/` y `docs/`: lo que casa con
`content`; cualquier otro archivo es código y el `pre-push` lo rechaza en `main`), así que no necesita revisión mientras la marca de
`docs/records/reviewed.txt` cubra todo el código: **la rama de trabajo tiene que estar siempre publicable** y
todo código que entre en ella lleva su `/code-review` y su marca antes del domingo. Entre semana, lo hecho se
apunta en «Para la próxima publicación» de la bitácora. Fuera de esa tarea, `main` sigue necesitando confirmación.

## Texto de la tarea

Texto de la tarea programada que cada domingo a las 20:45 (hora de Madrid) pone al día las fichas de todos los
proyectos y publica la rama de trabajo en `main`. La tarea solo se puede cambiar desde su propia conversación: si este
texto cambia, se pega allí. Como lo que hace cada semana vive en la skill, solo hay que volver a pegarlo si cambian la
rama, la autorización o la forma de responder. El propio texto le dice que, al recibirlo como actualización, no lo ejecute hasta su fecha
(antes, cada texto pegado se ejecutaba en el acto).

**Pendiente de pegar** (texto de 2026-11-06, con «no ejecutes nada hasta su fecha»): hasta que la persona lo pegue, tras probar `gw-portal` en modo informe con la 0.5.0
del flujo, la tarea sigue con su texto largo anterior (en `git log -p -- docs/runbooks/tarea-semanal.md`).

```text
Revisión semanal de los proyectos del portal (autorizada por Álvaro: publicar en main sin pedir confirmación). Si recibes este texto como actualización de la tarea, solo guárdalo y responde «Texto actualizado»: no ejecutes nada hasta su próxima fecha programada (domingo a las 20:45, hora de Madrid). Trabaja en la rama claude/galivelop-dev-portal-1h89ci del portal y ejecuta la skill gw-portal en modo semanal, siguiendo su SKILL.md de principio a fin: sin subagentes, sin capturas, sin preguntas; los repos de los proyectos solo se leen. Publica en main solo si npm run check pasa. Responde en 4 líneas como máximo: qué cambió en cada proyecto, si se publicó y lo que quedó apuntado para una sesión de trabajo.
```
