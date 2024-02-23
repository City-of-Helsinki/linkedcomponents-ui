import { PRICE_GROUP_SEARCH_PARAMS } from '../priceGroup/constants';
import { PRICE_GROUP_SORT_OPTIONS } from './constants';

export type PriceGroupsLocationState = {
  priceGroupId: string;
};

export type PriceGroupSearchInitialValues = {
  [PRICE_GROUP_SEARCH_PARAMS.PAGE]: number;
  [PRICE_GROUP_SEARCH_PARAMS.SORT]: PRICE_GROUP_SORT_OPTIONS;
  [PRICE_GROUP_SEARCH_PARAMS.TEXT]: string;
};

export type PriceGroupSearchParams = {
  [PRICE_GROUP_SEARCH_PARAMS.PAGE]?: number | null;
  [PRICE_GROUP_SEARCH_PARAMS.RETURN_PATH]?: string | null;
  [PRICE_GROUP_SEARCH_PARAMS.SORT]?: PRICE_GROUP_SORT_OPTIONS | null;
  [PRICE_GROUP_SEARCH_PARAMS.TEXT]?: string;
};

export type PriceGroupSearchParam = keyof PriceGroupSearchParams;
