import { normalizeKeys } from 'object-keys-normalizer';
import { RequestLogger } from 'testcafe';

import {
  EventFieldsFragment,
  OrganizationFieldsFragment,
  PlaceFieldsFragment,
} from '../../src/generated/graphql';
import { normalizeKey } from '../../src/utils/apolloUtils';
import { getLinkedEventsUrl } from '../utils/settings';

export const getEvents = (
  requestLogger: RequestLogger
): EventFieldsFragment[] => {
  const eventsResponse = requestLogger.requests.find(
    (r) =>
      r.request.method === 'get' &&
      r.request.url.startsWith(getLinkedEventsUrl('event/?'))
  );

  return eventsResponse?.response.body
    ? JSON.parse(eventsResponse.response.body as string).data.map((event) =>
        normalizeKeys(event, normalizeKey)
      )
    : [];
};

export const getEventsCount = (
  requestLogger: RequestLogger
): EventFieldsFragment[] => {
  const eventsResponse = requestLogger.requests.find(
    (r) =>
      r.request.method === 'get' &&
      r.request.url.startsWith(getLinkedEventsUrl('event/?'))
  );

  return eventsResponse?.response.body
    ? JSON.parse(eventsResponse.response.body as string).meta.count
    : 0;
};

export const getPlace = (
  requestLogger: RequestLogger,
  event: EventFieldsFragment
): PlaceFieldsFragment | undefined => {
  const eventsResponse = requestLogger.requests.find((r) => {
    return (
      r.request.method === 'get' &&
      r.request.url.startsWith(event.location.atId)
    );
  });

  return eventsResponse?.response.body
    ? normalizeKeys(
        JSON.parse(eventsResponse.response.body as string),
        normalizeKey
      )
    : undefined;
};

export const getPlaces = (
  requestLogger: RequestLogger
): PlaceFieldsFragment[] => {
  const eventsResponse = requestLogger.requests.find(
    (r) =>
      r.request.method === 'get' &&
      r.request.url.startsWith(getLinkedEventsUrl('place/?'))
  );

  return eventsResponse?.response.body
    ? JSON.parse(eventsResponse.response.body as string).data.map((event) =>
        normalizeKeys(event, normalizeKey)
      )
    : [];
};

export const getPublisher = (
  requestLogger: RequestLogger,
  event: EventFieldsFragment
): OrganizationFieldsFragment | undefined => {
  const eventsResponse = requestLogger.requests.find((r) => {
    return (
      r.request.method === 'get' &&
      r.request.url.startsWith(
        getLinkedEventsUrl(`organization/${event.publisher}`)
      )
    );
  });

  return eventsResponse?.response.body
    ? normalizeKeys(
        JSON.parse(eventsResponse.response.body as string),
        normalizeKey
      )
    : undefined;
};
