/* eslint-disable no-undef */
import { normalizeKeys } from 'object-keys-normalizer';

import {
  EventFieldsFragment,
  OrganizationFieldsFragment,
  PlaceFieldsFragment,
} from '../../src/generated/graphql';
import { normalizeKey } from '../../src/utils/apolloUtils';
import getValue from '../../src/utils/getValue';
import { getLinkedEventsUrl } from '../utils/settings';
import { waitRequest } from '../utils/utils';

const findEventsRequest = (r: LoggedRequest) =>
  r.request.method === 'get' &&
  r.response &&
  r.request.url.startsWith(getLinkedEventsUrl('event/?'));

export const getEvents = async (
  t: TestController,
  requestLogger: RequestLogger
): Promise<EventFieldsFragment[]> => {
  const eventsResponse = await waitRequest({
    findFn: findEventsRequest,
    requestLogger,
    t,
    timeout: 20000,
  });

  return JSON.parse(eventsResponse.response.body.toString()).data.map((event) =>
    normalizeKeys(event, normalizeKey)
  );
};

export const getEventsCount = async (
  t: TestController,
  requestLogger: RequestLogger
): Promise<EventFieldsFragment[]> => {
  const eventsResponse = await waitRequest({
    findFn: findEventsRequest,
    requestLogger,
    t,
    timeout: 20000,
  });

  return JSON.parse(eventsResponse.response.body.toString()).meta.count;
};

const findPlaceRequest = (atId: string) => (r: LoggedRequest) =>
  r.request.method === 'get' && r.response && r.request.url.startsWith(atId);

export const getPlace = async (
  t: TestController,
  requestLogger: RequestLogger,
  event: EventFieldsFragment
): Promise<PlaceFieldsFragment> => {
  // First try to find place from the places request response
  const places = await getPlaces(t, requestLogger);
  const place = places.find((p) => p.atId === event.location?.atId);
  if (place) {
    return place;
  }

  const findFn = findPlaceRequest(getValue(event.location?.atId, ''));

  const placeResponse = await waitRequest({
    findFn,
    requestLogger,
    t,
  });

  return normalizeKeys(
    JSON.parse(placeResponse.response.body.toString()),
    normalizeKey
  );
};

const findPlacesRequest = (r: LoggedRequest) =>
  r.request.method === 'get' &&
  r.response &&
  r.request.url.startsWith(getLinkedEventsUrl('place/?'));

export const getPlaces = async (
  t: TestController,
  requestLogger: RequestLogger
): Promise<PlaceFieldsFragment[]> => {
  const placesResponse = await waitRequest({
    findFn: findPlacesRequest,
    requestLogger,
    t,
  });

  return JSON.parse(placesResponse.response.body.toString()).data.map((place) =>
    normalizeKeys(place, normalizeKey)
  );
};

const findPublisherRequest = (publisher: string) => (r: LoggedRequest) =>
  r.request.method === 'get' &&
  r.response &&
  r.request.url.startsWith(getLinkedEventsUrl(`organization/${publisher}`));

export const getPublisher = async (
  t: TestController,
  requestLogger: RequestLogger,
  event: EventFieldsFragment
): Promise<OrganizationFieldsFragment | undefined> => {
  const findFn = findPublisherRequest(getValue(event.publisher, ''));

  const publisherResponse = await waitRequest({
    findFn,
    requestLogger,
    t,
  });

  return normalizeKeys(
    JSON.parse(publisherResponse.response.body.toString()),
    normalizeKey
  );
};
