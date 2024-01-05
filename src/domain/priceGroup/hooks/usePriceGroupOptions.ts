import React, { useMemo } from 'react';

import { useEventQuery, usePriceGroupsQuery } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import getPathBuilder from '../../../utils/getPathBuilder';
import getValue from '../../../utils/getValue';
import skipFalsyType from '../../../utils/skipFalsyType';
import { eventPathBuilder } from '../../event/utils';
import { PRICE_GROUPS_PAGE_SIZE } from '../constants';
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
  eventId?: string | null;
};

const usePriceGroupOptions = ({
  eventId,
}: UsePriceGroupOptionsProps = {}): UsePriceGroupOptionsState => {
  const locale = useLocale();
  const { data: eventData } = useEventQuery({
    skip: !eventId,
    variables: {
      createPath: getPathBuilder(eventPathBuilder),
      id: eventId as string,
    },
  });
  const publisher = eventData?.event.publisher;

  const { data: priceGroupsData, loading: loadingDefaults } =
    usePriceGroupsQuery({
      variables: {
        pageSize: PRICE_GROUPS_PAGE_SIZE,
        publisher: ['none', publisher].filter(skipFalsyType),
        createPath: getPathBuilder(priceGroupsPathBuilder),
      },
    });

  const priceGroupOptions = React.useMemo(() => {
    return getValue(
      priceGroupsData?.priceGroups.data
        .filter(skipFalsyType)
        .map((priceGroup) => getPriceGroupOption(priceGroup, locale)),
      []
    );
  }, [priceGroupsData?.priceGroups.data, locale]);

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
