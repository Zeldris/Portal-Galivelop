# LinkedIn: workflow-en-general

800 a 1.300 caracteres (el máximo es 3.000). Las dos primeras líneas enganchan: son lo único que se ve antes de
«ver más». Reto, cómo y qué se aprendió. De 3 a 5 etiquetas al final. LinkedIn no admite WebP: la imagen es el
`.png`.

## es

Programar semanas con un agente de IA tiene un problema poco visible: cada sesión puede acabarse en cualquier momento (sin tokens, con el contenedor reciclado o con el relevo a otra cuenta), y lo que no quedó escrito se pierde.
En el taller Galivelop lo resolvimos con una regla: lo que no está subido no existe.

De ahí nació Galivelop-workflow: nuestro método, sacado de proyectos reales y convertido en un repositorio versionado que se aplica a cualquier proyecto, con las reglas en AGENTS.md (un estándar abierto). Lo más valioso:

🔁 Relevos sin pérdidas
Bitácora en el mismo commit que el trabajo y commit + push en cada punto estable. La siguiente sesión sigue sin preguntar por dónde iba: el estado vive en git, no en la conversación.

🎯 Elegir antes de empezar
Cada tarea arranca eligiendo skill y modelo. Lo mecánico va a subagentes con contexto limpio y el modelo más barato que lo haga bien; la sesión principal decide y revisa.

🛡️ Nada sin revisar llega a main
Tres fases: revisión de todo el diff, retro con medida del gasto (solo se aplica lo que confirma la persona) y marca de revisado del commit. Sin la marca o con pruebas en rojo, git rechaza la subida.

📉 Medir antes de recortar
En un piloto, una sesión de 157 llamadas se llevó el 70 % del gasto. De ahí salieron la compactación a 200k y los subagentes, no de una intuición.

🧰 Lo que trae dentro
• 11 skills propias: gw-selector (skill y modelo), gw-orchestrate-dealer (reparto a subagentes), gw-opt-tokens (gasto), gw-doctor (qué falla y la orden que lo arregla), gw-init, gw-update y gw-harvest (aplicar el flujo y devolver lo aprendido en cada versión)…
• Ganchos de git: pre-commit busca secretos, commit-msg valida la bitácora y pre-push pasa el check y exige la marca de revisado.
• Scripts en Python y Bash: recover.py devuelve el estado tras limpiar el contexto, config.py lee la configuración y falla cerrado, reviewed.sh deja la marca.
• 15 skills de Matt Pocock para pensar antes de programar: grilling, research, prototype, diagnosing-bugs…

Y hay mucho más (plantillas, CI, configuración por proyecto). Va por la 0.5.0, el repositorio es público y abierto a colaborar:
https://github.com/Zeldris/Galivelop-workflow

¿Cómo evitáis que vuestros agentes pierdan el hilo entre sesiones?

#IA #AgentesDeIA #ClaudeCode #DesarrolloDeSoftware
Image: media/diagrama.png
Image: media/portada.png
