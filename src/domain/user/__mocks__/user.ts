import { MockedResponse } from '@apollo/client/testing';
import range from 'lodash/range';

import { MAX_PAGE_SIZE, TEST_USER_ID } from '../../../constants';
import { User, UserDocument, UsersDocument } from '../../../generated/graphql';
import { fakeUser, fakeUsers } from '../../../utils/mockDataUtils';
import { TEST_PUBLISHER_ID } from '../../organization/constants';

const userName = 'Test user';
const userFirstName = 'Test';

const getMockedUserResponse = (userSettings: Partial<User>): MockedResponse => {
  const user = fakeUser(userSettings);
  const userVariables = {
    createPath: undefined,
    id: TEST_USER_ID,
  };
  const userResponse = { data: { user } };

  return {
    request: { query: UserDocument, variables: userVariables },
    result: userResponse,
  };
};

const mockedUserResponse = getMockedUserResponse({
  adminOrganizations: [TEST_PUBLISHER_ID],
  displayName: userName,
  firstName: userFirstName,
  organization: TEST_PUBLISHER_ID,
  organizationMemberships: [],
  registrationAdminOrganizations: [],
});

const mockedRegistrationUserResponse = getMockedUserResponse({
  adminOrganizations: [],
  displayName: userName,
  firstName: userFirstName,
  organization: TEST_PUBLISHER_ID,
  organizationMemberships: [],
  registrationAdminOrganizations: [TEST_PUBLISHER_ID],
});

const mockedRegularUserResponse = getMockedUserResponse({
  adminOrganizations: [],
  displayName: userName,
  firstName: userFirstName,
  organization: TEST_PUBLISHER_ID,
  organizationMemberships: [TEST_PUBLISHER_ID],
  registrationAdminOrganizations: [],
});

const mockedUserWithoutOrganizationsResponse = getMockedUserResponse({
  adminOrganizations: [],
  displayName: userName,
  firstName: userFirstName,
  organization: '',
  organizationMemberships: [],
  registrationAdminOrganizations: [],
  isExternal: true,
});

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
  getMockedUserResponse,
  mockedRegistrationUserResponse,
  mockedRegularUserResponse,
  mockedUserResponse,
  mockedUsersResponse,
  mockedUserWithoutOrganizationsResponse,
  userFirstName,
  userName,
  userNames,
  users,
};
