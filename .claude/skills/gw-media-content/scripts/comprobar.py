#!/usr/bin/env python3
"""gw-media-content: checks a piece folder before anything is published.

    python3 comprobar.py [--prefijos-tarea A,B,...] [--limite canal=N]... [--formato-propio canal]...
                         <dir>/AAAA-MM-DD/NN-<tema> [more folders]

A folder argument may also be a date folder or the whole <dir> (default docs/difusion): every piece below it is
checked. No config: the per-network limits are read from ../reglas.json.

Piece layout:
    ficha.md              facts with their source; sections `## Canales` (one channel per line), `## Imágenes`
                          (table: Imagen | Texto alternativo `es: ... / en: ...` | Canales: every channel listed
                          there needs an `Imagen:` line pointing to the file, and the other way round), `## Publicado`;
                          the line `Idiomas: es, en` (mandatory; any ISO 639-1 code, two lowercase letters; the first
                          one is the main language); channel names are lowercase [a-z0-9-]+
    <canal>.md            one per channel in `## Canales`, with one `## es` / `## en` section per language
                          (a `##` heading that is not a language ends the section: use `###` inside a post);
                          `Imagen: medios/<name>.webp` lines say which render goes with the post (.png for LinkedIn)
    medios/fuente/        sources: .html .svg .png .jpg .jpeg
    medios/               renders: <name>.webp + <name>-mini.webp (every channel but LinkedIn), <name>.png (LinkedIn
                          takes .png, .jpg and .gif), or <name>.pdf (LinkedIn document carousel)
Images per language: the first language of `Idiomas:` uses `medios/<name>.webp` (no suffix); any other language may
have its own `medios/<name>.<lang>.webp` (+ `<name>.<lang>-mini.webp`, rendered from `fuente/<name>.<lang>.html`). An
`Imagen:` line inside a `## <lang>` section may point to the plain file or to the `.<lang>.` file of that same language;
the `## Imágenes` table may list both (the `.<lang>.` row needs the alt text only in its language). A `.<lang>.` suffix
for a language that is not in `Idiomas:` (or the suffix of the first language) is an error.
Reddit: with reddit.md, `## Reddit` in ficha.md holds `Subreddit:` lines (r/<name>, one or several), `Normas leídas:`
(AAAA-MM-DD, not in the future and at most `reddit.normas_dias` days old, counted at the date folder of the piece) and
`Autopromoción:`, all before the first `###`; and, for every subreddit, a subsection `### Normas de r/<name>` with the
rules text pasted as is (at least `reddit.normas_min_caracteres` characters once whitespace is collapsed; the block
ends at the next line that starts with `##`, so the pasted text cannot contain `#` headings: paste them as plain lines).
Known channels (in reglas.json): x, reddit, linkedin, discord. Any other ("extra") channel listed in `## Canales`
has its file `<canal>.md` and takes images .webp, .png and .jpg (`canal_extra.imagen_formatos`). Without options it gets
the generic checks only: template gaps, jargon, `Imagen:` lines and a `## <lang>` section per language, with no length
limit. Options (before the folders, both repeatable):
    --limite canal=N          each language section of <canal>.md has at most N characters (plain count, `Imagen:`
                              lines excluded)
    --formato-propio canal    <canal>.md is consumed by another system (e.g. a JSON block for a website): it must exist
                              and not be empty; no `## <lang>` sections and no length check (template gaps and jargon
                              are still looked for); a `## Imágenes` row that lists it needs the image path
                              (`medios/x.webp`) somewhere in the file's text, instead of an `Imagen:` line
A known channel in either option, the same channel in both, or a channel that no checked piece lists under
`## Canales` is a usage error (exit 2).

Prints OK, or one line per problem with the fix; exit 1 on any problem (2 on bad usage).
"""
import json
import re
import struct
import sys
import unicodedata
from datetime import date
from pathlib import Path

AQUI = Path(__file__).resolve().parent
REGLAS = AQUI.parent / "reglas.json"
CONOCIDOS = ("x", "reddit", "linkedin", "discord")
IDIOMA = re.compile(r"[a-z]{2}")  # ISO 639-1, any code
CANAL = re.compile(r"[a-z0-9-]+")
SUFIJO_IDIOMA = re.compile(r"\.([a-z]{2})(?:-mini)?\.[A-Za-z0-9]+$")  # medios/<name>.<lang>.webp, <name>.<lang>-mini.webp
FUENTES = (".html", ".svg", ".png", ".jpg", ".jpeg")  # the same list as render.mjs
URL = re.compile(r"https?://\S+")
URL_FINAL = ".,;:!?)]}»\"'"  # punctuation that closes a sentence, not part of a link
RENDER = "node .claude/skills/gw-media-content/scripts/render.mjs"  # the installed path in a project
FORMATO_BASE = (".webp",)  # every channel without `imagen_formatos` in reglas.json
RENDERS = re.compile(r"^medios/[^/]+\.(?:webp|png|jpg|gif|pdf)$")
FECHA = re.compile(r"\d{4}-\d{2}-\d{2}")
CARPETA_PIEZA = re.compile(r"^\d{2}-[a-z0-9][a-z0-9-]*$")
# A lone … is a gap only when it is a whole line (or the whole value after a `label:`), not a word in prose.
HUECO = re.compile(r"\{\{[^}]*\}\}|(?m:^[ \t>*_-]*(?:\*{0,2}[^\n:]{1,40}:\*{0,2}[ \t]*)?…[ \t]*$)|<tema>|AAAA-MM-DD")
IMAGEN = re.compile(r"(?mi)^[ \t>*_-]*Imagen:[ \t]*(.*)$")
# Internal jargon: finding numbers (P3, F12) named as findings, task ids with a known prefix (QA-215), branch names,
# WIP: markers. A link is never read for jargon, and AES-256, WPA-3, AK-47, P1/P2 or F5 in prose pass. The prefixes
# are the generic ones; a project adds its own with --prefijos-tarea A,B,... (its INS-3 or FLU-12 ids).
PREFIJOS_TAREA = ("QA", "TASK", "TICKET", "ISSUE", "BUG", "JIRA", "GW", "EPIC", "STORY")
JERGA = (
    re.compile(r"\b(?:claude|feat|fix|chore|hotfix|release)/[\w./-]*\w|\bccr-[\w-]*\w|\bWIP:"),
    re.compile(r"(?i:\b(?:hallazgos?|findings?|propuestas?|proposals?|ítems?|items?))[ \t]+#?([PF]\d{1,3})\b"
               r"|[\[(]([PF]\d{1,3})[\])]"),
)
# Every reglas.json key the script reads ("channel.key"); cargar_reglas fails closed when one is missing.
CLAVES = (
    "x.longitud", "x.url_peso", "x.simbolo_ancho_peso", "x.hilo_posts", "x.imagen_bytes", "x.alt_max",
    "reddit.titulo", "reddit.normas_dias", "reddit.normas_min_caracteres",
    "canal_extra.imagen_formatos",
    "linkedin.longitud", "linkedin.imagen_pixeles", "linkedin.imagen_formatos", "linkedin.alt_max",
    "linkedin.documento_bytes", "linkedin.documento_paginas",
    "discord.mensaje", "discord.imagen_bytes", "discord.alt_max",
)


