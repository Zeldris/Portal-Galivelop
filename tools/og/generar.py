#!/usr/bin/env python3
"""Genera la imagen de vista previa (og.jpg, 1200x630, JPEG) de cada proyecto a partir de su portada.

Las redes (Facebook, LinkedIn, WhatsApp…) documentan JPEG/PNG y 1.91:1; la portada es WebP con otra proporción. Una
portada más ancha que 1.91:1 (una ilustración apaisada) se recorta por los lados; una más alta se encaja entera (sin
cortar texto ni diagramas) sobre un fondo del color medio de sus bordes.
Uso, tras cambiar una portada: python3 tools/og/generar.py   (necesita Pillow; escribe public/proyectos/<slug>/og.jpg)
"""
import json
import sys
from pathlib import Path

from PIL import Image, ImageStat

RAIZ = Path(__file__).resolve().parents[2]
ANCHO, ALTO = 1200, 630


def borde(img: Image.Image) -> tuple[int, ...]:
    """Color medio de un marco de 8 px: el fondo que continúa la imagen."""
    w, h = img.size
    tiras = [img.crop((0, 0, w, 8)), img.crop((0, h - 8, w, h)), img.crop((0, 0, 8, h)), img.crop((w - 8, 0, w, h))]
    medias = [ImageStat.Stat(t).mean for t in tiras]
    return tuple(round(sum(m[c] for m in medias) / len(medias)) for c in range(3))


def generar(portada: Path, destino: Path) -> None:
    img = Image.open(portada)
    if img.mode in ('RGBA', 'LA', 'P'):
        # Una portada con transparencia, sobre el fondo oscuro de la marca (convertir sin más la deja en negro).
        img = img.convert('RGBA')
        fondo = Image.new('RGBA', img.size, (6, 18, 28, 255))
        img = Image.alpha_composite(fondo, img)
    img = img.convert('RGB')
    if img.width / img.height > ANCHO / ALTO:
        img = img.resize((round(img.width * ALTO / img.height), ALTO), Image.LANCZOS)
        x = (img.width - ANCHO) // 2
        img.crop((x, 0, x + ANCHO, ALTO)).save(destino, 'JPEG', quality=85, optimize=True, progressive=True)
        return
    escala = min(ANCHO / img.width, ALTO / img.height, 1)  # sin agrandar: una portada pequeña saldría borrosa
    img = img.resize((round(img.width * escala), round(img.height * escala)), Image.LANCZOS)
    lienzo = Image.new('RGB', (ANCHO, ALTO), borde(img))
    lienzo.paste(img, ((ANCHO - img.width) // 2, (ALTO - img.height) // 2))
    lienzo.save(destino, 'JPEG', quality=85, optimize=True, progressive=True)


def main() -> int:
    for ficha in sorted((RAIZ / 'src/data/proyectos').glob('*.json')):
        datos = json.loads(ficha.read_text(encoding='utf-8'))
        portada = RAIZ / 'public' / datos['portada']['src']
        destino = portada.parent / 'og.jpg'
        generar(portada, destino)
        print(destino.relative_to(RAIZ))
    return 0


if __name__ == '__main__':
    sys.exit(main())
