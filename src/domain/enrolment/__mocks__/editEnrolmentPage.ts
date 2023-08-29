import { MockedResponse } from '@apollo/client/testing';
import subYears from 'date-fns/subYears';

import { DATE_FORMAT_API } from '../../../constants';
import {
  DeleteEnrolmentDocument,
  SendMessageDocument,
  SignupDocument,
  UpdateEnrolmentDocument,
} from '../../../generated/graphql';
import formatDate from '../../../utils/formatDate';
import {
  fakeSendMessageResponse,
  fakeSignup,
} from '../../../utils/mockDataUtils';
import { registrationId } from '../../registration/__mocks__/registration';
import { NOTIFICATION_TYPE, TEST_ENROLMENT_ID } from '../constants';

const signupId = TEST_ENROLMENT_ID;
const dateOfBirth = subYears(new Date(), 13);
const enrolmentValues = {
  city: 'City',
  dateOfBirth: formatDate(dateOfBirth),
  email: 'participant@email.com',
  extraInfo: null,
  firstName: 'First name',
  lastName: 'Last name',
  membershipNumber: null,
  nativeLanguage: 'fi',
  notificationLanguage: 'fi',
  notifications: NOTIFICATION_TYPE.EMAIL,
  phoneNumber: '+358 44 123 4567',
  serviceLanguage: 'fi',
  streetAddress: 'Street address',
  yearOfBirth: '1990',
  zipcode: '00100',
};

const signup = fakeSignup({
  ...enrolmentValues,
  dateOfBirth: formatDate(dateOfBirth, DATE_FORMAT_API),
  id: signupId,
});

const enrolmentVariables = {
  createPath: undefined,
  id: signupId,
};
const enrolmentResponse = { data: { signup } };
const mockedEnrolmentResponse: MockedResponse = {
  request: { query: SignupDocument, variables: enrolmentVariables },
  result: enrolmentResponse,
};

const cancelEnrolmentVariables = {
  signup: signupId,
};
const cancelEnrolmentResponse = { data: { deleteEnrolment: null } };
const mockedCancelEnrolmentResponse: MockedResponse = {
  request: {
    query: DeleteEnrolmentDocument,
    variables: cancelEnrolmentVariables,
  },
  result: cancelEnrolmentResponse,
};

const payload = {
  id: signupId,
  city: enrolmentValues.city,
  dateOfBirth: formatDate(dateOfBirth, DATE_FORMAT_API),
  email: enrolmentValues.email,
  extraInfo: '',
  firstName: enrolmentValues.firstName,
  lastName: enrolmentValues.lastName,
  membershipNumber: '',
  nativeLanguage: enrolmentValues.nativeLanguage,
  notifications: enrolmentValues.notifications,
  phoneNumber: enrolmentValues.phoneNumber,
  registration: registrationId,
  serviceLanguage: enrolmentValues.serviceLanguage,
  streetAddress: enrolmentValues.streetAddress,
  zipcode: enrolmentValues.zipcode,
};

const updateEnrolmentVariables = {
  input: payload,
  signup: signupId,
};

const updateEnrolmentResponse = { data: { updateEnrolment: signup } };

const mockedUpdateEnrolmentResponse: MockedResponse = {
  request: {
    query: UpdateEnrolmentDocument,
    variables: updateEnrolmentVariables,
  },
  result: updateEnrolmentResponse,
};

const mockedInvalidUpdateEnrolmentResponse: MockedResponse = {
  request: {
    query: UpdateEnrolmentDocument,
    variables: updateEnrolmentVariables,
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
  mockedCancelEnrolmentResponse,
  mockedEnrolmentResponse,
  mockedInvalidUpdateEnrolmentResponse,
  mockedSendMessageResponse,
  mockedUpdateEnrolmentResponse,
  sendMessageValues,
  signup,
  signupId,
};
