import { MockedResponse } from '@apollo/client/testing';

import { CreateRegistrationDocument } from '../../../generated/graphql';
import { fakeRegistration } from '../../../utils/mockDataUtils';

const registrationValues = {
  event: 'event:1',
  enrolmentEndTime: new Date('2020-12-31T21:00:00.000Z'),
  enrolmentStartTime: new Date('2020-12-31T18:00:00.000Z'),
};
const registrationId = 'registration:1';

const payload = {
  audienceMaxAge: null,
  audienceMinAge: null,
  confirmationMessage: null,
  enrolmentEndTime: '2020-12-31T21:00:00.000Z',
  enrolmentStartTime: '2020-12-31T18:00:00.000Z',
  event: 'event:1',
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
  mockedInvalidCreateRegistrationResponse,
  payload,
  registrationValues,
};
