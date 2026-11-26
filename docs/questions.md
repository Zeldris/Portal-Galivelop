# Questions

Questions for the user, one entry each; `python3 .claude/gw/scripts/questions.py` reads and rewrites this
file (format: header of scripts/questions.py). Answer by number: `questions.py answer "5. a, 6. ok"`.

## Q-1
- Refs:
- Status: answered
- Asked: 2026-11-22
- Question: gw-update 0.8.0→0.8.2: ¿aplico apply.py --update (79 archivos del flujo y version/workflowClone/workflowRepository en gw.json)?
- Recommendation: sí
- Answer: sí
- Answered: 2026-11-22

## Q-2
- Refs:
- Status: answered
- Asked: 2026-11-22
- Question: AGENTS.md: ¿traigo las dos líneas nuevas de la plantilla (Findings:/Retries: en el último párrafo con los trailers; no hacer un commit solo para el ledger de métricas)?
- Recommendation: sí, las dos
- Answer: sí
- Answered: 2026-11-22

## Q-3
- Refs:
- Status: answered
- Asked: 2026-11-22
- Question: REVIEW.md: ¿añado el criterio «el código que lee lo que escribe un agente o una persona lleva un test con una muestra real»?
- Recommendation: sí
- Answer: sí
- Answered: 2026-11-22

## Q-4
- Refs:
- Status: answered
- Asked: 2026-11-22
- Question: .github/workflows/check.yml (del portal): ¿añado paths-ignore del ledger para que un push que solo lo toca no arranque el CI?
- Recommendation: sí
- Answer: sí
- Answered: 2026-11-22

## Q-5
- Refs:
- Status: answered
- Asked: 2026-11-22
- Question: workflowClone: ¿dejo el valor por defecto ../Galivelop-workflow (tu clon local) aunque en la nube esté en ../zeldris/galivelop-workflow?
- Recommendation: dejar ../Galivelop-workflow
- Answer: dejar ../Galivelop-workflow
- Answered: 2026-11-22

## Q-6
- Refs:
- Status: answered
- Asked: 2026-11-22
- Question: Avisos de nombres viejos (41 usos, los mismos archivos de siempre): ¿los silencio con legacyNamesSkip o se quedan como hasta ahora?
- Recommendation: dejarlos como hasta ahora
- Answer: dejarlos como hasta ahora
- Answered: 2026-11-22

## Q-7
- Refs:
- Status: answered
- Asked: 2026-11-24
- Question: Escala de espaciado (margin, padding, gap; ~700 valores en global.css): a) de 2 en 2 px hasta 20 y luego 24, 28, 32, 40, 48, 56, 72 (–espacio-1…); solo se mueven los raros (3, 5, 7, 9, 11, 22, 26, 30, 36, 44, 60 px; ~50 usos, 1-2 px), casi sin cambio visible; b) retícula de 4 px (4, 8, 12, 16, 20, 24, 32, 40, 48, 64): más ordenada, pero ~300 usos (6, 10, 14, 18 px) se mueven 2 px y cambian las capturas
- Recommendation: a) escala de 2 en 2 px
- Answer: a
- Answered: 2026-11-24

## Q-8
- Refs:
- Status: answered
- Asked: 2026-11-24
- Question: Espaciados fluidos (clamp(40px, 6vw, 64px) y unos 15 parecidos, en cabeceras de sección y hero): ¿tokens con nombre por papel o se dejan fuera de Stylelint?
- Recommendation: fichas con nombre por papel (--espacio-seccion, --espacio-bloque…), una por cada clamp distinto que se repita; los sueltos, al más parecido
- Answer: ok
- Answered: 2026-11-24

## Q-9
- Refs:
- Status: answered
- Asked: 2026-11-24
- Question: Escala de letra (~45 tamaños rem distintos, 0.6-2.25rem): a) 11 pasos 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1, 1.1, 1.25, 1.5, 2rem, redondeando al más cercano (0.92→0.9, 0.88→0.9, 1.15→1.1, 1.35→1.25…), más los títulos fluidos del hero y de h1/h2 como tokens con nombre; b) mantener cada tamaño actual como token (sin cambio visible, escala de ~45 pasos que no ordena nada)
- Recommendation: a) 11 pasos y títulos fluidos con nombre
- Answer: a
- Answered: 2026-11-24

## Q-10
- Refs:
- Status: answered
- Asked: 2026-11-24
- Question: ¿Te enseño capturas antes/después (inicio, /productos, una ficha; móvil y escritorio) antes de subir el cambio?
- Recommendation: sí, capturas antes/después antes de subir
- Answer: ok
- Answered: 2026-11-24

