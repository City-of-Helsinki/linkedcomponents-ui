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
  EVENT_LIST_TYPES,
  EVENT_SORT_OPTIONS,
  EVENTS_PAGE_SIZE,
} from '../constants';
import EventCard from '../eventCard/EventCard';
import useEventListTypeOptions from '../hooks/useEventListTypeOptions';
import useEventSortOptions from '../hooks/useEventSortOption';
import styles from './eventList.module.scss';
import ListTypeSelector from './ListTypeSelector';

interface Props {
  baseVariables: EventsQueryVariables;
  listType: EVENT_LIST_TYPES;
  setListType: (type: EVENT_LIST_TYPES) => void;
  skip?: boolean;
}

const getPageCount = (count: number, pageSize: number) => {
  return Math.ceil(count / pageSize);
};

const EventList: React.FC<Props> = ({
  baseVariables,
  listType,
  setListType,
  skip,
}) => {
  const { t } = useTranslation();
  const { pageSize } = baseVariables;
  const [selectedPage, setSelectedPage] = React.useState(1);

  const listTypeOptions = useEventListTypeOptions();
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
      <div className={styles.listStyleRow}>
        <div className={styles.listStyleSelectorColumn}>
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
              onChange={handleSortChange}
              options={sortOptions}
              value={sortOptions.find((option) => option.value === sort)}
            />
          )}
        </div>
      </div>
      {listType === EVENT_LIST_TYPES.TABLE && (
        <div className={styles.table}>
          <LoadingSpinner isLoading={loading}>
            TODO: Add table view here
          </LoadingSpinner>
        </div>
      )}
      {listType === EVENT_LIST_TYPES.CARD_LIST && (
        <div className={styles.eventCards}>
          <LoadingSpinner isLoading={loading}>
            {events.map((event) => {
              return event && <EventCard key={event.id} event={event} />;
            })}
          </LoadingSpinner>
        </div>
      )}
      {pageCount > 1 && (
        <Pagination
          pageCount={pageCount}
          selectedPage={selectedPage}
          setSelectedPage={handleSelectedPageChange}
        />
      )}
      <FeedbackButton />
    </div>
  );
};

export default EventList;
