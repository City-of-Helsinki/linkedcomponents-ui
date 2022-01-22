export enum KEYWORD_SORT_OPTIONS {
  DATA_SOURCE = 'data_source',
  DATA_SOURCE_DESC = '-data_source',
  ID = 'id',
  ID_DESC = '-id',
  NAME = 'name',
  NAME_DESC = '-name',
  N_EVENTS = 'n_events',
  N_EVENTS_DESC = '-n_events',
}

export const DEFAULT_KEYWORD_SORT = KEYWORD_SORT_OPTIONS.N_EVENTS_DESC;

export enum KEYWORD_SEARCH_PARAMS {
  PAGE = 'page',
  RETURN_PATH = 'returnPath',
  SORT = 'sort',
  TEXT = 'text',
}

export const KEYWORDS_PAGE_SIZE = 10;
