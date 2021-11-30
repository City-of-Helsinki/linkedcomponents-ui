import { MockedResponse } from '@apollo/client/testing';
import addDays from 'date-fns/addDays';
import subDays from 'date-fns/subDays';

import {
  RegistrationDocument,
  RegistrationFieldsFragment,
} from '../../../generated/graphql';
import {
  fakeRegistration,
  fakeRegistrations,
} from '../../../utils/mockDataUtils';
import { attendees } from '../../enrolments/__mocks__/enrolmentsPage';
import { TEST_EVENT_ID } from '../../event/constants';
import { REGISTRATION_INCLUDES } from '../constants';

const registrationId = 'registration:1';

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
  event: TEST_EVENT_ID,
  instructions: 'Instructions',
  maximumAttendeeCapacity: 100,
  minimumAttendeeCapacity: 10,
  signups: attendees.data,
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

const registrationsOverrides: Partial<RegistrationFieldsFragment>[] = [
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
