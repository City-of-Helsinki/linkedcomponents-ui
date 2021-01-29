import { combineReducers, createReducer } from '@reduxjs/toolkit';

import {
  defaultExpandedEventsState,
  defaultListOptionsState,
  EVENTS_ACTIONS,
} from './constants';

const listOptionsReducer = createReducer(defaultListOptionsState, {
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

const expandedEventsReducer = createReducer(defaultExpandedEventsState, {
  [EVENTS_ACTIONS.ADD_EXPANDED_EVENT]: (state, action) => {
    // Add new event if already doesn't exist
    return state.includes(action.payload) ? state : [...state, action.payload];
  },
  [EVENTS_ACTIONS.REMOVE_EXPANDED_EVENT]: (state, action) => {
    return state.filter((id) => action.payload !== id);
  },
});

export default combineReducers({
  listOptions: listOptionsReducer,
  expandedEvents: expandedEventsReducer,
});
