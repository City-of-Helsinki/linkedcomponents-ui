import { MockedResponse } from '@apollo/client/testing';

import { CreateRegistrationDocument } from '../../../generated/graphql';
import generateAtId from '../../../utils/generateAtId';
import { fakeRegistration } from '../../../utils/mockDataUtils';
import { TEST_EVENT_ID } from '../../event/constants';
import { TEST_REGISTRATION_ID } from '../constants';

const registrationValues = {
  event: generateAtId(TEST_EVENT_ID, 'event'),
  enrolmentEndTimeDate: new Date('2020-12-31T21:00:00.000Z'),
  enrolmentEndTimeTime: '21:00',
  enrolmentStartTimeDate: new Date('2020-12-31T18:00:00.000Z'),
  enrolmentStartTimeTime: '18:00',
};
const registrationId = TEST_REGISTRATION_ID;

const payload = {
  audienceMaxAge: null,
  audienceMinAge: null,
  confirmationMessage: {
    fi: '',
    sv: null,
    en: null,
    ru: null,
    zhHans: null,
    ar: null,
  },
  enrolmentEndTime: '2020-12-31T21:00:00.000Z',
  enrolmentStartTime: '2020-12-31T18:00:00.000Z',
  event: { atId: generateAtId(TEST_EVENT_ID, 'event') },
  instructions: {
    fi: '',
    sv: null,
    en: null,
    ru: null,
    zhHans: null,
    ar: null,
  },
  mandatoryFields: ['name'],
  maximumAttendeeCapacity: null,
  maximumGroupSize: null,
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
