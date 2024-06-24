import { expect, test } from '@playwright/test';

import { TEST_USER_EMAIL, TEST_USER_PASSWORD } from '../../playwright.config';
import { login, setCookieConsent } from './utils';

test.describe('Help page', () => {
  test.beforeEach(async ({ context, page }) => {
    await setCookieConsent(context);
    await page.goto('/fi/help/instructions/general');
  });

  test('Side navigation tabs work', async ({ page }) => {
    await page
      .locator('#page-header')
      .getByRole('link', { name: 'Tuki' })
      .click();

    await page
      .getByLabel('Lisätietoa palvelusta')
      .getByRole('link', { name: 'Tietoa palvelusta' })
      .click();
    await expect
      .soft(page.getByRole('heading', { name: 'Tietoa palvelusta' }))
      .toBeVisible();

    await page
      .getByLabel('Lisätietoa palvelusta')
      .getByRole('link', { name: 'Käyttöehdot' })
      .click();
    await expect
      .soft(page.getByRole('heading', { name: 'Tietosuoja ja käyttöehdot' }))
      .toBeVisible();

    await page
      .getByLabel('Lisätietoa palvelusta')
      .getByRole('link', { name: 'Ota yhteyttä' })
      .click();
    await expect
      .soft(page.getByRole('heading', { name: 'Ota yhteyttä' }))
      .toBeVisible();

    await page
      .getByLabel('Lisätietoa palvelusta')
      .getByRole('link', { name: 'Pyydä käyttöoikeutta' })
      .click();
    await expect
      .soft(page.getByRole('heading', { name: 'Pyydä käyttöoikeutta' }))
      .toBeVisible();

    await page.getByRole('button', { name: 'Ohjeet' }).click();
    await page
      .getByLabel('Lisätietoa palvelusta')
      .getByRole('link', { name: 'Sisällöntuotannon ohjeet' })
      .click();
    await expect
      .soft(page.getByRole('heading', { name: 'Sisällöntuotannon ohjeet' }))
      .toBeVisible();

    await page
      .getByLabel('Lisätietoa palvelusta')
      .getByRole('link', { name: 'UKK' })
      .click();
    await expect
      .soft(page.getByRole('heading', { name: 'Usein kysytyt kysymykset' }))
      .toBeVisible();

    await page.getByRole('button', { name: 'Teknologia' }).click();
    await page
      .getByLabel('Lisätietoa palvelusta')
      .getByRole('link', { name: 'Lähdekoodi ja rajapinta' })
      .click();
    await expect
      .soft(page.getByRole('heading', { name: 'Lähdekoodi ja rajapinta' }))
      .toBeVisible();

    await page
      .getByLabel('Lisätietoa palvelusta')
      .getByRole('link', { name: 'Dokumentaatio' })
      .click();
    await expect
      .soft(page.getByRole('heading', { name: 'Dokumentaatio' }))
      .toBeVisible();
  });

  // Choosing a topic works unreliable, so this test is skipped for now
  test.fixme('Should submit contact form successfully', async ({ page }) => {
    await page.goto('/fi/help/support/contact');
    await page.locator('#name').fill('Test User');
    await page.locator('#email').fill('test@example.org');
    await Promise.all([
      page.locator('#topic-toggle-button').click(),
      expect(page.locator('#topic-menu')).toBeVisible({ timeout: 15000 }),
    ]);

    await page.locator('#topic-item-0').click();
    await page.locator('#subject').fill('Testiotsikko');
    await page.locator('#body').fill('Testiviesti');
    await page.getByRole('button', { name: 'Lähetä' }).click();

    await expect.soft(page.getByText('Kiitos yhteydenotostasi.')).toBeVisible();
    await expect.soft(page.getByText('Viestisi on lähetetty')).toBeVisible();
  });

  // Skipped because login in review environments is broken
  test.fixme('Request access form', async ({ page }) => {
    test.skip(
      !TEST_USER_EMAIL || !TEST_USER_PASSWORD,
      'No test user credentials provided'
    );

    await page.goto('/fi/help/support/ask-permission');
    await login(page, TEST_USER_EMAIL, TEST_USER_PASSWORD);

    await page.getByLabel('Organisaatio: Valikko').click();
    await page.locator('#organization-item-3').click();
    await page.getByPlaceholder('Kuvaile roolisi').fill('Testirooli');
    await page.getByPlaceholder('Syötä viestisi').fill('Tämä on testiviesti');
    await page.getByRole('button', { name: 'Lähetä' }).click();
    await expect(
      page.getByText(
        'Kiitos yhteydenotostasi.Viestisi on lähetetty. Otamme sinuun yhteyttä pian!'
      )
    ).toBeVisible();
  });
});