class ReglasIncompletas(Exception):
    pass


def validar_reglas(reglas: dict):
    for clave in CLAVES:
        canal, k = clave.split(".")
        r = reglas.get(canal, {}).get(k)
        if not isinstance(r, dict) or r.get("valor") is None:
            raise ReglasIncompletas(f"reglas.json lacks {clave}; restore it")


def cargar_reglas(ruta=REGLAS) -> dict:
    try:
        reglas = json.loads(Path(ruta).read_text(encoding="utf-8"))
    except (OSError, ValueError) as e:
        raise ReglasIncompletas(f"reglas.json cannot be read ({e}); restore it") from None
    validar_reglas(reglas)
    return reglas


def regla(reglas: dict, canal: str, clave: str):
    """Value of a rule, or None when the channel or the rule is not in reglas.json (CLAVES are always there)."""
    return reglas.get(canal, {}).get(clave, {}).get("valor")


def formatos(reglas: dict, canal: str) -> tuple:
    if canal not in CONOCIDOS:
        return tuple(regla(reglas, "canal_extra", "imagen_formatos"))
    return tuple(regla(reglas, canal, "imagen_formatos") or FORMATO_BASE)


def patrones_jerga(prefijos=()) -> tuple:
    """The jargon patterns: the fixed ones and the task ids with the generic prefixes plus the project's own."""
    todos = dict.fromkeys(PREFIJOS_TAREA + tuple(prefijos))
    return (re.compile(r"\b(?:" + "|".join(map(re.escape, todos)) + r")-\d{1,5}\b"),) + JERGA


def jerga(texto: str, prefijos=()) -> list:
    texto = URL.sub(" ", texto)
    return sorted({next(g for g in m.groups() if g) if m.groups() else m.group(0)
                   for p in patrones_jerga(prefijos) for m in p.finditer(texto)})


def peso_x(c: str) -> int:
    """twitter-text weight: ranges 0-4351, 8192-8205, 8208-8223 and 8242-8247 weigh 1, the rest 2."""
    o = ord(c)
    if o <= 4351 or 8192 <= o <= 8205 or 8208 <= o <= 8223 or 8242 <= o <= 8247:
        return 1
    return 2


def _emoji_base(c: str) -> bool:
    o = ord(c)
    return (0x1F000 <= o <= 0x1FAFF or 0x2190 <= o <= 0x21FF or 0x2300 <= o <= 0x23FF or 0x25A0 <= o <= 0x27BF
            or 0x2900 <= o <= 0x297F or 0x2B00 <= o <= 0x2BFF
            or o in (0xA9, 0xAE, 0x203C, 0x2049, 0x2122, 0x2139, 0x3030, 0x303D, 0x3297, 0x3299))


def _fin_emoji(texto: str, i: int) -> int:
    """Index after the emoji sequence that starts at i (i + 1 when it is a single character)."""
    n, c = len(texto), texto[i]
    if 0x1F1E6 <= ord(c) <= 0x1F1FF:  # a flag: two regional indicators
        return i + 2 if i + 1 < n and 0x1F1E6 <= ord(texto[i + 1]) <= 0x1F1FF else i + 1
    if c in "0123456789#*":  # a keycap: digit, optional FE0F, 20E3
        j = i + 2 if i + 1 < n and texto[i + 1] == "\ufe0f" else i + 1
        return j + 1 if j < n and texto[j] == "\u20e3" else i + 1
    if not _emoji_base(c):
        return i + 1
    j = i + 1
    while True:
        while j < n and (texto[j] in "\ufe0f\u20e3" or 0x1F3FB <= ord(texto[j]) <= 0x1F3FF or 0xE0020 <= ord(texto[j]) <= 0xE007F):
            j += 1  # variation selector, keycap, skin tone, tag characters
        if j + 1 < n and texto[j] == "\u200d" and _emoji_base(texto[j + 1]):  # a ZWJ chain (family, profession)
            j += 2
            continue
        return j


def longitud_x(texto: str, url_peso: int, ancho_peso: int) -> int:
    """X's weighted count: a link weighs url_peso (the punctuation that closes a sentence after it does not belong to
    it); an emoji sequence (flag, emoji with a skin tone or variation selector, ZWJ family) is one block of
    ancho_peso; any other wide character weighs ancho_peso; a variation selector on its own weighs 0."""
    def enlace(m):
        url = m.group(0)
        return "x" * url_peso + url[len(url.rstrip(URL_FINAL)):]
    texto = unicodedata.normalize("NFC", URL.sub(enlace, texto))
    total, i = 0, 0
    while i < len(texto):
        j = _fin_emoji(texto, i)
        if j > i + 1:
            total += ancho_peso
            i = j
            continue
        c, i = texto[i], i + 1
        if c != "\ufe0f":
            total += ancho_peso if peso_x(c) == 2 else 1
    return total


