import { fakeOidcUserState } from '../../../utils/mockAuthContextValue';
import {
  ApiTokenActionTypes,
  apiTokenInitialState,
  OidcActionTypes,
  oidcInitialState,
} from '../constants';
import { apiTokenReducer, oidcReducer } from '../reducers';
import {
  ApiTokenAction,
  ApiTokenReducerState,
  OidcAction,
  OidcReducerState,
} from '../types';

describe('apiTokenReducer function', () => {
  const loadingApiTokenState = {
    ...apiTokenInitialState,
    isLoadingApiToken: true,
  };

  const cases: [ApiTokenAction, ApiTokenReducerState, ApiTokenReducerState][] =
    [
      [
        {
          type: ApiTokenActionTypes.FETCH_TOKEN_ERROR,
          payload: { error: 'fail' },
        },
        loadingApiTokenState,
        {
          apiToken: null,
          isLoadingApiToken: false,
          tokenErrors: { error: 'fail' },
        },
      ],
      [
        { type: ApiTokenActionTypes.FETCH_TOKEN_SUCCESS, payload: 'api-token' },
        loadingApiTokenState,
        { apiToken: 'api-token', isLoadingApiToken: false, tokenErrors: {} },
      ],
      [
        { type: ApiTokenActionTypes.RESET_API_TOKEN_DATA, payload: null },
        loadingApiTokenState,
        { apiToken: null, isLoadingApiToken: false, tokenErrors: {} },
      ],
      [
        { type: ApiTokenActionTypes.START_FETCHING_TOKEN, payload: null },
        apiTokenInitialState,
        { apiToken: null, isLoadingApiToken: true, tokenErrors: {} },
      ],
      [
        { type: ApiTokenActionTypes.TOKEN_FETCHED, payload: null },
        loadingApiTokenState,
        { apiToken: null, isLoadingApiToken: false, tokenErrors: {} },
      ],
    ];

  it.each(cases)(
    'should return correct state with action %p',
    async (action, initialState, state) => {
      expect(apiTokenReducer(initialState, action)).toEqual(state);
    }
  );
});

describe('oidcReducer function', () => {
  const user = fakeOidcUserState();
  const loadingOidcState = { isLoadingUser: true, user };

  const cases: [OidcAction, OidcReducerState, OidcReducerState][] = [
    [
      { type: OidcActionTypes.LOADING_USER, payload: null },
      oidcInitialState,
      { isLoadingUser: true, user: null },
    ],
    [
      { type: OidcActionTypes.LOAD_USER_ERROR, payload: null },
      loadingOidcState,
      { isLoadingUser: true, user },
    ],
    [
      { type: OidcActionTypes.SESSION_TERMINATED, payload: null },
      loadingOidcState,
      { isLoadingUser: false, user: null },
    ],
    [
      { type: OidcActionTypes.SILENT_RENEW_ERROR, payload: null },
      loadingOidcState,
      { isLoadingUser: false, user: null },
    ],
    [
      { type: OidcActionTypes.USER_EXPIRED, payload: null },
      loadingOidcState,
      { isLoadingUser: false, user: null },
    ],
    [
      { type: OidcActionTypes.USER_EXPIRING, payload: null },
      loadingOidcState,
      { isLoadingUser: true, user },
    ],
    [
      { type: OidcActionTypes.USER_FOUND, payload: user },
      { isLoadingUser: true, user: null },
      { isLoadingUser: false, user },
    ],
    [
      { type: OidcActionTypes.USER_SIGNED_OUT, payload: null },
      loadingOidcState,
      { isLoadingUser: false, user: null },
    ],
  ];

  it.each(cases)(
    'should return correct state with action %p',
    async (action, initialState, state) => {
      expect(oidcReducer(initialState, action)).toEqual(state);
    }
  );
});
