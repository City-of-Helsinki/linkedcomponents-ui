import { EventsDocument, SuperEventType } from '../../../../generated/graphql';
import { fakeEvent, fakeEvents } from '../../../../utils/mockDataUtils';
import { SUB_EVENTS_VARIABLES } from '../../constants';

const eventId = 'umbrella:1';
const subEventIds = ['recurring:1'];
const subSubEventIds = ['event:1'];
const subSubEventPage2Ids = ['event:2', 'event:3', 'event:4'];
const subSubSubEventIds = ['subevent:1'];
const subSubSubEvents = fakeEvents(
  subSubSubEventIds.length,
  subSubSubEventIds.map((id) => ({ id }))
);
const subSubEvents = fakeEvents(
  subSubEventIds.length,
  subSubEventIds.map((id) => ({
    id,
    subEvents: subSubSubEvents.data,
    superEventType: SuperEventType.Recurring,
  }))
);

const subSubPage2Events = fakeEvents(
  subSubEventPage2Ids.length,
  subSubEventPage2Ids.map((id) => ({ id }))
);

const subEvents = fakeEvents(
  subEventIds.length,
  subEventIds.map((id) => ({
    id,
    subEvents: subSubEvents.data,
    superEventType: SuperEventType.Umbrella,
  }))
);

const event = fakeEvent({
  id: eventId,
  subEvents: subEvents.data,
  superEventType: SuperEventType.Umbrella,
});

const subEventsResponse = { data: { events: subEvents } };

const subEventsVariables = {
  ...SUB_EVENTS_VARIABLES,
  superEvent: eventId,
};

const mockedSubEventsResponse = {
  request: { query: EventsDocument, variables: subEventsVariables },
  result: subEventsResponse,
};

const subSubEventsVariables = {
  ...SUB_EVENTS_VARIABLES,
  superEvent: subEventIds[0],
};

const count = subSubEventIds.length + subSubEventPage2Ids.length;
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

const mockedSubSubEventsResponse = {
  request: { query: EventsDocument, variables: subSubEventsVariables },
  result: subSubEventsResponse,
};

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

const mockedSubSubEventsPage2Response = {
  request: {
    query: EventsDocument,
    variables: { ...subSubEventsVariables, page: 2 },
  },
  result: subSubEventsPage2Response,
};

const subSubSubEventsResponse = { data: { events: subSubSubEvents } };

const subSubSubEventsVariables = {
  ...SUB_EVENTS_VARIABLES,
  superEvent: subSubEventIds[0],
};

const mockedSubSubSubEventsResponse = {
  request: { query: EventsDocument, variables: subSubSubEventsVariables },
  result: subSubSubEventsResponse,
};

export {
  event,
  eventId,
  mockedSubEventsResponse,
  mockedSubSubEventsPage2Response,
  mockedSubSubEventsResponse,
  mockedSubSubSubEventsResponse,
  subEventIds,
  subSubEventIds,
  subSubEventPage2Ids,
  subSubSubEventIds,
};
