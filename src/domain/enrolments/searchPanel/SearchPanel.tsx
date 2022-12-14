import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import Button from '../../../common/components/button/Button';
import SearchInput from '../../../common/components/searchInput/SearchInput';
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
      <div className={styles.inputRow}>
        <div className={styles.searchInputWrapper}>
          <SearchInput
            className={styles.searchInput}
            hideLabel
            label={t('enrolmentsPage.searchPanel.labelSearch')}
            onChange={handleChangeText}
            onSubmit={handleSearch}
            placeholder={
              t('enrolmentsPage.searchPanel.placeholderSearch') as string
            }
            searchButtonAriaLabel={
              t('enrolmentsPage.searchPanel.buttonSearch') as string
            }
            value={searchState.enrolmentText}
          />
        </div>
        <div className={styles.buttonWrapper}>
          <Button
            className={styles.button}
            fullWidth={true}
            onClick={handleSearch}
            variant="secondary"
          >
            {t('enrolmentsPage.searchPanel.buttonSearch')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchPanel;
