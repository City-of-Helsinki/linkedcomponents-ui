import { createAction } from '@reduxjs/toolkit';

import { EVENTS_ACTIONS } from './constants';
import { EventListOptions } from './types';

const setEventListOptions = createAction<Partial<EventListOptions>>(
  EVENTS_ACTIONS.SET_EVENT_LIST_OPTIONS
);

export { setEventListOptions };
