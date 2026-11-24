// galivelop-workflow v0.9.0
// Config builder of the front tests (galivelop-workflow, E5). The projects come from the file front.py generates
// (`playwright.projects.json`: one per breakpoint and browser, E-16), so a change in the tokens file changes the matrix.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, devices, type PlaywrightTestConfig } from '@playwright/test';

type GeneratedProject = {
  name: string;
  browser: 'chromium' | 'webkit' | 'firefox';
  viewport: { width: number; height: number };
};

const DEVICES = {
  chromium: devices['Desktop Chrome'],
  webkit: devices['Desktop Safari'],
  firefox: devices['Desktop Firefox'],
} as const;

/** The generated matrix. Path: `file`, else `GW_PLAYWRIGHT_PROJECTS`, else front/generated/playwright.projects.json (the
 *  default of `front.out`) next to this file, never relative to the folder Playwright is run from. Fails with the
 *  command that fixes it. */
export function loadProjects(file?: string): GeneratedProject[] {
  const path = resolve(file ?? process.env.GW_PLAYWRIGHT_PROJECTS ?? resolve(__dirname, 'generated/playwright.projects.json'));
  let text: string;
  try {
    text = readFileSync(path, 'utf8');
  } catch {
    throw new Error(
      `cannot read ${path}; generate it with: python3 .claude/gw/scripts/front.py generate ` +
        '(or point GW_PLAYWRIGHT_PROJECTS at it)',
    );
  }
  return JSON.parse(text) as GeneratedProject[];
}

/** The config, with the generated projects; `overrides` is merged on top (baseURL, webServer, testDir...). */
export function gwConfig(overrides: PlaywrightTestConfig = {}, projectsFile?: string): PlaywrightTestConfig {
  const projects = loadProjects(projectsFile).map((p) => ({
    name: p.name,
    use: { ...DEVICES[p.browser], viewport: p.viewport },
  }));
  return defineConfig({
    testDir: 'tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    expect: { toHaveScreenshot: { animations: 'disabled' } },
    projects,
    ...overrides,
  });
}
