import { KEYWORD_SEARCH_PARAMS, KEYWORD_SORT_OPTIONS } from './constants';

export type KeywordsLocationState = {
  keywordId: string;
};

export type KeywordSearchParams = {
  [KEYWORD_SEARCH_PARAMS.PAGE]?: number | null;
  [KEYWORD_SEARCH_PARAMS.RETURN_PATH]?: string | null;
  [KEYWORD_SEARCH_PARAMS.SORT]?: KEYWORD_SORT_OPTIONS | null;
  [KEYWORD_SEARCH_PARAMS.TEXT]?: string;
};

export type KeywordSearchParam = keyof KeywordSearchParams;

export type KeywordSearchInitialValues = {
  [KEYWORD_SEARCH_PARAMS.PAGE]: number;
  [KEYWORD_SEARCH_PARAMS.SORT]: KEYWORD_SORT_OPTIONS;
  [KEYWORD_SEARCH_PARAMS.TEXT]: string;
};
