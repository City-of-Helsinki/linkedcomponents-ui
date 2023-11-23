import { MockedResponse } from '@apollo/client/testing';
import subYears from 'date-fns/subYears';
import omit from 'lodash/omit';

import { DATE_FORMAT_API } from '../../../constants';
import {
  CreateSignupGroupDocument,
  CreateSignupGroupMutationInput,
  CreateSignupsDocument,
  CreateSignupsMutationInput,
} from '../../../generated/graphql';
import formatDate from '../../../utils/formatDate';
import {
  fakeCreateSignupGroupResponse,
  fakeSignup,
} from '../../../utils/mockDataUtils';
import { registrationId } from '../../registration/__mocks__/registration';
import { TEST_SEATS_RESERVATION_CODE } from '../../seatsReservation/constants';
import { NOTIFICATION_TYPE, NOTIFICATIONS } from '../constants';
import { SignupGroupFormFields } from '../types';

const dateOfBirth = subYears(new Date(), 13);

const signupValues = {
  city: 'City',
  dateOfBirth,
  extraInfo: '',
  firstName: 'First name',
  id: null,
  inWaitingList: false,
  lastName: 'Last name',
  streetAddress: 'Street address',
  zipcode: '00100',
};

const contactPersonValues = {
  email: 'participant@email.com',
  firstName: 'First name',
  id: null,
  lastName: 'Last name',
  membershipNumber: '',
  nativeLanguage: 'fi',
  notifications: [NOTIFICATIONS.EMAIL],
  phoneNumber: '+358 44 123 4567',
  serviceLanguage: 'fi',
};

const commonSignupGroupValues = {
  contactPerson: contactPersonValues,
  extraInfo: '',
  userConsent: true,
};

const signupGroupWithSingleSignupValues: SignupGroupFormFields = {
  ...commonSignupGroupValues,
  signups: [{ ...signupValues }],
};

const signupGroupValues: SignupGroupFormFields = {
  ...commonSignupGroupValues,
  contactPerson: contactPersonValues,
  signups: [signupValues, signupValues],
};

const signup = fakeSignup({
  firstName: signupValues.firstName,
  lastName: signupValues.lastName,
});

const contactPersonPayload = {
  ...contactPersonValues,
  notifications: NOTIFICATION_TYPE.EMAIL,
};

const singleSignupPayload = {
  ...omit(signupValues, 'inWaitingList'),
  id: undefined,
  dateOfBirth: formatDate(dateOfBirth, DATE_FORMAT_API),
};

const signupPayload: CreateSignupsMutationInput = {
  registration: registrationId,
  reservationCode: TEST_SEATS_RESERVATION_CODE,
  signups: [{ ...singleSignupPayload, contactPerson: contactPersonPayload }],
};

const signupGroupPayload: CreateSignupGroupMutationInput = {
  contactPerson: contactPersonPayload,
  extraInfo: '',
  registration: registrationId,
  reservationCode: TEST_SEATS_RESERVATION_CODE,
  signups: [
    singleSignupPayload,
    {
      city: signupValues.city,
      dateOfBirth: formatDate(dateOfBirth, DATE_FORMAT_API),
      extraInfo: '',
      firstName: signupValues.firstName,
      lastName: signupValues.lastName,
      streetAddress: signupValues.streetAddress,
      zipcode: signupValues.zipcode,
    },
  ],
};

const createSignupVariables = { input: signupPayload };

const createSignupResponse = { data: { createSignups: [signup] } };

const mockedCreateSignupResponse: MockedResponse = {
  request: { query: CreateSignupsDocument, variables: createSignupVariables },
  result: createSignupResponse,
};

const mockedInvalidCreateSignupResponse: MockedResponse = {
  request: { query: CreateSignupsDocument, variables: createSignupVariables },
  error: {
    ...new Error(),
    result: { name: ['Tämän kentän arvo ei voi olla "null".'] },
  } as Error,
};

const createSignupGroupVariables = { input: signupGroupPayload };

const createSignupGroupResponse = {
  data: {
    createSignupGroup: fakeCreateSignupGroupResponse({
      signups: [signup, fakeSignup()],
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
  mockedCreateSignupResponse,
  mockedInvalidCreateSignupGroupResponse,
  mockedInvalidCreateSignupResponse,
  signupGroupValues,
  signupGroupWithSingleSignupValues,
  signupValues,
};
