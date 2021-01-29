import { createAction } from '@reduxjs/toolkit';

import { EVENTS_ACTIONS } from './constants';
import { EventListOptionsState } from './types';

const setEventListOptions = createAction<Partial<EventListOptionsState>>(
  EVENTS_ACTIONS.SET_EVENT_LIST_OPTIONS
);

const addExpandedEvent = createAction<string>(
  EVENTS_ACTIONS.ADD_EXPANDED_EVENT
);

const removeExpandedEvent = createAction<string>(
  EVENTS_ACTIONS.REMOVE_EXPANDED_EVENT
);

export { addExpandedEvent, removeExpandedEvent, setEventListOptions };
