import range from 'lodash/range';

import { KeywordsDocument, Meta } from '../../../generated/graphql';
import { fakeKeywords } from '../../../utils/mockDataUtils';
import {
  DEFAULT_KEYWORD_SORT,
  KEYWORD_SORT_OPTIONS,
  KEYWORDS_PAGE_SIZE,
} from '../constants';

const variables = {
  createPath: undefined,
  page: 1,
  pageSize: KEYWORDS_PAGE_SIZE,
  showAllKeywords: true,
  sort: DEFAULT_KEYWORD_SORT,
  text: '',
};

const keywordNames = range(1, KEYWORDS_PAGE_SIZE + 1).map(
  (n) => `Keyword name ${n}`
);
const keywords = fakeKeywords(
  KEYWORDS_PAGE_SIZE,
  keywordNames.map((name) => ({ name: { fi: name } }))
);

const count = 30;
const meta: Meta = { ...keywords.meta, count };
const keywordsResponse = { data: { keywords: { ...keywords, meta } } };
const mockedKeywordsResponse = {
  request: { query: KeywordsDocument, variables },
  result: keywordsResponse,
};

const page2KeywordNames = range(1, KEYWORDS_PAGE_SIZE + 1).map(
  (n) => `Page 2 keyword ${n}`
);
const page2Keywords = fakeKeywords(
  KEYWORDS_PAGE_SIZE,
  page2KeywordNames.map((name) => ({ name: { fi: name } }))
);
const page2KeywordsResponse = {
  data: { keywords: { ...page2Keywords, meta } },
};
const page2KeywordsVariables = { ...variables, page: 2 };
const mockedPage2KeywordsResponse = {
  request: { query: KeywordsDocument, variables: page2KeywordsVariables },
  result: page2KeywordsResponse,
};

const sortedKeywordNames = range(1, KEYWORDS_PAGE_SIZE + 1).map(
  (n) => `Sorted keywords ${n}`
);
const sortedKeywords = fakeKeywords(
  KEYWORDS_PAGE_SIZE,
  sortedKeywordNames.map((name) => ({ name: { fi: name } }))
);
const sortedKeywordsResponse = {
  data: { keywords: { ...sortedKeywords, meta } },
};
const sortedKeywordsVariables = {
  ...variables,
  sort: KEYWORD_SORT_OPTIONS.NAME,
};
const mockedSortedKeywordsResponse = {
  request: { query: KeywordsDocument, variables: sortedKeywordsVariables },
  result: sortedKeywordsResponse,
};

export {
  keywordNames,
  keywords,
  mockedKeywordsResponse,
  mockedPage2KeywordsResponse,
  mockedSortedKeywordsResponse,
  page2KeywordNames,
  sortedKeywordNames,
  sortedKeywordsResponse,
};
