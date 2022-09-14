import uniq from 'lodash/uniq';

import {
  EventListOptionsActionTypes,
  ExpandedEventsActionTypes,
} from './constants';
import {
  EventListOptionsAction,
  EventListOptionsState,
  ExpandedEventsAction,
  ExpandedEventsState,
} from './types';

export const expandedEventsReducer = (
  state: ExpandedEventsState,
  action: ExpandedEventsAction
): ExpandedEventsState => {
  const { type, payload } = action;

  switch (type) {
    case ExpandedEventsActionTypes.ADD_EXPANDED_EVENT:
      return uniq([...state, payload]);
    case ExpandedEventsActionTypes.REMOVE_EXPANDED_EVENT:
      return uniq(state.filter((id) => action.payload !== id));
  }
};

export const eventListOptionsReducer = (
  state: EventListOptionsState,
  action: EventListOptionsAction
): EventListOptionsState => {
  const { type, payload } = action;

  switch (type) {
    case EventListOptionsActionTypes.SET_EVENT_LIST_OPTIONS:
      return { ...state, ...payload };
  }
};

export const reducers = {
  expandedEventsReducer,
  eventListOptionsReducer,
};
