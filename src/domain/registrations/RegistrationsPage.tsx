import { Button, IconPlus } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { ROUTES } from '../../constants';
import { UserFieldsFragment } from '../../generated/graphql';
import useLocale from '../../hooks/useLocale';
import Container from '../app/layout/Container';
import MainContent from '../app/layout/MainContent';
import PageWrapper from '../app/layout/PageWrapper';
import NotSigned from '../notSigned/NotSigned';
import { clearRegistrationFormData } from '../registration/utils';
import useUser from '../user/hooks/useUser';
import FilterSummary from './filterSummary/FilterSummary';
import RegistrationList from './registrationList/RegistrationList';
import styles from './registrations.module.scss';
import SearchPanel from './searchPanel/SearchPanel';

interface Props {
  user: UserFieldsFragment;
}

const RegistrationsPage: React.FC<Props> = ({ user }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const locale = useLocale();

  const goToCreateRegistrationPage = () => {
    clearRegistrationFormData();
    history.push(`/${locale}${ROUTES.CREATE_REGISTRATION}`);
  };

  return (
    <div className={styles.registrationsPage}>
      <Container withOffset={true}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{t('registrationsPage.title')}</h1>
          <div className={styles.addButtonWrapper}>
            <Button
              className={styles.addButton}
              fullWidth={true}
              iconLeft={<IconPlus />}
              onClick={goToCreateRegistrationPage}
              variant="secondary"
            >
              {t('common.buttonAddRegistration')}
            </Button>
          </div>
        </div>

        <SearchPanel />
        <FilterSummary className={styles.filterSummary} />
      </Container>
      <RegistrationList />
    </div>
  );
};

const RegistrationsPageWrapper: React.FC = () => {
  const { loading: loadingUser, user } = useUser();

  return (
    <PageWrapper
      backgroundColor={user ? 'gray' : 'white'}
      title="registrationsPage.pageTitle"
    >
      <MainContent>
        <LoadingSpinner isLoading={loadingUser}>
          {user ? <RegistrationsPage user={user} /> : <NotSigned />}
        </LoadingSpinner>
      </MainContent>
    </PageWrapper>
  );
};

export default RegistrationsPageWrapper;
