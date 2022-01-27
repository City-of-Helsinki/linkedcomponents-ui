import { MockedResponse } from '@apollo/client/testing';
import { keyboard } from '@testing-library/user-event/dist/keyboard';

import {
  DeleteKeywordDocument,
  KeywordDocument,
  KeywordFieldsFragment,
  UpdateKeywordDocument,
} from '../../../generated/graphql';
import { fakeKeyword } from '../../../utils/mockDataUtils';
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

const updateKeywordVariables = { input: keywordValues };

const updateKeywordResponse = { data: { updateKeyword: keyboard } };

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
  mockedUpdateKeywordResponse,
};
