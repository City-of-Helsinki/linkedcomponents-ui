/* eslint-disable no-undef */
import { ApolloError } from '@apollo/client';
import { Option, SearchFunction, SearchResult, SelectData } from 'hds-react';
import { TFunction } from 'i18next';
import React, { useCallback, useEffect } from 'react';
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
import useLocale from '../../../hooks/useLocale';
import { Language, OptionType } from '../../../types';
import getPathBuilder from '../../../utils/getPathBuilder';
import getValue from '../../../utils/getValue';
import parseIdFromAtId from '../../../utils/parseIdFromAtId';
import skipFalsyType from '../../../utils/skipFalsyType';
import Select, { SelectPropsWithValue } from '../select/Select';
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

  const [options, setOptions] = React.useState<OptionType[]>([]);
  const initialOptions = React.useRef<OptionType[]>([]);

  const {
    data: placesData,
    loading,
    previousData: previousPlacesData,
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

  const getPlacesData = useCallback(
    () =>
      getValue(
        (placesData || previousPlacesData)?.places.data.map((place) =>
          getOption({ place: place as PlaceFieldsFragment, locale, t })
        ),
        []
      ),
    [locale, placesData, previousPlacesData, t]
  );

  const placesOptions = React.useMemo(() => getPlacesData(), [getPlacesData]);

  useEffect(() => {
    setOptions(placesOptions);

    if (placesData && !initialOptions?.current.length) {
      initialOptions.current = placesOptions;
    }
  }, [placesOptions, placesData]);

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
              getOption({ place: place as PlaceFieldsFragment, locale, t })
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

  const handleChange = React.useCallback(
    (selectedOptions: Option[], clickedOption: Option, data: SelectData) => {
      setOptions(initialOptions.current);

      if (onChange) {
        onChange(selectedOptions, clickedOption, data);
      }
    },
    [onChange]
  );

  const selectedPlace = React.useMemo(
    () =>
      placeData?.place
        ? [
            getOption({
              locale,
              place: placeData.place,
              showEventAmount: false,
              t,
            }),
          ]
        : [],
    [locale, placeData, t]
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
      onChange={handleChange}
      options={options}
      texts={{
        ...texts,
        clearButtonAriaLabel_one: t('common.combobox.clearPlaces'),
      }}
      value={selectedPlace}
    />
  );
};

export default PlaceSelector;
