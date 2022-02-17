import { MockedResponse } from '@apollo/client/testing';

import { TEST_USER_ID } from '../../../constants';
import { UserDocument } from '../../../generated/graphql';
import { fakeUser } from '../../../utils/mockDataUtils';
import { TEST_PUBLISHER_ID } from '../../organization/constants';

const userName = 'Test user';
const user = fakeUser({
  adminOrganizations: [TEST_PUBLISHER_ID],
  displayName: userName,
  organization: TEST_PUBLISHER_ID,
});
const userVariables = { createPath: undefined, id: TEST_USER_ID };
const userResponse = { data: { user } };
const mockedUserResponse: MockedResponse = {
  request: { query: UserDocument, variables: userVariables },
  result: userResponse,
};

export { mockedUserResponse, userName, userVariables };
