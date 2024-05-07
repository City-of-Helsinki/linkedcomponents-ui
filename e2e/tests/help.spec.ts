import { expect, test } from '@playwright/test';

import { setCookieConsent } from './utils';

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
      .getByRole('link', { name: 'Ilmoittautumisen ohjeet' })
      .click();
    await expect
      .soft(page.getByRole('heading', { name: 'Ilmoittautumisen ohjeet' }))
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

  test('Should submit contact form successfully', async ({
    browserName,
    page,
  }) => {
    test.skip(
      browserName === 'chromium',
      'Select option fails in chromium test'
    );

    await page.goto('/fi/help/support/contact');
    await page.getByPlaceholder('Syötä etu- ja sukunimi tai').fill('Test User');
    await page.getByPlaceholder('Syötä sähköposti').fill('test@example.org');

    await page.getByLabel('Valitse yhteydenoton aihe').click();
    await page.getByRole('option', { name: 'Käyttöoikeudet' }).click(); // TODO: Fails with chromium

    await page
      .getByPlaceholder('Syötä yhteydenottoa kuvaileva')
      .fill('Testiotsikko');
    await page.getByPlaceholder('Syötä viestisi').fill('Testiviesti');
    await page.getByRole('button', { name: 'Lähetä' }).click();

    await expect.soft(page.getByText('Kiitos yhteydenotostasi.')).toBeVisible();
    await expect
      .soft(page.getByText('Viestisi on lähetetty. Otamme'))
      .toBeVisible();
  });
});
