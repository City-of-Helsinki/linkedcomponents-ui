import { RequestLogger } from 'testcafe';

export const requestLogger = RequestLogger(
  'https://linkedevents-api.dev.hel.ninja/linkedevents-dev/v1',
  {
    logResponseHeaders: true,
  }
);
