/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Sentry from '@sentry/react';
import axios, { AxiosResponse } from 'axios';
import { TFunction } from 'i18next';
import { User, UserManager, UserManagerSettings } from 'oidc-client';
import React from 'react';
import { toast } from 'react-toastify';

import { Language } from '../../types';
import getUnixTime from '../../utils/getUnixTime';
import getValue from '../../utils/getValue';
import {
  API_SCOPE,
  API_TOKEN_EXPIRATION_TIME,
  API_TOKEN_NOTIFICATION_TIME,
  ApiTokenActionTypes,
  OidcActionTypes,
} from './constants';
import {
  ApiTokenAction,
  ApiTokenReducerState,
  OidcAction,
  OidcReducerState,
} from './types';

const apiAccessTokenStorage = sessionStorage;

const storageKey = `oidc.apiToken.${API_SCOPE}`;

const MAINTENANCE_MODE =
  process.env.REACT_APP_ENABLE_MAINTENANCE_MODE === 'true';

export const getApiTokenFromStorage = (): string | null =>
  apiAccessTokenStorage.getItem(storageKey);

export const setApiTokenToStorage = (accessToken: string): void =>
  apiAccessTokenStorage.setItem(storageKey, accessToken);

export const clearApiTokenFromStorage = (): void =>
  apiAccessTokenStorage.removeItem(storageKey);

export const createUserManager = (config: UserManagerSettings) => {
  return new UserManager(config);
};

// Oidc auth actions
// event callback when the access token expired
export const onAccessTokenExpired = ({
  dispatchOidcState,
}: {
  dispatchOidcState: React.Dispatch<OidcAction>;
}) => {
  dispatchOidcState({ type: OidcActionTypes.USER_EXPIRED, payload: null });
};

// event callback when the user is expiring
export const onAccessTokenExpiring = ({
  dispatchOidcState,
}: {
  dispatchOidcState: React.Dispatch<OidcAction>;
}) => {
  dispatchOidcState({ type: OidcActionTypes.USER_EXPIRING, payload: null });
};

// event callback when silent renew errored
export const onSilentRenewError = ({
  dispatchOidcState,
}: {
  dispatchOidcState: React.Dispatch<OidcAction>;
}) => {
  dispatchOidcState({
    type: OidcActionTypes.SILENT_RENEW_ERROR,
    payload: null,
  });
};

// event callback when the user has been loaded (on silent renew or redirect)
export const onUserLoaded = ({
  dispatchOidcState,
  user,
}: {
  dispatchOidcState: React.Dispatch<OidcAction>;
  user: User;
}) => {
  dispatchOidcState({ type: OidcActionTypes.USER_FOUND, payload: user });
};

// event callback when the user is signed out
export const onUserSignedOut = ({
  dispatchOidcState,
}: {
  dispatchOidcState: React.Dispatch<OidcAction>;
}) => {
  dispatchOidcState({ type: OidcActionTypes.USER_SIGNED_OUT, payload: null });
};

// event callback when the user is logged out
export const onUserUnloaded = ({
  dispatchOidcState,
}: {
  dispatchOidcState: React.Dispatch<OidcAction>;
}) => {
  dispatchOidcState({
    type: OidcActionTypes.SESSION_TERMINATED,
    payload: null,
  });
};

// callback function called when the user has been loaded
export const getUserCallback = ({
  dispatchOidcState,
  user,
}: {
  dispatchOidcState: React.Dispatch<OidcAction>;
  user: User | null;
}) => {
  /* istanbul ignore else */
  if (user && !user.expired) {
    onUserLoaded({ dispatchOidcState, user });
  } else if (!user || (user && user.expired)) {
    onAccessTokenExpired({ dispatchOidcState });
  }
  return user;
};

// error callback called when the userManager's loadUser() function failed
export const errorCallback = ({
  dispatchOidcState,
  error,
}: {
  dispatchOidcState: React.Dispatch<OidcAction>;
  error: Error;
}) => {
  console.error(`AuthContext: Error in loadUser() function: ${error.message}`);
  dispatchOidcState({ type: OidcActionTypes.LOAD_USER_ERROR, payload: null });
};

// function to load the current user into the store
// NOTE: use only when silent renew is configured
export const loadUser = async ({
  dispatchOidcState,
  userManager,
}: {
  dispatchOidcState: React.Dispatch<OidcAction>;
  userManager: UserManager;
}): Promise<void> => {
  dispatchOidcState({ type: OidcActionTypes.LOADING_USER, payload: null });

  userManager
    .getUser()
    .then((user) => getUserCallback({ dispatchOidcState, user }))
    .catch((error) => errorCallback({ dispatchOidcState, error }));
};

