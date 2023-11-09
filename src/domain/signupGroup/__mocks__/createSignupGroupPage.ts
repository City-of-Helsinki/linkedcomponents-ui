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
import { TEST_SEATS_RESERVATION_CODE } from '../../seatsReservation/constants';
import { NOTIFICATION_TYPE } from '../constants';

const dateOfBirth = subYears(new Date(), 13);

const contactPersonValues = {
  email: 'participant@email.com',
  phone: '+358 44 123 4567',
};
const signupValues = {
  city: 'City',
  dateOfBirth: formatDate(dateOfBirth),
  firstName: 'First name',
  lastName: 'Last name',
  streetAddress: 'Street address',
  zip: '00100',
};

const payload: CreateSignupGroupMutationInput = {
  contactPerson: {
    email: contactPersonValues.email,
    firstName: '',
    id: null,
    lastName: '',
    membershipNumber: '',
    nativeLanguage: 'fi',
    notifications: NOTIFICATION_TYPE.EMAIL,
    phoneNumber: contactPersonValues.phone,
    serviceLanguage: 'fi',
  },
  extraInfo: '',
  registration: registrationId,
  reservationCode: TEST_SEATS_RESERVATION_CODE,
  signups: [
    {
      city: signupValues.city,
      dateOfBirth: formatDate(dateOfBirth, DATE_FORMAT_API),
      extraInfo: '',
      firstName: signupValues.firstName,
      lastName: signupValues.lastName,
      responsibleForGroup: true,
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
  contactPersonValues,
  mockedCreateSignupGroupResponse,
  mockedInvalidCreateSignupGroupResponse,
  signupValues,
};
