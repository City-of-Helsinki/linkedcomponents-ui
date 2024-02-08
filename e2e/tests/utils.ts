import 'dotenv/config';

export const LINKED_EVENTS_URL =
  process.env.REACT_APP_LINKED_EVENTS_URL ??
  'https://linkedevents.api.dev.hel.ninja/v1';
