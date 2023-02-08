import { IconArrowLeft } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import Button from '../../../common/components/button/Button';
import ErrorTemplate from '../../../common/components/errorTemplate/ErrorTemplate';
import LoadingSpinner from '../../../common/components/loadingSpinner/LoadingSpinner';
import { ROUTES } from '../../../constants';
import useLocale from '../../../hooks/useLocale';
import getValue from '../../../utils/getValue';
import MainContent from '../../app/layout/mainContent/MainContent';
import PageWrapper from '../../app/layout/pageWrapper/PageWrapper';
import { useAuth } from '../hooks/useAuth';
import styles from './logoutPage.module.scss';

const LogoutPage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { t } = useTranslation();
  const locale = useLocale();
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const goToHome = () => {
    navigate(`/${locale}${ROUTES.HOME}`);
  };

  const handleSignIn = () => {
    signIn(`/${locale}${ROUTES.HOME}`);
  };

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(`/${locale}${ROUTES.HOME}`, { replace: true });
    }
  }, [isAuthenticated, locale, navigate]);

  // Show loading spinner while checking if user is authenticated. This is useful when user manually opens logout page
  if (isLoading) {
    return (
      <LoadingSpinner className={styles.loadingSpinner} isLoading={isLoading} />
    );
  }

  return (
    <PageWrapper title={getValue(t('logoutPage.pageTitle'), '')}>
      <MainContent>
        <ErrorTemplate
          buttons={
            <div className={styles.buttons}>
              <Button
                fullWidth={true}
                iconLeft={<IconArrowLeft />}
                onClick={goToHome}
                type="button"
                variant="secondary"
              >
                {t('logoutPage.buttonBackToHome')}
              </Button>
              <Button
                fullWidth={true}
                onClick={handleSignIn}
                type="button"
                variant="primary"
              >
                {t('common.signIn')}
              </Button>
            </div>
          }
          text={t('logoutPage.text')}
        />
      </MainContent>
    </PageWrapper>
  );
};

export default LogoutPage;
