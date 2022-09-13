/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-disable import/no-named-as-default-member */
import mockAxios from 'axios';
import i18n from 'i18next';
import { advanceTo, clear } from 'jest-date-mock';
import { toast } from 'react-toastify';

import { fakeOidcUserState } from '../../../utils/mockAuthContextValue';
import { waitReducerToBeCalled } from '../../../utils/testUtils';
import { API_SCOPE, ApiTokenActionTypes, OidcActionTypes } from '../constants';
import userManager from '../userManager';
import {
  clearApiTokenFromStorage,
  errorCallback,
  fetchTokenError,
  fetchTokenSuccess,
  getApiToken,
  getApiTokenExpirationTime,
  getApiTokenFromStorage,
  getUserCallback,
  isApiTokenExpiring,
  loadUser,
  onAccessTokenExpired,
  onAccessTokenExpiring,
  onSilentRenewError,
  onUserLoaded,
  onUserSignedOut,
  onUserUnloaded,
  renewApiToken,
  resetApiTokenData,
  setApiTokenToStorage,
  signIn,
  signOut,
  startFetchingToken,
} from '../utils';

afterEach(() => {
  jest.clearAllMocks();
  clear();
});

const events = {
  addAccessTokenExpired: () => undefined,
  addAccessTokenExpiring: () => undefined,
  addSilentRenewError: () => undefined,
  addUserLoaded: () => undefined,
  addUserSignedOut: () => undefined,
  addUserUnloaded: () => undefined,
  removeAccessTokenExpired: () => undefined,
  removeAccessTokenExpiring: () => undefined,
  removeSilentRenewError: () => undefined,
  removeUserLoaded: () => undefined,
  removeUserSignedOut: () => undefined,
  removeUserUnloaded: () => undefined,
};

const axiousCalled = async ({
  accessToken,
  axiosFn,
}: {
  accessToken: string;
  axiosFn: jest.SpyInstance;
}) => {
  expect(axiosFn).toHaveBeenCalledTimes(1);
  expect(axiosFn).toHaveBeenCalledWith(
    `${process.env.REACT_APP_OIDC_AUTHORITY}/api-tokens/`,
    { headers: { Authorization: `bearer ${accessToken}` } }
  );
};

const apiTokenFetchSucceeded = async ({
  accessToken,
  axiosFn,
  dispatch,
}: {
  accessToken: string;
  axiosFn: jest.SpyInstance;
  dispatch: jest.SpyInstance;
}) => {
  axiousCalled({ accessToken, axiosFn });

  await waitReducerToBeCalled(
    dispatch,
    expect.objectContaining({ type: ApiTokenActionTypes.FETCH_TOKEN_SUCCESS })
  );
};

const apiTokenFetchFailed = async ({
  accessToken,
  axiosFn,
  dispatch,
}: {
  accessToken: string;
  axiosFn: jest.SpyInstance;
  dispatch: jest.SpyInstance;
}) => {
  axiousCalled({ accessToken, axiosFn });

  await waitReducerToBeCalled(
    dispatch,
    expect.objectContaining({ type: ApiTokenActionTypes.FETCH_TOKEN_ERROR })
  );
};

describe('getApiTokenFromStorage function', () => {
  it('should store api token to session storage and get it from there', async () => {
    const apiToken = 'api-token';

    expect(getApiTokenFromStorage()).toBe(null);

    setApiTokenToStorage(apiToken);
    expect(getApiTokenFromStorage()).toBe(apiToken);

    clearApiTokenFromStorage();
    expect(getApiTokenFromStorage()).toBe(null);
  });
});

describe('onAccessTokenExpired function', () => {
  it('should call reducer correcly', async () => {
    const dispatchOidcState = jest.fn();

    onAccessTokenExpired({ dispatchOidcState });

    await waitReducerToBeCalled(dispatchOidcState, {
      payload: null,
      type: OidcActionTypes.USER_EXPIRED,
    });
  });
});

describe('onAccessTokenExpiring function', () => {
  it('should call reducer correcly', async () => {
    const dispatchOidcState = jest.fn();

    onAccessTokenExpiring({ dispatchOidcState });

    await waitReducerToBeCalled(dispatchOidcState, {
      payload: null,
      type: OidcActionTypes.USER_EXPIRING,
    });
  });
});

describe('onSilentRenewError function', () => {
  it('should call reducer correcly', async () => {
    const dispatchOidcState = jest.fn();

    onSilentRenewError({ dispatchOidcState });

    await waitReducerToBeCalled(dispatchOidcState, {
      payload: null,
      type: OidcActionTypes.SILENT_RENEW_ERROR,
    });
  });
});

describe('onUserLoaded function', () => {
  it('should call reducer correcly', async () => {
    const user = fakeOidcUserState({ expired: true });
    const dispatchOidcState = jest.fn();

    onUserLoaded({ dispatchOidcState, user });

    await waitReducerToBeCalled(dispatchOidcState, {
      payload: user,
      type: OidcActionTypes.USER_FOUND,
    });
  });
});

