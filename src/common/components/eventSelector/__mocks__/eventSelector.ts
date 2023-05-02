import { TEST_EVENT_ID } from '../../../../domain/event/constants';
import { EVENT_SORT_OPTIONS } from '../../../../domain/events/constants';
import { EventDocument, EventsDocument } from '../../../../generated/graphql';
import { fakeEvent, fakeEvents } from '../../../../utils/mockDataUtils';

const eventId = TEST_EVENT_ID;
const eventName = 'Event name';

const event = fakeEvent({ id: eventId, name: { fi: eventName } });
const eventVariables = { createPath: undefined, id: eventId };
const eventResponse = { data: { event: event } };
const mockedEventResponse = {
  request: { query: EventDocument, variables: eventVariables },
  result: eventResponse,
};

const filteredEventsVariables = {
  createPath: undefined,
  sort: EVENT_SORT_OPTIONS.NAME,
  superEventType: ['umbrella'],
  text: '',
};
const filteredEvents = fakeEvents(1, [event]);
const filteredEventsResponse = { data: { events: filteredEvents } };
const mockedFilteredEventsResponse = {
  request: { query: EventsDocument, variables: filteredEventsVariables },
  result: filteredEventsResponse,
};

export {
  event,
  eventName,
  filteredEvents,
  mockedEventResponse,
  mockedFilteredEventsResponse,
};
