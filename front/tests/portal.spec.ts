// Pruebas del portal sobre la web construida: cada página carga sin errores de consola, sin scroll horizontal y sin
// fallos graves de accesibilidad; las capturas (@visual) solo corren en `front.py run full` (Linux o Docker).
import { test, expect, gotoStable } from '../fixtures/stable';
import { expectNoOverflow } from '../helpers/layout';
import { expectNoSeriousA11y } from '../helpers/a11y';

// Rutas relativas al baseURL (que acaba en /Portal-Galivelop/).
const PAGINAS = [
  { nombre: 'inicio', ruta: '', titulo: /Galivelop/ },
  { nombre: 'productos', ruta: 'productos', titulo: /Galivelop/ },
  { nombre: 'ficha', ruta: 'proyectos/tarkor', titulo: /Tarkor/ },
  { nombre: 'equipo', ruta: 'equipo', titulo: /Galivelop/ },
];

for (const p of PAGINAS) {
  test(`${p.nombre}: carga sin errores de consola ni de página`, async ({ page }) => {
    const errores: string[] = [];
    page.on('console', (m) => m.type() === 'error' && errores.push(m.text()));
    page.on('pageerror', (e) => errores.push(e.message));
    await gotoStable(page, p.ruta);
    await expect(page).toHaveTitle(p.titulo);
    await expect(page.locator('main').first()).toBeVisible();
    expect(errores).toEqual([]);
  });

  test(`${p.nombre}: sin scroll horizontal`, async ({ page }) => {
    await gotoStable(page, p.ruta);
    await expectNoOverflow(page);
  });

  test(`${p.nombre}: sin fallos graves de accesibilidad`, async ({ page }) => {
    await gotoStable(page, p.ruta);
    // El logotipo (celeste de la marca sobre papel, 2,8:1) es un logotipo: WCAG 1.4.3 lo exime de contraste.
    await expectNoSeriousA11y(page, { exclude: ['.logo'] });
  });

  test(`${p.nombre}: captura de la cabecera @visual`, async ({ page }) => {
    await gotoStable(page, p.ruta);
    // Solo la franja de la cabecera (menos de lfsThresholdKb por captura): la página entera pesa más de 900 kB.
    const ancho = page.viewportSize()!.width;
    await expect(page).toHaveScreenshot(`${p.nombre}.png`, { clip: { x: 0, y: 0, width: ancho, height: 160 }, maxDiffPixelRatio: 0.02 });
  });
}
