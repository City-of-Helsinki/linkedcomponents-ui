import { BrowserContext, expect, Page } from '@playwright/test';

import { E2E_TESTS_ENV_URL } from '../../playwright.config';

export const login = async (page: Page, email: string, password: string) => {
  await page.getByRole('button', { name: 'Kirjaudu sisään' }).click();
  await expect(page.locator('.login-pf-page')).toBeVisible();
  await expect(page.locator('#kc-error-message')).toBeHidden();
  await page.getByLabel('Sähköposti').fill(email);
  await page.getByLabel('Salasana').fill(password);
  await page.getByRole('button', { name: 'Kirjaudu sisään' }).click();
};

export const encodedCookieConsents = () =>
  encodeURIComponent(
    JSON.stringify({
      tunnistamo: true,
      eventForm: true,
      registrationForm: true,
      signupForm: true,
      'city-of-helsinki-cookie-consents': true,
      'city-of-helsinki-consent-version': true,
      matomo: true,
    })
  );

export const setCookieConsent = async (context: BrowserContext) => {
  await context.addCookies([
    {
      name: 'city-of-helsinki-consent-version',
      value: '1',
      domain: E2E_TESTS_ENV_URL,
      path: '/',
    },
    {
      name: 'city-of-helsinki-cookie-consents',
      value: encodedCookieConsents(),
      domain: E2E_TESTS_ENV_URL,
      path: '/',
    },
  ]);
};
