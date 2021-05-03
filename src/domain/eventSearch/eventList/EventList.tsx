import React from 'react';
import { useTranslation } from 'react-i18next';
import useDeepCompareEffect from 'use-deep-compare-effect';

import LoadingSpinner from '../../../common/components/loadingSpinner/LoadingSpinner';
import Pagination from '../../../common/components/pagination/Pagination';
import SingleSelect from '../../../common/components/singleSelect/SingleSelect';
import {
  EventFieldsFragment,
  EventsQueryVariables,
  useEventsQuery,
} from '../../../generated/graphql';
import { OptionType } from '../../../types';
import getPathBuilder from '../../../utils/getPathBuilder';
import Container from '../../app/layout/Container';
import { EVENT_SORT_OPTIONS, EVENTS_PAGE_SIZE } from '../../events/constants';
import EventCard from '../../events/eventCard/EventCard';
import useEventSortOptions from '../../events/hooks/useEventSortOptions';
import { eventsPathBuilder } from '../../events/utils';
import styles from './eventList.module.scss';

export interface EventListProps {
  baseVariables: EventsQueryVariables;
  setSort: (sort: EVENT_SORT_OPTIONS) => void;
  sort: EVENT_SORT_OPTIONS;
}

const getPageCount = (count: number, pageSize: number) => {
  return Math.ceil(count / pageSize);
};

const EventList: React.FC<EventListProps> = ({
  baseVariables,
  setSort,
  sort,
}) => {
  const { t } = useTranslation();
  const { pageSize = EVENTS_PAGE_SIZE } = baseVariables;
  const [selectedPage, setSelectedPage] = React.useState(1);

  const sortOptions = useEventSortOptions();
  const variables = {
    ...baseVariables,
    createPath: getPathBuilder(eventsPathBuilder),
    pageSize,
    sort,
  };

  const { data: eventsData, loading, refetch } = useEventsQuery({
    variables,
  });

  const events = (eventsData?.events.data as EventFieldsFragment[]) || [];

  const handleSelectedPageChange = (page: number) => {
    setSelectedPage(page);
    refetch({ ...variables, page, sort });
  };

  const handleSortSelectorChange = (sortOption: OptionType) => {
    handleSortChange(sortOption.value as EVENT_SORT_OPTIONS);
  };

  const handleSortChange = (val: EVENT_SORT_OPTIONS) => {
    setSort(val);
    setSelectedPage(1);
    refetch({ ...variables, page: 1, sort: val });
  };

  const eventsCount = eventsData?.events.meta.count || 0;
  const pageCount = getPageCount(eventsCount, pageSize || EVENTS_PAGE_SIZE);

  useDeepCompareEffect(() => {
    setSelectedPage(1);
  }, [baseVariables]);

  return (
    <div className={styles.eventList}>
      <Container withOffset={true}>
        <div className={styles.sortRow}>
          <div className={styles.countColumn}>
            <span className={styles.count}>
              {t('eventsPage.count', { count: eventsCount })}
            </span>
          </div>
          <div className={styles.sortSelector}>
            <SingleSelect
              className={styles.sortOrderSelector}
              label={t('eventsPage.labelSort')}
              onChange={handleSortSelectorChange}
              options={sortOptions}
              value={sortOptions.find((option) => option.value === sort)}
            />
          </div>
        </div>
      </Container>
      <LoadingSpinner isLoading={loading}>
        <Container className={styles.contentContainer} withOffset={true}>
          <div className={styles.eventCards}>
            {events.map((event) => {
              return event && <EventCard key={event.id} event={event} />;
            })}
          </div>

          {pageCount > 1 && (
            <Pagination
              className={styles.pagination}
              pageCount={pageCount}
              selectedPage={selectedPage}
              setSelectedPage={handleSelectedPageChange}
            />
          )}
        </Container>
      </LoadingSpinner>
    </div>
  );
};

export default EventList;
