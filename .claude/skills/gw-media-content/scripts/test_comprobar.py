"""Tests of comprobar.py: every case builds its own piece folder in a tempdir (a valid one) and breaks one thing;
each asserts the message, not only the result. Run: python3 -m unittest discover -s skills/gw-media-content/scripts"""
import json
import re
import shutil
import struct
import subprocess
import sys
import tempfile
import unittest
from datetime import date, timedelta
from pathlib import Path

AQUI = Path(__file__).resolve().parent
sys.path.insert(0, str(AQUI))
import comprobar  # noqa: E402

HOY = date.today()
NORMAS = ("1. Sé amable con los demás miembros. 2. Nada de spam. 3. La autopromoción solo los sábados y con una "
          "publicación de aportación por cada una de promoción. 4. Pon etiqueta a los mensajes. 5. Sin enlaces acortados. ")
assert len(NORMAS) >= 200
FICHA = """# Ficha: lanzamiento

Idiomas: es, en

## Canales

- x
- reddit
- linkedin
- discord

## Hechos

| Dato | Fuente |
|---|---|
| Sale la 1.0 | CHANGELOG.md |

## Reddit

- **Subreddit:** r/gamedev
- **Normas leídas:** {hoy}
- **Autopromoción:** solo los sábados

### Normas de r/gamedev

{normas}

## Imágenes

| Imagen | Texto alternativo | Canales |
|---|---|---|
| `medios/tarjeta.webp` | es: Tarjeta de la versión / en: Release card | x |
| `medios/tarjeta.png` | es: Tarjeta de la versión / en: Release card | linkedin |

## Uso interno

Tarea QA-12 en la rama claude/algo.

## Publicado

| Canal | Idioma | Fecha | Enlace |
|---|---|---|---|
""".replace("{hoy}", HOY.isoformat()).replace("{normas}", NORMAS)
CANALES = {
    "x": "## es\n\n**1/** Sale la versión.\nImagen: medios/tarjeta.webp\n\n**2/** Detalles.\n\n## en\n\n**1/** Release out.\n\n**2/** Details.\n",
    "reddit": "## es\n\n**Título:** Sale la versión\n\nTexto.\n\n## en\n\n**Title:** Release out\n\nText.\n",
    "linkedin": "## es\n\nTexto largo.\nImagen: medios/tarjeta.png\n\n## en\n\nLong text.\nImagen: medios/tarjeta.png\n",
    "discord": "## es\n\n### Novedades\n\n## en\n\n### News\n",
}


RENDER = "node .claude/skills/gw-media-content/scripts/render.mjs"


def webp(ancho=100, alto=50, extra=0):
    cuerpo = b"WEBPVP8X" + struct.pack("<I", 10) + bytes(4) + (ancho - 1).to_bytes(3, "little") + (alto - 1).to_bytes(3, "little")
    return b"RIFF" + struct.pack("<I", len(cuerpo)) + cuerpo + bytes(extra)


def png(ancho, alto):
    return b"\x89PNG\r\n\x1a\n" + struct.pack(">I", 13) + b"IHDR" + struct.pack(">II", ancho, alto) + b"\x08\x06\x00\x00\x00"


def jpeg(ancho, alto):
    sof = b"\xff\xc0" + struct.pack(">HBHH", 11, 8, alto, ancho) + b"\x03\x01\x11\x00"
    return b"\xff\xd8" + b"\xff\xe0" + struct.pack(">H", 6) + b"JFIF" + sof + bytes(10)


def gif(ancho, alto):
    return b"GIF89a" + struct.pack("<HH", ancho, alto) + b"\x00\x00\x00;"


def pdf(paginas):
    return b"%PDF-1.4\n" + b"".join(b"%d 0 obj\n<< /Type /Page >>\nendobj\n" % i for i in range(paginas)) + b"%%EOF\n"


class Base(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp())
        self.addCleanup(shutil.rmtree, self.tmp)
        self.carpeta = self.tmp / HOY.isoformat() / "01-lanzamiento"
        (self.carpeta / "medios" / "fuente").mkdir(parents=True)
        self.escribir("ficha.md", FICHA)
        for c, t in CANALES.items():
            self.escribir(f"{c}.md", t)
        (self.carpeta / "medios" / "tarjeta.webp").write_bytes(webp())
        (self.carpeta / "medios" / "tarjeta-mini.webp").write_bytes(webp(10, 5))
        (self.carpeta / "medios" / "tarjeta.png").write_bytes(png(100, 50))
        (self.carpeta / "medios" / "fuente" / "tarjeta.html").write_text("<p>ok</p>")
        self.reglas = comprobar.cargar_reglas()

    def escribir(self, nombre, texto):
        (self.carpeta / nombre).write_text(texto, encoding="utf-8")

    def cambiar(self, nombre, viejo, nuevo):
        t = (self.carpeta / nombre).read_text(encoding="utf-8")
        self.assertIn(viejo, t)
        self.escribir(nombre, t.replace(viejo, nuevo, 1))

    def pdf_en_linkedin(self, paginas):
        """LinkedIn posts a carousel PDF instead of the .png."""
        (self.carpeta / "medios" / "carrusel.pdf").write_bytes(pdf(paginas))
        (self.carpeta / "medios" / "tarjeta.png").unlink()
        self.cambiar("ficha.md", "`medios/tarjeta.png` | es: Tarjeta de la versión / en: Release card",
                     "`medios/carrusel.pdf` | es: Carrusel / en: Carousel")
        self.escribir("linkedin.md", CANALES["linkedin"].replace("tarjeta.png", "carrusel.pdf"))

    def fallos(self, reglas=None):
        return "\n".join(comprobar.comprobar(self.carpeta, reglas or self.reglas))

    def assertFallo(self, trozo, **kw):
        self.assertIn(trozo, self.fallos(**kw))


class Estructura(Base):
    def test_la_pieza_valida_pasa(self):
        self.assertEqual(self.fallos(), "")

    def test_cli_imprime_ok_y_sale_con_cero(self):
        r = subprocess.run([sys.executable, str(AQUI / "comprobar.py"), str(self.carpeta)], capture_output=True, text=True)
        self.assertEqual((r.returncode, r.stdout.strip()), (0, "OK"))

    def test_cli_falla_con_una_linea_por_problema(self):
        self.cambiar("x.md", "**2/** Detalles.", "**2/** QA-12 {{hueco}}")
        r = subprocess.run([sys.executable, str(AQUI / "comprobar.py"), str(self.carpeta)], capture_output=True, text=True)
        self.assertEqual(r.returncode, 1)
        self.assertIn("internal jargon «QA-12»", r.stdout)
        self.assertIn("template gap «{{hueco}}»", r.stdout)

    def test_sin_argumentos_es_un_error_de_uso(self):
        r = subprocess.run([sys.executable, str(AQUI / "comprobar.py")], capture_output=True, text=True)
        self.assertEqual(r.returncode, 2)
        self.assertIn("usage: comprobar.py [--prefijos-tarea A,B,...]", r.stdout)

    def test_la_carpeta_de_fecha_expande_a_sus_piezas(self):
        self.assertEqual([p.name for p in comprobar.piezas(self.carpeta.parent)], ["01-lanzamiento"])

    def test_carpeta_vacia(self):
        vacia = self.tmp / "2026-10-26" / "02-vacia"
        vacia.mkdir(parents=True)
        out = "\n".join(comprobar.comprobar(vacia, self.reglas))
        self.assertIn("no ficha.md", out)
        self.assertIn("no channel file", out)

    def test_carpeta_que_no_existe(self):
        self.assertIn("does not exist", "\n".join(comprobar.comprobar(self.tmp / "nada", self.reglas)))

    def test_falta_la_ficha(self):
        (self.carpeta / "ficha.md").unlink()
        self.assertFallo("no ficha.md")

    def test_nombre_de_carpeta_incorrecto(self):
        malo = self.tmp / "ayer" / "tema"
        shutil.copytree(self.carpeta, malo)
        self.assertIn("folder name: expected <dir>/AAAA-MM-DD/NN-<tema>", "\n".join(comprobar.comprobar(malo, self.reglas)))

    def test_ficha_sin_publicado(self):
        self.cambiar("ficha.md", "## Publicado", "## Otro")
        self.assertFallo("no «## Publicado» section")

    def test_ficha_sin_canales(self):
        self.cambiar("ficha.md", "## Canales", "## Otros")
        self.assertFallo("no channels under «## Canales»")

    def test_canal_pedido_sin_archivo(self):
        (self.carpeta / "discord.md").unlink()
        self.assertFallo("discord.md: listed under «## Canales» but missing")

    def test_canal_conocido_no_pedido(self):
        self.cambiar("ficha.md", "- discord\n", "")
        self.assertFallo("discord.md: channel not requested; delete the file")

    def test_canal_extra_listado_solo_pasa_las_comprobaciones_genericas(self):
        self.cambiar("ficha.md", "- discord\n", "- discord\n- portal\n")
        self.cambiar("ficha.md", "Release card | x |", "Release card | x, portal |")
        self.escribir("portal.md", "## es\n\n" + "a" * 5000 + "\n\n## en\n\nb\nImagen: medios/tarjeta.webp\n")
        self.assertEqual(self.fallos(), "")

    def test_canal_extra_listado_comprueba_idiomas_jerga_huecos_e_imagen(self):
        self.cambiar("ficha.md", "- discord\n", "- discord\n- portal\n")
        self.escribir("portal.md", "## es\n\nWIP: {{x}}\nImagen: medios/no.webp\n")
        out = self.fallos()
        self.assertIn("portal.md: no «## en» section", out)
        self.assertIn("portal.md: internal jargon «WIP:»", out)
        self.assertIn("portal.md: template gap «{{x}}»", out)
        self.assertIn("portal.md: «Imagen: medios/no.webp» does not exist", out)

    def test_canal_desconocido_sin_listar_es_error(self):
        self.escribir("portal.md", "## es\n\na\n\n## en\n\nb\n")
        self.assertFallo("portal.md: unknown channel file; list it under «## Canales» in ficha.md")

    def test_falta_un_idioma_en_un_canal(self):
        self.escribir("linkedin.md", "## es\n\nSolo español.\n")
        self.assertFallo("linkedin.md: no «## en» section")

    def test_idioma_que_no_esta_en_la_pieza(self):
        self.escribir("linkedin.md", CANALES["linkedin"] + "\n## gl\n\nGalego.\n")
        self.assertFallo("linkedin.md: language «gl» is not in the piece")

    def test_idiomas_es_obligatorio_en_la_ficha(self):
        self.cambiar("ficha.md", "Idiomas: es, en\n", "")
        self.assertFallo('no languages: add "Idiomas: es, en" to ficha.md')

    def test_sin_idiomas_se_siguen_deduciendo_para_el_resto(self):
        self.cambiar("ficha.md", "Idiomas: es, en\n", "")
        self.escribir("linkedin.md", "## es\n\nSolo español.\n")
        self.assertFallo("linkedin.md: no «## en» section")

    def test_seccion_de_idioma_repetida(self):
        self.escribir("linkedin.md", CANALES["linkedin"] + "\n## es\n\nOtra vez.\n")
        self.assertFallo("linkedin.md: «## es» appears more than once; merge the sections into one")

    def test_un_encabezado_que_no_es_idioma_cierra_la_seccion(self):
        # the 3001 characters under «## Notas» are not part of «## es»: no length error
        self.escribir("linkedin.md", "## es\n\nCorto.\nImagen: medios/tarjeta.png\n\n## Notas\n\n" + "a" * 3001 + "\n\n## en\n\nok\n")
        self.assertEqual(self.fallos(), "")

    def test_una_seccion_cortada_por_un_encabezado_queda_vacia(self):
        self.escribir("linkedin.md", "## es\n## Notas\nTexto largo.\n\n## en\n\nok\n")
        self.assertFallo("linkedin.md: no «## es» section")


