import { MockedResponse } from '@apollo/client/testing';
import addDays from 'date-fns/addDays';
import subDays from 'date-fns/subDays';

import { RegistrationDocument } from '../../../generated/graphql';
import { fakeRegistration } from '../../../utils/mockDataUtils';
import { event } from '../../event/__mocks__/event';
import {
  REGISTRATION_INCLUDES,
  REGISTRATION_MANDATORY_FIELDS,
  TEST_REGISTRATION_ID,
} from '../constants';

const registrationId = TEST_REGISTRATION_ID;

const now = new Date();
const enrolmentStartTime = subDays(now, 1).toISOString();
const enrolmentEndTime = addDays(now, 1).toISOString();

const registrationOverrides = {
  id: registrationId,
  audienceMaxAge: 18,
  audienceMinAge: 12,
  confirmationMessage: { fi: 'Confirmation message' },
  currentAttendeeCount: 0,
  currentWaitingListCount: 0,
  enrolmentEndTime,
  enrolmentStartTime,
  event,
  instructions: { fi: 'Instructions' },
  mandatoryFields: [
    REGISTRATION_MANDATORY_FIELDS.FIRST_NAME,
    REGISTRATION_MANDATORY_FIELDS.LAST_NAME,
  ],
  maximumAttendeeCapacity: 100,
  minimumAttendeeCapacity: 10,
  publisher: event.publisher,
  remainingAttendeeCapacity: 100,
  remainingWaitingListCapacity: 10,
  signups: [],
  waitingListCapacity: 5,
};

const registration = fakeRegistration(registrationOverrides);
const registrationVariables = {
  createPath: undefined,
  id: registrationId,
  include: REGISTRATION_INCLUDES,
};
const registrationResponse = { data: { registration } };
const mockedRegistrationResponse: MockedResponse = {
  request: { query: RegistrationDocument, variables: registrationVariables },
  result: registrationResponse,
};

const pastRegistrationResponse = {
  data: {
    registration: {
      ...registration,
      enrolmentEndTime: subDays(new Date(), 2).toISOString(),
    },
  },
};
const mockedPastRegistrationResponse: MockedResponse = {
  request: { query: RegistrationDocument, variables: registrationVariables },
  result: pastRegistrationResponse,
};

export {
  mockedPastRegistrationResponse,
  mockedRegistrationResponse,
  registration,
  registrationId,
};
