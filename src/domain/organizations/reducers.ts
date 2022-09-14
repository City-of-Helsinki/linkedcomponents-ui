import uniq from 'lodash/uniq';

import { ExpandedOrganizationsActionTypes } from './constants';
import {
  ExpandedOrganizationsAction,
  ExpandedOrganizationsState,
} from './types';

export const expandedOrganizationsReducer = (
  state: ExpandedOrganizationsState,
  action: ExpandedOrganizationsAction
): ExpandedOrganizationsState => {
  const { type, payload } = action;

  switch (type) {
    case ExpandedOrganizationsActionTypes.ADD_EXPANDED_ORGANIZATION:
      return uniq([...state, payload]);
    case ExpandedOrganizationsActionTypes.REMOVE_EXPANDED_ORGANIZATION:
      return uniq(state.filter((id) => action.payload !== id));
  }
};
export const reducers = {
  expandedOrganizationsReducer,
};
