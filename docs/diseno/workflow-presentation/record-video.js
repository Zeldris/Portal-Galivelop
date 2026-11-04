const { chromium } = require('playwright');
const path = require('path'); const fs = require('fs');
const mode = process.argv[2]; // 16x9 | 9x16
const size = mode === '9x16' ? { width: 1080, height: 1920 } : { width: 1280, height: 720 };
(async () => {
  const browser = await chromium.launch();
  const dir = path.join(__dirname, 'video-' + mode); fs.mkdirSync(dir, { recursive: true });
  const ctx = await browser.newContext({ viewport: size, recordVideo: { dir, size } });
  const page = await ctx.newPage();
  const errors = []; page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('file://' + path.resolve(__dirname, 'workflow-presentation.html') + '?record=' + mode);
  await page.waitForFunction(() => document.fonts.status === 'loaded', null, { timeout: 8000 }).catch(() => {});
  const total = await page.evaluate(() => window.gwPresentation.total());
  await page.evaluate(() => window.gwPresentation.goTo(0));
  await page.waitForTimeout(800);
  await page.evaluate(() => window.gwPresentation.play());
  await page.evaluate(() => new Promise((r) => document.addEventListener('gw:end', r, { once: true })), { timeout: 0 });
  await page.waitForTimeout(1500);
  const v = page.video(); await ctx.close();
  const webm = path.join(__dirname, `workflow-${mode}.webm`); fs.renameSync(await v.path(), webm);
  await browser.close();
  console.log(JSON.stringify({ mode, total_s: Math.round(total / 1000), lang: 'en', errors, webm }));
})().catch((e) => { console.error(e); process.exit(1); });