def secciones(texto: str) -> dict:
    """Splits a channel file by its `## es` / `## en` headings. Any other `##` heading ends the language section."""
    partes, actual = {}, None
    for linea in texto.splitlines():
        t = linea.strip()
        m = re.match(r"^##\s+([a-z]{2})\s*$", t)
        if m:
            actual = m.group(1)
            partes.setdefault(actual, [])
        elif re.match(r"^##\s+\S", t):
            actual = None
        elif actual:
            partes[actual].append(linea)
    return {k: "\n".join(v) for k, v in partes.items()}


def idiomas_repetidos(texto: str) -> list:
    todos = re.findall(r"(?m)^##\s+([a-z]{2})\s*$", texto)
    return sorted({i for i in todos if todos.count(i) > 1})


def apartado(texto: str, titulo: str) -> str:
    m = re.search(r"(?ms)^##\s+" + re.escape(titulo) + r"\s*$(.*?)(?=^## |\Z)", texto)
    return m.group(1) if m else ""


def campo(texto: str, *nombres) -> str:
    for n in nombres:
        m = re.search(r"(?mi)^[\s>*-]*\*{0,2}" + re.escape(n) + r"[ \t]*:[ \t]*\*{0,2}[ \t]*(.*)$", texto)
        if m and m.group(1).strip():
            return m.group(1).strip()
    return ""


def canales_pedidos(ficha: str) -> list:
    out = []
    for linea in apartado(ficha, "Canales").splitlines():
        c = linea.strip().lstrip("-*").strip().strip("`")
        if c:
            out.append(c)
    return out


def sin_imagenes(texto: str) -> str:
    return IMAGEN.sub("", texto).strip()


MARCA_X = re.compile(r"(?m)^\*\*\d+/(?:\d+)?\*\*\s*")  # **1/** or **1/4**


def posts_x(seccion: str):
    """(text before the first marker, posts). Each post starts with **n/** or **n/m**; without markers the whole
    section is one post."""
    trozos = MARCA_X.split(sin_imagenes(seccion))
    if len(trozos) == 1:
        return "", ([trozos[0].strip()] if trozos[0].strip() else [])
    return trozos[0].strip(), [t.strip() for t in trozos[1:] if t.strip()]


# ---- image headers (no Pillow) ----

def dimensiones(ruta: Path):
    """(width, height) of a WebP, PNG, JPEG or GIF, or None when the header is truncated or not understood."""
    d = ruta.read_bytes()
    try:
        if d[:8] == b"\x89PNG\r\n\x1a\n":
            if len(d) < 24 or d[12:16] != b"IHDR":
                return None
            return _con_area(*struct.unpack(">II", d[16:24]))
        if d[:6] in (b"GIF87a", b"GIF89a"):
            return _con_area(*struct.unpack("<HH", d[6:10]))
        if d[:4] == b"RIFF" and d[8:12] == b"WEBP":
            if len(d) < 20 or len(d) < struct.unpack("<I", d[4:8])[0] + 8:
                return None  # the RIFF size says more bytes than the file has: truncated
            tipo = d[12:16]
            if tipo == b"VP8X" and len(d) >= 30:
                return _con_area(1 + int.from_bytes(d[24:27], "little"), 1 + int.from_bytes(d[27:30], "little"))
            if tipo == b"VP8L" and len(d) >= 25 and d[20] == 0x2F:
                bits = int.from_bytes(d[21:25], "little")
                return _con_area((bits & 0x3FFF) + 1, ((bits >> 14) & 0x3FFF) + 1)
            if tipo == b"VP8 " and len(d) >= 30 and d[23:26] == b"\x9d\x01\x2a":
                return _con_area(int.from_bytes(d[26:28], "little") & 0x3FFF, int.from_bytes(d[28:30], "little") & 0x3FFF)
        if d[:2] == b"\xff\xd8":
            i = 2
            while i + 9 < len(d):
                if d[i] != 0xFF:
                    i += 1
                    continue
                marca = d[i + 1]
                if marca in (0xD8, 0x01) or 0xD0 <= marca <= 0xD7 or marca == 0xFF:
                    i += 1 if marca == 0xFF else 2
                    continue
                if 0xC0 <= marca <= 0xCF and marca not in (0xC4, 0xC8, 0xCC):
                    h, w = struct.unpack(">HH", d[i + 5:i + 9])
                    return _con_area(w, h)
                i += 2 + struct.unpack(">H", d[i + 2:i + 4])[0]
    except (struct.error, IndexError):
        pass
    return None


def _con_area(ancho: int, alto: int):
    return (ancho, alto) if ancho > 0 and alto > 0 else None


def paginas_pdf(ruta: Path):
    """Page count of a PDF (page objects, else the largest /Count), or None."""
    d = ruta.read_bytes()
    if not d.startswith(b"%PDF"):
        return None
    n = len(re.findall(rb"/Type\s*/Page(?![A-Za-z])", d))
    if n:
        return n
    cuentas = [int(x) for x in re.findall(rb"/Count\s+(\d+)", d)]
    return max(cuentas) if cuentas else None


def alt_por_idioma(celda: str) -> dict:
    out = {}
    for m in re.finditer(r"(?:^|\s/\s)\s*([a-z]{2})\s*:\s*(.*?)(?=\s/\s+[a-z]{2}\s*:|$)", celda.strip()):
        out[m.group(1)] = m.group(2).strip()
    return out


