import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from '@apollo/client';
import React from 'react';
import { useDebounce } from 'use-debounce';

import MultiSelectDropdown, {
  MultiselectDropdownProps,
} from '../../../../common/components/multiSelectDropdown/MultiSelectDropdown';
import { COMBOBOX_DEBOUNCE_TIME_MS } from '../../../../constants';
import {
  PlaceFieldsFragment,
  usePlacesQuery,
} from '../../../../generated/graphql';
import useLocale from '../../../../hooks/useLocale';
import useMountedState from '../../../../hooks/useMountedState';
import useShowLoadingSpinner from '../../../../hooks/useShowLoadingSpinner';
import { Language, OptionType } from '../../../../types';
import getLocalisedString from '../../../../utils/getLocalisedString';
import getPathBuilder from '../../../../utils/getPathBuilder';
import getValue from '../../../../utils/getValue';
import skipFalsyType from '../../../../utils/skipFalsyType';
import { PLACES_SORT_ORDER } from '../../../place/constants';
import {
  getPlaceFromCache,
  getPlaceQueryResult,
  placesPathBuilder,
} from '../../../place/utils';

const getPlaceFields = (place: PlaceFieldsFragment, locale: Language) => ({
  id: getValue(place.id, ''),
  name: getLocalisedString(place.name, locale),
});

const getOption = (
  place: PlaceFieldsFragment,
  locale: Language
): OptionType => {
  const { name: label, id: value } = getPlaceFields(place, locale);

  return { label, value };
};

export type PlaceSelectorProps = { value: string[] } & Omit<
  MultiselectDropdownProps,
  'options' | 'value'
>;

const PlaceSelector: React.FC<PlaceSelectorProps> = ({
  id,
  toggleButtonLabel,
  value,
  ...rest
}) => {
  const apolloClient = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const locale = useLocale();
  const [searchValue, setSearchValue] = React.useState('');
  const [debouncedSearch] = useDebounce(searchValue, COMBOBOX_DEBOUNCE_TIME_MS);
  const [selectedPlaces, setSelectedPlaces] = useMountedState<OptionType[]>([]);

  const {
    data: placesData,
    loading,
    previousData: previousPlacesData,
  } = usePlacesQuery({
    variables: {
      createPath: getPathBuilder(placesPathBuilder),
      sort: PLACES_SORT_ORDER.NAME,
      text: debouncedSearch,
    },
  });
  const showLoadingSpinner = useShowLoadingSpinner(loading);

  const options = React.useMemo(
    () =>
      getValue(
        (placesData || previousPlacesData)?.places.data.map((place) =>
          getOption(place as PlaceFieldsFragment, locale)
        ),
        []
      ),
    [locale, placesData, previousPlacesData]
  );

  React.useEffect(() => {
    const getSelectedPlacesFromCache = async () =>
      setSelectedPlaces(
        (
          await Promise.all(
            value.map(async (id) => {
              const place = await getPlaceQueryResult(id, apolloClient);
              /* istanbul ignore next */
              return place ? getOption(place, locale) : null;
            })
          )
        ).filter(skipFalsyType)
      );

    getSelectedPlacesFromCache();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apolloClient, locale, value]);

  return (
    <MultiSelectDropdown
      {...rest}
      id={id}
      options={options}
      renderOptionText={(option) => {
        const place = getPlaceFromCache(option.value, apolloClient);
        /* istanbul ignore next */
        return place ? getOption(place, locale).label : '';
      }}
      searchValue={searchValue}
      setSearchValue={setSearchValue}
      showSearch={true}
      showLoadingSpinner={showLoadingSpinner}
      toggleButtonLabel={toggleButtonLabel}
      value={selectedPlaces}
    />
  );
};

export default PlaceSelector;
