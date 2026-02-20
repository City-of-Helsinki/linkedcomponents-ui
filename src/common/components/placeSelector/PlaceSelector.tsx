import { ApolloError } from '@apollo/client';
import { SearchFunction, SearchResult } from 'hds-react';
import { TFunction } from 'i18next';
import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  getPlaceFields,
  placePathBuilder,
  placesPathBuilder,
} from '../../../domain/place/utils';
import {
  PlaceFieldsFragment,
  usePlaceQuery,
  usePlacesQuery,
} from '../../../generated/graphql';
import useInitialSelectorOptions from '../../../hooks/useInitialSelectorOptions';
import useLocale from '../../../hooks/useLocale';
import { Language, OptionType } from '../../../types';
import getPathBuilder from '../../../utils/getPathBuilder';
import getValue from '../../../utils/getValue';
import parseIdFromAtId from '../../../utils/parseIdFromAtId';
import skipFalsyType from '../../../utils/skipFalsyType';
import Select, { SelectPropsWithValue } from '../select/Select';
import styles from './placeSelector.module.scss';

export const getOption = (
  place: PlaceFieldsFragment,
  locale: Language,
  t: TFunction,
  showEventAmount = true
): OptionType => {
  const { addressLocality, atId, dataSource, name, nEvents, streetAddress } =
    getPlaceFields(place, locale);

  const addressText = [streetAddress, addressLocality]
    .filter(skipFalsyType)
    .join(', ');

  const label =
    dataSource !== 'osoite' && addressText ? `${name} (${addressText})` : name;

  return {
    label: showEventAmount
      ? // TODO: Use SelectLabel component when HDS support React elements as label
        // ((<SelectLabel nEvents={nEvents} text={label} />) as any)
        `${label}\n${t('common.eventAmount', { count: nEvents })}`
      : label,
    value: atId,
  };
};

export type PlaceSelectorProps = SelectPropsWithValue<string | null>;

const PlaceSelector: React.FC<PlaceSelectorProps> = ({
  texts,
  value,
  name,
  onChange,
  ...rest
}) => {
  const { t } = useTranslation();
  const locale = useLocale();

  const {
    data: placesData,
    loading,
    refetch,
  } = usePlacesQuery({
    variables: {
      createPath: getPathBuilder(placesPathBuilder),
      showAllPlaces: true,
      text: '',
    },
  });

  const { data: placeData } = usePlaceQuery({
    skip: !value,
    variables: {
      id: getValue(parseIdFromAtId(value), ''),
      createPath: getPathBuilder(placePathBuilder),
    },
  });

  // Update initial options when locale changes
  const initialOptions = useInitialSelectorOptions(
    placesData?.places.data as PlaceFieldsFragment[] | undefined,
    getOption
  );

  const handleSearch: SearchFunction = React.useCallback(
    async (searchValue: string): Promise<SearchResult> => {
      try {
        const { error, data: newPlacesData } = await refetch({
          text: searchValue,
        });

        if (error) {
          throw error;
        }

        return {
          options: getValue(
            newPlacesData?.places.data.map((place) =>
              getOption(place as PlaceFieldsFragment, locale, t)
            ),
            []
          ),
        };
      } catch (error) {
        return Promise.reject(error as ApolloError);
      }
    },
    [refetch, locale, t]
  );

  const selectedPlace = React.useMemo(
    () =>
      placeData?.place ? [getOption(placeData.place, locale, t, false)] : [],
    [locale, placeData, t]
  );

  const memoizedTexts = React.useMemo(
    () => ({
      ...texts,
      clearButtonAriaLabel_one: t('common.combobox.clearPlaces'),
    }),
    [texts, t]
  );

  return (
    <Select
      {...rest}
      className={styles.placeSelector}
      clearable
      multiSelect={false}
      id={name}
      isLoading={loading}
      onSearch={handleSearch}
      onChange={onChange}
      options={initialOptions}
      texts={memoizedTexts}
      value={selectedPlace}
    />
  );
};

export default PlaceSelector;
