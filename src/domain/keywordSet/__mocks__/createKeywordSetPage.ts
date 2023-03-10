import { MockedResponse } from '@apollo/client/testing';

import { keyword } from '../../../common/components/keywordSelector/__mocks__/keywordSelector';
import { CreateKeywordSetDocument } from '../../../generated/graphql';
import { fakeKeywordSet } from '../../../utils/mockDataUtils';
import { TEST_DATA_SOURCE_ID } from '../../dataSource/constants';

const keywordSetValues = {
  dataSource: TEST_DATA_SOURCE_ID,
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
