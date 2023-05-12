import { MockedResponse } from '@apollo/client/testing';
import subYears from 'date-fns/subYears';

import { DATE_FORMAT_API } from '../../../constants';
import {
  CreateEnrolmentDocument,
  CreateEnrolmentMutationInput,
} from '../../../generated/graphql';
import formatDate from '../../../utils/formatDate';
import {
  fakeCreateEnrolmentResponse,
  fakeEnrolmentPeopleResponse,
} from '../../../utils/mockDataUtils';
import { registrationId } from '../../registration/__mocks__/registration';
import { TEST_SEATS_RESERVATION_CODE } from '../../reserveSeats/constants';
import { NOTIFICATION_TYPE } from '../constants';

const dateOfBirth = subYears(new Date(), 13);

const enrolmentValues = {
  city: 'City',
  dateOfBirth: formatDate(dateOfBirth),
  email: 'participant@email.com',
  name: 'Participant name',
  phone: '+358 44 123 4567',
  streetAddress: 'Street address',
  zip: '00100',
};

const payload: CreateEnrolmentMutationInput = {
  registration: registrationId,
  reservationCode: TEST_SEATS_RESERVATION_CODE,
  signups: [
    {
      city: enrolmentValues.city,
      dateOfBirth: formatDate(dateOfBirth, DATE_FORMAT_API),
      email: enrolmentValues.email,
      extraInfo: '',
      membershipNumber: '',
      name: enrolmentValues.name,
      nativeLanguage: 'fi',
      notifications: NOTIFICATION_TYPE.SMS_EMAIL,
      phoneNumber: enrolmentValues.phone,
      serviceLanguage: 'fi',
      streetAddress: enrolmentValues.streetAddress,
      zipcode: enrolmentValues.zip,
    },
  ],
};

const createEnrolmentVariables = {
  input: payload,
};

const createEnrolmentResponse = {
  data: {
    createEnrolment: fakeCreateEnrolmentResponse({
      attending: fakeEnrolmentPeopleResponse(1, [
        { name: enrolmentValues.name },
      ]),
    }),
  },
};

const mockedCreateEnrolmentResponse: MockedResponse = {
  request: {
    query: CreateEnrolmentDocument,
    variables: createEnrolmentVariables,
  },
  result: createEnrolmentResponse,
};

const mockedInvalidCreateEnrolmentResponse: MockedResponse = {
  request: {
    query: CreateEnrolmentDocument,
    variables: createEnrolmentVariables,
  },
  error: {
    ...new Error(),
    result: { name: ['Tämän kentän arvo ei voi olla "null".'] },
  } as Error,
};

export {
  enrolmentValues,
  mockedCreateEnrolmentResponse,
  mockedInvalidCreateEnrolmentResponse,
};