def tabla_imagenes(ficha: str):
    """{path: (alt cell, channels cell)} from `## Imágenes`, or None when the section is missing."""
    if not re.search(r"(?m)^##\s+Imágenes\s*$", ficha):
        return None
    filas = {}
    for fila in apartado(ficha, "Imágenes").splitlines():
        celdas = [c.strip() for c in fila.strip().strip("|").split("|")]
        if len(celdas) < 2 or celdas[0] in ("Imagen", "") or set(celdas[0]) <= set("-: "):
            continue
        filas[celdas[0].strip("`")] = (celdas[1], celdas[2] if len(celdas) > 2 else "")
    return filas


# ---- the checks ----

def _hueco(m) -> str:
    t = m.group(0).strip()
    return "…" if t.endswith("…") and "{{" not in t else t


def comprobar_canal(canal, texto, idiomas, reglas, prefijos=(), limite=None):
    f = []
    nombre = canal + ".md"
    partes = secciones(texto)
    for i in idiomas:
        if not partes.get(i, "").strip():
            f.append(f"{nombre}: no «## {i}» section; add it with the post in that language")
    for i in idiomas_repetidos(texto):
        f.append(f"{nombre}: «## {i}» appears more than once; merge the sections into one")
    for i in partes:
        if i not in idiomas:
            f.append(f"{nombre}: language «{i}» is not in the piece; remove the section or add it to «Idiomas:» in ficha.md")
    for j in jerga(texto, prefijos):
        f.append(f"{nombre}: internal jargon «{j}»; move it to «## Uso interno» in ficha.md and remove it from the post")
    for m in HUECO.finditer(texto):
        f.append(f"{nombre}: template gap «{_hueco(m)}» left; write the text")
    for i in idiomas:
        t = sin_imagenes(partes.get(i, ""))
        if not t:
            continue
        if canal == "x":
            n_max, mp = regla(reglas, "x", "longitud"), regla(reglas, "x", "hilo_posts")
            url_peso, ancho = regla(reglas, "x", "url_peso"), regla(reglas, "x", "simbolo_ancho_peso")
            previo, posts = posts_x(t)
            if previo:
                f.append(f"{nombre} ({i}): text before «**1/**»; start every post with a marker (**1/**, **2/**…) "
                         "or move that text into the first post")
            if not mp["min"] <= len(posts) <= mp["max"]:
                f.append(f"{nombre} ({i}): {len(posts)} posts; a thread has {mp['min']} to {mp['max']} (**1/**, **2/**…); "
                         "split or merge the posts")
            for k, p in enumerate(posts, 1):
                n = longitud_x(p, url_peso, ancho)
                if n > n_max:
                    f.append(f"{nombre} ({i}) post {k}: {n} weighted characters (max {n_max}; a link counts "
                             f"{url_peso}, an emoji {ancho}); shorten it by {n - n_max}")
        elif canal == "linkedin":
            mx = regla(reglas, "linkedin", "longitud")
            if len(t) > mx:
                f.append(f"{nombre} ({i}): {len(t)} characters (max {mx}); shorten it by {len(t) - mx}")
        elif canal == "discord":
            mx = regla(reglas, "discord", "mensaje")
            for k, b in enumerate(re.split(r"(?m)^---\s*$", t), 1):
                if len(b.strip()) > mx:
                    f.append(f"{nombre} ({i}) message {k}: {len(b.strip())} characters (max {mx}); "
                             "split it with a line containing only ---")
        elif canal == "reddit":
            m = re.search(r"(?mi)^\*\*(?:Título|Titulo|Title)\s*:\*\*[ \t]*(.+)$", t)
            mx = regla(reglas, "reddit", "titulo")
            if not m:
                f.append(f"{nombre} ({i}): no title; add a line «**Título:** …» (or «**Title:** …»)")
            elif len(m.group(1).strip()) > mx:
                f.append(f"{nombre} ({i}): title of {len(m.group(1).strip())} characters (max {mx}); shorten it")
        elif canal not in CONOCIDOS and limite and len(t) > limite:
            f.append(f"{nombre} ({i}): {len(t)} characters (max {limite}, set with --limite {canal}={limite}); "
                     f"shorten it by {len(t) - limite}")
    return f


def comprobar_propio(canal, texto, prefijos=()):
    """A channel set with --formato-propio: its file feeds another system, so there are no language sections and no
    length; it must not be empty, and template gaps and jargon are still looked for."""
    nombre = canal + ".md"
    if not texto.strip():
        return [f"{nombre}: empty (channel set with --formato-propio); write the content the other system reads"]
    f = [f"{nombre}: internal jargon «{j}»; move it to «## Uso interno» in ficha.md and remove it from the content"
         for j in jerga(texto, prefijos)]
    f += [f"{nombre}: template gap «{_hueco(m)}» left; write the text" for m in HUECO.finditer(texto)]
    return f


NOMBRE_SUB = re.compile(r"[A-Za-z0-9_]{2,21}")
FIN_BLOQUE = re.compile(r"(?m)^#{2,}(?:[ \t]|$)")
BLOQUE_NORMAS = re.compile(r"(?mi)^###[ \t]+Normas[ \t]+de[ \t]+(?:/?r/)?(\S+)[ \t]*$")


def cabecera_reddit(ficha: str) -> str:
    """The `## Reddit` section up to its first `###` subsection (the whole ficha when there is no such section)."""
    seccion = apartado(ficha, "Reddit")
    return re.split(r"(?m)^###", seccion)[0] if seccion else ficha


def subreddits(cabecera: str):
    """([names], [problems]) from the `Subreddit:` lines; a line with a template gap is skipped (the gap is reported)."""
    nombres, problemas = [], []
    for m in re.finditer(r"(?mi)^[ \t>*-]*\*{0,2}Subreddits?[ \t]*:[ \t]*\*{0,2}[ \t]*(.*)$", cabecera):
        valor = m.group(1).strip()
        if "{{" in valor or valor in ("", "…"):
            continue
        for tok in re.split(r"[,;\s]+", valor):
            nombre = re.sub(r"^/?r/", "", tok.strip("`*_ "), flags=re.I)
            if not nombre:
                continue
            if not NOMBRE_SUB.fullmatch(nombre):
                problemas.append(f"ficha.md: «Subreddit:» «{tok}» is not a subreddit name; write it as r/<name>")
            elif nombre.lower() not in [n.lower() for n in nombres]:
                nombres.append(nombre)
    return nombres, problemas


