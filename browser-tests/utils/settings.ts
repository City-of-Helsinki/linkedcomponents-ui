export const ENV_URL =
  process.env.BROWSER_TESTS_LOCAL_ENV_URL ?? 'http://localhost:3000';
export const LINKED_EVENTS_URL =
  process.env.REACT_APP_LINKED_EVENTS_URL ??
  'https://linkedevents-api.dev.hel.ninja/linkedevents-dev/v1';

export const getEnvUrl = (path = ''): string =>
  `${ENV_URL}${path?.startsWith('/') ? path : `/${path}`}`;

export const getLinkedEventsUrl = (path = ''): string =>
  `${LINKED_EVENTS_URL}${path?.startsWith('/') ? path : `/${path}`}`;
