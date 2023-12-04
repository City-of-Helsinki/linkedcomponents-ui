import React from 'react';
import { useTranslation } from 'react-i18next';

import ErrorPage from '../../common/components/errorPage/ErrorPage';
import { ROUTES } from '../../constants';
import useLocale from '../../hooks/useLocale';
import PageWrapper from '../app/layout/pageWrapper/PageWrapper';

interface Props {
  pathAfterSignIn?: string;
}

const NotFoundPage: React.FC<Props> = ({ pathAfterSignIn }) => {
  const { t } = useTranslation();
  const locale = useLocale();

  return (
    <PageWrapper title={t('notFound.pageTitle')}>
      <ErrorPage
        signInPath={pathAfterSignIn ?? `/${locale}${ROUTES.HOME}`}
        text={t('notFound.text')}
      />
    </PageWrapper>
  );
};

export default NotFoundPage;
