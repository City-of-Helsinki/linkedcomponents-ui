import { RequestLogger } from 'testcafe';

import { LINKED_EVENTS_URL } from './settings';

export const requestLogger = RequestLogger(new RegExp(LINKED_EVENTS_URL), {
  logResponseHeaders: true,
});
