import { capitalize } from 'lodash';

import {
  PriceGroupFieldsFragment,
  PriceGroupsQueryVariables,
} from '../../generated/graphql';
import { Language, PathBuilderProps } from '../../types';
import getLocalisedString from '../../utils/getLocalisedString';
import queryBuilder from '../../utils/queryBuilder';
import { PriceGroupOption } from './types';

export const getPriceGroupOption = (
  priceGroup: PriceGroupFieldsFragment,
  locale: Language
): PriceGroupOption => ({
  isFree: !!priceGroup.isFree,
  label: capitalize(getLocalisedString(priceGroup.description, locale)),
  value: priceGroup.id.toString(),
});

export const sortPriceGroupOptions = (
  a: PriceGroupOption,
  b: PriceGroupOption
): number => (a.label > b.label ? 1 : -1);

export const priceGroupsPathBuilder = ({
  args,
}: PathBuilderProps<PriceGroupsQueryVariables>): string => {
  const { description, isFree, page, pageSize, publisher } = args;
  const variableToKeyItems = [
    { key: 'description', value: description },
    { key: 'is_free', value: isFree },
    { key: 'page', value: page },
    { key: 'page_size', value: pageSize },
    { key: 'publisher', value: publisher },
  ];

  const query = queryBuilder(variableToKeyItems);

  return `/price_group/${query}`;
};
