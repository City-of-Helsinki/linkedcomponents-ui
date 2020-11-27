import { IconArrowLeft } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Redirect, useHistory } from 'react-router';

import Button from '../../../common/components/button/Button';
import ErrorTemplate from '../../../common/components/errorTemplate/ErrorTemplate';
import LoadingSpinner from '../../../common/components/loadingSpinner/LoadingSpinner';
import { ROUTES } from '../../../constants';
import useLocale from '../../../hooks/useLocale';
import PageWrapper from '../../app/layout/PageWrapper';
import { signIn } from '../authenticate';
import { authenticatedSelector, loadingSelector } from '../selectors';
import styles from './logoutPage.module.scss';

const LogoutPage = () => {
  const authenticated = useSelector(authenticatedSelector);
  const loading = useSelector(loadingSelector);
  const { t } = useTranslation();
  const locale = useLocale();
  const history = useHistory();

  const goToHome = () => {
    history.push(`/${locale}${ROUTES.HOME}`);
  };

  const handleSignIn = () => {
    signIn(`/${locale}${ROUTES.HOME}`);
  };

  // Show loading spinner while checking if user is authenticated. This is useful when user manually opens logout page
  if (loading) {
    return (
      <LoadingSpinner className={styles.loadingSpinner} isLoading={loading} />
    );
  }

  // Redirect user to home page if user is authenticated
  if (authenticated) {
    return <Redirect to={`/${locale}${ROUTES.HOME}`} />;
  }

  return (
    <PageWrapper title={t('logoutPage.pageTitle')}>
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
              {t('logoutPage.buttonGoToHome')}
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
    </PageWrapper>
  );
};

export default LogoutPage;
