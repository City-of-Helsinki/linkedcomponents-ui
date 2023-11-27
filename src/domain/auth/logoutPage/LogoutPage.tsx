import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import ErrorPage from '../../../common/components/errorPage/ErrorPage';
import LoadingSpinner from '../../../common/components/loadingSpinner/LoadingSpinner';
import { ROUTES } from '../../../constants';
import useLocale from '../../../hooks/useLocale';
import PageWrapper from '../../app/layout/pageWrapper/PageWrapper';
import { useAuth } from '../hooks/useAuth';
import styles from './logoutPage.module.scss';

const LogoutPage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { t } = useTranslation();
  const locale = useLocale();
  const navigate = useNavigate();

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
    <PageWrapper title={t('logoutPage.pageTitle')}>
      <ErrorPage
        homePageButtonText={t('logoutPage.buttonBackToHome')}
        signInPath={`/${locale}${ROUTES.HOME}`}
        text={t('logoutPage.text')}
      />
    </PageWrapper>
  );
};

export default LogoutPage;
