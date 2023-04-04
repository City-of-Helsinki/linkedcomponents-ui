import { MockedResponse } from '@apollo/client/testing';
import range from 'lodash/range';

import { LINKED_EVENTS_SYSTEM_DATA_SOURCE } from '../../../constants';
import {
  CreateKeywordDocument,
  KeywordFieldsFragment,
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

const filteredKeywords = fakeKeywords(1, [
  keywords.data[0] as KeywordFieldsFragment,
]);
const filteredKeywordsResponse = {
  data: { keywords: filteredKeywords },
};
const filteredKeywordsVariables = {
  ...keywordsVariables,
  text: keywords.data[0]?.name?.fi,
};
const mockedFilteredKeywordsResponse = {
  request: { query: KeywordsDocument, variables: filteredKeywordsVariables },
  result: filteredKeywordsResponse,
};

const keywordValues = {
  name: 'Keyword name',
  replacedBy: replacingKeyword?.id,
};

const payload = {
  dataSource: LINKED_EVENTS_SYSTEM_DATA_SOURCE,
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
  mockedFilteredKeywordsResponse,
  mockedInvalidCreateKeywordResponse,
  mockedKeywordsResponse,
  replacingKeyword,
};
