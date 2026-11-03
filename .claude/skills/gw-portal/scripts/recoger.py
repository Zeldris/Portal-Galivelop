#!/usr/bin/env python3
"""Parte mecánica de gw-portal: qué ha cambiado en los repos de la cuenta desde la última puesta al día del portal.

  python3 .claude/skills/gw-portal/scripts/recoger.py --repos <repos.json> [--clones DIR] [--json]

--repos es la salida de la herramienta list_repos guardada en un archivo ({"repos": [{"full_name", "visibility"}]}).
Clasifica cada repo del titular y de los extras de fuentes.json (ficha, proximamente, ignorar o nuevo) y, de cada
repo con destino, lee su clon en --clones (por defecto /home/user; vale <clones>/<repo> o <clones>/<owner>/<repo>):
trae su rama por defecto y sus etiquetas, ahonda un clon superficial hasta las fechas de la ficha y saca los commits
desde la última novedad, la etiqueta más alta, la cabecera de la bitácora, los cambios en las rutas vigiladas y las
piezas de difusión listas. Solo lee los repos (fetch incluido); nunca escribe en ellos ni en el portal.
"""
import argparse
import datetime as dt
import json
import re
import subprocess
import sys
from pathlib import Path

SKILL = Path(__file__).resolve().parent.parent
PORTAL = SKILL.parent.parent.parent
FUENTES = SKILL / "fuentes.json"
# Commits que nunca son una novedad: fusiones, marcas de revisión, bitácora y WIP.
RUIDO = re.compile(r"^merge |merge pull|bitácora|^wip|^revisado:|marca de revisión|^fusi[oó]n|^fusiona", re.I)
ETIQUETA = re.compile(r"^v(\d+)\.(\d+)\.(\d+)$")
MAX_COMMITS = 80


def git(repo, *args, check=True):
    r = subprocess.run(["git", "-C", str(repo), *args], capture_output=True, text=True)
    if check and r.returncode:
        raise RuntimeError(f"git {' '.join(args)}: {r.stderr.strip()}")
    return r.stdout.strip() if r.returncode == 0 else ""


def cargar_fuentes(ruta=FUENTES):
    datos = json.loads(Path(ruta).read_text(encoding="utf-8"))
    return datos["titular"], datos.get("extras", []), datos["repos"]


def clasificar(listados, titular, extras, repos):
    """[(nombre, visibilidad, config o None)] de los repos que tocan, y los configurados que ya no aparecen."""
    vistos = {r["full_name"].lower(): r for r in listados}
    conf = {k.lower(): (k, v) for k, v in repos.items()}
    extras_l = {e.lower() for e in extras}
    salida = []
    for clave, r in sorted(vistos.items()):
        if clave.split("/")[0] != titular.lower() and clave not in extras_l:
            continue
        salida.append((r["full_name"], r.get("visibility", "?"), conf.get(clave, (None, None))[1]))
    perdidos = sorted(orig for k, (orig, _) in conf.items() if k not in vistos)
    return salida, perdidos


def buscar_clon(clones, nombre):
    owner, repo = nombre.split("/")
    for cand in (Path(clones) / repo, Path(clones) / owner / repo, Path(clones) / owner.lower() / repo.lower(),
                 Path(clones) / repo.lower()):
        if (cand / ".git").exists():
            url = git(cand, "remote", "get-url", "origin", check=False).lower().removesuffix(".git")
            if url.endswith("/" + nombre.lower()):
                return cand
    return None


def leer_ficha(slug):
    ruta = PORTAL / "src" / "data" / "proyectos" / f"{slug}.json"
    if not ruta.exists():
        return None
    d = json.loads(ruta.read_text(encoding="utf-8"))
    nov = d.get("novedades") or []
    return {"F": d.get("actualizado"), "N": nov[0]["fecha"] if nov else d.get("actualizado"),
            "enlaces": [e.get("url", "") for e in d.get("enlaces", [])]}


def dia_antes(fecha):
    return (dt.date.fromisoformat(fecha) - dt.timedelta(days=1)).isoformat()


