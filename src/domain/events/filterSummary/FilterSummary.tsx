import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import DateFilterTag from '../../../common/components/filterTag/dateFilterTag/DateFilterTag';
import EventTypeFilterTag from '../../../common/components/filterTag/evenTypeFilterTag/EventTypeFilterTag';
import FilterTag from '../../../common/components/filterTag/FilterTag';
import PlaceFilterTag from '../../../common/components/filterTag/placeFilterTag/PlaceFilterTag';
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
  const { end, places, start, text, types } =
    getEventSearchInitialValues(search);

  const clearFilters = () => {
    navigate({
      pathname,
      search: replaceParamsToEventQueryString(search, {
        end: null,
        place: [],
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
        type:
          type === 'eventType' ? types.filter((item) => item !== value) : types,
        place:
          type === 'place' ? places.filter((item) => item !== value) : places,
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
      ))
    );
    filters.push(
      ...types.map((type) => (
        <EventTypeFilterTag key={type} onDelete={removeFilter} value={type} />
      ))
    );

    return filters;
  }, [end, navigate, pathname, places, search, start, text, types]);

  if (!filters.length) return null;

  return (
    <div className={classNames(styles.filterSummary, className)}>
      {filters.map((filter) => filter)}
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
