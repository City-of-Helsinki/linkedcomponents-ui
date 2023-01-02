import range from 'lodash/range';

import { INCLUDE } from '../../../constants';
import { KeywordSetsDocument, Meta } from '../../../generated/graphql';
import { fakeKeywordSets } from '../../../utils/mockDataUtils';
import {
  DEFAULT_KEYWORD_SET_SORT,
  KEYWORD_SET_SORT_OPTIONS,
  KEYWORD_SETS_PAGE_SIZE,
} from '../constants';

const TEST_PAGE_SIZE = 2;

const variables = {
  createPath: undefined,
  include: [INCLUDE.KEYWORDS],
  page: 1,
  pageSize: KEYWORD_SETS_PAGE_SIZE,
  sort: DEFAULT_KEYWORD_SET_SORT,
  text: '',
};

const keywordSetNames = range(1, TEST_PAGE_SIZE + 1).map(
  (n) => `Keyword set ${n}`
);
const keywordSets = fakeKeywordSets(
  TEST_PAGE_SIZE,
  keywordSetNames.map((name) => ({ name: { fi: name } }))
);

const count = 30;
const meta: Meta = { ...keywordSets.meta, count };
const keywordSetsResponse = { data: { keywordSets: { ...keywordSets, meta } } };
const mockedKeywordSetsResponse = {
  request: { query: KeywordSetsDocument, variables },
  result: keywordSetsResponse,
};

const page2KeywordSetNames = range(1, TEST_PAGE_SIZE + 1).map(
  (n) => `Page 2 keyword set ${n}`
);
const page2KeywordSets = fakeKeywordSets(
  TEST_PAGE_SIZE,
  page2KeywordSetNames.map((name) => ({ name: { fi: name } }))
);
const page2KeywordSetsResponse = {
  data: { keywordSets: { ...page2KeywordSets, meta } },
};
const page2KeywordSetsVariables = { ...variables, page: 2 };
const mockedPage2KeywordSetsResponse = {
  request: { query: KeywordSetsDocument, variables: page2KeywordSetsVariables },
  result: page2KeywordSetsResponse,
};

const sortedKeywordSetNames = range(1, TEST_PAGE_SIZE + 1).map(
  (n) => `Sorted keyword sets ${n}`
);
const sortedKeywordSets = fakeKeywordSets(
  TEST_PAGE_SIZE,
  sortedKeywordSetNames.map((name) => ({ name: { fi: name } }))
);
const sortedKeywordSetsResponse = {
  data: { keywordSets: { ...sortedKeywordSets, meta } },
};
const sortedKeywordSetsVariables = {
  ...variables,
  sort: KEYWORD_SET_SORT_OPTIONS.NAME,
};
const mockedSortedKeywordSetsResponse = {
  request: {
    query: KeywordSetsDocument,
    variables: sortedKeywordSetsVariables,
  },
  result: sortedKeywordSetsResponse,
};

export {
  keywordSetNames,
  keywordSets,
  mockedKeywordSetsResponse,
  mockedPage2KeywordSetsResponse,
  mockedSortedKeywordSetsResponse,
  page2KeywordSetNames,
  sortedKeywordSetNames,
};