class Texto(Base):
    def test_hueco_de_plantilla_en_la_ficha(self):
        self.cambiar("ficha.md", "Sale la 1.0", "{{dato}}")
        self.assertFallo("ficha.md: template gap «{{dato}}»")

    def test_hueco_de_plantilla_en_un_canal(self):
        self.cambiar("reddit.md", "Texto.", "{{texto}}")
        self.assertFallo("reddit.md: template gap «{{texto}}»")

    def test_hueco_de_plantilla_en_una_fuente(self):
        (self.carpeta / "medios" / "fuente" / "tarjeta.html").write_text("<p>{{titulo}}</p>")
        self.assertFallo("medios/fuente/tarjeta.html: template gaps")

    def test_jerga_interna_en_un_canal(self):
        for jerga, texto in (("P3", "hallazgo P3"), ("F12", "finding F12"), ("P1", "ver (P1)"), ("QA-215", "QA-215"),
                             ("EPIC-3", "EPIC-3"), ("claude/rama-x", "claude/rama-x"), ("WIP:", "WIP:")):
            with self.subTest(jerga=jerga):
                self.cambiar("linkedin.md", "Long text.", f"Long text {texto}.")
                self.assertFallo(f"linkedin.md: internal jargon «{jerga}»")
                self.cambiar("linkedin.md", f"Long text {texto}.", "Long text.")

    def test_los_prefijos_de_un_proyecto_no_son_jerga_por_defecto(self):
        for texto in ("INS-3", "FLU-12", "WMF-7"):
            with self.subTest(texto=texto):
                self.cambiar("linkedin.md", "Long text.", f"Long text {texto}.")
                self.assertEqual(self.fallos(), "")
                self.cambiar("linkedin.md", f"Long text {texto}.", "Long text.")

    def test_los_prefijos_se_añaden_con_el_argumento(self):
        self.cambiar("linkedin.md", "Long text.", "Long text INS-3 y FLU-12.")
        problemas = "\n".join(comprobar.comprobar(self.carpeta, self.reglas, ("INS", "FLU")))
        self.assertIn("linkedin.md: internal jargon «INS-3»", problemas)
        self.assertIn("linkedin.md: internal jargon «FLU-12»", problemas)
        self.assertEqual(comprobar.jerga("QA-1 y INS-3", ("INS",)), ["INS-3", "QA-1"])  # the generic ones stay

    def test_cli_prefijos_tarea(self):
        self.cambiar("linkedin.md", "Long text.", "Long text INS-3.")
        for args in (["--prefijos-tarea", "INS,FLU"], ["--prefijos-tarea=ins, flu"]):
            r = subprocess.run([sys.executable, str(AQUI / "comprobar.py"), *args, str(self.carpeta)], capture_output=True, text=True)
            self.assertEqual(r.returncode, 1, args)
            self.assertIn("internal jargon «INS-3»", r.stdout)
        sin = subprocess.run([sys.executable, str(AQUI / "comprobar.py"), str(self.carpeta)], capture_output=True, text=True)
        self.assertEqual((sin.returncode, sin.stdout.strip()), (0, "OK"))

    def test_cli_prefijos_tarea_mal_escrito(self):
        for args, motivo in ((["--prefijos-tarea"], "--prefijos-tarea needs prefixes"),
                             (["--prefijos-tarea", "IN S-1"], "--prefijos-tarea needs prefixes"),
                             (["--rapido"], "unknown option --rapido")):
            r = subprocess.run([sys.executable, str(AQUI / "comprobar.py"), *args, str(self.carpeta)], capture_output=True, text=True)
            self.assertEqual(r.returncode, 2, args)
            self.assertIn(motivo, r.stdout)
            self.assertIn("usage: comprobar.py [--prefijos-tarea A,B,...]", r.stdout)

    def test_la_jerga_permitida_no_salta(self):
        self.cambiar("linkedin.md", "Long text.", "Long text con GPT-4, UTF-8 y P2P.")
        self.assertEqual(self.fallos(), "")

    def test_cifrados_y_prioridades_no_son_jerga(self):
        for texto in ("AES-256", "WPA-3", "AK-47", "bugs P1/P2", "pulsa F5", "SHA-256 e ISO-8601", "El P1 y el P2"):
            with self.subTest(texto=texto):
                self.cambiar("linkedin.md", "Long text.", f"Long text {texto}.")
                self.assertEqual(self.fallos(), "")
                self.cambiar("linkedin.md", f"Long text {texto}.", "Long text.")

    def test_una_rama_dentro_de_un_enlace_no_es_jerga(self):
        self.cambiar("linkedin.md", "Long text.", "Long text https://github.com/o/r/tree/claude/mi-rama-x y https://x.org/QA-12 fin.")
        self.assertEqual(self.fallos(), "")
        self.cambiar("linkedin.md", "claude/mi-rama-x y", "claude/mi-rama-x y claude/otra")
        self.assertFallo("linkedin.md: internal jargon «claude/otra»")

    def test_la_jerga_de_la_ficha_se_permite_en_uso_interno_pero_no_en_el_alt(self):
        # QA-12 is in «## Uso interno» of the fixture: allowed there, an error in an alt text
        self.assertIn("QA-12", (self.carpeta / "ficha.md").read_text(encoding="utf-8"))
        self.assertEqual(self.fallos(), "")
        self.cambiar("ficha.md", "Release card | x |", "Release card QA-12 | x |")
        self.assertFallo("ficha.md: alt text of «medios/tarjeta.webp» has internal jargon «QA-12»")

    def test_un_puntos_suspensivos_suelto_en_prosa_no_es_hueco(self):
        self.cambiar("linkedin.md", "Long text.", "Long text … y más… o … así.")
        self.assertEqual(self.fallos(), "")

    def test_un_puntos_suspensivos_que_es_toda_la_linea_o_el_valor_si_es_hueco(self):
        self.cambiar("linkedin.md", "Long text.", "Long text.\n\n…\n")
        self.assertFallo("linkedin.md: template gap «…» left")
        self.cambiar("linkedin.md", "\n\n…\n", "")
        self.cambiar("ficha.md", "## Reddit", "- **Estado:** …\n\n## Reddit")
        self.assertFallo("ficha.md: template gap «…» left")

    def test_x_cuenta_el_emoji_como_2(self):
        self.cambiar("x.md", "**1/** Sale la versión.", "**1/** " + "🙂" * 140)
        self.assertEqual(self.fallos(), "")
        self.cambiar("x.md", "🙂" * 140, "🙂" * 141)
        self.assertFallo("x.md (es) post 1: 282 weighted characters (max 280")

    def test_x_cuenta_la_url_como_23(self):
        url = "https://ejemplo.org/" + "a" * 100
        self.cambiar("x.md", "**1/** Sale la versión.", f"**1/** {url} " + "a" * 256)
        self.assertEqual(self.fallos(), "")
        self.cambiar("x.md", "a" * 256, "a" * 257)
        self.assertFallo("x.md (es) post 1: 281 weighted characters")

    def lx(self, texto):
        return comprobar.longitud_x(texto, comprobar.regla(self.reglas, "x", "url_peso"),
                                    comprobar.regla(self.reglas, "x", "simbolo_ancho_peso"))

    def test_x_acentos_y_comillas_cuentan_1(self):
        self.assertEqual(self.lx("áéíóú“”—"), 8)
        self.assertEqual(self.lx("日本"), 4)
        self.assertEqual(self.lx("❤️"), 2)
        self.assertEqual(self.lx("http://a.b/" + "c" * 80), 23)
        self.assertEqual(self.lx("©"), 1)

    def test_x_una_secuencia_de_emoji_es_un_bloque_de_2(self):
        for nombre, texto in (("familia", "👨‍👩‍👧‍👦"), ("bandera", "🇪🇸"), ("tono de piel", "👍🏽"), ("profesión", "👩🏽‍💻"),
                              ("tecla", "1️⃣"), ("corazón", "❤️")):
            with self.subTest(nombre):
                self.assertEqual(self.lx(texto), 2)
                self.assertEqual(self.lx("a" + texto + "b"), 4)
        self.assertEqual(self.lx("🇪🇸🇫🇷"), 4)
        self.assertEqual(self.lx("👍👍"), 4)

    def test_x_la_puntuacion_final_no_es_parte_del_enlace(self):
        self.assertEqual(self.lx("(https://a.b/c)."), 1 + 23 + 2)
        self.assertEqual(self.lx("¿https://a.b/c?"), 1 + 23 + 1)
        self.assertEqual(self.lx("«https://a.b/c», https://d.e/f;"), 1 + 23 + 2 + 1 + 23 + 1)
        self.assertEqual(self.lx("https://a.b/c?q=1&r=2"), 23)

    def test_x_un_hilo_con_emoji_de_familia_en_el_limite(self):
        familia = "👨‍👩‍👧‍👦"
        self.cambiar("x.md", "**1/** Sale la versión.", "**1/** " + familia * 140)
        self.assertEqual(self.fallos(), "")
        self.cambiar("x.md", familia * 140, familia * 141)
        self.assertFallo("x.md (es) post 1: 282 weighted characters (max 280")

    def test_x_texto_antes_del_primer_marcador(self):
        self.cambiar("x.md", "## es\n\n**1/**", "## es\n\nIntro suelta.\n\n**1/**")
        self.assertFallo("x.md (es): text before «**1/**»")

    def test_x_el_marcador_n_de_m_vale(self):
        self.escribir("x.md", "## es\n\n**1/2** Uno.\nImagen: medios/tarjeta.webp\n\n**2/2** Dos.\n\n## en\n\n**1/2** One.\n\n**2/2** Two.\n")
        self.assertEqual(self.fallos(), "")
        self.assertEqual(comprobar.posts_x("**1/2** Uno.\n\n**2/2** Dos."), ("", ["Uno.", "Dos."]))

    def test_x_numero_de_posts_del_hilo(self):
        self.escribir("x.md", "## es\n\n" + "".join(f"**{i}/** Uno.\n\n" for i in range(1, 6)) + "## en\n\n**1/** One.\n")
        self.assertFallo("x.md (es): 5 posts; a thread has 1 to 4")

    def test_x_sin_marcadores_es_un_post(self):
        self.escribir("x.md", "## es\n\nUn post suelto.\nImagen: medios/tarjeta.webp\n\n## en\n\nOne post.\n")
        self.assertEqual(self.fallos(), "")

    def test_discord_limite_por_bloque(self):
        self.escribir("discord.md", "## es\n\n" + "a" * 1999 + "\n---\n" + "b" * 2001 + "\n\n## en\n\nok\n")
        out = self.fallos()
        self.assertIn("discord.md (es) message 2: 2001 characters (max 2000)", out)
        self.assertNotIn("message 1", out)

    def test_linkedin_limite(self):
        self.escribir("linkedin.md", "## es\n\n" + "a" * 3001 + "\n\n## en\n\nok\n")
        self.assertFallo("linkedin.md (es): 3001 characters (max 3000)")

    def test_linkedin_en_3000_pasa_y_la_linea_imagen_no_cuenta(self):
        self.escribir("linkedin.md", "## es\n\n" + "a" * 3000 + "\nImagen: medios/tarjeta.png\n\n## en\n\nok\nImagen: medios/tarjeta.png\n")
        self.assertEqual(self.fallos(), "")

    def test_reddit_titulo_demasiado_largo(self):
        self.cambiar("reddit.md", "Sale la versión", "a" * 301)
        self.assertFallo("reddit.md (es): title of 301 characters (max 300)")

    def test_reddit_sin_titulo(self):
        self.cambiar("reddit.md", "**Title:** Release out", "Release out")
        self.assertFallo("reddit.md (en): no title")


