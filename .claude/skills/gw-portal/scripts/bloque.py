#!/usr/bin/env python3
"""Cambia un campo de primer nivel de una ficha JSON y deja el resto del archivo byte a byte (retro 2026-11-05, T2).

Uso:
    python3 bloque.py <ficha.json> <campo> <valor.json | ->

El valor nuevo es JSON (un archivo o «-» para la entrada estándar). Se escribe con dos espacios por nivel, los objetos
desplegados y las listas de valores simples en una línea, como las fichas de src/data/proyectos/. Sale con 1 si el
campo no existe (no se añaden campos nuevos por error) y con 2 si el valor o la ficha no son JSON válido.
"""
import json
import sys
from pathlib import Path


def volcar(v, nivel=0):
    sangria = "  " * nivel
    if isinstance(v, dict):
        if not v:
            return "{}"
        filas = [f"{sangria}  {json.dumps(k, ensure_ascii=False)}: {volcar(x, nivel + 1)}" for k, x in v.items()]
        return "{\n" + ",\n".join(filas) + f"\n{sangria}}}"
    if isinstance(v, list):
        if not v:
            return "[]"
        if all(not isinstance(x, (dict, list)) for x in v):
            return "[" + ", ".join(json.dumps(x, ensure_ascii=False) for x in v) + "]"
        return "[\n" + ",\n".join(f"{sangria}  {volcar(x, nivel + 1)}" for x in v) + f"\n{sangria}]"
    return json.dumps(v, ensure_ascii=False)


def cambiar(texto, campo, valor):
    """El texto de la ficha con `campo` (de primer nivel) sustituido por `valor`; KeyError si no está."""
    marca = f'\n  {json.dumps(campo, ensure_ascii=False)}: '
    if texto.count(marca) != 1:
        raise KeyError(campo)
    inicio = texto.index(marca) + len(marca)
    _, fin = json.JSONDecoder().raw_decode(texto, inicio)
    nuevo = texto[:inicio] + volcar(valor, 1) + texto[fin:]
    json.loads(nuevo)
    return nuevo


def main(argv):
    if len(argv) != 3:
        print(__doc__.strip(), file=sys.stderr)
        return 2
    ficha, campo, origen = Path(argv[0]), argv[1], argv[2]
    try:
        texto = ficha.read_text(encoding="utf-8")
        json.loads(texto)
        valor = json.loads(sys.stdin.read() if origen == "-" else Path(origen).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as e:
        print(f"bloque: no se pudo leer JSON válido ({e}); revisa la ficha y el valor", file=sys.stderr)
        return 2
    try:
        ficha.write_text(cambiar(texto, campo, valor), encoding="utf-8")
    except KeyError:
        print(f"bloque: la ficha no tiene el campo «{campo}» en el primer nivel; mira el nombre (no se añaden campos)",
              file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
