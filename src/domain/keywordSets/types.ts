import {
  KEYWORD_SET_SEARCH_PARAMS,
  KEYWORD_SET_SORT_OPTIONS,
} from './constants';

export type KeywordSetsLocationState = {
  keywordSetId: string;
};

export type KeywordSetSearchParams = {
  [KEYWORD_SET_SEARCH_PARAMS.PAGE]?: number | null;
  [KEYWORD_SET_SEARCH_PARAMS.RETURN_PATH]?: string | null;
  [KEYWORD_SET_SEARCH_PARAMS.SORT]?: KEYWORD_SET_SORT_OPTIONS | null;
  [KEYWORD_SET_SEARCH_PARAMS.TEXT]?: string;
};

export type KeywordSetSearchParam = keyof KeywordSetSearchParams;

export type KeywordSetSearchInitialValues = {
  [KEYWORD_SET_SEARCH_PARAMS.PAGE]: number;
  [KEYWORD_SET_SEARCH_PARAMS.SORT]: KEYWORD_SET_SORT_OPTIONS;
  [KEYWORD_SET_SEARCH_PARAMS.TEXT]: string;
};
