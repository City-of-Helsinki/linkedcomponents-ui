import { MockedResponse } from '@apollo/client/testing';
import subYears from 'date-fns/subYears';

import {
  DeleteEnrolmentDocument,
  EnrolmentDocument,
  UpdateEnrolmentDocument,
} from '../../../generated/graphql';
import formatDate from '../../../utils/formatDate';
import { fakeEnrolment } from '../../../utils/mockDataUtils';
import { registrationId } from '../../registration/__mocks__/registration';
import { NOTIFICATION_TYPE } from '../constants';

const enrolmentId = 'enrolment:1';
const dateOfBirth = subYears(new Date(), 13);
const enrolmentValues = {
  city: 'City',
  dateOfBirth: formatDate(dateOfBirth),
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
  zipcode: '00100',
};

const enrolment = fakeEnrolment({
  ...enrolmentValues,
  dateOfBirth: formatDate(dateOfBirth, 'yyyy-MM-dd'),
  id: enrolmentId,
});

const enrolmentVariables = { createPath: undefined, id: enrolmentId };
const enrolmentResponse = { data: { enrolment } };
const mockedEnrolmentResponse: MockedResponse = {
  request: { query: EnrolmentDocument, variables: enrolmentVariables },
  result: enrolmentResponse,
};

const cancelEnrolmentVariables = {
  cancellationCode: enrolment.cancellationCode,
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
  id: enrolmentId,
  city: enrolmentValues.city,
  dateOfBirth: formatDate(dateOfBirth, 'yyyy-MM-dd'),
  email: enrolmentValues.email,
  extraInfo: '',
  membershipNumber: '',
  name: enrolmentValues.name,
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
  mockedCancelEnrolmentResponse,
  mockedEnrolmentResponse,
  mockedInvalidUpdateEnrolmentResponse,
  mockedUpdateEnrolmentResponse,
};
