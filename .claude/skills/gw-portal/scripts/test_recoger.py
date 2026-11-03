"""Tests de recoger.py (gw-portal): python3 -m unittest discover -s .claude/skills/gw-portal/scripts"""
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import recoger  # noqa: E402

REPOS = {
    "Zeldris/Tarkor": {"destino": "ficha", "slug": "tarkor"},
    "Zeldris/Viejo": {"destino": "ficha", "slug": "viejo"},
    "otra/VeriNews_AI": {"destino": "ficha", "slug": "toveriai"},
}


class Clasificar(unittest.TestCase):
    def test_titular_y_extras_entran_y_lo_ajeno_no(self):
        listados = [{"full_name": n, "visibility": "public"} for n in
                    ("Zeldris/Tarkor", "Zeldris/Nuevo", "otra/VeriNews_AI", "otra/Ajeno")]
        elegidos, perdidos = recoger.clasificar(listados, "zeldris", ["otra/verinews_ai"], REPOS)
        nombres = {n: c for n, _v, c in elegidos}
        self.assertEqual(set(nombres), {"Zeldris/Tarkor", "Zeldris/Nuevo", "otra/VeriNews_AI"})
        self.assertIsNone(nombres["Zeldris/Nuevo"], "un repo del titular sin configurar es nuevo")
        self.assertEqual(nombres["otra/VeriNews_AI"]["slug"], "toveriai")
        self.assertEqual(perdidos, ["Zeldris/Viejo"])


class Filtros(unittest.TestCase):
    def test_quita_fusiones_marcas_y_bitacora(self):
        lineas = ["2026-11-03 Revisado: 1cfcfdb", "2026-11-03 Marca de revisión antes de main (x)",
                  "2026-11-03 Fusiona origin/main en claude/x", "2026-11-02 Merge remote-tracking branch 'o/m'",
                  "2026-11-02 Merge pull request #3", "2026-11-02 WIP: a medias", "2026-11-02 Bitácora: al día",
                  "2026-11-02 Fusión de claude/x sin PR", "2026-11-01 IMG-27: el encuadre sale de la ficha"]
        utiles, total = recoger.filtrar_commits(lineas)
        self.assertEqual(utiles, ["2026-11-01 IMG-27: el encuadre sale de la ficha"])
        self.assertEqual(total, 1)

    def test_plan_solo_tabla_de_fases_y_bitacora_su_primera_tabla(self):
        plan = "| # | Decisión |\n|---|---|\n| D1 | algo |\n\n| Fase | Qué trae |\n|---|---|\n| F0 | esqueleto |\n"
        self.assertEqual(recoger.filas_utiles(plan, "docs/plan.md"), ["| Fase | Qué trae |", "| F0 | esqueleto |"])
        bitacora = "# B\n\n| Campo | Valor |\n|--|--|\n| Fase | F1 |\n\nTexto\n\n| Otra | tabla |\n"
        self.assertEqual(recoger.filas_utiles(bitacora, "docs/traspaso.md"), ["| Campo | Valor |", "| Fase | F1 |"])


class Commits(unittest.TestCase):
    def test_entra_el_dia_entero_de_la_fecha(self):
        # Un commit a las 00:30 del día N cuenta: «--since=N» a secas tomaría la hora actual de ese día.
        with tempfile.TemporaryDirectory() as d:
            env = dict(os.environ, GIT_AUTHOR_DATE="2026-01-05T00:30:00", GIT_COMMITTER_DATE="2026-01-05T00:30:00",
                       GIT_AUTHOR_NAME="t", GIT_AUTHOR_EMAIL="t@t", GIT_COMMITTER_NAME="t",
                       GIT_COMMITTER_EMAIL="t@t")
            subprocess.run(["git", "init", "-q", d], check=True)
            subprocess.run(["git", "-C", d, "commit", "-q", "--allow-empty", "-m", "Novedad de madrugada"],
                           check=True, env=env)
            utiles, total = recoger.commits(d, "HEAD", "2026-01-05")
        self.assertEqual((utiles, total), (["2026-01-05 Novedad de madrugada"], 1))


if __name__ == "__main__":
    unittest.main()
