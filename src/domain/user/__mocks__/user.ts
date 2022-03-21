import { MockedResponse } from '@apollo/client/testing';
import range from 'lodash/range';

import { MAX_PAGE_SIZE, TEST_USER_ID } from '../../../constants';
import { UserDocument, UsersDocument } from '../../../generated/graphql';
import { fakeUser, fakeUsers } from '../../../utils/mockDataUtils';
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

const userWithoutOrganizations = fakeUser({
  organization: '',
  adminOrganizations: [],
  organizationMemberships: [],
});
const userWithoutOrganizationsResponse = {
  data: { user: userWithoutOrganizations },
};
const mockedUserWithoutOrganizationsResponse: MockedResponse = {
  request: { query: UserDocument, variables: userVariables },
  result: userWithoutOrganizationsResponse,
};

const PAGE_SIZE = 10;

const userNames = range(1, PAGE_SIZE + 1).map((n) => `User name ${n}`);
const users = fakeUsers(
  userNames.length,
  userNames.map((displayName) => ({ displayName }))
);
const usersResponse = { data: { users } };
const usersVariables = { createPath: undefined, pageSize: MAX_PAGE_SIZE };

const mockedUsersResponse = {
  request: { query: UsersDocument, variables: usersVariables },
  result: usersResponse,
};

export {
  mockedUserResponse,
  mockedUsersResponse,
  mockedUserWithoutOrganizationsResponse,
  userName,
  userNames,
  users,
  userVariables,
};
