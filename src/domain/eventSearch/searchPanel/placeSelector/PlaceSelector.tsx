import { ApolloClient, InMemoryCache, useApolloClient } from '@apollo/client';
import sortBy from 'lodash/sortBy';
import React from 'react';

import MultiSelectDropdown, {
  MultiselectDropdownProps,
} from '../../../../common/components/multiSelectDropdown/MultiSelectDropdown';
import {
  PlaceFieldsFragment,
  usePlacesQuery,
} from '../../../../generated/graphql';
import useIsMounted from '../../../../hooks/useIsMounted';
import useLocale from '../../../../hooks/useLocale';
import useShowLoadingSpinner from '../../../../hooks/useShowLoadingSpinner';
import { Language, OptionType } from '../../../../types';
import getLocalisedString from '../../../../utils/getLocalisedString';
import getPathBuilder from '../../../../utils/getPathBuilder';
import {
  getPlaceFromCache,
  getPlaceQueryResult,
  placesPathBuilder,
} from '../../../place/utils';

const getPlaceFields = (place: PlaceFieldsFragment, locale: Language) => ({
  id: place.id as string,
  name: getLocalisedString(place.name, locale),
});

const getOption = (
  place: PlaceFieldsFragment,
  locale: Language
): OptionType => {
  const { name: label, id: value } = getPlaceFields(place, locale);

  return {
    label,
    value,
  };
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
  const isMounted = useIsMounted();

  const apolloClient = useApolloClient() as ApolloClient<InMemoryCache>;
  const locale = useLocale();
  const [searchValue, setSearchValue] = React.useState('');
  const [options, setOptions] = React.useState<OptionType[]>([]);
  const [selectedPlaces, setSelectedPlaces] = React.useState<OptionType[]>([]);

  const { data: placesData, loading } = usePlacesQuery({
    variables: {
      createPath: getPathBuilder(placesPathBuilder),
      text: searchValue,
    },
  });
  const showLoadingSpinner = useShowLoadingSpinner(loading);

  React.useEffect(() => {
    if (placesData?.places.data) {
      setOptions(
        sortBy(
          placesData.places.data.map((plave) =>
            getOption(plave as PlaceFieldsFragment, locale)
          ),
          ['label']
        )
      );
    }
  }, [locale, placesData]);

  React.useEffect(() => {
    const getSelectedPlacesFromCache = async () => {
      const places = await Promise.all(
        value.map(async (id) => {
          const place = await getPlaceQueryResult(id, apolloClient);
          return place
            ? getOption(place as PlaceFieldsFragment, locale)
            : /* istanbul ignore next */ null;
        })
      );

      /* instanbul ignore else */
      if (isMounted.current) {
        setSelectedPlaces(places.filter((p) => p) as OptionType[]);
      }
    };
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

        return place
          ? getOption(place as PlaceFieldsFragment, locale).label
          : /* istanbul ignore next */
            '';
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
