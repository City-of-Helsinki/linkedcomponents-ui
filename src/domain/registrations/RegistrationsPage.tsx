/* eslint-disable max-len */
import { Button, ButtonVariant, IconPlus } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import Breadcrumb from '../../common/components/breadcrumb/Breadcrumb';
import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { ROUTES } from '../../constants';
import { UserFieldsFragment } from '../../generated/graphql';
import useLocale from '../../hooks/useLocale';
import Container from '../app/layout/container/Container';
import MainContent from '../app/layout/mainContent/MainContent';
import PageWrapper from '../app/layout/pageWrapper/PageWrapper';
import TitleRow from '../app/layout/titleRow/TitleRow';
import useAuth from '../auth/hooks/useAuth';
import NotSigned from '../notSigned/NotSigned';
import { getRegistrationActionButtonProps } from '../registration/permissions';
import { clearRegistrationFormData } from '../registration/utils';
import useUser from '../user/hooks/useUser';
import { REGISTRATION_ACTIONS } from './constants';
import FilterSummary from './filterSummary/FilterSummary';
import RegistrationList from './registrationList/RegistrationList';
import styles from './registrations.module.scss';
import SearchPanel from './searchPanel/SearchPanel';

interface Props {
  user: UserFieldsFragment;
}

const RegistrationsPage: React.FC<Props> = ({ user }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const locale = useLocale();

  const { authenticated } = useAuth();

  const goToCreateRegistrationPage = () => {
    clearRegistrationFormData();
    navigate(`/${locale}${ROUTES.CREATE_REGISTRATION}`);
  };

  const buttonProps = getRegistrationActionButtonProps({
    action: REGISTRATION_ACTIONS.CREATE,
    authenticated,
    onClick: goToCreateRegistrationPage,
    organizationAncestors: [],
    t,
    user,
  });

  return (
    <div className={styles.registrationsPage}>
      <Container withOffset={true}>
        <TitleRow
          breadcrumb={
            <Breadcrumb
              list={[
                { title: t('common.home'), path: ROUTES.HOME },
                { title: t('registrationsPage.title'), path: null },
              ]}
            />
          }
          button={
            <Button
              {...buttonProps}
              fullWidth={true}
              iconStart={<IconPlus aria-hidden={true} />}
              variant={ButtonVariant.Primary}
            >
              {t('common.buttonAddRegistration')}
            </Button>
          }
          title={t('registrationsPage.title')}
        />

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
      description="registrationsPage.pageDescription"
      keywords={['keywords.registration', 'keywords.listing', 'keywords.edit']}
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
