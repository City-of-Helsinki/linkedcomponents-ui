import { MockedResponse } from '@apollo/client/testing';

import {
  EnrolmentDocument,
  UpdateEnrolmentDocument,
} from '../../../generated/graphql';
import { fakeEnrolment } from '../../../utils/mockDataUtils';
import { registrationId } from '../../registration/__mocks__/registration';
import { NOTIFICATION_TYPE } from '../constants';

const enrolmentId = 'enrolment:1';
const enrolmentValues = {
  city: 'City',
  email: 'participant@email.com',
  extraInfo: null,
  membershipNumber: null,
  name: 'Participant name',
  nativeLanguage: 'fi',
  notificationLanguage: 'fi',
  notifications: NOTIFICATION_TYPE.SMS_EMAIL,
  phoneNumber: '+358 44 123 4567',
  serviceLanguage: 'fi',
  streetAddress: 'Street address',
  yearOfBirth: '1990',
  zip: '00100',
};

const enrolment = fakeEnrolment({ ...enrolmentValues, id: enrolmentId });

const enrolmentVariables = { createPath: undefined, id: enrolmentId };
const enrolmentResponse = { data: { enrolment } };
const mockedEnrolmentResponse: MockedResponse = {
  request: { query: EnrolmentDocument, variables: enrolmentVariables },
  result: enrolmentResponse,
};

const payload = {
  id: enrolmentId,
  city: enrolmentValues.city,
  email: enrolmentValues.email,
  extraInfo: '',
  membershipNumber: '',
  name: enrolmentValues.name,
  notifications: enrolmentValues.notifications,
  phoneNumber: enrolmentValues.phoneNumber,
  registration: registrationId,
};

const updateEnrolmentVariables = {
  input: payload,
};

const updateEnrolmentResponse = {
  data: { updateEnrolment: enrolment },
};

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
    result: {
      name: ['The name must be specified.'],
    },
  } as Error,
};

export {
  enrolment,
  enrolmentId,
  enrolmentValues,
  mockedEnrolmentResponse,
  mockedInvalidUpdateEnrolmentResponse,
  mockedUpdateEnrolmentResponse,
};
