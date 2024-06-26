import range from 'lodash/range';

import {
  KeywordFieldsFragment,
  KeywordsDocument,
  Meta,
} from '../../../generated/graphql';
import { fakeKeywords } from '../../../utils/mockDataUtils';
import {
  DEFAULT_KEYWORD_SORT,
  KEYWORD_SORT_OPTIONS,
  KEYWORDS_PAGE_SIZE,
} from '../constants';

const TEST_PAGE_SIZE = 2;

const variables = {
  createPath: undefined,
  page: 1,
  pageSize: KEYWORDS_PAGE_SIZE,
  showAllKeywords: true,
  sort: DEFAULT_KEYWORD_SORT,
  text: '',
};

const keywordNames = range(1, TEST_PAGE_SIZE + 1).map(
  (n) => `Keyword name ${n}`
);
const keywords = fakeKeywords(
  TEST_PAGE_SIZE,
  keywordNames.map((name) => ({ name: { fi: name } }))
);

const count = 30;
const meta: Meta = { ...keywords.meta, count };
const keywordsResponse = { data: { keywords: { ...keywords, meta } } };
const mockedKeywordsResponse = {
  request: { query: KeywordsDocument, variables },
  result: keywordsResponse,
};

const page2KeywordNames = range(1, TEST_PAGE_SIZE + 1).map(
  (n) => `Page 2 keyword ${n}`
);
const page2Keywords = fakeKeywords(
  TEST_PAGE_SIZE,
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

const sortedKeywordNames = range(1, TEST_PAGE_SIZE + 1).map(
  (n) => `Sorted keywords ${n}`
);
const sortedKeywords = fakeKeywords(
  TEST_PAGE_SIZE,
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

const filteredKeywords = fakeKeywords(1, [
  keywords.data[0] as KeywordFieldsFragment,
]);
const filteredKeywordsResponse = {
  data: { keywords: filteredKeywords },
};
const filteredKeywordsVariables = { ...variables, text: keywordNames[0] };
const mockedFilteredKeywordsResponse = {
  request: { query: KeywordsDocument, variables: filteredKeywordsVariables },
  result: filteredKeywordsResponse,
};

export {
  keywordNames,
  keywords,
  mockedFilteredKeywordsResponse,
  mockedKeywordsResponse,
  mockedPage2KeywordsResponse,
  mockedSortedKeywordsResponse,
  page2KeywordNames,
  sortedKeywordNames,
  sortedKeywordsResponse,
};
