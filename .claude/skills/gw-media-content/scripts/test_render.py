"""Tests of render.mjs and of the piece template (plantilla/). render.mjs is run with node as a child process: its
arguments and sizes through `--plan` (no Playwright, no ImageMagick), its fail-closed messages with a folder where
Playwright or ImageMagick are missing, its output names with a stub Playwright and a stub `magick`, and, when
Playwright, Chromium and ImageMagick are installed, with the real ones. The template is checked against
comprobar.py. Run: python3 -m unittest discover -s skills/gw-media-content/scripts"""
import json
import os
import re
import shutil
import stat
import struct
import subprocess
import sys
import tempfile
import unittest
from datetime import date
import zlib
from pathlib import Path

AQUI = Path(__file__).resolve().parent
sys.path.insert(0, str(AQUI))
import comprobar  # noqa: E402

RENDER = AQUI / "render.mjs"
PLANTILLA = AQUI.parent / "plantilla"
NODE = shutil.which("node")
SIN_NODE = "node is not installed; render.mjs is run with node (install it from nodejs.org)"


def webp(ancho=100, alto=50):
    """The same minimal WebP header that test_comprobar.py builds: enough for the size check."""
    cuerpo = b"WEBPVP8X" + (10).to_bytes(4, "little") + bytes(4) + (ancho - 1).to_bytes(3, "little") + (alto - 1).to_bytes(3, "little")
    return b"RIFF" + len(cuerpo).to_bytes(4, "little") + cuerpo


def png_valido(ancho=8, alto=8):
    def trozo(tipo, datos):
        return struct.pack(">I", len(datos)) + tipo + datos + struct.pack(">I", zlib.crc32(tipo + datos))
    filas = b"".join(b"\x00" + b"\x40\x80\xc0" * ancho for _ in range(alto))
    return (b"\x89PNG\r\n\x1a\n" + trozo(b"IHDR", struct.pack(">IIBBBBB", ancho, alto, 8, 2, 0, 0, 0))
            + trozo(b"IDAT", zlib.compress(filas)) + trozo(b"IEND", b""))


def ejecutable(ruta: Path, texto: str):
    ruta.write_text(texto, encoding="utf-8")
    ruta.chmod(ruta.stat().st_mode | stat.S_IXUSR)


# A `magick` that says it knows WebP and creates its last argument (the output), logging its arguments.
MAGICK = """#!/bin/sh
if [ "$1" = "-list" ]; then echo "WEBP  rw"; exit 0; fi
echo "$@" >> "$MAGICK_LOG"
for last; do :; done
# the stub only creates the output (the tests run with an empty PATH, so no cp or cat)
: > "$last"
"""
# A Playwright with just what render.mjs calls. The environment makes it misbehave: GW_STUB_BROKEN lists broken images,
# GW_STUB_OVERFLOW overflows, GW_STUB_GAPS leaves {{ in the text, GW_STUB_PAGEERROR throws in the page, GW_STUB_REQFAIL
# fails a request and GW_STUB_PDFPAGES sets the pages of the PDF. The page evaluates three times: images, gaps, overflow.
PLAYWRIGHT = """
const fs = require('fs');
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
const registrar = (obj) => fs.appendFileSync(process.env.GW_STUB_LOG, JSON.stringify(obj) + '\\n');
exports.chromium = { launch: async () => {
  if (process.env.GW_STUB_NO_CHROMIUM) throw new Error('Executable does not exist at /nowhere\\nsecond line');
  return { close: async () => {}, newContext: async (opciones) => {
    const contexto = {
      route: async (patron, manejador) => {
        let abortada = false;
        await manejador({ abort: async () => { abortada = true; } });
        registrar({ route: patron.source, flags: patron.flags, http: patron.test('http://a.b/c'), https: patron.test('https://a.b/c'), file: patron.test('file:///a'), abortada });
      },
      close: async () => {},
      newPage: async () => {
        let llamadas = 0;
        const manejadores = {};
        return {
          on: (evento, f) => { manejadores[evento] = f; },
          goto: async () => {
            if (process.env.GW_STUB_PAGEERROR) manejadores.pageerror(new Error(process.env.GW_STUB_PAGEERROR + '\\n    at x'));
            if (process.env.GW_STUB_REQFAIL) manejadores.requestfailed({ url: () => process.env.GW_STUB_REQFAIL });
          },
          evaluate: async () => {
            const n = ++llamadas;
            if (n === 1) return process.env.GW_STUB_BROKEN ? ['rota.png'] : [];
            if (n === 2) return !!process.env.GW_STUB_GAPS;
            return process.env.GW_STUB_OVERFLOW ? ['div.ventana has more content than room (9x9 in 1x1)'] : [];
          },
          screenshot: async ({ path, clip }) => {
            fs.writeFileSync(path, png);
            registrar({ clip, viewport: opciones.viewport, scale: opciones.deviceScaleFactor });
          },
          pdf: async (o) => {
            registrar({ pdf: o });
            const n = Number(process.env.GW_STUB_PDFPAGES ?? process.env.GW_STUB_SLIDES ?? 3);
            fs.writeFileSync(o.path, '%PDF-1.4 ' + o.width + 'x' + o.height + '\\n' + '<</Type /Page /Parent 1 0 R>>\\n'.repeat(n) + '<</Type /Pages /Count ' + n + '>>');
          },
          locator: () => ({ count: async () => Number(process.env.GW_STUB_SLIDES ?? 3) }),
        };
      },
    };
    return contexto;
  } };
} };
"""


