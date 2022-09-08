import { ApiTokenReducerState, OidcReducerState } from './types';

export const API_SCOPE =
  process.env.REACT_APP_OIDC_API_SCOPE ||
  'https://api.hel.fi/auth/linkedevents';

export enum OidcActionTypes {
  USER_EXPIRED = 'USER_EXPIRED',
  USER_FOUND = 'USER_FOUND',
  SILENT_RENEW_ERROR = 'SILENT_RENEW_ERROR',
  USER_EXPIRING = 'USER_EXPIRING',
  LOADING_USER = 'LOADING_USER',
  SESSION_TERMINATED = 'SESSION_TERMINATED',
  USER_SIGNED_OUT = 'USER_SIGNED_OUT',
  LOAD_USER_ERROR = 'LOAD_USER_ERROR',
}

export const oidcInitialState: OidcReducerState = {
  isLoadingUser: false,
  user: null,
};

export enum ApiTokenActionTypes {
  FETCH_TOKEN_ERROR = 'FETCH_TOKEN_ERROR',
  FETCH_TOKEN_SUCCESS = 'FETCH_TOKEN_SUCCESS',
  RESET_API_TOKEN_DATA = 'RESET_API_TOKEN_DATA',
  START_FETCHING_TOKEN = 'START_FETCHING_TOKEN',
  TOKEN_FETCHED = 'TOKEN_FETCHED',
}

export const apiTokenInitialState: ApiTokenReducerState = {
  apiToken: null,
  isLoadingApiToken: false,
  tokenErrors: {},
};

// update api token every minute
export const API_TOKEN_EXPIRATION_TIME = 60000;
export const API_TOKEN_NOTIFICATION_TIME = 5000;
export const API_TOKEN_CHECK_INTERVAL = 5000;
