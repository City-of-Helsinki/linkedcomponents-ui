import { MockedResponse } from '@apollo/client/testing';

import { CreatePriceGroupDocument } from '../../../generated/graphql';
import { fakePriceGroup } from '../../../utils/mockDataUtils';
import { TEST_PUBLISHER_ID } from '../../organization/constants';

const priceGroupValues = { description: 'Description' };

const payload = {
  description: {
    fi: priceGroupValues.description,
    sv: '',
    en: '',
    ru: '',
    zhHans: '',
    ar: '',
  },
  id: undefined,
  isFree: false,
  publisher: TEST_PUBLISHER_ID,
};

const createPriceGroupVariables = { input: payload };

const createPriceGroupResponse = {
  data: { createPriceGroup: fakePriceGroup() },
};

const mockedCreatePriceGroupResponse: MockedResponse = {
  request: {
    query: CreatePriceGroupDocument,
    variables: createPriceGroupVariables,
  },
  result: createPriceGroupResponse,
};

const mockedInvalidCreatePriceGroupResponse: MockedResponse = {
  request: {
    query: CreatePriceGroupDocument,
    variables: createPriceGroupVariables,
  },
  error: {
    ...new Error(),
    result: { description: ['Tämän kentän arvo ei voi olla "null".'] },
  } as Error,
};

export {
  mockedCreatePriceGroupResponse,
  mockedInvalidCreatePriceGroupResponse,
  priceGroupValues,
};
