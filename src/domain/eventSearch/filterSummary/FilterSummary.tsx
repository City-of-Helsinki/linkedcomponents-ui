import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';

import { EventFilterType } from '../types';
import { getEventSearchInitialValues, getEventSearchQuery } from '../utils';
import DateFilterTag from './DateFilterTag';
import EventTypeFilterTag from './EventTypeFilterTag';
import styles from './filterSummary.module.scss';
import FilterTag from './FilterTag';
import PlaceFilterTag from './PlaceFilterTag';

interface Props {
  className?: string;
}

const FilterSummary: React.FC<Props> = ({ className }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { pathname, search } = useLocation();
  const { end, places, start, text, types } = getEventSearchInitialValues(
    search
  );

  const clearFilters = () => {
    history.push(pathname);
  };

  const removeFilter = ({
    value,
    type,
  }: {
    value: string;
    type: EventFilterType;
  }) => {
    const search = getEventSearchQuery({
      end: type === 'date' ? null : end,
      place:
        type === 'place' ? places.filter((item) => item !== value) : places,
      start: type === 'date' ? null : start,
      text: type === 'text' ? '' : text,
      type: type === 'type' ? types.filter((item) => item !== value) : types,
    });

    history.push({ pathname, search });
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
