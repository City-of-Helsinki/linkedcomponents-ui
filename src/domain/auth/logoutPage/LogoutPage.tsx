import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import ErrorPage from '../../../common/components/errorPage/ErrorPage';
import { ROUTES } from '../../../constants';
import useLocale from '../../../hooks/useLocale';
import PageWrapper from '../../app/layout/pageWrapper/PageWrapper';
import useAuth from '../hooks/useAuth';

const LogoutPage: React.FC = () => {
  const { authenticated } = useAuth();
  const { t } = useTranslation();
  const locale = useLocale();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (authenticated) {
      navigate(`/${locale}${ROUTES.HOME}`, { replace: true });
    }
  }, [authenticated, locale, navigate]);

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
