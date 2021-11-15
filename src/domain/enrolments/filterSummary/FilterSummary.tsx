import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';

import FilterTag from '../../../common/components/filterTag/FilterTag';
import { replaceParamsToRegistrationQueryString } from '../../registrations/utils';
import { getEnrolmentSearchInitialValues } from '../utils';
import styles from './filterSummary.module.scss';

interface Props {
  className?: string;
}

const FilterSummary: React.FC<Props> = ({ className }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { pathname, search } = useLocation();
  const { enrolmentText: text } = getEnrolmentSearchInitialValues(search);

  const clearFilters = () => {
    history.push({
      pathname,
      search: replaceParamsToRegistrationQueryString(search, {
        enrolmentText: '',
      }),
    });
  };

  const removeTextFilter = () => {
    const newSearch = replaceParamsToRegistrationQueryString(search, {
      enrolmentText: '',
    });

    history.push({ pathname, search: newSearch });
  };

  const hasFilters = Boolean(text);

  if (!hasFilters) return null;

  return (
    <div className={classNames(styles.filterSummary, className)}>
      {text && (
        <FilterTag
          text={text}
          onDelete={removeTextFilter}
          type="text"
          value={text}
        />
      )}

      <button
        className={styles.clearButton}
        onClick={clearFilters}
        type="button"
      >
        {t('enrolmentsPage.buttonClearFilters')}
      </button>
    </div>
  );
};

export default FilterSummary;
