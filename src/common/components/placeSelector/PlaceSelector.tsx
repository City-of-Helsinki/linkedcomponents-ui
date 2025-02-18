/* eslint-disable no-undef */
import {
  defaultFilter,
  FilterFunction,
  Option,
  SearchFunction,
  Select,
  SelectData,
} from 'hds-react';
import { TFunction } from 'i18next';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'use-debounce';

import { COMBOBOX_DEBOUNCE_TIME_MS } from '../../../constants';
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
import useMountedState from '../../../hooks/useMountedState';
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
  name,
  value,
  ...rest
}) => {
  // const timer = React.useRef<NodeJS.Timeout>();
  const { t } = useTranslation();
  const locale = useLocale();
  // const [search, setSearch] = useMountedState('');
  // const [debouncedSearch] = useDebounce(search, COMBOBOX_DEBOUNCE_TIME_MS);

  const { loading, refetch } = usePlacesQuery();

  const { data: placeData } = usePlaceQuery({
    skip: !value,
    variables: {
      id: getValue(parseIdFromAtId(value), ''),
      createPath: getPathBuilder(placePathBuilder),
    },
  });

  // const handleFilter: FilterFunction = (option, filterStr) => {
  //   return defaultFilter(option, filterStr);
  // };

  const getPlacesData = useCallback(
    (
      places: PlacesQuery | undefined,
      previousPlaces?: PlacesQuery | undefined
    ) =>
      getValue(
        (places || previousPlaces)?.places.data.map((place) =>
          getOption({ place: place as PlaceFieldsFragment, locale, t })
        ),
        []
      ),
    [locale, t]
  );

  const handleSearch: SearchFunction = async (searchValue, selectedOptions) => {
    const { data: searchPlacesData, error } = await refetch({
      createPath: getPathBuilder(placesPathBuilder),
      showAllPlaces: true,
      text: searchValue,
    });

    if (error) {
      Promise.reject(error);
    }

    const options = getPlacesData(searchPlacesData);

    console.log(options);

    return Promise.resolve({ options: [] });
  };

  // React.useEffect(() => {
  //   return () => clearTimeout(timer.current);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

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
      // filter={handleFilter}
      onSearch={handleSearch}
      id={name}
      isLoading={loading}
      texts={{
        ...texts,
        clearButtonAriaLabel_one: t('common.combobox.clearPlaces'),
      }}
      // options={options}
      value={selectedPlace?.value}
    />
  );
};

export default PlaceSelector;
