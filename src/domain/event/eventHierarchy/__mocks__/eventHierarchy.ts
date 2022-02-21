import { MockedResponse } from '@apollo/client/testing';

import { EventsDocument, SuperEventType } from '../../../../generated/graphql';
import { fakeEvent, fakeEvents } from '../../../../utils/mockDataUtils';
import { TEST_PUBLISHER_ID } from '../../../organization/constants';
import { SUB_EVENTS_VARIABLES } from '../../constants';

const publisherId = TEST_PUBLISHER_ID;

const subSubSubEventFields = [{ id: 'subevent:1', name: 'Sub event 1' }];
const subSubSubEvents = fakeEvents(
  subSubSubEventFields.length,
  subSubSubEventFields.map(({ id, name }) => ({
    id,
    name: { fi: name },
    publisher: publisherId,
  }))
);

const subSubEventFields = [{ id: 'event:1', name: 'Event 1' }];
const subSubEvents = fakeEvents(
  subSubEventFields.length,
  subSubEventFields.map(({ id, name }) => ({
    id,
    name: { fi: name },
    publisher: publisherId,
    subEvents: subSubSubEvents.data,
    superEventType: SuperEventType.Recurring,
  }))
);

const subSubEventPage2Fields = [
  { id: 'event:2', name: 'Event 2' },
  { id: 'event:3', name: 'Event 3' },
  { id: 'event:4', name: 'Event 4' },
];
const subSubPage2Events = fakeEvents(
  subSubEventPage2Fields.length,
  subSubEventPage2Fields.map(({ id, name }) => ({
    id,
    name: { fi: name },
    publisher: publisherId,
  }))
);

const subEventFields = [{ id: 'recurring:1', name: 'Recurring event 1' }];
const subEvents = fakeEvents(
  subEventFields.length,
  subEventFields.map(({ id, name }) => ({
    id,
    name: { fi: name },
    publisher: publisherId,
    subEvents: subSubEvents.data,
    superEventType: SuperEventType.Umbrella,
  }))
);
const superEventId = 'superevent:1';
const superEventName = 'Super event 1';
const superEvent = fakeEvent({
  id: superEventId,
  name: { fi: superEventName },
  publisher: publisherId,
  superEventType: SuperEventType.Umbrella,
});

const eventId = 'umbrella:1';
const eventName = 'Umbrella event 1';
const event = fakeEvent({
  id: eventId,
  name: { fi: eventName },
  publisher: publisherId,
  subEvents: subEvents.data,
  superEvent: superEvent,
  superEventType: SuperEventType.Umbrella,
});

const subSubSubEventsVariables = {
  ...SUB_EVENTS_VARIABLES,
  superEvent: subSubEventFields[0].id,
};
const subSubSubEventsResponse = {
  data: {
    events: subSubSubEvents,
  },
};
const mockedSubSubSubEventsResponse: MockedResponse = {
  request: {
    query: EventsDocument,
    variables: subSubSubEventsVariables,
  },
  result: subSubSubEventsResponse,
};

const count = subSubEventFields.length + subSubEventPage2Fields.length;

const subSubEventsVariables = {
  ...SUB_EVENTS_VARIABLES,
  superEvent: subEventFields[0].id,
};
const subSubEventsResponse = {
  data: {
    events: {
      ...subSubEvents,
      meta: {
        ...subSubEvents.meta,
        count,
        next: 'http://localhost:8000/v1/event/?page=2',
      },
    },
  },
};
const mockedSubSubEventsResponse: MockedResponse = {
  request: {
    query: EventsDocument,
    variables: subSubEventsVariables,
  },
  result: subSubEventsResponse,
};

const subSubEventsPage2Variables = { ...subSubEventsVariables, page: 2 };
const subSubEventsPage2Response = {
  data: {
    events: {
      ...subSubPage2Events,
      meta: {
        ...subSubEvents.meta,
        count,
        previous: 'http://localhost:8000/v1/event/',
      },
    },
  },
};
const mockedSubSubEventsPage2Response: MockedResponse = {
  request: {
    query: EventsDocument,
    variables: subSubEventsPage2Variables,
  },
  result: subSubEventsPage2Response,
};

const subEventsVariables = {
  ...SUB_EVENTS_VARIABLES,
  superEvent: eventId,
};
const subEventsResponse = {
  data: {
    events: subEvents,
  },
};
const mockedSubEventsResponse: MockedResponse = {
  request: {
    query: EventsDocument,
    variables: subEventsVariables,
  },
  result: subEventsResponse,
};

export {
  event,
  eventName,
  mockedSubEventsResponse,
  mockedSubSubEventsPage2Response,
  mockedSubSubEventsResponse,
  mockedSubSubSubEventsResponse,
  subEventFields,
  subSubEventFields,
  subSubEventPage2Fields,
  subSubSubEventFields,
  superEventName,
};
