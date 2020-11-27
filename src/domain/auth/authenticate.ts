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
import { ApiTokenResponse } from './types';
import userManager from './userManager';

export const signIn = (path?: string) => {
  userManager
    .signinRedirect({
      data: { path: path || '/' },
      // eslint-disable-next-line @typescript-eslint/camelcase
      ui_locales: i18n.language,
    })
    .catch((error) => {
      if (error.message === 'Network Error') {
        toast.error(i18n.t('authentication.networkError.message'));
      } else {
        toast.error(i18n.t('authentication.errorMessage'));
        // TODO: Send error to Sentry
        // Sentry.captureException(error);
      }
    });
};

export const getApiToken = (accessToken: string): StoreThunk => async (
  dispatch: Function
) => {
  try {
    dispatch(startFetchingToken());

    const res: AxiosResponse<ApiTokenResponse> = await axios.get(
      OIDC_API_TOKEN_ENDPOINT,
      {
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      }
    );

    dispatch(fetchTokenSuccess(res.data));
  } catch (e) {
    dispatch(fetchTokenError(e));
    toast.error(i18n.t('authentication.errorMessage'));
  }
};

export const signOut = async () => {
  try {
    await clearAllState();
    await userManager.signoutRedirect();
  } catch (e) {
    // TODO: Send error to Sentry
    // Sentry.captureException(e);
  }
};

export const clearAllState = async () => {
  await Promise.all([
    // Clear backend auth data
    store.dispatch(resetApiTokenData()),
  ]);
};
