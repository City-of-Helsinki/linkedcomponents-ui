/* eslint-disable no-undef */
import { normalizeKeys } from 'object-keys-normalizer';

import {
  EventFieldsFragment,
  OrganizationFieldsFragment,
  PlaceFieldsFragment,
} from '../../src/generated/graphql';
import { normalizeKey } from '../../src/utils/apolloUtils';
import { getLinkedEventsUrl } from '../utils/settings';

const findEventsRequest = (r: LoggedRequest) =>
  r.request.method === 'get' &&
  r.request.url.startsWith(getLinkedEventsUrl('event/?'));

export const getEvents = async (
  t: TestController,
  requestLogger: RequestLogger
): Promise<EventFieldsFragment[]> => {
  await t
    .expect(requestLogger.requests.find(findEventsRequest))
    .notEql(undefined, { timeout: 20000 });
  const eventsResponse = requestLogger.requests.find(findEventsRequest);

  return JSON.parse(eventsResponse.response.body as string).data.map((event) =>
    normalizeKeys(event, normalizeKey)
  );
};

export const getEventsCount = async (
  t: TestController,
  requestLogger: RequestLogger
): Promise<EventFieldsFragment[]> => {
  await t
    .expect(requestLogger.requests.find(findEventsRequest))
    .notEql(undefined, { timeout: 20000 });
  const eventsResponse = requestLogger.requests.find(findEventsRequest);

  return JSON.parse(eventsResponse.response.body as string).meta.count;
};

const findPlaceRequest = (atId: string) => (r: LoggedRequest) =>
  r.request.method === 'get' && r.request.url.startsWith(atId);

export const getPlace = async (
  t: TestController,
  requestLogger: RequestLogger,
  event: EventFieldsFragment
): Promise<PlaceFieldsFragment> => {
  // First try to find place from the places request response
  const places = await getPlaces(t, requestLogger);
  const place = places.find((p) => p.atId === event.location.atId);
  if (place) {
    return place;
  }

  await t
    .expect(requestLogger.requests.find(findPlaceRequest(event.location.atId)))
    .ok();
  const placeResponse = requestLogger.requests.find(
    findPlaceRequest(event.location.atId)
  );

  return normalizeKeys(
    JSON.parse(placeResponse.response.body as string),
    normalizeKey
  );
};

const findPlacesRequest = (r: LoggedRequest) =>
  r.request.method === 'get' &&
  r.request.url.startsWith(getLinkedEventsUrl('place/?'));

export const getPlaces = async (
  t: TestController,
  requestLogger: RequestLogger
): Promise<PlaceFieldsFragment[]> => {
  await t.expect(requestLogger.requests.find(findPlacesRequest)).ok();
  const placesResponse = requestLogger.requests.find(findPlacesRequest);

  return JSON.parse(placesResponse.response.body as string).data.map((place) =>
    normalizeKeys(place, normalizeKey)
  );
};

const findPublisherRequest = (publisher: string) => (r: LoggedRequest) =>
  r.request.method === 'get' &&
  r.request.url.startsWith(getLinkedEventsUrl(`organization/${publisher}`));

export const getPublisher = async (
  t: TestController,
  requestLogger: RequestLogger,
  event: EventFieldsFragment
): Promise<OrganizationFieldsFragment | undefined> => {
  await t
    .expect(requestLogger.requests.find(findPublisherRequest(event.publisher)))
    .ok();
  const publisherResponse = requestLogger.requests.find(
    findPublisherRequest(event.publisher)
  );

  return normalizeKeys(
    JSON.parse(publisherResponse.response.body as string),
    normalizeKey
  );
};
