import { MockedResponse } from '@apollo/client/testing';

import { keyword } from '../../../common/components/keywordSelector/__mocks__/keywordSelector';
import { LINKED_EVENTS_SYSTEM_DATA_SOURCE } from '../../../envVariables';
import { CreateKeywordSetDocument } from '../../../generated/graphql';
import { fakeKeywordSet } from '../../../utils/mockDataUtils';

const keywordSetValues = {
  dataSource: LINKED_EVENTS_SYSTEM_DATA_SOURCE,
  name: 'Keyword set name',
  keyword,
  originId: '123',
};

const payload = {
  dataSource: keywordSetValues.dataSource,
  keywords: [{ atId: keywordSetValues.keyword?.atId }],
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
  id: `${keywordSetValues.dataSource}:${keywordSetValues.originId}`,
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
  keywordSetValues,
  mockedCreateKeywordSetResponse,
  mockedInvalidCreateKeywordSetResponse,
};
