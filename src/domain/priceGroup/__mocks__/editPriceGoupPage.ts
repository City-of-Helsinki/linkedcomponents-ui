import { MockedResponse } from '@apollo/client/testing';

import { EMPTY_MULTI_LANGUAGE_OBJECT } from '../../../constants';
import {
  DeletePriceGroupDocument,
  PriceGroupDocument,
  PriceGroupFieldsFragment,
  UpdatePriceGroupDocument,
} from '../../../generated/graphql';
import { fakePriceGroup } from '../../../utils/mockDataUtils';
import { TEST_PUBLISHER_ID } from '../../organization/constants';
import { TEST_PRICE_GROUP_ID } from '../constants';

const priceGroupValues: Partial<PriceGroupFieldsFragment> = {
  description: {
    ...EMPTY_MULTI_LANGUAGE_OBJECT,
    fi: 'Price group description',
  },
  id: TEST_PRICE_GROUP_ID,
  publisher: TEST_PUBLISHER_ID,
};

const priceGroup = fakePriceGroup(priceGroupValues);

const priceGroupVariables = { id: priceGroup.id.toString() };
const priceGroupResponse = { data: { priceGroup } };
const mockedPriceGroupResponse: MockedResponse = {
  request: { query: PriceGroupDocument, variables: priceGroupVariables },
  result: priceGroupResponse,
};

const emptyLangObj = { fi: '', sv: '', en: '', ru: '', zhHans: '', ar: '' };
const payload = {
  ...priceGroupValues,
  description: { ...emptyLangObj, fi: priceGroupValues.description?.fi },
  id: priceGroupValues.id,
  isFree: false,
};

const updatePriceGroupVariables = { input: payload };

const updatePriceGroupResponse = { data: { updatePriceGroup: priceGroup } };

const mockedUpdatePriceGroupResponse: MockedResponse = {
  request: {
    query: UpdatePriceGroupDocument,
    variables: updatePriceGroupVariables,
  },
  result: updatePriceGroupResponse,
};

const mockedInvalidUpdatePriceGroupResponse: MockedResponse = {
  request: {
    query: UpdatePriceGroupDocument,
    variables: updatePriceGroupVariables,
  },
  error: {
    ...new Error(),
    result: { description: ['The description must be specified.'] },
  } as Error,
};

const deletePriceGroupVariables = { id: priceGroup.id };
const deletePriceGroupResponse = { data: { deletePriceGroup: null } };
const mockedDeletePriceGroupResponse: MockedResponse = {
  request: {
    query: DeletePriceGroupDocument,
    variables: deletePriceGroupVariables,
  },
  result: deletePriceGroupResponse,
};

export {
  mockedDeletePriceGroupResponse,
  mockedInvalidUpdatePriceGroupResponse,
  mockedPriceGroupResponse,
  mockedUpdatePriceGroupResponse,
  priceGroup,
};
