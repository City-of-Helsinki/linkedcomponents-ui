import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';

import ErrorPage from '../../common/components/errorPage/ErrorPage';
import PageWrapper from '../app/layout/pageWrapper/PageWrapper';

interface Props {
  pathAfterSignIn?: string;
}

const NotFoundPage: React.FC<Props> = ({ pathAfterSignIn }) => {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <PageWrapper title={t('notFound.pageTitle')}>
      <ErrorPage
        signInPath={pathAfterSignIn ?? `${location.pathname}${location.search}`}
        text={t('notFound.text')}
      />
    </PageWrapper>
  );
};

export default NotFoundPage;
