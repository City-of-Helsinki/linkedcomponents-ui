import * as Sentry from '@sentry/react';
import axios, { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

import { OIDC_API_TOKEN_ENDPOINT } from '../../constants';
import { StoreThunk } from '../../types';
import i18n from '../app/i18n/i18nInit';
import { store } from '../app/store/store';
import {
  fetchTokenError,
  fetchTokenSuccess,
  resetApiTokenData,
  startFetchingToken,
} from './actions';
import { TokenResponse } from './types';
import userManager from './userManager';

export const signIn = (path?: string): void => {
  userManager
    .signinRedirect({
      data: { path: path || '/' },
      ui_locales: i18n.language,
    })
    .catch((error) => {
      if (error.message === 'Network Error') {
        toast.error(i18n.t('authentication.networkError.message') as string);
      } else {
        toast.error(i18n.t('authentication.errorMessage') as string);
        Sentry.captureException(error);
      }
    });
};

export const getApiToken =
  (accessToken: string): StoreThunk =>
  async (dispatch) => {
    try {
      dispatch(startFetchingToken());

      const res: AxiosResponse<TokenResponse> = await axios.get(
        OIDC_API_TOKEN_ENDPOINT,
        {
          headers: {
            Authorization: `bearer ${accessToken}`,
          },
        }
      );

      dispatch(fetchTokenSuccess(res.data));
    } catch (e) {
      dispatch(fetchTokenError(e as Error));
      toast.error(i18n.t('authentication.errorMessage') as string);
    }
  };

export const renewApiToken =
  (accessToken: string): StoreThunk =>
  async (dispatch) => {
    try {
      const res: AxiosResponse<TokenResponse> = await axios.get(
        OIDC_API_TOKEN_ENDPOINT,
        {
          headers: {
            Authorization: `bearer ${accessToken}`,
          },
        }
      );

      dispatch(fetchTokenSuccess(res.data));
    } catch (e) {
      dispatch(fetchTokenError(e as Error));
      toast.error(i18n.t('authentication.errorMessage') as string);
    }
  };

export const signOut = async (): Promise<void> => {
  try {
    await clearAllState();
    await userManager.signoutRedirect();
  } catch (e) /* istanbul ignore next */ {
    Sentry.captureException(e);
  }
};

export const clearAllState = async (): Promise<void> => {
  await Promise.all([
    // Clear backend auth data
    store.dispatch(resetApiTokenData()),

    // Clear session storage
    sessionStorage.clear(),
  ]);
};
