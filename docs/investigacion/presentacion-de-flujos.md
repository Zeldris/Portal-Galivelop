# Cómo presentan otros sus flujos de trabajo para agentes

Consulta: 2026-10-23. Pregunta: qué hacen los flujos parecidos para explicarse de forma técnica, y qué de eso
encaja en la ficha de Galivelop-workflow del portal.

## Fuentes

| Fuente | Qué hace al presentarse | Qué tomamos |
|---|---|---|
| Anthropic, «Building effective agents» (anthropic.com/engineering/building-effective-agents) | Un diagrama por patrón (cadena, enrutado, orquestador-trabajadores…) y, para cada uno, cuándo usarlo y qué cuesta | Un diagrama por parte del flujo; apartado «Cuándo encaja y qué cuesta» |
| Claude Code, buenas prácticas y ganchos (docs.anthropic.com/en/docs/claude-code) | Distingue un gancho, que se ejecuta siempre, de una instrucción, que es un consejo | Apartado «Qué se impone y qué se aconseja», con el código de salida de cada pieza |
| GitHub Spec Kit (github.com/github/spec-kit) | Fases con nombre y el archivo que deja cada una | Diagrama de las tres fases con su artefacto |
| BMAD Method (github.com/bmad-code-org/BMAD-METHOD) | Roles de agente y flujo entre ellos en diagramas | Diagrama orquestador y subagentes |
| Superpowers (github.com/obra/superpowers) | Skills presentadas por el problema que resuelven | Apartado «Qué fallo evita cada pieza» |
| 12-factor agents (github.com/humanlayer/12-factor-agents) | Principios numerados, cada uno con el fallo que evita | Igual: fallo → pieza |
| Matt Pocock, skills (github.com/mattpocock/skills) | Cada skill parte de un problema concreto | Igual |

Sin verificar (no se pudieron abrir en la consulta): agents.md, trunkbaseddevelopment.com, diataxis.fr,
buildermethods.com, docs.github.com.

## Decisiones para la ficha

- **Seis diagramas** (fuentes SVG en `docs/diagramas/gw-*.svg`; en la web, `public/proyectos/galivelop-workflow/`
  a 1600×900 con miniatura): arquitectura en capas, relevo de sesiones, `pre-push`, tres fases, subagentes y ciclo
  de versiones. Los rótulos de los diagramas son nombres técnicos en inglés (archivos, ganchos, órdenes); el texto
  alternativo va en los tres idiomas.
- **Datos medidos, no adjetivos:** 461 pruebas del repo del flujo; piloto S2 (157 llamadas, 191k de contexto medio,
  70 % del gasto); 52-57k tokens por subagente al arrancar. El ~30 % de ahorro por compactar a 200k se presenta como
  estimación.
- **Se dice lo que no encaja** (scripts de una tarde, prototipos), como hace la guía de Anthropic.
- No se enlaza el código del flujo (repo privado).