class Reddit(Base):
    def test_falta_el_subreddit(self):
        self.cambiar("ficha.md", "- **Subreddit:** r/gamedev\n", "")
        self.assertFallo("reddit.md needs «Subreddit:» in ficha.md")

    def test_falta_la_autopromocion(self):
        self.cambiar("ficha.md", "- **Autopromoción:** solo los sábados\n", "")
        self.assertFallo("«Autopromoción:» line")

    def test_fecha_de_normas_no_valida(self):
        self.cambiar("ficha.md", HOY.isoformat() + "\n- **Auto", "ayer\n- **Auto")
        self.assertFallo("«Normas leídas:» «ayer» has no valid AAAA-MM-DD date")

    def test_sin_reddit_no_se_piden_sus_datos(self):
        self.cambiar("ficha.md", "- reddit\n", "")
        (self.carpeta / "reddit.md").unlink()
        self.assertEqual(self.fallos(), "")


class Imagenes(Base):
    def test_imagen_que_no_existe(self):
        self.cambiar("x.md", "medios/tarjeta.webp", "medios/otra.webp")
        self.assertFallo("x.md: «Imagen: medios/otra.webp» does not exist; render it (" + RENDER + " ")

    def test_imagen_que_no_es_un_render(self):
        self.cambiar("x.md", "medios/tarjeta.webp", "https://x.org/a.png")
        self.assertFallo("x.md: «Imagen: https://x.org/a.png» is not a render; point to medios/<name>.webp")
        self.cambiar("linkedin.md", "medios/tarjeta.png", "https://x.org/a.png")
        self.assertFallo("linkedin.md: «Imagen: https://x.org/a.png» is not a render; point to medios/<name>.png")

    def test_imagen_fuera_de_la_tabla(self):
        (self.carpeta / "medios" / "otra.webp").write_bytes(webp())
        (self.carpeta / "medios" / "otra-mini.webp").write_bytes(webp())
        self.cambiar("x.md", "medios/tarjeta.webp", "medios/otra.webp")
        self.assertFallo("x.md: «medios/otra.webp» is not in «## Imágenes» of ficha.md")

    def test_alt_que_falta_en_un_idioma(self):
        self.cambiar("ficha.md", " / en: Release card", "")
        self.assertFallo("«medios/tarjeta.webp» has no alt text in «en»")

    def test_ficha_sin_tabla_de_imagenes(self):
        self.cambiar("ficha.md", "## Imágenes", "## Otras")
        self.assertFallo("no «## Imágenes» section")

    def test_render_sin_mini(self):
        (self.carpeta / "medios" / "tarjeta-mini.webp").unlink()
        self.assertFallo("«medios/tarjeta.webp» has no -mini.webp; render it again (" + RENDER + " ")

    def test_render_no_listado_en_la_ficha(self):
        (self.carpeta / "medios" / "suelta.webp").write_bytes(webp())
        self.assertFallo("medios/suelta.webp: not in «## Imágenes»")

    def test_fuente_sin_renderizar(self):
        for nombre in ("grafico.html", "foto.jpg", "dibujo.svg", "captura.png"):
            (self.carpeta / "medios" / "fuente" / nombre).write_bytes(b"x")
            self.assertFallo(f"medios/fuente/{nombre}: not rendered; run {RENDER} ")

    def test_fuente_renderizada_a_pdf_pasa(self):
        (self.carpeta / "medios" / "fuente" / "carrusel.html").write_text("<p>ok</p>")
        self.pdf_en_linkedin(3)
        self.assertEqual(self.fallos(), "")

    def test_peso_de_la_imagen(self):
        reglas = json.loads(json.dumps(self.reglas))
        reglas["x"]["imagen_bytes"]["valor"] = 100
        (self.carpeta / "medios" / "tarjeta.webp").write_bytes(webp(extra=500))
        self.assertFallo("medios/tarjeta.webp: 530 bytes (max 100 for x)", reglas=reglas)

    def test_pixeles_de_la_imagen(self):
        (self.carpeta / "medios" / "tarjeta.png").write_bytes(png(7000, 6000))
        self.assertFallo("medios/tarjeta.png: 7000x6000 = 42000000 pixels (must be under 36152320 for linkedin)")
        (self.carpeta / "medios" / "tarjeta.png").write_bytes(jpeg(7000, 6000))
        self.assertFallo("medios/tarjeta.png: 7000x6000 = 42000000 pixels (must be under 36152320 for linkedin)")

    def test_alt_demasiado_largo(self):
        self.cambiar("ficha.md", "Tarjeta de la versión", "a" * 1001)
        self.assertFallo("alt text «es» of «medios/tarjeta.webp» has 1001 characters (max 1000 for x)")

    def test_pdf_solo_en_linkedin(self):
        (self.carpeta / "medios" / "carrusel.pdf").write_bytes(pdf(2))
        self.cambiar("ficha.md", "| linkedin |", "| linkedin |\n| `medios/carrusel.pdf` | es: C / en: C | x |")
        self.cambiar("x.md", "medios/tarjeta.webp", "medios/carrusel.pdf")
        self.assertFallo("x.md: «medios/carrusel.pdf» is a PDF and only LinkedIn takes a document")

    def test_paginas_del_pdf(self):
        reglas = json.loads(json.dumps(self.reglas))
        reglas["linkedin"]["documento_paginas"]["valor"] = 3
        self.pdf_en_linkedin(4)
        self.assertFallo("medios/carrusel.pdf: 4 pages (LinkedIn max 3)", reglas=reglas)

    def test_peso_del_pdf(self):
        reglas = json.loads(json.dumps(self.reglas))
        reglas["linkedin"]["documento_bytes"]["valor"] = 50
        self.pdf_en_linkedin(2)
        self.assertFallo("medios/carrusel.pdf:", reglas=reglas)
        self.assertFallo("(LinkedIn max 50)", reglas=reglas)


class Formatos(Base):
    def test_linkedin_acepta_png_jpg_y_gif_y_x_solo_webp(self):
        for ext, datos in ((".png", png(100, 50)), (".jpg", jpeg(100, 50)), (".gif", gif(100, 50))):
            with self.subTest(ext):
                (self.carpeta / "medios" / "tarjeta.png").unlink(missing_ok=True)
                (self.carpeta / "medios" / f"tarjeta{ext}").write_bytes(datos)
                t = (self.carpeta / "linkedin.md").read_text(encoding="utf-8")
                self.escribir("linkedin.md", t.replace("tarjeta.png", f"tarjeta{ext}"))
                f = (self.carpeta / "ficha.md").read_text(encoding="utf-8")
                self.escribir("ficha.md", f.replace("tarjeta.png", f"tarjeta{ext}"))
                self.assertEqual(self.fallos(), "")
                (self.carpeta / "medios" / f"tarjeta{ext}").unlink()
                self.escribir("linkedin.md", t)
                self.escribir("ficha.md", f)

    def test_x_con_png_es_un_error(self):
        self.cambiar("x.md", "medios/tarjeta.webp", "medios/tarjeta.png")
        self.cambiar("ficha.md", "| x |", "| x, linkedin |")
        self.assertFallo("x.md: «medios/tarjeta.png» is a .png and x takes .webp; point to medios/<name>.webp")

    def test_linkedin_con_webp_es_un_error(self):
        self.cambiar("linkedin.md", "medios/tarjeta.png", "medios/tarjeta.webp")
        self.assertFallo("linkedin.md: «medios/tarjeta.webp» is a .webp and linkedin takes .png, .jpg, .gif; "
                         "point to medios/<name>.png")

    def test_un_png_suelto_en_medios_sin_fila_es_un_error(self):
        (self.carpeta / "medios" / "suelta.png").write_bytes(png(10, 10))
        self.assertFallo("medios/suelta.png: not in «## Imágenes»")

    def test_el_peso_de_un_png_se_comprueba(self):
        reglas = json.loads(json.dumps(self.reglas))
        reglas["x"]["imagen_bytes"]["valor"] = 20
        self.cambiar("x.md", "medios/tarjeta.webp", "medios/tarjeta.png")
        self.cambiar("ficha.md", "| x |", "| x, linkedin |")
        self.assertFallo("medios/tarjeta.png: 29 bytes (max 20 for x)", reglas=reglas)

    def test_linkedin_formatos_estan_en_reglas_con_fuente_primaria(self):
        r = self.reglas["linkedin"]["imagen_formatos"]
        self.assertEqual((r["valor"], r["marca"]), ([".png", ".jpg", ".gif"], "P"))
        self.assertIn("images-api", r["fuente"])


