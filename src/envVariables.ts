export const SWAGGER_URL =
  import.meta.env?.REACT_APP_SWAGGER_URL ??
  'https://dev.hel.fi/apis/linkedevents';

export const SWAGGER_SCHEMA_URL =
  import.meta.env?.REACT_APP_SWAGGER_SCHEMA_URL ||
  'https://raw.githubusercontent.com/City-of-Helsinki/api-linked-events/master/linked-events.swagger.yaml';

export const LINKED_EVENTS_SYSTEM_DATA_SOURCE =
  import.meta.env?.REACT_APP_LINKED_EVENTS_SYSTEM_DATA_SOURCE || 'helsinki';
