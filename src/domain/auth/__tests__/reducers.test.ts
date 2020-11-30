import expect from 'expect';

import {
  API_CLIENT_ID,
  API_TOKEN_ACTIONS,
  defaultReducerState,
} from '../constants';
import reducer from '../reducers';

it('should return the initial state', () => {
  expect(reducer(undefined, { type: null })).toEqual(defaultReducerState);
});

it('should set loading state', () => {
  const state = reducer(undefined, {
    type: API_TOKEN_ACTIONS.START_FETCHING_TOKEN,
  });

  expect(state.token.loading).toEqual(true);

  expect(
    reducer(state, { type: API_TOKEN_ACTIONS.TOKEN_FETCHED }).token.loading
  ).toEqual(false);
});

it('should reset state', () => {
  const state = reducer(undefined, {
    type: API_TOKEN_ACTIONS.START_FETCHING_TOKEN,
  });

  expect(state.token.loading).toEqual(true);

  expect(
    reducer(state, { type: API_TOKEN_ACTIONS.RESET_API_TOKEN_DATA })
  ).toEqual(defaultReducerState);
});

it('should set error', () => {
  const errors = ['error'];

  const state = reducer(undefined, {
    payload: errors,
    type: API_TOKEN_ACTIONS.FETCH_TOKEN_ERROR,
  });

  expect(state.token.errors).toEqual(errors);
});

it('should set api token', () => {
  const apiToken = 'api-token';

  const state = reducer(undefined, {
    payload: { [API_CLIENT_ID]: apiToken },
    type: API_TOKEN_ACTIONS.FETCH_TOKEN_SUCCESS,
  });

  expect(state.token.apiToken).toEqual(apiToken);
});
