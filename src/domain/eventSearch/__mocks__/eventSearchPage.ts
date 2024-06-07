import { MockedResponse } from '@apollo/client/testing';
import range from 'lodash/range';

import {
  EventsDocument,
  PlaceDocument,
  PlaceFieldsFragment,
  PlacesDocument,
} from '../../../generated/graphql';
import { fakeEvents, fakePlaces } from '../../../utils/mockDataUtils';
import {
  DEFAULT_EVENT_SORT,
  EVENT_LIST_INCLUDES,
  EVENTS_PAGE_SIZE,
} from '../../events/constants';
import { PLACES_SORT_ORDER } from '../../place/constants';

const searchText = 'search';

const eventsVariables = {
  createPath: undefined,
  end: null,
  eventStatus: [],
  eventType: [],
  include: EVENT_LIST_INCLUDES,
  location: [],
  page: 1,
  pageSize: EVENTS_PAGE_SIZE,
  start: null,
  text: searchText,
  sort: DEFAULT_EVENT_SORT,
};
const eventNames = range(1, EVENTS_PAGE_SIZE + 1).map((n) => `Event name ${n}`);
const events = fakeEvents(
  EVENTS_PAGE_SIZE,
  eventNames.map((name) => ({
    name: { fi: name },
    publisher: null,
  }))
);
const eventsResponse = { data: { events } };
const mockedEventsResponse: MockedResponse = {
  request: {
    query: EventsDocument,
    variables: eventsVariables,
  },
  result: eventsResponse,
};

const placeOverrides = range(1, 3).map((i) => ({
  id: `place:${i}`,
  name: `Place name ${i}`,
}));

const places = fakePlaces(
  placeOverrides.length,
  placeOverrides.map(({ id, name }) => ({ id, name: { fi: name } }))
);
const placesVariables = {
  createPath: undefined,
  sort: PLACES_SORT_ORDER.NAME,
  text: '',
};
const placesResponse = { data: { places } };
const mockedPlacesResponse: MockedResponse = {
  request: { query: PlacesDocument, variables: placesVariables },
  result: placesResponse,
};

const place = places.data[0] as PlaceFieldsFragment;
const placeId = place.id as string;
const placeName = place.name?.fi as string;

const placeVariables = { id: placeId, createPath: undefined };
const placeResponse = { data: { place } };
const mockedPlaceResponse: MockedResponse = {
  request: { query: PlaceDocument, variables: placeVariables },
  result: placeResponse,
};

export {
  eventNames,
  events,
  mockedEventsResponse,
  mockedPlaceResponse,
  mockedPlacesResponse,
  placeId,
  placeName,
  placeOverrides,
  searchText,
};
