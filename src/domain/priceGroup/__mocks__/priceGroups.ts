import { MockedResponse } from '@apollo/client/testing';

import { PriceGroupsDocument } from '../../../generated/graphql';
import {
  fakeLocalisedObject,
  fakePriceGroups,
} from '../../../utils/mockDataUtils';
import { TEST_PUBLISHER_ID } from '../../organization/constants';
import {
  PRICE_GROUPS_PAGE_SIZE_LARGE,
  TEST_PRICE_GROUP_ID,
} from '../constants';

const priceGroupDescription = 'Price group name';

const defaultPriceGroups = fakePriceGroups(1, [
  {
    id: TEST_PRICE_GROUP_ID,
    description: fakeLocalisedObject(priceGroupDescription),
  },
]);
const defaultPriceGroupsResponse = {
  data: { priceGroups: defaultPriceGroups },
};
const defaultPriceGroupsVariables = {
  createPath: undefined,
  pageSize: PRICE_GROUPS_PAGE_SIZE_LARGE,
  publisher: ['none'],
};
const mockedDefaultPriceGroupsResponse: MockedResponse = {
  request: {
    query: PriceGroupsDocument,
    variables: defaultPriceGroupsVariables,
  },
  result: defaultPriceGroupsResponse,
};

const freePriceGroups = fakePriceGroups(1, [
  {
    id: TEST_PRICE_GROUP_ID,
    isFree: true,
    description: fakeLocalisedObject(priceGroupDescription),
  },
]);
const freePriceGroupsResponse = {
  data: { priceGroups: freePriceGroups },
};
const freePriceGroupsVariables = {
  ...defaultPriceGroupsVariables,
  publisher: ['none'],
};
const mockedFreePriceGroupsResponse: MockedResponse = {
  request: {
    query: PriceGroupsDocument,
    variables: freePriceGroupsVariables,
  },
  result: freePriceGroupsResponse,
};

const publisherPriceGroups = fakePriceGroups(2, [
  {
    id: TEST_PRICE_GROUP_ID,
    description: fakeLocalisedObject(priceGroupDescription),
  },
  {
    id: 234,
    description: fakeLocalisedObject(`${priceGroupDescription} 2`),
  },
]);
const publisherPriceGroupsResponse = {
  data: { priceGroups: publisherPriceGroups },
};
const publisherPriceGroupsVariables = {
  ...defaultPriceGroupsVariables,
  publisher: ['none', TEST_PUBLISHER_ID],
};
const mockedPublisherPriceGroupsResponse: MockedResponse = {
  request: {
    query: PriceGroupsDocument,
    variables: publisherPriceGroupsVariables,
  },
  result: publisherPriceGroupsResponse,
};

const externalUserPriceGroupsVariables = {
  createPath: undefined,
  pageSize: PRICE_GROUPS_PAGE_SIZE_LARGE,
  publisher: ['none', 'others'],
};
const mockedExternalUserPriceGroupsResponse: MockedResponse = {
  request: {
    query: PriceGroupsDocument,
    variables: externalUserPriceGroupsVariables,
  },
  result: defaultPriceGroupsResponse,
};

export {
  defaultPriceGroups,
  mockedDefaultPriceGroupsResponse,
  mockedExternalUserPriceGroupsResponse,
  mockedFreePriceGroupsResponse,
  mockedPublisherPriceGroupsResponse,
  priceGroupDescription,
  publisherPriceGroups,
};