def poner_al_dia(clon, desde):
    """Fetch de la rama por defecto y las etiquetas; en un clon superficial, historia hasta un día antes de `desde`."""
    git(clon, "remote", "set-head", "origin", "--auto", check=False)
    rama = git(clon, "rev-parse", "--abbrev-ref", "origin/HEAD", check=False) or "origin/main"
    corta = rama.removeprefix("origin/")
    if git(clon, "rev-parse", "--is-shallow-repository", check=False) == "true" and desde:
        if subprocess.run(["git", "-C", str(clon), "fetch", "-q", "--tags", f"--shallow-since={dia_antes(desde)}",
                           "origin", corta], capture_output=True).returncode:
            git(clon, "fetch", "-q", "--tags", "--unshallow", "origin", check=False)
    else:
        git(clon, "fetch", "-q", "--tags", "origin", corta, check=False)
    return rama


def commits(clon, rama, desde):
    # «--since=AAAA-MM-DD» a secas toma la hora actual de ese día: con T00:00 entra el día entero.
    salida = git(clon, "log", f"--since={desde}T00:00", "--format=%ad %s", "--date=short", rama, check=False)
    return filtrar_commits(salida.splitlines())


def filtrar_commits(lineas):
    """Quita el ruido de líneas «AAAA-MM-DD asunto»; devuelve las primeras MAX_COMMITS y cuántas había."""
    utiles = [l for l in lineas if l and not RUIDO.search(l[11:])]
    return utiles[:MAX_COMMITS], len(utiles)


def etiqueta_mayor(clon):
    tags = [t for t in git(clon, "tag", "--list", "v*", check=False).splitlines() if ETIQUETA.match(t)]
    if not tags:
        return None
    t = max(tags, key=lambda x: tuple(map(int, ETIQUETA.match(x).groups())))
    return {"etiqueta": t, "fecha": git(clon, "log", "-1", "--format=%cs", t, check=False)}


def tablas(texto):
    """Las tablas Markdown del texto, cada una como lista de filas, sin la fila separadora."""
    salida, actual = [], []
    for linea in texto.splitlines() + [""]:
        if linea.startswith("|"):
            if not set(linea) <= set("|- :"):
                actual.append(linea)
        elif actual:
            salida.append(actual)
            actual = []
    return salida


def filas_utiles(texto, ruta, max_filas=14):
    """Del plan, solo las tablas de fases (cabecera «| Fase»); de una bitácora, su primera tabla (el estado)."""
    if ruta.endswith("plan.md"):
        elegidas = [t for t in tablas(texto) if re.match(r"^\|\s*Fase\b", t[0])]
    else:
        elegidas = tablas(texto)[:1]
    return [f[:400] for t in elegidas for f in t[:max_filas]]


def cabecera_bitacora(clon, rama, ruta):
    return filas_utiles(git(clon, "show", f"{rama}:{ruta}", check=False), ruta)


def cambios_vigilados(clon, rama, desde, rutas):
    if not rutas:
        return []
    salida = git(clon, "log", f"--since={desde}T00:00", "--name-status", "--format=", rama, "--", *rutas,
                 check=False)
    vistos, lista = set(), []
    for l in salida.splitlines():
        if l and l not in vistos and "-thumbnail" not in l and not l.endswith(".gitkeep"):
            vistos.add(l)
            lista.append(l)
    return lista


def difusion_lista(clon, rama):
    salida = git(clon, "grep", "-l", "-E", '"estado": *"listo"', rama, "--", "docs/difusion/**/web.md", check=False)
    return [l.split(":", 1)[1] for l in salida.splitlines() if ":" in l]