## Q-11
- Refs: auditoria-marca
- Status: answered
- Asked: 2026-11-24
- Question: Auditoría de marca, parte 1: ¿se añade a docs/marca.md la sección G de productos propuesta en el informe?
- Recommendation: Sí: sección G con acentos, portada, OG e icono de Evaluator, OG de Developer y regla de figuras; quitar la frase de «ignorar»
- Answer: ok (rec.)
- Answered: 2026-11-24

## Q-12
- Refs: auditoria-marca
- Status: answered
- Asked: 2026-11-24
- Question: ¿Qué motivo lleva la portada (y la OG) de Galivelop Evaluator?
- Recommendation: La balanza en el agua con dos boyas (grabado), como propone el informe
- Answer: ok (rec.)
- Answered: 2026-11-24

## Q-13
- Refs: auditoria-marca
- Status: answered
- Asked: 2026-11-24
- Question: Diseños D1-D3: ¿se hace la versión oscura de las figuras de producto y se ajustan retícula y nodos?
- Recommendation: Sí, variante oscura de las figuras (D1) y con ella D2 y D3, de una vez en productos.py
- Answer: ok (rec.)
- Answered: 2026-11-24

## Q-14
- Refs: auditoria-marca
- Status: answered
- Asked: 2026-11-24
- Question: Diseños D4-D9 (bordes, chaflanes, letra y excepciones de la hoja): ¿se aplican?
- Recommendation: Sí a D4-D7 (CSS de producto, cambio pequeño); D8 y D9, anotarlos en la hoja como excepciones
- Answer: ok (rec.)
- Answered: 2026-11-24

## Q-15
- Refs: auditoria-marca
- Status: answered
- Asked: 2026-11-24
- Question: Guiones G1-G14: ¿qué se aplica ahora y qué espera a la tanda de grabación?
- Recommendation: Aplicar ya G1 y los guiones sin audio (G5-G11, G14); dejar G2, G3, G4, G12 y G13 para una sola tanda de grabación
- Answer: ok (rec.)
- Answered: 2026-11-24

## Q-16
- Refs: auditoria-marca
- Status: answered
- Asked: 2026-11-24
- Question: ¿Una segunda pasada de diseño sobre las páginas anteriores (inicio, fichas, equipo, unirse, proponer, novedades, 404) y el tema oscuro?
- Recommendation: Sí, una segunda pasada de diseño, con capturas en oscuro, sobre las páginas anteriores
- Answer: ok (rec.)
- Answered: 2026-11-24

## Q-17
- Refs: auditoria-marca
- Status: answered
- Asked: 2026-11-24
- Question: D10 (medio): la figura de producto tiene un filo más claro en oscuro (marco --superficie, figura --papel). ¿Se pone el fondo del marco a --papel?
- Recommendation: Sí: background: var(--papel) en .producto-figura (una línea); el filete de 1 px queda pegado al dibujo
- Answer: ok
- Answered: 2026-11-24

## Q-18
- Refs: auditoria-marca
- Status: answered
- Asked: 2026-11-24
- Question: D11 (leve): el separador se oscurece con filter invert en vez de tener su propia versión oscura. ¿Se anota como excepción en la hoja o se hace una variante?
- Recommendation: Anotar la excepción en docs/marca.md (el invert del separador funciona y no pide imagen nueva)
- Answer: ok
- Answered: 2026-11-24

## Q-19
- Refs: auditoria-marca
- Status: answered
- Asked: 2026-11-24
- Question: D12 (leve): bordes de 1,5 y 2 px en .estado-diseno, la caja del flujo y el punto de línea. ¿Se pasan a 1 px o se anotan como excepción?
- Recommendation: Pasar a 1 px los tres bordes; son puntos y cajas pequeñas, sin motivo de marca para ser más gruesos
- Answer: ok
- Answered: 2026-11-24

## Q-20
- Refs: auditoria-marca
- Status: answered
- Asked: 2026-11-24
- Question: D13 (leve): .producto-datos code sigue con 0.9em fuera de la escala. ¿Se pasa a un token --letra-*?
- Recommendation: Sí, token --letra-* (cierra lo que dejó D6)
- Answer: ok
- Answered: 2026-11-24

## Q-21
- Refs: auditoria-marca
- Status: answered
- Asked: 2026-11-24
- Question: ¿Qué sigue de «Auditoría de marca»? a) comprobar (b2) en el repo del generador, solo lectura (¿0.7 publicada? ¿la ficha debe enlazar otra release?); b) preparar la tanda de grabación (G2: data-guion en la banda de productos y lista de trozos G2-G4, G12, G13, G1 para grabar); c) redactar el pedido al generador de las filas 33-36 (portada, OG e icono de Evaluator; OG de Developer); d) otra cosa de pending.md
- Recommendation: a + c: las dos se hacen aquí y ya; a desbloquea la grabación de G1 y c es solo el texto del pedido que tú das al generador
- Answer: a + c (ok a la recomendación)
- Answered: 2026-11-24

