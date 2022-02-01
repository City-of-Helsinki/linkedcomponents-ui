import { KeywordSetsQueryVariables } from '../../generated/graphql';
import addParamsToQueryString from '../../utils/addParamsToQueryString';
import getPathBuilder from '../../utils/getPathBuilder';
import replaceParamsToQueryString from '../../utils/replaceParamsToQueryString';
import stripLanguageFromPath from '../../utils/stripLanguageFromPath';
import { assertUnreachable } from '../../utils/typescript';
import { keywordSetsPathBuilder } from '../keywordSet/utils';
import {
  DEFAULT_KEYWORD_SET_SORT,
  KEYWORD_SET_SEARCH_PARAMS,
  KEYWORD_SET_SORT_OPTIONS,
  KEYWORD_SETS_PAGE_SIZE,
} from './constants';
import {
  KeywordSetSearchInitialValues,
  KeywordSetSearchParam,
  KeywordSetSearchParams,
} from './types';

export const getKeywordSetSearchInitialValues = (
  search: string
): KeywordSetSearchInitialValues => {
  const searchParams = new URLSearchParams(search);
  const page = searchParams.get(KEYWORD_SET_SEARCH_PARAMS.PAGE);
  const sort = searchParams.get(
    KEYWORD_SET_SEARCH_PARAMS.SORT
  ) as KEYWORD_SET_SORT_OPTIONS;
  const text = searchParams.get(KEYWORD_SET_SEARCH_PARAMS.TEXT);

  return {
    page: Number(page) || 1,
    sort: Object.values(KEYWORD_SET_SORT_OPTIONS).includes(sort)
      ? sort
      : DEFAULT_KEYWORD_SET_SORT,
    text: text || '',
  };
};

export const getKeywordSetsQueryVariables = (
  search: string
): KeywordSetsQueryVariables => {
  const { page, sort, text } = getKeywordSetSearchInitialValues(search);

  return {
    createPath: getPathBuilder(keywordSetsPathBuilder),
    page,
    pageSize: KEYWORD_SETS_PAGE_SIZE,
    sort,
    text,
  };
};

export const getKeywordSetParamValue = ({
  param,
  value,
}: {
  param: KeywordSetSearchParam;
  value: string;
}): string => {
  switch (param) {
    case KEYWORD_SET_SEARCH_PARAMS.PAGE:
    case KEYWORD_SET_SEARCH_PARAMS.SORT:
    case KEYWORD_SET_SEARCH_PARAMS.TEXT:
      return value;
    case KEYWORD_SET_SEARCH_PARAMS.RETURN_PATH:
      return stripLanguageFromPath(value);
    default:
      return assertUnreachable(param, 'Unknown keyword set query parameter');
  }
};

export const addParamsToKeywordSetQueryString = (
  queryString: string,
  queryParams: Partial<KeywordSetSearchParams>
): string => {
  return addParamsToQueryString<KeywordSetSearchParams>(
    queryString,
    queryParams,
    getKeywordSetParamValue
  );
};

export const replaceParamsToKeywordSetQueryString = (
  queryString: string,
  queryParams: Partial<KeywordSetSearchParams>
): string => {
  return replaceParamsToQueryString<KeywordSetSearchParams>(
    queryString,
    queryParams,
    getKeywordSetParamValue
  );
};
