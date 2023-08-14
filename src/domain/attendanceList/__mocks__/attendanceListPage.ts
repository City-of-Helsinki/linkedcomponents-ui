import { MockedResponse } from '@apollo/client/testing';

import { RegistrationDocument } from '../../../generated/graphql';
import { fakeRegistration } from '../../../utils/mockDataUtils';
import { event } from '../../event/__mocks__/event';
import {
  REGISTRATION_INCLUDES,
  TEST_REGISTRATION_ID,
} from '../../registration/constants';

const registrationId = TEST_REGISTRATION_ID;

const registrationOverrides = {
  id: registrationId,
  event,
  signups: [],
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

export { mockedRegistrationResponse };
