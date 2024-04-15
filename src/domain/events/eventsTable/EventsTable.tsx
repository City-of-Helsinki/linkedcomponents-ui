import React from 'react';
import { useTranslation } from 'react-i18next';

import CustomTable from '../../../common/components/table/CustomTable';
import HeaderRow from '../../../common/components/table/headerRow/HeaderRow';
import {
  SortingHeaderCell,
  SortingHeaderCellProps,
} from '../../../common/components/table/sortingHeaderCell/SortingHeaderCell';
import TableBody from '../../../common/components/table/tableBody/TableBody';
import { EventsQuery } from '../../../generated/graphql';
import getSortByColKey from '../../../utils/getSortByColKey';
import getSortOrderAndKey from '../../../utils/getSortOrderAndKey';
import skipFalsyType from '../../../utils/skipFalsyType';
import { EVENT_SORT_OPTIONS } from '../constants';
import styles from './eventsTable.module.scss';
import EventTableRow from './eventsTableRow/EventsTableRow';

export type EventsTableProps = {
  caption: string;
  events: EventsQuery['events']['data'];
  setSort: (sort: EVENT_SORT_OPTIONS) => void;
  sort: EVENT_SORT_OPTIONS;
};

const EventsTable: React.FC<EventsTableProps> = ({
  caption,
  events,
  setSort,
  sort,
}) => {
  const { t } = useTranslation();

  const handleSort = (key: string) => {
    setSort(key as EVENT_SORT_OPTIONS);
  };

  const getColumnSortingOrder = (colKey: string) => {
    const { colKey: currentColKey, order } = getSortOrderAndKey(sort);

    return currentColKey === colKey ? order : 'unset';
  };

  const setSortingAndOrder = (colKey: string): void => {
    handleSort(getSortByColKey({ colKey, sort }));
  };

  const headerColumnProps: Record<
    | EVENT_SORT_OPTIONS.END_TIME
    | EVENT_SORT_OPTIONS.NAME
    | EVENT_SORT_OPTIONS.START_TIME,
    SortingHeaderCellProps
  > = {
    [EVENT_SORT_OPTIONS.END_TIME]: {
      colKey: EVENT_SORT_OPTIONS.END_TIME,
      title: t('eventsPage.eventsTableColumns.endTime'),
      order: getColumnSortingOrder(EVENT_SORT_OPTIONS.END_TIME),
      setSortingAndOrder,
      sortIconType: 'other',
    },
    [EVENT_SORT_OPTIONS.NAME]: {
      className: styles.nameColumn,
      colKey: EVENT_SORT_OPTIONS.NAME,
      title: t('eventsPage.eventsTableColumns.name'),
      order: getColumnSortingOrder(EVENT_SORT_OPTIONS.NAME),
      setSortingAndOrder,
      sortIconType: 'string',
    },
    [EVENT_SORT_OPTIONS.START_TIME]: {
      colKey: EVENT_SORT_OPTIONS.START_TIME,
      title: t('eventsPage.eventsTableColumns.startTime'),
      order: getColumnSortingOrder(EVENT_SORT_OPTIONS.START_TIME),
      setSortingAndOrder,
      sortIconType: 'other',
    },
  };

  return (
    <CustomTable
      caption={caption}
      hasActionButtons
      inlineWithBackground
      showNoResults={!events.length}
      variant="light"
    >
      <thead>
        <HeaderRow>
          <SortingHeaderCell {...headerColumnProps[EVENT_SORT_OPTIONS.NAME]} />
          <th className={styles.publisherColumn}>
            {t('eventsPage.eventsTableColumns.publisher')}
          </th>
          <SortingHeaderCell
            {...headerColumnProps[EVENT_SORT_OPTIONS.START_TIME]}
          />
          <SortingHeaderCell
            {...headerColumnProps[EVENT_SORT_OPTIONS.END_TIME]}
          />
          <th className={styles.statusColumn}>
            {t('eventsPage.eventsTableColumns.status')}
          </th>
          <th>{t('common.actions')}</th>
        </HeaderRow>
      </thead>
      <TableBody>
        {events.filter(skipFalsyType).map((event) => (
          <EventTableRow key={event.id} event={event} />
        ))}
      </TableBody>
    </CustomTable>
  );
};

export default EventsTable;
