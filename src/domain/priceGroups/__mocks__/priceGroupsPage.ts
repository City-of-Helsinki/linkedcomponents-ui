import range from 'lodash/range';

import {
  Meta,
  PriceGroup,
  PriceGroupsDocument,
} from '../../../generated/graphql';
import { fakePriceGroups } from '../../../utils/mockDataUtils';
import { TEST_PUBLISHER_ID } from '../../organization/constants';
import { PRICE_GROUPS_PAGE_SIZE } from '../../priceGroup/constants';
import {
  DEFAULT_PRICE_GROUP_SORT,
  PRICE_GROUP_SORT_OPTIONS,
} from '../constants';

const TEST_PAGE_SIZE = 2;

const priceGroupDescriptions = range(1, TEST_PAGE_SIZE + 1).map(
  (n) => `Price group description ${n}`
);

const priceGroups = fakePriceGroups(
  TEST_PAGE_SIZE,
  priceGroupDescriptions.map((description) => ({
    description: { fi: description },
    publisher: TEST_PUBLISHER_ID,
  }))
);

const count = 30;
const meta: Meta = { ...priceGroups.meta, count };

const priceGroupsVariables = {
  createPath: undefined,
  description: '',
  page: 1,
  pageSize: PRICE_GROUPS_PAGE_SIZE,
  sort: DEFAULT_PRICE_GROUP_SORT,
};
const priceGroupsResponse = { data: { priceGroups: { ...priceGroups, meta } } };
const mockedPriceGroupsResponse = {
  request: { query: PriceGroupsDocument, variables: priceGroupsVariables },
  result: priceGroupsResponse,
};

const page2PriceGroupDescriptions = range(1, TEST_PAGE_SIZE + 1).map(
  (n) => `Page 2 price groups ${n}`
);
const page2PriceGroups = fakePriceGroups(
  TEST_PAGE_SIZE,
  page2PriceGroupDescriptions.map((description) => ({
    description: { fi: description },
  }))
);
const page2PriceGroupsResponse = {
  data: { priceGroups: { ...page2PriceGroups, meta } },
};
const page2PriceGroupsVariables = { ...priceGroupsVariables, page: 2 };
const mockedPage2PriceGroupsResponse = {
  request: { query: PriceGroupsDocument, variables: page2PriceGroupsVariables },
  result: page2PriceGroupsResponse,
};

const sortedPriceGroupDescriptions = range(1, TEST_PAGE_SIZE + 1).map(
  (n) => `Sorted price groups ${n}`
);
const sortedPriceGroups = fakePriceGroups(
  TEST_PAGE_SIZE,
  sortedPriceGroupDescriptions.map((description) => ({
    description: { fi: description },
  }))
);
const sortedPriceGroupsResponse = {
  data: { priceGroups: { ...sortedPriceGroups, meta } },
};
const sortedPriceGroupsVariables = {
  ...priceGroupsVariables,
  sort: PRICE_GROUP_SORT_OPTIONS.ID,
};
const mockedSortedPriceGroupsResponse = {
  request: {
    query: PriceGroupsDocument,
    variables: sortedPriceGroupsVariables,
  },
  result: sortedPriceGroupsResponse,
};

const filteredPriceGroups = fakePriceGroups(1, [
  priceGroups.data[0] as PriceGroup,
]);
const filteredPriceGroupsResponse = {
  data: { priceGroups: filteredPriceGroups },
};
const filteredPriceGroupsVariables = {
  ...priceGroupsVariables,
  description: priceGroupDescriptions[0],
};
const mockedFilteredSortedPriceGroupsResponse = {
  request: {
    query: PriceGroupsDocument,
    variables: filteredPriceGroupsVariables,
  },
  result: filteredPriceGroupsResponse,
};

export {
  mockedFilteredSortedPriceGroupsResponse,
  mockedPage2PriceGroupsResponse,
  mockedPriceGroupsResponse,
  mockedSortedPriceGroupsResponse,
  page2PriceGroupDescriptions,
  priceGroupDescriptions,
  priceGroups,
  sortedPriceGroupDescriptions,
};
