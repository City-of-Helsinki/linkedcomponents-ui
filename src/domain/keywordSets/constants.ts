export enum KEYWORD_SET_SORT_OPTIONS {
  ID = 'id',
  ID_DESC = '-id',
  NAME = 'name',
  NAME_DESC = '-name',
  USAGE = 'usage',
  USAGE_DESC = '-usage',
}

export enum KEYWORD_SET_USAGE_OPTIONS {
  ANY = 'any',
  AUDIENCE = 'audience',
  KEYWORD = 'keyword',
}

export const DEFAULT_KEYWORD_SET_SORT = KEYWORD_SET_SORT_OPTIONS.ID;

export enum KEYWORD_SET_SEARCH_PARAMS {
  PAGE = 'page',
  RETURN_PATH = 'returnPath',
  SORT = 'sort',
  TEXT = 'text',
}

export const KEYWORD_SETS_PAGE_SIZE = 10;
