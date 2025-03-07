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

export const encodedCookieConsents = () => {
  return encodeURIComponent(`helfi-cookie-consents=
    ${JSON.stringify({
      groups: {
        tunnistamo: { checksum: 'ea5a1519', timestamp: 1530518207007 },
        userInputs: { checksum: 'a5e73b70', timestamp: 1530518207007 },
        shared: { checksum: '3ab2ff2e', timestamp: 1530518207007 },
        statistics: { checksum: 'caa20391', timestamp: 1530518207007 },
      },
    })}`);
};

export const setCookieConsent = async (context: BrowserContext) => {
  await context.addCookies([
    {
      name: 'helfi-consent-version',
      value: '1',
      domain: E2E_TESTS_ENV_URL,
      path: '/',
    },
    {
      name: 'helfi-cookie-consents',
      value: encodedCookieConsents(),
      domain: E2E_TESTS_ENV_URL,
      path: '/',
    },
  ]);
};
