import {
  EventListOptionsState,
  EventsPageSettings,
  ExpandedEventsState,
} from './types';

export const EVENTS_PAGE_SIZE = 10;

export const EVENT_LIST_INCLUDES = ['in_language'];

export enum EVENT_LIST_TYPES {
  CARD_LIST = 'cardList',
  TABLE = 'table',
}

export const DEFAULT_EVENT_LIST_TYPE = EVENT_LIST_TYPES.TABLE;

export enum EVENT_SEARCH_PARAMS {
  END = 'end',
  EVENT_STATUS = 'eventStatus',
  FULL_TEXT = 'x_full_text',
  FULL_TEXT_LANGUAGE = 'x_full_text_language',
  PAGE = 'page',
  PLACE = 'place',
  PUBLISHER = 'publisher',
  RETURN_PATH = 'returnPath',
  SORT = 'sort',
  START = 'start',
  TYPE = 'type',
}

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
  OWN_PUBLISHED = 'OWN_PUBLISHED',
  PUBLISHED = 'PUBLISHED',
  WAITING_APPROVAL = 'WAITING_APPROVAL',
}

export const DEFAULT_EVENT_SORT = EVENT_SORT_OPTIONS.LAST_MODIFIED_TIME_DESC;
export const DEFAULT_EVENT_TAB = EVENTS_PAGE_TABS.WAITING_APPROVAL;

export enum EventListOptionsActionTypes {
  SET_EVENT_LIST_OPTIONS = 'SET_EVENT_LIST_OPTIONS',
}

export enum ExpandedEventsActionTypes {
  ADD_EXPANDED_EVENT = 'ADD_EXPANDED_EVENT',
  REMOVE_EXPANDED_EVENT = 'REMOVE_EXPANDED_EVENT',
}

export const listOptionsInitialState: EventListOptionsState = {
  listType: DEFAULT_EVENT_LIST_TYPE,
  tab: DEFAULT_EVENT_TAB,
};

export const expandedEventsInitialState: ExpandedEventsState = [];

export const eventsReducerInitialState: EventsPageSettings = {
  expandedEvents: expandedEventsInitialState,
  listOptions: listOptionsInitialState,
};