class Base(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp()).resolve()
        self.addCleanup(shutil.rmtree, self.tmp)
        self.fecha = self.tmp / "2026-10-25"
        self.pieza = self.fecha / "01-prueba"
        (self.pieza / "medios" / "fuente").mkdir(parents=True)
        self.vacio = self.tmp / "vacio"
        self.vacio.mkdir()

    def fuente(self, nombre, texto="<p>ok</p>", pieza=None):
        ruta = (pieza or self.pieza) / "medios" / "fuente" / nombre
        ruta.write_text(texto, encoding="utf-8") if isinstance(texto, str) else ruta.write_bytes(texto)

    def render(self, *args, cwd=None, env=None, path=None):
        """Runs render.mjs; PATH holds only `path` (an empty folder by default) and HOME is the tempdir, so what the
        run finds is what the test put there."""
        e = {"PATH": str(path or self.vacio), "HOME": str(self.tmp), "MAGICK_LOG": str(self.tmp / "magick.log"),
             "GW_STUB_LOG": str(self.tmp / "stub.log")}
        e.update(env or {})
        return subprocess.run([NODE, str(RENDER), *map(str, args)], capture_output=True, text=True, cwd=cwd or self.tmp, env=e)

    def plan(self, *args):
        r = self.render("--plan", *args)
        self.assertEqual(r.returncode, 0, r.stderr)
        return json.loads(r.stdout)

    def falso_playwright(self):
        carpeta = self.tmp / "node_modules" / "playwright"
        carpeta.mkdir(parents=True)
        (carpeta / "package.json").write_text('{"name": "playwright", "main": "index.js"}')
        (carpeta / "index.js").write_text(PLAYWRIGHT)

    def falso_magick(self):
        bin_ = self.tmp / "bin"
        bin_.mkdir()
        ejecutable(bin_ / "magick", MAGICK)
        return bin_


