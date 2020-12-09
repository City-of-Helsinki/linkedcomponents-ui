import { createReducer } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { reducer as oidcReducer } from 'redux-oidc';

import { API_TOKEN_ACTIONS, defaultTokenState } from './constants';
import { TokenResponse } from './types';

const tokenReducer = createReducer(defaultTokenState, {
  [API_TOKEN_ACTIONS.START_FETCHING_TOKEN]: (state) => ({
    ...state,
    loading: true,
  }),
  [API_TOKEN_ACTIONS.FETCH_TOKEN_SUCCESS]: (state, action) => ({
    ...state,
    apiToken: Object.values(action.payload)[0] as TokenResponse,
    loading: false,
  }),
  [API_TOKEN_ACTIONS.FETCH_TOKEN_ERROR]: (state, action) => ({
    ...state,
    apiToken: null,
    errors: action.payload,
    loading: false,
  }),
  [API_TOKEN_ACTIONS.RESET_API_TOKEN_DATA]: (state, action) =>
    defaultTokenState,
  [API_TOKEN_ACTIONS.TOKEN_FETCHED]: (state, action) => ({
    ...state,
    loading: false,
  }),
});

export default combineReducers({
  token: tokenReducer,
  oidc: oidcReducer,
});
