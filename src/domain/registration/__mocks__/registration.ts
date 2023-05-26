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
  confirmationMessage: 'Confirmation message',
  enrolmentEndTime,
  enrolmentStartTime,
  event,
  instructions: 'Instructions',
  mandatoryFields: [REGISTRATION_MANDATORY_FIELDS.NAME],
  maximumAttendeeCapacity: 100,
  minimumAttendeeCapacity: 10,
  publisher: event.publisher,
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

export { mockedRegistrationResponse, registration, registrationId };
