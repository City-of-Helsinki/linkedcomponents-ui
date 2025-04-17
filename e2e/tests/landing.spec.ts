import { expect, test } from '@playwright/test';

import { acceptCookieConcent } from './utils';

test.describe('Landing page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/fi');
    await acceptCookieConcent(page);
  });

  test('Footer links are visible', async ({ page }) => {
    await expect
      .soft(
        page
          .getByRole('contentinfo')
          .getByRole('link', { name: 'Omat tapahtumat' })
      )
      .toBeVisible();
    await expect
      .soft(
        page
          .getByRole('contentinfo')
          .getByRole('link', { name: 'Etsi tapahtumia' })
      )
      .toBeVisible();
    await expect
      .soft(
        page
          .getByRole('contentinfo')
          .getByRole('link', { name: 'Tietoa palvelusta' })
      )
      .toBeVisible();
    await expect
      .soft(page.getByRole('link', { name: 'Tietosuoja' }))
      .toBeVisible();
    await expect
      .soft(page.getByRole('link', { name: 'Saavutettavuusseloste' }))
      .toBeVisible();
  });

  test('English translations', async ({ page }) => {
    await page.getByRole('button', { name: 'In English' }).click();

    await expect
      .soft(
        page.locator('#page-header').getByRole('link', { name: 'My events' })
      )
      .toBeVisible();
    await expect
      .soft(
        page
          .locator('#page-header')
          .getByRole('link', { name: 'Search events' })
      )
      .toBeVisible();
    await expect
      .soft(page.locator('#page-header').getByRole('link', { name: 'Support' }))
      .toBeVisible();

    await expect.soft(page.getByPlaceholder('Search events')).toBeVisible();
    await expect
      .soft(page.getByRole('button', { name: 'Sign in' }))
      .toBeVisible();
    await expect
      .soft(page.getByRole('button', { name: 'Add new event' }))
      .toBeVisible();
    await expect
      .soft(
        page.getByRole('heading', { name: 'Events and hobbies in Helsinki' })
      )
      .toBeVisible();
    await expect
      .soft(page.getByRole('heading', { name: 'Helsinki event sites' }))
      .toBeVisible();
    await expect
      .soft(page.getByRole('link', { name: 'Front page' }))
      .toBeVisible();
    await expect
      .soft(page.getByRole('link', { name: 'Instructions', exact: true }))
      .toBeVisible();
    await expect
      .soft(page.getByRole('link', { name: 'Technology' }))
      .toBeVisible();
    await expect
      .soft(page.getByRole('link', { name: 'Data Protection' }))
      .toBeVisible();
    await expect
      .soft(page.getByRole('link', { name: 'Accessibility Statement' }))
      .toBeVisible();
    await expect
      .soft(
        page.getByRole('contentinfo').getByRole('link', { name: 'My events' })
      )
      .toBeVisible();
    await expect
      .soft(
        page
          .getByRole('contentinfo')
          .getByRole('link', { name: 'Information about the service' })
      )
      .toBeVisible();
  });

  test('Header tabs links are visible', async ({ page }) => {
    await expect(
      page
        .locator('#page-header')
        .getByRole('link', { name: 'Omat tapahtumat' })
    ).toBeVisible();
    await expect(
      page
        .locator('#page-header')
        .getByRole('link', { name: 'Etsi tapahtumia' })
    ).toBeVisible();
    await expect(
      page.locator('#page-header').getByRole('link', { name: 'Tuki' })
    ).toBeVisible();
  });

  test('Add new event button functionality', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Tapahtumatyyppi' })
    ).toBeHidden();
    await page.getByRole('button', { name: 'Lisää uusi tapahtuma' }).click();
    expect(page.url()).toContain('events/create');
  });

  test('Search button functionality', async ({ page }) => {
    await page.getByTestId('landing-page-search-button').click();
    await expect(page).toHaveURL(/\/fi\/search/);
    await expect(page.getByTestId('event-search-panel')).toBeVisible();
  });

  test('Verify headers, links, and buttons on landing page', async ({
    page,
  }) => {
    await expect(
      page.getByRole('button', { name: 'Lisää uusi tapahtuma' })
    ).toBeVisible();

    // headings
    await expect(
      page.getByRole('heading', { name: 'Helsingin tapahtumat ja' })
    ).toBeVisible();

    // search
    await expect(page.getByPlaceholder('Hae tapahtumia')).toBeVisible();
    await expect(page.getByTestId('landing-page-search-button')).toBeVisible();

    // Helsingin tapahtumasivustot section
    await expect(
      page.getByRole('link', { name: 'MyHelsinki.fi' })
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'tapahtumat.hel.fi' })
    ).toBeVisible();

    // Action bar
    await expect(
      page.getByRole('link', { name: 'Helsingin kaupunki - logo' })
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'Suomeksi' })).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'In English' })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Kirjaudu sisään' })
    ).toBeVisible();
  });

  test('Clicking on "Lisää uusi tapahtuma" button should navigate to the create event page', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Lisää uusi tapahtuma' }).click();
    await expect(page).toHaveURL('fi/events/create');
  });
});
