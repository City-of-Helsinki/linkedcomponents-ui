import { EventsDocument } from '../../../../../generated/graphql';
import { fakeEvents } from '../../../../../utils/mockDataUtils';

const variables = {
  adminUser: true,
  publicationStatus: 'public',
  registration: false,
  start: 'now',
  sort: 'name',
  superEventType: ['none'],
  createPath: undefined,
  text: '',
};

const eventsResponse = {
  data: {
    events: fakeEvents(0),
  },
};

const mockedRegistrationEventSelectorEventsResponse = {
  request: { query: EventsDocument, variables },
  result: eventsResponse,
};

export { mockedRegistrationEventSelectorEventsResponse };