@unittest.skipUnless(NODE, SIN_NODE)
class Argumentos(Base):
    def test_sin_argumentos_es_un_error_de_uso(self):
        r = self.render()
        self.assertEqual(r.returncode, 2)
        self.assertIn("usage: node render.mjs", r.stderr)

    def test_se_ejecuta_tambien_por_un_enlace_simbolico(self):
        # npx and node_modules/.bin run the script through a link: the main guard has to resolve it
        enlace = self.tmp / "render-enlace.mjs"
        os.symlink(RENDER, enlace)
        r = subprocess.run([NODE, str(enlace)], capture_output=True, text=True, cwd=self.tmp, env={"PATH": str(self.vacio)})
        self.assertEqual(r.returncode, 2, "through a symlink the script did nothing")
        self.assertIn("usage: node render.mjs", r.stderr)

    def test_ayuda(self):
        r = self.render("--help")
        self.assertEqual((r.returncode, "usage: node render.mjs" in r.stdout), (0, True))

    def test_opcion_desconocida(self):
        r = self.render("--rapido", self.pieza)
        self.assertEqual(r.returncode, 2)
        self.assertIn("unknown option --rapido", r.stderr)

    def test_carpeta_que_no_existe(self):
        r = self.render("--plan", self.tmp / "nada")
        self.assertEqual(r.returncode, 1)
        self.assertIn("is not a folder", r.stderr)

    def test_carpeta_sin_fuentes(self):
        r = self.render("--plan", self.vacio)
        self.assertEqual(r.returncode, 1)
        self.assertIn("no medios/fuente/", r.stderr)

    def test_fuente_vacia(self):
        r = self.render("--plan", self.pieza)
        self.assertEqual(r.returncode, 1)
        self.assertIn("no source (.html, .svg, .png or .jpg)", r.stderr)

    def test_tamano_por_defecto_y_salidas(self):
        self.fuente("tarjeta.html")
        (f,) = self.plan(self.pieza)[0]["fuentes"]
        self.assertEqual((f["fuente"], f["tipo"], f["tamano"]), ("tarjeta.html", "pagina", {"width": 1200, "height": 675}))
        self.assertEqual([Path(s).name for s in f["salidas"]], ["tarjeta.webp", "tarjeta-mini.webp", "tarjeta.png"])

    def test_tamano_de_la_etiqueta_gw_size(self):
        self.fuente("a.html", '<meta charset="utf-8">\n<meta name="gw-size" content="1080x1350">')
        self.assertEqual(self.plan(self.pieza)[0]["fuentes"][0]["tamano"], {"width": 1080, "height": 1350})

    def test_tamano_con_los_atributos_al_reves_mayusculas_y_signo_por(self):
        for fuente in ('<meta content="1080x1350" name="gw-size">', "<META NAME='GW-SIZE' CONTENT='1080X1350'>",
                       '<meta name="gw-size" content="1080 \u00d7 1350">', "<meta name=gw-size content=1080x1350>",
                       '<meta\n  name="gw-size"\n  content="1080 x 1350"\n>'):
            with self.subTest(fuente=fuente):
                self.fuente("a.html", fuente)
                self.assertEqual(self.plan(self.pieza)[0]["fuentes"][0]["tamano"], {"width": 1080, "height": 1350})

    def test_una_etiqueta_gw_size_comentada_no_cuenta(self):
        self.fuente("a.html", '<!-- <meta name="gw-size" content="50x50"> -->\n<meta name="gw-size" content="1080x1350">')
        self.assertEqual(self.plan(self.pieza)[0]["fuentes"][0]["tamano"], {"width": 1080, "height": 1350})
        self.fuente("a.html", '<!-- <meta name="gw-size" content="1080x1350"> -->')
        self.assertEqual(self.plan(self.pieza)[0]["fuentes"][0]["tamano"], {"width": 1200, "height": 675})

    def test_un_gw_size_que_no_se_entiende_falla(self):
        for fuente in ('<meta name="gw-size" content="grande">', '<meta name="gw-size" content="1080">', '<meta name="gw-size">',
                       '<meta name="gw-size" content="1080x">', "<!-- gw-size: ancho por alto -->"):
            with self.subTest(fuente=fuente):
                self.fuente("a.html", fuente)
                r = self.render("--plan", self.pieza)
                self.assertEqual(r.returncode, 1)
                self.assertIn("cannot be read as WIDTHxHEIGHT", r.stderr)
                self.assertIn('<meta name="gw-size" content="1200x675">', r.stderr)  # the fix

    def test_tamano_de_un_svg_en_un_comentario(self):
        self.fuente("logo.svg", "<!-- gw-size: 800x400 --><svg xmlns='http://www.w3.org/2000/svg'/>")
        self.assertEqual(self.plan(self.pieza)[0]["fuentes"][0]["tamano"], {"width": 800, "height": 400})

    def test_tamano_fuera_de_rango(self):
        self.fuente("a.html", '<meta name="gw-size" content="50x50">')
        r = self.render("--plan", self.pieza)
        self.assertEqual(r.returncode, 1)
        self.assertIn("gw-size 50x50 is out of range", r.stderr)

    def test_el_carrusel_sale_en_pdf(self):
        self.fuente("carrusel-version.html", '<meta name="gw-size" content="1080x1350">')
        (f,) = self.plan(self.pieza)[0]["fuentes"]
        self.assertEqual((f["tipo"], [Path(s).name for s in f["salidas"]]), ("pdf", ["carrusel-version.pdf"]))

    def test_una_captura_sale_en_webp_y_png(self):
        self.fuente("pantalla.jpg", b"\xff\xd8\xff")
        (f,) = self.plan(self.pieza)[0]["fuentes"]
        self.assertEqual((f["tipo"], f["tamano"], len(f["salidas"])), ("captura", None, 3))

    def test_otros_archivos_no_son_fuentes(self):
        self.fuente("tarjeta.html")
        self.fuente("notas.txt", "x")
        self.assertEqual([f["fuente"] for f in self.plan(self.pieza)[0]["fuentes"]], ["tarjeta.html"])

    def test_dos_fuentes_con_el_mismo_nombre(self):
        self.fuente("a.html")
        self.fuente("a.png", b"x")
        r = self.render("--plan", self.pieza)
        self.assertEqual(r.returncode, 1)
        self.assertIn("would both give medios/a.*", r.stderr)

    def test_pedir_una_fuente(self):
        self.fuente("a.html")
        self.fuente("b.html")
        self.assertEqual([f["fuente"] for f in self.plan(self.pieza, "medios/fuente/b.html")[0]["fuentes"]], ["b.html"])

    def test_pedir_una_fuente_que_no_existe(self):
        self.fuente("a.html")
        r = self.render("--plan", self.pieza, "z.html")
        self.assertEqual(r.returncode, 1)
        self.assertIn("z.html is not a source", r.stderr)

    def test_la_carpeta_de_fecha_expande_a_sus_piezas(self):
        otra = self.fecha / "02-otra"
        (otra / "medios" / "fuente").mkdir(parents=True)
        self.fuente("a.html")
        self.fuente("b.html", pieza=otra)
        (self.fecha / "03-sin-medios").mkdir()
        self.assertEqual([Path(p["pieza"]).name for p in self.plan(self.fecha)], ["01-prueba", "02-otra"])


