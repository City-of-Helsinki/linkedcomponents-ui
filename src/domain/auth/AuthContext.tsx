/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Sentry from '@sentry/react';
import axios, { AxiosResponse } from 'axios';
import { User, UserManager } from 'oidc-client';
import React, {
  FC,
  PropsWithChildren,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { OIDC_API_TOKEN_ENDPOINT } from '../../constants';
import useLocale from '../../hooks/useLocale';
import {
  API_SCOPE,
  API_TOKEN_CHECK_INTERVAL,
  API_TOKEN_EXPIRATION_TIME,
  API_TOKEN_NOTIFICATION_TIME,
  ApiTokenActionTypes,
  apiTokenInitialState,
  OidcActionTypes,
  oidcInitialState,
} from './constants';
import {
  ApiTokenAction,
  ApiTokenReducerState,
  AuthContextProps,
  AuthProviderProps,
  OidcAction,
  OidcReducerState,
} from './types';
import { clearApiTokenFromStorage, setApiTokenToStorage } from './utils';

export const AuthContext = React.createContext<AuthContextProps | undefined>(
  undefined
);

/**
 * @private
 * @hidden
 * @param props
 */
export const initUserManager = (props: AuthProviderProps): UserManager => {
  return props.userManager;
};

const oidcReducer = (
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

const apiTokenReducer = (
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
    default:
      return state;
  }
};

/**
 *
 * @param props AuthProviderProps
 */
export const AuthProvider: FC<PropsWithChildren<AuthProviderProps>> = ({
  children,
  ...props
}) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const [userManager] = useState<UserManager>(() => initUserManager(props));

  const [oidcState, dispatchOidcState] = useReducer(
    oidcReducer,
    oidcInitialState
  );

  // eslint-disable-next-line no-undef
  const apiTokenTimer = React.useRef<NodeJS.Timeout>();
  const apiTokenExpiring = React.useRef<number | null>(null);
  const previousAccessToken = React.useRef<string | undefined>();

  const [apiTokenState, dispatchApiTokenState] = useReducer(
    apiTokenReducer,
    apiTokenInitialState
  );

  // event callback when the user has been loaded (on silent renew or redirect)
  const onUserLoaded = (user: User) => {
    dispatchOidcState({ type: OidcActionTypes.USER_FOUND, payload: user });
  };

  // event callback when silent renew errored
  const onSilentRenewError = () => {
    dispatchOidcState({
      type: OidcActionTypes.SILENT_RENEW_ERROR,
      payload: null,
    });
  };

  // event callback when the access token expired
  const onAccessTokenExpired = () => {
    dispatchOidcState({ type: OidcActionTypes.USER_EXPIRED, payload: null });
  };

  // event callback when the user is logged out
  const onUserUnloaded = () => {
    dispatchOidcState({
      type: OidcActionTypes.SESSION_TERMINATED,
      payload: null,
    });
  };

  // event callback when the user is expiring
  const onAccessTokenExpiring = () => {
    dispatchOidcState({ type: OidcActionTypes.USER_EXPIRING, payload: null });
  };

  // event callback when the user is signed out
  const onUserSignedOut = () => {
    dispatchOidcState({ type: OidcActionTypes.USER_SIGNED_OUT, payload: null });
  };

  // callback function called when the user has been loaded
  const getUserCallback = (user: User | null) => {
    if (user && !user.expired) {
      onUserLoaded(user);
    } else if (!user || (user && user.expired)) {
      onAccessTokenExpired();
    }
    return user;
  };

  // error callback called when the userManager's loadUser() function failed
  const errorCallback = (error: Error) => {
    console.error(
      `AuthContext: Error in loadUser() function: ${error.message}`
    );
    dispatchOidcState({ type: OidcActionTypes.LOAD_USER_ERROR, payload: null });
  };

  // function to load the current user into the store
  // NOTE: use only when silent renew is configured
  const loadUser = () => {
    dispatchOidcState({ type: OidcActionTypes.LOADING_USER, payload: null });

    return userManager.getUser().then(getUserCallback).catch(errorCallback);
  };

  useEffect(() => {
    // Load user automatically on mount
    loadUser();

    userManager.events.addUserLoaded(onUserLoaded);
    userManager.events.addSilentRenewError(onSilentRenewError);
    userManager.events.addAccessTokenExpired(onAccessTokenExpired);
    userManager.events.addAccessTokenExpiring(onAccessTokenExpiring);
    userManager.events.addUserUnloaded(onUserUnloaded);
    userManager.events.addUserSignedOut(onUserSignedOut);

    return () => {
      userManager.events.removeUserLoaded(onUserLoaded);
      userManager.events.removeSilentRenewError(onSilentRenewError);
      userManager.events.removeAccessTokenExpired(onAccessTokenExpired);
      userManager.events.removeAccessTokenExpiring(onAccessTokenExpiring);
      userManager.events.removeUserUnloaded(onUserUnloaded);
      userManager.events.removeUserSignedOut(onUserSignedOut);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { getApiToken, renewApiToken, resetApiTokenData } = useMemo(() => {
    const startFetchingToken = () => {
      dispatchApiTokenState({
        type: ApiTokenActionTypes.START_FETCHING_TOKEN,
        payload: null,
      });
    };

    const fetchTokenSuccess = (apiToken: string) => {
      setApiTokenToStorage(apiToken);
      dispatchApiTokenState({
        type: ApiTokenActionTypes.FETCH_TOKEN_SUCCESS,
        payload: apiToken,
      });
    };

    const fetchTokenError = (error: Error) => {
      clearApiTokenFromStorage();
      dispatchApiTokenState({
        type: ApiTokenActionTypes.FETCH_TOKEN_ERROR,
        payload: error,
      });
    };

    const resetApiTokenData = () => {
      clearApiTokenFromStorage();
      dispatchApiTokenState({
        type: ApiTokenActionTypes.RESET_API_TOKEN_DATA,
        payload: null,
      });
    };

    const renewApiToken = async (accessToken: string) => {
      try {
        const res: AxiosResponse = await axios.get(OIDC_API_TOKEN_ENDPOINT, {
          headers: { Authorization: `bearer ${accessToken}` },
        });

        const apiAccessToken = res.data[API_SCOPE];
        fetchTokenSuccess(apiAccessToken);
      } catch (e) {
        fetchTokenError(e as Error);
        toast.error(t('authentication.errorMessage'));
      }
    };

    return {
      getApiToken: (accessToken: string) => {
        startFetchingToken();
        renewApiToken(accessToken);
      },
      renewApiToken,
      resetApiTokenData,
    };
  }, [t]);

  const startApiTimer = () => {
    apiTokenExpiring.current = new Date().valueOf() + API_TOKEN_EXPIRATION_TIME;

    apiTokenTimer.current = setInterval(() => {
      // At the moment api token is not respecting api token exp time
      // Update api token in UI every minute to avoid "JWT too old" errors
      const isApiTokenExpiring =
        apiTokenExpiring.current &&
        new Date().valueOf() >
          apiTokenExpiring.current - API_TOKEN_NOTIFICATION_TIME;

      if (oidcState.user?.access_token && isApiTokenExpiring) {
        renewApiToken(oidcState.user?.access_token);
      }
    }, API_TOKEN_CHECK_INTERVAL);
  };

  const stopApiTimer = () => {
    apiTokenTimer.current && clearTimeout(apiTokenTimer.current);
  };

  React.useEffect(() => {
    // Get new api token after new access token
    if (previousAccessToken.current !== oidcState.user?.access_token) {
      if (oidcState.user?.access_token) {
        getApiToken(oidcState.user?.access_token);
      } else {
        resetApiTokenData();
      }
    }

    previousAccessToken.current = oidcState.user?.access_token;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oidcState.user?.access_token]);

  React.useEffect(() => {
    if (apiTokenState.apiToken) {
      // To make sure only one timer is running stop timer before starting it
      stopApiTimer();
      startApiTimer();
    } else {
      stopApiTimer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiTokenState.apiToken]);

  const value = useMemo<AuthContextProps>(() => {
    const signIn = async (path?: string): Promise<void> => {
      await userManager
        .signinRedirect({
          data: { path: path || '/' },
          ui_locales: locale,
        })
        .catch((error) => {
          if (error.message === 'Network Error') {
            toast.error(t('authentication.networkError.message'));
          } else {
            toast.error(t('authentication.errorMessage'));
            Sentry.captureException(error);
          }
        });
    };

    const signOut = async (): Promise<void> => {
      try {
        await clearAllState();
        await userManager.signoutRedirect();
      } catch (e) /* istanbul ignore next */ {
        Sentry.captureException(e);
      }
    };

    const clearAllState = async (): Promise<void> => {
      await Promise.all([
        // Clear backend auth data
        resetApiTokenData(),
        // Clear session storage
        sessionStorage.clear(),
      ]);
    };

    const isAuthenticated = !!oidcState.user && !!apiTokenState.apiToken;
    const isLoading =
      oidcState.isLoadingUser || apiTokenState.isLoadingApiToken;

    return {
      signIn,
      signOut,
      userManager,
      ...oidcState,
      ...apiTokenState,
      isAuthenticated,
      isLoading,
    };
  }, [userManager, oidcState, apiTokenState, locale, t, resetApiTokenData]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
