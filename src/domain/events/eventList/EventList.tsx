import camelCase from 'lodash/camelCase';
import omit from 'lodash/omit';
import uniqueId from 'lodash/uniqueId';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';
import { scroller } from 'react-scroll';

import FeedbackButton from '../../../common/components/feedbackButton/FeedbackButton';
import LoadingSpinner from '../../../common/components/loadingSpinner/LoadingSpinner';
import { useNocacheContext } from '../../../common/components/nocache/NocacheContext';
import Pagination from '../../../common/components/pagination/Pagination';
import SingleSelect from '../../../common/components/singleSelect/SingleSelect';
import {
  EventFieldsFragment,
  EventsQuery,
  EventsQueryVariables,
  useEventsQuery,
} from '../../../generated/graphql';
import { OptionType } from '../../../types';
import upperCaseFirstLetter from '../../../utils/upperCaseFirstLetter';
import Container from '../../app/layout/Container';
import { EventsLocationState } from '../../eventSearch/types';
import {
  getEventItemId,
  getEventSearchInitialValues,
  getEventsQueryVariables,
  replaceParamsToEventQueryString,
  scrollToEventCard,
} from '../../eventSearch/utils';
import {
  DEFAULT_EVENT_SORT,
  EVENT_LIST_TYPES,
  EVENT_SORT_OPTIONS,
  EVENTS_PAGE_SIZE,
  EVENTS_PAGE_TABS,
} from '../constants';
import EventCard from '../eventCard/EventCard';
import EventsTable from '../eventsTable/EventsTable';
import useEventListTypeOptions from '../hooks/useEventListTypeOptions';
import useEventSortOptions from '../hooks/useEventSortOptions';
import styles from './eventList.module.scss';
import ListTypeSelector from './ListTypeSelector';

export interface EventListContainerProps {
  activeTab: EVENTS_PAGE_TABS;
  baseVariables: EventsQueryVariables;
  className?: string;
  listType: EVENT_LIST_TYPES;
  setListType: (type: EVENT_LIST_TYPES) => void;
  skip?: boolean;
}

const getPageCount = (count: number, pageSize: number) => {
  return Math.ceil(count / pageSize);
};

type EventListProps = {
  events: EventsQuery['events']['data'];
  onSelectedPageChange: (page: number) => void;
  onSortChange: (sort: EVENT_SORT_OPTIONS) => void;
  pageCount: number;
  page: number;
  sort: EVENT_SORT_OPTIONS;
} & Pick<EventListContainerProps, 'activeTab' | 'listType'>;

const EventList: React.FC<EventListProps> = ({
  activeTab,
  events,
  listType,
  onSelectedPageChange,
  onSortChange,
  page,
  pageCount,
  sort,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation<EventsLocationState>();

  const sortOptions = useEventSortOptions();

  const getTableCaption = () => {
    return t(`eventsPage.eventsTableCaption.${camelCase(activeTab)}`, {
      sort: sortOptions.find((option) => option.value === sort)?.label,
    });
  };

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
    <div className={styles[`contentWrapper${upperCaseFirstLetter(listType)}`]}>
      <Container className={styles.contentContainer} withOffset={true}>
        {listType === EVENT_LIST_TYPES.TABLE && (
          <div className={styles.table}>
            <EventsTable
              caption={getTableCaption()}
              events={events}
              setSort={onSortChange}
              sort={sort as EVENT_SORT_OPTIONS}
            />
          </div>
        )}
        {listType === EVENT_LIST_TYPES.CARD_LIST && (
          <div className={styles.eventCards}>
            {events.map((event) => {
              return event && <EventCard key={event.id} event={event} />;
            })}
          </div>
        )}
        {pageCount > 1 && (
          <Pagination
            pageCount={pageCount}
            selectedPage={page}
            setSelectedPage={onSelectedPageChange}
          />
        )}
        <FeedbackButton theme="black" />
      </Container>
    </div>
  );
};

const EventListContainer: React.FC<EventListContainerProps> = (props) => {
  const { baseVariables, className, listType, setListType, skip } = props;
  const { nocache } = useNocacheContext();
  const eventListId = uniqueId('event-list-');
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation<EventsLocationState>();
  const { page, sort } = getEventSearchInitialValues(location.search);

  const listTypeOptions = useEventListTypeOptions();
  const sortOptions = useEventSortOptions();
  const variables = {
    ...baseVariables,
    ...getEventsQueryVariables(location.search),
  };

  const { data: eventsData, loading } = useEventsQuery({
    skip,
    variables: { ...variables, nocache },
  });

  const events = (eventsData?.events?.data as EventFieldsFragment[]) || [];

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
        sort: val !== DEFAULT_EVENT_SORT ? val : null,
      }),
    });
  };

  const eventsCount = eventsData?.events?.meta.count || 0;
  const pageCount = getPageCount(eventsCount, EVENTS_PAGE_SIZE);

  return (
    <div id={eventListId} className={(styles.eventList, className)}>
      <Container withOffset={true}>
        <div className={styles.listTypeRow}>
          <div className={styles.listTypeSelectorColumn}>
            <ListTypeSelector
              caption={t('eventsPage.captionListTypes')}
              name="list-type"
              onChange={setListType}
              options={listTypeOptions}
              value={listType}
            />
            <span className={styles.count}>
              {t('eventsPage.count', { count: eventsCount })}
            </span>
          </div>
          <div className={styles.sortSelector}>
            {listType === EVENT_LIST_TYPES.CARD_LIST && (
              <SingleSelect
                className={styles.sortOrderSelector}
                label={t('eventsPage.labelSort')}
                onChange={handleSortSelectorChange}
                options={sortOptions}
                value={sortOptions.find((option) => option.value === sort)}
              />
            )}
          </div>
        </div>
      </Container>
      <LoadingSpinner isLoading={loading}>
        <EventList
          {...props}
          events={events}
          onSelectedPageChange={handleSelectedPageChange}
          onSortChange={handleSortChange}
          page={page}
          pageCount={pageCount}
          sort={sort}
        />
      </LoadingSpinner>
    </div>
  );
};

export default EventListContainer;
