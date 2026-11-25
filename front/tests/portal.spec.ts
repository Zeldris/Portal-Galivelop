// Pruebas del portal sobre la web construida: cada página carga sin errores de consola, sin scroll horizontal y sin
// fallos graves de accesibilidad; las capturas (@visual) solo corren en `front.py run full` (Linux o Docker).
import { test, expect, gotoStable, whenStable } from '../fixtures/stable';
import { expectNoOverflow } from '../helpers/layout';
import { expectNoSeriousA11y } from '../helpers/a11y';

// Rutas relativas al baseURL (que acaba en /Portal-Galivelop/).
const PAGINAS = [
  { nombre: 'inicio', ruta: '', titulo: /Galivelop · Marca de software/, h1: /Hacemos reales los proyectos/ },
  { nombre: 'productos', ruta: 'productos', titulo: /^Productos · Galivelop/, h1: /^Productos$/ },
  { nombre: 'ficha', ruta: 'proyectos/tarkor', titulo: /Tarkor/, h1: /Tarkor/ },
  { nombre: 'equipo', ruta: 'equipo', titulo: /^Equipo · Galivelop/, h1: /^Equipo$/ },
];

for (const p of PAGINAS) {
  test(`${p.nombre}: carga sin errores de consola ni de página`, async ({ page }) => {
    const errores: string[] = [];
    // El fixture corta las peticiones externas: su error de consola no es del portal.
    page.on('console', (m) => m.type() === 'error' && !m.text().includes('net::ERR_BLOCKED_BY_CLIENT') && errores.push(m.text()));
    page.on('pageerror', (e) => errores.push(e.message));
    const respuesta = await page.goto(p.ruta);
    expect(respuesta?.status()).toBe(200);
    await whenStable(page);
    await expect(page).toHaveTitle(p.titulo);
    await expect(page.locator('h1').first()).toHaveText(p.h1);
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
    // Solo una franja (menos de lfsThresholdKb por captura): la página entera pesa más de 900 kB. Se centra en el h1
    // propio de la página, para que cada captura sea distinta (la cabecera es la misma en todas).
    const ancho = page.viewportSize()!.width;
    await page.waitForLoadState('networkidle');
    const caja = await page.locator('h1').first().boundingBox();
    // La ficha ya cambia en la cabecera y su h1 cae sobre una imagen pesada: se queda la franja de arriba.
    const y = p.nombre === 'ficha' ? 0 : Math.max(0, Math.floor((caja?.y ?? 0) - 40));
    // Margen del 5 % (Q-29): el Chromium del runner de CI suaviza el texto distinto del contenedor donde se generan las
    // capturas y difiere hasta un 3 %; un fallo de maquetación en esta franja de 160 px mueve mucho más.
    await expect(page).toHaveScreenshot(`${p.nombre}.png`, { clip: { x: 0, y, width: ancho, height: 160 }, maxDiffPixelRatio: 0.05 });
  });
}
