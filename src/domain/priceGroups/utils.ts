import { TFunction } from 'i18next';

import { PriceGroupsQueryVariables } from '../../generated/graphql';
import { AdminListSearchInitialValues } from '../../types';
import { getAdminListSearchInitialValues } from '../../utils/adminListQueryStringUtils';
import getPathBuilder from '../../utils/getPathBuilder';
import { PRICE_GROUPS_PAGE_SIZE } from '../priceGroup/constants';
import { priceGroupsPathBuilder } from '../priceGroup/utils';
import {
  DEFAULT_PRICE_GROUP_SORT,
  PRICE_GROUP_SORT_OPTIONS,
} from './constants';

export const getPriceGroupSearchInitialValues = (
  search: string
): AdminListSearchInitialValues<PRICE_GROUP_SORT_OPTIONS> => {
  return getAdminListSearchInitialValues<PRICE_GROUP_SORT_OPTIONS>(
    search,
    Object.values(PRICE_GROUP_SORT_OPTIONS),
    DEFAULT_PRICE_GROUP_SORT
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
