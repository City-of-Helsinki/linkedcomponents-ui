import omit from 'lodash/omit';
import uniqueId from 'lodash/uniqueId';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';
import { scroller } from 'react-scroll';

import LoadingSpinner from '../../../common/components/loadingSpinner/LoadingSpinner';
import { useNocacheContext } from '../../../common/components/nocache/NocacheContext';
import Pagination from '../../../common/components/pagination/Pagination';
import SingleSelect from '../../../common/components/singleSelect/SingleSelect';
import {
  EventsQuery,
  EventsQueryVariables,
  useEventsQuery,
} from '../../../generated/graphql';
import { OptionType } from '../../../types';
import getPathBuilder from '../../../utils/getPathBuilder';
import Container from '../../app/layout/Container';
import {
  DEFAULT_EVENT_SORT,
  EVENT_SORT_OPTIONS,
  EVENTS_PAGE_SIZE,
} from '../../events/constants';
import EventCard from '../../events/eventCard/EventCard';
import useEventSortOptions from '../../events/hooks/useEventSortOptions';
import { eventsPathBuilder } from '../../events/utils';
import { EventsLocationState } from '../types';
import {
  getEventItemId,
  getEventSearchInitialValues,
  replaceParamsToEventQueryString,
  scrollToEventCard,
} from '../utils';
import styles from './eventList.module.scss';

export interface EventListContainerProps {
  baseVariables: EventsQueryVariables;
}

type EventListProps = {
  events: EventsQuery['events']['data'];
  onSelectedPageChange: (page: number) => void;
  page: number;
  pageCount: number;
};

const getPageCount = (count: number, pageSize: number) => {
  return Math.ceil(count / pageSize);
};

const EventList: React.FC<EventListProps> = ({
  events,
  onSelectedPageChange,
  page,
  pageCount,
}) => {
  const location = useLocation<EventsLocationState>();
  const history = useHistory();

  React.useEffect(() => {
    if (location.state?.eventId) {
      scrollToEventCard(getEventItemId(location.state.eventId));
      // Clear eventId value to keep scroll position correctly
      const state = omit(location.state, 'eventId');
      // location.search seems to reset if not added here (...location)
      history.replace({ ...location, state });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
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
          selectedPage={page}
          setSelectedPage={onSelectedPageChange}
        />
      )}
    </Container>
  );
};

const EventListContainer: React.FC<EventListContainerProps> = ({
  baseVariables,
}) => {
  const eventListId = React.useRef<string>(uniqueId('event-list-')).current;
  const { nocache } = useNocacheContext();
  const { t } = useTranslation();
  const location = useLocation<EventsLocationState>();
  const history = useHistory();
  const { page, sort } = getEventSearchInitialValues(location.search);

  const sortOptions = useEventSortOptions();
  const variables = {
    ...baseVariables,
    createPath: getPathBuilder(eventsPathBuilder),
    nocache,
  };

  const { data: eventsData, loading } = useEventsQuery({
    variables,
  });

  const events = eventsData?.events?.data || [];

  const handleSelectedPageChange = (page: number) => {
    history.push({
      pathname: location.pathname,
      search: replaceParamsToEventQueryString(location.search, {
        page: page > 1 ? page : null,
      }),
    });

    // Scroll to the beginning of event list
    scroller.scrollTo(eventListId, { offset: -100 });
  };

  const handleSortSelectorChange = (sortOption: OptionType) => {
    handleSortChange(sortOption.value as EVENT_SORT_OPTIONS);
  };

  const handleSortChange = (val: EVENT_SORT_OPTIONS) => {
    history.push({
      pathname: location.pathname,
      search: replaceParamsToEventQueryString(location.search, {
        page: null,
        sort: val !== DEFAULT_EVENT_SORT ? val : null,
      }),
    });
  };

  const eventsCount = eventsData?.events?.meta.count || 0;
  const pageCount = getPageCount(eventsCount, EVENTS_PAGE_SIZE);

  return (
    <div id={eventListId} className={styles.eventList}>
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
        <EventList
          events={events}
          onSelectedPageChange={handleSelectedPageChange}
          page={page}
          pageCount={pageCount}
        />
      </LoadingSpinner>
    </div>
  );
};

export default EventListContainer;
