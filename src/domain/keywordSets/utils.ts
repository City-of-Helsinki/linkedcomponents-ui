import { INCLUDE } from '../../constants';
import { KeywordSetsQueryVariables } from '../../generated/graphql';
import { AdminListSearchInitialValues } from '../../types';
import { getAdminListSearchInitialValues } from '../../utils/adminListQueryStringUtils';
import getPathBuilder from '../../utils/getPathBuilder';
import { keywordSetsPathBuilder } from '../keywordSet/utils';
import {
  DEFAULT_KEYWORD_SET_SORT,
  KEYWORD_SET_SORT_OPTIONS,
  KEYWORD_SETS_PAGE_SIZE,
} from './constants';

export const getKeywordSetSearchInitialValues = (
  search: string
): AdminListSearchInitialValues<KEYWORD_SET_SORT_OPTIONS> =>
  getAdminListSearchInitialValues<KEYWORD_SET_SORT_OPTIONS>(
    search,
    Object.values(KEYWORD_SET_SORT_OPTIONS),
    DEFAULT_KEYWORD_SET_SORT
  );

export const getKeywordSetsQueryVariables = (
  search: string
): KeywordSetsQueryVariables => {
  const { page, sort, text } = getKeywordSetSearchInitialValues(search);

  return {
    createPath: getPathBuilder(keywordSetsPathBuilder),
    include: [INCLUDE.KEYWORDS],
    page,
    pageSize: KEYWORD_SETS_PAGE_SIZE,
    sort,
    text,
  };
};
