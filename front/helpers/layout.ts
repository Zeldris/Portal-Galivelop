// galivelop-workflow v0.9.0
// Layout checks that need no baseline (ref-front-testing, section 3). Each failure names the element and the reason.
import type { Locator, Page } from '@playwright/test';

/** A short CSS-like description of an element for a message: tag#id.class[data-testid]. */
const DESCRIBE = `(el) => {
  const id = el.id ? '#' + el.id : '';
  const cls = typeof el.className === 'string' && el.className.trim()
    ? '.' + el.className.trim().split(/\\s+/).join('.') : '';
  const tid = el.getAttribute('data-testid');
  return el.tagName.toLowerCase() + id + cls + (tid ? '[data-testid=' + tid + ']' : '');
}`;

/** No horizontal scroll and no visible element that sticks out of the viewport on the right. Content clipped or
 *  scrolled by an ancestor (`overflow-x: auto|scroll|hidden|clip`) or parked off-screen with a transform is not an
 *  overflow of the page, and of a group of nested offenders only the outermost is named. */
export async function expectNoOverflow(page: Page): Promise<void> {
  const problems = await page.evaluate(`(() => {
    const describe = ${DESCRIBE};
    const width = document.documentElement.clientWidth;
    const out = [];
    const scroll = document.documentElement.scrollWidth;
    if (scroll > width) out.push('the page scrolls horizontally: scrollWidth ' + scroll + 'px > viewport ' + width + 'px');
    const clipping = (el) => {
      for (let p = el.parentElement; p && p !== document.body && p !== document.documentElement; p = p.parentElement) {
        if (['auto', 'scroll', 'hidden', 'clip'].includes(getComputedStyle(p).overflowX)) return true;
      }
      return false;
    };
    const transformed = (el) => {
      for (let p = el; p && p !== document.documentElement; p = p.parentElement) {
        if (getComputedStyle(p).transform !== 'none') return true;
      }
      return false;
    };
    const offenders = [];
    for (const el of document.querySelectorAll('body *')) {
      const box = el.getBoundingClientRect();
      if (box.width === 0 || box.height === 0) continue;
      if (getComputedStyle(el).visibility === 'hidden') continue;
      if (box.right <= width + 0.5) continue;
      if (clipping(el)) continue;
      if (box.left >= width && transformed(el)) continue;
      offenders.push({ el, text: describe(el) + ' is wider than the viewport: its right edge is at ' +
        Math.round(box.right) + 'px, the viewport is ' + width + 'px wide' });
    }
    for (const o of offenders) {
      if (!offenders.some((other) => other !== o && other.el.contains(o.el))) out.push(o.text);
    }
    return out;
  })()`);
  if ((problems as string[]).length > 0) {
    throw new Error(`horizontal overflow at ${page.viewportSize()?.width ?? '?'}px:\n  ` + (problems as string[]).join('\n  '));
  }
}

/** Two elements must not share any area. Both must be visible (they need a bounding box). */
export async function expectNoOverlap(a: Locator, b: Locator): Promise<void> {
  const describe = (l: Locator): Promise<string> =>
    l.evaluate((el) => {
      const id = el.id ? '#' + el.id : '';
      const cls = typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/).join('.') : '';
      const tid = el.getAttribute('data-testid');
      return el.tagName.toLowerCase() + id + cls + (tid ? '[data-testid=' + tid + ']' : '');
    });
  const [boxA, boxB] = await Promise.all([a.boundingBox(), b.boundingBox()]);
  const [nameA, nameB] = await Promise.all([describe(a), describe(b)]);
  if (!boxA || !boxB) {
    throw new Error(`cannot compare ${boxA ? nameB : nameA} with ${boxA ? nameA : nameB}: it has no box (not visible)`);
  }
  const width = Math.min(boxA.x + boxA.width, boxB.x + boxB.width) - Math.max(boxA.x, boxB.x);
  const height = Math.min(boxA.y + boxA.height, boxB.y + boxB.height) - Math.max(boxA.y, boxB.y);
  if (width > 0.5 && height > 0.5) {
    throw new Error(`${nameA} overlaps ${nameB} by ${Math.round(width)}x${Math.round(height)}px`);
  }
}

export type TouchTargetOptions = {
  /** CSS selectors of elements to leave out (the element itself or anything inside a match). */
  exclude?: string[];
};

/** Every visible interactive element is at least `minPx` x `minPx` CSS px (WCAG 2.2, 2.5.8: 24). The exceptions of
 *  that criterion are not reported: a link inside a sentence (inline, with text around it in its parent) and an
 *  element visually hidden (1px or less, as `sr-only` makes it). `options.exclude` leaves out more. */
export async function expectTouchTargets(page: Page, minPx = 24, options: TouchTargetOptions = {}): Promise<void> {
  const problems = await page.evaluate(`((min, exclude) => {
    const describe = ${DESCRIBE};
    const out = [];
    const sel = 'a[href], button, input:not([type=hidden]), select, textarea, [role=button], [role=link], [tabindex]:not([tabindex="-1"])';
    const inSentence = (el) => {
      if (getComputedStyle(el).display !== 'inline') return false;
      const around = Array.from(el.parentElement ? el.parentElement.childNodes : [])
        .filter((n) => n !== el && n.nodeType === Node.TEXT_NODE && n.textContent.trim() !== '');
      return around.length > 0;
    };
    for (const el of document.querySelectorAll(sel)) {
      const box = el.getBoundingClientRect();
      if (box.width === 0 && box.height === 0) continue;
      if (getComputedStyle(el).visibility === 'hidden') continue;
      if (box.width <= 1 && box.height <= 1) continue;
      if (exclude.some((s) => el.closest(s))) continue;
      if (inSentence(el)) continue;
      if (box.width < min || box.height < min) {
        out.push(describe(el) + ' is ' + Math.round(box.width) + 'x' + Math.round(box.height) +
          'px, smaller than the ' + min + 'x' + min + 'px minimum touch target');
      }
    }
    return out;
  })(${JSON.stringify(minPx)}, ${JSON.stringify(options.exclude ?? [])})`);
  if ((problems as string[]).length > 0) {
    throw new Error('touch targets too small:\n  ' + (problems as string[]).join('\n  '));
  }
}
