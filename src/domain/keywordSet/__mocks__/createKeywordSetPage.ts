import { MockedResponse } from '@apollo/client/testing';
import range from 'lodash/range';

import {
  CreateKeywordSetDocument,
  KeywordsDocument,
} from '../../../generated/graphql';
import { fakeKeywords, fakeKeywordSet } from '../../../utils/mockDataUtils';
import { KEYWORDS_PAGE_SIZE } from '../../keywords/constants';

const keywordNames = range(1, KEYWORDS_PAGE_SIZE).map(
  (val) => `Keyword name ${val}`
);
const keywords = fakeKeywords(
  keywordNames.length,
  keywordNames.map((name) => ({ name: { fi: name } }))
);
const keywordsVariables = {
  createPath: undefined,
  dataSource: ['yso', 'helsinki'],
  showAllKeywords: true,
  text: '',
};
const keywordsResponse = { data: { keywords } };
const mockedKeywordsResponse = {
  request: { query: KeywordsDocument, variables: keywordsVariables },
  result: keywordsResponse,
};

const keywordSetValues = {
  name: 'Keyword set name',
  keyword: keywords.data[0],
};

const payload = {
  dataSource: 'helsinki',
  keywords: [{ atId: keywordSetValues.keyword.atId }],
  name: {
    fi: keywordSetValues.name,
    sv: '',
    en: '',
    ru: '',
    zhHans: '',
    ar: '',
  },
  organization: '',
  usage: 'any',
  id: undefined,
};

const createKeywordSetVariables = { input: payload };

const createKeywordSetResponse = {
  data: { createKeywordSet: fakeKeywordSet() },
};

const mockedCreateKeywordSetResponse: MockedResponse = {
  request: {
    query: CreateKeywordSetDocument,
    variables: createKeywordSetVariables,
  },
  result: createKeywordSetResponse,
};

const mockedInvalidCreateKeywordSetResponse: MockedResponse = {
  request: {
    query: CreateKeywordSetDocument,
    variables: createKeywordSetVariables,
  },
  error: {
    ...new Error(),
    result: { name: ['Tämän kentän arvo ei voi olla "null".'] },
  } as Error,
};

export {
  keywords,
  keywordSetValues,
  mockedCreateKeywordSetResponse,
  mockedInvalidCreateKeywordSetResponse,
  mockedKeywordsResponse,
};
