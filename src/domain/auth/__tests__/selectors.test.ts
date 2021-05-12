import merge from 'lodash/merge';

import { defaultStoreState } from '../../../constants';
import { API_CLIENT_ID } from '../constants';
import {
  apiTokenSelector,
  authenticatedSelector,
  loadingSelector,
  userAccessTokenSelector,
  userSelector,
} from '../selectors';

test('apiTokenSelector returns api token', () => {
  const apiToken = { [API_CLIENT_ID]: 'api-token' };
  expect(
    apiTokenSelector(
      merge({}, defaultStoreState, {
        authentication: { token: { apiToken } },
      })
    )
  ).toEqual(apiToken);
});

test('authenticatedSelector returns is authentication completed', () => {
  const apiToken = { [API_CLIENT_ID]: 'api-token' };
  const user = { name: 'Test user' };
  expect(
    authenticatedSelector(
      merge({}, defaultStoreState, {
        authentication: { token: { apiToken } },
      })
    )
  ).toEqual(false);

  expect(
    authenticatedSelector(
      merge({}, defaultStoreState, { authentication: { oidc: { user } } })
    )
  ).toEqual(false);

  expect(
    authenticatedSelector(
      merge({}, defaultStoreState, {
        authentication: { oidc: { user }, token: { apiToken } },
      })
    )
  ).toEqual(true);
});

test('loading selector returns loading status', () => {
  expect(
    loadingSelector(
      merge({}, defaultStoreState, {
        authentication: { token: { loading: true } },
      })
    )
  ).toEqual(true);

  expect(
    loadingSelector(
      merge({}, defaultStoreState, {
        authentication: { oidc: { isLoadingUser: true } },
      })
    )
  ).toEqual(true);

  expect(
    loadingSelector(
      merge({}, defaultStoreState, {
        authentication: {
          oidc: { isLoadingUser: true },
          token: { loading: true },
        },
      })
    )
  ).toEqual(true);

  expect(
    loadingSelector(
      merge({}, defaultStoreState, {
        authentication: {
          oidc: { isLoadingUser: false },
          token: { loading: false },
        },
      })
    )
  ).toEqual(false);
});

test('userAccessTokenSelector returns access token', () => {
  const accessToken = 'access-token';
  const user = { access_token: accessToken };

  expect(
    userAccessTokenSelector(
      merge({}, defaultStoreState, { authentication: { oidc: { user } } })
    )
  ).toEqual(accessToken);
});

test('userSelector returns user', () => {
  const user = { name: 'Test user' };

  expect(
    userSelector(
      merge({}, defaultStoreState, { authentication: { oidc: { user } } })
    )
  ).toEqual(user);
});
