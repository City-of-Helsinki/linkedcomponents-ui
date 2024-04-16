import { expect, test } from '@playwright/test';

import { EventsResponse, PlacesResponse } from '../../src/generated/graphql';
import { LINKED_EVENTS_URL } from './utils';

test.describe('Event search page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/fi/search');

    await expect(page.getByTestId('hds-pagination-next-button')).toBeVisible();
  });

  test('Displays places in filter options', async ({ page }) => {
    const res = await fetch(`${LINKED_EVENTS_URL}/place/?`);
    const json: PlacesResponse = await res.json();
    const places = json.data;

    const datalength = places.length;

    const randomIndex = Math.floor(Math.random() * datalength);
    const placeFinnishName = places[randomIndex]?.name?.fi;

    if (!placeFinnishName) return;

    await page.getByLabel('Etsi tapahtumapaikkaa').click();
    await page.getByPlaceholder('Hae', { exact: true }).fill(placeFinnishName);
    await page.getByLabel(placeFinnishName).first().check();
  });

  test('Searching for specific event displays the event card', async ({
    page,
  }) => {
    const res = await fetch(`${LINKED_EVENTS_URL}/event/`);
    const json: EventsResponse = await res.json();
    const events = json.data;

    const datalength = events.length;

    const randomIndex = Math.floor(Math.random() * datalength);
    const event = events[randomIndex];
    const eventFinnishName = event?.name?.fi;
    const eventId = event?.id;
    if (!eventFinnishName) return;

    await page.getByPlaceholder('Hae tapahtumia').fill(eventFinnishName);

    const searchInput = page.getByPlaceholder('Hae tapahtumia');

    await searchInput.fill(eventFinnishName);

    await page.locator('button').filter({ hasText: 'Etsi tapahtumia' }).click();
    await expect(page.getByText(eventFinnishName)).toBeVisible();

    if (eventId) {
      const eventCardLocator = page.getByTestId(eventId);
      await expect(eventCardLocator).toBeVisible();
    }
  });

  test('Verify search controls and results', async ({ page }) => {
    // Search controls
    await expect(
      page.getByText('Hae Linked Events -rajapinnasta')
    ).toBeVisible();
    await expect(page.getByPlaceholder('Hae tapahtumia')).toBeVisible();
    await expect(page.getByLabel('Valitse päivämäärät')).toBeVisible();
    await expect(page.getByLabel('Etsi tapahtumapaikkaa')).toBeVisible();
    await expect(page.getByLabel('Tyyppi')).toBeVisible();
    await expect(
      page.locator('button').filter({ hasText: 'Etsi tapahtumia' })
    ).toBeVisible();

    // Results
    await expect(page.getByLabel('Viimeksi muokattu, laskeva')).toBeVisible();
    await expect(
      page.getByTestId('hds-pagination-previous-button')
    ).toBeDisabled();
    await expect(page.getByTestId('hds-pagination-next-button')).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Anna palautetta' })
    ).toBeVisible();
  });

  test('Should clear search input', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Hae tapahtumia');
    const textToSearch = 'Hello world';

    // Search controls
    await expect(
      page.getByText('Hae Linked Events -rajapinnasta')
    ).toBeVisible();
    await searchInput.fill(textToSearch);
    await expect(searchInput).toHaveValue(textToSearch);
    await page.getByLabel('Tyhjennä').click();
    await expect(searchInput).toHaveValue('');
  });

  test('Should return no results for invalid search', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Hae tapahtumia');
    const textToSearch = 'xxx zzz yyy 123';

    // Search controls
    await searchInput.fill(textToSearch);
    await expect(page.getByText('0 tapahtumaa')).not.toBeVisible();
    await page.locator('button').filter({ hasText: 'Etsi tapahtumia' }).click();
    await expect(page.getByText('0 tapahtumaa')).toBeVisible();
  });
});

