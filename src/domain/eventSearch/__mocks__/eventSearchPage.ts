import { MockedResponse } from '@apollo/react-testing';
import range from 'lodash/range';

import { EventsDocument, PlacesDocument } from '../../../generated/graphql';
import { fakeEvents, fakePlaces } from '../../../utils/mockDataUtils';
import {
  DEFAULT_EVENT_SORT,
  EVENT_LIST_INCLUDES,
  EVENTS_PAGE_SIZE,
} from '../../events/constants';

const searchText = 'search';

const eventsVariables = {
  createPath: undefined,
  end: null,
  eventType: [],
  include: EVENT_LIST_INCLUDES,
  page: 1,
  pageSize: EVENTS_PAGE_SIZE,
  location: [],
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

const placesVariables = {
  createPath: undefined,
  text: '',
};
const placesResponse = { data: { places: fakePlaces(0) } };
const mockedPlacesResponse: MockedResponse = {
  request: {
    query: PlacesDocument,
    variables: placesVariables,
  },
  result: placesResponse,
};

export {
  eventNames,
  events,
  mockedEventsResponse,
  mockedPlacesResponse,
  searchText,
};
