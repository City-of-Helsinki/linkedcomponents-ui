import { KeywordsQueryVariables } from '../../generated/graphql';
import { AdminListSearchInitialValues } from '../../types';
import { getAdminListSearchInitialValues } from '../../utils/adminListQueryStringUtils';
import getPathBuilder from '../../utils/getPathBuilder';
import { keywordsPathBuilder } from '../keyword/utils';
import {
  DEFAULT_KEYWORD_SORT,
  KEYWORD_SORT_OPTIONS,
  KEYWORDS_PAGE_SIZE,
} from './constants';

export const getKeywordSearchInitialValues = (
  search: string
): AdminListSearchInitialValues<KEYWORD_SORT_OPTIONS> => {
  return getAdminListSearchInitialValues<KEYWORD_SORT_OPTIONS>(
    search,
    Object.values(KEYWORD_SORT_OPTIONS),
    DEFAULT_KEYWORD_SORT
  );
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
