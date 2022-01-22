import { KeywordsQueryVariables } from '../../generated/graphql';
import addParamsToQueryString from '../../utils/addParamsToQueryString';
import getPathBuilder from '../../utils/getPathBuilder';
import replaceParamsToQueryString from '../../utils/replaceParamsToQueryString';
import stripLanguageFromPath from '../../utils/stripLanguageFromPath';
import { assertUnreachable } from '../../utils/typescript';
import { keywordsPathBuilder } from '../keyword/utils';
import {
  DEFAULT_KEYWORD_SORT,
  KEYWORD_SEARCH_PARAMS,
  KEYWORD_SORT_OPTIONS,
  KEYWORDS_PAGE_SIZE,
} from './constants';
import {
  KeywordSearchInitialValues,
  KeywordSearchParam,
  KeywordSearchParams,
} from './types';

export const getKeywordSearchInitialValues = (
  search: string
): KeywordSearchInitialValues => {
  const searchParams = new URLSearchParams(search);
  const page = searchParams.get(KEYWORD_SEARCH_PARAMS.PAGE);
  const sort = searchParams.get(
    KEYWORD_SEARCH_PARAMS.SORT
  ) as KEYWORD_SORT_OPTIONS;
  const text = searchParams.get(KEYWORD_SEARCH_PARAMS.TEXT);

  return {
    page: Number(page) || 1,
    sort: Object.values(KEYWORD_SORT_OPTIONS).includes(sort)
      ? sort
      : DEFAULT_KEYWORD_SORT,
    text: text || '',
  };
};

export const getKeywordsQueryVariables = (
  search: string
): KeywordsQueryVariables => {
  const { page, sort, text } = getKeywordSearchInitialValues(search);

  return {
    createPath: getPathBuilder(keywordsPathBuilder),
    page,
    pageSize: KEYWORDS_PAGE_SIZE,
    showAllKeywords: true,
    sort,
    text,
  };
};

export const getKeywordParamValue = ({
  param,
  value,
}: {
  param: KeywordSearchParam;
  value: string;
}): string => {
  switch (param) {
    case KEYWORD_SEARCH_PARAMS.PAGE:
    case KEYWORD_SEARCH_PARAMS.SORT:
    case KEYWORD_SEARCH_PARAMS.TEXT:
      return value;
    case KEYWORD_SEARCH_PARAMS.RETURN_PATH:
      return stripLanguageFromPath(value);
    default:
      return assertUnreachable(param, 'Unknown keyword query parameter');
  }
};

export const addParamsToKeywordQueryString = (
  queryString: string,
  queryParams: Partial<KeywordSearchParams>
): string => {
  return addParamsToQueryString<KeywordSearchParams>(
    queryString,
    queryParams,
    getKeywordParamValue
  );
};

export const replaceParamsToKeywordQueryString = (
  queryString: string,
  queryParams: Partial<KeywordSearchParams>
): string => {
  return replaceParamsToQueryString<KeywordSearchParams>(
    queryString,
    queryParams,
    getKeywordParamValue
  );
};
