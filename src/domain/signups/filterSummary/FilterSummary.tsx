import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import FilterTag from '../../../common/components/filterTag/FilterTag';
import { replaceParamsToRegistrationQueryString } from '../../registrations/utils';
import { getSignupSearchInitialValues } from '../utils';
import styles from './filterSummary.module.scss';

interface Props {
  className?: string;
}

const FilterSummary: React.FC<Props> = ({ className }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const { signupText: text } = getSignupSearchInitialValues(search);

  const clearFilters = () => {
    navigate({
      pathname,
      search: replaceParamsToRegistrationQueryString(search, {
        attendeePage: null,
        signupText: '',
        waitingPage: null,
      }),
    });
  };

  const removeTextFilter = () => clearFilters();

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
        {t('signupsPage.buttonClearFilters')}
      </button>
    </div>
  );
};

export default FilterSummary;
