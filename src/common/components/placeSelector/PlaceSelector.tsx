import { SingleSelectProps } from 'hds-react/components/Select';
import sortBy from 'lodash/sortBy';
import React from 'react';
import { useTranslation } from 'react-i18next';
import useDeepCompareEffect from 'use-deep-compare-effect';

import {
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
import getLocalisedString from '../../../utils/getLocalisedString';
import isTestEnv from '../../../utils/isTestEnv';
import parseIdFromAtId from '../../../utils/parseIdFromAtId';
import Combobox from '../combobox/Combobox';

const getPlaceFields = (place: PlaceFieldsFragment, locale: Language) => ({
  id: place.atId as string,
  name: getLocalisedString(place.name, locale),
  streetAddress: getLocalisedString(place.streetAddress, locale),
  addressLocality: getLocalisedString(place.addressLocality, locale),
});

const getOption = (
  place: PlaceFieldsFragment,
  locale: Language
): OptionType => {
  const { addressLocality, name, streetAddress, id: value } = getPlaceFields(
    place,
    locale
  );

  const addressText = [streetAddress, addressLocality]
    .filter((t) => t)
    .join(', ');

  return {
    label: `${name}${addressText && ` (${addressText})`}`,
    value,
  };
};

type ValueType = string | null;

export type PlaceSelectorProps = {
  name: string;
  value: ValueType;
} & Omit<SingleSelectProps<OptionType>, 'options' | 'value'>;

const PlaceSelector: React.FC<PlaceSelectorProps> = ({
  label,
  name,
  value,
  ...rest
}) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const [search, setSearch] = React.useState('');
  const [options, setOptions] = React.useState<OptionType[]>([]);
  const [selectedPlace, setSelectedPlace] = React.useState<OptionType | null>(
    null
  );

  const { data: placesData } = usePlacesQuery({
    variables: {
      text: search,
      createPath: isTestEnv
        ? undefined
        : /* istanbul ignore next */ placesPathBuilder,
    },
  });

  const { data: placeData } = usePlaceQuery({
    skip: !value,
    variables: {
      id: parseIdFromAtId(value) as string,
      createPath: isTestEnv
        ? undefined
        : /* istanbul ignore next */
          placePathBuilder,
    },
  });

  const handleFilter = (items: OptionType[], inputValue: string) => {
    setTimeout(() => {
      setSearch(inputValue);
    }, 0);

    return items;
  };

  React.useEffect(() => {
    if (placesData?.places.data) {
      setOptions(
        sortBy(
          placesData.places.data.map((place) =>
            getOption(place as PlaceFieldsFragment, locale)
          ),
          ['label']
        )
      );
    }
  }, [locale, placesData]);

  const option = placeData?.place ? getOption(placeData.place, locale) : null;

  useDeepCompareEffect(() => {
    setSelectedPlace(option);
  }, [{ option }]);

  return (
    <Combobox
      {...rest}
      multiselect={false}
      filter={handleFilter}
      id={name}
      label={label}
      options={options}
      toggleButtonAriaLabel={t('common.combobox.toggleButtonAriaLabel')}
      // Combobox doesn't accept null as value so cast null to undefined. Null is needed to avoid
      // "A component has changed the uncontrolled prop "selectedItem" to be controlled" warning
      value={selectedPlace as OptionType | undefined}
    />
  );
};

export default PlaceSelector;