def informe_repo(nombre, visibilidad, cfg, clones):
    r = {"repo": nombre, "visibilidad": visibilidad, "destino": cfg["destino"] if cfg else "nuevo"}
    if not cfg:
        return r
    r["slug"] = cfg.get("slug")
    if cfg["destino"] == "ignorar":
        r["motivo"] = cfg.get("motivo", "")
        return r
    url = f"https://github.com/{nombre}".lower()
    if cfg["destino"] == "ficha":
        ficha = leer_ficha(cfg["slug"])
        if ficha is None:
            r["aviso"] = f"no existe src/data/proyectos/{cfg['slug']}.json"
            return r
        r.update(F=ficha["F"], N=ficha["N"])
        enlazado = any(e.lower().rstrip("/") == url for e in ficha["enlaces"])
        if visibilidad == "public" and not enlazado:
            r["enlace"] = "repo público sin enlace al código en la ficha: proponer añadirlo (ADR 0003)"
        elif visibilidad == "private" and enlazado:
            r["enlace"] = "repo privado enlazado desde la ficha: quitar el enlace"
    clon = buscar_clon(clones, nombre)
    if clon is None:
        r["falta_clon"] = (f"git clone https://github.com/{nombre} {Path(clones) / nombre.split('/')[1]}"
                           + (" (privado: antes add_repo con lectura)" if visibilidad == "private" else ""))
        return r
    r["clon"] = str(clon)
    desde = min(f for f in (r.get("N"), r.get("F")) if f) if r.get("F") else None
    rama = poner_al_dia(clon, desde)
    r["rama"] = rama
    if desde:
        r["commits"], r["commits_total"] = commits(clon, rama, r["N"])
        r["vigilados"] = cambios_vigilados(clon, rama, r["F"], cfg.get("vigilar", []))
        r["difusion_lista"] = difusion_lista(clon, rama)
    if cfg.get("etiquetas"):
        r["etiqueta"] = etiqueta_mayor(clon)
        if r["etiqueta"] and r.get("F") and r["etiqueta"]["fecha"] >= r["F"]:
            r["etiqueta"]["nueva"] = True
    rutas = [cfg["bitacora"]] if cfg.get("bitacora") else []
    if cfg["destino"] == "proximamente":
        rutas = ["docs/plan.md", "docs/traspaso.md"]
    r["bitacora"] = {ruta: cabecera_bitacora(clon, rama, ruta) for ruta in rutas}
    return r


def texto(informes, perdidos):
    out = []
    for r in informes:
        cab = f"## {r['repo']} ({r['visibilidad']}) → {r['destino']}" + (f" {r['slug']}" if r.get("slug") else "")
        out.append(cab)
        if r["destino"] == "nuevo":
            out.append("- NUEVO: no está en fuentes.json; proponer ficha, próximamente o ignorar")
        for clave in ("motivo", "aviso", "enlace", "falta_clon"):
            if r.get(clave):
                out.append(f"- {clave}: {r[clave]}")
        if r.get("F"):
            out.append(f"- F (actualizado) = {r['F']} · N (última novedad) = {r['N']} · rama {r.get('rama', '?')}")
        if r.get("etiqueta"):
            e = r["etiqueta"]
            out.append(f"- etiqueta más alta: {e['etiqueta']} ({e['fecha']})" + (" · NUEVA desde F" if e.get("nueva")
                                                                                 else ""))
        if "commits" in r:
            out.append(f"- commits desde N: {r['commits_total']}" + (f" (se muestran {MAX_COMMITS})"
                                                                     if r['commits_total'] > MAX_COMMITS else ""))
            out += [f"    {c}" for c in r["commits"]]
        if r.get("vigilados"):
            out.append("- rutas vigiladas cambiadas desde F:")
            out += [f"    {v}" for v in r["vigilados"]]
        if r.get("difusion_lista"):
            out.append("- difusión marcada «listo»: " + ", ".join(r["difusion_lista"]))
        for ruta, filas in (r.get("bitacora") or {}).items():
            out.append(f"- {ruta}:" + ("" if filas else " (no existe o sin tabla)"))
            out += [f"    {f}" for f in filas]
        out.append("")
    if perdidos:
        out.append("## En fuentes.json pero no en la lista de repos de la cuenta")
        out += [f"- {p}" for p in perdidos]
    return "\n".join(out)


def main(argv=None):
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--repos", required=True, help="salida de list_repos en JSON")
    p.add_argument("--clones", default="/home/user", help="carpeta con los clones de los repos")
    p.add_argument("--fuentes", default=str(FUENTES))
    p.add_argument("--json", action="store_true", help="salida en JSON en vez de texto")
    a = p.parse_args(argv)
    listados = json.loads(Path(a.repos).read_text(encoding="utf-8"))
    listados = listados.get("repos", listados) if isinstance(listados, dict) else listados
    titular, extras, repos = cargar_fuentes(a.fuentes)
    elegidos, perdidos = clasificar(listados, titular, extras, repos)
    informes = [informe_repo(n, v, c, a.clones) for n, v, c in elegidos]
    print(json.dumps({"repos": informes, "perdidos": perdidos}, ensure_ascii=False, indent=1) if a.json
          else texto(informes, perdidos))
    return 0


if __name__ == "__main__":
    sys.exit(main())