class FilasDeImagenes(Base):
    def test_un_canal_de_la_fila_sin_linea_imagen(self):
        self.cambiar("ficha.md", "Release card | x |", "Release card | x, discord |")
        self.assertFallo("ficha.md: «medios/tarjeta.webp» lists channel «discord» but discord.md has no "
                         "«Imagen: medios/tarjeta.webp» line")

    def test_linea_imagen_de_un_canal_que_la_fila_no_lista(self):
        self.cambiar("discord.md", "## es\n", "## es\nImagen: medios/tarjeta.webp\n")
        self.assertFallo("discord.md: «medios/tarjeta.webp» is not listed for «discord» in «## Imágenes» of ficha.md")

    def test_la_fila_se_valida_contra_cada_canal_de_su_celda(self):
        # discord.md has no `Imagen:` line (an error of its own), but the row says discord: weight and alt are checked
        reglas = json.loads(json.dumps(self.reglas))
        reglas["discord"]["imagen_bytes"]["valor"] = 100
        self.cambiar("ficha.md", "Release card | x |", "Release card | x, discord |")
        (self.carpeta / "medios" / "tarjeta.webp").write_bytes(webp(extra=500))
        self.assertFallo("medios/tarjeta.webp: 530 bytes (max 100 for discord)", reglas=reglas)
        self.cambiar("ficha.md", "Tarjeta de la versión", "a" * 1025)
        self.assertFallo("alt text «es» of «medios/tarjeta.webp» has 1025 characters (max 1024 for discord)")

    def test_la_fila_de_linkedin_comprueba_los_pixeles_aunque_el_canal_no_apunte(self):
        (self.carpeta / "medios" / "tarjeta.png").write_bytes(png(7000, 6000))
        self.escribir("linkedin.md", "## es\n\nTexto largo.\n\n## en\n\nLong text.\n")
        out = self.fallos()
        self.assertIn("lists channel «linkedin» but linkedin.md has no «Imagen: medios/tarjeta.png» line", out)
        self.assertIn("7000x6000 = 42000000 pixels", out)


class ImagenesTruncadas(Base):
    MSG = "not a valid image; render it again (" + RENDER + " "

    def test_una_imagen_que_no_es_imagen_en_x(self):
        (self.carpeta / "medios" / "tarjeta.webp").write_bytes(b"basura")
        self.assertFallo("medios/tarjeta.webp: " + self.MSG)

    def test_png_truncado_con_la_firma_completa(self):
        (self.carpeta / "medios" / "tarjeta.png").write_bytes(png(100, 50)[:20])
        self.assertFallo("medios/tarjeta.png: " + self.MSG)

    def test_png_sin_ihdr(self):
        (self.carpeta / "medios" / "tarjeta.png").write_bytes(b"\x89PNG\r\n\x1a\n" + bytes(30))
        self.assertFallo("medios/tarjeta.png: " + self.MSG)

    def test_jpeg_truncado_con_la_firma_completa(self):
        (self.carpeta / "medios" / "tarjeta.png").write_bytes(jpeg(100, 50)[:18])
        self.assertFallo("medios/tarjeta.png: " + self.MSG)

    def test_webp_vp8x_truncado(self):
        (self.carpeta / "medios" / "tarjeta.webp").write_bytes(webp()[:29])
        self.assertFallo("medios/tarjeta.webp: " + self.MSG)

    def test_el_mini_tambien_tiene_que_ser_valido(self):
        (self.carpeta / "medios" / "tarjeta-mini.webp").write_bytes(webp(10, 5)[:25])
        self.assertFallo("medios/tarjeta-mini.webp: " + self.MSG)

    def test_el_pdf_ilegible_da_la_orden_completa(self):
        self.pdf_en_linkedin(1)
        (self.carpeta / "medios" / "carrusel.pdf").write_bytes(b"%PDF-1.4\n")
        self.assertFallo("medios/carrusel.pdf: the page count cannot be read; render the PDF again (" + RENDER + " ")


class Cabeceras(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp())
        self.addCleanup(shutil.rmtree, self.tmp)

    def dim(self, nombre, datos):
        p = self.tmp / nombre
        p.write_bytes(datos)
        return comprobar.dimensiones(p)

    def test_webp_vp8x_vp8l_y_vp8(self):
        self.assertEqual(self.dim("a.webp", webp(640, 480)), (640, 480))
        bits = (320 - 1) | ((200 - 1) << 14)
        vp8l = b"VP8L" + struct.pack("<I", 5) + b"\x2f" + struct.pack("<I", bits)
        self.assertEqual(self.dim("b.webp", b"RIFF" + struct.pack("<I", 4 + len(vp8l)) + b"WEBP" + vp8l), (320, 200))
        vp8 = b"VP8 " + struct.pack("<I", 10) + b"\x00\x00\x00\x9d\x01\x2a" + struct.pack("<HH", 800, 600)
        self.assertEqual(self.dim("c.webp", b"RIFF" + struct.pack("<I", 4 + len(vp8)) + b"WEBP" + vp8), (800, 600))

    def test_webp_truncado(self):
        # VP8X needs 30 bytes, VP8L 25; the RIFF size is consistent here, so only the minimum length can catch it
        vp8x = b"WEBPVP8X" + struct.pack("<I", 10) + bytes(4) + b"\x63\x00"
        self.assertIsNone(self.dim("a.webp", b"RIFF" + struct.pack("<I", len(vp8x)) + vp8x))
        vp8l = b"WEBPVP8L" + struct.pack("<I", 5) + b"\x2f" + b"\x01\x02"
        self.assertIsNone(self.dim("b.webp", b"RIFF" + struct.pack("<I", len(vp8l)) + vp8l))

    def test_webp_con_el_tamano_riff_mayor_que_el_archivo(self):
        self.assertIsNone(self.dim("a.webp", webp()[:28] + b"\x00\x00"[:0]))
        entero = webp(extra=100)
        self.assertEqual(self.dim("b.webp", entero), (100, 50))
        self.assertIsNone(self.dim("c.webp", entero[:-101]))

    def test_gif(self):
        self.assertEqual(self.dim("a.gif", gif(300, 200)), (300, 200))
        self.assertIsNone(self.dim("b.gif", gif(300, 200)[:8]))

    def test_dimensiones_a_cero_no_son_validas(self):
        self.assertIsNone(self.dim("a.png", png(0, 10)))

    def test_png(self):
        self.assertEqual(self.dim("a.png", png(1200, 630)), (1200, 630))

    def test_jpeg(self):
        sof = b"\xff\xc0" + struct.pack(">HBHH", 11, 8, 480, 640) + b"\x03\x01\x11\x00"
        app = b"\xff\xe0" + struct.pack(">H", 6) + b"JFIF"
        self.assertEqual(self.dim("a.jpg", b"\xff\xd8" + app + sof), (640, 480))

    def test_formato_desconocido(self):
        self.assertIsNone(self.dim("a.webp", b"no es una imagen"))
        self.assertIsNone(self.dim("b.png", b"\x89PNG"))

    def test_png_y_jpeg_truncados_con_la_firma_completa(self):
        self.assertIsNone(self.dim("a.png", png(10, 10)[:20]))
        self.assertIsNone(self.dim("b.png", b"\x89PNG\r\n\x1a\n" + bytes(30)))
        self.assertIsNone(self.dim("a.jpg", jpeg(10, 10)[:16]))
        self.assertIsNone(self.dim("b.jpg", b"\xff\xd8\xff\xe0"))


class Reglas(unittest.TestCase):
    def test_cada_regla_lleva_valor_marca_fuente_y_fecha(self):
        reglas = comprobar.cargar_reglas()
        self.assertIn("Single place", reglas["_doc"])
        for canal, cuerpo in reglas.items():
            if canal.startswith("_"):
                continue
            for clave, r in cuerpo.items():
                with self.subTest(regla=f"{canal}.{clave}"):
                    self.assertEqual({"valor", "marca", "fuente", "comprobado"} - set(r), set())
                    self.assertIn(r["marca"], ("P", "S", "NV", "C"))
                    self.assertRegex(r["comprobado"], r"^\d{4}-\d{2}-\d{2}$")

    def test_las_claves_que_lee_el_script_existen(self):
        reglas = comprobar.cargar_reglas()
        for clave in comprobar.CLAVES:
            canal, k = clave.split(".")
            with self.subTest(clave=clave):
                self.assertIsNotNone(comprobar.regla(reglas, canal, k))
                self.assertIn(clave, reglas["_doc"])

    def test_el_script_no_lee_ninguna_clave_fuera_de_claves(self):
        fuente = (AQUI / "comprobar.py").read_text(encoding="utf-8")
        leidas = set(re.findall(r"regla\(reglas, [\"'](\w+)[\"'], [\"'](\w+)[\"']\)", fuente))
        self.assertTrue(leidas)
        for canal, k in leidas:
            self.assertIn(f"{canal}.{k}", comprobar.CLAVES)

    def test_sin_una_clave_falla_cerrado_y_nombra_cual(self):
        reglas = comprobar.cargar_reglas()
        tmp = Path(tempfile.mkdtemp())
        self.addCleanup(shutil.rmtree, tmp)
        for clave in comprobar.CLAVES:
            canal, k = clave.split(".")
            with self.subTest(clave=clave):
                rota = json.loads(json.dumps(reglas))
                del rota[canal][k]
                esperado = f"reglas.json lacks {clave}; restore it"
                with self.assertRaises(comprobar.ReglasIncompletas) as e:
                    comprobar.validar_reglas(rota)
                self.assertEqual(str(e.exception), esperado)
                ruta = tmp / "reglas.json"
                ruta.write_text(json.dumps(rota), encoding="utf-8")
                with self.assertRaises(comprobar.ReglasIncompletas) as e:
                    comprobar.cargar_reglas(ruta)
                self.assertEqual(str(e.exception), esperado)
                self.assertEqual(comprobar.comprobar(tmp, rota), [esperado])

    def test_sin_url_peso_no_se_usa_un_23_escondido(self):
        rota = json.loads(json.dumps(comprobar.cargar_reglas()))
        rota["x"]["simbolo_ancho_peso"]["valor"] = None
        self.assertEqual(comprobar.comprobar(Path("."), rota), ["reglas.json lacks x.simbolo_ancho_peso; restore it"])

    def test_la_cli_con_reglas_rotas_sale_con_uno_y_dice_que_falta(self):
        tmp = Path(tempfile.mkdtemp())
        self.addCleanup(shutil.rmtree, tmp)
        shutil.copytree(AQUI.parent, tmp / "skill", ignore=shutil.ignore_patterns("__pycache__", "plantilla"))
        reglas = json.loads((tmp / "skill" / "reglas.json").read_text(encoding="utf-8"))
        del reglas["discord"]["mensaje"]
        (tmp / "skill" / "reglas.json").write_text(json.dumps(reglas), encoding="utf-8")
        r = subprocess.run([sys.executable, str(tmp / "skill" / "scripts" / "comprobar.py"), str(tmp)], capture_output=True, text=True)
        self.assertEqual((r.returncode, r.stdout.strip()), (1, "reglas.json lacks discord.mensaje; restore it"))

    def test_reddit_no_tiene_datos_verificados(self):
        reglas = comprobar.cargar_reglas()
        self.assertEqual({r["marca"] for k, r in reglas["reddit"].items() if k in ("titulo", "normas")}, {"NV"})

    def test_los_valores_de_convencion_de_reddit_y_de_los_canales_extra_estan_en_reglas(self):
        reglas = comprobar.cargar_reglas()
        self.assertEqual((reglas["reddit"]["normas_dias"]["valor"], reglas["reddit"]["normas_dias"]["marca"]), (90, "C"))
        self.assertEqual(reglas["reddit"]["normas_min_caracteres"]["valor"], 200)
        self.assertEqual(reglas["canal_extra"]["imagen_formatos"]["valor"], [".webp", ".png", ".jpg"])


