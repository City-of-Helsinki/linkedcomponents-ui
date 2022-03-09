import { MockedProvider } from '@apollo/client/testing';
import { renderHook } from '@testing-library/react-hooks';
import map from 'lodash/map';
import range from 'lodash/range';
import { Provider } from 'react-redux';

import { MAX_PAGE_SIZE } from '../../../../constants';
import { Meta, UsersDocument } from '../../../../generated/graphql';
import { fakeUsers } from '../../../../utils/mockDataUtils';
import { fakeAuthenticatedStoreState } from '../../../../utils/mockStoreUtils';
import { getMockReduxStore } from '../../../../utils/testUtils';
import { createCache } from '../../../app/apollo/apolloClient';
import { mockedUserResponse } from '../../__mocks__/user';
import useAllUsers from '../useAllUsers';

const PAGE_SIZE = 10;

const userNames = range(1, PAGE_SIZE + 1).map((n) => `User name ${n}`);
const page2UserNames = range(1, PAGE_SIZE + 1).map((n) => `Page 2 user ${n}`);
const users = fakeUsers(
  userNames.length,
  userNames.map((displayName) => ({ displayName }))
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
  page2UserNames.map((displayName) => ({ displayName }))
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

const state = fakeAuthenticatedStoreState();
const store = getMockReduxStore(state);

const getHookWrapper = async () => {
  const wrapper = ({ children }) => (
    <Provider store={store}>
      <MockedProvider cache={createCache()} mocks={mocks}>
        {children}
      </MockedProvider>
    </Provider>
  );

  const { result, waitFor, waitForValueToChange } = renderHook(
    () => useAllUsers(),
    {
      wrapper,
    }
  );
  // Test the initial state of the request
  expect(result.current.users).toEqual([]);
  return { result, waitFor, waitForValueToChange };
};

test('should return all users', async () => {
  const { result, waitFor, waitForValueToChange } = await getHookWrapper();
  // Wait for the results
  await waitForValueToChange(() => result.current.users);
  await waitFor(() =>
    expect(map(result.current.users, 'displayName')).toEqual([
      ...userNames,
      ...page2UserNames,
    ])
  );
});
