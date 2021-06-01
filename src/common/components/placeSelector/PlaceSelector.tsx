import { SingleSelectProps } from 'hds-react';
import { TFunction } from 'i18next';
import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  placePathBuilder,
  placesPathBuilder,
} from '../../../domain/place/utils';
import {
  PlaceFieldsFragment,
  usePlaceQuery,
  usePlacesQuery,
} from '../../../generated/graphql';
import useIsMounted from '../../../hooks/useIsMounted';
import useLocale from '../../../hooks/useLocale';
import { Language, OptionType } from '../../../types';
import getLocalisedString from '../../../utils/getLocalisedString';
import getPathBuilder from '../../../utils/getPathBuilder';
import parseIdFromAtId from '../../../utils/parseIdFromAtId';
import Combobox from '../combobox/Combobox';
import styles from './placeSelector.module.scss';

const getPlaceFields = (place: PlaceFieldsFragment, locale: Language) => ({
  id: place.atId as string,
  name: getLocalisedString(place.name, locale),
  nEvents: place.nEvents as number,
  streetAddress: getLocalisedString(place.streetAddress, locale),
  addressLocality: getLocalisedString(place.addressLocality, locale),
});

const getOption = ({
  locale,
  place,
  showEventAmount = true,
  t,
}: {
  place: PlaceFieldsFragment;
  locale: Language;
  showEventAmount?: boolean;
  t: TFunction;
}): OptionType => {
  const {
    addressLocality,
    name,
    nEvents,
    streetAddress,
    id: value,
  } = getPlaceFields(place, locale);

  const addressText = [streetAddress, addressLocality]
    .filter((t) => t)
    .join(', ');

  const label = `${name}${addressText && ` (${addressText})`}`;

  return {
    label: showEventAmount
      ? // TODO: Use SelectLabel component when HDS support React elements as label
        // ((<SelectLabel nEvents={nEvents} text={label} />) as any)
        `${label} \n${t('common.eventAmount', { count: nEvents })}`
      : label,
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
  const timer = React.useRef<number>();
  const isMounted = useIsMounted();
  const { t } = useTranslation();
  const locale = useLocale();
  const [search, setSearch] = React.useState('');
  const [options, setOptions] = React.useState<OptionType[]>([]);

  const { data: placesData } = usePlacesQuery({
    variables: {
      showAllPlaces: true,
      text: search,
      createPath: getPathBuilder(placesPathBuilder),
    },
  });

  const { data: placeData } = usePlaceQuery({
    skip: !value,
    variables: {
      id: parseIdFromAtId(value) as string,
      createPath: getPathBuilder(placePathBuilder),
    },
  });

  const handleFilter = (items: OptionType[], inputValue: string) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      /* istanbul ignore else */
      if (isMounted.current) {
        setSearch(inputValue);
      }
    });

    return items;
  };

  React.useEffect(() => {
    if (placesData?.places.data) {
      setOptions(
        placesData.places.data.map((place) =>
          getOption({ place: place as PlaceFieldsFragment, locale, t })
        )
      );
    }
  }, [locale, placesData, t]);

  React.useEffect(() => {
    return () => clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedPlace = React.useMemo(() => {
    return placeData?.place
      ? getOption({ locale, place: placeData.place, showEventAmount: false, t })
      : null;
  }, [locale, placeData, t]);

  return (
    <Combobox
      {...rest}
      className={styles.placeSelector}
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
