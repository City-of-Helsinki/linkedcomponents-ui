import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';

import DateFilterTag from '../../../common/components/filterTag/DateFilterTag';
import EventTypeFilterTag from '../../../common/components/filterTag/EventTypeFilterTag';
import FilterTag from '../../../common/components/filterTag/FilterTag';
import PlaceFilterTag from '../../../common/components/filterTag/PlaceFilterTag';
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
  const history = useHistory();
  const { pathname, search } = useLocation();
  const { end, places, start, text, types } =
    getEventSearchInitialValues(search);

  const clearFilters = () => {
    history.push({
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

    history.push({ pathname, search: newSearch });
  };

  const hasFilters = Boolean(
    end || places.length || start || text || types.length
  );

  if (!hasFilters) return null;

  return (
    <div className={classNames(styles.filterSummary, className)}>
      {text && (
        <FilterTag
          text={text}
          onDelete={removeFilter}
          type="text"
          value={text}
        />
      )}
      {(end || start) && (
        <DateFilterTag end={end} onDelete={removeFilter} start={start} />
      )}
      {places.map((place) => {
        return (
          <PlaceFilterTag key={place} onDelete={removeFilter} value={place} />
        );
      })}
      {types.map((type) => {
        return (
          <EventTypeFilterTag key={type} onDelete={removeFilter} value={type} />
        );
      })}

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
