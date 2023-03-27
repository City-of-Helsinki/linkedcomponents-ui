import { MockedResponse } from '@apollo/client/testing';

import {
  CreateRegistrationDocument,
  EventDocument,
  EventsDocument,
} from '../../../generated/graphql';
import {
  fakeEvent,
  fakeEvents,
  fakeRegistration,
} from '../../../utils/mockDataUtils';
import { TEST_EVENT_ID } from '../../event/constants';
import { TEST_REGISTRATION_ID } from '../constants';

const eventId = TEST_EVENT_ID;
const eventName = 'Event name';

const event = fakeEvent({ id: eventId, name: { fi: eventName } });
const eventVariables = { createPath: undefined, id: eventId };
const eventResponse = { data: { event: event } };
const mockedEventResponse = {
  request: { query: EventDocument, variables: eventVariables },
  result: eventResponse,
};

const eventsVariables = {
  adminUser: true,
  createPath: undefined,
  publicationStatus: 'public',
  registration: false,
  sort: 'name',
  start: 'now',
  superEventType: ['none'],
  text: '',
};
const events = fakeEvents(1, [event]);
const eventsResponse = { data: { events } };
const mockedEventsResponse = {
  request: { query: EventsDocument, variables: eventsVariables },
  result: eventsResponse,
};

const registrationValues = {
  event: TEST_EVENT_ID,
  enrolmentEndTimeDate: new Date('2020-12-31T21:00:00.000Z'),
  enrolmentEndTimeTime: '21:00',
  enrolmentStartTimeDate: new Date('2020-12-31T18:00:00.000Z'),
  enrolmentStartTimeTime: '18:00',
};
const registrationId = TEST_REGISTRATION_ID;

const payload = {
  audienceMaxAge: null,
  audienceMinAge: null,
  confirmationMessage: null,
  enrolmentEndTime: '2020-12-31T21:00:00.000Z',
  enrolmentStartTime: '2020-12-31T18:00:00.000Z',
  event: TEST_EVENT_ID,
  instructions: null,
  maximumAttendeeCapacity: null,
  minimumAttendeeCapacity: null,
  waitingListCapacity: null,
};

const createRegistrationVariables = {
  input: payload,
};

const createRegistrationResponse = {
  data: { createRegistration: fakeRegistration({ id: registrationId }) },
};

const mockedCreateRegistrationResponse: MockedResponse = {
  request: {
    query: CreateRegistrationDocument,
    variables: createRegistrationVariables,
  },
  result: createRegistrationResponse,
};

const mockedInvalidCreateRegistrationResponse: MockedResponse = {
  request: {
    query: CreateRegistrationDocument,
    variables: createRegistrationVariables,
  },
  error: {
    ...new Error(),
    result: {
      event: ['Tämän kentän arvo ei voi olla "null".'],
    },
  } as Error,
};

export {
  mockedCreateRegistrationResponse,
  mockedEventResponse,
  mockedEventsResponse,
  mockedInvalidCreateRegistrationResponse,
  payload,
  registrationValues,
};
