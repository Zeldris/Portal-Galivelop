// galivelop-workflow v0.9.0
// `stable`: what makes a page render the same every time (ref-front-testing, section 4): reduced motion, a fixed
// clock, fonts loaded, no network but the app's own origin, and no animations or transitions. It is an automatic
// fixture of the `test` this file exports, so every test that imports `test` from here gets it.
import { test as base, expect, type Page } from '@playwright/test';

/** The instant `page.clock` is frozen at (UTC). */
export const FIXED_TIME = new Date('2024-01-15T10:00:00Z');

const NO_MOTION = `*, *::before, *::after {
  animation-duration: 0s !important; animation-delay: 0s !important; animation-iteration-count: 1 !important;
  transition-duration: 0s !important; transition-delay: 0s !important; scroll-behavior: auto !important;
  caret-color: transparent !important;
}`;

/** The origin the app is served from: the project's `baseURL`. Without one there is no way to tell the app from the
 *  rest of the network, so it fails instead of blocking the app's own requests. */
export function appOrigin(baseURL: unknown): string {
  if (typeof baseURL !== 'string' || baseURL === '') {
    throw new Error(
      "stable: set `baseURL` in the Playwright config (gwConfig({ use: { baseURL: 'http://localhost:3000' } })): " +
        "the app's origin is the only one the network may reach, and without it every request would be blocked",
    );
  }
  return new URL(baseURL).origin;
}

/** Apply the stable setup to `page`; `origin` is the only origin allowed on the network. */
export async function makeStable(page: Page, origin: string): Promise<void> {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.clock.install({ time: FIXED_TIME });
  await page.clock.setFixedTime(FIXED_TIME);
  await page.route(
    (url) => /^https?:$/.test(url.protocol) && url.origin !== origin,
    (route) => route.abort('blockedbyclient'),
  );
  // Runs in every document before its scripts. <head> does not exist yet, so the style goes onto <html> the moment
  // that element exists (a MutationObserver), which is before the first paint.
  await page.addInitScript((css) => {
    const add = () => {
      const style = document.createElement('style');
      style.dataset.gwStable = '';
      style.textContent = css;
      document.documentElement.appendChild(style);
    };
    if (document.documentElement) {
      add();
    } else {
      const observer = new MutationObserver(() => {
        if (document.documentElement) {
          observer.disconnect();
          add();
        }
      });
      observer.observe(document, { childList: true });
    }
  }, NO_MOTION);
}

/** Wait until the page is ready to be measured or captured: `document.fonts.ready`. Call it after `page.goto`. */
export async function whenStable(page: Page): Promise<void> {
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
}

export const test = base.extend<{ stable: void }>({
  stable: [
    async ({ page, baseURL }, use) => {
      await makeStable(page, appOrigin(baseURL));
      await use();
    },
    { auto: true },
  ],
});

// `page.goto` resolves on `load`; the fonts may still be loading, so wait for them as well.
export async function gotoStable(page: Page, url: string): Promise<void> {
  await page.goto(url);
  await whenStable(page);
}

export { expect };
