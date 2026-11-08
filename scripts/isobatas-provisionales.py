#!/usr/bin/env python3
"""Isobatas provisionales para los bloques celestes (docs/marca.md, recurso 2).

Campo de ruido suave + marching squares, en SVG de solo líneas. Sustituir por las isobatas reales de la costa
gallega (EMODnet DTM, CC BY 4.0 + gdal_contour; ver docs/investigacion/estilo-marca.md §4) cuando se generen.
Uso: python3 scripts/isobatas-provisionales.py > public/marca/isobatas.svg
"""
import math

W, H, PASO, NIVELES, SEMILLA = 2400, 1200, 12, 16, 20261108


def ruido(semilla):
    g, s = [], semilla
    for _ in range(64 * 64):
        s = (s * 16807) % 2147483647
        g.append(s / 2147483647)

    def at(x, y):
        return g[(y & 63) * 64 + (x & 63)]

    def sm(t):
        return t * t * (3 - 2 * t)

    def n(x, y):
        xi, yi = math.floor(x), math.floor(y)
        xf, yf = sm(x - xi), sm(y - yi)
        a, b, c, d = at(xi, yi), at(xi + 1, yi), at(xi, yi + 1), at(xi + 1, yi + 1)
        return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf

    return n


n = ruido(SEMILLA)
cols, filas = W // PASO + 1, H // PASO + 1
v = []
for j in range(filas):
    for i in range(cols):
        x, y = i * PASO, j * PASO
        # La profundidad crece hacia la izquierda y abajo (mar abierto), con relieve.
        base = (W - x) / W * 0.9 + y / H * 0.4
        v.append(base + n(x / 300, y / 300) * 0.55 + n(x / 110, y / 110) * 0.12)


def val(i, j):
    return v[j * cols + i]


def cruce(t, v1, v2):
    """Dónde corta el nivel t la arista entre dos valores, de 0 a 1."""
    return (t - v1) / (v2 - v1)


print(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" fill="none" stroke="#fff" stroke-linecap="round">')
print("<!-- Isobatas provisionales (ruido). Las definitivas salen de EMODnet; ver docs/marca.md. -->")
for k in range(1, NIVELES):
    t = 0.2 + k * 0.1
    ancho, alfa = (1.6, 0.5) if k % 5 == 0 else (1, 0.22)
    segs = []
    for j in range(filas - 1):
        for i in range(cols - 1):
            a, b, c, d = val(i, j), val(i + 1, j), val(i + 1, j + 1), val(i, j + 1)
            x, y = i * PASO, j * PASO
            p = []
            if (a < t) != (b < t):
                p.append((x + cruce(t, a, b) * PASO, y))
            if (b < t) != (c < t):
                p.append((x + PASO, y + cruce(t, b, c) * PASO))
            if (c < t) != (d < t):
                p.append((x + (1 - cruce(t, c, d)) * PASO, y + PASO))
            if (d < t) != (a < t):
                p.append((x, y + (1 - cruce(t, d, a)) * PASO))
            for q in range(0, len(p) - 1, 2):
                segs.append(f"M{p[q][0]:.0f} {p[q][1]:.0f}L{p[q+1][0]:.0f} {p[q+1][1]:.0f}")
    print(f'<path stroke-width="{ancho}" stroke-opacity="{alfa}" d="{"".join(segs)}"/>')
print("</svg>")
