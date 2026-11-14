# Notas del portal para `/gw-update`

- `.github/workflows/check.yml` es del portal (`ownedFiles` en `.claude/gw.json`): Node 22, caché de npm y el
  paso `npm run build`. `apply.py` no lo toca ni deja `.gw-new`, así que en cada `/gw-update` compara a mano la
  plantilla vieja con la nueva:
  `git -C <repo del flujo> diff v<vieja> v<nueva> -- templates/github/check.yml`.
  Lo que cambie se enseña a la persona y lo que acepte se lleva a `check.yml`, sin perder los pasos `# Portal:`.
