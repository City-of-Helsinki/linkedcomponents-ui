import expect from 'expect';

import { defaultReducerState, ORGANIZATIONS_ACTIONS } from '../constants';
import reducer from '../reducers';

it('should return the initial state', () => {
  expect(reducer(undefined, { type: null })).toEqual(defaultReducerState);
});

it('should add/remove expanded organizations', () => {
  let state = reducer(undefined, {
    payload: 'organization:1',
    type: ORGANIZATIONS_ACTIONS.ADD_EXPANDED_ORGANIZATION,
  });

  expect(state.expandedOrganizations).toEqual(['organization:1']);

  state = reducer(state, {
    payload: 'organization:2',
    type: ORGANIZATIONS_ACTIONS.ADD_EXPANDED_ORGANIZATION,
  });

  expect(state.expandedOrganizations).toEqual([
    'organization:1',
    'organization:2',
  ]);

  state = reducer(state, {
    payload: 'organization:1',
    type: ORGANIZATIONS_ACTIONS.ADD_EXPANDED_ORGANIZATION,
  });

  expect(state.expandedOrganizations).toEqual([
    'organization:1',
    'organization:2',
  ]);

  state = reducer(state, {
    payload: 'organization:1',
    type: ORGANIZATIONS_ACTIONS.REMOVE_EXPANDED_ORGANIZATION,
  });

  expect(state.expandedOrganizations).toEqual(['organization:2']);
});