@unittest.skipUnless(NODE, SIN_NODE)
class FallaCerrado(Base):
    def test_sin_playwright(self):
        self.fuente("tarjeta.html")
        r = self.render(self.pieza, path=self.falso_magick())
        self.assertEqual(r.returncode, 1)
        self.assertIn("Playwright not found", r.stderr)
        self.assertIn("npm i -D playwright && npx playwright install chromium", r.stderr)
        self.assertFalse((self.pieza / "medios" / "tarjeta.webp").exists())

    def test_playwright_se_busca_tambien_en_gw_playwright_dir(self):
        self.fuente("tarjeta.html")
        otro = self.tmp / "otro"
        (otro / "node_modules" / "playwright").mkdir(parents=True)
        (otro / "node_modules" / "playwright" / "package.json").write_text('{"name": "playwright", "main": "index.js"}')
        (otro / "node_modules" / "playwright" / "index.js").write_text(PLAYWRIGHT)
        r = self.render(self.pieza, path=self.falso_magick(), env={"GW_PLAYWRIGHT_DIR": str(otro)})
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertTrue((self.pieza / "medios" / "tarjeta.webp").is_file())

    def test_sin_imagemagick(self):
        self.fuente("tarjeta.html")
        self.falso_playwright()
        r = self.render(self.pieza)
        self.assertEqual(r.returncode, 1)
        self.assertIn("ImageMagick with WebP support not found", r.stderr)
        self.assertIn("apt install imagemagick webp", r.stderr)
        self.assertIn("brew install imagemagick webp", r.stderr)

    def test_imagemagick_sin_webp(self):
        self.fuente("tarjeta.html")
        self.falso_playwright()
        bin_ = self.tmp / "bin"
        bin_.mkdir()
        ejecutable(bin_ / "magick", '#!/bin/sh\necho "PNG  rw"\n')
        r = self.render(self.pieza, path=bin_)
        self.assertEqual(r.returncode, 1)
        self.assertIn("ImageMagick with WebP support not found", r.stderr)

    def test_un_carrusel_solo_necesita_playwright(self):
        self.fuente("carrusel.html")
        self.falso_playwright()
        r = self.render(self.pieza)
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertTrue((self.pieza / "medios" / "carrusel.pdf").is_file())

    def test_una_captura_solo_necesita_imagemagick(self):
        self.fuente("pantalla.png", b"png")
        r = self.render(self.pieza, path=self.falso_magick())
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertEqual(sorted(p.name for p in (self.pieza / "medios").glob("*.*")), ["pantalla-mini.webp", "pantalla.png", "pantalla.webp"])

    def test_chromium_sin_instalar(self):
        self.fuente("tarjeta.html")
        self.falso_playwright()
        r = self.render(self.pieza, path=self.falso_magick(), env={"GW_STUB_NO_CHROMIUM": "1"})
        self.assertEqual(r.returncode, 1)
        self.assertIn("cannot start Chromium (Executable does not exist at /nowhere)", r.stderr)
        self.assertIn("npx playwright install chromium", r.stderr)


