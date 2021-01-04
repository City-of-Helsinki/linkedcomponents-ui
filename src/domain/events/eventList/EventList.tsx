import React from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';

import FeedbackButton from '../../../common/components/feedbackButton/FeedbackButton';
import LoadingSpinner from '../../../common/components/loadingSpinner/LoadingSpinner';
import Pagination from '../../../common/components/pagination/Pagination';
import {
  EventsQueryVariables,
  useEventsQuery,
} from '../../../generated/graphql';
import { EVENTS_PAGE_SIZE } from '../constants';
import EventCard from '../eventCard/EventCard';
import styles from './eventList.module.scss';

interface Props {
  skip?: boolean;
  variables: EventsQueryVariables;
}

const getPageCount = (count: number, pageSize: number) => {
  return Math.ceil(count / pageSize);
};

const EventList: React.FC<Props> = ({ skip, variables }) => {
  const { pageSize } = variables;
  const [selectedPage, setSelectedPage] = React.useState(1);
  const { data: eventsData, loading, refetch } = useEventsQuery({
    skip,
    variables,
  });

  const events = eventsData?.events.data || [];

  const handleSelectedPageChange = (page: number) => {
    setSelectedPage(page);
    refetch({ ...variables, page });
  };

  const pageCount = getPageCount(
    eventsData?.events.meta.count || 0,
    pageSize || EVENTS_PAGE_SIZE
  );

  useDeepCompareEffect(() => {
    setSelectedPage(1);
  }, [variables]);

  return (
    <div className={styles.eventList}>
      <div className={styles.eventCards}>
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
