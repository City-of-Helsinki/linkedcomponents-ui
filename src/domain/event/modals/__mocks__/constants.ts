import { EventsDocument, SuperEventType } from '../../../../generated/graphql';
import { fakeEvent, fakeEvents } from '../../../../utils/mockDataUtils';

export const subSubEventNames = ['Event 1', 'Event 2'];
const subSubEvents = fakeEvents(
  subSubEventNames.length,
  subSubEventNames.map((name) => ({
    name: { fi: name },
  }))
);

const subEventId = 'subevent:1';
export const subEventName = 'Recurring event name';
const subEvents = fakeEvents(1, [
  {
    id: subEventId,
    name: { fi: subEventName },
    subEvents: subSubEvents.data,
    superEventType: SuperEventType.Recurring,
  },
]);

const eventId = 'event:1';
export const eventName = 'Umbrella event name';
export const event = fakeEvent({
  id: eventId,
  name: { fi: eventName },
  subEvents: subEvents.data,
  superEventType: SuperEventType.Umbrella,
});

const baseVariables = {
  createPath: undefined,
  include: ['audience', 'keywords', 'location', 'sub_events', 'super_event'],
  pageSize: 100,
  showAll: true,
  sort: 'start_time',
  superEvent: subEventId,
};
const subEventsVariables = {
  ...baseVariables,
  superEvent: eventId,
};
const subSubEventsVariables = {
  ...baseVariables,
  superEvent: subEventId,
};

const subEventsResponse = { data: { events: subEvents } };
const subSubEventsResponse = { data: { events: subSubEvents } };

export const mocks = [
  {
    request: {
      query: EventsDocument,
      variables: subEventsVariables,
    },
    result: subEventsResponse,
  },
  {
    request: {
      query: EventsDocument,
      variables: subSubEventsVariables,
    },
    result: subSubEventsResponse,
  },
];
