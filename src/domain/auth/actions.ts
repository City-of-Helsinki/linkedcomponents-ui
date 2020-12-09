import { createAction } from '@reduxjs/toolkit';

import { API_TOKEN_ACTIONS } from './constants';
import { TokenResponse } from './types';

const fetchTokenSuccess = createAction<TokenResponse>(
  API_TOKEN_ACTIONS.FETCH_TOKEN_SUCCESS
);

const fetchTokenError = createAction<Error>(
  API_TOKEN_ACTIONS.FETCH_TOKEN_ERROR
);

const resetApiTokenData = createAction(API_TOKEN_ACTIONS.RESET_API_TOKEN_DATA);

const startFetchingToken = createAction(API_TOKEN_ACTIONS.START_FETCHING_TOKEN);

const tokenFetched = createAction(API_TOKEN_ACTIONS.TOKEN_FETCHED);

export {
  fetchTokenError,
  fetchTokenSuccess,
  resetApiTokenData,
  startFetchingToken,
  tokenFetched,
};