def bloques_normas(seccion: str):
    """({name.lower(): pasted text}, [names repeated]) from the `### Normas de r/<name>` subsections."""
    trozos = BLOQUE_NORMAS.split(seccion)
    bloques, repetidos = {}, []
    for nombre, texto in zip(trozos[1::2], trozos[2::2]):
        texto = FIN_BLOQUE.split(texto, 1)[0]  # the block ends at the next heading of level 2 or more
        k = nombre.strip("`*_").lower()
        if k in bloques:
            repetidos.append(nombre)
        bloques[k] = (bloques.get(k, "") + " " + texto).strip() if k in bloques else texto
    return bloques, repetidos


def comprobar_reddit(ficha, reglas=None, hoy=None, dia_pieza=None):
    """dia_pieza: the date of the piece's folder; `Normas leídas:` is aged against it (against hoy when None), and a
    date after hoy is always in the future."""
    reglas = reglas or cargar_reglas()
    hoy = hoy or date.today()
    referencia = dia_pieza or hoy
    f = []
    cab = cabecera_reddit(ficha)
    for etiqueta, nombres in (("Subreddit", ("Subreddit", "Subreddits")), ("Normas leídas", ("Normas leídas", "Normas leidas")),
                              ("Autopromoción", ("Autopromoción", "Autopromocion"))):
        v = campo(cab, *nombres)
        if not v or v == "…":
            f.append(f"ficha.md: reddit.md needs «{etiqueta}:» in ficha.md; put the field before the first «###» block of "
                     f"«## Reddit», paste the subreddit rules and write the «{etiqueta}:» line")
        elif etiqueta == "Normas leídas":
            m = FECHA.search(v)
            try:
                dia = date.fromisoformat(m.group(0))
            except (AttributeError, ValueError):
                f.append(f"ficha.md: «Normas leídas:» «{v}» has no valid AAAA-MM-DD date; write the day you read the rules")
                continue
            dias, mx = (referencia - dia).days, regla(reglas, "reddit", "normas_dias")
            if dia > hoy:
                f.append(f"ficha.md: «Normas leídas:» «{v}» is in the future; write the day you read the rules")
            elif dias > mx:
                f.append(f"ficha.md: «Normas leídas:» «{v}» is {dias} days old (max {mx}); read the rules again, paste "
                         "them under «### Normas de r/<name>» and write today's date"
                         + (f" (the age is counted at the piece date {referencia})" if referencia != hoy else ""))
    nombres, problemas = subreddits(cab)
    f += problemas
    valor = campo(cab, "Subreddit", "Subreddits")
    if not nombres and not problemas and valor not in ("", "…") and "{{" not in valor:
        f.append("ficha.md: no subreddit: write «- **Subreddit:** r/<name>» in «## Reddit» before the first «###» block")
    bloques, repetidos = bloques_normas(apartado(ficha, "Reddit"))
    for r in repetidos:
        f.append(f"ficha.md: «### Normas de r/{r}» appears more than once; merge the blocks into one")
    minimo = regla(reglas, "reddit", "normas_min_caracteres")
    for n in nombres:
        texto = re.sub(r"\s+", " ", bloques.get(n.lower(), "")).strip()
        if n.lower() not in bloques:
            f.append(f"ficha.md: no rules block for r/{n}; paste the rules text (at least {minimo} characters, copied from "
                     f"reddit.com/r/{n}/about/rules) under a «### Normas de r/{n}» heading inside «## Reddit» of ficha.md")
        elif len(texto) < minimo:
            f.append(f"ficha.md: the rules block of r/{n} has {len(texto)} characters (min {minimo}); paste the complete "
                     f"rules text under «### Normas de r/{n}» in «## Reddit» of ficha.md; the pasted text ends at the next "
                     "line starting with «##», so paste headings as plain lines without «#», and the «Subreddit:» fields "
                     "go before the first «###» block")
    for k in bloques:
        if "{{" not in k and k not in [n.lower() for n in nombres]:
            f.append(f"ficha.md: «### Normas de r/{k}» matches no «Subreddit:» line; add r/{k} to «Subreddit:» or remove "
                     "the block")
    return f


def canales_de_celda(celda: str) -> list:
    return [c for c in (x.strip("`*_ ").lower() for x in re.split(r"[,;\s]+", celda)) if c]


def idioma_de_archivo(ruta: str):
    """The language in a `.<lang>.` suffix of a file name (medios/tarjeta.gl.webp, tarjeta.gl-mini.webp), or None."""
    m = SUFIJO_IDIOMA.search(ruta.rsplit("/", 1)[-1])
    return m.group(1) if m else None


def problema_de_sufijo(ruta: str, idiomas, donde: str):
    """The error for a `.<lang>.` suffix that is not allowed (a language outside `Idiomas:`, or the first one)."""
    lang = idioma_de_archivo(ruta)
    if lang is None:
        return None
    if lang not in idiomas:
        return (f"{donde}: «{ruta}» has the language suffix «.{lang}.» but «{lang}» is not in «Idiomas:» of ficha.md; "
                f"add it there or rename the file")
    if idiomas and lang == idiomas[0]:
        return (f"{donde}: «{ruta}» has the suffix «.{lang}.» but «{lang}» is the first language and uses the file "
                f"without suffix; rename it to «{ruta.replace('.' + lang, '', 1)}»")
    return None


