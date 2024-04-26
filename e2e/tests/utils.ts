import { BrowserContext } from '@playwright/test';

export const LINKED_EVENTS_URL =
  process.env.REACT_APP_LINKED_EVENTS_URL ??
  'https://linkedevents.api.dev.hel.ninja/v1';

export const encodedCookieConsents = () =>
  encodeURIComponent(
    JSON.stringify({
      tunnistamo: true,
      eventForm: true,
      registrationForm: true,
      signupForm: true,
      'city-of-helsinki-cookie-consents': true,
      'city-of-helsinki-consent-version': true,
      matomo: true,
    })
  );

export const setCookieConsent = async (context: BrowserContext) => {
  await context.addCookies([
    {
      name: 'city-of-helsinki-consent-version',
      value: '1',
      domain: process.env.E2E_TESTS_ENV_URL || 'linkedevents.dev.hel.ninja',
      path: '/',
    },
    {
      name: 'city-of-helsinki-cookie-consents',
      value: encodedCookieConsents(),
      domain: process.env.E2E_TESTS_ENV_URL || 'linkedevents.dev.hel.ninja',
      path: '/',
    },
  ]);
};
