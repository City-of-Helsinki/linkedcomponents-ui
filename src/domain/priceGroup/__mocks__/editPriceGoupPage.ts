import { MockedResponse } from '@apollo/client/testing';

import {
  DeletePriceGroupDocument,
  PriceGroupFieldsFragment,
} from '../../../generated/graphql';
import { fakePriceGroup } from '../../../utils/mockDataUtils';
import { TEST_PUBLISHER_ID } from '../../organization/constants';
import { TEST_PRICE_GROUP_ID } from '../constants';

const placeValues: Partial<PriceGroupFieldsFragment> = {
  id: TEST_PRICE_GROUP_ID,
  isDefault: false,
  publisher: TEST_PUBLISHER_ID,
};

const priceGroup = fakePriceGroup(placeValues);

const deletePriceGroupVariables = { id: priceGroup.id };
const deletePriceGroupResponse = { data: { deletePriceGroup: null } };
const mockedDeletePriceGroupResponse: MockedResponse = {
  request: {
    query: DeletePriceGroupDocument,
    variables: deletePriceGroupVariables,
  },
  result: deletePriceGroupResponse,
};

export { mockedDeletePriceGroupResponse, priceGroup };
