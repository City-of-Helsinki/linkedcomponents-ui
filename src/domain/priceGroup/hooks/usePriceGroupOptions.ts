import React, { useMemo } from 'react';

import { usePriceGroupsQuery } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import { featureFlagUtils } from '../../../utils/featureFlags';
import getPathBuilder from '../../../utils/getPathBuilder';
import getValue from '../../../utils/getValue';
import skipFalsyType from '../../../utils/skipFalsyType';
import { PRICE_GROUPS_PAGE_SIZE_LARGE } from '../constants';
import { PriceGroupOption } from '../types';
import {
  getPriceGroupOption,
  priceGroupsPathBuilder,
  sortPriceGroupOptions,
} from '../utils';

type UsePriceGroupOptionsState = {
  loading: boolean;
  options: PriceGroupOption[];
};

export type UsePriceGroupOptionsProps = {
  publisher: string;
};

const usePriceGroupOptions = (
  { publisher }: UsePriceGroupOptionsProps = { publisher: '' }
): UsePriceGroupOptionsState => {
  const locale = useLocale();

  const { data: priceGroupsData, loading: loadingDefaults } =
    usePriceGroupsQuery({
      skip: !featureFlagUtils.isFeatureEnabled('WEB_STORE_INTEGRATION'),
      variables: {
        pageSize: PRICE_GROUPS_PAGE_SIZE_LARGE,
        publisher: ['none', publisher].filter(skipFalsyType),
        createPath: getPathBuilder(priceGroupsPathBuilder),
      },
    });

  const priceGroupOptions = React.useMemo(() => {
    return getValue(
      priceGroupsData?.priceGroups?.data
        ?.filter(skipFalsyType)
        .map((priceGroup) => getPriceGroupOption(priceGroup, locale)),
      []
    );
  }, [priceGroupsData?.priceGroups?.data, locale]);

  const state = useMemo(
    () => ({
      loading: loadingDefaults,
      options: priceGroupOptions.sort(sortPriceGroupOptions),
    }),
    [loadingDefaults, priceGroupOptions]
  );
  return state;
};

export default usePriceGroupOptions;
