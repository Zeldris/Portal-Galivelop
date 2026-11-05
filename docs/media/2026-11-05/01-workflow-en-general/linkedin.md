# LinkedIn: workflow-en-general

800 a 1.300 caracteres (el máximo es 3.000). Las dos primeras líneas enganchan: son lo único que se ve antes de
«ver más». Reto, cómo y qué se aprendió. De 3 a 5 etiquetas al final. LinkedIn no admite WebP: la imagen es el
`.png`.

## es

Programar semanas con un agente de IA tiene un problema poco visible: cada sesión puede acabarse en cualquier momento (sin tokens, con el contenedor reciclado o con el relevo a otra cuenta), y lo que no quedó escrito se pierde.
En el taller Galivelop lo resolvimos con una regla: lo que no está subido no existe.

De ahí nació Galivelop-workflow: el método que ya usábamos en Tarkor, en nuestro portal y en otros proyectos, convertido en un repositorio versionado que se aplica a cualquier proyecto. Reglas en AGENTS.md (un estándar abierto que entiende cualquier agente), skills, scripts y ganchos de git en un solo sitio. Estas son sus piezas de más valor:

🔁 Relevos sin pérdidas
La bitácora se actualiza en el mismo commit que el trabajo, y se hace commit + push en cada punto estable. Al abrir sesión, o tras limpiar el contexto, un gancho devuelve el estado: la siguiente sesión sigue sin preguntar por dónde iba. El estado vive en git, no en la conversación.

🎯 Elegir antes de empezar
gw-selector dice qué skill y qué modelo pide cada tarea, y si es de riesgo y hay que esperar a la persona. gw-orchestrate-dealer reparte lo mecánico a subagentes con contexto limpio y el modelo más barato que lo haga bien; cada uno devuelve un resumen corto y la sesión principal decide y revisa.

🛡️ Nada sin revisar llega a main
Tres fases antes de publicar: revisión de todo el diff con el criterio escrito del proyecto; retro y medida del gasto, cuyas propuestas solo se aplican si la persona las confirma; y una marca de revisado del commit. Sin esa marca, o con las pruebas en rojo, el gancho de git rechaza la subida. Y antes de cada commit se buscan secretos: una clave subida hay que darla por filtrada aunque se borre.

📉 Medir antes de recortar
En un piloto, una sola sesión de 157 llamadas con 191k de contexto medio se llevó el 70 % del gasto. De ahí salieron la compactación a 200k y los subagentes, no de una intuición. gw-opt-tokens mide en qué se fue cada sesión y solo propone recortes que no empeoren el resultado.

♻️ Mejora con cada proyecto
Cada proyecto declara lo suyo en un archivo pequeño. gw-harvest recoge lo que cada uno mejora; lo bueno sale en una versión nueva y gw-update la lleva a todos, enseñando antes los cambios.

Va por la versión 0.5.0, en rodaje, y la 1.0 llegará cuando haya funcionado semanas en proyectos reales. El repositorio es público y abierto a colaborar:
https://github.com/Zeldris/Galivelop-workflow

¿Cómo evitáis que vuestros agentes pierdan el hilo entre sesiones?

#IA #AgentesDeIA #ClaudeCode #DesarrolloDeSoftware
Image: media/diagrama.png
Image: media/portada.png
