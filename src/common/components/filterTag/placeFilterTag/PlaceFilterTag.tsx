import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  getPlaceFields,
  placePathBuilder,
} from '../../../../domain/place/utils';
import { usePlaceQuery } from '../../../../generated/graphql';
import useLocale from '../../../../hooks/useLocale';
import getPathBuilder from '../../../../utils/getPathBuilder';
import FilterTag, { FilterTagProps } from '../FilterTag';

type Props = Omit<FilterTagProps, 'text' | 'type'>;

const PlaceFilterTag: React.FC<Props> = ({ value, ...rest }) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const { data, loading } = usePlaceQuery({
    variables: { createPath: getPathBuilder(placePathBuilder), id: value },
  });

  const { name } = data?.place
    ? getPlaceFields(data.place, locale)
    : { name: '-' };

  return (
    <FilterTag
      {...rest}
      text={loading ? t('common.loading') : name}
      type="place"
      value={value}
    />
  );
};

export default PlaceFilterTag;
