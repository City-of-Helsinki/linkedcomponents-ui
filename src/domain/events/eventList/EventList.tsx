import camelCase from 'lodash/camelCase';
import React from 'react';
import { useTranslation } from 'react-i18next';
import useDeepCompareEffect from 'use-deep-compare-effect';

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
import FormContainer from '../../app/layout/FormContainer';
import {
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
  setSort: (sort: EVENT_SORT_OPTIONS) => void;
  skip?: boolean;
  sort: EVENT_SORT_OPTIONS;
}

const getPageCount = (count: number, pageSize: number) => {
  return Math.ceil(count / pageSize);
};

const EventList: React.FC<EventListProps> = ({
  activeTab,
  baseVariables,
  listType,
  setListType,
  setSort,
  skip,
  sort,
}) => {
  const { t } = useTranslation();
  const { pageSize = EVENTS_PAGE_SIZE } = baseVariables;
  const [selectedPage, setSelectedPage] = React.useState(1);

  const listTypeOptions = useEventListTypeOptions();
  const sortOptions = useEventSortOptions();
  const variables = { ...baseVariables, pageSize };

  const { data: eventsData, loading, refetch } = useEventsQuery({
    skip,
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

  const getTableCaption = () => {
    return t(`eventsPage.eventsTableCaption.${camelCase(activeTab)}`, {
      sort: sortOptions.find((option) => option.value === sort)?.label,
    });
  };

  return (
    <div className={styles.eventList}>
      <Container>
        <FormContainer>
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
        </FormContainer>
      </Container>
      <LoadingSpinner isLoading={loading}>
        <div
          className={styles[`contentWrapper${upperCaseFirstLetter(listType)}`]}
        >
          <Container className={styles.contentContainer}>
            <FormContainer>
              {listType === EVENT_LIST_TYPES.TABLE && (
                <div className={styles.table}>
                  <EventsTable
                    caption={getTableCaption()}
                    events={events}
                    setSort={handleSortChange}
                    sort={sort}
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
                  selectedPage={selectedPage}
                  setSelectedPage={handleSelectedPageChange}
                />
              )}
              <FeedbackButton theme="black" />
            </FormContainer>
          </Container>
        </div>
      </LoadingSpinner>
    </div>
  );
};

export default EventList;
