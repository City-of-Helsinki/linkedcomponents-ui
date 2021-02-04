import React from 'react';
import { useTranslation } from 'react-i18next';

import NoDataRow from '../../../common/components/table/NoDataRow';
import SortableColumn from '../../../common/components/table/SortableColumn';
import Table from '../../../common/components/table/Table';
import { EventFieldsFragment } from '../../../generated/graphql';
import { EVENT_SORT_OPTIONS } from '../constants';
import styles from './eventsTable.module.scss';
import EventTableRow from './EventsTableRow';

export interface EventsTableProps {
  caption: string;
  events: EventFieldsFragment[];
  setSort: (sort: EVENT_SORT_OPTIONS) => void;
  sort: EVENT_SORT_OPTIONS;
}

const EventsTable: React.FC<EventsTableProps> = ({
  caption,
  events,
  setSort,
  sort,
}) => {
  const table = React.useRef<HTMLTableElement>(null);
  const { t } = useTranslation();
  const [focused, setFocused] = React.useState(false);

  const handleSort = (key: string) => {
    setSort(key as EVENT_SORT_OPTIONS);
  };

  const isComponentFocused = () => {
    const activeElement = document.activeElement;

    return !!table.current?.contains(activeElement);
  };

  const onDocumentFocusin = () => {
    setFocused(isComponentFocused());
  };

  React.useEffect(() => {
    document.addEventListener('focusin', onDocumentFocusin);

    return () => {
      document.removeEventListener('focusin', onDocumentFocusin);
    };
  });

  return (
    <Table ref={table} className={styles.eventsTable}>
      <caption aria-live={focused ? 'polite' : undefined}>{caption}</caption>
      <thead>
        <tr>
          <th className={styles.idColumn}>
            {t('eventsPage.eventsTableColumns.id')}
          </th>
          <th className={styles.publisherColumn}>
            {t('eventsPage.eventsTableColumns.publisher')}
          </th>
          <SortableColumn
            className={styles.nameColumn}
            label={t('eventsPage.eventsTableColumns.name')}
            onClick={handleSort}
            sort={sort}
            sortKey={EVENT_SORT_OPTIONS.NAME}
            type="text"
          />
          <SortableColumn
            label={t('eventsPage.eventsTableColumns.startTime')}
            onClick={handleSort}
            sort={sort}
            sortKey={EVENT_SORT_OPTIONS.START_TIME}
          />
          <SortableColumn
            label={t('eventsPage.eventsTableColumns.endTime')}
            onClick={handleSort}
            sort={sort}
            sortKey={EVENT_SORT_OPTIONS.END_TIME}
          />
          <th className={styles.statusColumn}>
            {t('eventsPage.eventsTableColumns.status')}
          </th>
          <th className={styles.actionButtonsColumn}></th>
        </tr>
      </thead>
      <tbody>
        {events.map((event) => {
          return <EventTableRow key={event.id} event={event} />;
        })}
        {!events.length && <NoDataRow colSpan={6} />}
      </tbody>
    </Table>
  );
};

export default EventsTable;