class Idiomas(Base):
    def test_cualquier_codigo_iso_de_dos_letras_vale(self):
        self.cambiar("ficha.md", "Idiomas: es, en", "Idiomas: es, gl, en")
        for c in CANALES:
            t = (self.carpeta / f"{c}.md").read_text(encoding="utf-8")
            self.escribir(f"{c}.md", t + "\n## gl\n\n" + ("**Title:** Galego\n\n" if c == "reddit" else "")
                          + ("**1/** Galego.\n" if c == "x" else "Galego.\n" if c != "discord" else "### Galego\n"))
        self.cambiar("ficha.md", "Release card | x |", "Release card / gl: Tarxeta | x |")
        self.cambiar("ficha.md", "Release card | linkedin |", "Release card / gl: Tarxeta | linkedin |")
        self.assertEqual(self.fallos(), "")

    def test_un_codigo_que_no_son_dos_letras_minusculas_es_un_error(self):
        for malo in ("ESP", "e", "en-US", "e1"):
            with self.subTest(malo):
                self.cambiar("ficha.md", "Idiomas: es, en", f"Idiomas: es, en, {malo}")
                self.assertFallo(f"ficha.md: «Idiomas:» has «{malo}»; use two-letter lowercase ISO 639-1 codes")
                self.cambiar("ficha.md", f"Idiomas: es, en, {malo}", "Idiomas: es, en")

    def test_la_seccion_de_un_idioma_libre_se_reconoce(self):
        self.escribir("linkedin.md", CANALES["linkedin"] + "\n## ja\n\nTexto.\n")
        self.assertFallo("linkedin.md: language «ja» is not in the piece")
        self.cambiar("ficha.md", "Idiomas: es, en", "Idiomas: es, en, ja")
        self.assertNotIn("language «ja»", self.fallos())
        self.assertFallo("x.md: no «## ja» section")


class ImagenesPorIdioma(Base):
    """Idiomas: es, en, gl. The first language uses medios/<n>.webp; the others may have medios/<n>.<lang>.webp."""

    def setUp(self):
        super().setUp()
        self.cambiar("ficha.md", "Idiomas: es, en", "Idiomas: es, en, gl")
        self.cambiar("ficha.md", "| `medios/tarjeta.webp` | es: Tarjeta de la versión / en: Release card | x |",
                     "| `medios/tarjeta.webp` | es: Tarjeta / en: Card / gl: Tarxeta | x |")
        self.cambiar("ficha.md", "es: Tarjeta de la versión / en: Release card | linkedin |",
                     "es: Tarjeta / en: Card / gl: Tarxeta | linkedin |")
        self.escribir("x.md", "## es\n\n**1/** Sale.\nImagen: medios/tarjeta.webp\n\n## en\n\n**1/** Out.\nImagen: medios/tarjeta.webp\n\n"
                      "## gl\n\n**1/** Sae.\nImagen: medios/tarjeta.webp\n")
        t = (self.carpeta / "linkedin.md").read_text(encoding="utf-8")
        self.escribir("linkedin.md", t + "\n## gl\n\nTexto longo.\nImagen: medios/tarjeta.png\n")
        self.escribir("reddit.md", CANALES["reddit"] + "\n## gl\n\n**Título:** Sae\n\nTexto.\n")
        self.escribir("discord.md", CANALES["discord"] + "\n## gl\n\n### Novas\n")
        self.assertEqual(self.fallos(), "")

    def imagen_gallega(self, ext=".webp", canal="x", canales="x"):
        """The gl section of a channel points to its own render, listed in the table."""
        medios = self.carpeta / "medios"
        (medios / f"tarjeta.gl{ext}").write_bytes(webp() if ext == ".webp" else png(100, 50))
        if ext == ".webp":
            (medios / "tarjeta.gl-mini.webp").write_bytes(webp(10, 5))
        if ext == ".webp":
            (medios / "fuente" / "tarjeta.gl.html").write_text("<p>gl</p>")
        t = (self.carpeta / f"{canal}.md").read_text(encoding="utf-8")
        i = t.index("## gl")
        self.escribir(f"{canal}.md", t[:i] + t[i:].replace(f"medios/tarjeta{ext}", f"medios/tarjeta.gl{ext}"))
        fila = f"| `medios/tarjeta.gl{ext}` | gl: Tarxeta propia | {canales} |\n"
        f = (self.carpeta / "ficha.md").read_text(encoding="utf-8")
        self.escribir("ficha.md", f.replace("\n\n## Uso interno", "\n" + fila + "\n## Uso interno", 1))

    def test_la_imagen_propia_de_un_idioma_con_su_fila_pasa(self):
        self.imagen_gallega()
        self.assertEqual(self.fallos(), "")

    def test_la_fila_de_la_imagen_propia_pide_el_alt_solo_en_su_idioma(self):
        self.imagen_gallega()
        self.cambiar("ficha.md", "gl: Tarxeta propia", "es: Propia")
        self.assertFallo("ficha.md: «medios/tarjeta.gl.webp» has no alt text in «gl»")
        self.assertNotIn("«medios/tarjeta.gl.webp» has no alt text in «es»", self.fallos())

    def test_la_imagen_propia_necesita_su_mini(self):
        self.imagen_gallega()
        (self.carpeta / "medios" / "tarjeta.gl-mini.webp").unlink()
        self.assertFallo("ficha.md: «medios/tarjeta.gl.webp» has no -mini.webp; render it again")

    def test_la_imagen_propia_sin_renderizar(self):
        self.imagen_gallega()
        (self.carpeta / "medios" / "tarjeta.gl.webp").unlink()
        self.assertFallo("x.md: «Imagen: medios/tarjeta.gl.webp» does not exist; render it ("
                         f"{RENDER} {self.carpeta})")

    def test_la_fuente_con_sufijo_se_comprueba_como_cualquier_fuente(self):
        self.imagen_gallega()
        (self.carpeta / "medios" / "tarjeta.gl.webp").unlink()
        (self.carpeta / "medios" / "tarjeta.gl-mini.webp").unlink()
        self.assertFallo("medios/fuente/tarjeta.gl.html: not rendered")

    def test_la_imagen_propia_se_comprueba_con_las_reglas_del_canal(self):
        reglas = json.loads(json.dumps(self.reglas))
        reglas["x"]["imagen_bytes"]["valor"] = 20
        self.imagen_gallega()
        self.assertFallo("medios/tarjeta.gl.webp: 30 bytes (max 20 for x)", reglas=reglas)

    def test_linkedin_con_imagen_propia_en_png_y_el_webp_sigue_siendo_error(self):
        self.imagen_gallega(".png", "linkedin", "linkedin")
        self.assertEqual(self.fallos(), "")
        self.cambiar("linkedin.md", "Imagen: medios/tarjeta.gl.png", "Imagen: medios/tarjeta.gl.webp")
        self.cambiar("ficha.md", "`medios/tarjeta.gl.png`", "`medios/tarjeta.gl.webp`")
        (self.carpeta / "medios" / "tarjeta.gl.webp").write_bytes(webp())
        (self.carpeta / "medios" / "tarjeta.gl-mini.webp").write_bytes(webp(10, 5))
        self.assertFallo("linkedin.md: «medios/tarjeta.gl.webp» is a .webp and linkedin takes .png, .jpg, .gif")

    def test_un_sufijo_de_un_idioma_que_no_esta_en_idiomas_es_un_error(self):
        (self.carpeta / "medios" / "tarjeta.fr.webp").write_bytes(webp())
        (self.carpeta / "medios" / "tarjeta.fr-mini.webp").write_bytes(webp(10, 5))
        self.cambiar("x.md", "## gl\n\n**1/** Sae.\nImagen: medios/tarjeta.webp", "## gl\n\n**1/** Sae.\nImagen: medios/tarjeta.fr.webp")
        self.cambiar("ficha.md", "\n\n## Uso interno", "\n| `medios/tarjeta.fr.webp` | es: a / en: b / gl: c | x |\n\n## Uso interno")
        out = self.fallos()
        self.assertIn("x.md: «medios/tarjeta.fr.webp» has the language suffix «.fr.» but «fr» is not in «Idiomas:» of ficha.md; "
                      "add it there or rename the file", out)
        self.assertIn("ficha.md: «medios/tarjeta.fr.webp» has the language suffix «.fr.»", out)

    def test_una_fuente_con_sufijo_de_un_idioma_que_no_esta_es_un_error(self):
        (self.carpeta / "medios" / "fuente" / "tarjeta.fr.html").write_text("<p>fr</p>")
        self.assertFallo("medios/fuente/tarjeta.fr.html: «medios/fuente/tarjeta.fr.html» has the language suffix «.fr.» "
                         "but «fr» is not in «Idiomas:»")

    def test_el_primer_idioma_no_lleva_sufijo(self):
        (self.carpeta / "medios" / "tarjeta.es.webp").write_bytes(webp())
        (self.carpeta / "medios" / "tarjeta.es-mini.webp").write_bytes(webp(10, 5))
        self.cambiar("x.md", "Sale.\nImagen: medios/tarjeta.webp", "Sale.\nImagen: medios/tarjeta.es.webp")
        self.assertFallo("x.md: «medios/tarjeta.es.webp» has the suffix «.es.» but «es» is the first language and uses the "
                         "file without suffix; rename it to «medios/tarjeta.webp»")

    def test_la_imagen_de_otro_idioma_en_una_seccion_es_un_error(self):
        self.imagen_gallega()
        self.cambiar("x.md", "## en\n\n**1/** Out.\nImagen: medios/tarjeta.webp", "## en\n\n**1/** Out.\nImagen: medios/tarjeta.gl.webp")
        self.assertFallo("x.md (en): «medios/tarjeta.gl.webp» is the image of «gl» but sits in the «## en» section; "
                         "move the line to «## gl»")

    def test_la_fila_de_una_imagen_propia_pide_la_linea_imagen(self):
        self.imagen_gallega()
        self.cambiar("x.md", "Imagen: medios/tarjeta.gl.webp", "")
        self.assertFallo("ficha.md: «medios/tarjeta.gl.webp» lists channel «x» but x.md has no «Imagen: medios/tarjeta.gl.webp» line")

    def test_un_nombre_con_un_punto_que_no_es_idioma_no_es_sufijo(self):
        self.assertIsNone(comprobar.idioma_de_archivo("medios/v1.0.webp"))
        self.assertIsNone(comprobar.idioma_de_archivo("medios/tarjeta.webp"))
        self.assertIsNone(comprobar.idioma_de_archivo("medios/foo.bar.webp"))
        self.assertEqual(comprobar.idioma_de_archivo("medios/tarjeta.gl-mini.webp"), "gl")
        self.assertEqual(comprobar.idioma_de_archivo("medios/fuente/tarjeta.gl.html"), "gl")


