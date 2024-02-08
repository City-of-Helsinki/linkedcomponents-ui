import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */

export default defineConfig({
  // Look for test files in the "tests" directory, relative to this configuration file.
  testDir: './e2e/tests',

  // Run all tests in parallel.
  fullyParallel: true,

  // Run all tests in parallel.
  forbidOnly: !!process.env.CI,

  // Opt out of parallel tests on CI.
  workers: process.env.CI ? 1 : undefined,

  // Reporter to use
  reporter: [
    ['junit', { outputFile: 'report/e2e-junit-results.xml' }],
    ['html', { open: 'never', outputFolder: 'report/html' }],
  ],

  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL:
      process.env.E2E_TESTS_ENV_URL ?? 'https://linkedevents.dev.hel.ninja/',

    // Whether to ignore HTTPS errors when sending network requests
    ignoreHTTPSErrors: true,

    // Whether to automatically capture a screenshot after each test
    screenshot: { mode: 'only-on-failure', fullPage: true },

    // Collect trace when retrying the failed test.
    trace: 'on-first-retry',

    // Whether to record video for each test
    video: 'on-first-retry',

    contextOptions: {
      recordVideo: {
        dir: './report/videos/',
      },
    },
  },

  // Configure projects for major browsers.
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
});
