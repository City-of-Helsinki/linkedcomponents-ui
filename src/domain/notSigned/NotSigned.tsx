import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';

import ErrorPage from '../../common/components/errorPage/ErrorPage';
import MainContent from '../app/layout/mainContent/MainContent';

const NotSignedPage: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <MainContent>
      <ErrorPage
        signInPath={`${location.pathname}${location.search}`}
        text={t('notSigned.text')}
      />
    </MainContent>
  );
};

export default NotSignedPage;
