import range from 'lodash/range';

import { KeywordsDocument } from '../../../../generated/graphql';
import { fakeKeywords } from '../../../../utils/mockDataUtils';
import {
  keyword,
  keywordName,
} from '../../keywordSelector/__mocks__/keywordSelector';

const keywordNames = range(2, 6).map((val) => `Keyword name ${val}`);
const keywords = fakeKeywords(1 + keywordNames.length, [
  keyword,
  ...keywordNames.map((name) => ({ name: { fi: name } })),
]);
const keywordsVariables = {
  createPath: undefined,
  showAllKeywords: true,
  text: '',
};
const keywordsResponse = { data: { keywords } };
const mockedKeywordsResponse = {
  request: { query: KeywordsDocument, variables: keywordsVariables },
  result: keywordsResponse,
};

const mockedFilteredKeywordsResponse = {
  request: {
    query: KeywordsDocument,
    variables: { ...keywordsVariables, text: keywordName },
  },
  result: keywordsResponse,
};

export { mockedFilteredKeywordsResponse, mockedKeywordsResponse };
