import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import { SearchRow } from '../../../common/components/searchPanel/SearchPanel';
import useSearchState from '../../../hooks/useSearchState';
import { replaceParamsToRegistrationQueryString } from '../../registrations/utils';
import { getEnrolmentSearchInitialValues } from '../utils';
import styles from './searchPanel.module.scss';

type SearchState = {
  enrolmentText: string;
};

const SearchPanel: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchState, setSearchState] = useSearchState<SearchState>({
    enrolmentText: '',
  });

  const handleChangeText = (text: string) => {
    setSearchState({ enrolmentText: text });
  };

  const handleSearch = () => {
    navigate({
      pathname: location.pathname,
      search: replaceParamsToRegistrationQueryString(location.search, {
        ...searchState,
        attendeePage: null,
        waitingPage: null,
      }),
    });
  };

  React.useEffect(() => {
    const { enrolmentText } = getEnrolmentSearchInitialValues(location.search);
    setSearchState({ enrolmentText });
  }, [location.search, setSearchState]);

  return (
    <div className={classNames(styles.searchPanel)}>
      <SearchRow
        onSearch={handleSearch}
        onSearchValueChange={handleChangeText}
        searchButtonAriaLabel={t('enrolmentsPage.searchPanel.buttonSearch')}
        searchButtonText={t('enrolmentsPage.searchPanel.buttonSearch')}
        searchInputClassName={styles.searchInput}
        searchInputLabel={t('enrolmentsPage.searchPanel.labelSearch')}
        searchInputPlaceholder={t(
          'enrolmentsPage.searchPanel.placeholderSearch'
        )}
        searchInputValue={searchState.enrolmentText}
      />
    </div>
  );
};

export default SearchPanel;
