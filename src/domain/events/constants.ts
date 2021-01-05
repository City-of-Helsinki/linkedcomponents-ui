export const EVENTS_PAGE_SIZE = 5;

export enum EVENT_LIST_TYPES {
  CARD_LIST = 'cardList',
  TABLE = 'table',
}

export const DEFAULT_EVENT_LIST_TYPE = EVENT_LIST_TYPES.TABLE;

export enum EVENT_SORT_OPTIONS {
  DURATION = 'duration',
  DURATION_DESC = '-duration',
  END_TIME = 'end_time',
  END_TIME_DESC = '-end_time',
  LAST_MODIFIED_TIME = 'last_modified_time',
  LAST_MODIFIED_TIME_DESC = '-last_modified_time',
  NAME = 'name',
  NAME_DESC = '-name',
  START_TIME = 'start_time',
  START_TIME_DESC = '-start_time',
}

export const DEFAULT_EVENT_SORT = EVENT_SORT_OPTIONS.LAST_MODIFIED_TIME_DESC;
