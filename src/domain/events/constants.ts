import { EventListOptions } from './types';

export const EVENTS_PAGE_SIZE = 5;

export const EVENTS_ACTIONS = {
  SET_EVENT_LIST_OPTIONS: 'SET_EVENT_LIST_OPTIONS',
};

export enum EVENT_LIST_TYPES {
  CARD_LIST = 'cardList',
  TABLE = 'table',
}

export const DEFAULT_EVENT_LIST_TYPE = EVENT_LIST_TYPES.TABLE;

export enum EVENT_SORT_OPTIONS {
  END_TIME = 'end_time',
  END_TIME_DESC = '-end_time',
  LAST_MODIFIED_TIME = 'last_modified_time',
  LAST_MODIFIED_TIME_DESC = '-last_modified_time',
  NAME = 'name',
  NAME_DESC = '-name',
  START_TIME = 'start_time',
  START_TIME_DESC = '-start_time',
}

export enum EVENTS_PAGE_TABS {
  DRAFTS = 'DRAFTS',
  PUBLISHED = 'PUBLISHED',
  WAITING_APPROVAL = 'WAITING_APPROVAL',
}

export const DEFAULT_EVENT_SORT = EVENT_SORT_OPTIONS.LAST_MODIFIED_TIME_DESC;
export const DEFAULT_EVENT_TAB = EVENTS_PAGE_TABS.WAITING_APPROVAL;

export const defaultReducerState: EventListOptions = {
  listType: DEFAULT_EVENT_LIST_TYPE,
  page: 1,
  sort: DEFAULT_EVENT_SORT,
  tab: DEFAULT_EVENT_TAB,
};
