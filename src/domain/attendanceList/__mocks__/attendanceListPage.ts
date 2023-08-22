import { MockedResponse } from '@apollo/client/testing';
import range from 'lodash/range';

import {
  PatchEnrolmentDocument,
  PresenceStatus,
  RegistrationDocument,
} from '../../../generated/graphql';
import { fakeEnrolments, fakeRegistration } from '../../../utils/mockDataUtils';
import { event } from '../../event/__mocks__/event';
import {
  REGISTRATION_INCLUDES,
  TEST_REGISTRATION_ID,
} from '../../registration/constants';

const registrationId = TEST_REGISTRATION_ID;

const signupNames = range(1, 4).map((i) => ({
  firstName: 'First',
  lastName: `last ${i}`,
}));
const signups = fakeEnrolments(
  signupNames.length,
  signupNames.map(({ firstName, lastName }) => ({ firstName, lastName }))
).data;
const registrationOverrides = {
  id: registrationId,
  event,
  signups,
};

const registration = fakeRegistration(registrationOverrides);
const registrationVariables = {
  createPath: undefined,
  id: registrationId,
  include: [...REGISTRATION_INCLUDES, 'signups'],
};
const registrationResponse = { data: { registration } };
const mockedRegistrationResponse: MockedResponse = {
  request: { query: RegistrationDocument, variables: registrationVariables },
  result: registrationResponse,
};

const updatePresentSignupVariables = {
  input: { id: signups[0].id, presenceStatus: PresenceStatus.Present },
  signup: signups[0].id,
};
const updatePresentSignupResponse = {
  data: {
    updateEnrolment: { ...signups[0], presenceStatus: PresenceStatus.Present },
  },
};
const mockedUpdatePresentSignupResponse: MockedResponse = {
  request: {
    query: PatchEnrolmentDocument,
    variables: updatePresentSignupVariables,
  },
  result: updatePresentSignupResponse,
};

const updateNotPresentSignupVariables = {
  input: { id: signups[0].id, presenceStatus: PresenceStatus.NotPresent },
  signup: signups[0].id,
};
const updateNotPresentSignupResponse = {
  data: {
    updateEnrolment: {
      ...signups[0],
      presenceStatus: PresenceStatus.NotPresent,
    },
  },
};
const mockedUpdateNotPresentSignupResponse: MockedResponse = {
  request: {
    query: PatchEnrolmentDocument,
    variables: updateNotPresentSignupVariables,
  },
  result: updateNotPresentSignupResponse,
};

const mockedInvalidUpdateSignupResponse: MockedResponse = {
  request: {
    query: PatchEnrolmentDocument,
    variables: updatePresentSignupVariables,
  },
  error: {
    ...new Error(),
    result: { name: ['The name must be specified.'] },
  } as Error,
};

export {
  mockedInvalidUpdateSignupResponse,
  mockedRegistrationResponse,
  mockedUpdateNotPresentSignupResponse,
  mockedUpdatePresentSignupResponse,
  registrationId,
  signupNames,
};
