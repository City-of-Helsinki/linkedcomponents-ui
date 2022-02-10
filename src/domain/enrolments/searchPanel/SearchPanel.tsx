import classNames from 'classnames';
import { IconPlus } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';

import Button from '../../../common/components/button/Button';
import SearchInput from '../../../common/components/searchInput/SearchInput';
import { ROUTES } from '../../../constants';
import { RegistrationFieldsFragment } from '../../../generated/graphql';
import useSearchState from '../../../hooks/useSearchState';
import { authenticatedSelector } from '../../auth/selectors';
import { ENROLMENT_ACTIONS } from '../../enrolment/constants';
import { getEditButtonProps } from '../../enrolment/utils';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
import useRegistrationPublisher from '../../registration/hooks/useRegistrationPublisher';
// eslint-disable-next-line max-len
import useRegistrationsQueryStringWithReturnPath from '../../registrations/hooks/useRegistrationsQueryStringWithReturnPath';
import { replaceParamsToRegistrationQueryString } from '../../registrations/utils';
import useUser from '../../user/hooks/useUser';
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
  const history = useHistory();
  const location = useLocation();
  const authenticated = useSelector(authenticatedSelector);
  const publisher = useRegistrationPublisher({ registration }) as string;
  const { organizationAncestors } = useOrganizationAncestors(publisher);
  const { user } = useUser();

  const [searchState, setSearchState] = useSearchState<SearchState>({
    enrolmentText: '',
  });

  const queryStringWithReturnPath = useRegistrationsQueryStringWithReturnPath();

  const handleChangeText = (text: string) => {
    setSearchState({ enrolmentText: text });
  };

  const handleSearch = () => {
    history.push({
      pathname: location.pathname,
      search: replaceParamsToRegistrationQueryString(location.search, {
        ...searchState,
        attendeePage: null,
        waitingPage: null,
      }),
    });
  };

  const handleCreate = () => {
    history.push({
      pathname: ROUTES.CREATE_ENROLMENT.replace(
        ':registrationId',
        registration.id as string
      ),
      search: queryStringWithReturnPath,
    });
  };

  React.useEffect(() => {
    const { enrolmentText } = getEnrolmentSearchInitialValues(location.search);
    setSearchState({ enrolmentText });
  }, [location.search, setSearchState]);

  const buttonProps = getEditButtonProps({
    action: ENROLMENT_ACTIONS.CREATE,
    authenticated,
    onClick: handleCreate,
    organizationAncestors,
    publisher,
    t,
    user,
  });

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
            variant="primary"
          >
            {t('enrolmentsPage.searchPanel.buttonSearch')}
          </Button>
        </div>
        <div className={styles.buttonWrapper}>
          <Button
            {...buttonProps}
            className={styles.button}
            fullWidth={true}
            iconLeft={<IconPlus aria-hidden={true} />}
            variant="secondary"
          >
            {t('enrolmentsPage.searchPanel.buttonCreate')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchPanel;
