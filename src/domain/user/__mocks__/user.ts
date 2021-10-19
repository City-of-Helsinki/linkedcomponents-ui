import { MockedResponse } from '@apollo/client/testing';

import { TEST_USER_ID } from '../../../constants';
import { UserDocument } from '../../../generated/graphql';
import { fakeUser } from '../../../utils/mockDataUtils';

const user = fakeUser();
const userVariables = {
  createPath: undefined,
  id: TEST_USER_ID,
};
const userResponse = { data: { user } };
const mockedUserResponse: MockedResponse = {
  request: {
    query: UserDocument,
    variables: userVariables,
  },
  result: userResponse,
};

export { mockedUserResponse };
