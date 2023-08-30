export const ENV_URL =
  process.env.BROWSER_TESTS_ENV_URL ?? 'http://localhost:3000';
export const LINKED_EVENTS_URL =
  process.env.BROWSER_TESTS_LINKED_EVENTS_URL ??
  'https://linkedevents-api-dev.agw.arodevtest.hel.fi/v1';

export const getEnvUrl = (path = ''): string =>
  `${ENV_URL}${path?.startsWith('/') ? path : `/${path}`}`;

export const getLinkedEventsUrl = (path = ''): string =>
  `${LINKED_EVENTS_URL}${path?.startsWith('/') ? path : `/${path}`}`;
