# LinkedIn: workflow-en-general

800 a 1.300 caracteres (el máximo es 3.000). Las dos primeras líneas enganchan: son lo único que se ve antes de
«ver más». Reto, cómo y qué se aprendió. De 3 a 5 etiquetas al final. LinkedIn no admite WebP: la imagen es el
`.png`.

## es

Programar semanas con un agente de IA tiene un problema poco visible: cada sesión puede acabarse en cualquier momento, y lo que no quedó escrito se pierde.
En el taller Galivelop lo resolvimos con una regla: lo que no está subido no existe.

De ahí nació Galivelop-workflow, nuestra forma de trabajar con IA empaquetada para cualquier proyecto. Sus piezas de más valor:

🔁 Relevos sin pérdidas: bitácora al día en el mismo commit que el trabajo. La siguiente sesión sabe por dónde iba sin preguntar.
🎯 Elegir antes de empezar: una skill decide qué skill y qué modelo pide cada tarea, y lo mecánico va a subagentes con el modelo más barato que lo haga bien.
🛡️ Nada sin revisar llega a main: tres fases antes de publicar y ganchos de git que no dejan subir sin la marca de revisado, con pruebas en rojo o con secretos.
📉 Medir antes de recortar: en un piloto, una sola sesión larga se llevó el 70 % de los tokens. De ahí salieron el tope de compactación y el reparto a subagentes.
♻️ Mejora con cada proyecto: lo que un proyecto aprende vuelve en una versión nueva y llega a todos.

Va por la versión 0.5.0 y el repositorio es público:
https://github.com/Zeldris/Galivelop-workflow

¿Cómo evitáis que vuestros agentes pierdan el hilo entre sesiones?

#IA #AgentesDeIA #ClaudeCode #DesarrolloDeSoftware
Image: media/portada.png
