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
import { NOTIFICATION_TYPE } from '../../enrolment/constants';
import { registrationId } from '../../registration/__mocks__/registration';
import { TEST_SEATS_RESERVATION_CODE } from '../../reserveSeats/constants';

const dateOfBirth = subYears(new Date(), 13);

const signupValues = {
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
      city: signupValues.city,
      dateOfBirth: formatDate(dateOfBirth, DATE_FORMAT_API),
      email: signupValues.email,
      extraInfo: '',
      firstName: signupValues.firstName,
      lastName: signupValues.lastName,
      membershipNumber: '',
      nativeLanguage: 'fi',
      notifications: NOTIFICATION_TYPE.EMAIL,
      phoneNumber: signupValues.phone,
      responsibleForGroup: true,
      serviceLanguage: 'fi',
      streetAddress: signupValues.streetAddress,
      zipcode: signupValues.zip,
    },
  ],
};

const createSignupGroupVariables = { input: payload };

const createSignupGroupResponse = {
  data: {
    createSignupGroup: fakeCreateSignupGroupResponse({
      signups: fakeSignups(1, [
        {
          firstName: signupValues.firstName,
          lastName: signupValues.lastName,
        },
      ]).data,
    }),
  },
};

const mockedCreateSignupGroupResponse: MockedResponse = {
  request: {
    query: CreateSignupGroupDocument,
    variables: createSignupGroupVariables,
  },
  result: createSignupGroupResponse,
};

const mockedInvalidCreateSignupGroupResponse: MockedResponse = {
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
  mockedCreateSignupGroupResponse,
  mockedInvalidCreateSignupGroupResponse,
  signupValues,
};
