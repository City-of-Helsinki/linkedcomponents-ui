import { MockedResponse } from '@apollo/client/testing';
import addDays from 'date-fns/addDays';
import subDays from 'date-fns/subDays';

import { Registration, RegistrationDocument } from '../../../generated/graphql';
import {
  fakeRegistration,
  fakeRegistrations,
} from '../../../utils/mockDataUtils';
import {
  attendees,
  waitingAttendees,
} from '../../enrolments/__mocks__/enrolmentsPage';
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
  signups: [...attendees, ...waitingAttendees],
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

const singleRegistrationOverrides = {
  enrolmentEndTime,
  enrolmentStartTime,
  maximumAttendeeCapacity: 10,
  waitingListCapacity: 10,
};

const registrationsOverrides: Partial<Registration>[] = [
  {
    id: '1',
    currentAttendeeCount: 0,
    ...singleRegistrationOverrides,
  },
  {
    id: '2',
    ...singleRegistrationOverrides,
    currentAttendeeCount: singleRegistrationOverrides.maximumAttendeeCapacity,
    currentWaitingListCount: 0,
  },
  {
    id: '3',
    ...singleRegistrationOverrides,
    currentAttendeeCount: singleRegistrationOverrides.maximumAttendeeCapacity,
    currentWaitingListCount: 0,
    waitingListCapacity: null,
  },
  {
    id: '4',
    ...singleRegistrationOverrides,
    currentAttendeeCount: singleRegistrationOverrides.maximumAttendeeCapacity,
    currentWaitingListCount: singleRegistrationOverrides.waitingListCapacity,
  },
  {
    id: '5',
    ...singleRegistrationOverrides,
    currentAttendeeCount: 1000,
    maximumAttendeeCapacity: 0,
  },
];

const registrationsResponse = fakeRegistrations(
  registrationsOverrides.length,
  registrationsOverrides
);

export {
  mockedRegistrationResponse,
  registration,
  registrationId,
  registrationsResponse,
};
