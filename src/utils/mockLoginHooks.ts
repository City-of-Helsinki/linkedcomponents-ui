/* eslint-disable @typescript-eslint/no-explicit-any */
import * as hdsReact from 'hds-react';
import merge from 'lodash/merge';
import { User, UserProfile } from 'oidc-client-ts';
import { Mock } from 'vitest';

import { TEST_USER_ID } from '../constants';

export const fakeOidcUserProfileState = (
  overrides?: Partial<UserProfile>
): UserProfile =>
  merge<UserProfile, typeof overrides>(
    {
      aud: '',
      exp: 0,
      iat: 0,
      iss: '',
      name: 'Test user',
      sub: TEST_USER_ID,
    },
    overrides
  );

export const fakeOidcUserState = (overrides?: Partial<User>): User =>
  merge<User, typeof overrides>(
    {
      access_token: '',
      expires_at: 0,
      expires_in: 0,
      expired: false,
      id_token: '',
      profile: fakeOidcUserProfileState(),
      toStorageString: vi.fn(),
      scope: '',
      scopes: [],
      session_state: null,
      state: null,
      token_type: '',
    },
    overrides
  );

type LoginStateOptions = {
  authenticated: boolean;
  apiToken: string | null;
  login: Mock<any, any>;
  logout: Mock<any, any>;
  user: User | null;
};

const mockLoginState = ({
  apiToken,
  authenticated,
  login,
  logout,
  user,
}: Partial<LoginStateOptions>) => {
  const useOidcClient = vi.spyOn(hdsReact, 'useOidcClient').mockReturnValue({
    isAuthenticated: () => authenticated,
    getUser: () => user,
    login: login ?? vi.fn(),
    logout: logout ?? vi.fn(),
  } as any);

  const useApiTokens = vi.spyOn(hdsReact, 'useApiTokens').mockReturnValue({
    getStoredApiTokens: () => [null, apiToken ? { API_SCOPE: apiToken } : null],
  } as any);

  return { useApiTokens, useOidcClient };
};

export const mockAuthenticatedLoginState = (
  options?: Partial<LoginStateOptions>
) => {
  const apiToken = 'api-token';

  return mockLoginState({
    apiToken,
    authenticated: true,
    user: fakeOidcUserState(),
    ...options,
  });
};

export const mockUnauthenticatedLoginState = (
  options?: Partial<LoginStateOptions>
) => {
  return mockLoginState({
    authenticated: false,
    user: null,
    ...options,
  });
};
