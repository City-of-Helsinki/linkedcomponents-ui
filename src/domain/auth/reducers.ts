import { createReducer } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { reducer as oidcReducer } from 'redux-oidc';

import { API_TOKEN_ACTIONS } from './constants';
import { ApiTokenData, ApiTokenResponse } from './types';

export const defaultApiTokenData: ApiTokenData = {
  apiToken: null,
  errors: {},
  loading: false,
};

const tokenReducer = createReducer(defaultApiTokenData, {
  [API_TOKEN_ACTIONS.START_FETCHING_TOKEN]: (state) => ({
    ...state,
    loading: true,
  }),
  [API_TOKEN_ACTIONS.FETCH_TOKEN_SUCCESS]: (state, action) => ({
    ...state,
    apiToken: Object.values(action.payload)[0] as ApiTokenResponse,
    loading: false,
  }),
  [API_TOKEN_ACTIONS.FETCH_TOKEN_ERROR]: (state, action) => ({
    ...state,
    apiToken: null,
    errors: action.payload,
    loading: false,
  }),
  [API_TOKEN_ACTIONS.RESET_API_TOKEN_DATA]: (state, action) =>
    defaultApiTokenData,
  [API_TOKEN_ACTIONS.TOKEN_FETCHED]: (state, action) => ({
    ...state,
    loading: false,
  }),
});

export default combineReducers({
  token: tokenReducer,
  oidc: oidcReducer,
});
