import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

/**
 * See https://playwright.dev/docs/test-configuration.
 */

dotenv.config({ path: path.resolve(__dirname, '.env.local') });

export const E2E_TESTS_ENV_URL =
  process.env.E2E_TESTS_ENV_URL ?? 'https://linkedevents.dev.hel.ninja';

export const LINKED_EVENTS_URL =
  process.env.REACT_APP_LINKED_EVENTS_URL ??
  'https://linkedevents.api.dev.hel.ninja/v1';

export const TEST_USER_EMAIL = process.env.E2E_TEST_USER_EMAIL ?? '';
export const TEST_USER_PASSWORD = process.env.E2E_TEST_USER_PASSWORD ?? '';

export default defineConfig({
  // Look for test files in the "tests" directory, relative to this configuration file.
  testDir: './e2e/tests',

  // Timeout for each test in milliseconds
  timeout: 60 * 1000,

  // Run all tests in parallel.
  fullyParallel: true,

  // Run all tests in parallel.
  forbidOnly: !!process.env.CI,

  // The maximum number of retry attempts given to failed tests
  retries: process.env.CI ? 2 : 0,

  // Reporter to use
  reporter: [
    ['junit', { outputFile: 'report/e2e-junit-results.xml' }],
    ['html', { open: 'never', outputFolder: 'report/html' }],
  ],

  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: E2E_TESTS_ENV_URL,

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
