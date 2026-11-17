import { expect, Locator, Page, test } from '@playwright/test';

import { checkA11y } from '../a11y/checkA11y';
import { acceptCookieConcent } from './utils';

/*
 * Accessibility checks for pages available without login. Logged-in pages need test users per
 * role and are added once the common test login exists.
 *
 * The app runs against the shared dev Linked Events API. Scans avoid content that depends on
 * changing dev data where possible (search results use a query with no matches).
 */

/**
 * Opens a page, accepts the cookie banner and waits until the page content has loaded. Not every
 * page has an h1, so this waits for the main landmark (or the given locator) and pending requests.
 */
const openPage = async (
  page: Page,
  path: string,
  ready: (page: Page) => Locator = (p) => p.locator('main').first()
): Promise<void> => {
  await page.goto(path);
  await acceptCookieConcent(page);
  await expect(ready(page)).toBeVisible();
  await page.waitForLoadState('networkidle');
};

const cookieSettingsReady = (page: Page) =>
  page.getByRole('heading', {
    name: 'Tietoa sivustolla käytetyistä evästeistä',
  });

/*
 * Axe scans run in Chromium only: results can differ slightly between browser engines, and the
 * baseline is shared per scan. Keyboard behaviour is tested in every configured browser.
 */
test.describe('Accessibility scans', () => {
  test.skip(
    ({ browserName }) => browserName !== 'chromium',
    'axe scans run in Chromium only'
  );

  test('front page with cookie consent', async ({ page }, testInfo) => {
    await page.goto('/fi');
    await expect(
      page.getByRole('button', { name: /hyväksy kaikki evästeet/i })
    ).toBeVisible();

    await checkA11y(page, testInfo, 'front page with cookie consent');
  });

  for (const lang of ['fi', 'en'] as const) {
    test(`front page (${lang})`, async ({ page }, testInfo) => {
      await openPage(page, '/fi');
      if (lang !== 'fi') {
        await page.goto(`/${lang}`);
        await expect(page.locator('html')).toHaveAttribute('lang', lang);
      }

      await checkA11y(page, testInfo, `front page (${lang})`);
    });
  }

  test('event search with no results', async ({ page }, testInfo) => {
    await openPage(page, '/fi/search');
    await page.getByPlaceholder('Hae tapahtumia').fill('xxx zzz yyy 123');
    await page.locator('button').filter({ hasText: 'Etsi tapahtumia' }).click();
    await expect(page.getByText('0 tapahtumaa', { exact: true })).toBeVisible();

    await checkA11y(page, testInfo, 'event search with no results');
  });

  test('event search with place filter open', async ({ page }, testInfo) => {
    await openPage(page, '/fi/search');
    await page.getByLabel('Etsi tapahtumapaikkaa').click();
    await expect(page.getByPlaceholder('Hae', { exact: true })).toBeVisible();

    await checkA11y(page, testInfo, 'event search with place filter open');
  });

  test('my events when logged out', async ({ page }, testInfo) => {
    await page.goto('/fi/events');
    await acceptCookieConcent(page);
    await expect(
      page.getByText(
        'Sinun täytyy olla kirjautuneena sisään tarkastellaksesi tätä sisältöä'
      )
    ).toBeVisible();

    await checkA11y(page, testInfo, 'my events when logged out');
  });

  test('create event form when logged out', async ({ page }, testInfo) => {
    await openPage(page, '/fi/events/create');
    await expect(
      page.getByRole('heading', { name: 'Valitse tapahtumatyyppi' })
    ).toBeVisible();

    await checkA11y(page, testInfo, 'create event form when logged out');
  });

  const staticPages = [
    ['instructions', '/fi/help/instructions/events'],
    ['faq', '/fi/help/instructions/faq'],
    ['source code and api', '/fi/help/technology/source-code'],
    ['api documentation', '/fi/help/technology/documentation'],
    ['service information', '/fi/help/support/service-information'],
    ['terms of use', '/fi/help/support/terms-of-use'],
    ['accessibility statement', '/fi/accessibility-statement'],
    ['page not found', '/fi/this-page-does-not-exist'],
  ] as const;

  for (const [name, path] of staticPages) {
    test(name, async ({ page }, testInfo) => {
      await openPage(page, path);

      await checkA11y(page, testInfo, name);
    });
  }

  test('cookie settings', async ({ page }, testInfo) => {
    await openPage(page, '/fi/cookies', cookieSettingsReady);

    await checkA11y(page, testInfo, 'cookie settings');
  });

  test('contact form', async ({ page }, testInfo) => {
    await openPage(page, '/fi/help/support/contact');

    await checkA11y(page, testInfo, 'contact form');
  });

  test('contact form with validation errors', async ({ page }, testInfo) => {
    await openPage(page, '/fi/help/support/contact');
    // Submitting the empty form only shows the errors; nothing is sent.
    await page.getByRole('button', { name: 'Lähetä' }).click();
    await expect(
      page.getByText('Tämä kenttä on pakollinen').first()
    ).toBeVisible();

    await checkA11y(page, testInfo, 'contact form with validation errors');
  });

  test.describe('mobile', () => {
    test.use({ viewport: { width: 375, height: 812 } });

    test('mobile menu open', async ({ page }, testInfo) => {
      await openPage(page, '/fi');
      await page.getByRole('button', { name: 'Valikko' }).click();
      await expect(
        page.getByRole('link', { name: 'Etsi tapahtumia' }).first()
      ).toBeVisible();

      await checkA11y(page, testInfo, 'mobile menu open');
    });
  });
});

test.describe('Keyboard', () => {
  test('skip link moves focus to the main content', async ({ page }) => {
    await openPage(page, '/fi');
    await page.locator('body').focus();

    await page.keyboard.press('Tab');
    const skipLink = page.getByRole('link', { name: 'Siirry sisältöön' });
    await expect(skipLink).toBeFocused();

    await page.keyboard.press('Enter');
    await expect
      .poll(() =>
        page.evaluate(
          () => !!document.activeElement?.closest('#maincontent, main')
        )
      )
      .toBe(true);
  });

  test('contact form moves focus to the first invalid field on submit', async ({
    page,
  }) => {
    await openPage(page, '/fi/help/support/contact');
    const submit = page.getByRole('button', { name: 'Lähetä' });
    await submit.focus();
    await page.keyboard.press('Enter');

    const name = page.locator('#name');
    await expect(name).toBeFocused();
    await expect(name).toHaveAccessibleDescription(/Tämä kenttä on pakollinen/);
  });

  // Known issue: the cookie settings route renders the HDS CookieSettingsPage without the app's
  // page layout, so the page has no main landmark and the skip link has no target (WCAG 1.3.1,
  // 2.4.1). axe does not flag this: its landmark rules are best-practice, not WCAG tags.
  // TODO: add ticket id. Remove test.fail() once fixed; the test then guards the fix.
  test('cookie settings page has a main landmark for the skip link', async ({
    page,
  }) => {
    test.fail();
    await openPage(page, '/fi/cookies', cookieSettingsReady);

    await expect(page.getByRole('main')).toHaveCount(1);
    await expect(page.locator('#maincontent')).toHaveCount(1);
  });
});
