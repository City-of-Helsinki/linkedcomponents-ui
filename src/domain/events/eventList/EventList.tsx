import camelCase from 'lodash/camelCase';
import omit from 'lodash/omit';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import FeedbackButton from '../../../common/components/feedbackButton/FeedbackButton';
import LoadingSpinner from '../../../common/components/loadingSpinner/LoadingSpinner';
import Pagination from '../../../common/components/pagination/Pagination';
import SingleSelect from '../../../common/components/singleSelect/SingleSelect';
import TableWrapper from '../../../common/components/table/tableWrapper/TableWrapper';
import { testIds } from '../../../constants';
import {
  EventsQuery,
  EventsQueryVariables,
  useEventsQuery,
} from '../../../generated/graphql';
import useCommonListProps from '../../../hooks/useCommonListProps';
import useIdWithPrefix from '../../../hooks/useIdWithPrefix';
import { CommonListProps, OptionType } from '../../../types';
import getValue from '../../../utils/getValue';
import { scrollToItem } from '../../../utils/scrollToItem';
import upperCaseFirstLetter from '../../../utils/upperCaseFirstLetter';
import Container from '../../app/layout/container/Container';
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
import { EventsLocationState } from '../types';
import {
  getEventItemId,
  getEventSearchInitialValues,
  getEventsQueryVariables,
} from '../utils';
import styles from './eventList.module.scss';
import ListTypeSelector from './listTypeSelector/ListTypeSelector';

type EventListContainerCommonProps = {
  baseVariables?: EventsQueryVariables;
  className?: string;
  listType?: EVENT_LIST_TYPES;
  skip?: boolean;
};

export type EventListContainerProps = EventListContainerCommonProps &
  (
    | {
        showListTypeSelector?: false;
        activeTab?: never;
        setListType?: never;
      }
    | {
        showListTypeSelector: true;
        activeTab: EVENTS_PAGE_TABS;
        setListType: (type: EVENT_LIST_TYPES) => void;
      }
  );

type EventListProps = {
  events: EventsQuery['events']['data'];
  listType: EVENT_LIST_TYPES;
  page: number;
  sort: EVENT_SORT_OPTIONS;
} & Pick<EventListContainerProps, 'activeTab'> &
  CommonListProps;

const EventList: React.FC<EventListProps> = ({
  activeTab,
  events,
  listType,
  onPageChange,
  onSortChange,
  page,
  pageCount,
  pageHref,
  sort,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const sortOptions = useEventSortOptions();

  const getTableCaption = () => {
    return t(`eventsPage.eventsTableCaption.${camelCase(activeTab)}`, {
      sort: sortOptions.find((option) => option.value === sort)?.label,
    });
  };

  React.useEffect(() => {
    const locationState = location.state as EventsLocationState;
    if (locationState?.eventId) {
      scrollToItem(getEventItemId(locationState.eventId));
      // Clear eventId value to keep scroll position correctly
      const state = omit(locationState, 'eventId');
      // location.search seems to reset if not added here (...location)
      navigate(location, { state, replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles[`contentWrapper${upperCaseFirstLetter(listType)}`]}>
      <Container className={styles.contentContainer} withOffset={true}>
        {listType === EVENT_LIST_TYPES.TABLE && (
          <TableWrapper inlineWithBackground>
            <EventsTable
              caption={getTableCaption()}
              events={events}
              setSort={onSortChange}
              sort={sort as EVENT_SORT_OPTIONS}
            />
          </TableWrapper>
        )}
        {listType === EVENT_LIST_TYPES.CARD_LIST && (
          <div className={styles.eventCards}>
            {events.map(
              (event) => event && <EventCard key={event.id} event={event} />
            )}
          </div>
        )}
        {pageCount > 1 && (
          <Pagination
            pageCount={pageCount}
            pageHref={pageHref}
            pageIndex={page - 1}
            onChange={onPageChange}
          />
        )}

        <FeedbackButton theme="black" />
      </Container>
    </div>
  );
};

const EventListContainer: React.FC<EventListContainerProps> = (props) => {
  const {
    baseVariables,
    className,
    listType = EVENT_LIST_TYPES.CARD_LIST,
    setListType,
    showListTypeSelector,
    skip,
  } = props;
  const { t } = useTranslation();
  const location = useLocation();

  const { page, sort } = getEventSearchInitialValues(location.search);

  const eventListId = useIdWithPrefix({ prefix: 'event-list-' });

  const listTypeOptions = useEventListTypeOptions();
  const sortOptions = useEventSortOptions();

  const variables = {
    ...baseVariables,
    ...getEventsQueryVariables(location.search, baseVariables),
  };

  const { data: eventsData, loading } = useEventsQuery({
    skip,
    variables,
  });

  const events = getValue(eventsData?.events?.data, []);

  const { count, onSortChange, ...listProps } = useCommonListProps({
    defaultSort: DEFAULT_EVENT_SORT,
    listId: eventListId,
    meta: eventsData?.events.meta,
    pageSize: EVENTS_PAGE_SIZE,
  });

  const handleSortSelectorChange = (sortOption: OptionType) => {
    onSortChange(sortOption.value);
  };

  return (
    <div
      id={eventListId}
      className={(styles.eventList, className)}
      data-testid={testIds.eventList.resultList}
    >
      <Container withOffset={true}>
        <div className={styles.listTypeRow}>
          <div className={styles.listTypeSelectorColumn}>
            {showListTypeSelector && (
              <ListTypeSelector
                caption={t('eventsPage.captionListTypes')}
                name="list-type"
                onChange={setListType}
                options={listTypeOptions}
                value={listType}
              />
            )}

            <span className={styles.count}>
              {t('eventsPage.count', { count })}
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
          listType={listType}
          onSortChange={onSortChange}
          page={page}
          sort={sort}
          {...listProps}
        />
      </LoadingSpinner>
    </div>
  );
};

export default EventListContainer;
