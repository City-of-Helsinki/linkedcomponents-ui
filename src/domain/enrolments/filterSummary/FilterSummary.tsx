import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import FilterTag from '../../../common/components/filterTag/FilterTag';
import { replaceParamsToRegistrationQueryString } from '../../registrations/utils';
import { getEnrolmentSearchInitialValues } from '../utils';

interface Props {
  className?: string;
}

const FilterSummary: React.FC<Props> = ({ className }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const { enrolmentText: text } = getEnrolmentSearchInitialValues(search);

  const clearFilters = () => {
    navigate({
      pathname,
      search: replaceParamsToRegistrationQueryString(search, {
        enrolmentText: '',
        attendeePage: null,
        waitingPage: null,
      }),
    });
  };

  const removeTextFilter = () => clearFilters();

  const hasFilters = Boolean(text);

  if (!hasFilters) return null;

  return (
    <div className={classNames(className)}>
      {text && (
        <FilterTag
          text={text}
          onDelete={removeTextFilter}
          type="text"
          value={text}
        />
      )}

      <button onClick={clearFilters} type="button">
        {t('enrolmentsPage.buttonClearFilters')}
      </button>
    </div>
  );
};

export default FilterSummary;
