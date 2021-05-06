import camelCase from 'lodash/camelCase';
import uniqueId from 'lodash/uniqueId';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';
import { scroller } from 'react-scroll';

import FeedbackButton from '../../../common/components/feedbackButton/FeedbackButton';
import LoadingSpinner from '../../../common/components/loadingSpinner/LoadingSpinner';
import Pagination from '../../../common/components/pagination/Pagination';
import SingleSelect from '../../../common/components/singleSelect/SingleSelect';
import {
  EventFieldsFragment,
  EventsQueryVariables,
  useEventsQuery,
} from '../../../generated/graphql';
import { OptionType } from '../../../types';
import upperCaseFirstLetter from '../../../utils/upperCaseFirstLetter';
import Container from '../../app/layout/Container';
import {
  getEventSearchInitialValues,
  getEventsQueryVariables,
  replaceParamsToEventQueryString,
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

export interface EventListProps {
  activeTab: EVENTS_PAGE_TABS;
  baseVariables: EventsQueryVariables;
  listType: EVENT_LIST_TYPES;
  setListType: (type: EVENT_LIST_TYPES) => void;
  skip?: boolean;
}

const getPageCount = (count: number, pageSize: number) => {
  return Math.ceil(count / pageSize);
};

const EventList: React.FC<EventListProps> = ({
  activeTab,
  baseVariables,
  listType,
  setListType,
  skip,
}) => {
  const eventListId = uniqueId('event-list-');
  const { t } = useTranslation();
  const history = useHistory();
  const { pathname, search } = useLocation();
  const { page, sort } = getEventSearchInitialValues(search);

  const listTypeOptions = useEventListTypeOptions();
  const sortOptions = useEventSortOptions();
  const variables = { ...baseVariables, ...getEventsQueryVariables(search) };

  const { data: eventsData, loading } = useEventsQuery({
    skip,
    variables,
  });

  const events = (eventsData?.events?.data as EventFieldsFragment[]) || [];

  const handleSelectedPageChange = (page: number) => {
    history.push({
      pathname,
      search: replaceParamsToEventQueryString(search, {
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
      pathname,
      search: replaceParamsToEventQueryString(search, {
        sort: val !== DEFAULT_EVENT_SORT ? val : null,
      }),
    });
  };

  const eventsCount = eventsData?.events?.meta.count || 0;
  const pageCount = getPageCount(eventsCount, EVENTS_PAGE_SIZE);

  const getTableCaption = () => {
    return t(`eventsPage.eventsTableCaption.${camelCase(activeTab)}`, {
      sort: sortOptions.find((option) => option.value === sort)?.label,
    });
  };

  return (
    <div id={eventListId} className={styles.eventList}>
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
        <div
          className={styles[`contentWrapper${upperCaseFirstLetter(listType)}`]}
        >
          <Container className={styles.contentContainer} withOffset={true}>
            {listType === EVENT_LIST_TYPES.TABLE && (
              <div className={styles.table}>
                <EventsTable
                  caption={getTableCaption()}
                  events={events}
                  setSort={handleSortChange}
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
                setSelectedPage={handleSelectedPageChange}
              />
            )}
            <FeedbackButton theme="black" />
          </Container>
        </div>
      </LoadingSpinner>
    </div>
  );
};

export default EventList;
