import classNames from 'classnames';
import React, { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import Table from '../../../common/components/table/Table';
import { PlaceFieldsFragment, PlacesQuery } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import getSortByOrderAndColKey from '../../../utils/getSortByOrderAndColKey';
import getSortOrderAndKey from '../../../utils/getSortOrderAndKey';
import { getPlaceFields, getPlaceItemId } from '../../place/utils';
import { PLACE_SORT_OPTIONS } from '../constants';
import PlaceActionsDropdown from '../placeActionsDropdown/PlaceActionsDropdown';

export interface PlacesTableProps {
  caption: string;
  className?: string;
  places: PlacesQuery['places']['data'];
  setSort: (sort: PLACE_SORT_OPTIONS) => void;
  sort: PLACE_SORT_OPTIONS;
}

type ColumnProps = {
  place: PlaceFieldsFragment;
};

const IdColumn: FC<ColumnProps> = ({ place }) => {
  const locale = useLocale();
  const { id, placeUrl } = getPlaceFields(place, locale);

  return (
    <Link id={getPlaceItemId(id)} to={placeUrl}>
      {place.id}
    </Link>
  );
};

const NameColumn: FC<ColumnProps> = ({ place }) => {
  const locale = useLocale();
  const { name } = getPlaceFields(place, locale);

  return <>{name}</>;
};

const EventsAmountColumn: FC<ColumnProps> = ({ place }) => {
  const locale = useLocale();
  const { nEvents } = getPlaceFields(place, locale);

  return <>{nEvents}</>;
};

const StreetAddressColumn: FC<ColumnProps> = ({ place }) => {
  const locale = useLocale();
  const { streetAddress } = getPlaceFields(place, locale);

  return <>{streetAddress}</>;
};

const ActionsColumn: FC<ColumnProps> = ({ place }) => {
  return <PlaceActionsDropdown place={place} />;
};

const PlacesTable: React.FC<PlacesTableProps> = ({
  caption,
  className,
  places,
  setSort,
  sort,
}) => {
  const { t } = useTranslation();

  const handleSortChange = (key: string) => {
    setSort(key as PLACE_SORT_OPTIONS);
  };

  const { initialSortingColumnKey, initialSortingOrder } = useMemo(() => {
    const { colKey, order } = getSortOrderAndKey(sort);

    return {
      initialSortingColumnKey: colKey,
      initialSortingOrder: order,
    };
  }, [sort]);

  const MemoizedIdColumn = React.useCallback(
    (place: PlaceFieldsFragment) => <IdColumn place={place} />,
    []
  );
  const MemoizedNameColumn = React.useCallback(
    (place: PlaceFieldsFragment) => <NameColumn place={place} />,
    []
  );
  const MemoizedEventsAmountColumn = React.useCallback(
    (place: PlaceFieldsFragment) => <EventsAmountColumn place={place} />,
    []
  );
  const MemoizedStreetAddressColumn = React.useCallback(
    (place: PlaceFieldsFragment) => <StreetAddressColumn place={place} />,
    []
  );
  const MemoizedActionsColumn = React.useCallback(
    (place: PlaceFieldsFragment) => <ActionsColumn place={place} />,
    []
  );

  return (
    <Table
      caption={caption}
      wrapperClassName={classNames(className)}
      cols={[
        {
          isSortable: true,
          key: PLACE_SORT_OPTIONS.ID,
          headerName: t('placesPage.placesTableColumns.id'),
          sortIconType: 'string',
          transform: MemoizedIdColumn,
        },
        {
          isSortable: true,
          key: PLACE_SORT_OPTIONS.NAME,
          headerName: t('placesPage.placesTableColumns.name'),
          sortIconType: 'string',
          transform: MemoizedNameColumn,
        },
        {
          isSortable: true,
          key: PLACE_SORT_OPTIONS.N_EVENTS,
          headerName: t('placesPage.placesTableColumns.nEvents'),
          sortIconType: 'other',
          transform: MemoizedEventsAmountColumn,
        },
        {
          isSortable: true,
          key: PLACE_SORT_OPTIONS.STREET_ADDRESS,
          headerName: t('placesPage.placesTableColumns.streetAddress'),
          sortIconType: 'other',
          transform: MemoizedStreetAddressColumn,
        },
        {
          key: '',
          headerName: t('common.actions'),
          transform: MemoizedActionsColumn,
        },
      ]}
      hasActionButtons
      indexKey="id"
      initialSortingColumnKey={initialSortingColumnKey}
      initialSortingOrder={initialSortingOrder}
      onSort={(order, colKey, handleSort) => {
        handleSortChange(getSortByOrderAndColKey({ order, colKey }));
        handleSort();
      }}
      rows={places as PlaceFieldsFragment[]}
      variant="light"
    />
  );
};

export default PlacesTable;