@unittest.skipUnless(NODE, SIN_NODE)
class ConPlaywrightFalso(Base):
    """Output names, sizes and error handling with a stub Playwright and a stub magick."""

    def setUp(self):
        super().setUp()
        self.falso_playwright()
        self.bin = self.falso_magick()

    def test_una_pagina_da_webp_mini_y_png(self):
        self.fuente("tarjeta.html", '<meta name="gw-size" content="1200x675">')
        r = self.render(self.pieza, path=self.bin)
        self.assertEqual(r.returncode, 0, r.stderr)
        medios = self.pieza / "medios"
        for n in ("tarjeta.webp", "tarjeta-mini.webp", "tarjeta.png"):
            self.assertTrue((medios / n).is_file(), n)
        log = (self.tmp / "magick.log").read_text().splitlines()
        self.assertEqual([("-resize 1600x>" in l, "-resize 720x>" in l, "-quality" in l) for l in log],
                         [(True, False, True), (False, True, True), (True, False, False)])

    def test_el_tamano_de_la_etiqueta_llega_a_la_captura(self):
        self.fuente("a.html", '<meta name="gw-size" content="1000x500">')
        r = self.render(self.pieza, path=self.bin)
        self.assertEqual(r.returncode, 0, r.stderr)
        (visto,) = [json.loads(l) for l in (self.tmp / "stub.log").read_text().splitlines() if '"clip"' in l]
        tam = {"width": 1000, "height": 500}
        self.assertEqual((visto["viewport"], visto["clip"], visto["scale"]), (tam, {"x": 0, "y": 0, **tam}, 1))

    def test_el_carrusel_da_un_pdf_a_su_tamano(self):
        self.fuente("carrusel.html", '<meta name="gw-size" content="1080x1350">')
        r = self.render(self.pieza, path=self.bin)
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertTrue((self.pieza / "medios" / "carrusel.pdf").read_text().startswith("%PDF-1.4 1080pxx1350px"))
        self.assertIn("(3 pages", r.stdout)
        self.assertFalse((self.pieza / "medios" / "carrusel.webp").exists())

    def test_el_pdf_toma_el_tamano_de_gw_size_y_no_el_de_la_hoja_de_estilo(self):
        self.fuente("carrusel.html", '<meta name="gw-size" content="1080x1350"><style>@page { size: 500px 500px }</style>')
        r = self.render(self.pieza, path=self.bin)
        self.assertEqual(r.returncode, 0, r.stderr)
        (opciones,) = [json.loads(l)["pdf"] for l in (self.tmp / "stub.log").read_text().splitlines() if '"pdf"' in l]
        self.assertEqual((opciones["width"], opciones["height"]), ("1080px", "1350px"))
        self.assertNotIn("preferCSSPageSize", opciones)

    def test_un_pdf_con_mas_paginas_que_slides_falla_y_no_deja_salida(self):
        self.fuente("carrusel.html")
        r = self.render(self.pieza, path=self.bin, env={"GW_STUB_SLIDES": "3", "GW_STUB_PDFPAGES": "5"})
        self.assertEqual(r.returncode, 1)
        self.assertIn("the PDF has 5 page(s) and the carousel 3 slide(s)", r.stderr)
        self.assertFalse((self.pieza / "medios" / "carrusel.pdf").exists())

    def test_un_carrusel_sin_slides_falla(self):
        self.fuente("carrusel.html")
        r = self.render(self.pieza, path=self.bin, env={"GW_STUB_SLIDES": "0"})
        self.assertEqual(r.returncode, 1)
        self.assertIn('no <section class="slide">', r.stderr)

    def test_una_imagen_rota_falla_y_no_deja_salida(self):
        self.fuente("a.html")
        r = self.render(self.pieza, path=self.bin, env={"GW_STUB_BROKEN": "1"})
        self.assertEqual(r.returncode, 1)
        self.assertIn("image(s) that do not load: rota.png", r.stderr)
        self.assertFalse((self.pieza / "medios" / "a.webp").exists())

    def test_el_contenido_que_desborda_falla(self):
        self.fuente("a.html")
        r = self.render(self.pieza, path=self.bin, env={"GW_STUB_OVERFLOW": "1"})
        self.assertEqual(r.returncode, 1)
        self.assertIn("the content overflows 1200x675 (div.ventana has more content than room (9x9 in 1x1))", r.stderr)

    def test_un_error_de_la_pagina_falla(self):
        self.fuente("a.html")
        r = self.render(self.pieza, path=self.bin, env={"GW_STUB_PAGEERROR": "boom is not defined"})
        self.assertEqual(r.returncode, 1)
        self.assertIn("a.html: the page's script fails: boom is not defined; fix the script in the source", r.stderr)
        self.assertNotIn("at x", r.stderr)
        self.assertFalse((self.pieza / "medios" / "a.webp").exists())

    def test_un_hueco_sin_rellenar_falla(self):
        self.fuente("a.html")
        r = self.render(self.pieza, path=self.bin, env={"GW_STUB_GAPS": "1"})
        self.assertEqual(r.returncode, 1)
        self.assertIn("fill the gaps in a.html", r.stderr)
        self.assertFalse((self.pieza / "medios" / "a.webp").exists())

    def test_la_red_va_bloqueada(self):
        self.fuente("a.html")
        r = self.render(self.pieza, path=self.bin)
        self.assertEqual(r.returncode, 0, r.stderr)
        (ruta,) = [json.loads(l) for l in (self.tmp / "stub.log").read_text().splitlines() if '"route"' in l]
        self.assertEqual((ruta["http"], ruta["https"], ruta["file"], ruta["abortada"]), (True, True, False, True))

    def test_una_peticion_que_falla_es_un_recurso_que_no_carga(self):
        self.fuente("a.html")
        r = self.render(self.pieza, path=self.bin, env={"GW_STUB_REQFAIL": "https://example.com/a.css"})
        self.assertEqual(r.returncode, 1)
        self.assertIn("resource(s) that do not load: https://example.com/a.css", r.stderr)
        self.assertIn("the network is blocked", r.stderr)
        self.assertFalse((self.pieza / "medios" / "a.webp").exists())

    def test_un_fallo_no_impide_renderizar_el_resto(self):
        self.fuente("a.html")
        self.fuente("pantalla.png", b"png")
        r = self.render(self.pieza, path=self.bin, env={"GW_STUB_OVERFLOW": "1"})
        self.assertEqual(r.returncode, 1)
        self.assertTrue((self.pieza / "medios" / "pantalla.webp").is_file())

    def test_la_carpeta_de_fecha_renderiza_cada_pieza(self):
        otra = self.fecha / "02-otra"
        (otra / "medios" / "fuente").mkdir(parents=True)
        self.fuente("a.html")
        self.fuente("b.html", pieza=otra)
        r = self.render(self.fecha, path=self.bin)
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertTrue((self.pieza / "medios" / "a.webp").is_file())
        self.assertTrue((otra / "medios" / "b.webp").is_file())


