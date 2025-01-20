/* eslint-disable no-undef */
import { Option } from 'hds-react';
import { TFunction } from 'i18next';
import React from 'react';
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
  usePlaceQuery,
  usePlacesQuery,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import useMountedState from '../../../hooks/useMountedState';
import { Language } from '../../../types';
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
}: GetOptionArgs): Partial<Option> => {
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
  const timer = React.useRef<NodeJS.Timeout>();
  const { t } = useTranslation();
  const locale = useLocale();
  const [search, setSearch] = useMountedState('');
  const [debouncedSearch] = useDebounce(search, COMBOBOX_DEBOUNCE_TIME_MS);

  const {
    data: placesData,
    loading,
    previousData: previousPlacesData,
  } = usePlacesQuery({
    variables: {
      createPath: getPathBuilder(placesPathBuilder),
      showAllPlaces: true,
      text: debouncedSearch,
    },
  });

  const { data: placeData } = usePlaceQuery({
    skip: !value,
    variables: {
      id: getValue(parseIdFromAtId(value), ''),
      createPath: getPathBuilder(placePathBuilder),
    },
  });

  const handleFilter = (_option: Option, filterStr: string) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setSearch(filterStr);
    });

    return true;
  };

  const options = React.useMemo(
    () =>
      getValue(
        (placesData || previousPlacesData)?.places.data.map((place) =>
          getOption({ place: place as PlaceFieldsFragment, locale, t })
        ),
        []
      ),
    [locale, placesData, previousPlacesData, t]
  );

  React.useEffect(() => {
    return () => clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      filter={handleFilter}
      id={name}
      isLoading={loading}
      texts={{
        ...texts,
        clearButtonAriaLabel_one: t('common.combobox.clearPlaces'),
      }}
      options={options}
      // toggleButtonAriaLabel={t('common.combobox.toggleButtonAriaLabel')}
      // Combobox doesn't accept null as value so cast null to undefined. Null is needed to avoid
      // "A component has changed the uncontrolled prop "selectedItem" to be controlled" warning
      value={selectedPlace?.value}
    />
  );
};

export default PlaceSelector;