## Q-22
- Refs: auditoria-marca
- Status: answered
- Asked: 2026-11-24
- Question: La sesión lleva 2 compactaciones con presupuesto 1 y arranca ya al 64 % del tope, casi todo sistema y MCP (84k). ¿Desactivas los conectores que no usas y abrimos sesión nueva tras esta tanda?
- Recommendation: Sí: al acabar esta tanda, sesión nueva con Claude Docs y los MCP que no usas desactivados (/context los muestra)
- Answer: ok; los conectores no se pueden desactivar en Claude en la nube
- Answered: 2026-11-24

## Q-23
- Refs: retro-main-2026-11-25
- Status: answered
- Asked: 2026-11-25
- Question: T1. ¿Entradas largas de pending.md y de «Para la próxima publicación» partidas en sub-viñetas cortas, y nota de leerlas con grep -n '^- ' | cut -c1-160?
- Recommendation: Sí
- Answer: ok
- Answered: 2026-11-25

## Q-24
- Refs: retro-main-2026-11-25
- Status: answered
- Asked: 2026-11-25
- Question: T2. ¿Hoja claro/oscuro de una figura en una sola imagen (como npm run capturas --hoja) para no abrir las dos por separado?
- Recommendation: Sí
- Answer: ok
- Answered: 2026-11-25

## Q-25
- Refs: retro-main-2026-11-25
- Status: answered
- Asked: 2026-11-25
- Question: T3. ¿Apuntar en gw-opt-tokens.md el arranque fijo de ~86k por llamada (73 %) como coste conocido sin arreglo en la nube?
- Recommendation: Sí
- Answer: ok
- Answered: 2026-11-25

## Q-26
- Refs: retro-main-2026-11-25
- Status: answered
- Asked: 2026-11-25
- Question: R1. ¿Token --foco-chaflan (−6px) para outline-offset de los elementos con chaflán, Stylelint que lo exija y arreglar ya .producto-copiar?
- Recommendation: Sí, ahora en esta rama
- Answer: ok
- Answered: 2026-11-25

## Q-27
- Refs: retro-main-2026-11-25
- Status: answered
- Asked: 2026-11-25
- Question: R2. ¿Tarea de barrido de los 5 leves de global.css para la próxima versión?
- Recommendation: Sí
- Answer: ok
- Answered: 2026-11-25

## Q-28
- Refs: retro-main-2026-11-25
- Status: answered
- Asked: 2026-11-25
- Question: R3. ¿Tras subir a main, merge de main en claude/galivelop-dev-portal-1h89ci (parada en el 2026-11-15, 57 commits por detrás) para que la tarea semanal no publique una rama vieja?
- Recommendation: Sí
- Answer: ok
- Answered: 2026-11-25

## Q-29
- Refs:
- Status: answered
- Asked: 2026-11-25
- Question: CI en rojo desde 437e5ad: 7 de 12 capturas @visual de cabecera difieren un 3 % (máx. 2 %) entre el Chromium del runner y el del contenedor donde se generaron; fuentes ya esperadas. ¿Qué hago? a) subir maxDiffPixelRatio a 0.05 en esa prueba, con comentario del porqué (un fallo de maquetación en la franja de 160 px mueve mucho más); b) regenerarlas en el runner: hace falta que el CI suba las capturas (archivo copiado del flujo: propuesta al flujo y espera); c) otra.
- Recommendation: a
- Answer: a
- Answered: 2026-11-25

## Q-30
- Refs:
- Status: answered
- Asked: 2026-11-25
- Question: Roadmap: ¿dominio propio sí o no, y cuándo?
- Recommendation: decidirlo ya aunque se aplique más tarde
- Answer: sí, pero aún queda mucho: no se aplica por ahora
- Answered: 2026-11-25

## Q-31
- Refs:
- Status: answered
- Asked: 2026-11-25
- Question: Roadmap: ¿bloque Ahora (LCP de fichas en móvil, barrido y partición de global.css, tema del sistema y forced-colors, aviso del check por fecha del guion)?
- Recommendation: sí, una tarea con su revisión
- Answer: sí
- Answered: 2026-11-25

## Q-32
- Refs:
- Status: answered
- Asked: 2026-11-25
- Question: Roadmap: ¿diario del taller (artículos largos sobre cómo se construye)?
- Recommendation: prototipo de una entrada con el storyboard aprobado
- Answer: ok (prototipo)
- Answered: 2026-11-25

## Q-33
- Refs:
- Status: answered
- Asked: 2026-11-25
- Question: Roadmap: muro, ¿llenarlo u ocultarlo?
- Recommendation: ocultarlo hasta tener 3 piezas o más
- Answer: ocultar
- Answered: 2026-11-25

