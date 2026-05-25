import { getEnvValue } from './common/utils/envUtils';

/* istanbul ignore next */
export const SWAGGER_URL =
  getEnvValue('REACT_APP_SWAGGER_URL') ??
  'https://api.hel.fi/linkedevents/api-docs/';

/* istanbul ignore next */
export const LINKED_EVENTS_SYSTEM_DATA_SOURCE =
  getEnvValue('REACT_APP_LINKED_EVENTS_SYSTEM_DATA_SOURCE') || 'helsinki';

/* istanbul ignore next */
export const ALLOWED_SUBSTITUTE_USER_DOMAINS = getEnvValue(
  'REACT_APP_ALLOWED_SUBSTITUTE_USER_DOMAINS'
)?.split(',') ?? ['hel.fi'];
