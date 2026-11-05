"""Tests de bloque.py (gw-portal): python3 -m unittest discover -s .claude/skills/gw-portal/scripts"""
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import bloque  # noqa: E402

SCRIPT = Path(bloque.__file__).resolve()
# Estilo mezclado, como las fichas reales: una lista larga desplegada y otra corta en una línea.
FICHA = """{
  "slug": "x",
  "etiquetas": [
    "uno",
    "dos"
  ],
  "lineas": ["a", "b"],
  "fase": {
    "es": "vieja",
    "gl": "vella",
    "en": "old"
  },
  "fin": 1
}
"""


class Cambiar(unittest.TestCase):
    def test_cambia_el_campo_y_deja_el_resto_igual(self):
        nuevo = bloque.cambiar(FICHA, "fase", {"es": "nueva", "gl": "nova", "en": "new"})
        self.assertEqual(json.loads(nuevo)["fase"]["es"], "nueva")
        antes, despues = FICHA.split('"fase"')[0], nuevo.split('"fase"')[0]
        self.assertEqual(antes, despues)  # la lista desplegada sigue desplegada
        self.assertTrue(nuevo.endswith('  "fin": 1\n}\n'))

    def test_un_campo_que_no_existe_no_se_anade(self):
        with self.assertRaises(KeyError):
            bloque.cambiar(FICHA, "nuevo", 1)

    def test_no_confunde_un_campo_anidado_con_uno_de_primer_nivel(self):
        with self.assertRaises(KeyError):
            bloque.cambiar(FICHA, "es", "x")

    def test_una_lista_de_objetos_como_los_hitos_queda_sangrada_y_valida(self):
        hitos = [{"version": "0", "nombre": {"es": "a", "gl": "a", "en": "a"}, "estado": "hecho"}]
        nuevo = bloque.cambiar(FICHA, "lineas", hitos)
        self.assertEqual(json.loads(nuevo)["lineas"], hitos)
        self.assertIn('  "lineas": [\n    {\n      "version": "0",\n      "nombre": {\n        "es": "a"', nuevo)


class Cli(unittest.TestCase):
    def test_un_valor_que_no_es_json_sale_con_2_y_no_toca_la_ficha(self):
        with tempfile.TemporaryDirectory() as d:
            f = Path(d) / "ficha.json"
            f.write_text(FICHA, encoding="utf-8")
            r = subprocess.run([sys.executable, str(SCRIPT), str(f), "fase", "-"], input="{roto",
                               capture_output=True, text=True)
            self.assertEqual(r.returncode, 2)
            self.assertIn("no se pudo leer JSON válido", r.stderr)
            self.assertEqual(f.read_text(encoding="utf-8"), FICHA)

    def test_escribe_desde_la_entrada_estandar_y_avisa_del_campo_que_falta(self):
        with tempfile.TemporaryDirectory() as d:
            f = Path(d) / "ficha.json"
            f.write_text(FICHA, encoding="utf-8")
            r = subprocess.run([sys.executable, str(SCRIPT), str(f), "lineas", "-"], input='["c"]',
                               capture_output=True, text=True)
            self.assertEqual(r.returncode, 0, r.stderr)
            self.assertIn('  "lineas": ["c"],\n', f.read_text(encoding="utf-8"))
            r = subprocess.run([sys.executable, str(SCRIPT), str(f), "nada", "-"], input="1",
                               capture_output=True, text=True)
            self.assertEqual(r.returncode, 1)
            self.assertIn("no tiene el campo «nada»", r.stderr)


if __name__ == "__main__":
    unittest.main()