def hay_render_real():
    """(True, '') when Playwright and ImageMagick with WebP are installed; otherwise (False, reason)."""
    if not NODE:
        return False, SIN_NODE
    dir_pw = os.environ.get("GW_PLAYWRIGHT_DIR")
    ok = subprocess.run([NODE, "-e", "require(require.resolve('playwright', {paths: [process.cwd(), process.env.GW_PLAYWRIGHT_DIR || '.']}))"],
                        capture_output=True, cwd=dir_pw or os.getcwd())
    if ok.returncode:
        return False, "Playwright is not installed (npm i -D playwright && npx playwright install chromium); the real render needs it"
    for orden in ("magick", "convert"):
        if shutil.which(orden):
            try:
                if "WEBP" in subprocess.run([orden, "-list", "format"], capture_output=True, text=True).stdout:
                    return True, ""
            except OSError:
                pass
    return False, "ImageMagick with WebP support is not installed; the real render needs it"


# What would reach the network: a src, href, poster or srcset with http(s):// or protocol-relative //, a CSS url() the
# same way, @import and <link>.
RED = re.compile(r"""(?ix)
    \b(?:src|href|poster|data|action)\s*=\s*["']?\s*(?:https?:)?//
  | \bsrcset\s*=\s*["'][^"']*?(?:https?:)?//
  | url\(\s*["']?\s*(?:https?:)?//
  | @import | <link\b""")


def rellenar(texto: str) -> str:
    """Fixture filler: the template's placeholders become valid text (a date for AAAA-MM-DD, a number for JSON)."""
    texto = texto.replace("AAAA-MM-DD", date.today().isoformat()).replace("<tema>", "prueba")
    texto = texto.replace("{{pega aquí las normas del subreddit, tal cual}}", "texto de prueba " * 15)
    texto = texto.replace("{{subreddit}}", "prueba")
    texto = texto.replace("{{número}}", "5").replace("{{antes.png}}", "antes.png").replace("{{despues.png}}", "despues.png")
    return re.sub(r"\{\{[^}]*\}\}", "texto de prueba", texto)


