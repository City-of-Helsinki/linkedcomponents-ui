import {
  EVENT_LIST_TYPES,
  EVENT_SORT_OPTIONS,
  EVENTS_PAGE_TABS,
} from './constants';
import reducers from './reducers';

export interface EventListOptionsState {
  listType: EVENT_LIST_TYPES;
  page: number;
  sort: EVENT_SORT_OPTIONS;
  tab: EVENTS_PAGE_TABS;
}

export type ExpandedEventsState = string[];

export type ReducerState = ReturnType<typeof reducers>;
