import { MockedResponse } from '@apollo/client/testing';

import {
  DeleteKeywordDocument,
  KeywordDocument,
  KeywordFieldsFragment,
  KeywordsDocument,
  UpdateKeywordDocument,
} from '../../../generated/graphql';
import { fakeKeyword, fakeKeywords } from '../../../utils/mockDataUtils';
import { TEST_PUBLISHER_ID } from '../../organization/constants';
import { TEST_KEYWORD_ID } from '../constants';

const keywordValues: Partial<KeywordFieldsFragment> = {
  dataSource: 'helsinki',
  deprecated: false,
  id: TEST_KEYWORD_ID,
  name: {
    ar: 'Keyword (ar)',
    en: 'Keyword (en)',
    fi: 'Keyword (fi)',
    ru: 'Keyword (ru)',
    sv: 'Keyword (sv)',
    zhHans: 'Keyword (zhHans)',
  },
  publisher: TEST_PUBLISHER_ID,
  replacedBy: '',
};

const keyword = fakeKeyword(keywordValues);

const keywordVariables = { id: keyword.id, createPath: undefined };
const keywordResponse = { data: { keyword } };
const mockedKeywordResponse = {
  request: { query: KeywordDocument, variables: keywordVariables },
  result: keywordResponse,
};

const keywords = fakeKeywords(1, [keyword]);

const keywordsVariables = {
  createPath: undefined,
  showAllKeywords: true,
  text: '',
};
const keywordsResponse = { data: { keywords } };

const mockedKeywordsResponse: MockedResponse = {
  request: { query: KeywordsDocument, variables: keywordsVariables },
  result: keywordsResponse,
};

const updateKeywordVariables = { input: keywordValues };

const updateKeywordResponse = { data: { updateKeyword: keyword } };

const mockedUpdateKeywordResponse: MockedResponse = {
  request: { query: UpdateKeywordDocument, variables: updateKeywordVariables },
  result: updateKeywordResponse,
};

const mockedInvalidUpdateKeywordResponse: MockedResponse = {
  request: { query: UpdateKeywordDocument, variables: updateKeywordVariables },
  error: {
    ...new Error(),
    result: { name: ['The name must be specified.'] },
  } as Error,
};

const deleteKeywordVariables = { id: keyword.id };
const deleteKeywordResponse = { data: { deleteKeyword: null } };
const mockedDeleteKeywordResponse: MockedResponse = {
  request: { query: DeleteKeywordDocument, variables: deleteKeywordVariables },
  result: deleteKeywordResponse,
};

export {
  keyword,
  mockedDeleteKeywordResponse,
  mockedInvalidUpdateKeywordResponse,
  mockedKeywordResponse,
  mockedKeywordsResponse,
  mockedUpdateKeywordResponse,
};
