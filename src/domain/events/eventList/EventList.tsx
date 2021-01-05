import React from 'react';
import { useTranslation } from 'react-i18next';
import useDeepCompareEffect from 'use-deep-compare-effect';

import FeedbackButton from '../../../common/components/feedbackButton/FeedbackButton';
import LoadingSpinner from '../../../common/components/loadingSpinner/LoadingSpinner';
import Pagination from '../../../common/components/pagination/Pagination';
import SingleSelect from '../../../common/components/singleSelect/SingleSelect';
import {
  EventsQueryVariables,
  useEventsQuery,
} from '../../../generated/graphql';
import { OptionType } from '../../../types';
import {
  DEFAULT_EVENT_SORT,
  EVENT_SORT_OPTIONS,
  EVENTS_PAGE_SIZE,
} from '../constants';
import EventCard from '../eventCard/EventCard';
import useEventSortOptions from '../hooks/useEventSortOption';
import styles from './eventList.module.scss';

interface Props {
  skip?: boolean;
  baseVariables: EventsQueryVariables;
}

const getPageCount = (count: number, pageSize: number) => {
  return Math.ceil(count / pageSize);
};

const EventList: React.FC<Props> = ({ baseVariables, skip }) => {
  const { t } = useTranslation();
  const { pageSize } = baseVariables;
  const [selectedPage, setSelectedPage] = React.useState(1);

  const sortOptions = useEventSortOptions();
  const [sort, setSort] = React.useState(DEFAULT_EVENT_SORT);
  const variables = { ...baseVariables };

  const { data: eventsData, loading, refetch } = useEventsQuery({
    skip,
    variables,
  });

  const events = eventsData?.events.data || [];

  const handleSelectedPageChange = (page: number) => {
    setSelectedPage(page);
    refetch({ ...variables, page, sort });
  };

  const handleSortChange = (sortOption: OptionType) => {
    setSort(sortOption.value as EVENT_SORT_OPTIONS);
    setSelectedPage(1);
    refetch({ ...variables, page: 1, sort: sortOption.value });
  };
  const eventsCount = eventsData?.events.meta.count || 0;
  const pageCount = getPageCount(eventsCount, pageSize || EVENTS_PAGE_SIZE);

  useDeepCompareEffect(() => {
    setSelectedPage(1);
    setSort(DEFAULT_EVENT_SORT);
  }, [baseVariables]);

  return (
    <div className={styles.eventList}>
      <div className={styles.eventCards}>
        <div className={styles.listStyleRow}>
          <div className={styles.listStyleSelectorColumn}>
            <span className={styles.count}>
              {t('eventsPage.count', { count: eventsCount })}
            </span>
          </div>
          <div className={styles.sortSelector}>
            <SingleSelect
              label={t('eventsPage.labelSort')}
              onChange={handleSortChange}
              options={sortOptions}
              value={sortOptions.find((option) => option.value === sort)}
            />
          </div>
        </div>
        <LoadingSpinner isLoading={loading}>
          {events.map((event) => {
            return event && <EventCard key={event.id} event={event} />;
          })}
          {pageCount > 1 && (
            <Pagination
              pageCount={pageCount}
              selectedPage={selectedPage}
              setSelectedPage={handleSelectedPageChange}
            />
          )}
        </LoadingSpinner>
      </div>
      <FeedbackButton />
    </div>
  );
};

export default EventList;
