import { UserState } from 'redux-oidc';

import { ReducerState, TokenState } from './types';

export const API_CLIENT_ID = 'https://api.hel.fi/auth/linkedevents';

export const API_TOKEN_ACTIONS = {
  FETCH_TOKEN_ERROR: 'FETCH_TOKEN_ERROR',
  FETCH_TOKEN_SUCCESS: 'FETCH_TOKEN_SUCCESS',
  RESET_API_TOKEN_DATA: 'RESET_API_TOKEN_DATA',
  START_FETCHING_TOKEN: 'START_FETCHING_TOKEN',
  TOKEN_FETCHED: 'TOKEN_FETCHED',
};

export const defaultTokenState: TokenState = {
  apiToken: null,
  errors: {},
  loading: false,
};

export const defaultOidcState: UserState = {
  isLoadingUser: false,
  user: (null as unknown) as undefined,
};

export const defaultReducerState: ReducerState = {
  token: defaultTokenState,
  oidc: defaultOidcState,
};
