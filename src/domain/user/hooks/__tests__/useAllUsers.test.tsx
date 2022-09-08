/* eslint-disable @typescript-eslint/ban-ts-comment */
import { MockedProvider } from '@apollo/client/testing';
import { renderHook, waitFor } from '@testing-library/react';
import map from 'lodash/map';
import range from 'lodash/range';
import React from 'react';

import { MAX_PAGE_SIZE } from '../../../../constants';
import { Meta, UsersDocument } from '../../../../generated/graphql';
import { fakeAuthenticatedAuthContextValue } from '../../../../utils/mockAuthContextValue';
import { fakeUsers } from '../../../../utils/mockDataUtils';
import { createCache } from '../../../app/apollo/apolloClient';
import { AuthContext } from '../../../auth/AuthContext';
import { mockedUserResponse } from '../../__mocks__/user';
import useAllUsers from '../useAllUsers';

const PAGE_SIZE = 10;

const userNames = range(1, PAGE_SIZE + 1).map((n) => `User name ${n}`);
const page2UserNames = range(1, PAGE_SIZE + 1).map((n) => `Page 2 user ${n}`);
const users = fakeUsers(
  userNames.length,
  userNames.map((displayName, index) => ({
    displayName,
    username: `user:${index}`,
  }))
);
const count = userNames.length + page2UserNames.length;
const meta: Meta = { ...users.meta, count };

const usersResponse = {
  data: {
    users: {
      ...users,
      meta: { ...meta, next: 'http://localhost:8000/v1/user/?page=2' },
    },
  },
};
const usersVariables = { createPath: undefined, pageSize: MAX_PAGE_SIZE };

const mockedUsersResponse = {
  request: { query: UsersDocument, variables: usersVariables },
  result: usersResponse,
};

const page2Users = fakeUsers(
  page2UserNames.length,
  page2UserNames.map((displayName, index) => ({
    displayName,
    username: `user:${index + PAGE_SIZE}`,
  }))
);
const page2UsersVariables = { ...usersVariables, page: 2 };
const page2UsersResponse = {
  data: {
    users: {
      ...page2Users,
      meta: { ...meta, previous: 'http://localhost:8000/v1/user/' },
    },
  },
};
const mockedPage2UsersResponse = {
  request: { query: UsersDocument, variables: page2UsersVariables },
  result: page2UsersResponse,
};

const mocks = [
  mockedUserResponse,
  mockedUsersResponse,
  mockedPage2UsersResponse,
];

const authContextValue = fakeAuthenticatedAuthContextValue();

const getHookWrapper = async () => {
  const wrapper = ({ children }) => (
    <AuthContext.Provider value={authContextValue}>
      <MockedProvider cache={createCache()} mocks={mocks}>
        {children}
      </MockedProvider>
    </AuthContext.Provider>
  );

  const { result } = renderHook(() => useAllUsers(), {
    wrapper,
  });

  expect(result.current.users).toEqual([]);
  await waitFor(() => expect(result.current.user).toBeDefined());
  // Test the initial state of the request
  return { result };
};

test('should return all users', async () => {
  const { result } = await getHookWrapper();
  // Wait for the results
  await waitFor(() => expect(result.current.loading).toBeFalsy());
  await waitFor(() =>
    expect(map(result.current.users, 'displayName')).toEqual([
      ...userNames,
      ...page2UserNames,
    ])
  );
});