class Plantilla(Base):
    def copiar(self):
        destino = self.tmp / "difusion" / "2026-10-25" / "01-prueba"
        shutil.copytree(PLANTILLA, destino)
        return destino

    def test_la_plantilla_tiene_todo(self):
        esperados = {"ficha.md", "x.md", "reddit.md", "linkedin.md", "discord.md"}
        self.assertEqual({p.name for p in PLANTILLA.glob("*.md")}, esperados)
        fuentes = {p.name for p in (PLANTILLA / "medios" / "fuente").glob("*.html")}
        self.assertEqual(fuentes, {"tarjeta.html", "diagrama.html", "metricas.html", "cita.html", "codigo.html", "antes-despues.html", "carrusel.html"})

    def test_cada_fuente_declara_su_tamano_y_es_autonoma(self):
        for f in (PLANTILLA / "medios" / "fuente").glob("*.html"):
            t = f.read_text(encoding="utf-8")
            m = re.search(r'<meta name="gw-size" content="(\d+)x(\d+)">', t)
            self.assertTrue(m, f"{f.name}: no gw-size")
            esperado = ("1080", "1350") if f.name.startswith("carrusel") else ("1200", "675")
            self.assertEqual(m.groups(), esperado, f.name)
            self.assertNotRegex(t, RED, f"{f.name}: needs the network")
            if f.name.startswith("carrusel"):
                self.assertNotRegex(t, r"@page[^}]*\bsize\b", f"{f.name}: the PDF page size is the gw-size, not an @page size")
            self.assertIn("--fondo:", t, f"{f.name}: palette variables")
            self.assertNotIn("{{", t.split("</head>")[0], f"{f.name}: a gap in the head (the comments must not hold braces)")

    def test_la_regex_de_red_ve_lo_que_sale_a_internet(self):
        for texto in ('<img src="https://x.com/a.png">', "<img src='//cdn.x.com/a.png'>", '<img srcset="a.png 1x, //x.com/b.png 2x">',
                      "div { background: url(//x.com/a.png) }", 'div { background: url( "http://x.com/a.png" ) }',
                      "@font-face { src: URL(https://x.com/f.woff2) }", '<a href = "http://x.com">', '<video poster="//x.com/p.png">',
                      "<style>@import 'a.css';</style>", '<link rel="stylesheet" href="a.css">'):
            with self.subTest(texto=texto):
                self.assertRegex(texto, RED)
        for texto in ('<svg xmlns="http://www.w3.org/2000/svg">', '<img src="a.png">', "div { background: url(a.png) }",
                      'div { background: url("data:image/png;base64,AAAA") }', '<img srcset="a.png 1x, b.png 2x">', "<a href=\"#x\">"):
            with self.subTest(texto=texto):
                self.assertNotRegex(texto, RED)

    def test_los_huecos_de_la_plantilla_en_bruto(self):
        pieza = self.copiar()
        problemas = comprobar.comprobar(pieza)
        con_hueco = {p.split(":")[0] for p in problemas if "template gap «" in p}
        self.assertEqual(con_hueco, {"ficha.md", "x.md", "reddit.md", "linkedin.md", "discord.md"})
        huecos_html = {p.split(":")[0].split("/")[-1] for p in problemas if "template gaps {{…}} left" in p}
        self.assertEqual(len(huecos_html), 7, problemas)
        # nothing else is wrong with the raw template: the rest is the renders that do not exist yet
        otros = [p for p in problemas if "template gap" not in p and "does not exist" not in p and "not rendered" not in p]
        # the date line is the same gap seen by the Reddit check
        otros = [p for p in otros if "«Normas leídas:» «AAAA-MM-DD»" not in p]
        self.assertEqual(otros, [])

    def test_la_plantilla_rellena_pasa_comprobar(self):
        pieza = self.copiar()
        medios = pieza / "medios"
        for f in list(pieza.glob("*.md")) + list((medios / "fuente").glob("*.html")):
            f.write_text(rellenar(f.read_text(encoding="utf-8")), encoding="utf-8")
        for f in (medios / "fuente").glob("*.html"):  # a user keeps only the sources the piece uses
            if f.name != "tarjeta.html":
                f.unlink()
        (medios / "tarjeta.webp").write_bytes(webp())
        (medios / "tarjeta-mini.webp").write_bytes(webp(10, 5))
        (medios / "tarjeta.png").write_bytes(png_valido(100, 50))
        self.assertEqual(comprobar.comprobar(pieza), [])

    def test_el_alt_de_la_plantilla_pide_los_dos_idiomas(self):
        pieza = self.copiar()
        (pieza / "ficha.md").write_text(rellenar((pieza / "ficha.md").read_text(encoding="utf-8")).replace("/ en: texto de prueba", "", 1), encoding="utf-8")
        self.assertIn("has no alt text in «en»", "\n".join(comprobar.comprobar(pieza)))


