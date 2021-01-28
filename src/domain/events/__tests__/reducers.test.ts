import expect from 'expect';

import {
  defaultReducerState,
  EVENT_LIST_TYPES,
  EVENT_SORT_OPTIONS,
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

  expect(state.listType).toEqual(EVENT_LIST_TYPES.CARD_LIST);
});

it('should set sort', () => {
  const state = reducer(undefined, {
    payload: {
      sort: EVENT_SORT_OPTIONS.END_TIME,
    },
    type: EVENTS_ACTIONS.SET_EVENT_LIST_OPTIONS,
  });

  expect(state.sort).toEqual(EVENT_SORT_OPTIONS.END_TIME);
});

it('should set tab', () => {
  const state = reducer(undefined, {
    payload: {
      tab: EVENTS_PAGE_TABS.PUBLISHED,
    },
    type: EVENTS_ACTIONS.SET_EVENT_LIST_OPTIONS,
  });

  expect(state.tab).toEqual(EVENTS_PAGE_TABS.PUBLISHED);
});

it('should set page', () => {
  const state = reducer(undefined, {
    payload: {
      page: 5,
    },
    type: EVENTS_ACTIONS.SET_EVENT_LIST_OPTIONS,
  });

  expect(state.page).toEqual(5);
});

it('should reset page after changing sort', () => {
  let state = reducer(undefined, {
    payload: {
      page: 5,
    },
    type: EVENTS_ACTIONS.SET_EVENT_LIST_OPTIONS,
  });

  expect(state.page).toEqual(5);

  state = reducer(state, {
    payload: {
      sort: EVENT_SORT_OPTIONS.END_TIME,
    },
    type: EVENTS_ACTIONS.SET_EVENT_LIST_OPTIONS,
  });

  expect(state.page).toEqual(1);
});

it('should reset page after changing tab', () => {
  let state = reducer(undefined, {
    payload: {
      page: 5,
    },
    type: EVENTS_ACTIONS.SET_EVENT_LIST_OPTIONS,
  });

  expect(state.page).toEqual(5);

  state = reducer(state, {
    payload: {
      tab: EVENTS_PAGE_TABS.PUBLISHED,
    },
    type: EVENTS_ACTIONS.SET_EVENT_LIST_OPTIONS,
  });

  expect(state.page).toEqual(1);
});

it('should not reset page after changing list type', () => {
  let state = reducer(undefined, {
    payload: {
      page: 5,
    },
    type: EVENTS_ACTIONS.SET_EVENT_LIST_OPTIONS,
  });

  expect(state.page).toEqual(5);

  state = reducer(state, {
    payload: {
      listType: EVENT_LIST_TYPES.CARD_LIST,
    },
    type: EVENTS_ACTIONS.SET_EVENT_LIST_OPTIONS,
  });

  expect(state.page).toEqual(5);
});
