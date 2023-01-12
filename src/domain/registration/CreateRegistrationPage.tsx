import React from 'react';
import { useTranslation } from 'react-i18next';

import Breadcrumb from '../../common/components/breadcrumb/Breadcrumb';
import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { ROUTES } from '../../constants';
import Container from '../app/layout/container/Container';
import MainContent from '../app/layout/mainContent/MainContent';
import PageWrapper from '../app/layout/pageWrapper/PageWrapper';
import useUser from '../user/hooks/useUser';
import RegistrationForm from './registrationForm/RegistrationForm';
import styles from './registrationPage.module.scss';

const CreateRegistrationPage: React.FC = () => {
  const { t } = useTranslation();
  const { loading: loadingUser } = useUser();

  return (
    <PageWrapper
      className={styles.registrationPage}
      title={`createRegistrationPage.pageTitle`}
    >
      <LoadingSpinner isLoading={loadingUser}>
        <MainContent>
          <Container className={styles.createContainer} withOffset={true}>
            <Breadcrumb
              className={styles.breadcrumb}
              items={[
                { label: t('common.home'), to: ROUTES.HOME },
                {
                  label: t('registrationsPage.title'),
                  to: ROUTES.REGISTRATIONS,
                },
                {
                  active: true,
                  label: t(`createRegistrationPage.title`),
                },
              ]}
            />
            <RegistrationForm />
          </Container>
        </MainContent>
      </LoadingSpinner>
    </PageWrapper>
  );
};

export default CreateRegistrationPage;