def comprobar_imagenes(carpeta, ficha, texto_canales, idiomas, reglas, prefijos=(), propios=()):
    f = []
    orden = f"{RENDER} {carpeta}"
    tabla = tabla_imagenes(ficha)
    if tabla is None:
        f.append("ficha.md: no «## Imágenes» section; add the table | Imagen | Texto alternativo | Canales |")
        tabla = {}
    # the `Imagen:` lines of each channel
    lineas, pares = {}, set()
    for canal, texto in texto_canales.items():
        for m in IMAGEN.finditer(texto):
            ruta = m.group(1).strip().strip("`*_ ")
            if not RENDERS.match(ruta):
                f.append(f"{canal}.md: «Imagen: {ruta}» is not a render; point to medios/<name>{formatos(reglas, canal)[0]} "
                         "(or .pdf)")
            else:
                p = problema_de_sufijo(ruta, idiomas, f"{canal}.md")
                if p:
                    f.append(p)
                lineas.setdefault(canal, [])
                if ruta not in lineas[canal]:
                    lineas[canal].append(ruta)
                if not (carpeta / ruta).is_file():
                    f.append(f"{canal}.md: «Imagen: {ruta}» does not exist; render it ({orden})")
    for canal, texto in texto_canales.items():  # a `Imagen:` line of another language's file sits in the wrong section
        for lang, seccion in secciones(texto).items():
            for m in IMAGEN.finditer(seccion):
                ruta = m.group(1).strip().strip("`*_ ")
                otro = idioma_de_archivo(ruta) if RENDERS.match(ruta) else None
                if otro and otro != lang and otro in idiomas:
                    f.append(f"{canal}.md ({lang}): «{ruta}» is the image of «{otro}» but sits in the «## {lang}» section; "
                             f"move the line to «## {otro}»")
    for canal, rutas in lineas.items():
        for ruta in rutas:
            if not (carpeta / ruta).is_file():
                continue
            if ruta not in tabla:
                f.append(f"{canal}.md: «{ruta}» is not in «## Imágenes» of ficha.md; add a row with its alt text")
            elif canal not in canales_de_celda(tabla[ruta][1]):
                f.append(f"{canal}.md: «{ruta}» is not listed for «{canal}» in «## Imágenes» of ficha.md; add «{canal}» "
                         "to the Canales cell of its row")
            pares.add((canal, ruta))
    # the rows of `## Imágenes`
    for ruta, (alt, celda) in tabla.items():
        if not ruta.startswith("medios/"):
            continue
        porIdioma = alt_por_idioma(alt)
        p = problema_de_sufijo(ruta, idiomas, "ficha.md")
        if p:
            f.append(p)
        propio = idioma_de_archivo(ruta)
        for i in ([propio] if propio in idiomas[1:] else idiomas):  # a `.<lang>.` render needs its language's alt only
            if not porIdioma.get(i) or porIdioma[i] == "…":
                f.append(f"ficha.md: «{ruta}» has no alt text in «{i}»; write «{i}: …» in its alt cell (es: … / en: …)")
        for j in jerga(alt, prefijos):
            f.append(f"ficha.md: alt text of «{ruta}» has internal jargon «{j}»; remove it")
        if not (carpeta / ruta).is_file():
            f.append(f"ficha.md: «{ruta}» does not exist; render it ({orden})")
        elif ruta.endswith(".webp"):
            mini = ruta.replace(".webp", "-mini.webp")
            if not (carpeta / mini).is_file():
                f.append(f"ficha.md: «{ruta}» has no -mini.webp; render it again ({orden})")
            elif dimensiones(carpeta / mini) is None:
                f.append(f"{mini}: not a valid image; render it again ({orden})")
        for c in canales_de_celda(celda):
            if c in propios and c in texto_canales and ruta not in texto_canales[c]:
                f.append(f"ficha.md: «{ruta}» lists channel «{c}» but {c}.md does not contain the path «{ruta}» (channel "
                         f"with its own format); write the path in the file or remove «{c}» from the Canales cell")
            elif c in texto_canales and c not in propios and ruta not in lineas.get(c, []):
                f.append(f"ficha.md: «{ruta}» lists channel «{c}» but {c}.md has no «Imagen: {ruta}» line; add the line "
                         f"or remove «{c}» from the Canales cell")
            if c in texto_canales and (carpeta / ruta).is_file():
                pares.add((c, ruta))
    for canal, ruta in sorted(pares):
        f += comprobar_archivo(carpeta / ruta, ruta, canal, tabla.get(ruta, ("", ""))[0], reglas, orden)
    listadas = set(tabla)
    medios = carpeta / "medios"
    sueltas = [x for e in ("webp", "png", "jpg", "gif", "pdf") for x in medios.glob(f"*.{e}")]
    for img in sorted(sueltas):
        if not img.name.endswith("-mini.webp") and f"medios/{img.name}" not in listadas:
            f.append(f"medios/{img.name}: not in «## Imágenes» of ficha.md; add a row with its alt text or delete the file")
    fuente = medios / "fuente"
    for s in sorted(fuente.glob("*")):
        suf = s.suffix.lower()
        if suf in FUENTES:
            p = problema_de_sufijo(f"medios/fuente/{s.name}", idiomas, f"medios/fuente/{s.name}")
            if p:
                f.append(p)
        if suf in (".html", ".svg") and "{{" in s.read_text(encoding="utf-8", errors="replace"):
            f.append(f"medios/fuente/{s.name}: template gaps {{{{…}}}} left; fill them and render again")
        if suf in FUENTES and not any((medios / f"{s.stem}{e}").is_file() for e in (".webp", ".pdf")):
            f.append(f"medios/fuente/{s.name}: not rendered; run {orden}")
    return f


