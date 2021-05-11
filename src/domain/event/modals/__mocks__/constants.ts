import { MockedResponse } from '@apollo/client/testing';

import { MAX_PAGE_SIZE } from '../../../../constants';
import {
  EventsDocument,
  OrganizationsDocument,
  SuperEventType,
} from '../../../../generated/graphql';
import {
  fakeEvent,
  fakeEvents,
  fakeOrganizations,
} from '../../../../utils/mockDataUtils';
import { EVENT_INCLUDES } from '../../constants';

const publisherId = 'publisher:1';

const organizationsVariables = {
  child: publisherId,
  createPath: undefined,
  pageSize: MAX_PAGE_SIZE,
};
const organizationsResponse = {
  data: {
    organizations: fakeOrganizations(0),
  },
};
const mockedOrganizationsResponse: MockedResponse = {
  request: {
    query: OrganizationsDocument,
    variables: organizationsVariables,
  },
  result: organizationsResponse,
};

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

const baseVariables = {
  createPath: undefined,
  include: EVENT_INCLUDES,
  pageSize: MAX_PAGE_SIZE,
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

const mocks = [
  mockedOrganizationsResponse,
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

export { event, eventName, mocks, subEventName, subSubEventNames };
