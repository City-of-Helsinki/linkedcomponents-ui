import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import NoDataRow from '../../../common/components/table/noDataRow/NoDataRow';
import SortableColumn from '../../../common/components/table/sortableColumn/SortableColumn';
import Table from '../../../common/components/table/Table';
import { PlaceFieldsFragment, PlacesQuery } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import useSetFocused from '../../../hooks/useSetFocused';
import { getPlaceFields } from '../../place/utils';
import { PLACE_SORT_OPTIONS } from '../constants';
import usePlacesQueryStringWithReturnPath from '../hooks/usePlacesQueryStringWithReturnPath';
import styles from './placesTable.module.scss';
import PlacesTableRow from './placesTableRow/PlacesTableRow';

export interface PlacesTableProps {
  caption: string;
  className?: string;
  places: PlacesQuery['places']['data'];
  setSort: (sort: PLACE_SORT_OPTIONS) => void;
  sort: PLACE_SORT_OPTIONS;
}

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
  const queryStringWithReturnPath = usePlacesQueryStringWithReturnPath();

  const table = React.useRef<HTMLTableElement>(null);
  const { focused } = useSetFocused(table);

  const handleRowClick = (place: PlaceFieldsFragment) => {
    const { placeUrl } = getPlaceFields(place, locale);

    navigate({
      pathname: placeUrl,
      search: queryStringWithReturnPath,
    });
  };

  const handleSort = (key: string) => {
    setSort(key as PLACE_SORT_OPTIONS);
  };

  return (
    <Table ref={table} className={className}>
      <caption aria-live={focused ? 'polite' : undefined}>{caption}</caption>
      <thead>
        <tr>
          <SortableColumn
            className={styles.idColumn}
            label={t('placesPage.placesTableColumns.id')}
            onClick={handleSort}
            sort={sort}
            sortKey={PLACE_SORT_OPTIONS.ID}
            type="text"
          />
          <SortableColumn
            className={styles.nameColumn}
            label={t('placesPage.placesTableColumns.name')}
            onClick={handleSort}
            sort={sort}
            sortKey={PLACE_SORT_OPTIONS.NAME}
            type="text"
          />
          <SortableColumn
            className={styles.nEventsColumn}
            label={t('placesPage.placesTableColumns.nEvents')}
            onClick={handleSort}
            sort={sort}
            sortKey={PLACE_SORT_OPTIONS.N_EVENTS}
            type="default"
          />
          <SortableColumn
            className={styles.streetAddressColumn}
            label={t('placesPage.placesTableColumns.streetAddress')}
            onClick={handleSort}
            sort={sort}
            sortKey={PLACE_SORT_OPTIONS.STREET_ADDRESS}
            type="text"
          />

          <th className={styles.actionButtonsColumn}></th>
        </tr>
      </thead>
      <tbody>
        {places.map(
          (place) =>
            place && (
              <PlacesTableRow
                key={place.id}
                onRowClick={handleRowClick}
                place={place}
              />
            )
        )}
        {!places.length && <NoDataRow colSpan={5} />}
      </tbody>
    </Table>
  );
};

export default PlacesTable;
