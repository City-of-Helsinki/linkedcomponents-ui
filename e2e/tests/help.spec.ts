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
      .getByLabel('Siirry ohjesivulle')
      .getByRole('link', { name: 'Yleistä' })
      .click();

    await page
      .getByLabel('Siirry ohjesivulle')
      .getByRole('link', { name: 'Alusta' })
      .click();
    await expect
      .soft(page.getByRole('heading', { name: 'Alusta' }))
      .toBeVisible();

    await page
      .getByLabel('Siirry ohjesivulle')
      .getByRole('link', { name: 'Hallintapaneeli' })
      .click();
    await expect
      .soft(page.getByRole('heading', { name: 'Hallintapaneeli' }))
      .toBeVisible();

    await page
      .getByLabel('Siirry ohjesivulle')
      .getByRole('link', { name: 'Linked Registration -ohje' })
      .click();
    await expect
      .soft(page.getByRole('heading', { name: 'Linked Registration -ohje' }))
      .toBeVisible();

    await page
      .getByLabel('Siirry ohjesivulle')
      .getByRole('link', { name: 'UKK' })
      .click();
    await expect
      .soft(page.getByRole('heading', { name: 'Usein kysytyt kysymykset' }))
      .toBeVisible();

    await page.getByRole('button', { name: 'Teknologia' }).click();
    await page
      .locator('[id="\\/fi\\/help\\/technology-menu"]')
      .getByRole('link', { name: 'Yleistä' })
      .click();
    await expect
      .soft(page.getByRole('heading', { name: 'Yleistä' }))
      .toBeVisible();

    await page
      .getByLabel('Siirry ohjesivulle')
      .getByRole('link', { name: 'Rajapinta' })
      .click();
    await expect
      .soft(page.getByRole('heading', { name: 'Rajapinta' }))
      .toBeVisible();

    await page
      .getByLabel('Siirry ohjesivulle')
      .getByRole('link', { name: 'Kuvaoikeudet' })
      .click();
    await expect
      .soft(page.getByRole('heading', { name: 'Kuvaoikeudet' }))
      .toBeVisible();

    await page
      .getByLabel('Siirry ohjesivulle')
      .getByRole('link', { name: 'Lähdekoodi' })
      .click();
    await expect
      .soft(page.getByRole('heading', { name: 'Lähdekoodi' }))
      .toBeVisible();

    await page
      .getByLabel('Siirry ohjesivulle')
      .getByRole('link', { name: 'Dokumentaatio' })
      .click();
    await expect
      .soft(page.getByRole('heading', { name: 'Dokumentaatio' }))
      .toBeVisible();

    await page.getByRole('button', { name: 'Tuki' }).click();
    await page
      .getByLabel('Siirry ohjesivulle')
      .getByRole('link', { name: 'Käyttöehdot' })
      .click();
    await expect
      .soft(page.getByRole('heading', { name: 'Tietosuoja ja käyttöehdot' }))
      .toBeVisible();

    await page
      .getByLabel('Siirry ohjesivulle')
      .getByRole('link', { name: 'Ota yhteyttä' })
      .click();
    await expect
      .soft(page.getByRole('heading', { name: 'Ota yhteyttä' }))
      .toBeVisible();

    await page
      .getByLabel('Siirry ohjesivulle')
      .getByRole('link', { name: 'Pyydä käyttöoikeutta' })
      .click();
    await expect
      .soft(page.getByRole('heading', { name: 'Pyydä käyttöoikeutta' }))
      .toBeVisible();

    await page.getByLabel('Palvelun ominaisuudet').click();
    await expect
      .soft(page.getByRole('heading', { name: 'Palvelun ominaisuudet' }))
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