## Q-34
- Refs:
- Status: answered
- Asked: 2026-11-25
- Question: Roadmap: ¿analítica sin cookies?
- Recommendation: GoatCounter: sin cookies ni banner
- Answer: ok (GoatCounter)
- Answered: 2026-11-25

## Q-35
- Refs: R-3
- Status: answered
- Asked: 2026-11-25
- Question: ¿Pintamos la imagen de cabecera de la ficha ya en el HTML estático, antes de que cargue el JS (R-3b), para bajar el LCP móvil de ~4 s?
- Recommendation: sí, como tarea aparte después de R-6
- Answer: sí
- Answered: 2026-11-25

## Q-36
- Refs: R-5
- Status: answered
- Asked: 2026-11-25
- Question: R-5 choca con la regla 1 de docs/marca.md («Tema claro por defecto»; Tema.tsx da claro aunque el sistema pida oscuro). ¿a) seguir el tema del sistema cuando no hay uno guardado, cambiando la regla 1, o b) mantener el claro por defecto y hacer solo forced-colors?
- Recommendation: b: seguir con el claro por defecto (regla 1 de la marca) y hacer solo forced-colors
- Answer: b
- Answered: 2026-11-25

## Q-37
- Refs: Q-32
- Status: answered
- Asked: 2026-11-26
- Question: Diario del taller (prototipo https://claude.ai/artifact/QHa1FGPtHzvaZZd9AY32Pz): ¿dónde vive en la navegación?
- Recommendation: /diario con enlace discreto en la cabecera (como Productos) y una banda al final del inicio
- Answer: ok
- Answered: 2026-11-26

## Q-38
- Refs: Q-32
- Status: answered
- Asked: 2026-11-26
- Question: Diario: ¿cabecera en bloque celeste hondo con chaflán, o sobria sobre papel?
- Recommendation: bloque celeste hondo con chaflán y metadatos en mono; tiempo de lectura calculado
- Answer: ok
- Answered: 2026-11-26

## Q-39
- Refs: Q-32
- Status: answered
- Asked: 2026-11-26
- Question: Diario: ¿quién firma y cómo?
- Recommendation: firma enlazada al perfil del miembro; puede firmar cualquier miembro
- Answer: ok
- Answered: 2026-11-26

## Q-40
- Refs: Q-32
- Status: answered
- Asked: 2026-11-26
- Question: Diario: ¿figura animada o fija?
- Recommendation: figura estática con reposo en cada entrada; animación solo opcional
- Answer: ok
- Answered: 2026-11-26

## Q-41
- Refs: Q-32
- Status: answered
- Asked: 2026-11-26
- Question: Diario: ¿entradas en es, gl y en, o solo castellano con excepción a la regla de tres idiomas?
- Recommendation: traducir cada entrada a gl y en, como el resto de la web (sin excepción a la regla)
- Answer: ok
- Answered: 2026-11-26

## Q-42
- Refs: Q-32
- Status: answered
- Asked: 2026-11-26
- Question: Diario: ¿el prototipo vale como base para construirlo?
- Recommendation: aprobar el prototipo con las respuestas de arriba
- Answer: ok
- Answered: 2026-11-26

## Q-43
- Refs:
- Status: open
- Asked: 2026-11-26
- Question: ¿Seguimos bajando el LCP móvil del resto de rutas (13 de 22 pasan de 2,5 s) en esta rama? a) sí, como bloque propio; b) no, solo /equipo/ y a main
- Recommendation: a: un bloque «LCP móvil» propio, con /code-review y marca, antes del domingo

## Q-44
- Refs:
- Status: open
- Asked: 2026-11-26
- Question: ¿Partimos IconoMarca en un import por icono para la portada (3,0 s) y las fichas? a) sí; b) no
- Recommendation: a: partir IconoMarca en un módulo por icono (la portada y las fichas cargan los 21 para usar unos pocos); es el mismo arreglo que en /equipo/

## Q-45
- Refs:
- Status: open
- Asked: 2026-11-26
- Question: ¿Versión móvil de la portada de productos/galivelop-developer (3,3 s, img.producto-portada sin srcset)? a) sí; b) no
- Recommendation: a: versión móvil (srcset) de la portada de galivelop-developer y precarga de isobatas.svg ya está; medir de nuevo tras a

## Q-46
- Refs:
- Status: open
- Asked: 2026-11-26
- Question: ¿Dejamos ver el texto estático sin esperar a React (cota de ~2,0-2,4 s en toda página de texto)? a) sí, con el riesgo de parpadeo y CLS al montar; b) no, se queda oculto
- Recommendation: b: no mostrar el texto estático antes de que monte React; se queda el ocultado (lo aceptado el 2026-11-17), porque mostrarlo da parpadeo y salto al montar
