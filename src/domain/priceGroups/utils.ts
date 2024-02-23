import { TFunction } from 'i18next';

import { PriceGroupsQueryVariables } from '../../generated/graphql';
import addParamsToQueryString from '../../utils/addParamsToQueryString';
import getPathBuilder from '../../utils/getPathBuilder';
import getValue from '../../utils/getValue';
import stripLanguageFromPath from '../../utils/stripLanguageFromPath';
import { assertUnreachable } from '../../utils/typescript';
import {
  PRICE_GROUP_SEARCH_PARAMS,
  PRICE_GROUPS_PAGE_SIZE,
} from '../priceGroup/constants';
import { priceGroupsPathBuilder } from '../priceGroup/utils';
import {
  DEFAULT_PRICE_GROUP_SORT,
  PRICE_GROUP_SORT_OPTIONS,
} from './constants';
import {
  PriceGroupSearchInitialValues,
  PriceGroupSearchParam,
  PriceGroupSearchParams,
} from './types';

export const getPriceGroupSearchInitialValues = (
  search: string
): PriceGroupSearchInitialValues => {
  const searchParams = new URLSearchParams(search);
  const page = searchParams.get(PRICE_GROUP_SEARCH_PARAMS.PAGE);
  const sort = searchParams.get(
    PRICE_GROUP_SEARCH_PARAMS.SORT
  ) as PRICE_GROUP_SORT_OPTIONS;
  const text = searchParams.get(PRICE_GROUP_SEARCH_PARAMS.TEXT);

  return {
    page: Number(page) || 1,
    sort: Object.values(PRICE_GROUP_SORT_OPTIONS).includes(sort)
      ? sort
      : DEFAULT_PRICE_GROUP_SORT,
    text: getValue(text, ''),
  };
};

export const getPriceGroupParamValue = ({
  param,
  value,
}: {
  param: PriceGroupSearchParam;
  value: string;
}): string => {
  switch (param) {
    case PRICE_GROUP_SEARCH_PARAMS.PAGE:
    case PRICE_GROUP_SEARCH_PARAMS.SORT:
    case PRICE_GROUP_SEARCH_PARAMS.TEXT:
      return value;
    case PRICE_GROUP_SEARCH_PARAMS.RETURN_PATH:
      return stripLanguageFromPath(value);
    default:
      return assertUnreachable(param, 'Unknown price group query parameter');
  }
};

export const addParamsToPriceGroupQueryString = (
  queryString: string,
  queryParams: Partial<PriceGroupSearchParams>
): string => {
  return addParamsToQueryString<PriceGroupSearchParams>(
    queryString,
    queryParams,
    getPriceGroupParamValue
  );
};

export const getPriceGroupsQueryVariables = (
  search: string
): PriceGroupsQueryVariables => {
  const { page, sort, text } = getPriceGroupSearchInitialValues(search);

  return {
    createPath: getPathBuilder(priceGroupsPathBuilder),
    description: text,
    page,
    pageSize: PRICE_GROUPS_PAGE_SIZE,
    sort,
  };
};

export const getBooleanText = (val: boolean, t: TFunction) =>
  val ? t('common.yes') : t('common.no');
