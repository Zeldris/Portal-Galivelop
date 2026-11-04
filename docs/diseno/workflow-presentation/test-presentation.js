const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const file = 'file://' + path.resolve(__dirname, 'workflow-presentation.html');
  const browser = await chromium.launch();
  const results = [];
  const SHOTS = [1, 10, 18, 22]; // relay-ready log, relay, rejection, publication
  const configs = [];
  for (const lang of ['en', 'es', 'gl']) {
    configs.push([`desktop-${lang}`, { width: 1280, height: 720 }, `?lang=${lang}`, false]);
    configs.push([`mobile-${lang}`, { width: 390, height: 844 }, `?lang=${lang}`, false]);
  }
  configs.push(['mobile-reduced', { width: 390, height: 844 }, '?lang=en', true]);
  configs.push(['record-16x9', { width: 1280, height: 720 }, '?record=16x9', false]);
  configs.push(['record-9x16', { width: 1080, height: 1920 }, '?record=9x16', false]);
  for (const [name, vp, q, reduced] of configs) {
    const ctx = await browser.newContext({ viewport: vp, reducedMotion: reduced ? 'reduce' : 'no-preference' });
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
    await page.goto(file + q);
    await page.waitForTimeout(700);
    if (name.startsWith('record')) await page.evaluate(() => window.gwPresentation.pause());
    const checks = [];
    for (const k of [0, 4, 8, 10, 13, 18, 20, 22, 24, 26]) {
      await page.evaluate((k) => window.gwPresentation.goTo(k), k);
      await page.waitForTimeout(120);
      const o = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      const fonts = await page.evaluate(() => {
        const els = [...document.querySelectorAll('.caption *, .legend span, .hint, .chapters button, .lang button, .meta')].filter(e => e.textContent.trim() && getComputedStyle(e).display !== 'none' && e.offsetParent !== null);
        const html = Math.min(...els.map(e => parseFloat(getComputedStyle(e).fontSize)));
        // SVG text: rendered size = font-size (px, in user units) * scale of the viewBox
        const svg = document.querySelector('.scene svg'); const scale = svg.getBoundingClientRect().width / 800;
        const texts = [...svg.querySelectorAll('text')].filter(t => t.textContent.trim() && getComputedStyle(t).opacity !== '0' && t.closest('.fade') ? t.closest('.fade').classList.contains('on') : true);
        const sv = Math.min(...texts.map(t => parseFloat(getComputedStyle(t).fontSize) * scale));
        return { html, svg: +sv.toFixed(1), scale: +scale.toFixed(3) };
      });
      checks.push({ beat: k, overflowPx: o, minHtmlPx: fonts.html, minSvgPx: fonts.svg });
    }
    const lang = await page.evaluate(() => [document.documentElement.lang, window.gwPresentation.lang, document.getElementById('beat-title').textContent]);
    if (!name.startsWith('record') && !name.includes('reduced') && !name.endsWith('-gl') && !name.endsWith('-es')) {
      for (const k of SHOTS) {
        await page.evaluate((k) => window.gwPresentation.goTo(k), k);
        await page.waitForTimeout(250);
        await page.screenshot({ path: path.join(__dirname, `shot-${name}-step${k + 1}.png`), fullPage: name.startsWith('mobile') });
      }
    } else if (name.endsWith('-gl') || name.endsWith('-es')) {
      await page.evaluate(() => window.gwPresentation.goTo(13));
      await page.waitForTimeout(250);
      await page.screenshot({ path: path.join(__dirname, `shot-${name}-step14.png`), fullPage: name.startsWith('mobile') });
    } else {
      await page.evaluate(() => window.gwPresentation.goTo(18));
      await page.waitForTimeout(name.startsWith('record') ? 300 : 250);
      await page.screenshot({ path: path.join(__dirname, `shot-${name}.png`), fullPage: name.startsWith('mobile') });
    }
    results.push({ name, lang, errors, worst: { overflow: Math.max(...checks.map(c => c.overflowPx)), minHtmlPx: Math.min(...checks.map(c => c.minHtmlPx)), minSvgPx: Math.min(...checks.map(c => c.minSvgPx)) }, total_s: await page.evaluate(() => Math.round(window.gwPresentation.total() / 1000)) });
    await ctx.close();
  }
  // Keyboard + language switch test on desktop
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await ctx.newPage();
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(file + '?lang=en');
  await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowRight'); await page.keyboard.press('5');
  const kb = await page.evaluate(() => ({ index: window.gwPresentation.index, title: document.getElementById('beat-title').textContent }));
  await page.keyboard.press(' ');
  const playing = await page.evaluate(() => document.getElementById('play').textContent);
  await page.keyboard.press(' ');
  await page.keyboard.press('0');
  const ch10 = await page.evaluate(() => window.gwPresentation.index);
  // tab to the language group and switch with Enter
  await page.focus('#lang button[data-lang="gl"]'); await page.keyboard.press('Enter');
  const gl = await page.evaluate(() => [document.documentElement.lang, document.getElementById('beat-title').textContent, document.getElementById('ln-P').textContent]);
  let beats = 0, ended = false;
  await page.exposeFunction('_beat', () => beats++);
  await page.evaluate(() => { document.addEventListener('gw:beat', () => window._beat()); document.addEventListener('gw:end', () => { window._ended = true; }); });
  await page.evaluate(() => { window.gwPresentation.setSpeed(2); window.gwPresentation.goTo(25); window.gwPresentation.play(); });
  await page.waitForTimeout(9000);
  ended = await page.evaluate(() => !!window._ended);
  results.push({ keyboard: kb, afterSpace: playing, zeroKeyIndex: ch10, glSwitch: gl, beatsSeen: beats, endEvent: ended, errors: errs });
  await browser.close();
  console.log(JSON.stringify(results, null, 1));
})().catch((e) => { console.error(e); process.exit(1); });