class NormasDeReddit(Base):
    leidas = HOY.isoformat()

    def mover_a(self, dia):
        """Rename the date folder of the piece to <dia> (a date)."""
        nueva = self.tmp / dia.isoformat()
        self.carpeta.parent.rename(nueva)
        self.carpeta = nueva / self.carpeta.name
        self.leidas = HOY.isoformat()

    def normas(self, texto):
        f = (self.carpeta / "ficha.md").read_text(encoding="utf-8")
        self.escribir("ficha.md", re.sub(r"(### Normas de r/gamedev\n\n).*?(\n\n## Imágenes)",
                                         lambda m: m.group(1) + texto + m.group(2), f, flags=re.S))

    def test_sin_el_bloque_de_normas(self):
        self.normas("")
        self.cambiar("ficha.md", "### Normas de r/gamedev\n", "")
        self.assertFallo("ficha.md: no rules block for r/gamedev; paste the rules text (at least 200 characters, copied "
                         "from reddit.com/r/gamedev/about/rules) under a «### Normas de r/gamedev» heading inside «## Reddit» "
                         "of ficha.md")

    def test_bloque_demasiado_corto(self):
        self.normas("1. Sé amable.")
        self.assertFallo("ficha.md: the rules block of r/gamedev has 13 characters (min 200); paste the complete rules "
                         "text under «### Normas de r/gamedev» in «## Reddit» of ficha.md")

    def test_los_espacios_y_saltos_no_cuentan_para_el_minimo(self):
        self.normas("a" + "\n" * 300 + "   " * 100 + "b")
        self.assertFallo("has 3 characters (min 200)")

    def test_justo_en_el_minimo_pasa(self):
        self.normas("a" * 200)
        self.assertEqual(self.fallos(), "")
        self.normas("a" * 199)
        self.assertFallo("has 199 characters (min 200)")

    def test_el_minimo_sale_de_reglas_json(self):
        reglas = json.loads(json.dumps(self.reglas))
        reglas["reddit"]["normas_min_caracteres"]["valor"] = 5000
        self.assertFallo("min 5000", reglas=reglas)

    def test_un_bloque_por_subreddit(self):
        self.cambiar("ficha.md", "- **Subreddit:** r/gamedev\n", "- **Subreddit:** r/gamedev, r/IndieDev\n- **Subreddit:** r/spain\n")
        out = self.fallos()
        self.assertIn("no rules block for r/IndieDev; paste the rules text", out)
        self.assertIn("no rules block for r/spain; paste the rules text", out)
        self.assertNotIn("no rules block for r/gamedev", out)
        f = (self.carpeta / "ficha.md").read_text(encoding="utf-8")
        self.escribir("ficha.md", f.replace("## Imágenes", f"### Normas de r/IndieDev\n\n{NORMAS}\n### Normas de r/spain\n\n{NORMAS}\n## Imágenes", 1))
        self.assertEqual(self.fallos(), "")

    def test_el_nombre_del_subreddit_no_distingue_mayusculas_ni_r_barra(self):
        self.cambiar("ficha.md", "r/gamedev\n- **Normas", "GameDev\n- **Normas")
        self.assertEqual(self.fallos(), "")

    def test_un_bloque_de_un_subreddit_que_no_esta_listado(self):
        self.cambiar("ficha.md", "### Normas de r/gamedev", "### Normas de r/otro")
        out = self.fallos()
        self.assertIn("no rules block for r/gamedev", out)
        self.assertIn("«### Normas de r/otro» matches no «Subreddit:» line; add r/otro to «Subreddit:» or remove the block", out)

    def test_bloque_repetido(self):
        self.cambiar("ficha.md", "## Imágenes", f"### Normas de r/gamedev\n\n{NORMAS}\n## Imágenes")
        self.assertFallo("«### Normas de r/gamedev» appears more than once; merge the blocks into one")

    def test_un_subreddit_con_un_nombre_raro(self):
        self.cambiar("ficha.md", "r/gamedev\n- **Normas", "r/game.dev\n- **Normas")
        self.assertFallo("ficha.md: «Subreddit:» «r/game.dev» is not a subreddit name; write it as r/<name>")

    def test_las_normas_pegadas_pueden_llevar_almohadillas_y_listas(self):
        self.normas("# Normas\n\n- " + NORMAS + "\n- Más.")
        self.assertEqual(self.fallos(), "")

    def test_el_bloque_de_otro_subreddit_no_cuenta_para_este(self):
        self.normas("corto")
        self.cambiar("ficha.md", "- **Subreddit:** r/gamedev\n", "- **Subreddit:** r/gamedev, r/otro\n")
        self.cambiar("ficha.md", "## Imágenes", f"### Normas de r/otro\n\n{NORMAS}\n## Imágenes")
        out = self.fallos()
        self.assertIn("the rules block of r/gamedev has 5 characters", out)
        self.assertNotIn("r/otro has", out)

    def test_fecha_de_hoy_pasa_y_manana_es_futuro(self):
        self.assertEqual(self.fallos(), "")
        dia = (HOY + timedelta(days=1)).isoformat()
        self.cambiar("ficha.md", HOY.isoformat() + "\n- **Auto", dia + "\n- **Auto")
        self.assertFallo(f"ficha.md: «Normas leídas:» «{dia}» is in the future; write the day you read the rules")

    def test_fecha_de_hace_90_dias_pasa_y_91_no(self):
        for dias, bien in ((90, True), (91, False), (400, False)):
            with self.subTest(dias=dias):
                dia = (HOY - timedelta(days=dias)).isoformat()
                self.cambiar("ficha.md", "Normas leídas:** " + HOY.isoformat(), "Normas leídas:** " + dia)
                if bien:
                    self.assertEqual(self.fallos(), "")
                else:
                    self.assertFallo(f"ficha.md: «Normas leídas:» «{dia}» is {dias} days old (max 90); read the rules again, "
                                     "paste them under «### Normas de r/<name>» and write today's date")
                self.cambiar("ficha.md", "Normas leídas:** " + dia, "Normas leídas:** " + HOY.isoformat())

    def test_los_dias_salen_de_reglas_json(self):
        reglas = json.loads(json.dumps(self.reglas))
        reglas["reddit"]["normas_dias"]["valor"] = 7
        dia = (HOY - timedelta(days=8)).isoformat()
        self.cambiar("ficha.md", "Normas leídas:** " + HOY.isoformat(), "Normas leídas:** " + dia)
        self.assertFallo("is 8 days old (max 7)", reglas=reglas)
        self.assertNotIn("days old", self.fallos())

    def test_hoy_solo_decide_lo_futuro(self):
        out = comprobar.comprobar(self.carpeta, self.reglas, hoy=HOY - timedelta(days=1))
        self.assertIn("is in the future", "\n".join(out))

    def test_la_fecha_se_mide_contra_el_dia_de_la_carpeta_de_la_pieza(self):
        carpeta_dia = HOY - timedelta(days=200)
        self.mover_a(carpeta_dia)
        for leidas, bien in ((0, True), (90, True), (91, False)):
            with self.subTest(leidas=leidas):
                dia = (carpeta_dia - timedelta(days=leidas)).isoformat()
                self.cambiar("ficha.md", "Normas leídas:** " + self.leidas, "Normas leídas:** " + dia)
                self.leidas = dia
                if bien:
                    self.assertEqual(self.fallos(), "")
                else:
                    self.assertFallo(f"ficha.md: «Normas leídas:» «{dia}» is 91 days old (max 90); read the rules again, "
                                     "paste them under «### Normas de r/<name>» and write today's date")

    def test_una_fecha_futura_se_rechaza_contra_hoy_aunque_la_carpeta_sea_de_ayer(self):
        self.mover_a(HOY - timedelta(days=30))
        dia = (HOY + timedelta(days=1)).isoformat()
        self.cambiar("ficha.md", "Normas leídas:** " + HOY.isoformat(), "Normas leídas:** " + dia)
        self.assertFallo(f"ficha.md: «Normas leídas:» «{dia}» is in the future; write the day you read the rules")

    def test_fuera_de_una_carpeta_de_fecha_se_mide_contra_hoy(self):
        otra = self.tmp / "sueltas" / "01-lanzamiento"
        otra.parent.mkdir()
        self.carpeta.rename(otra)
        self.carpeta = otra
        dia = (HOY - timedelta(days=91)).isoformat()
        self.cambiar("ficha.md", "Normas leídas:** " + HOY.isoformat(), "Normas leídas:** " + dia)
        self.assertFallo(f"«Normas leídas:» «{dia}» is 91 days old (max 90)")

    def test_un_subreddit_vacio_no_toma_la_linea_siguiente(self):
        self.cambiar("ficha.md", "- **Subreddit:** r/gamedev\n", "- **Subreddit:**\n")
        self.assertFallo("reddit.md needs «Subreddit:» in ficha.md")
        self.assertEqual(comprobar.campo("Idiomas:\n\n## Canales\n", "Idiomas"), "")
        self.assertEqual(comprobar.campo("- **Subreddit:**   \n- **Normas leídas:** 2026-01-01", "Subreddit"), "")

    def test_un_subreddit_sin_nombre(self):
        for valor in (",", "r/", "/r/ ;"):
            with self.subTest(valor):
                self.cambiar("ficha.md", "- **Subreddit:** r/gamedev\n", f"- **Subreddit:** {valor}\n")
                self.assertFallo("ficha.md: no subreddit: write «- **Subreddit:** r/<name>» in «## Reddit» before the first «###» block")
                self.cambiar("ficha.md", f"- **Subreddit:** {valor}\n", "- **Subreddit:** r/gamedev\n")

    def test_un_apartado_posterior_no_completa_las_normas(self):
        self.normas("corto\n\n### Notas\n\n" + NORMAS)
        self.assertFallo("the rules block of r/gamedev has 5 characters (min 200); paste the complete rules text under "
                         "«### Normas de r/gamedev» in «## Reddit» of ficha.md; the pasted text ends at the next line "
                         "starting with «##», so paste headings as plain lines without «#», and the «Subreddit:» fields go "
                         "before the first «###» block")

    def test_un_titulo_dentro_del_pegado_corta_el_bloque(self):
        self.normas("corto\n#### Regla 2\n" + NORMAS)
        self.assertFallo("has 5 characters (min 200)")
        self.normas(NORMAS + "\n## Otra cosa\n\ntexto")
        self.assertEqual(self.fallos(), "")

    def test_los_campos_despues_de_un_bloque_no_se_ven(self):
        self.cambiar("ficha.md", "- **Normas leídas:** " + HOY.isoformat() + "\n", "")
        self.cambiar("ficha.md", "## Imágenes", "- **Normas leídas:** " + HOY.isoformat() + "\n\n## Imágenes")
        self.assertFallo("reddit.md needs «Normas leídas:» in ficha.md; put the field before the first «###» block of "
                         "«## Reddit», paste the subreddit rules and write the «Normas leídas:» line")

    def test_sin_reddit_no_se_piden_bloques(self):
        self.cambiar("ficha.md", "- reddit\n", "")
        (self.carpeta / "reddit.md").unlink()
        self.cambiar("ficha.md", "### Normas de r/gamedev", "### Notas")
        self.assertEqual(self.fallos(), "")


