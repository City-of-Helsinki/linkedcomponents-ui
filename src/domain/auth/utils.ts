/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Sentry from '@sentry/react';
import axios, { AxiosResponse } from 'axios';
import { TFunction } from 'i18next';
import { User, UserManager, UserManagerSettings } from 'oidc-client-ts';
import React from 'react';

import { NotificationProps } from '../../common/components/notification/Notification';
import { Language } from '../../types';
import getUnixTime from '../../utils/getUnixTime';
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

const storageKey = 'hds_login_api_token_storage_key';

export const getApiTokenFromStorage = (): string | null => {
  const apiTokensStr = apiAccessTokenStorage.getItem(storageKey);

  if (apiTokensStr) {
    return JSON.parse(apiTokensStr)[import.meta.env.REACT_APP_OIDC_API_SCOPE];
  }

  return null;
};

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
  addNotification,
  locale,
  path,
  t,
  userManager,
}: {
  addNotification: (props: NotificationProps) => void;
  locale: Language;
  path?: string;
  t: TFunction;
  userManager: UserManager;
}): Promise<void> => {
  const MAINTENANCE_DISABLE_LOGIN =
    import.meta.env.REACT_APP_MAINTENANCE_DISABLE_LOGIN === 'true';

  if (MAINTENANCE_DISABLE_LOGIN) {
    addNotification({ label: t('maintenance.toast'), type: 'error' });

    return Promise.resolve();
  }

  await userManager
    .signinRedirect({
      state: { path: path || '/' },
      ui_locales: locale,
    })
    .catch((error) => {
      if (error.message === 'Network Error') {
        addNotification({
          label: t('authentication.networkError.message'),
          type: 'error',
        });
      } else {
        addNotification({
          label: t('authentication.errorMessage'),
          type: 'error',
        });

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
  addNotification,
  dispatchApiTokenState,
  t,
}: {
  accessToken: string;
  addNotification: (props: NotificationProps) => void;
  dispatchApiTokenState: React.Dispatch<ApiTokenAction>;
  t: TFunction;
}) => {
  const apiTokensUrl = import.meta.env.REACT_APP_OIDC_API_TOKENS_URL;

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
    addNotification({ label: t('authentication.errorMessage'), type: 'error' });
  }
};

export const getApiToken = async ({
  accessToken,
  addNotification,
  dispatchApiTokenState,
  t,
}: {
  accessToken: string;
  addNotification: (props: NotificationProps) => void;
  dispatchApiTokenState: React.Dispatch<ApiTokenAction>;
  t: TFunction;
}) => {
  startFetchingToken({ dispatchApiTokenState });
  await renewApiToken({
    accessToken,
    addNotification,
    dispatchApiTokenState,
    t,
  });
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