describe('onUserSignedOut function', () => {
  it('should call reducer correcly', async () => {
    const dispatchOidcState = jest.fn();

    onUserSignedOut({ dispatchOidcState });

    await waitReducerToBeCalled(dispatchOidcState, {
      payload: null,
      type: OidcActionTypes.USER_SIGNED_OUT,
    });
  });
});

describe('onUserUnloaded function', () => {
  it('should call reducer correcly', async () => {
    const dispatchOidcState = jest.fn();

    onUserUnloaded({ dispatchOidcState });

    await waitReducerToBeCalled(dispatchOidcState, {
      payload: null,
      type: OidcActionTypes.SESSION_TERMINATED,
    });
  });
});

describe('getUserCallback function', () => {
  it('should clear user when user is null ', async () => {
    const dispatchOidcState = jest.fn();

    getUserCallback({ dispatchOidcState, user: null });

    await waitReducerToBeCalled(dispatchOidcState, {
      payload: null,
      type: OidcActionTypes.USER_EXPIRED,
    });
  });

  it('should clear user when user is expired ', async () => {
    const dispatchOidcState = jest.fn();
    const user = fakeOidcUserState({ expired: true });

    getUserCallback({ dispatchOidcState, user });

    await waitReducerToBeCalled(dispatchOidcState, {
      payload: null,
      type: OidcActionTypes.USER_EXPIRED,
    });
  });

  it('should set user when user is not expired ', async () => {
    const dispatchOidcState = jest.fn();
    const user = fakeOidcUserState({ expired: false });

    getUserCallback({ dispatchOidcState, user });

    await waitReducerToBeCalled(dispatchOidcState, {
      payload: user,
      type: OidcActionTypes.USER_FOUND,
    });
  });
});

describe('errorCallback function', () => {
  it('should call error callback', async () => {
    console.error = jest.fn();
    const dispatchOidcState = jest.fn();

    errorCallback({ dispatchOidcState, error: new Error('error') });

    await waitReducerToBeCalled(dispatchOidcState, {
      payload: null,
      type: OidcActionTypes.LOAD_USER_ERROR,
    });

    expect(console.error).toBeCalledWith(
      'AuthContext: Error in loadUser() function: error'
    );
  });
});

describe('loadUser function', () => {
  it('should load user successfully', async () => {
    const user = { access_token: 'token', expired: false };
    const userManager = {
      getUser: async () => user,
      removeUser: jest.fn(),
      signoutRedirect: jest.fn(),
      events,
    } as any;
    const dispatchOidcState = jest.fn();

    loadUser({ dispatchOidcState, userManager });

    await waitReducerToBeCalled(dispatchOidcState, {
      payload: user,
      type: OidcActionTypes.USER_FOUND,
    });
  });

  it('should load user successfully', async () => {
    const userManager = {
      getUser: jest.fn().mockRejectedValue({ message: 'error' }),
      removeUser: jest.fn(),
      signoutRedirect: jest.fn(),
      events,
    } as any;
    const dispatchOidcState = jest.fn();

    loadUser({ dispatchOidcState, userManager });

    await waitReducerToBeCalled(dispatchOidcState, {
      payload: null,
      type: OidcActionTypes.LOAD_USER_ERROR,
    });

    expect(console.error).toBeCalledWith(
      'AuthContext: Error in loadUser() function: error'
    );
  });
});

describe('signIn function', () => {
  it('should show toast error message when login fails', async () => {
    const toastError = jest.spyOn(toast, 'error');
    const error = { message: 'General error' };
    const signinRedirect = jest
      .spyOn(userManager, 'signinRedirect')
      .mockRejectedValue(error);

    await signIn({ locale: 'fi', t: i18n.t.bind(i18n), userManager });

    expect(signinRedirect).toHaveBeenCalledTimes(1);
    expect(signinRedirect).toHaveBeenCalledWith({
      data: { path: '/' },
      ui_locales: 'fi',
    });
    expect(toastError).toBeCalledWith('Tapahtui virhe. Yritä uudestaan');
  });

  it('should show toast error message when login fails with NetworkError', async () => {
    const toastError = jest.spyOn(toast, 'error');
    const error = { message: 'Network Error' };
    const signinRedirect = jest
      .spyOn(userManager, 'signinRedirect')
      .mockRejectedValue(error);
    const path = '/fi/events';

    await signIn({ locale: 'fi', path, t: i18n.t.bind(i18n), userManager });

    expect(signinRedirect).toHaveBeenCalledTimes(1);
    expect(signinRedirect).toHaveBeenCalledWith({
      data: { path },
      ui_locales: 'fi',
    });
    expect(toastError).toBeCalledWith(
      'Virhe kirjautumisessa: Tarkista verkkoyhteytesi ja yritä uudestaan'
    );
  });
});

describe('signOut function', () => {
  it('should clear user after signing out', async () => {
    const resetApiTokenData = jest.fn();

    await signOut({ resetApiTokenData, userManager });

    expect(resetApiTokenData).toBeCalled();
    expect(sessionStorage.clear).toHaveBeenCalled();
  });
});

