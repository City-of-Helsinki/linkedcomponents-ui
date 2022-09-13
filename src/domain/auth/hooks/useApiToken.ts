/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useReducer } from 'react';
import { useTranslation } from 'react-i18next';

import { API_TOKEN_CHECK_INTERVAL, apiTokenInitialState } from '../constants';
import { reducers } from '../reducers';
import { ApiTokenReducerState, OidcReducerState } from '../types';
import {
  getApiToken as getApiTokenFn,
  getApiTokenExpirationTime,
  isApiTokenExpiring,
  renewApiToken as renewApiTokenFn,
  resetApiTokenData as resetApiTokenDataFn,
} from '../utils';

export type UseApiTokenState = {
  apiTokenState: ApiTokenReducerState;
  resetApiTokenData: () => Promise<void>;
};

const useApiToken = (oidcState: OidcReducerState): UseApiTokenState => {
  const { t } = useTranslation();
  // eslint-disable-next-line no-undef
  const apiTokenTimer = React.useRef<NodeJS.Timeout>();
  const expirationTime = React.useRef<number | null>(null);
  const previousAccessToken = React.useRef<string | undefined>();

  const [apiTokenState, dispatchApiTokenState] = useReducer(
    reducers.apiTokenReducer,
    apiTokenInitialState
  );

  const { getApiToken, renewApiToken, resetApiTokenData } = useMemo(() => {
    return {
      getApiToken: async (accessToken: string) =>
        getApiTokenFn({ accessToken, dispatchApiTokenState, t }),
      renewApiToken: async (accessToken: string) =>
        renewApiTokenFn({ accessToken, dispatchApiTokenState, t }),
      resetApiTokenData: async () =>
        resetApiTokenDataFn({ dispatchApiTokenState }),
    };
  }, [t]);

  const startApiTimer = () => {
    stopApiTimer();
    expirationTime.current = getApiTokenExpirationTime();

    apiTokenTimer.current = setInterval(() => {
      // At the moment api token is not respecting api token exp time
      // Update api token in UI every minute to avoid "JWT too old" error
      if (
        oidcState.user?.access_token &&
        isApiTokenExpiring(expirationTime.current)
      ) {
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
      startApiTimer();
    } else {
      stopApiTimer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiTokenState.apiToken]);

  return { apiTokenState, resetApiTokenData };
};

export default useApiToken;
