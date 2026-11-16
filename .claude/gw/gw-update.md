# Notas del portal para `/gw-update`

- `.github/workflows/check.yml` es del portal (`ownedFiles` en `.claude/gw.json`): Node 22, caché de npm y el
  paso `npm run build`. `apply.py` no lo toca ni deja `.gw-new`, así que en cada `/gw-update` compara a mano la
  plantilla vieja con la nueva:
  `git -C <repo del flujo> diff v<vieja> v<nueva> -- templates/github/check.yml`.
  Lo que cambie se enseña a la persona y lo que acepte se lleva a `check.yml`, sin perder los pasos `# Portal:`.
- Los avisos de nombres viejos de `apply.py` (`docs/traspaso.md`, `docs/registros`, `docs/difusion`, `recoger.py`) se
  dejan (la persona, 2026-11-16): `gw-portal` lee repos que pueden seguir con esos nombres, y el resto son menciones
  «(antes …)» puestas a propósito. Solo se revisa un aviso en un archivo que no estaba en la lista anterior.
