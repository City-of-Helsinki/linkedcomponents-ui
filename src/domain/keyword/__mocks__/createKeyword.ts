import { MockedResponse } from '@apollo/client/testing';
import range from 'lodash/range';

import {
  CreateKeywordDocument,
  KeywordsDocument,
} from '../../../generated/graphql';
import { fakeKeyword, fakeKeywords } from '../../../utils/mockDataUtils';

const keywordsOverrides = range(1, 5).map((index) => ({
  name: `Keyword ${index}`,
  id: `helsinki:${index}`,
}));

const keywords = fakeKeywords(
  keywordsOverrides.length,
  keywordsOverrides.map(({ name, id }) => ({ id, name: { fi: name } }))
);

const replacingKeyword = keywords.data[0];

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

const keywordValues = { name: 'Keyword name', replacedBy: replacingKeyword.id };

const payload = {
  dataSource: 'helsinki',
  deprecated: false,
  id: undefined,
  name: { fi: keywordValues.name, sv: '', en: '', ru: '', zhHans: '', ar: '' },
  publisher: '',
  replacedBy: keywordValues.replacedBy,
};

const createKeywordVariables = { input: payload };

const createKeywordResponse = { data: { createKeyword: fakeKeyword() } };

const mockedCreateKeywordResponse: MockedResponse = {
  request: { query: CreateKeywordDocument, variables: createKeywordVariables },
  result: createKeywordResponse,
};

const mockedInvalidCreateKeywordResponse: MockedResponse = {
  request: { query: CreateKeywordDocument, variables: createKeywordVariables },
  error: {
    ...new Error(),
    result: { name: ['Tämän kentän arvo ei voi olla "null".'] },
  } as Error,
};

export {
  keywordValues,
  mockedCreateKeywordResponse,
  mockedInvalidCreateKeywordResponse,
  mockedKeywordsResponse,
  replacingKeyword,
};
