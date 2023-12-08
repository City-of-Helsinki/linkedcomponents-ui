/* eslint-disable @typescript-eslint/no-explicit-any */
import merge from 'lodash/merge';
import { User, UserProfile } from 'oidc-client-ts';

import { TEST_USER_ID } from '../constants';
import {
  apiTokenInitialState,
  oidcInitialState,
} from '../domain/auth/constants';
import {
  ApiTokenReducerState,
  AuthContextProps,
  OidcReducerState,
} from '../domain/auth/types';
import userManager from '../domain/auth/userManager';

export const authContextDefaultValue: AuthContextProps = {
  ...apiTokenInitialState,
  ...oidcInitialState,
  isAuthenticated: false,
  isLoading: false,
  signIn: vi.fn(),
  signOut: vi.fn(),
  userManager,
};

export const fakeAuthContextValue = (
  overrides?: Partial<AuthContextProps>
): AuthContextProps =>
  merge<AuthContextProps, typeof overrides>(
    { ...authContextDefaultValue },
    overrides
  );

export const fakeAuthenticatedAuthContextValue = (
  overrides?: Partial<AuthContextProps>
): AuthContextProps =>
  merge<AuthContextProps, typeof overrides>(
    {
      ...authContextDefaultValue,
      isAuthenticated: true,
      ...fakeOidcReducerState(),
      ...fakeApiTokenReducerState(),
    },
    overrides
  );

export const fakeApiTokenReducerState = (
  overrides?: Partial<ApiTokenReducerState>
): ApiTokenReducerState =>
  merge<ApiTokenReducerState, typeof overrides>(
    {
      apiToken: 'api-token',
      tokenErrors: {},
      isLoadingApiToken: false,
    },
    overrides
  );

export const fakeOidcReducerState = (
  overrides?: Partial<OidcReducerState>
): OidcReducerState =>
  merge<OidcReducerState, typeof overrides>(
    { user: fakeOidcUserState(), isLoadingUser: false },
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
