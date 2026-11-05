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

    def test_quita_marcas_y_bitacora_en_ingles_pero_no_lo_que_solo_la_nombra(self):
        # La 0.5 escribe «Reviewed: …» y «docs: handoff …»; un commit que solo cita la bitácora sí es novedad.
        lineas = ["2026-11-03 Reviewed: 1cfcfdb", "2026-11-03 Review mark before main", "2026-11-03 Handoff al día",
                  "2026-11-03 docs(flujo): bitácora al día", "2026-11-02 Recover lee la bitácora en inglés"]
        self.assertEqual(recoger.filtrar_commits(lineas)[0], ["2026-11-02 Recover lee la bitácora en inglés"])

    def test_plan_solo_tabla_de_fases_y_bitacora_su_primera_tabla(self):
        plan = "| # | Decisión |\n|---|---|\n| D1 | algo |\n\n| Fase | Qué trae |\n|---|---|\n| F0 | esqueleto |\n"
        self.assertEqual(recoger.filas_utiles(plan, "docs/plan.md"), ["| Fase | Qué trae |", "| F0 | esqueleto |"])
        bitacora = "# B\n\n| Campo | Valor |\n|--|--|\n| Fase | F1 |\n\nTexto\n\n| Otra | tabla |\n"
        self.assertEqual(recoger.filas_utiles(bitacora, "docs/traspaso.md"), ["| Campo | Valor |", "| Fase | F1 |"])


class RutasDelFlujo(unittest.TestCase):
    def test_variantes_de_la_bitacora(self):
        # La 0.5 lleva la bitácora a docs/handoff.md también desde docs/registros/traspaso.md.
        self.assertEqual(recoger.variantes("docs/registros/traspaso.md"),
                         ["docs/registros/traspaso.md", "docs/handoff.md", "docs/records/traspaso.md"])
        self.assertIn("docs/registros/traspaso.md", recoger.variantes("docs/handoff.md"))

    def test_bitacora_y_difusion_con_el_nombre_viejo_o_el_nuevo(self):
        # Un repo aún en la 0.4 (docs/traspaso.md, docs/difusion/) y otro ya en la 0.5 (docs/handoff.md, docs/media/).
        for bitacora, pieza in (("docs/traspaso.md", "docs/difusion/a/web.md"), ("docs/handoff.md", "docs/media/a/web.md")):
            with self.subTest(bitacora=bitacora), tempfile.TemporaryDirectory() as d:
                for ruta, texto in ((bitacora, "| Fase | F2 |\n|--|--|\n"), (pieza, '{"estado": "listo"}')):
                    (Path(d) / ruta).parent.mkdir(parents=True, exist_ok=True)
                    (Path(d) / ruta).write_text(texto, encoding="utf-8")
                env = dict(os.environ, GIT_AUTHOR_NAME="t", GIT_AUTHOR_EMAIL="t@t", GIT_COMMITTER_NAME="t",
                           GIT_COMMITTER_EMAIL="t@t")
                subprocess.run(["git", "init", "-q", d], check=True)
                subprocess.run(["git", "-C", d, "add", "."], check=True)
                subprocess.run(["git", "-C", d, "commit", "-q", "-m", "inicio"], check=True, env=env)
                self.assertEqual(recoger.cabecera_bitacora(d, "HEAD", "docs/traspaso.md"), (bitacora, ["| Fase | F2 |"]))
                self.assertEqual(recoger.difusion_lista(d, "HEAD"), [pieza])


    def test_pieza_lista_con_status_ready_de_la_0_5(self):
        with tempfile.TemporaryDirectory() as d:
            for ruta, texto in (("docs/media/a/web.md", '{"status": "ready"}'),
                                ("docs/media/b/web.md", '{"status": "draft", "estado": "borrador"}')):
                (Path(d) / ruta).parent.mkdir(parents=True, exist_ok=True)
                (Path(d) / ruta).write_text(texto, encoding="utf-8")
            env = dict(os.environ, GIT_AUTHOR_NAME="t", GIT_AUTHOR_EMAIL="t@t", GIT_COMMITTER_NAME="t",
                       GIT_COMMITTER_EMAIL="t@t")
            subprocess.run(["git", "init", "-q", d], check=True)
            subprocess.run(["git", "-C", d, "add", "."], check=True)
            subprocess.run(["git", "-C", d, "commit", "-q", "-m", "inicio"], check=True, env=env)
            self.assertEqual(recoger.difusion_lista(d, "HEAD"), ["docs/media/a/web.md"])


