import {
  ApiTokenActionTypes,
  apiTokenInitialState,
  OidcActionTypes,
} from './constants';
import {
  ApiTokenAction,
  ApiTokenReducerState,
  OidcAction,
  OidcReducerState,
} from './types';

export const apiTokenReducer = (
  state: ApiTokenReducerState,
  action: ApiTokenAction
): ApiTokenReducerState => {
  const { type, payload } = action;

  switch (type) {
    case ApiTokenActionTypes.START_FETCHING_TOKEN:
      return { ...state, isLoadingApiToken: true };
    case ApiTokenActionTypes.FETCH_TOKEN_SUCCESS:
      return { ...state, apiToken: payload, isLoadingApiToken: false };
    case ApiTokenActionTypes.FETCH_TOKEN_ERROR:
      return {
        ...state,
        apiToken: null,
        isLoadingApiToken: false,
        tokenErrors: payload,
      };
    case ApiTokenActionTypes.RESET_API_TOKEN_DATA:
      return apiTokenInitialState;
    case ApiTokenActionTypes.TOKEN_FETCHED:
      return { ...state, isLoadingApiToken: false };
  }
};

export const oidcReducer = (
  state: OidcReducerState,
  action: OidcAction
): OidcReducerState => {
  const { type, payload } = action;

  switch (type) {
    case OidcActionTypes.USER_EXPIRED:
      return { ...state, user: null, isLoadingUser: false };
    case OidcActionTypes.USER_FOUND:
      return { ...state, user: payload, isLoadingUser: false };
    case OidcActionTypes.SILENT_RENEW_ERROR:
      return { ...state, user: null, isLoadingUser: false };
    case OidcActionTypes.LOADING_USER:
      return { ...state, isLoadingUser: true };
    case OidcActionTypes.SESSION_TERMINATED:
    case OidcActionTypes.USER_SIGNED_OUT:
      return { ...state, user: null, isLoadingUser: false };
    default:
      return state;
  }
};

export const reducers = {
  apiTokenReducer,
  oidcReducer,
};
