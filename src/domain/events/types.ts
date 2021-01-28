import {
  EVENT_LIST_TYPES,
  EVENT_SORT_OPTIONS,
  EVENTS_PAGE_TABS,
} from './constants';

export interface EventListOptions {
  listType: EVENT_LIST_TYPES;
  page: number;
  sort: EVENT_SORT_OPTIONS;
  tab: EVENTS_PAGE_TABS;
}