class Roadmap(unittest.TestCase):
    def test_saca_solo_la_seccion_del_roadmap_hasta_el_siguiente_encabezado_de_su_nivel(self):
        texto = ("# Plan\n\n## Fases\n\n| Fase | Estado |\n|--|--|\n| 0 | hecha |\n\n### Detalle\nsigue\n\n"
                 "## Otra\nno entra\n")
        with tempfile.TemporaryDirectory() as d:
            (Path(d) / "docs").mkdir()
            (Path(d) / "docs/plan.md").write_text(texto, encoding="utf-8")
            env = dict(os.environ, GIT_AUTHOR_NAME="t", GIT_AUTHOR_EMAIL="t@t", GIT_COMMITTER_NAME="t",
                       GIT_COMMITTER_EMAIL="t@t")
            subprocess.run(["git", "init", "-q", d], check=True)
            subprocess.run(["git", "-C", d, "add", "."], check=True)
            subprocess.run(["git", "-C", d, "commit", "-q", "-m", "inicio"], check=True, env=env)
            ruta, lineas = recoger.seccion_roadmap(d, "HEAD", {"ruta": "docs/plan.md", "seccion": "## Fases"})
            self.assertEqual(ruta, "docs/plan.md")
            self.assertEqual(lineas[0], "## Fases")
            self.assertIn("| 0 | hecha |", lineas)
            self.assertIn("### Detalle", lineas)
            self.assertNotIn("## Otra", lineas)
            # Un encabezado que ya no está se dice, no se calla; uno sin «#» tampoco rompe el informe.
            self.assertEqual(recoger.seccion_roadmap(d, "HEAD", {"ruta": "docs/plan.md", "seccion": "Fases"}),
                             ("docs/plan.md", []))
            self.assertEqual(recoger.seccion_roadmap(d, "HEAD", {"ruta": "docs/plan.md", "seccion": "## Hitos"}),
                             ("docs/plan.md", []))


class RoadmapBordes(unittest.TestCase):
    def test_un_comentario_en_un_bloque_de_codigo_no_corta_y_un_encabezado_repetido_si(self):
        texto = ("## Fases\n| 0 | hecha |\n```bash\n# instala\n## no es encabezado\n```\n| 1 | curso |\n"
                 "## Fases\nvieja\n")
        with tempfile.TemporaryDirectory() as d:
            (Path(d) / "plan.md").write_text(texto, encoding="utf-8")
            env = dict(os.environ, GIT_AUTHOR_NAME="t", GIT_AUTHOR_EMAIL="t@t", GIT_COMMITTER_NAME="t",
                       GIT_COMMITTER_EMAIL="t@t")
            subprocess.run(["git", "init", "-q", d], check=True)
            subprocess.run(["git", "-C", d, "add", "."], check=True)
            subprocess.run(["git", "-C", d, "commit", "-q", "-m", "inicio"], check=True, env=env)
            _, lineas = recoger.seccion_roadmap(d, "HEAD", {"ruta": "plan.md", "seccion": "## Fases"})
            self.assertIn("| 1 | curso |", lineas)
            self.assertNotIn("vieja", lineas)


class Enlaces(unittest.TestCase):
    def test_variantes_de_la_url_del_repo_cuentan_como_enlazado(self):
        url = "https://github.com/zeldris/tarkor"
        for enlace in ("https://github.com/Zeldris/Tarkor", "https://github.com/Zeldris/Tarkor.git",
                       "https://www.github.com/Zeldris/Tarkor/tree/main", "https://github.com/Zeldris/Tarkor#readme"):
            with self.subTest(enlace=enlace):
                self.assertEqual(recoger.url_repo(enlace), url)
        self.assertNotEqual(recoger.url_repo("https://github.com/Zeldris/Tarkor-web"), url)


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


class Escaparate(unittest.TestCase):
    def test_imagenes_diagramas_y_menciones_publicas(self):
        archivos = {
            ".claude/gw.json": '{"content": ["^src/data/.*\\\\.json$", "^docs/", "^README\\\\.md$"]}',
            "public/proyectos/tarkor/portada.webp": "x",
            "public/proyectos/tarkor/portada-mini.webp": "x",
            "docs/diagramas/tarkor.svg": "Tarkor",
            "src/data/proyectos/tarkor.json": "tarkor",
            "src/data/proyectos/otro.json": "Como en Tarkor",
            "src/i18n/textos.ts": "tarkor",
            "src/data/x.test.ts": "tarkor",
            "README.md": "TARKOR",
            "AGENTS.md": "tarkor",
            "docs/handoff.md": "tarkor",
        }
        with tempfile.TemporaryDirectory() as d:
            for ruta, texto in archivos.items():
                (Path(d) / ruta).parent.mkdir(parents=True, exist_ok=True)
                (Path(d) / ruta).write_text(texto, encoding="utf-8")
            env = dict(os.environ, GIT_AUTHOR_DATE="2026-01-05T10:00:00", GIT_COMMITTER_DATE="2026-01-05T10:00:00",
                       GIT_AUTHOR_NAME="t", GIT_AUTHOR_EMAIL="t@t", GIT_COMMITTER_NAME="t",
                       GIT_COMMITTER_EMAIL="t@t")
            subprocess.run(["git", "init", "-q", d], check=True)
            subprocess.run(["git", "-C", d, "add", "."], check=True)
            subprocess.run(["git", "-C", d, "commit", "-q", "-m", "inicio"], check=True, env=env)
            e = recoger.escaparate("tarkor", ["Tarkor"], ["docs/diagramas/*.svg"], raiz=d)
        self.assertEqual(e["visuales"], ["2026-01-05 public/proyectos/tarkor/portada.webp",
                                         "2026-01-05 docs/diagramas/tarkor.svg"])
        # Ni la propia ficha, ni los tests, ni lo que no ve el público, ni los diagramas (ya en visuales).
        self.assertEqual(e["menciones"], ["contenido README.md", "contenido src/data/proyectos/otro.json",
                                          "código src/i18n/textos.ts"])


if __name__ == "__main__":
    unittest.main()