class CanalesExtra(Base):
    def extra(self, nombre="portal", texto=None):
        self.cambiar("ficha.md", "- discord\n", f"- discord\n- {nombre}\n")
        self.escribir(f"{nombre}.md", texto if texto is not None else "## es\n\nHola.\n\n## en\n\nHello.\n")

    def test_sin_opciones_pide_secciones_y_no_limita(self):
        self.extra(texto="## es\n\n" + "a" * 9000 + "\n")
        out = self.fallos()
        self.assertIn("portal.md: no «## en» section", out)
        self.assertNotIn("characters (max", out)

    def test_limite_por_seccion_de_idioma(self):
        self.extra(texto="## es\n\n" + "a" * 11 + "\n\n## en\n\n" + "b" * 10 + "\n")
        out = "\n".join(comprobar.comprobar(self.carpeta, self.reglas, limites={"portal": 10}))
        self.assertIn("portal.md (es): 11 characters (max 10, set with --limite portal=10); shorten it by 1", out)
        self.assertNotIn("portal.md (en)", out)

    def test_el_limite_no_cuenta_las_lineas_imagen(self):
        self.cambiar("ficha.md", "Release card | x |", "Release card | x, portal |")
        self.extra(texto="## es\n\n" + "a" * 10 + "\nImagen: medios/tarjeta.webp\n\n## en\n\nb\nImagen: medios/tarjeta.webp\n")
        self.assertEqual("\n".join(comprobar.comprobar(self.carpeta, self.reglas, limites={"portal": 10})), "")

    def test_el_limite_de_otro_canal_no_afecta(self):
        self.extra(texto="## es\n\n" + "a" * 50 + "\n\n## en\n\nb\n")
        self.assertEqual("\n".join(comprobar.comprobar(self.carpeta, self.reglas, limites={"otro": 10})), "")

    def test_formato_propio_exige_archivo_no_vacio_y_no_secciones(self):
        self.extra(texto='{"titulo": "Hola", "cuerpo": "Hello"}\n')
        self.assertEqual("\n".join(comprobar.comprobar(self.carpeta, self.reglas, propios=["portal"])), "")
        self.escribir("portal.md", "  \n")
        self.assertIn("portal.md: empty (channel set with --formato-propio); write the content the other system reads",
                      "\n".join(comprobar.comprobar(self.carpeta, self.reglas, propios=["portal"])))

    def test_formato_propio_con_archivo_ausente(self):
        self.extra()
        (self.carpeta / "portal.md").unlink()
        self.assertIn("portal.md: listed under «## Canales» but missing",
                      "\n".join(comprobar.comprobar(self.carpeta, self.reglas, propios=["portal"])))

    def test_formato_propio_sigue_buscando_huecos_y_jerga(self):
        self.extra(texto='{"t": "WIP: {{titulo}}"}\n')
        out = "\n".join(comprobar.comprobar(self.carpeta, self.reglas, propios=["portal"]))
        self.assertIn("portal.md: internal jargon «WIP:»", out)
        self.assertIn("portal.md: template gap «{{titulo}}»", out)

    def test_formato_propio_no_aporta_idiomas_deducidos(self):
        self.cambiar("ficha.md", "Idiomas: es, en\n", "")
        self.extra(texto='{"es": 1, "zz": 2}\n')
        out = "\n".join(comprobar.comprobar(self.carpeta, self.reglas, propios=["portal"]))
        self.assertIn('no languages: add "Idiomas: es, en" to ficha.md', out)

    def test_formato_propio_acepta_la_imagen_si_su_ruta_esta_en_el_texto(self):
        self.cambiar("ficha.md", "Release card | x |", "Release card | x, portal |")
        self.extra(texto='{"imagen": "medios/tarjeta.webp", "titulo": "Hola"}\n')
        self.assertEqual("\n".join(comprobar.comprobar(self.carpeta, self.reglas, propios=["portal"])), "")

    def test_formato_propio_sin_la_ruta_de_la_imagen_en_el_texto(self):
        self.cambiar("ficha.md", "Release card | x |", "Release card | x, portal |")
        self.extra(texto='{"titulo": "Hola"}\n')
        self.assertIn("ficha.md: «medios/tarjeta.webp» lists channel «portal» but portal.md does not contain the path "
                      "«medios/tarjeta.webp» (channel with its own format); write the path in the file or remove «portal» "
                      "from the Canales cell",
                      "\n".join(comprobar.comprobar(self.carpeta, self.reglas, propios=["portal"])))

    def test_formato_propio_mantiene_las_comprobaciones_de_la_imagen(self):
        self.cambiar("ficha.md", "\n\n## Uso interno", "\n| `medios/anim.gif` | es: a / en: b | portal |\n\n## Uso interno")
        (self.carpeta / "medios" / "anim.gif").write_bytes(gif(10, 10))
        self.extra(texto='{"imagen": "medios/anim.gif"}\n')
        self.assertIn("portal.md: «medios/anim.gif» is a .gif and portal takes .webp, .png, .jpg",
                      "\n".join(comprobar.comprobar(self.carpeta, self.reglas, propios=["portal"])))
        self.cambiar("ficha.md", "es: a / en: b | portal", "es: a | portal")
        self.assertIn("«medios/anim.gif» has no alt text in «en»",
                      "\n".join(comprobar.comprobar(self.carpeta, self.reglas, propios=["portal"])))

    def test_opciones_de_canales_que_ninguna_pieza_declara_salen_con_dos(self):
        self.extra()
        for args, opcion in ((["--limite", "portl=5"], "--limite portl=5"), (["--formato-propio", "web"], "--formato-propio web")):
            with self.subTest(args):
                r = subprocess.run([sys.executable, str(AQUI / "comprobar.py"), *args, str(self.carpeta.parent)],
                                   capture_output=True, text=True)
                self.assertEqual(r.returncode, 2)
                self.assertIn(f"{opcion} names a channel that no checked piece declares in «## Canales» (declared: x, reddit, "
                              "linkedin, discord, portal); fix the channel name or drop the option", r.stdout)
        r = subprocess.run([sys.executable, str(AQUI / "comprobar.py"), "--limite", "portal=500", "--formato-propio", "portal",
                            str(self.carpeta)], capture_output=True, text=True)
        self.assertEqual(r.returncode, 2)
        self.assertIn("portal is in --limite and --formato-propio", r.stdout)
        r = subprocess.run([sys.executable, str(AQUI / "comprobar.py"), "--limite", "portal=500", str(self.carpeta)],
                           capture_output=True, text=True)
        self.assertEqual((r.returncode, r.stdout.strip()), (0, "OK"))

    def test_una_opcion_usada_por_una_sola_pieza_vale(self):
        self.extra()
        otra = self.carpeta.parent / "02-otra"
        shutil.copytree(self.carpeta, otra)
        self.cambiar("ficha.md", "- discord\n- portal\n", "- discord\n")
        (self.carpeta / "portal.md").unlink()
        r = subprocess.run([sys.executable, str(AQUI / "comprobar.py"), "--limite", "portal=500", str(self.carpeta.parent)],
                           capture_output=True, text=True)
        self.assertEqual(r.returncode, 0, r.stdout)

    def test_imagenes_de_un_canal_extra_webp_png_y_jpg(self):
        self.extra()
        for ext, datos in ((".png", png(100, 50)), (".jpg", jpeg(100, 50))):
            with self.subTest(ext):
                (self.carpeta / "medios" / f"otra{ext}").write_bytes(datos)
                self.cambiar("ficha.md", "\n\n## Uso interno", f"\n| `medios/otra{ext}` | es: a / en: b | portal |\n\n## Uso interno")
                self.escribir("portal.md", f"## es\n\nHola.\nImagen: medios/otra{ext}\n\n## en\n\nHello.\nImagen: medios/otra{ext}\n")
                self.assertEqual(self.fallos(), "")
                (self.carpeta / "medios" / f"otra{ext}").unlink()
                self.cambiar("ficha.md", f"\n| `medios/otra{ext}` | es: a / en: b | portal |", "")

    def test_un_webp_de_la_ficha_tambien_vale_en_un_canal_extra(self):
        self.cambiar("ficha.md", "Release card | x |", "Release card | x, portal |")
        self.extra(texto="## es\n\nHola.\nImagen: medios/tarjeta.webp\n\n## en\n\nHello.\nImagen: medios/tarjeta.webp\n")
        self.assertEqual(self.fallos(), "")

    def test_un_gif_no_vale_en_un_canal_extra(self):
        self.cambiar("ficha.md", "\n\n## Uso interno", "\n| `medios/anim.gif` | es: a / en: b | portal |\n\n## Uso interno")
        (self.carpeta / "medios" / "anim.gif").write_bytes(gif(10, 10))
        self.extra(texto="## es\n\nHola.\nImagen: medios/anim.gif\n\n## en\n\nHello.\nImagen: medios/anim.gif\n")
        self.assertFallo("portal.md: «medios/anim.gif» is a .gif and portal takes .webp, .png, .jpg; point to medios/<name>.webp")

    def test_nombres_de_canal_en_minusculas(self):
        for malo in ("Portal", "mi canal", "../x", "web_site", "x (principal)"):
            with self.subTest(malo):
                self.cambiar("ficha.md", "- discord\n", f"- discord\n- {malo}\n")
                self.assertFallo(f"ficha.md: channel «{malo}» under «## Canales» is not a valid name; use lowercase letters, "
                                 "digits and hyphens ([a-z0-9-]+), one channel per line")
                self.cambiar("ficha.md", f"- discord\n- {malo}\n", "- discord\n")

    def test_un_canal_con_guion_y_digitos_vale(self):
        self.extra("web-2", "## es\n\nHola.\n\n## en\n\nHello.\n")
        self.assertEqual(self.fallos(), "")

    def test_mayusculas_en_x_ya_no_se_perdonan(self):
        self.cambiar("ficha.md", "- x\n", "- X\n")
        self.assertFallo("ficha.md: channel «X» under «## Canales» is not a valid name")


