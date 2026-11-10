#!/usr/bin/env python3
"""Quita el texto de una og-fuente hecha a mano (tools/og/fuentes/<slug>/og-fuente.png) para sacar su placa limpia
(og-base.png), sobre la que tools/og/<slug>-og.html pone el texto en gallego e inglés.

Máscara por luminancia dentro de una caja (texto claro sobre fondo oscuro, o al revés), dilatada, y relleno por
interpolación vertical de cada columna con un grano suave. Revisa el resultado a ojo antes de usarlo.
Uso: python3 tools/og/limpiar.py <origen.png> <destino.png> x0 y0 x1 y1 claro|oscuro <umbral 0-255>
Hechas el 2026-11-10: galivelop-image-generator 55 265 600 440 claro 70; toveriai 55 220 600 500 oscuro 170.
"""
import sys
from PIL import Image, ImageFilter
import numpy as np
src, dst, x0, y0, x1, y1, modo, umbral = sys.argv[1], sys.argv[2], *map(int, sys.argv[3:7]), sys.argv[7], int(sys.argv[8])
im = np.asarray(Image.open(src).convert('RGB')).astype(float)
lum = im.mean(axis=2)
m = np.zeros(lum.shape, bool)
caja = lum[y0:y1, x0:x1]
m[y0:y1, x0:x1] = caja > umbral if modo == 'claro' else caja < umbral
mi = Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(9))
m = np.asarray(mi) > 0
out = im.copy()
H = im.shape[0]
for x in range(x0 - 5, x1 + 5):
    col = m[:, x]
    y = 0
    while y < H:
        if col[y]:
            a = y
            while y < H and col[y]: y += 1
            b = y
            arriba = im[max(a - 3, 0):a, x].mean(axis=0) if a > 0 else im[b, x]
            abajo = im[b:b + 3, x].mean(axis=0) if b < H else arriba
            for k in range(a, b):
                t = (k - a + 1) / (b - a + 1)
                out[k, x] = arriba * (1 - t) + abajo * t
        else:
            y += 1
# grano: ruido suave con la desviación del papel/fondo
rng = np.random.default_rng(1)
ruido = rng.normal(0, 2.0, out.shape)
out = np.where(m[..., None], out + ruido, out)
Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).save(dst)
