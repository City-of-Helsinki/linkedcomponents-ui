import range from 'lodash/range';

import { TEST_KEYWORD_ID } from '../../../../domain/keyword/constants';
import {
  KeywordDocument,
  KeywordsDocument,
} from '../../../../generated/graphql';
import { fakeKeyword, fakeKeywords } from '../../../../utils/mockDataUtils';

const keywordId = TEST_KEYWORD_ID;
const keywordAtId = `https://api.hel.fi/linkedevents/v1/keyword/${keywordId}/`;
const keywordName = 'Keyword name';

const keyword = fakeKeyword({
  id: keywordId,
  atId: keywordAtId,
  name: { fi: keywordName },
});
const keywordVariables = { id: keywordId, createPath: undefined };
const keywordResponse = { data: { keyword } };
const mockedKeywordResponse = {
  request: { query: KeywordDocument, variables: keywordVariables },
  result: keywordResponse,
};

const keywordNames = range(2, 6).map((val) => `Keyword name ${val}`);
const keywords = fakeKeywords(1 + keywordNames.length, [
  keyword,
  ...keywordNames.map((name) => ({ name: { fi: name } })),
]);
const keywordsVariables = {
  createPath: undefined,
  dataSource: ['yso', 'helsinki'],
  showAllKeywords: true,
  freeText: '',
};
const keywordsResponse = { data: { keywords } };
const mockedKeywordsResponse = {
  request: { query: KeywordsDocument, variables: keywordsVariables },
  result: keywordsResponse,
};

const filteredKeywordsVariables = {
  ...keywordsVariables,
  freeText: keywordName,
};
const filteredKeywords = keywords;
const filteredEventsResponse = keywordsResponse;
const mockedFilteredKeywordsResponse = {
  request: { query: KeywordDocument, variables: filteredKeywordsVariables },
  result: filteredEventsResponse,
};

export {
  filteredKeywords,
  keyword,
  keywordAtId,
  keywordName,
  keywordNames,
  mockedFilteredKeywordsResponse,
  mockedKeywordResponse,
  mockedKeywordsResponse,
};
