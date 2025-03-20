/* eslint-disable no-undef */
import { ApolloError } from '@apollo/client';
import { SearchFunction, SearchResult } from 'hds-react';
import { TFunction } from 'i18next';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import {
  getPlaceFields,
  placePathBuilder,
  placesPathBuilder,
} from '../../../domain/place/utils';
import {
  PlaceFieldsFragment,
  PlacesQuery,
  usePlaceQuery,
  usePlacesQuery,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import { Language, OptionType } from '../../../types';
import getPathBuilder from '../../../utils/getPathBuilder';
import getValue from '../../../utils/getValue';
import parseIdFromAtId from '../../../utils/parseIdFromAtId';
import skipFalsyType from '../../../utils/skipFalsyType';
import Combobox, { SingleComboboxProps } from '../combobox/Combobox';
import styles from './placeSelector.module.scss';

export type GetOptionArgs = {
  place: PlaceFieldsFragment;
  locale: Language;
  showEventAmount?: boolean;
  t: TFunction;
};

export const getOption = ({
  locale,
  place,
  showEventAmount = true,
  t,
}: GetOptionArgs): OptionType => {
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

export type PlaceSelectorProps = SingleComboboxProps<string | null>;

const PlaceSelector: React.FC<PlaceSelectorProps> = ({
  texts,
  value,
  name,
  ...rest
}) => {
  const { t } = useTranslation();
  const locale = useLocale();

  const QUERY_VARIABLES = {
    createPath: getPathBuilder(placesPathBuilder),
    showAllPlaces: true,
  };

  const {
    loading,
    refetch,
    data: placesData,
  } = usePlacesQuery({
    variables: QUERY_VARIABLES,
  });

  const { data: placeData } = usePlaceQuery({
    skip: !value,
    variables: {
      id: getValue(parseIdFromAtId(value), ''),
      createPath: getPathBuilder(placePathBuilder),
    },
  });

  const getPlacesData = useCallback(
    (data: PlacesQuery | undefined) =>
      getValue(
        data?.places.data.map((place) =>
          getOption({ place: place as PlaceFieldsFragment, locale, t })
        ),
        []
      ),
    [locale, t]
  );

  const handleSearch: SearchFunction = async (
    searchValue: string
  ): Promise<SearchResult> => {
    try {
      const { data: searchPlacesData, error } = await refetch({
        ...QUERY_VARIABLES,
        text: searchValue,
      });

      if (error) {
        throw error;
      }

      return { options: getPlacesData(searchPlacesData) };
    } catch (error) {
      return Promise.reject(error as ApolloError);
    }
  };

  const options = React.useMemo(
    () => getPlacesData(placesData),
    [getPlacesData, placesData]
  );

  const selectedPlace = React.useMemo(
    () =>
      placeData?.place
        ? getOption({
            locale,
            place: placeData.place,
            showEventAmount: false,
            t,
          })
        : null,
    [locale, placeData, t]
  );

  return (
    <Combobox
      {...rest}
      className={styles.placeSelector}
      multiSelect={false}
      id={name}
      isLoading={loading}
      onSearch={handleSearch}
      options={options}
      texts={{
        ...texts,
        clearButtonAriaLabel_one: t('common.combobox.clearPlaces'),
      }}
      // Combobox doesn't accept null as value so cast null to undefined. Null is needed to avoid
      // "A component has changed the uncontrolled prop "selectedItem" to be controlled" warning
      value={selectedPlace?.value}
    />
  );
};

export default PlaceSelector;
