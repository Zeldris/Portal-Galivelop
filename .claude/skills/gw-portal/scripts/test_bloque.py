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


class Cli(unittest.TestCase):
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
