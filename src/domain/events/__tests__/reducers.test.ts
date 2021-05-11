import expect from 'expect';

import {
  defaultReducerState,
  EVENT_LIST_TYPES,
  EVENTS_ACTIONS,
  EVENTS_PAGE_TABS,
} from '../constants';
import reducer from '../reducers';

it('should return the initial state', () => {
  expect(reducer(undefined, { type: null })).toEqual(defaultReducerState);
});

it('should set list type', () => {
  const state = reducer(undefined, {
    payload: {
      listType: EVENT_LIST_TYPES.CARD_LIST,
    },
    type: EVENTS_ACTIONS.SET_EVENT_LIST_OPTIONS,
  });

  expect(state.listOptions.listType).toEqual(EVENT_LIST_TYPES.CARD_LIST);
});

it('should set tab', () => {
  const state = reducer(undefined, {
    payload: {
      tab: EVENTS_PAGE_TABS.PUBLISHED,
    },
    type: EVENTS_ACTIONS.SET_EVENT_LIST_OPTIONS,
  });

  expect(state.listOptions.tab).toEqual(EVENTS_PAGE_TABS.PUBLISHED);
});

it('should add/remove expanded events', () => {
  let state = reducer(undefined, {
    payload: 'event:1',
    type: EVENTS_ACTIONS.ADD_EXPANDED_EVENT,
  });

  expect(state.expandedEvents).toEqual(['event:1']);

  state = reducer(state, {
    payload: 'event:2',
    type: EVENTS_ACTIONS.ADD_EXPANDED_EVENT,
  });

  expect(state.expandedEvents).toEqual(['event:1', 'event:2']);

  state = reducer(state, {
    payload: 'event:1',
    type: EVENTS_ACTIONS.ADD_EXPANDED_EVENT,
  });

  expect(state.expandedEvents).toEqual(['event:1', 'event:2']);

  state = reducer(state, {
    payload: 'event:1',
    type: EVENTS_ACTIONS.REMOVE_EXPANDED_EVENT,
  });

  expect(state.expandedEvents).toEqual(['event:2']);
});
