import {
  EventDocument,
  EventsDocument,
  PublicationStatus,
} from '../../../../../generated/graphql';
import { fakeEvent, fakeEvents } from '../../../../../utils/mockDataUtils';
import { TEST_EVENT_ID } from '../../../../event/constants';
import { EVENT_SORT_OPTIONS } from '../../../../events/constants';

const eventId = TEST_EVENT_ID;
const eventName = 'Event name';

const eventRegistrationValues = {
  audienceMaxAge: 18,
  audienceMinAge: 12,
  enrolmentEndTime: '2022-12-10T12:00:00.000000Z',
  enrolmentStartTime: '2022-12-01T09:00:00.000000Z',
  maximumAttendeeCapacity: 10,
  minimumAttendeeCapacity: 5,
};

const event = fakeEvent({
  id: eventId,
  name: { fi: eventName },
  ...eventRegistrationValues,
});
const eventVariables = { createPath: undefined, id: eventId };
const eventResponse = { data: { event: event } };
const mockedEventResponse = {
  request: { query: EventDocument, variables: eventVariables },
  result: eventResponse,
};

const eventsVariables = {
  createPath: undefined,
  publicationStatus: PublicationStatus.Public,
  registration: false,
  registrationAdminUser: true,
  start: 'now',
  sort: EVENT_SORT_OPTIONS.NAME,
  superEventType: ['none'],
  text: '',
};

const events = fakeEvents(1, [event]);
const eventsResponse = { data: { events: events } };
const mockedEventsResponse = {
  request: { query: EventsDocument, variables: eventsVariables },
  result: eventsResponse,
};

const filteredEventsVariables = {
  ...eventsVariables,
  text: 'Event name 13.7.2020 –',
};

const mockedFilteredEventsResponse = {
  request: { query: EventsDocument, variables: filteredEventsVariables },
  result: eventsResponse,
};

export {
  event,
  eventName,
  mockedEventResponse,
  mockedEventsResponse,
  mockedFilteredEventsResponse,
};
