import { expect, Page } from '@playwright/test';

export const login = async (page: Page, email: string, password: string) => {
  await page.getByRole('button', { name: 'Kirjaudu sisään' }).click();
  await expect(page.locator('.login-pf-page')).toBeVisible();
  await expect(page.locator('#kc-error-message')).toBeHidden();
  await page.getByLabel('Sähköposti').fill(email);
  await page.getByLabel('Salasana').fill(password);
  await page.getByRole('button', { name: 'Kirjaudu sisään' }).click();
};

export const acceptCookieConcent = async (page: Page) => {
  const cookieButton = page.getByRole('button', {
    name: /hyväksy kaikki evästeet/i,
  });

  await cookieButton.click();
};
