import { MockedResponse } from '@apollo/client/testing';
import subYears from 'date-fns/subYears';

import { DATE_FORMAT_API } from '../../../constants';
import {
  CreateSignupGroupDocument,
  CreateSignupGroupMutationInput,
} from '../../../generated/graphql';
import formatDate from '../../../utils/formatDate';
import {
  fakeCreateSignupGroupResponse,
  fakeSignups,
} from '../../../utils/mockDataUtils';
import { registrationId } from '../../registration/__mocks__/registration';
import { TEST_SEATS_RESERVATION_CODE } from '../../reserveSeats/constants';
import { NOTIFICATION_TYPE } from '../constants';

const dateOfBirth = subYears(new Date(), 13);

const enrolmentValues = {
  city: 'City',
  dateOfBirth: formatDate(dateOfBirth),
  email: 'participant@email.com',
  firstName: 'First name',
  lastName: 'Last name',
  phone: '+358 44 123 4567',
  streetAddress: 'Street address',
  zip: '00100',
};

const payload: CreateSignupGroupMutationInput = {
  extraInfo: '',
  registration: registrationId,
  reservationCode: TEST_SEATS_RESERVATION_CODE,
  signups: [
    {
      city: enrolmentValues.city,
      dateOfBirth: formatDate(dateOfBirth, DATE_FORMAT_API),
      email: enrolmentValues.email,
      extraInfo: '',
      firstName: enrolmentValues.firstName,
      lastName: enrolmentValues.lastName,
      membershipNumber: '',
      nativeLanguage: 'fi',
      notifications: NOTIFICATION_TYPE.EMAIL,
      phoneNumber: enrolmentValues.phone,
      responsibleForGroup: true,
      serviceLanguage: 'fi',
      streetAddress: enrolmentValues.streetAddress,
      zipcode: enrolmentValues.zip,
    },
  ],
};

const createSignupGroupVariables = { input: payload };

const createSignupGroupResponse = {
  data: {
    createSignupGroup: fakeCreateSignupGroupResponse({
      signups: fakeSignups(1, [
        {
          firstName: enrolmentValues.firstName,
          lastName: enrolmentValues.lastName,
        },
      ]).data,
    }),
  },
};

const mockedCreateEnrolmentResponse: MockedResponse = {
  request: {
    query: CreateSignupGroupDocument,
    variables: createSignupGroupVariables,
  },
  result: createSignupGroupResponse,
};

const mockedInvalidCreateEnrolmentResponse: MockedResponse = {
  request: {
    query: CreateSignupGroupDocument,
    variables: createSignupGroupVariables,
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
