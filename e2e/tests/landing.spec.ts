import { expect, test } from '@playwright/test';

test.describe('Landing page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/fi');
  });

  test('Footer links work', async ({ page }) => {
    await expect(
      page
        .getByRole('contentinfo')
        .getByRole('link', { name: 'Omat tapahtumat' })
    ).toBeVisible();
    await expect(
      page
        .getByRole('contentinfo')
        .getByRole('link', { name: 'Etsi tapahtumia' })
    ).toBeVisible();
    await expect(
      page.getByRole('contentinfo').getByRole('link', { name: 'Tuki' })
    ).toBeVisible();
    await expect(page.getByRole('link', { name: 'Tietosuoja' })).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Saavutettavuusseloste' })
    ).toBeVisible();
  });

  test('English translations', async ({ page }) => {
    await page.getByRole('button', { name: 'In English' }).click();

    await expect(
      page.locator('#page-header').getByRole('link', { name: 'My events' })
    ).toBeVisible();
    await expect(
      page.locator('#page-header').getByRole('link', { name: 'Search events' })
    ).toBeVisible();
    await expect(
      page.locator('#page-header').getByRole('link', { name: 'Support' })
    ).toBeVisible();

    await expect(page.getByPlaceholder('Search events')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Add new event' })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Events and hobbies in Helsinki' })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Helsinki event sites' })
    ).toBeVisible();
    await expect(page.getByRole('link', { name: 'Front page' })).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Instructions', exact: true })
    ).toBeVisible();
    await expect(page.getByRole('link', { name: 'Technology' })).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Service features' })
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Data Protection' })
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Accessibility Statement' })
    ).toBeVisible();
    await expect(
      page.getByRole('contentinfo').getByRole('link', { name: 'My events' })
    ).toBeVisible();
    await expect(
      page.getByRole('contentinfo').getByRole('link', { name: 'Support' })
    ).toBeVisible();
  });

  test('Header tabs field work', async ({ page }) => {
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

  test('Add new event button', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Tapahtumatyyppi' })
    ).toBeHidden();
    await page.getByRole('button', { name: 'Lisää uusi tapahtuma' }).click();
    expect(page.url()).toContain('events/create');
  });

  test('search button', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Etsi tapahtumia' })
    ).toBeHidden();
    await page.getByTestId('landing-page-search-button').click();
    await expect(
      page.getByRole('heading', { name: 'Etsi tapahtumia' })
    ).toBeVisible();
  });

  test('headers, links and buttons', async ({ page }) => {
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

  test('create new event button', async ({ page }) => {
    await expect(
      page.getByRole('button', { name: 'Lisää uusi tapahtuma' })
    ).toBeEnabled();
    await page.getByRole('button', { name: 'Lisää uusi tapahtuma' }).click();
    await expect(page).toHaveURL('fi/events/create');
  });

  test('cookies', async ({ page }) => {
    await expect(
      page.getByTestId('cookie-consent-approve-button')
    ).toBeEnabled();
    await expect(
      page.getByTestId('cookie-consent-approve-required-button')
    ).toBeEnabled();
  });
});
