import { EventsDocument, SuperEventType } from '../../../../generated/graphql';
import { fakeEvent, fakeEvents } from '../../../../utils/mockDataUtils';
import { mockedOrganizationAncestorsResponse } from '../../../organization/__mocks__/organizationAncestors';
import { TEST_PUBLISHER_ID } from '../../../organization/constants';
import { SUB_EVENTS_VARIABLES } from '../../constants';

const publisherId = TEST_PUBLISHER_ID;

const subSubEventNames = ['Event 1', 'Event 2'];
const subSubEvents = fakeEvents(
  subSubEventNames.length,
  subSubEventNames.map((name) => ({
    name: { fi: name },
    publisher: publisherId,
  }))
);

const subEventId = 'subevent:1';
const subEventName = 'Recurring event name';
const subEvents = fakeEvents(1, [
  {
    id: subEventId,
    name: { fi: subEventName },
    publisher: publisherId,
    subEvents: subSubEvents.data,
    superEventType: SuperEventType.Recurring,
  },
]);

const eventId = 'event:1';
const eventName = 'Umbrella event name';
const event = fakeEvent({
  id: eventId,
  name: { fi: eventName },
  publisher: publisherId,
  subEvents: subEvents.data,
  superEventType: SuperEventType.Umbrella,
});

const subEventsVariables = {
  ...SUB_EVENTS_VARIABLES,
  superEvent: eventId,
};
const subSubEventsVariables = {
  ...SUB_EVENTS_VARIABLES,
  superEvent: subEventId,
};

const subEventsResponse = { data: { events: subEvents } };
const subSubEventsResponse = { data: { events: subSubEvents } };

const mockedSubEventsResponse = {
  request: {
    query: EventsDocument,
    variables: subEventsVariables,
  },
  result: subEventsResponse,
};

const mockedSubSubEventsResponse = {
  request: {
    query: EventsDocument,
    variables: subSubEventsVariables,
  },
  result: subSubEventsResponse,
};

const mocks = [
  mockedOrganizationAncestorsResponse,
  mockedSubEventsResponse,
  mockedSubSubEventsResponse,
];

export { event, eventName, mocks, subEventName, subSubEventNames };