def comprobar_archivo(ruta, rel, canal, alt, reglas, orden):
    f = []
    if rel.endswith(".pdf"):
        if canal != "linkedin":
            return [f"{canal}.md: «{rel}» is a PDF and only LinkedIn takes a document; use a "
                    f"{formatos(reglas, canal)[0]} render"]
        peso, mx = ruta.stat().st_size, regla(reglas, "linkedin", "documento_bytes")
        if peso > mx:
            f.append(f"{rel}: {peso} bytes (LinkedIn max {mx}); export a lighter PDF")
        pags, mp = paginas_pdf(ruta), regla(reglas, "linkedin", "documento_paginas")
        if pags is None:
            f.append(f"{rel}: the page count cannot be read; render the PDF again ({orden})")
        elif pags > mp:
            f.append(f"{rel}: {pags} pages (LinkedIn max {mp}); cut the carousel")
        return f
    permitidos = formatos(reglas, canal)
    if Path(rel).suffix.lower() not in permitidos:
        f.append(f"{canal}.md: «{rel}» is a {Path(rel).suffix.lower()} and {canal} takes {', '.join(permitidos)}; "
                 f"point to medios/<name>{permitidos[0]} (the render writes it)")
    peso, mx = ruta.stat().st_size, regla(reglas, canal, "imagen_bytes")
    if mx and peso > mx:
        f.append(f"{rel}: {peso} bytes (max {mx} for {canal}); lower the quality or the size and render again")
    dim, mpx = dimensiones(ruta), regla(reglas, canal, "imagen_pixeles")
    if dim is None:
        f.append(f"{rel}: not a valid image; render it again ({orden})")
    elif mpx and dim[0] * dim[1] >= mpx:
        f.append(f"{rel}: {dim[0]}x{dim[1]} = {dim[0] * dim[1]} pixels (must be under {mpx} for {canal}); scale it down")
    amax = regla(reglas, canal, "alt_max")
    if amax:
        for i, t in alt_por_idioma(alt).items():
            if len(t) > amax:
                f.append(f"ficha.md: alt text «{i}» of «{rel}» has {len(t)} characters (max {amax} for {canal}); shorten it")
    return f


def leer(ruta: Path, rel: str):
    """(text, None), or (None, problem) when the file is not valid UTF-8 or cannot be read. A BOM is dropped."""
    try:
        return ruta.read_text(encoding="utf-8-sig"), None
    except UnicodeDecodeError:
        return None, f"{rel}: not valid UTF-8 text; open it in an editor and save it as UTF-8"
    except OSError as e:
        return None, f"{rel}: cannot be read ({e.strerror or e}); check the file and its permissions"


def comprobar(carpeta: Path, reglas=None, prefijos=(), limites=None, propios=(), hoy=None) -> list:
    """The problems of one piece folder. limites {channel: max characters per language section} and propios (channels
    whose file has its own format) are the --limite and --formato-propio options; hoy is the date `Normas leídas:` is
    measured against when the piece is not under a date folder (today)."""
    limites, propios = limites or {}, set(propios)
    try:
        reglas = reglas or cargar_reglas()
        validar_reglas(reglas)
    except ReglasIncompletas as e:
        return [str(e)]
    carpeta = Path(carpeta)
    f = []
    if not carpeta.is_dir():
        return ["the folder does not exist; create it as <dir>/AAAA-MM-DD/NN-<tema>"]
    padre = carpeta.resolve().parent.name
    try:
        ok_fecha = bool(FECHA.fullmatch(padre)) and bool(date.fromisoformat(padre))
    except ValueError:
        ok_fecha = False
    if not CARPETA_PIEZA.match(carpeta.resolve().name) or not ok_fecha:
        f.append("folder name: expected <dir>/AAAA-MM-DD/NN-<tema> (e.g. 2026-10-25/01-release); rename the folder")
    if not (carpeta / "ficha.md").is_file():
        f.append("no ficha.md; create it from the piece template (facts with their source)")
    mds = sorted(p.stem for p in carpeta.glob("*.md") if p.name != "ficha.md")
    if not (carpeta / "ficha.md").is_file():
        if not mds:
            f.append("no channel file; add <canal>.md (x, reddit, linkedin, discord)")
        return f
    ficha, error = leer(carpeta / "ficha.md", "ficha.md")
    if error:
        return [error]
    for m in HUECO.finditer(ficha):
        f.append(f"ficha.md: template gap «{_hueco(m)}» left; write the text")
    if not re.search(r"(?m)^##\s+Publicado\s*$", ficha):
        f.append("ficha.md: no «## Publicado» section; add the table | Canal | Idioma | Fecha | Enlace |")
    crudos = list(dict.fromkeys(canales_pedidos(ficha)))
    if not crudos:
        f.append("ficha.md: no channels under «## Canales»; list one channel per line (x, reddit, linkedin, discord…)")
    pedidos = []
    for c in crudos:
        if CANAL.fullmatch(c):
            pedidos.append(c)
        else:
            f.append(f"ficha.md: channel «{c}» under «## Canales» is not a valid name; use lowercase letters, digits and "
                     "hyphens ([a-z0-9-]+), one channel per line")
    for c in pedidos:
        if not (carpeta / f"{c}.md").is_file():
            f.append(f"{c}.md: listed under «## Canales» but missing; write it or remove the line")
    for c in mds:
        if c not in pedidos:
            if c in CONOCIDOS:
                f.append(f"{c}.md: channel not requested; delete the file or list «{c}» under «## Canales» in ficha.md")
            else:
                f.append(f"{c}.md: unknown channel file; list it under «## Canales» in ficha.md or delete the file")
    activos = [c for c in pedidos if (carpeta / f"{c}.md").is_file()]
    textos = {}
    for c in activos:
        texto, error = leer(carpeta / f"{c}.md", f"{c}.md")
        if error:
            f.append(error)
        else:
            textos[c] = texto
    activos = [c for c in activos if c in textos]
    declarados = [x.strip() for x in re.split(r"[,\s]+", campo(ficha, "Idiomas")) if x.strip()]
    if not declarados:
        f.append('no languages: add "Idiomas: es, en" to ficha.md')
    for i in declarados:
        if not IDIOMA.fullmatch(i):
            f.append(f"ficha.md: «Idiomas:» has «{i}»; use two-letter lowercase ISO 639-1 codes separated by commas "
                     "(es, en, gl)")
    declarados = [i for i in dict.fromkeys(declarados) if IDIOMA.fullmatch(i)]
    idiomas = declarados or sorted({i for c, t in textos.items() if c not in propios for i in secciones(t)})
    for c in activos:
        if c in propios:
            f += comprobar_propio(c, textos[c], prefijos)
        else:
            f += comprobar_canal(c, textos[c], idiomas, reglas, prefijos, limites.get(c))
    if "reddit" in activos:
        f += comprobar_reddit(ficha, reglas, hoy, date.fromisoformat(padre) if ok_fecha else None)
    f += comprobar_imagenes(carpeta, ficha, textos, idiomas, reglas, prefijos, propios)
    return list(dict.fromkeys(f))


