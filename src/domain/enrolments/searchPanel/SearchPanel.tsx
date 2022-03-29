import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import Button from '../../../common/components/button/Button';
import SearchInput from '../../../common/components/searchInput/SearchInput';
import { RegistrationFieldsFragment } from '../../../generated/graphql';
import useSearchState from '../../../hooks/useSearchState';
import { replaceParamsToRegistrationQueryString } from '../../registrations/utils';
import { getEnrolmentSearchInitialValues } from '../utils';
import styles from './searchPanel.module.scss';

type Props = {
  registration: RegistrationFieldsFragment;
};

type SearchState = {
  enrolmentText: string;
};

const SearchPanel: React.FC<Props> = ({ registration }) => {
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
            hideLabel={true}
            label={t('enrolmentsPage.searchPanel.labelSearch')}
            onSearch={handleSearch}
            placeholder={t('enrolmentsPage.searchPanel.placeholderSearch')}
            searchButtonAriaLabel={t('enrolmentsPage.searchPanel.buttonSearch')}
            setValue={handleChangeText}
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
