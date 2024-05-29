import { expect, test } from '@playwright/test';

import { TEST_USER_EMAIL, TEST_USER_PASSWORD } from '../../playwright.config';
import { login } from './utils';

const eventName = 'Testitapahtuma ' + (Math.random() * 1000).toFixed(0);

// Skipped because login in review environments is broken
test.fixme('Add and delete event', async ({ page }) => {
  test.skip(
    !TEST_USER_EMAIL || !TEST_USER_PASSWORD,
    'No test user credentials provided'
  );

  await page.goto('/fi');
  await login(page, TEST_USER_EMAIL, TEST_USER_PASSWORD);
  await page.getByRole('button', { name: 'Lisää uusi tapahtuma' }).click();

  await page
    .getByPlaceholder('Syötä tapahtuman järjestäjän nimi')
    .fill('Järjestäjän nimi');
  await page.getByPlaceholder('Syötä tapahtuman otsikko').fill(eventName);
  await page
    .getByPlaceholder('Syötä tapahtuman lyhyt kuvaus')
    .fill('Lyhyt kuvaus');
  await page.locator('.ck-editor__editable').click();
  await page
    .locator('.ck-editor__editable')
    .pressSequentially('Tässä lyhyt kuvaus tapahtumasta');
  await page.getByLabel('Tapahtuma alkaa').fill('12.12.2025');
  await page.getByLabel('Alkamisaika').getByLabel('tunnit').fill('10');
  await page.getByLabel('Alkamisaika').getByLabel('minuutit').fill('00');
  await page.getByLabel('Tapahtuma päättyy').fill('13.12.2044');
  await page.getByLabel('Päättymisaika').getByLabel('tunnit').fill('16');
  await page.getByLabel('Päättymisaika').getByLabel('minuutit').fill('30');
  await page.getByRole('button', { name: 'Tallenna ajankohta' }).click();

  // Select location for the event
  await page.locator('#location-toggle-button').click();
  await expect(page.locator('#location-item-2')).toBeVisible();
  const selectedLocation = page.locator('#location-menu li').nth(1);
  await selectedLocation.click();
  await expect(page.locator('#location-input')).not.toHaveValue('');

  await page.getByPlaceholder('Syötä kuvan alt-teksti').fill('Testikuva');
  await page.getByPlaceholder('Syötä kuvateksti').fill('Testikuvaus');
  await page.getByText('Konsertit', { exact: true }).click();
  await page.getByText('Kuvataide').click();
  await page.locator('#maximumAttendeeCapacity').fill('300');
  await page
    .getByPlaceholder('Syötä etu- ja sukunimi tai nimimerkki')
    .fill('Selain Testi');
  await page
    .getByPlaceholder('Syötä sähköpostiosoite')
    .fill('hello@example.org');
  await page.getByPlaceholder('+358 44 1234').fill('040123123');
  await page.locator('#userConsent').check();
  await page.locator('#isVerified').check();

  // Save as draft
  await page.getByRole('button', { name: 'Tallenna ja lähetä' }).click();
  await expect(
    page.getByText('Luonnos tallennettu onnistuneesti')
  ).toBeVisible();

  // Check if the event is visible in the drafts list
  await page.getByRole('button', { name: 'Palaa tapahtumiin' }).click();
  await page.getByRole('tab', { name: 'Luonnokset' }).click();
  await expect(page.getByTestId('hds-table-data-testid')).toContainText(
    eventName
  );

  // Delete the event
  await page
    .getByRole('row', { name: eventName })
    .getByLabel('Valinnat')
    .click();
  await page
    .getByRole('button', { name: 'Poista tapahtuma' })
    .dispatchEvent('click');
  await page.getByRole('button', { name: 'Poista tapahtuma' }).click();
  await expect(page.getByLabel('Tapahtuma on poistettu')).toBeVisible();
});