class Opciones(unittest.TestCase):
    def test_limite_y_formato_propio_se_pueden_repetir(self):
        r = comprobar.leer_opciones(["--limite", "portal=500", "--limite=blog=900", "--formato-propio", "web",
                                     "--formato-propio=api", "--prefijos-tarea", "INS", "carpeta"])
        self.assertEqual(r, (["carpeta"], ["INS"], {"portal": 500, "blog": 900}, ["web", "api"], None))

    def test_opciones_mal_escritas(self):
        casos = (
            (["--limite", "portal", "c"], "--limite needs channel=N with a lowercase channel name and N >= 1"),
            (["--limite", "portal=0", "c"], "--limite needs channel=N"),
            (["--limite", "portal=diez", "c"], "--limite needs channel=N"),
            (["--limite", "Portal=5", "c"], "--limite needs channel=N"),
            (["--limite"], "--limite needs channel=N"),
            (["--limite", "x=100", "c"], "--limite is for extra channels; the limit of x is in reglas.json"),
            (["--formato-propio", "linkedin", "c"], "--formato-propio is for extra channels; linkedin has its own checks"),
            (["--formato-propio", "Web", "c"], "--formato-propio needs a lowercase channel name"),
            (["--formato-propio"], "--formato-propio needs a lowercase channel name"),
            (["--limite", "web=5", "--formato-propio", "web", "c"], "web is in --limite and --formato-propio"),
            (["--otra", "c"], "unknown option --otra"),
            (["--prefijos-tarea", "A", "--prefijos-tarea", "", "c"], "--prefijos-tarea needs prefixes"),
            (["--prefijos-tarea", "A", "--prefijos-tarea", " , ", "c"], "--prefijos-tarea needs prefixes"),
            (["--prefijos-tarea=", "c"], "--prefijos-tarea needs prefixes"),
        )
        for args, motivo in casos:
            with self.subTest(args=args):
                self.assertIn(motivo, comprobar.leer_opciones(args)[4])

    def correr(self, *args):
        return subprocess.run([sys.executable, str(AQUI / "comprobar.py"), *args], capture_output=True, text=True)

    def test_cli_con_opciones_mal_escritas_sale_con_dos_y_dice_el_uso(self):
        r = self.correr("--limite", "x=100", "carpeta")
        self.assertEqual(r.returncode, 2)
        self.assertIn("--limite is for extra channels; the limit of x is in reglas.json. usage: comprobar.py", r.stdout)

    def test_cli_limite_y_formato_propio_sobre_una_pieza(self):
        tmp = Path(tempfile.mkdtemp())
        self.addCleanup(shutil.rmtree, tmp)
        carpeta = tmp / "2026-10-25" / "01-pieza"
        carpeta.mkdir(parents=True)
        (carpeta / "medios").mkdir()
        (carpeta / "ficha.md").write_text("Idiomas: es, en\n\n## Canales\n\n- portal\n- web\n\n## Imágenes\n\n"
                                          "| Imagen | Texto alternativo | Canales |\n|---|---|---|\n\n## Publicado\n", encoding="utf-8")
        (carpeta / "portal.md").write_text("## es\n\n" + "a" * 30 + "\n\n## en\n\nb\n", encoding="utf-8")
        (carpeta / "web.md").write_text('{"a": 1}\n', encoding="utf-8")
        r = self.correr("--limite", "portal=20", "--formato-propio", "web", str(carpeta))
        self.assertEqual(r.returncode, 1)
        self.assertIn("portal.md (es): 30 characters (max 20, set with --limite portal=20); shorten it by 10", r.stdout)
        self.assertNotIn("web.md", r.stdout)
        r = self.correr("--limite", "portal=30", "--formato-propio", "web", str(carpeta))
        self.assertEqual((r.returncode, r.stdout.strip()), (0, "OK"))
        r = self.correr(str(carpeta))
        self.assertIn("web.md: no «## es» section", r.stdout)


class Lectura(Base):
    def test_utf8_invalido_en_la_ficha_es_un_error_limpio(self):
        (self.carpeta / "ficha.md").write_bytes(b"Idiomas: es\n\xff\xfe")
        self.assertEqual(comprobar.comprobar(self.carpeta, self.reglas), ["ficha.md: not valid UTF-8 text; open it in an editor and save it as UTF-8"])

    def test_utf8_invalido_en_un_canal_no_tapa_el_resto(self):
        (self.carpeta / "x.md").write_bytes(b"## es\n\xe9\n")
        self.cambiar("linkedin.md", "Texto largo.", "WIP: x")
        out = self.fallos()
        self.assertIn("x.md: not valid UTF-8 text; open it in an editor and save it as UTF-8", out)
        self.assertIn("linkedin.md: internal jargon «WIP:»", out)
        self.assertNotIn("x.md: listed under", out)

    def test_la_cli_con_utf8_invalido_no_da_traceback(self):
        (self.carpeta / "discord.md").write_bytes(b"\x80\x81")
        r = subprocess.run([sys.executable, str(AQUI / "comprobar.py"), str(self.carpeta)], capture_output=True, text=True)
        self.assertEqual(r.returncode, 1)
        self.assertIn("discord.md: not valid UTF-8 text", r.stdout)
        self.assertNotIn("Traceback", r.stdout + r.stderr)

    def test_un_bom_al_principio_no_rompe_las_secciones(self):
        t = (self.carpeta / "linkedin.md").read_text(encoding="utf-8")
        (self.carpeta / "linkedin.md").write_bytes(b"\xef\xbb\xbf" + t.encode("utf-8"))
        self.assertEqual(self.fallos(), "")


class PiezasMalNombradas(Base):
    def test_una_carpeta_mal_nombrada_sin_ficha_se_comprueba_y_se_avisa(self):
        mala = self.carpeta.parent / "mi-pieza"
        mala.mkdir()
        (mala / "x.md").write_text("## es\n\nHola\n", encoding="utf-8")
        self.assertEqual([p.name for p in comprobar.piezas(self.carpeta.parent)], ["01-lanzamiento", "mi-pieza"])
        out = "\n".join(comprobar.comprobar(mala, self.reglas))
        self.assertIn("folder name: expected <dir>/AAAA-MM-DD/NN-<tema>", out)
        self.assertIn("no ficha.md", out)

    def test_la_cli_la_cuenta_como_fallo(self):
        mala = self.tmp / "2026-10-25" / "sin-numero"
        (mala / "medios").mkdir(parents=True)
        r = subprocess.run([sys.executable, str(AQUI / "comprobar.py"), str(self.tmp)], capture_output=True, text=True)
        self.assertEqual(r.returncode, 1)
        self.assertIn(f"{mala}: folder name: expected", r.stdout)
        self.assertIn(f"{mala}: no ficha.md", r.stdout)

    def test_las_carpetas_que_no_son_piezas_no_se_tocan(self):
        (self.tmp / "propuestas").mkdir()
        (self.tmp / "propuestas" / "2026-10-25.md").write_text("# Propuestas\n", encoding="utf-8")
        notas = self.carpeta.parent / "notas"
        notas.mkdir()
        (notas / "a.txt").write_text("x", encoding="utf-8")
        self.assertEqual([p.name for p in comprobar.piezas(self.tmp)], ["01-lanzamiento"])

    def test_una_carpeta_mal_nombrada_con_solo_un_canal_extra_se_comprueba(self):
        mala = self.carpeta.parent / "web"
        mala.mkdir()
        (mala / "web.md").write_text('{"a": 1}\n', encoding="utf-8")
        self.assertEqual([p.name for p in comprobar.piezas(self.tmp)], ["01-lanzamiento", "web"])
        r = subprocess.run([sys.executable, str(AQUI / "comprobar.py"), str(self.tmp)], capture_output=True, text=True)
        self.assertEqual(r.returncode, 1)
        self.assertIn(f"{mala}: folder name: expected <dir>/AAAA-MM-DD/NN-<tema>", r.stdout)
        self.assertIn(f"{mala}: no ficha.md", r.stdout)

    def test_propuestas_en_la_raiz_no_es_una_pieza_aunque_tenga_md(self):
        (self.tmp / "propuestas").mkdir()
        (self.tmp / "propuestas" / "web.md").write_text("# Propuestas\n", encoding="utf-8")
        self.assertEqual([p.name for p in comprobar.piezas(self.tmp)], ["01-lanzamiento"])


if __name__ == "__main__":
    unittest.main()
