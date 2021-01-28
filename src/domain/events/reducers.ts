import { createReducer } from '@reduxjs/toolkit';

import { defaultReducerState, EVENTS_ACTIONS } from './constants';

const eventsReducer = createReducer(defaultReducerState, {
  [EVENTS_ACTIONS.SET_EVENT_LIST_OPTIONS]: (state, action) => {
    // Reset selected page if sort order or tab is changed
    if (
      (action.payload.sort && action.payload.sort !== state.sort) ||
      (action.payload.tab && action.payload.tab !== state.tab)
    ) {
      action.payload.page = 1;
    }
    return {
      ...state,
      ...action.payload,
    };
  },
});

export default eventsReducer;
