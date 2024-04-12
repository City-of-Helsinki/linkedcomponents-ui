import { MockedResponse } from '@apollo/client/testing';
import omit from 'lodash/omit';

import { keywordAtId } from '../../../common/components/keywordSelector/__mocks__/keywordSelector';
import {
  DeleteKeywordSetDocument,
  KeywordSetDocument,
  KeywordSetFieldsFragment,
  UpdateKeywordSetDocument,
} from '../../../generated/graphql';
import { fakeKeywordSet } from '../../../utils/mockDataUtils';
import { TEST_DATA_SOURCE_ID } from '../../dataSource/constants';
import { TEST_PUBLISHER_ID } from '../../organization/constants';
import { TEST_KEYWORD_SET_ID } from '../constants';

const keywordSetValues: Partial<KeywordSetFieldsFragment> = {
  dataSource: TEST_DATA_SOURCE_ID,
  id: TEST_KEYWORD_SET_ID,
  keywords: [{ atId: keywordAtId }],
  name: {
    ar: 'Keyword (ar)',
    en: 'Keyword (en)',
    fi: 'Keyword (fi)',
    ru: 'Keyword (ru)',
    sv: 'Keyword (sv)',
    zhHans: 'Keyword (zhHans)',
  },
  organization: TEST_PUBLISHER_ID,
  usage: 'any',
};

const keywordSet = fakeKeywordSet(keywordSetValues);

const keywordSetVariables = { id: keywordSet.id, createPath: undefined };
const keywordSetResponse = { data: { keywordSet } };
const mockedKeywordSetResponse = {
  request: { query: KeywordSetDocument, variables: keywordSetVariables },
  result: keywordSetResponse,
};

const updateKeywordSetVariables = {
  id: keywordSetValues.id,
  input: omit(keywordSetValues, 'id'),
};

const updateKeywordSetResponse = { data: { updateKeywordSet: keywordSet } };

const mockedUpdateKeywordSetResponse: MockedResponse = {
  request: {
    query: UpdateKeywordSetDocument,
    variables: updateKeywordSetVariables,
  },
  result: updateKeywordSetResponse,
};

const mockedInvalidUpdateKeywordSetResponse: MockedResponse = {
  request: {
    query: UpdateKeywordSetDocument,
    variables: updateKeywordSetVariables,
  },
  error: {
    ...new Error(),
    result: { name: ['The name must be specified.'] },
  } as Error,
};

const deleteKeywordSetVariables = { id: keywordSet.id };
const deleteKeywordSetResponse = { data: { deleteKeywordSet: null } };
const mockedDeleteKeywordSetResponse: MockedResponse = {
  request: {
    query: DeleteKeywordSetDocument,
    variables: deleteKeywordSetVariables,
  },
  result: deleteKeywordSetResponse,
};

export {
  keywordSet,
  keywordSetValues,
  mockedDeleteKeywordSetResponse,
  mockedInvalidUpdateKeywordSetResponse,
  mockedKeywordSetResponse,
  mockedUpdateKeywordSetResponse,
};
