import { MockedResponse } from '@apollo/client/testing';
import subYears from 'date-fns/subYears';

import { DATE_FORMAT_API } from '../../../constants';
import {
  DeleteSignupDocument,
  SendMessageDocument,
  SignupDocument,
  SignupFieldsFragment,
  UpdateSignupDocument,
} from '../../../generated/graphql';
import formatDate from '../../../utils/formatDate';
import {
  fakeSendMessageResponse,
  fakeSignup,
} from '../../../utils/mockDataUtils';
import { registrationId } from '../../registration/__mocks__/registration';
import { TEST_REGISTRATION_ID } from '../../registration/constants';
import {
  NOTIFICATION_TYPE,
  TEST_SIGNUP_GROUP_ID,
} from '../../signupGroup/constants';
import { TEST_SIGNUP_ID } from '../constants';

const signupId = TEST_SIGNUP_ID;

const dateOfBirth = subYears(new Date(), 13);
const signupValues: SignupFieldsFragment = {
  city: 'City',
  dateOfBirth: formatDate(dateOfBirth),
  email: 'participant@email.com',
  extraInfo: '',
  firstName: 'First name',
  id: signupId,
  lastName: 'Last name',
  membershipNumber: '',
  nativeLanguage: 'fi',
  notifications: NOTIFICATION_TYPE.EMAIL,
  phoneNumber: '+358 44 123 4567',
  responsibleForGroup: true,
  serviceLanguage: 'fi',
  streetAddress: 'Street address',
  zipcode: '00100',
};

const signup = fakeSignup({
  ...signupValues,
  dateOfBirth: formatDate(dateOfBirth, DATE_FORMAT_API),
  id: signupId,
});

const signupWithGroup = { ...signup, signupGroup: TEST_SIGNUP_GROUP_ID };

const signupVariables = {
  createPath: undefined,
  id: signupId,
};
const signupResponse = { data: { signup } };
const mockedSignupResponse: MockedResponse = {
  request: { query: SignupDocument, variables: signupVariables },
  result: signupResponse,
};

const deleteSignupVariables = { id: signupId };
const deleteSignupResponse = { data: { deleteSignup: null } };
const mockedDeleteSignupResponse: MockedResponse = {
  request: {
    query: DeleteSignupDocument,
    variables: deleteSignupVariables,
  },
  result: deleteSignupResponse,
};

const updateSignupVariables = {
  id: signupId,
  input: {
    ...signupValues,
    dateOfBirth: formatDate(dateOfBirth, DATE_FORMAT_API),
    registration: TEST_REGISTRATION_ID,
  },
};

const updateSignupResponse = { data: { updateSignup: signup } };

const mockedUpdateSignupResponse: MockedResponse = {
  request: {
    query: UpdateSignupDocument,
    variables: updateSignupVariables,
  },
  result: updateSignupResponse,
};

const mockedInvalidUpdateSignupResponse: MockedResponse = {
  request: {
    query: UpdateSignupDocument,
    variables: updateSignupVariables,
  },
  error: {
    ...new Error(),
    result: { first_name: ['The name must be specified.'] },
  } as Error,
};

const sendMessageValues = {
  body: '<p>Message</p>',
  subject: 'Subject',
};

const sendMessageVariables = {
  input: {
    ...sendMessageValues,
    body: '<p>Message</p>',
    signupGroups: undefined,
    signups: [signupId],
    subject: 'Subject',
  },
  registration: registrationId,
};

const sendMessageResponse = {
  data: { sendMessage: fakeSendMessageResponse() },
};

const mockedSendMessageResponse: MockedResponse = {
  request: {
    query: SendMessageDocument,
    variables: sendMessageVariables,
  },
  result: sendMessageResponse,
};

export {
  dateOfBirth,
  mockedDeleteSignupResponse,
  mockedInvalidUpdateSignupResponse,
  mockedSendMessageResponse,
  mockedSignupResponse,
  mockedUpdateSignupResponse,
  sendMessageValues,
  signup,
  signupId,
  signupValues,
  signupWithGroup,
};
