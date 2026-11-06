#!/usr/bin/env python3
"""Parte mecánica de gw-portal: qué ha cambiado en los repos de la cuenta desde la última puesta al día del portal.

  python3 .claude/skills/gw-portal/scripts/recoger.py --repos <repos.json> [--clones DIR] [--json]

--repos es la salida de la herramienta list_repos guardada en un archivo ({"repos": [{"full_name", "visibility"}]}).
Clasifica cada repo del titular y de los extras de fuentes.json (ficha, proximamente, ignorar o nuevo) y, de cada
repo con destino, lee su clon en --clones (por defecto /home/user; vale <clones>/<repo> o <clones>/<owner>/<repo>):
trae su rama por defecto y sus etiquetas, ahonda un clon superficial hasta las fechas de la ficha y saca los commits
desde la última novedad, la etiqueta más alta, la cabecera de la bitácora, los cambios en las rutas vigiladas y las
piezas de difusión listas. Del portal, por proyecto, saca su escaparate: las imágenes y diagramas que lo muestran (con
la fecha de su último cambio) y los demás archivos que lo nombran, marcados como contenido o código según `content` de
.claude/gw.json. Solo lee los repos (fetch incluido); nunca escribe en ellos ni en el portal.
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
RUIDO = re.compile(r"^merge |merge pull|^wip|^revisado:|^reviewed:|marca de revisión|review mark|^fusi[oó]n|^fusiona"
                   r"|^(docs|chore)(\([^)]*\))?: *(bitácora|handoff)|^(bitácora|handoff)\b", re.I)
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
    versiones = next((a.get("items") or [] for a in d.get("apartados", []) if a.get("id") == "versiones-publicadas"), [])
    return {"F": d.get("actualizado"), "N": nov[0]["fecha"] if nov else d.get("actualizado"),
            "enlaces": [e.get("url", "") for e in d.get("enlaces", [])], "nombre": d.get("nombre"),
            # «0.5.0 · 2026-11-04» → «0.5.0»: la última versión que la ficha ya cuenta.
            "version_publicada": versiones[0]["valor"].split("·")[0].strip() if versiones else None}


def patrones_contenido(raiz=PORTAL):
    datos = json.loads((Path(raiz) / ".claude" / "gw.json").read_text(encoding="utf-8"))
    return [re.compile(c) for c in datos.get("content", [])]


# Lo que ve el público, fuera de public/proyectos/ (que va aparte, con su fecha).
ESCAPARATE = ("README.md", "index.html", "src/", "scripts/", "docs/diagramas/")


def escaparate(slug, nombres, diagramas=(), raiz=PORTAL):
    """Lo que muestra el proyecto en el portal, fuera de su ficha o su entrada de próximamente.

    {"visuales": ["AAAA-MM-DD ruta"], "menciones": ["contenido|código ruta"]}: las imágenes de public/proyectos/<slug>/
    (sin las -mini) y los diagramas de `diagramas` (globs), con la fecha de su último commit en el portal; y los
    archivos de lo que ve el público (ESCAPARATE) que nombran el proyecto (por su slug o sus nombres), sin contar su
    propia ficha ni los tests.
    """
    raiz = Path(raiz)
    rutas = [f for f in git(raiz, "ls-files", f"public/proyectos/{slug}/", check=False).splitlines()
             if not re.search(r"-mini\.\w+$", f)]
    for g in diagramas:
        rutas += git(raiz, "ls-files", g, check=False).splitlines()
    visuales = [f"{git(raiz, 'log', '-1', '--format=%ad', '--date=short', '--', f, check=False) or '?'} {f}"
                for f in rutas]
    claves = [slug, *[n for n in nombres if n]]
    args = ["grep", "-l", "-i", "-F"]
    for c in claves:
        args += ["-e", c]
    propias = {f"src/data/proyectos/{slug}.json", "src/data/proximamente.json"}
    contenido = patrones_contenido(raiz)
    menciones = []
    for f in git(raiz, *args, "--", *ESCAPARATE, ":!*.test.ts", check=False).splitlines():
        if f in propias or f in rutas:
            continue
        menciones.append(("contenido " if any(c.search(f) for c in contenido) else "código ") + f)
    return {"visuales": visuales, "menciones": menciones}


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
    """(primeros MAX_COMMITS útiles, total, cuántos son del propio día `desde`): esos pueden estar ya en la novedad N."""
    # «--since=AAAA-MM-DD» a secas toma la hora actual de ese día: con T00:00 entra el día entero. Filtra por la
    # fecha del committer, así que se muestra esa (%cd) y no la del autor.
    salida = git(clon, "log", f"--since={desde}T00:00", "--format=%cd %s", "--date=short", rama, check=False)
    utiles, total = filtrar_commits(salida.splitlines())
    return utiles[:MAX_COMMITS], total, sum(1 for l in utiles if l.startswith(desde))


def filtrar_commits(lineas):
    """Quita el ruido de líneas «AAAA-MM-DD asunto»; devuelve las útiles y cuántas son."""
    utiles = [l for l in lineas if l and not RUIDO.search(l[11:])]
    return utiles, len(utiles)


def version(texto):
    return tuple(map(int, ETIQUETA.match("v" + texto.lstrip("v")).groups()))


def etiqueta_nueva(etiqueta, F, version_publicada):
    """Con «Versiones publicadas» en la ficha, nueva si la etiqueta es mayor que su primera versión (una ficha a medias,
    con la versión en la fase pero no en esa lista, sigue pidiendo su puesta al día); sin ella, si es de F o posterior."""
    if version_publicada and ETIQUETA.match("v" + version_publicada.lstrip("v")):
        return version(etiqueta["etiqueta"]) > version(version_publicada)
    return bool(F) and etiqueta["fecha"] >= F


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


# Galivelop-workflow 0.5.0 pasó sus rutas a inglés; cada repo puede estar aún en cualquiera de los dos nombres.
RUTAS_FLUJO = [("docs/traspaso.md", "docs/handoff.md"), ("docs/registros/traspaso.md", "docs/handoff.md"),
               ("docs/registros/", "docs/records/"),
               ("docs/difusion/", "docs/media/")]


def variantes(ruta):
    """La ruta y todas sus equivalentes con los nombres del flujo (español, inglés o mezcla, como
    docs/records/traspaso.md), sin repetir: se sustituye hasta que no sale ninguna nueva."""
    out = [ruta]
    for actual in out:  # `out` crece mientras se recorre: así se llega a todas
        for viejo, nuevo in RUTAS_FLUJO:
            for a, b in ((viejo, nuevo), (nuevo, viejo)):
                if actual.startswith(a) and b + actual[len(a):] not in out:
                    out.append(b + actual[len(a):])
    return out


def seccion_roadmap(clon, rama, cfg):
    """(ruta, líneas de la sección `cfg["seccion"]` del roadmap hasta el siguiente encabezado de su nivel o mayor);
    con el archivo o la sección ausentes, (ruta, []): los hitos de la ficha se comparan con esto cada semana."""
    ruta, encabezado = cfg["ruta"], cfg["seccion"].strip()
    nivel = (len(encabezado) - len(encabezado.lstrip("#"))) or 6  # sin «#», cualquier encabezado la cierra
    texto = git(clon, "show", f"{rama}:{ruta}", check=False) or ""
    lineas, dentro, en_codigo = [], False, False
    for linea in texto.splitlines():
        if linea.lstrip().startswith("```"):
            en_codigo = not en_codigo  # un «# comentario» dentro de un bloque de código no es encabezado
        elif not en_codigo and dentro and re.match(rf"^#{{1,{nivel}}} ", linea):
            break  # también si repite el encabezado de la sección (una copia vieja más abajo)
        elif not en_codigo and linea.strip() == encabezado:
            dentro = True
        if dentro and linea.strip():
            lineas.append(linea.rstrip())
    return ruta, lineas


def cabecera_bitacora(clon, rama, ruta):
    """(ruta que existe en la rama, sus filas útiles); con ninguna variante, (ruta pedida, [])."""
    for r in variantes(ruta):
        texto = git(clon, "show", f"{rama}:{r}", check=False)
        if texto:
            return r, filas_utiles(texto, r)
    return ruta, []


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


def url_repo(enlace):
    """El repo de GitHub de un enlace, sin .git, /tree/…, #ancla, ?consulta ni www. (en minúsculas)."""
    m = re.match(r"https?://(?:www\.)?github\.com/([^/#?]+)/([^/#?]+)", enlace.strip(), re.I)
    if not m:
        return enlace.lower().rstrip("/")
    repo = m.group(2)[:-4] if m.group(2).lower().endswith(".git") else m.group(2)
    return f"https://github.com/{m.group(1)}/{repo}".lower()


