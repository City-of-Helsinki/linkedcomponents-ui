import { MockedResponse } from '@apollo/client/testing';

import { TEST_USER_ID } from '../../../constants';
import {
  DeleteRegistrationDocument,
  RegistrationDocument,
  UpdateRegistrationDocument,
  UserDocument,
} from '../../../generated/graphql';
import { fakeRegistration, fakeUser } from '../../../utils/mockDataUtils';
import { TEST_EVENT_ID } from '../../event/constants';
import { REGISTRATION_INCLUDES } from '../constants';

const publisher = 'publisher:1';
const registrationId = 'registration:1';

const registrationOverrides = {
  id: registrationId,
  audienceMaxAge: 18,
  audienceMinAge: 12,
  confirmationMessage: 'Confirmation message',
  enrolmentEndTime: '2020-09-30T16:00:00.000Z',
  enrolmentStartTime: '2020-09-27T15:00:00.000Z',
  event: TEST_EVENT_ID,
  instructions: 'Instructions',
  maximumAttendeeCapacity: 100,
  minimumAttendeeCapacity: 10,
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

const deleteRegistrationVariables = { id: registrationId };
const deleteRegistrationResponse = { data: { deleteRegistration: null } };
const mockedDeleteRegistrationResponse: MockedResponse = {
  request: {
    query: DeleteRegistrationDocument,
    variables: deleteRegistrationVariables,
  },
  result: deleteRegistrationResponse,
};

const updatedLastModifiedTime = '2021-08-23T12:00:00.000Z';
const updateRegistrationVariables = { input: registrationOverrides };
const updatedRegistration = {
  ...registration,
  lastModifiedAt: updatedLastModifiedTime,
};
const updateRegistrationResponse = {
  data: { updateRegistration: updatedRegistration },
};
const updatedRegistrationResponse = {
  data: { registration: updatedRegistration },
};
const mockedUpdateRegistrationResponse: MockedResponse = {
  request: {
    query: UpdateRegistrationDocument,
    variables: updateRegistrationVariables,
  },
  result: updateRegistrationResponse,
};
const mockedUpdatedRegistationResponse: MockedResponse = {
  request: { query: RegistrationDocument, variables: registrationVariables },
  result: updatedRegistrationResponse,
};

const mockedInvalidUpdateRegistrationResponse: MockedResponse = {
  request: {
    query: UpdateRegistrationDocument,
    variables: updateRegistrationVariables,
  },
  error: {
    ...new Error(),
    result: {
      event: ['Tämän kentän arvo ei voi olla "null".'],
    },
  } as Error,
};

// User mocks
const user = fakeUser({
  organization: publisher,
  adminOrganizations: [publisher],
});

const userVariables = { createPath: undefined, id: TEST_USER_ID };
const userResponse = { data: { user } };
const mockedUserResponse: MockedResponse = {
  request: { query: UserDocument, variables: userVariables },
  result: userResponse,
};

export {
  mockedDeleteRegistrationResponse,
  mockedInvalidUpdateRegistrationResponse,
  mockedRegistrationResponse,
  mockedUpdatedRegistationResponse,
  mockedUpdateRegistrationResponse,
  mockedUserResponse,
  registration,
  registrationId,
  updatedLastModifiedTime,
};
