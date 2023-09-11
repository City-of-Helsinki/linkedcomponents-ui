import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import { SearchRow } from '../../../common/components/searchPanel/SearchPanel';
import useSearchState from '../../../hooks/useSearchState';
import { replaceParamsToRegistrationQueryString } from '../../registrations/utils';
import { getSignupSearchInitialValues } from '../utils';
import styles from './searchPanel.module.scss';

type SearchState = {
  signupText: string;
};

const SearchPanel: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchState, setSearchState] = useSearchState<SearchState>({
    signupText: '',
  });

  const handleChangeText = (text: string) => {
    setSearchState({ signupText: text });
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
    const { signupText } = getSignupSearchInitialValues(location.search);
    setSearchState({ signupText });
  }, [location.search, setSearchState]);

  return (
    <div className={classNames(styles.searchPanel)}>
      <SearchRow
        onSearch={handleSearch}
        onSearchValueChange={handleChangeText}
        searchButtonAriaLabel={t('signupsPage.searchPanel.buttonSearch')}
        searchButtonText={t('signupsPage.searchPanel.buttonSearch')}
        searchInputClassName={styles.searchInput}
        searchInputLabel={t('signupsPage.searchPanel.labelSearch')}
        searchInputPlaceholder={t('signupsPage.searchPanel.placeholderSearch')}
        searchInputValue={searchState.signupText}
      />
    </div>
  );
};

export default SearchPanel;
