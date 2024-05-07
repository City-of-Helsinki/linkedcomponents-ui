export const SWAGGER_URL =
  import.meta.env?.REACT_APP_SWAGGER_URL ??
  'https://dev.hel.fi/apis/linkedevents';

export const LINKED_EVENTS_SYSTEM_DATA_SOURCE =
  import.meta.env?.REACT_APP_LINKED_EVENTS_SYSTEM_DATA_SOURCE || 'helsinki';

export const ALLOWED_SUBSTITUTE_USER_DOMAINS =
  import.meta.env.REACT_APP_ALLOWED_SUBSTITUTE_USER_DOMAINS?.split(',') ?? [
    'hel.fi',
  ];