@unittest.skipUnless(*hay_render_real())
class RenderReal(Base):
    """Playwright's Chromium and ImageMagick for real. CI has neither (adding them costs Actions quota), so these run
    only where they are installed."""

    def pieza_real(self):
        pieza = self.tmp / "difusion" / "2026-10-25" / "01-prueba"
        shutil.copytree(PLANTILLA / "medios", pieza / "medios")
        for f in (pieza / "medios" / "fuente").glob("*.html"):
            t = rellenar(f.read_text(encoding="utf-8").replace("{{cifra}}", "42")).replace("texto de prueba</pre>", "const a = 1; // x</pre>")
            f.write_text(t, encoding="utf-8")
        for n in ("antes", "despues"):
            (pieza / "medios" / "fuente" / f"{n}.png").write_bytes(png_valido())
        return pieza

    def correr(self, pieza, *fuentes):
        r = subprocess.run([NODE, str(RENDER), str(pieza), *fuentes], capture_output=True, text=True, env=dict(os.environ),
                           cwd=os.environ.get("GW_PLAYWRIGHT_DIR") or os.getcwd())
        if "cannot start Chromium" in r.stderr:
            self.skipTest("Chromium is not installed (npx playwright install chromium); the real render needs it")
        return r

    def cambiar(self, pieza, fuente, viejo, nuevo):
        ruta = pieza / "medios" / "fuente" / fuente
        t = ruta.read_text(encoding="utf-8")
        self.assertIn(viejo, t)
        ruta.write_text(t.replace(viejo, nuevo, 1), encoding="utf-8")

    def debe_fallar(self, pieza, fuente, motivo):
        r = self.correr(pieza, fuente)
        self.assertEqual(r.returncode, 1, r.stdout + r.stderr)
        self.assertIn(motivo, r.stderr)
        self.assertFalse((pieza / "medios" / (Path(fuente).stem + ".webp")).exists(), "a failed render leaves no output")

    def fuente_suelta(self, html):
        pieza = self.tmp / "difusion" / "2026-10-25" / "01-prueba"
        (pieza / "medios" / "fuente").mkdir(parents=True)
        (pieza / "medios" / "fuente" / "x.html").write_text(html, encoding="utf-8")
        return pieza

    def test_las_plantillas_rellenas_se_renderizan(self):
        pieza = self.pieza_real()
        r = self.correr(pieza)
        self.assertEqual(r.returncode, 0, r.stderr)
        medios = pieza / "medios"
        for n in ("tarjeta", "diagrama", "metricas", "cita", "codigo", "antes-despues"):
            for sufijo in (".webp", "-mini.webp", ".png"):
                self.assertTrue((medios / f"{n}{sufijo}").is_file(), n + sufijo)
        self.assertEqual(comprobar.dimensiones(medios / "tarjeta.webp"), (1200, 675))
        self.assertEqual(comprobar.dimensiones(medios / "tarjeta-mini.webp")[0], 720)
        self.assertEqual(comprobar.dimensiones(medios / "tarjeta.png")[0], 1200)
        self.assertEqual(comprobar.paginas_pdf(medios / "carrusel.pdf"), 4)

    def test_un_titular_larguisimo_en_la_tarjeta_desborda(self):
        pieza = self.pieza_real()
        self.cambiar(pieza, "tarjeta.html", "<h1>texto de prueba</h1>", "<h1>" + "titular largo " * 40 + "</h1>")
        self.debe_fallar(pieza, "tarjeta.html", "tarjeta.html: the content overflows 1200x675")

    def test_una_linea_de_codigo_de_120_caracteres_desborda(self):
        pieza = self.pieza_real()
        self.cambiar(pieza, "codigo.html", "const a = 1; // x</pre>", "const resultado = " + "a + " * 28 + "1;</pre>")
        self.debe_fallar(pieza, "codigo.html", "div.ventana has more content than room")

    def test_demasiadas_lineas_de_codigo_desbordan(self):
        pieza = self.pieza_real()
        self.cambiar(pieza, "codigo.html", "const a = 1; // x</pre>", "\n".join(f"const a{i} = {i};" for i in range(14)) + "</pre>")
        self.debe_fallar(pieza, "codigo.html", "the content overflows 1200x675")

    def test_diez_lineas_de_codigo_caben(self):
        pieza = self.pieza_real()
        self.cambiar(pieza, "codigo.html", "const a = 1; // x</pre>", "\n".join(f"const a{i} = {i};" for i in range(10)) + "</pre>")
        r = self.correr(pieza, "codigo.html")
        self.assertEqual(r.returncode, 0, r.stderr)

    def test_una_imagen_rota_falla(self):
        pieza = self.pieza_real()
        (pieza / "medios" / "fuente" / "antes.png").unlink()
        self.debe_fallar(pieza, "antes-despues.html", "antes-despues.html: image(s) that do not load: antes.png")

    def test_un_elemento_en_el_relleno_del_cuerpo_desborda(self):
        # inside the page, so the document does not scroll, but outside the content box of the body
        pieza = self.fuente_suelta('<body style="margin:0;padding:60px;width:1200px;height:675px"><div style="margin-left:-40px;background:red">x</div>')
        self.debe_fallar(pieza, "x.html", "div leaves the content box of body")

    def test_un_texto_cortado_por_su_caja_desborda(self):
        pieza = self.fuente_suelta('<body style="margin:0"><div style="width:100px;height:24px;overflow:hidden;white-space:nowrap">'
                                   "un texto mucho mas largo que su caja</div>")
        self.debe_fallar(pieza, "x.html", "div has more content than room")

    def test_la_red_esta_bloqueada(self):
        pieza = self.fuente_suelta('<head><link rel="stylesheet" href="https://example.com/a.css"></head><body>hola</body>')
        self.debe_fallar(pieza, "x.html", "resource(s) that do not load: https://example.com/a.css")

    def test_un_error_del_script_falla(self):
        pieza = self.fuente_suelta("<body>hola<script>funcionQueNoExiste()</script></body>")
        self.debe_fallar(pieza, "x.html", "the page's script fails: funcionQueNoExiste is not defined")

    def test_un_hueco_sin_rellenar_falla(self):
        pieza = self.pieza_real()
        self.cambiar(pieza, "tarjeta.html", "<h1>texto de prueba</h1>", "<h1>{{titular}}</h1>")
        self.debe_fallar(pieza, "tarjeta.html", "fill the gaps in tarjeta.html")

    def test_el_carrusel_tiene_las_paginas_de_sus_slides(self):
        pieza = self.pieza_real()
        r = self.correr(pieza, "carrusel.html")
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertIn("(4 pages", r.stdout)
        self.assertEqual(comprobar.paginas_pdf(pieza / "medios" / "carrusel.pdf"), 4)


if __name__ == "__main__":
    unittest.main()