def difusion_lista(clon, rama):
    salida = git(clon, "grep", "-l", "-E", '"(estado|status)": *"(listo|ready)"', rama, "--", "docs/difusion/**/web.md",
                 "docs/media/**/web.md", check=False)
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
        enlazado = any(url_repo(e) == url for e in ficha["enlaces"])
        if visibilidad == "public" and not enlazado:
            r["enlace"] = "repo público sin enlace al código en la ficha: proponer añadirlo (ADR 0003)"
        elif visibilidad == "private" and enlazado:
            r["enlace"] = "repo privado enlazado desde la ficha: quitar el enlace"
    nombre_ficha = ficha if cfg["destino"] == "ficha" else None
    r["escaparate"] = escaparate(cfg["slug"], [cfg.get("nombre"), (nombre_ficha or {}).get("nombre")],
                                 cfg.get("diagramas", []))
    clon = buscar_clon(clones, nombre)
    if clon is None:
        r["falta_clon"] = (f"git clone https://github.com/{nombre} {Path(clones) / nombre.split('/')[1]}"
                           + (" (privado: antes add_repo con lectura)" if visibilidad == "private" else ""))
        return r
    r["clon"] = str(clon)
    desde = min(f for f in (r.get("N"), r.get("F")) if f) if r.get("F") else None
    if cfg["destino"] == "ficha" and not desde:
        r["aviso"] = "la ficha no tiene «actualizado»: sin fecha F no se miran commits ni difusión; ponle una"
    rama = poner_al_dia(clon, desde)
    r["rama"] = rama
    if desde:
        r["commits"], r["commits_total"], r["commits_dia_N"] = commits(clon, rama, r["N"])
        r["vigilados"] = cambios_vigilados(clon, rama, r["F"], cfg.get("vigilar", []))
        r["difusion_lista"] = difusion_lista(clon, rama)
    if cfg.get("etiquetas"):
        r["etiqueta"] = etiqueta_mayor(clon)
        if r["etiqueta"] and etiqueta_nueva(r["etiqueta"], r.get("F"), (nombre_ficha or {}).get("version_publicada")):
            r["etiqueta"]["nueva"] = True
    rutas = [cfg["bitacora"]] if cfg.get("bitacora") else []
    if cfg["destino"] == "proximamente":
        rutas = ["docs/plan.md", cfg.get("bitacora", "docs/traspaso.md")]
    r["bitacora"] = dict(cabecera_bitacora(clon, rama, ruta) for ruta in rutas)
    if cfg.get("roadmap"):
        r["roadmap"] = seccion_roadmap(clon, rama, cfg["roadmap"])
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
            dia_n = r.get("commits_dia_N", 0)
            out.append(f"- commits desde N: {r['commits_total']}"
                       + (f", {dia_n} del propio día N (mira si ya los cuenta su novedad)" if dia_n else "")
                       + (f" (se muestran {MAX_COMMITS})" if r['commits_total'] > MAX_COMMITS else ""))
            out += [f"    {c}" for c in r["commits"]]
        if r.get("vigilados"):
            out.append("- rutas vigiladas cambiadas desde F:")
            out += [f"    {v}" for v in r["vigilados"]]
        if r.get("difusion_lista"):
            out.append("- difusión marcada «listo»: " + ", ".join(r["difusion_lista"]))
        for ruta, filas in (r.get("bitacora") or {}).items():
            out.append(f"- {ruta}:" + ("" if filas else " (no existe o sin tabla)"))
            out += [f"    {f}" for f in filas]
        if r.get("roadmap"):
            ruta, lineas = r["roadmap"]
            out.append(f"- roadmap ({ruta}), para comparar con los hitos de la ficha:"
                       + ("" if lineas else " (no existe o falta la sección; corrige «roadmap» en fuentes.json)"))
            out += [f"    {x}" for x in lineas]
        if r.get("escaparate"):
            e = r["escaparate"]
            out.append("- imágenes y diagramas en el portal (último cambio):")
            out += [f"    {v}" for v in e["visuales"]] or ["    (ninguno)"]
            out.append("- otros archivos del portal que lo nombran:")
            out += [f"    {m}" for m in e["menciones"]] or ["    (ninguno)"]
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
