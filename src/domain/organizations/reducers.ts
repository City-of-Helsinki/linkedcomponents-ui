import { combineReducers, createReducer } from '@reduxjs/toolkit';

import {
  defaultExpandedOrganizationsState,
  ORGANIZATIONS_ACTIONS,
} from './constants';

const expandedOrganizationsReducer = createReducer(
  defaultExpandedOrganizationsState,
  {
    [ORGANIZATIONS_ACTIONS.ADD_EXPANDED_ORGANIZATION]: (state, action) => {
      // Add new event if already doesn't exist
      return state.includes(action.payload)
        ? state
        : [...state, action.payload];
    },
    [ORGANIZATIONS_ACTIONS.REMOVE_EXPANDED_ORGANIZATION]: (state, action) => {
      return state.filter((id) => action.payload !== id);
    },
  }
);

export default combineReducers({
  expandedOrganizations: expandedOrganizationsReducer,
});
