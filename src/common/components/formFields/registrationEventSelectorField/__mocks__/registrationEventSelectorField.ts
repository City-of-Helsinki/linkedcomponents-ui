import { FULL_TEXT_LANGUAGES } from '../../../../../constants';
import { EventsDocument } from '../../../../../generated/graphql';
import { fakeEvents } from '../../../../../utils/mockDataUtils';

const variables = {
  publicationStatus: 'public',
  registration: false,
  registrationAdminUser: true,
  start: 'now',
  sort: 'name',
  superEventType: ['none'],
  createPath: undefined,
  fullText: '',
  fullTextLanguage: FULL_TEXT_LANGUAGES,
};

const eventsResponse = { data: { events: fakeEvents(0) } };

const mockedRegistrationEventSelectorEventsResponse = {
  request: { query: EventsDocument, variables },
  result: eventsResponse,
};

export { mockedRegistrationEventSelectorEventsResponse };
