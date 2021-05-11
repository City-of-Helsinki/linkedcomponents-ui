import { EVENT_LIST_TYPES, EVENTS_PAGE_TABS } from './constants';
import reducers from './reducers';

export interface EventListOptionsState {
  listType: EVENT_LIST_TYPES;
  tab: EVENTS_PAGE_TABS;
}

export type ExpandedEventsState = string[];

export type ReducerState = ReturnType<typeof reducers>;
