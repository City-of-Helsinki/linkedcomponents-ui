import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

import Table from '../../../common/components/table/Table2';
import { PlaceFieldsFragment, PlacesQuery } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import useQueryStringWithReturnPath from '../../../hooks/useQueryStringWithReturnPath';
import getInitialSort from '../../../utils/getInitialSort';
import getNewSort from '../../../utils/getNewSort';
import { getPlaceFields, getPlaceItemId } from '../../place/utils';
import { PLACE_SORT_OPTIONS } from '../constants';
import PlaceActionsDropdown from '../placeActionsDropdown/PlaceActionsDropdown';
import styles from './placesTable.module.scss';

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
  const { placeUrl } = getPlaceFields(place, locale);

  return (
    <Link
      onClick={/* istanbul ignore next */ (e) => e.preventDefault()}
      to={placeUrl}
    >
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

const PlacesTable: React.FC<PlacesTableProps> = ({
  caption,
  className,
  places,
  setSort,
  sort,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const locale = useLocale();
  const queryStringWithReturnPath = useQueryStringWithReturnPath();

  const handleRowClick = (place: object) => {
    const { placeUrl } = getPlaceFields(place as PlaceFieldsFragment, locale);

    navigate({
      pathname: placeUrl,
      search: queryStringWithReturnPath,
    });
  };

  const handleSortChange = (key: string) => {
    setSort(key as PLACE_SORT_OPTIONS);
  };

  return (
    <Table
      caption={caption}
      className={className}
      cols={[
        {
          className: styles.idColumn,
          isSortable: true,
          key: PLACE_SORT_OPTIONS.ID,
          headerName: t('placesPage.placesTableColumns.id'),
          sortIconType: 'string',
          transform: (place: PlaceFieldsFragment) => <IdColumn place={place} />,
        },
        {
          className: styles.nameColumn,
          isSortable: true,
          key: PLACE_SORT_OPTIONS.NAME,
          headerName: t('placesPage.placesTableColumns.name'),
          sortIconType: 'string',
          transform: (place: PlaceFieldsFragment) => (
            <NameColumn place={place} />
          ),
        },
        {
          className: styles.nEventsColumn,
          isSortable: true,
          key: PLACE_SORT_OPTIONS.N_EVENTS,
          headerName: t('placesPage.placesTableColumns.nEvents'),
          sortIconType: 'other',
          transform: (place: PlaceFieldsFragment) => (
            <EventsAmountColumn place={place} />
          ),
        },
        {
          className: styles.streetAddressColumn,
          isSortable: true,
          key: PLACE_SORT_OPTIONS.STREET_ADDRESS,
          headerName: t('placesPage.placesTableColumns.streetAddress'),
          sortIconType: 'other',
          transform: (place: PlaceFieldsFragment) => (
            <StreetAddressColumn place={place} />
          ),
        },
        {
          className: styles.actionButtonsColumn,
          key: '',
          headerName: '',
          onClick: (ev) => {
            ev.stopPropagation();
            ev.preventDefault();
          },
          transform: (place: PlaceFieldsFragment) => (
            <PlaceActionsDropdown place={place} />
          ),
        },
      ]}
      {...getInitialSort(sort)}
      getRowProps={(place) => {
        const { id, name } = getPlaceFields(
          place as PlaceFieldsFragment,
          locale
        );

        return {
          'aria-label': name,
          'data-testid': id,
          id: getPlaceItemId(id),
        };
      }}
      indexKey="id"
      onRowClick={handleRowClick}
      onSort={(order, colKey, handleSort) => {
        handleSortChange(getNewSort({ order, colKey }));
        handleSort();
      }}
      rows={places as PlaceFieldsFragment[]}
      variant="light"
    />
  );
};

export default PlacesTable;
