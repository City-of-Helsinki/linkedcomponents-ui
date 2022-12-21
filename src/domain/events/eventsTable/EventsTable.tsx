import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import CustomTable from '../../../common/components/table/CustomTable';
import HeaderRow from '../../../common/components/table/headerRow/HeaderRow';
import NoResultsRow from '../../../common/components/table/noResultsRow/NoResultsRow';
import { SortingHeaderCell } from '../../../common/components/table/sortingHeaderCell/SortingHeaderCell';
import TableBody from '../../../common/components/table/tableBody/TableBody';
import { EventFieldsFragment, EventsQuery } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import useQueryStringWithReturnPath from '../../../hooks/useQueryStringWithReturnPath';
import getSortByColKey from '../../../utils/getSortByColKey';
import getSortOrderAndKey from '../../../utils/getSortOrderAndKey';
import { getEventFields } from '../../event/utils';
import { EVENT_SORT_OPTIONS } from '../constants';
import styles from './eventsTable.module.scss';
import EventTableRow from './eventsTableRow/EventsTableRow';

export interface EventsTableProps {
  caption: string;
  events: EventsQuery['events']['data'];
  setSort: (sort: EVENT_SORT_OPTIONS) => void;
  sort: EVENT_SORT_OPTIONS;
}

const EventsTable: React.FC<EventsTableProps> = ({
  caption,
  events,
  setSort,
  sort,
}) => {
  const locale = useLocale();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const queryStringWithReturnPath = useQueryStringWithReturnPath();

  const handleSort = (key: string) => {
    setSort(key as EVENT_SORT_OPTIONS);
  };

  const handleRowClick = (event: EventFieldsFragment) => {
    const { eventUrl } = getEventFields(event, locale);
    const queryString = queryStringWithReturnPath;

    navigate({ pathname: eventUrl, search: queryString });
  };

  const getColumnSortingOrder = (colKey: string) => {
    const { colKey: currentColKey, order } = getSortOrderAndKey(sort);

    return currentColKey === colKey ? (order as 'desc' | 'asc') : 'unset';
  };

  const setSortingAndOrder = (colKey: string): void => {
    handleSort(getSortByColKey({ colKey, sort }));
  };

  return (
    <CustomTable caption={caption} variant="light">
      <thead>
        <HeaderRow>
          <SortingHeaderCell
            className={styles.nameColumn}
            colKey={EVENT_SORT_OPTIONS.NAME}
            title={t('eventsPage.eventsTableColumns.name')}
            order={getColumnSortingOrder(EVENT_SORT_OPTIONS.NAME)}
            setSortingAndOrder={setSortingAndOrder}
            sortIconType={'string'}
          />
          <th className={styles.publisherColumn}>
            {t('eventsPage.eventsTableColumns.publisher')}
          </th>
          <SortingHeaderCell
            colKey={EVENT_SORT_OPTIONS.START_TIME}
            title={t('eventsPage.eventsTableColumns.startTime')}
            order={getColumnSortingOrder(EVENT_SORT_OPTIONS.START_TIME)}
            setSortingAndOrder={setSortingAndOrder}
            sortIconType={'other'}
          />
          <SortingHeaderCell
            colKey={EVENT_SORT_OPTIONS.END_TIME}
            title={t('eventsPage.eventsTableColumns.endTime')}
            order={getColumnSortingOrder(EVENT_SORT_OPTIONS.END_TIME)}
            setSortingAndOrder={setSortingAndOrder}
            sortIconType={'other'}
          />
          <th className={styles.statusColumn}>
            {t('eventsPage.eventsTableColumns.status')}
          </th>
          <th className={styles.actionButtonsColumn}></th>
        </HeaderRow>
      </thead>
      <TableBody>
        {events.map((event) => {
          return (
            event && (
              <EventTableRow
                key={event?.id}
                event={event}
                onRowClick={handleRowClick}
              />
            )
          );
        })}
        {!events.length && <NoResultsRow colSpan={6} />}
      </TableBody>
    </CustomTable>
  );
};

export default EventsTable;