export const signIn = async ({
  locale,
  path,
  t,
  userManager,
}: {
  locale: Language;
  path?: string;
  t: TFunction;
  userManager: UserManager;
}): Promise<void> => {
  if (MAINTENANCE_MODE) {
    toast.error(getValue(t('maintenance.toast'), ''));

    return Promise.reject();
  }

  await userManager
    .signinRedirect({
      data: { path: path || '/' },
      ui_locales: locale,
    })
    .catch((error) => {
      if (error.message === 'Network Error') {
        toast.error(getValue(t('authentication.networkError.message'), ''));
      } else {
        toast.error(getValue(t('authentication.errorMessage'), ''));
        Sentry.captureException(error);
      }
    });
};

export const signOut = async ({
  resetApiTokenData,
  userManager,
}: {
  resetApiTokenData: () => Promise<void>;
  userManager: UserManager;
}): Promise<void> => {
  try {
    await clearAllState(resetApiTokenData);
    await userManager.signoutRedirect();
  } catch (e) /* istanbul ignore next */ {
    Sentry.captureException(e);
  }
};

export const clearAllState = async (
  resetApiTokenData: () => Promise<void>
): Promise<void> => {
  await Promise.all([
    // Clear backend auth data
    await resetApiTokenData(),
    // Clear session storage
    sessionStorage.clear(),
  ]);
};

// Api token action
export const startFetchingToken = ({
  dispatchApiTokenState,
}: {
  dispatchApiTokenState: React.Dispatch<ApiTokenAction>;
}) => {
  dispatchApiTokenState({
    type: ApiTokenActionTypes.START_FETCHING_TOKEN,
    payload: null,
  });
};

export const fetchTokenSuccess = async ({
  apiToken,
  dispatchApiTokenState,
}: {
  apiToken: string;
  dispatchApiTokenState: React.Dispatch<ApiTokenAction>;
}) => {
  setApiTokenToStorage(apiToken);
  dispatchApiTokenState({
    type: ApiTokenActionTypes.FETCH_TOKEN_SUCCESS,
    payload: apiToken,
  });
};

export const fetchTokenError = ({
  dispatchApiTokenState,
  error,
}: {
  dispatchApiTokenState: React.Dispatch<ApiTokenAction>;
  error: Error;
}) => {
  clearApiTokenFromStorage();
  dispatchApiTokenState({
    type: ApiTokenActionTypes.FETCH_TOKEN_ERROR,
    payload: error,
  });
};

export const renewApiToken = async ({
  accessToken,
  dispatchApiTokenState,
  t,
}: {
  accessToken: string;
  dispatchApiTokenState: React.Dispatch<ApiTokenAction>;
  t: TFunction;
}) => {
  const apiTokensUrl = process.env.REACT_APP_OIDC_API_TOKENS_URL;

  if (!apiTokensUrl) {
    throw new Error(
      'Application configuration error, missing Tunnistamo api tokens url.'
    );
  }

  try {
    const res: AxiosResponse = await axios.get(apiTokensUrl, {
      headers: { Authorization: `bearer ${accessToken}` },
    });

    const apiToken = res.data[API_SCOPE];
    fetchTokenSuccess({ apiToken, dispatchApiTokenState });
  } catch (error: any) {
    fetchTokenError({ error, dispatchApiTokenState });
    toast.error(getValue(t('authentication.errorMessage'), ''));
  }
};

export const getApiToken = async ({
  accessToken,
  dispatchApiTokenState,
  t,
}: {
  accessToken: string;
  dispatchApiTokenState: React.Dispatch<ApiTokenAction>;
  t: TFunction;
}) => {
  startFetchingToken({ dispatchApiTokenState });
  await renewApiToken({ accessToken, dispatchApiTokenState, t });
};

export const resetApiTokenData = ({
  dispatchApiTokenState,
}: {
  dispatchApiTokenState: React.Dispatch<ApiTokenAction>;
}) => {
  clearApiTokenFromStorage();
  dispatchApiTokenState({
    type: ApiTokenActionTypes.RESET_API_TOKEN_DATA,
    payload: null,
  });
};

export const getApiTokenExpirationTime = (): number =>
  getUnixTime(new Date()) + API_TOKEN_EXPIRATION_TIME;

export const isApiTokenExpiring = (expirationTime: number | null): boolean =>
  Boolean(
    expirationTime &&
      getUnixTime(new Date()) > expirationTime - API_TOKEN_NOTIFICATION_TIME
  );

export const getIsAuthenticated = ({
  apiTokenState,
  oidcState,
}: {
  apiTokenState: ApiTokenReducerState;
  oidcState: OidcReducerState;
}) => !!oidcState.user && !!apiTokenState.apiToken;

export const getIsLoading = ({
  apiTokenState,
  oidcState,
}: {
  apiTokenState: ApiTokenReducerState;
  oidcState: OidcReducerState;
}) => oidcState.isLoadingUser || apiTokenState.isLoadingApiToken;
