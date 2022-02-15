import { IconArrowLeft } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router';

import Button from '../../common/components/button/Button';
import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { ROUTES } from '../../constants';
import { useRegistrationQuery } from '../../generated/graphql';
import useLocale from '../../hooks/useLocale';
import getPathBuilder from '../../utils/getPathBuilder';
import Container from '../app/layout/Container';
import MainContent from '../app/layout/MainContent';
import PageWrapper from '../app/layout/PageWrapper';
import NotFound from '../notFound/NotFound';
import { REGISTRATION_INCLUDES } from '../registration/constants';
import {
  clearRegistrationFormData,
  registrationPathBuilder,
} from '../registration/utils';
import useUser from '../user/hooks/useUser';
import styles from './registrationSavedPage.module.scss';

const RegistrationSavedPage: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const locale = useLocale();

  const goToRegistrations = () => {
    history.push(`/${locale}${ROUTES.REGISTRATIONS}`);
  };

  const goToCreateRegistration = () => {
    clearRegistrationFormData();
    history.push(`/${locale}${ROUTES.CREATE_REGISTRATION}`);
  };

  return (
    <PageWrapper title={t('registrationSavedPage.pageTitle')}>
      <Container withOffset={true}>
        <h1>{t('registrationSavedPage.title')}</h1>

        <div className={styles.buttonPanel}>
          <Button
            onClick={goToRegistrations}
            iconLeft={<IconArrowLeft />}
            variant="secondary"
          >
            {t('registrationSavedPage.buttonBackToRegistrations')}
          </Button>
          <Button onClick={goToCreateRegistration} variant="primary">
            {t('common.buttonAddRegistration')}
          </Button>
        </div>
      </Container>
    </PageWrapper>
  );
};

const RegistrationSavedPageWrapper: React.FC = () => {
  const { id: registrationId } = useParams<{ id: string }>();
  const { loading: loadingUser, user } = useUser();

  const { data: registrationData, loading } = useRegistrationQuery({
    skip: !registrationId || !user,
    variables: {
      id: registrationId,
      include: REGISTRATION_INCLUDES,
      createPath: getPathBuilder(registrationPathBuilder),
    },
  });

  return (
    <MainContent>
      <LoadingSpinner isLoading={loadingUser || loading}>
        {registrationData ? <RegistrationSavedPage /> : <NotFound />}
      </LoadingSpinner>
    </MainContent>
  );
};

export default RegistrationSavedPageWrapper;
