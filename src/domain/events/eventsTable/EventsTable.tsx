import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

import NoDataRow from '../../../common/components/table/NoDataRow';
import SortableColumn from '../../../common/components/table/SortableColumn';
import Table from '../../../common/components/table/Table';
import { EventFieldsFragment, EventsQuery } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import useSetFocused from '../../../hooks/useSetFocused';
import { getEventFields } from '../../event/utils';
import useEventsQueryStringWithReturnPath from '../../eventSearch/hooks/useEventsQueryStringWithReturnPath';
import { EVENT_SORT_OPTIONS } from '../constants';
import styles from './eventsTable.module.scss';
import EventTableRow from './EventsTableRow';

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
  const history = useHistory();
  const { t } = useTranslation();
  const queryStringWithReturnPath = useEventsQueryStringWithReturnPath();

  const table = React.useRef<HTMLTableElement>(null);

  const handleSort = (key: string) => {
    setSort(key as EVENT_SORT_OPTIONS);
  };

  const { focused } = useSetFocused(table);

  const handleRowClick = (event: EventFieldsFragment) => {
    const { eventUrl } = getEventFields(event, locale);
    const queryString = queryStringWithReturnPath;

    history.push({ pathname: eventUrl, search: queryString });
  };

  return (
    <Table ref={table} className={styles.eventsTable}>
      <caption aria-live={focused ? 'polite' : undefined}>{caption}</caption>
      <thead>
        <tr>
          <SortableColumn
            className={styles.nameColumn}
            label={t('eventsPage.eventsTableColumns.name')}
            onClick={handleSort}
            sort={sort}
            sortKey={EVENT_SORT_OPTIONS.NAME}
            type="text"
          />
          <th className={styles.publisherColumn}>
            {t('eventsPage.eventsTableColumns.publisher')}
          </th>
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
        {!events.length && <NoDataRow colSpan={6} />}
      </tbody>
    </Table>
  );
};

export default EventsTable;
