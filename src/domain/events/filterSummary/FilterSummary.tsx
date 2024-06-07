import classNames from 'classnames';
import React, { cloneElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import DateFilterTag from '../../../common/components/filterTag/dateFilterTag/DateFilterTag';
import EventStatusFilterTag from '../../../common/components/filterTag/eventStatusFilterTag/EventStatusFilterTag';
import EventTypeFilterTag from '../../../common/components/filterTag/evenTypeFilterTag/EventTypeFilterTag';
import FilterTag from '../../../common/components/filterTag/FilterTag';
import PlaceFilterTag from '../../../common/components/filterTag/placeFilterTag/PlaceFilterTag';
import PublisherFilterTag from '../../../common/components/filterTag/publisherFilterTag/PublisherFilterTag';
import { FilterType } from '../../../types';
import {
  getEventSearchInitialValues,
  replaceParamsToEventQueryString,
} from '../utils';
import styles from './filterSummary.module.scss';

interface Props {
  className?: string;
}

const FilterSummary: React.FC<Props> = ({ className }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const { end, eventStatus, places, publisher, start, text, types } =
    getEventSearchInitialValues(search);

  const clearFilters = () => {
    navigate({
      pathname,
      search: replaceParamsToEventQueryString(search, {
        end: null,
        eventStatus: [],
        place: [],
        publisher: [],
        start: null,
        text: '',
        type: [],
      }),
    });
  };

  const filters = React.useMemo(() => {
    const removeFilter = ({
      value,
      type,
    }: {
      value: string;
      type: FilterType;
    }) => {
      const newSearch = replaceParamsToEventQueryString(search, {
        end: type === 'date' ? null : end,
        eventStatus:
          type === 'eventStatus'
            ? eventStatus.filter((item) => item !== value)
            : eventStatus,
        type:
          type === 'eventType' ? types.filter((item) => item !== value) : types,
        place:
          type === 'place' ? places.filter((item) => item !== value) : places,
        publisher:
          type === 'publisher'
            ? publisher.filter((item) => item !== value)
            : publisher,
        start: type === 'date' ? null : start,
        text: type === 'text' ? '' : text,
      });

      navigate({ pathname, search: newSearch });
    };

    const filters: React.ReactElement[] = [];

    if (text) {
      filters.push(
        <FilterTag
          text={text}
          onDelete={removeFilter}
          type="text"
          value={text}
        />
      );
    }
    if (end || start) {
      filters.push(
        <DateFilterTag end={end} onDelete={removeFilter} start={start} />
      );
    }
    filters.push(
      ...places.map((place) => (
        <PlaceFilterTag key={place} onDelete={removeFilter} value={place} />
      )),
      ...eventStatus.map((status) => (
        <EventStatusFilterTag
          key={status}
          onDelete={removeFilter}
          value={status}
        />
      )),
      ...types.map((type) => (
        <EventTypeFilterTag key={type} onDelete={removeFilter} value={type} />
      )),
      ...publisher.map((org) => (
        <PublisherFilterTag key={org} onDelete={removeFilter} value={org} />
      ))
    );

    return filters;
  }, [
    end,
    eventStatus,
    navigate,
    pathname,
    places,
    publisher,
    search,
    start,
    text,
    types,
  ]);

  if (!filters.length) return null;

  return (
    <div className={classNames(styles.filterSummary, className)}>
      {React.Children.map(filters, (filter) =>
        cloneElement(filter, { ...filter.props })
      )}
      <button
        className={styles.clearButton}
        onClick={clearFilters}
        type="button"
      >
        {t('eventSearchPage.buttonClearFilters')}
      </button>
    </div>
  );
};

export default FilterSummary;
