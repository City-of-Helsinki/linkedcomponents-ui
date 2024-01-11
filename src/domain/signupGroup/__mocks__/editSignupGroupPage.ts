import { MockedResponse } from '@apollo/client/testing';

import { DATE_FORMAT_API } from '../../../constants';
import {
  ContactPerson,
  DeleteSignupGroupDocument,
  SendMessageDocument,
  SignupGroupDocument,
  UpdateSignupGroupDocument,
} from '../../../generated/graphql';
import formatDate from '../../../utils/formatDate';
import {
  fakeSendMessageResponse,
  fakeSignupGroup,
} from '../../../utils/mockDataUtils';
import { TEST_REGISTRATION_ID } from '../../registration/constants';
import {
  dateOfBirth,
  sendMessageValues,
  signup,
  signupValues,
} from '../../signup/__mocks__/editSignupPage';
import { TEST_CONTACT_PERSON_ID } from '../../signup/constants';
import { NOTIFICATION_TYPE, TEST_SIGNUP_GROUP_ID } from '../constants';

const signupGroupId = TEST_SIGNUP_GROUP_ID;
const contactPersonValues: ContactPerson = {
  email: 'participant@email.com',
  firstName: 'Contact first name',
  id: TEST_CONTACT_PERSON_ID,
  lastName: 'Contact last name',
  membershipNumber: '',
  nativeLanguage: 'fi',
  notifications: NOTIFICATION_TYPE.EMAIL,
  phoneNumber: '+358 44 123 4567',
  serviceLanguage: 'fi',
};

const signupGroupValues = {
  contactPerson: contactPersonValues,
  extraInfo: '',
  registration: TEST_REGISTRATION_ID,
};

const signupGroup = fakeSignupGroup({
  ...signupGroupValues,
  signups: [signup],
  id: signupGroupId,
});

const signupGroupVariables = {
  id: signupGroupId,
};
const signupGroupResponse = { data: { signupGroup } };
const mockedSignupGroupResponse: MockedResponse = {
  request: { query: SignupGroupDocument, variables: signupGroupVariables },
  result: signupGroupResponse,
};

const payload = {
  contactPerson: contactPersonValues,
  extraInfo: signupGroupValues.extraInfo,
  registration: signupGroupValues.registration,
  signups: [
    {
      city: signupValues.city,
      dateOfBirth: formatDate(dateOfBirth, DATE_FORMAT_API),
      extraInfo: signupValues.extraInfo,
      firstName: signupValues.firstName,
      id: signupValues.id,
      lastName: signupValues.lastName,
      phoneNumber: signupValues.phoneNumber,
      streetAddress: signupValues.streetAddress,
      zipcode: signupValues.zipcode,
    },
  ],
};

const updateSignupGroupVariables = {
  input: payload,
  id: signupGroupId,
};

const updateSignupGroupResponse = { data: { updateSignupGroup: signupGroup } };

const mockedUpdateSignupGroupResponse: MockedResponse = {
  request: {
    query: UpdateSignupGroupDocument,
    variables: updateSignupGroupVariables,
  },
  result: updateSignupGroupResponse,
};

const mockedInvalidUpdateSignupGroupResponse: MockedResponse = {
  request: {
    query: UpdateSignupGroupDocument,
    variables: updateSignupGroupVariables,
  },
  error: {
    ...new Error(),
    result: { first_name: ['The name must be specified.'] },
  } as Error,
};

const deleteSignupGroupVariables = { id: signupGroupId };
const deleteSignupGroupResponse = { data: { deleteSignupGroup: null } };
const mockedDeleteSignupGroupResponse: MockedResponse = {
  request: {
    query: DeleteSignupGroupDocument,
    variables: deleteSignupGroupVariables,
  },
  result: deleteSignupGroupResponse,
};

const sendMessageVariables = {
  input: {
    ...sendMessageValues,
    body: sendMessageValues.body,
    signupGroups: [signupGroupId],
    signups: undefined,
    subject: sendMessageValues.subject,
  },
  registration: TEST_REGISTRATION_ID,
};

const sendMessageResponse = {
  data: { sendMessage: fakeSendMessageResponse() },
};

const mockedSendMessageToSignupGroupResponse: MockedResponse = {
  request: { query: SendMessageDocument, variables: sendMessageVariables },
  result: sendMessageResponse,
};

export {
  mockedDeleteSignupGroupResponse,
  mockedInvalidUpdateSignupGroupResponse,
  mockedSendMessageToSignupGroupResponse,
  mockedSignupGroupResponse,
  mockedUpdateSignupGroupResponse,
  sendMessageValues,
  signup,
  signupGroup,
  signupGroupId,
};
