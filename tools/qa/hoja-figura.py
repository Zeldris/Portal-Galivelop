#!/usr/bin/env python3
"""Hoja claro/oscuro de una figura: las dos versiones, lado a lado, en una sola imagen.

    python3 tools/qa/hoja-figura.py <figura-clara> [<figura-oscura>] [--salida <png>] [--ancho <px>]

Sin la oscura, busca `<nombre>-oscuro.<ext>` junto a la clara (como en `public/productos/`). Cada versión se reduce a
`--ancho` (600 px por omisión) y va con su rótulo, sobre un fondo gris medio que deja ver los bordes de las dos. La
hoja sale en `capturas/hoja-<nombre>.png` salvo `--salida`. Se abre esta, una vez; la figura grande solo si la hoja no
basta (retro 2026-11-25, T2: abrir claro y oscuro por separado costó ~380k arrastrados).
"""

import argparse
import sys
from pathlib import Path

from PIL import Image, ImageDraw

FONDO = (128, 128, 128)
ROTULO = 28
HUECO = 16


def oscura_de(clara: Path) -> Path:
    return clara.with_name(f"{clara.stem}-oscuro{clara.suffix}")


def reducida(ruta: Path, ancho: int) -> Image.Image:
    img = Image.open(ruta).convert("RGB")
    if img.width > ancho:
        img = img.resize((ancho, round(img.height * ancho / img.width)), Image.LANCZOS)
    return img


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("clara", type=Path)
    ap.add_argument("oscura", type=Path, nargs="?")
    ap.add_argument("--salida", type=Path)
    ap.add_argument("--ancho", type=int, default=600)
    a = ap.parse_args()

    oscura = a.oscura or oscura_de(a.clara)
    for ruta in (a.clara, oscura):
        if not ruta.is_file():
            print(f"hoja-figura: no existe {ruta}", file=sys.stderr)
            return 1

    imgs = [reducida(a.clara, a.ancho), reducida(oscura, a.ancho)]
    alto = max(i.height for i in imgs) + ROTULO + 2 * HUECO
    hoja = Image.new("RGB", (sum(i.width for i in imgs) + 3 * HUECO, alto), FONDO)
    dibujo = ImageDraw.Draw(hoja)
    x = HUECO
    for img, rotulo in zip(imgs, ("claro", "oscuro")):
        dibujo.text((x, HUECO // 2), f"{rotulo} · {img.width}x{img.height}", fill=(255, 255, 255))
        hoja.paste(img, (x, HUECO + ROTULO))
        x += img.width + HUECO

    salida = a.salida or Path("capturas") / f"hoja-{a.clara.stem}.png"
    salida.parent.mkdir(parents=True, exist_ok=True)
    hoja.save(salida)
    print(f"hoja-figura: {salida} ({hoja.width}x{hoja.height})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