def piezas(arg: Path) -> list:
    """A piece folder, or the pieces below a date folder or the whole <dir>."""
    if (arg / "ficha.md").is_file() or not arg.is_dir():
        return [arg]
    en_fecha = bool(FECHA.fullmatch(arg.resolve().name))
    hijos = sorted(p for p in arg.iterdir() if p.is_dir() and not p.name.startswith(("_", ".")))
    out = []
    for h in hijos:
        if CARPETA_PIEZA.match(h.name) or (h / "ficha.md").is_file():
            out.append(h)
        elif FECHA.fullmatch(h.name):
            out += piezas(h)
        elif parece_pieza(h, en_fecha):  # a misnamed folder without ficha.md: checked, so that it is reported
            out.append(h)
    return out or [arg]


def parece_pieza(p: Path, en_fecha=False) -> bool:
    """A folder with a medios/ folder or the file of a known channel is a piece, whatever its name; under a date folder
    any folder with a .md file is (a piece with only <extra channel>.md files); propuestas/ at the root is not."""
    if (p / "medios").is_dir() or any((p / f"{c}.md").is_file() for c in CONOCIDOS):
        return True
    return en_fecha and any(p.glob("*.md"))


USO = ("usage: comprobar.py [--prefijos-tarea A,B,...] [--limite canal=N]... [--formato-propio canal]... "
       "<dir>/AAAA-MM-DD/NN-<tema> [...]  (e.g. docs/difusion/2026-10-25/01-release; --prefijos-tarea adds the task-id "
       "prefixes of the project, e.g. INS,FLU; --limite portal=500 caps each language section of an extra channel; "
       "--formato-propio portal marks an extra channel whose file has its own format)")


def leer_opciones(args: list):
    """(folders, prefixes, limits, own-format channels, error). The options come before the folders."""
    args, prefijos, limites, propios = list(args), [], {}, []
    while args and args[0].startswith("--"):
        opcion = args.pop(0)
        nombre, igual, valor = opcion.partition("=")
        if not igual:
            valor = args.pop(0) if args else ""
        if nombre == "--prefijos-tarea":
            nuevos = [x.strip().upper() for x in valor.split(",") if x.strip()]
            prefijos += nuevos
            if not nuevos or not all(re.fullmatch(r"[A-Z][A-Z0-9]*", x) for x in nuevos):
                return args, prefijos, limites, propios, "--prefijos-tarea needs prefixes of letters and digits separated by commas (INS,FLU)"
        elif nombre == "--limite":
            canal, _, n = valor.partition("=")
            if not CANAL.fullmatch(canal) or not n.isdigit() or int(n) < 1:
                return args, prefijos, limites, propios, "--limite needs channel=N with a lowercase channel name and N >= 1 (--limite portal=500)"
            if canal in CONOCIDOS:
                return args, prefijos, limites, propios, f"--limite is for extra channels; the limit of {canal} is in reglas.json"
            limites[canal] = int(n)
        elif nombre == "--formato-propio":
            if not CANAL.fullmatch(valor):
                return args, prefijos, limites, propios, "--formato-propio needs a lowercase channel name (--formato-propio portal)"
            if valor in CONOCIDOS:
                return args, prefijos, limites, propios, f"--formato-propio is for extra channels; {valor} has its own checks"
            propios.append(valor)
        else:
            return args, prefijos, limites, propios, f"unknown option {nombre}"
    for canal in sorted(set(propios) & set(limites)):
        return args, prefijos, limites, propios, f"{canal} is in --limite and --formato-propio; a channel with its own format has no length check"
    return args, prefijos, limites, propios, None


def opciones_sin_uso(carpetas: list, limites: dict, propios) -> str:
    """The error for a --limite or --formato-propio channel that no checked piece lists under `## Canales`, or None.
    Pieces without a readable ficha.md say so on their own; when none can be read there is nothing to compare."""
    declarados, leidas = [], 0
    for c in carpetas:
        ficha, _ = leer(Path(c) / "ficha.md", "ficha.md")
        if ficha is not None:
            leidas += 1
            declarados += [x for x in canales_pedidos(ficha) if x not in declarados]
    if not leidas:
        return None
    lista = ", ".join(declarados) or "none"
    for opcion, canal in [(f"--limite {k}={v}", k) for k, v in limites.items()] + [(f"--formato-propio {c}", c) for c in propios]:
        if canal not in declarados:
            return (f"{opcion} names a channel that no checked piece declares in «## Canales» (declared: {lista}); fix the "
                    "channel name or drop the option")
    return None


def main(args: list) -> int:
    args, prefijos, limites, propios, error = leer_opciones(args)
    if error:
        print(f"{error}. {USO}")
        return 2
    if not args:
        print(USO)
        return 2
    try:
        reglas, hay = cargar_reglas(), False
    except ReglasIncompletas as e:
        print(e)
        return 1
    todas = [p for a in args for p in piezas(Path(a))]
    error = opciones_sin_uso(todas, limites, propios)
    if error:
        print(f"{error}. {USO}")
        return 2
    for p in todas:
        for problema in comprobar(p, reglas, prefijos, limites, propios):
            hay = True
            print(f"{p}: {problema}")
    if not hay:
        print("OK")
    return 1 if hay else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
