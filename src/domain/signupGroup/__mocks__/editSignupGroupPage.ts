import { MockedResponse } from '@apollo/client/testing';

import { DATE_FORMAT_API } from '../../../constants';
import {
  DeleteSignupGroupDocument,
  SignupGroupDocument,
  UpdateSignupGroupDocument,
} from '../../../generated/graphql';
import formatDate from '../../../utils/formatDate';
import { fakeSignupGroup } from '../../../utils/mockDataUtils';
import { TEST_REGISTRATION_ID } from '../../registration/constants';
import {
  dateOfBirth,
  mockedSendMessageResponse,
  sendMessageValues,
  signup,
  signupValues,
} from '../../signup/__mocks__/editSignupPage';
import { TEST_SIGNUP_GROUP_ID } from '../constants';

const signupGroupId = TEST_SIGNUP_GROUP_ID;

const signupGroupValues = {
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
  ...signupGroupValues,
  signups: [
    { ...signupValues, dateOfBirth: formatDate(dateOfBirth, DATE_FORMAT_API) },
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

export {
  mockedDeleteSignupGroupResponse,
  mockedInvalidUpdateSignupGroupResponse,
  mockedSendMessageResponse,
  mockedSignupGroupResponse,
  mockedUpdateSignupGroupResponse,
  sendMessageValues,
  signup,
  signupGroupId,
};