describe('fetchTokenError function', () => {
  it('should call reducer correcly', async () => {
    const dispatchApiTokenState = jest.fn();
    const error = new Error('error');

    fetchTokenError({ dispatchApiTokenState, error });

    await waitReducerToBeCalled(dispatchApiTokenState, {
      payload: error,
      type: ApiTokenActionTypes.FETCH_TOKEN_ERROR,
    });
  });
});

describe('fetchTokenSuccess function', () => {
  it('should call reducer correcly', async () => {
    const dispatchApiTokenState = jest.fn();
    const apiToken = 'token';

    fetchTokenSuccess({ apiToken, dispatchApiTokenState });

    await waitReducerToBeCalled(dispatchApiTokenState, {
      payload: apiToken,
      type: ApiTokenActionTypes.FETCH_TOKEN_SUCCESS,
    });
  });
});

describe('getApiToken function', () => {
  it('should get api token', async () => {
    const dispatchApiTokenState = jest.fn();
    const accessToken = 'access-token';
    const apiToken = 'api-token';

    const axiosGet = jest
      .spyOn(mockAxios, 'get')
      .mockResolvedValue({ data: { [API_SCOPE]: apiToken } });

    await getApiToken({
      accessToken,
      dispatchApiTokenState,
      t: i18n.t.bind(i18n),
    });

    await apiTokenFetchSucceeded({
      accessToken,
      axiosFn: axiosGet,
      dispatch: dispatchApiTokenState,
    });
  });

  it('should show toast error message when failing to get api token', async () => {
    const dispatchApiTokenState = jest.fn();
    const toastError = jest.spyOn(toast, 'error');
    const accessToken = 'access-token';
    const error = new Error('error');

    const axiosGet = jest.spyOn(mockAxios, 'get').mockRejectedValue(error);

    await getApiToken({
      accessToken,
      dispatchApiTokenState,
      t: i18n.t.bind(i18n),
    });

    await apiTokenFetchFailed({
      accessToken,
      axiosFn: axiosGet,
      dispatch: dispatchApiTokenState,
    });

    expect(toastError).toBeCalledWith('Tapahtui virhe. Yritä uudestaan');
  });
});

describe('renewApiToken function', () => {
  it('should renew api token', async () => {
    const dispatchApiTokenState = jest.fn();
    const accessToken = 'access-token';
    const apiToken = 'api-token';

    const axiosGet = jest
      .spyOn(mockAxios, 'get')
      .mockResolvedValue({ data: { [API_SCOPE]: apiToken } });

    await renewApiToken({
      accessToken,
      dispatchApiTokenState,
      t: i18n.t.bind(i18n),
    });

    await apiTokenFetchSucceeded({
      accessToken,
      axiosFn: axiosGet,
      dispatch: dispatchApiTokenState,
    });
  });

  it('should show toast error message when failing to renew api token', async () => {
    const dispatchApiTokenState = jest.fn();
    const toastError = jest.spyOn(toast, 'error');
    const accessToken = 'access-token';
    const error = new Error('error');

    const axiosGet = jest.spyOn(mockAxios, 'get').mockRejectedValue(error);

    await renewApiToken({
      accessToken,
      dispatchApiTokenState,
      t: i18n.t.bind(i18n),
    });

    await apiTokenFetchFailed({
      accessToken,
      axiosFn: axiosGet,
      dispatch: dispatchApiTokenState,
    });

    expect(toastError).toBeCalledWith('Tapahtui virhe. Yritä uudestaan');
  });
});

describe('resetApiTokenData function', () => {
  it('should call reducer correcly', async () => {
    const dispatchApiTokenState = jest.fn();

    resetApiTokenData({ dispatchApiTokenState });

    await waitReducerToBeCalled(dispatchApiTokenState, {
      payload: null,
      type: ApiTokenActionTypes.RESET_API_TOKEN_DATA,
    });
  });
});

describe('startFetchingToken function', () => {
  it('should call reducer correcly', async () => {
    const dispatchApiTokenState = jest.fn();

    startFetchingToken({ dispatchApiTokenState });

    await waitReducerToBeCalled(dispatchApiTokenState, {
      payload: null,
      type: ApiTokenActionTypes.START_FETCHING_TOKEN,
    });
  });
});

describe('getApiTokenExpirationTime function', () => {
  it('should get expiration time', async () => {
    advanceTo('2022-09-08');
    expect(getApiTokenExpirationTime()).toBe(1662595260);
  });
});

describe('isApiTokenExpiring', () => {
  const expirationTime = 1662595260;

  it('should return true', async () => {
    advanceTo('2022-09-08');
    expect(isApiTokenExpiring(expirationTime - 60)).toBe(true);
  });

  it('should return true', async () => {
    advanceTo('2022-09-08');

    expect(isApiTokenExpiring(null)).toBe(false);
    expect(isApiTokenExpiring(expirationTime - 59)).toBe(false);
  });
});