test('should display logged out message', async ({ page }) => {
  await page.goto('/fi/events');
  await expect(
    page.getByText(
      'Sinun täytyy olla kirjautuneena sisään tarkastellaksesi tätä sisältöä'
    )
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Etusivulle' })).toBeEnabled();
  await expect(
    page.locator('main').getByRole('button', { name: 'Kirjaudu sisään' })
  ).toBeEnabled();
  await expect(
    page.locator('main').getByRole('button', { name: 'Anna palautetta' })
  ).toBeEnabled();
});

test('Create event page', async ({ page }) => {
  await page.goto('/fi/events/create');

  // Info text for logged out users
  await expect(
    page.getByText(
      'Voit jatkaa palveluun tutustumista, mutta sinun täytyy kirjautua sisään'
    )
  ).toBeVisible();

  // Tapahtumatyyppi
  await expect(
    page.getByRole('heading', { name: 'Valitse tapahtumatyyppi' })
  ).toBeVisible();

  // Kattotapahtumat
  await expect(
    page.getByRole('heading', { name: 'Kattotapahtumat' })
  ).toBeVisible();
  await expect(
    page.getByRole('checkbox', { name: 'Tämä tapahtuma on kattotapahtuma' })
  ).toBeVisible();
  await expect(
    page.getByRole('checkbox', { name: 'Tällä tapahtumalla on kattotapahtuma' })
  ).toBeVisible();

  // Kielet
  await expect(
    page.getByRole('heading', { name: 'Kielet', exact: true })
  ).toBeVisible();
  await expect(
    page.locator('h3').filter({ hasText: 'Tapahtumatietojen syöttökielet' })
  ).toBeVisible();
  await expect(
    page.locator('h3').filter({ hasText: 'Tapahtuman kielet' })
  ).toBeVisible();

  // Vastuut
  await expect(page.getByRole('heading', { name: 'Vastuut' })).toBeVisible();
  await expect(page.locator('#publisher-label')).toBeVisible();
  await expect(
    page.getByText('Tapahtuman järjestäjä suomeksi (jos eri kuin julkaisija)')
  ).toBeVisible();

  // Kuvaus
  await expect(
    page.getByRole('heading', { name: 'Kuvaus', exact: true })
  ).toBeVisible();
  await expect(page.getByRole('tab', { name: 'Suomi' })).toBeVisible();
  await expect(page.getByText('Tapahtuman otsikko suomeksi*')).toBeVisible();
  await expect(page.getByText('Lyhyt kuvaus suomeksi (')).toBeVisible();

  // Ajankohta

  // Paikka
  await expect(
    page.getByRole('heading', { name: 'Paikka', exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Paikan lisätiedot' })
  ).toBeVisible();

  // Hinta
  await expect(
    page.getByRole('heading', { name: 'Tapahtuman hintatiedot' })
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Linkki lipunmyyntiin tai' })
  ).toBeVisible();

  // Tapahtuman kanavat
  await expect(
    page.getByRole('heading', { name: 'Tapahtuman kotisivu' })
  ).toBeVisible();
  await expect(
    page
      .getByRole('group', { name: 'Uuden SoMe-linkin tyyppi' })
      .locator('legend')
  ).toBeAttached();

  // Kuva
  await expect(
    page.getByRole('heading', { name: 'Tapahtuman kuva', exact: true })
  ).toBeVisible();
  await expect(page.getByText('Kuvan vaihtoehtoinen teksti')).toBeVisible();

  // Video
  await expect(
    page.getByRole('heading', { name: 'Video', exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole('group', { name: 'Video' }).locator('h3')
  ).toBeVisible();

  // Luokittelu
  await expect(
    page.getByRole('heading', { name: 'Valitse kategoria(t)' })
  ).toBeVisible();
  await expect(
    page.locator('h3').filter({ hasText: 'Lisää avainsanoja' })
  ).toBeVisible();

  // Kohderyhmät
  await expect(
    page.locator('h2').filter({ hasText: 'Kohderyhmät' })
  ).toBeVisible();

  // Lisätiedot
  await expect(
    page.getByRole('heading', { name: 'Lisätiedot', exact: true })
  ).toBeVisible();

  // Accept/consent
  await expect(
    page.getByText(
      'Vakuutan, että antamani tiedot ovat oikein ja sitoudun noudattamaan'
    )
  ).toBeVisible();

  // Submit
  await expect(
    page.getByRole('button', { name: 'Julkaise tapahtuma' })
  ).toBeDisabled();
});
